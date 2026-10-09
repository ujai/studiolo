#!/usr/bin/env python3
"""
Sync the repo's Anki CSV decks into your Anki collection.

Every *.csv file in anki/ becomes an Anki deck named "Studiolo::<file name>"
(a file whose name contains "cloze" is treated as a cloze deck). Run it while
Anki desktop is CLOSED (it writes straight into the collection file):

    python3 import_anki.py                 # sync every deck
    python3 import_anki.py starter-deck   # sync only decks whose key matches (file name stem)
    python3 import_anki.py --dry-run       # show what would change, write nothing
    python3 import_anki.py --prune         # also delete notes that are no longer in the CSV
    python3 import_anki.py --list          # show deck keys

CSV format: a "#Front,Back,Tags" comment header, then rows. Cloze decks use
"#Text,Extra,Tags" and {{c1::...}} blanks. Lines starting with "#" are comments.

Sync rules, per deck:
- A CSV card whose front (or cloze text) already exists in the deck updates that note's back
  and adds the CSV tags. Your own tags (weak-topic, wrong-twice, ...) are kept. A note the
  script didn't create never gets the studiolo-managed tag, so pruning can't delete it.
- A CSV card that isn't in the deck yet is added.
- A note in the deck whose front isn't in the CSV any more (for example the old version of a
  card that was reworded) is only reported, unless you pass --prune. Pruning deletes its
  review history.
- Notes are never deleted based on their text. Pruning only removes script-managed notes,
  requires --confirm-prune, and creates a collection backup first.
- Optional column 4 is a stable ID. Keep it unchanged to preserve history when rewording.
- Dry runs open an isolated SQLite snapshot, not the original collection.
"""
import argparse
import csv
import os
import re
import sqlite3
import sys
import tempfile
import datetime as dt
from pathlib import Path
from urllib.parse import quote

REPO_DIR = Path(__file__).resolve().parent
CSV_DIR = REPO_DIR / "anki"
DECK_PREFIX = "Studiolo"
MANAGED_TAG = "studiolo-managed"
ID_PREFIX = "studiolo-id::"


def default_collection():
    """First existing Anki collection on this machine (Linux, macOS, Windows)."""
    home = Path.home()
    candidates = [
        home / ".local/share/Anki2/User 1/collection.anki2",
        home / "Library/Application Support/Anki2/User 1/collection.anki2",
        Path(os.environ.get("APPDATA", str(home))) / "Anki2/User 1/collection.anki2",
    ]
    for c in candidates:
        if c.exists():
            return c
    return candidates[0]  # not found: fall back for the error message


def discover_decks():
    """key: (Anki deck name, CSV path, note type), for every CSV in anki/."""
    decks = {}
    for path in sorted(CSV_DIR.glob("*.csv")):
        key = path.stem
        notetype = "Cloze" if "cloze" in key.lower() else "Basic"
        decks[key] = (f"{DECK_PREFIX}::{key}", path, notetype)
    return decks


def read_cards(csv_path):
    """Return (front, back, tags, optional stable ID); reject ambiguous CSVs."""
    cards = []
    fronts, ids = set(), set()
    with open(csv_path, newline="", encoding="utf-8-sig") as f:
        for row in csv.reader(f, strict=True):
            if not row or row[0].lstrip().startswith("#"):
                continue
            if not cards and [x.strip().lower() for x in row[:3]] in (
                ["front", "back", "tags"], ["text", "extra", "tags"]
            ):
                continue
            if not 2 <= len(row) <= 4:
                raise ValueError(f"{csv_path}: expected 2–4 columns, got {len(row)}.")
            row = (row + ["", "", ""])[:4]
            if not row[0].strip():
                continue
            front, back, tags, stable_id = row
            if front in fronts or (stable_id and stable_id in ids):
                raise ValueError(f"{csv_path}: duplicate front or stable ID.")
            if stable_id and not re.fullmatch(r"[A-Za-z0-9_-]+", stable_id):
                raise ValueError(f"{csv_path}: stable IDs use letters, digits, '-' and '_'.")
            if any(tag.startswith(ID_PREFIX) for tag in tags.split()):
                raise ValueError(f"{csv_path}: identity tags are reserved; use column 4.")
            fronts.add(front)
            if stable_id:
                ids.add(stable_id)
            cards.append((front, back, tags, stable_id))
    return cards


def plan_deck(col, deck_name, cards, notetype_name, prune):
    """Validate and calculate a complete plan without modifying any notes."""
    model = col.models.by_name(notetype_name)
    if not model or len(model.get("flds", [])) != 2:
        raise ValueError(f"Note type '{notetype_name}' must exist and have exactly two fields.")
    existing, by_id, all_notes = {}, {}, []
    for nid in col.find_notes(f'"deck:{deck_name}" -"deck:{deck_name}::*"'):
        note = col.get_note(nid)
        if note.mid != model["id"]:
            continue
        if len(note.fields) != 2 or note.fields[0] in existing:
            raise ValueError(f"{deck_name}: duplicate fronts or incompatible notes; resolve in Anki first.")
        existing[note.fields[0]] = note
        all_notes.append(note)
        identities = [t for t in note.tags if t.startswith(ID_PREFIX)]
        if len(identities) > 1:
            raise ValueError(f"{deck_name}: note has multiple stable IDs.")
        for identity in identities:
            if identity in by_id:
                raise ValueError(f"{deck_name}: duplicate stable IDs.")
            by_id[identity] = note
    additions, updates, matched = [], [], set()
    for front, back, tags, stable_id in cards:
        identity = ID_PREFIX + stable_id if stable_id else None
        note = by_id.get(identity) if identity else None
        front_note = existing.get(front)
        if note and front_note and note.id != front_note.id:
            raise ValueError(f"{deck_name}: stable ID and front match different notes.")
        note = note or front_note
        csv_tags = col.tags.split(tags) + [MANAGED_TAG] + ([identity] if identity else [])
        if note is None:
            additions.append((front, back, csv_tags))
            continue
        if note.id in matched:
            raise ValueError(f"{deck_name}: two rows match the same note.")
        if identity and any(t.startswith(ID_PREFIX) and t != identity for t in note.tags):
            raise ValueError(f"{deck_name}: stable ID changed for an existing note.")
        matched.add(note.id)
        if MANAGED_TAG not in note.tags:
            # Prune keys on this tag, so adopting a hand-made note must not confer it.
            csv_tags = [t for t in csv_tags if t != MANAGED_TAG]
        merged_tags = sorted(set(note.tags) | set(csv_tags), key=str.lower)
        if note.fields != [front, back] or sorted(note.tags, key=str.lower) != merged_tags:
            updates.append((note, front, back, merged_tags))
    stale = [n.id for n in all_notes if n.id not in matched and MANAGED_TAG in n.tags]
    return {"deck": deck_name, "model": model, "cards": len(cards), "additions": additions,
            "updates": updates, "stale": stale, "removed": stale if prune else []}


def apply_plan(col, plan):
    deck_id = col.decks.id(plan["deck"])
    for front, back, tags in plan["additions"]:
        note = col.new_note(plan["model"])
        note.fields[0], note.fields[1] = front, back
        note.tags = tags
        col.add_note(note, deck_id)
    notes = []
    for note, front, back, tags in plan["updates"]:
        note.fields[0], note.fields[1] = front, back
        note.tags = tags
        notes.append(note)
    if notes:
        col.update_notes(notes)
    if plan["removed"]:
        col.remove_notes(plan["removed"])


def sync_deck(col, deck_name, csv_path, notetype_name, dry_run, prune):
    plan = plan_deck(col, deck_name, read_cards(csv_path), notetype_name, prune)
    if not dry_run:
        apply_plan(col, plan)
    return {"cards": plan["cards"], "added": len(plan["additions"]),
            "updated": len(plan["updates"]), "headers": 0,
            "stale": len(plan["stale"]), "pruned": len(plan["removed"])}


def snapshot_collection(source, destination):
    """SQLite's backup API includes committed WAL data; copying the file alone does not."""
    with sqlite3.connect(f"file:{quote(str(source))}?mode=ro", uri=True) as original:
        with sqlite3.connect(str(destination)) as backup:
            original.backup(backup)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Sync the repo's Anki CSV decks into Anki.")
    parser.add_argument("decks", nargs="*", help="deck keys to sync (default: all). See --list.")
    parser.add_argument("--collection", default=os.environ.get("ANKI_COLLECTION", str(default_collection())),
                        help="path to collection.anki2 (or set ANKI_COLLECTION)")
    parser.add_argument("--dry-run", action="store_true", help="report changes without writing")
    parser.add_argument("--prune", action="store_true", help="delete notes that are no longer in the CSV")
    parser.add_argument("--confirm-prune", action="store_true", help="confirm deletion of managed notes and their review history")
    parser.add_argument("--list", action="store_true", help="list deck keys and exit")
    args = parser.parse_args(argv)
    if args.prune and not args.dry_run and not args.confirm_prune:
        parser.error("--prune deletes review history. Preview with --dry-run, then add --confirm-prune.")

    decks = discover_decks()
    if not decks:
        print(f"No CSV decks found in {CSV_DIR}. Add one first (see anki/README.md).")
        return 1

    if args.list:
        for key, (deck, csv_path, notetype) in decks.items():
            print(f"{key:24} {deck:34} {notetype:6} {csv_path.name}")
        return 0

    unknown = [d for d in args.decks if d not in decks]
    if unknown:
        parser.error(f"unknown deck key(s): {', '.join(unknown)}. Use --list.")
    keys = args.decks or list(decks)
    try:
        card_sets = {key: read_cards(decks[key][1]) for key in keys}
    except (OSError, ValueError, csv.Error) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1

    collection = Path(args.collection).expanduser()
    if not collection.exists():
        print(f"ERROR: collection not found: {collection}\nOpen Anki once, or pass --collection.")
        return 1

    try:
        from anki.collection import Collection
    except ImportError:
        print("ERROR: optional 'anki' Python package missing. Use Anki's File → Import instead,")
        print("or install a matching anki package in a virtual environment (see anki/README.md).")
        return 1

    print(f"{'DRY RUN: ' if args.dry_run else ''}Syncing {len(keys)} deck(s) into {collection}")
    try:
        with tempfile.TemporaryDirectory(prefix="studiolo-anki-") as tmp:
            snapshot = Path(tmp) / "collection.anki2"
            snapshot_collection(collection, snapshot)
            # Validation and dry runs use an isolated copy, never the real collection.
            preview = Collection(str(snapshot))
            try:
                plans = [plan_deck(preview, decks[k][0], card_sets[k], decks[k][2], args.prune) for k in keys]
                for plan in plans:
                    print(f"  {plan['deck']}: {len(plan['additions'])} added, "
                          f"{len(plan['updates'])} updated, {len(plan['stale'])} managed stale, "
                          f"{len(plan['removed'])} {'would delete' if args.dry_run else 'to delete'}")
            finally:
                preview.close()
            if args.dry_run:
                print("Dry run: original collection was not opened by Anki or modified.")
                return 0
            backup = collection.with_name(f"studiolo-backup-{dt.datetime.now().strftime('%Y%m%d-%H%M%S-%f')}.anki2")
            snapshot_collection(collection, backup)
            print(f"Collection backup: {backup}")
            col = Collection(str(collection))
            try:
                plans = [plan_deck(col, decks[k][0], card_sets[k], decks[k][2], args.prune) for k in keys]
                for plan in plans:
                    apply_plan(col, plan)
            finally:
                col.close()
    except Exception as e:
        print(f"ERROR: sync failed: {e}. Keep Anki closed and restore the backup if needed.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
