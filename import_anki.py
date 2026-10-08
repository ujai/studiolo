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
  and adds the CSV tags. Your own tags (weak-topic, wrong-twice, ...) are kept.
- A CSV card that isn't in the deck yet is added.
- A note in the deck whose front isn't in the CSV any more (for example the old version of a
  card that was reworded) is only reported, unless you pass --prune. Pruning deletes its
  review history.
- Stray header notes ("Front"/"Text" as the front), left by manual imports, are always removed.
"""
import argparse
import csv
import os
import sys
from pathlib import Path

REPO_DIR = Path(__file__).resolve().parent
CSV_DIR = REPO_DIR / "anki"
DECK_PREFIX = "Studiolo"
HEADER_FRONTS = {"front", "text"}


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
    """Return [(front, back, tags)], skipping '#' comment lines and plain header rows."""
    cards = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        for row in csv.reader(f):
            if not row or row[0].lstrip().startswith("#"):
                continue
            if row[0].strip().lower() in HEADER_FRONTS:
                continue
            row = (row + ["", "", ""])[:3]
            if row[0].strip():
                cards.append((row[0], row[1], row[2]))
    return cards


def sync_deck(col, deck_name, csv_path, notetype_name, dry_run, prune):
    model = col.models.by_name(notetype_name)
    if not model:
        print(f"  ERROR: note type '{notetype_name}' not found. Open Anki once to create the defaults.")
        return None

    cards = read_cards(csv_path)
    wanted = {front: (back, tags) for front, back, tags in cards}

    existing = {}
    stray_headers = []
    for nid in col.find_notes(f'"deck:{deck_name}" -"deck:{deck_name}::*"'):
        note = col.get_note(nid)
        front = note.fields[0]
        if front.strip().lower() in HEADER_FRONTS:
            stray_headers.append(nid)
        else:
            existing[front] = note

    added = updated = 0
    to_update = []
    deck_id = None if dry_run else col.decks.id(deck_name)
    for front, (back, tags) in wanted.items():
        csv_tags = col.tags.split(tags)
        note = existing.get(front)
        if note is None:
            added += 1
            if not dry_run:
                new = col.new_note(model)
                new.fields[0], new.fields[1] = front, back
                new.tags = csv_tags
                col.add_note(new, deck_id)
            continue
        merged_tags = sorted(set(note.tags) | set(csv_tags), key=str.lower)
        if note.fields[1] != back or sorted(note.tags, key=str.lower) != merged_tags:
            updated += 1
            note.fields[1] = back
            note.tags = merged_tags
            to_update.append(note)

    stale = [n.id for front, n in existing.items() if front not in wanted]
    removed = list(stray_headers) + (stale if prune else [])
    if not dry_run:
        if to_update:
            col.update_notes(to_update)
        if removed:
            col.remove_notes(removed)

    return {"cards": len(wanted), "added": added, "updated": updated,
            "headers": len(stray_headers), "stale": len(stale), "pruned": len(stale) if prune else 0}


def main(argv=None):
    parser = argparse.ArgumentParser(description="Sync the repo's Anki CSV decks into Anki.")
    parser.add_argument("decks", nargs="*", help="deck keys to sync (default: all). See --list.")
    parser.add_argument("--collection", default=os.environ.get("ANKI_COLLECTION", str(default_collection())),
                        help="path to collection.anki2 (or set ANKI_COLLECTION)")
    parser.add_argument("--dry-run", action="store_true", help="report changes without writing")
    parser.add_argument("--prune", action="store_true", help="delete notes that are no longer in the CSV")
    parser.add_argument("--list", action="store_true", help="list deck keys and exit")
    args = parser.parse_args(argv)

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

    collection = Path(args.collection).expanduser()
    if not collection.exists():
        print(f"ERROR: collection not found: {collection}\nOpen Anki once, or pass --collection.")
        return 1

    try:
        from anki.collection import Collection
    except ImportError:
        print("ERROR: the 'anki' Python package isn't installed (pip install anki, or install Anki desktop).")
        return 1

    print(f"{'DRY RUN: ' if args.dry_run else ''}Syncing {len(keys)} deck(s) into {collection}")
    col = Collection(str(collection))
    totals = {"added": 0, "updated": 0, "headers": 0, "stale": 0, "pruned": 0}
    try:
        for key in keys:
            deck_name, csv_path, notetype = decks[key]
            r = sync_deck(col, deck_name, csv_path, notetype, args.dry_run, args.prune)
            if r is None:
                continue
            for k in totals:
                totals[k] += r[k]
            gone = "to remove" if args.dry_run else "removed"
            stale_note = ""
            if r["stale"]:
                stale_note = f", {r['stale']} stale " + (gone if args.prune else "(not in CSV; use --prune)")
            header_note = f", {r['headers']} stray header note(s) {gone}" if r["headers"] else ""
            print(f"  {deck_name:34} {r['cards']:3} cards: {r['added']} added, {r['updated']} updated{stale_note}{header_note}")
    finally:
        col.close()

    gone = "to remove" if args.dry_run else "removed"
    print(f"\nTotal: {totals['added']} added, {totals['updated']} updated, "
          f"{totals['headers']} header notes {gone}, {totals['stale']} stale"
          + (f" ({totals['pruned']} {gone})" if args.prune else ""))
    if args.dry_run:
        print("Dry run: nothing was written.")
    elif totals["stale"] and not args.prune:
        print("Stale notes are old versions of cards that changed in the repo. Run with --prune to delete them.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
