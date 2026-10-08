import contextlib
import io
import sqlite3
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

import import_anki as a


class Note:
    def __init__(self, id, front, back="answer", tags=(), mid=1):
        self.id, self.mid = id, mid
        self.fields, self.tags = [front, back], list(tags)


class Collection:
    def __init__(self, notes=(), model=True):
        self.notes = list(notes)
        self.models = SimpleNamespace(by_name=lambda _: {"id": 1, "flds": [{}, {}]} if model else None)
        self.tags = SimpleNamespace(split=lambda text: text.split())
        self.decks = SimpleNamespace(id=lambda _: 1)
        self.added, self.updated, self.removed = [], [], []

    def find_notes(self, query):
        return [n.id for n in self.notes]

    def get_note(self, id):
        return next(n for n in self.notes if n.id == id)

    def new_note(self, model):
        return Note(99, "")

    def add_note(self, note, deck):
        self.added.append(note)

    def update_notes(self, notes):
        self.updated.extend(notes)

    def remove_notes(self, ids):
        self.removed.extend(ids)


class AnkiTests(unittest.TestCase):
    def csv(self, text):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        path = Path(tmp.name) / "deck.csv"
        path.write_text(text)
        return path

    def test_header_words_are_real_cards(self):
        cards = a.read_cards(self.csv("#Front,Back,Tags\nFront,Opposite of back,vocab\nText,Writing,vocab"))
        self.assertEqual([c[0] for c in cards], ["Front", "Text"])
        cards = a.read_cards(self.csv("Front,Back,Tags\nFront,Opposite of back,vocab"))
        self.assertEqual(cards[0][0], "Front")

    def test_reject_duplicate_and_malformed_cards(self):
        for text in ("a,b,t\n a,b,t,x,y", "a,b,t\na,c,t", "a,b,t,id\nb,c,t,id", "a,b,t,bad id"):
            with self.subTest(text=text), self.assertRaises(ValueError):
                a.read_cards(self.csv(text))

    def test_prune_preserves_unmanaged_and_other_models(self):
        col = Collection([Note(1, "Front"), Note(2, "Text"),
                          Note(3, "stale", tags=[a.MANAGED_TAG]), Note(4, "other", mid=2)])
        plan = a.plan_deck(col, "Studiolo::test", [], "Basic", True)
        self.assertEqual(plan["removed"], [3])
        self.assertEqual(col.removed, [])
        a.apply_plan(col, plan)
        self.assertEqual(col.removed, [3])

    def test_stable_id_rewording_updates_same_note(self):
        note = Note(7, "Old wording", tags=["my-tag", a.ID_PREFIX + "n1", a.MANAGED_TAG])
        col = Collection([note])
        plan = a.plan_deck(col, "deck", [("New wording", "new answer", "csv-tag", "n1")], "Basic", True)
        self.assertEqual(note.fields[0], "Old wording")
        self.assertEqual(plan["additions"], [])
        self.assertEqual(plan["removed"], [])
        a.apply_plan(col, plan)
        self.assertEqual(col.updated[0].id, 7)
        self.assertEqual(note.fields, ["New wording", "new answer"])
        self.assertIn("my-tag", note.tags)

    def test_planning_is_nonmutating_and_missing_model_fails(self):
        note = Note(1, "question")
        col = Collection([note])
        plan = a.plan_deck(col, "deck", [("question", "new", "tag", "")], "Basic", False)
        self.assertEqual(note.fields, ["question", "answer"])
        self.assertEqual(note.tags, [])
        self.assertEqual(len(plan["updates"]), 1)
        with self.assertRaises(ValueError):
            a.plan_deck(Collection(model=False), "deck", [], "Basic", False)

    def test_identity_conflicts_rejected(self):
        col = Collection([Note(1, "one", tags=[a.ID_PREFIX + "n1"]), Note(2, "two")])
        with self.assertRaises(ValueError):
            a.plan_deck(col, "deck", [("two", "answer", "", "n1")], "Basic", False)

    def test_prune_requires_explicit_confirmation(self):
        with contextlib.redirect_stderr(io.StringIO()), self.assertRaises(SystemExit) as result:
            a.main(["--prune"])
        self.assertEqual(result.exception.code, 2)

    def test_starter_deck_parses_into_three_columns(self):
        # An unquoted comma in a front shifts the tags into the stable-ID column.
        cards = a.read_cards(a.CSV_DIR / "starter-deck.csv")
        self.assertEqual(len(cards), 13)
        for front, back, tags, stable_id in cards:
            self.assertIn(tags, ("studyskills", "studiolo"), front)
            self.assertEqual(stable_id, "", front)

    def test_sqlite_snapshot_includes_wal_data(self):
        with tempfile.TemporaryDirectory() as tmp:
            source, dest = Path(tmp) / "original.db", Path(tmp) / "backup.db"
            with sqlite3.connect(source) as db:
                db.execute("PRAGMA journal_mode=WAL")
                db.execute("CREATE TABLE data(value TEXT)")
                db.execute("INSERT INTO data VALUES ('committed')")
                db.commit()
                a.snapshot_collection(source, dest)
                with sqlite3.connect(dest) as backup:
                    self.assertEqual(backup.execute("SELECT value FROM data").fetchone(), ("committed",))


if __name__ == "__main__":
    unittest.main()
