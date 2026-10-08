import contextlib
import datetime as dt
import io
import tempfile
import unittest
from pathlib import Path

import whats_due as q


def topic(id, level=0, deps=(), review=""):
    return {"id": id, "name": id, "level": level, "deps": list(deps),
            "last_tested": "", "next_review": review, "reviews": 0}


class QueueTests(unittest.TestCase):
    def test_escaped_pipes_and_backslashes(self):
        self.assertEqual(q.cells(r"| a | \|x\| | c |"), ["a", "|x|", "c"])
        self.assertEqual(q.cells(r"| a | x\\ | c |"), ["a", "x\\\\", "c"])

    def test_map_section_only_and_legacy_rows(self):
        text = "## Map\n| 2.1 | \\|x\\| | — | gap | task | 0 | | |\n## Other\n| 3.1 | fake | — | | | 5 | | |"
        parsed = q.parse_map(text)
        self.assertEqual(len(parsed), 1)
        self.assertEqual(parsed[0]["name"], "|x|")
        self.assertEqual(parsed[0]["reviews"], 0)
        self.assertEqual(q.validate_map(parsed), [])

    def test_invalid_levels_and_review_counts(self):
        with self.assertRaises(ValueError):
            q.parse_map("## Map\n| 1.1 | name | — | | | x | | |")
        items = [topic("1.1", 6)]
        self.assertTrue(q.validate_map(items))

    def test_missing_duplicate_cycle_and_date(self):
        items = [topic("1.1", deps=["1.2"]), topic("1.2", deps=["1.1", "9.9"])]
        items[0]["next_review"] = "2026-02-30"
        errors = q.validate_map(items + [items[0]])
        for expected in ("unique", "cycle", "missing", "date"):
            self.assertTrue(any(expected in e for e in errors), errors)

    def test_ties_use_queue_but_not_blocked_dependencies(self):
        items = [topic("1.1"), topic("1.2"), topic("1.3", deps=["1.1"])]
        self.assertEqual([t["id"] for t in q.suggest(items, ["1.3", "1.2 task"])], ["1.2", "1.1"])

    def test_mastery_checks_blocked_topics_too(self):
        plan = q.build_queue([topic("1.1", 4), topic("1.2", deps=["9.9"])], [], [], dt.date(2026, 10, 8))
        self.assertFalse(plan["mastered"])

    def test_due_dates_and_fix_drills(self):
        causes = [{"fixed": "no", "drill": "retry"}, {"fixed": "yes", "drill": "done"}]
        plan = q.build_queue([topic("1.1", review="2026-10-08"), topic("1.2", review="2026-10-09")],
                             [], causes, dt.date(2026, 10, 8))
        self.assertEqual([t["id"] for t in plan["due"]], ["1.1"])
        self.assertEqual(plan["fixes"], causes[:1])

    def test_review_history_and_drop(self):
        today = dt.date(2026, 10, 8)
        self.assertEqual(q.next_review(3, 3, 2, today), (3, "2026-10-15"))
        self.assertEqual(q.next_review(4, 3, 9, today), (1, "2026-10-09"))
        self.assertEqual(q.next_review(4, 4, 9, today), (10, "2026-10-22"))

    def test_check_does_not_require_intake_and_study_stops(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "learner-map.md"
            path.write_text("## Intake\n- Status: not done\n## Map\n| 1.1 | Name | — | | | 0 | | |")
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                self.assertEqual(q.main(["--file", str(path), "--check"]), 0)
                self.assertEqual(q.main(["--file", str(path)]), 0)
            self.assertIn("Map valid", output.getvalue())
            self.assertNotIn("Suggested main session", output.getvalue())


if __name__ == "__main__":
    unittest.main()
