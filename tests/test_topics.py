import contextlib
import io
import tempfile
import unittest
from pathlib import Path

import generate_topics as t

MAP = """# Learner Map

## Map

| ID | Topic | Depends on | Where people get stuck | Practice task | Level | Last tested | Next review |
|----|-------|-----------|------------------------|---------------|-------|-------------|-------------|
| 1.1 | How memory works *(starter demo)* | — | Familiarity vs recall | [task](./labs/practice-library.md#11) | 0 | | |
| 1.2 | How to practice *(starter demo)* | 1.1 | Cramming vs spacing | [task](./labs/practice-library.md#12) | 0 | | |
| 2.1 | Subnetting | — | Borrowed bits | [task](./labs/practice-library.md#21) | 0 | | |
"""

BROKEN = """# Learner Map

## Map

| ID | Topic | Depends on | Where people get stuck | Practice task | Level | Last tested | Next review |
|----|-------|-----------|------------------------|---------------|-------|-------------|-------------|
| 1.1 | Only topic | 9.9 | gap | task | 0 | | |
"""


def run(*argv):
    """Run the CLI, swallowing its output, and return (exit code, stdout)."""
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
        code = t.main(list(argv))
    return code, buf.getvalue()


class TopicsTests(unittest.TestCase):
    def test_metadata_strips_demo_marker_and_groups_areas(self):
        meta = t.metadata(MAP)
        self.assertEqual(meta["topics"], {"1.1": "How memory works", "1.2": "How to practice", "2.1": "Subnetting"})
        self.assertEqual(meta["areas"]["1"], {"name": "Area 1", "tag": "area1"})
        self.assertEqual(meta["areas"]["2"]["tag"], "area2")

    def test_render_is_a_plain_script_with_a_do_not_edit_header(self):
        text = t.render(MAP)
        self.assertTrue(text.startswith("// Generated from learner-map.md"))
        self.assertIn("window.STUDIOLO_TOPICS = {", text)
        self.assertNotIn("starter demo", text)

    def test_metadata_rejects_a_map_with_broken_dependencies(self):
        with self.assertRaises(ValueError):
            t.metadata(BROKEN)
        with self.assertRaises(ValueError):
            t.metadata("# Learner Map\n\nNo map table here.\n")

    def test_cli_writes_then_detects_stale_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            mapfile = Path(tmp) / "learner-map.md"
            mapfile.write_text(MAP, encoding="utf-8")
            out = Path(tmp) / "topics.js"

            code, message = run("--file", str(mapfile), "--output", str(out))
            self.assertEqual(code, 0, message)
            self.assertIn("STUDIOLO_TOPICS", out.read_text(encoding="utf-8"))

            self.assertEqual(run("--file", str(mapfile), "--output", str(out), "--check")[0], 0)

            out.write_text("// stale\n", encoding="utf-8")
            code, message = run("--file", str(mapfile), "--output", str(out), "--check")
            self.assertEqual(code, 1)
            self.assertIn("stale", message)

    def test_cli_check_fails_when_output_is_missing(self):
        with tempfile.TemporaryDirectory() as tmp:
            mapfile = Path(tmp) / "learner-map.md"
            mapfile.write_text(MAP, encoding="utf-8")
            code, message = run("--file", str(mapfile), "--output", str(Path(tmp) / "absent.js"), "--check")
            self.assertEqual(code, 1)
            self.assertIn("stale", message)

    def test_cli_reports_a_broken_map_instead_of_crashing(self):
        with tempfile.TemporaryDirectory() as tmp:
            mapfile = Path(tmp) / "learner-map.md"
            mapfile.write_text(BROKEN, encoding="utf-8")
            code, message = run("--file", str(mapfile), "--output", str(Path(tmp) / "topics.js"))
            self.assertEqual(code, 1)
            self.assertIn("ERROR", message)

    def test_checked_in_metadata_is_current(self):
        # Fails when learner-map.md changed without regenerating practice/topics.js.
        code, message = run("--check")
        self.assertEqual(code, 0, message)


if __name__ == "__main__":
    unittest.main()
