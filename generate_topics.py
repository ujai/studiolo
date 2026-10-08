#!/usr/bin/env python3
"""Generate the practice app's topic metadata from the Markdown source of truth."""
import argparse
import json
import re
import sys
from pathlib import Path

from whats_due import parse_map, validate_map

REPO = Path(__file__).resolve().parent


def metadata(text):
    topics = parse_map(text)
    errors = validate_map(topics)
    if not topics or errors:
        raise ValueError("; ".join(errors or ["No topics found."]))
    names = {t["id"]: re.sub(r"\s*\*\(starter demo\)\*", "", t["name"]) for t in topics}
    areas = {id.split(".")[0]: {"name": "Area " + id.split(".")[0], "tag": "area" + id.split(".")[0]} for id in names}
    return {"topics": names, "areas": areas}


def render(text):
    return "// Generated from learner-map.md by generate_topics.py; do not edit.\nwindow.STUDIOLO_TOPICS = " + json.dumps(metadata(text), ensure_ascii=False, indent=2) + ";\n"


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--file", type=Path, default=REPO / "learner-map.md")
    ap.add_argument("--output", type=Path, default=REPO / "practice/topics.js")
    ap.add_argument("--check", action="store_true", help="fail if generated metadata is stale")
    args = ap.parse_args(argv)
    try:
        expected = render(args.file.read_text(encoding="utf-8"))
        if args.check:
            if not args.output.exists() or args.output.read_text(encoding="utf-8") != expected:
                raise ValueError("Topic metadata is stale. Run python3 generate_topics.py.")
            print("Topic metadata is current.")
        else:
            args.output.write_text(expected, encoding="utf-8")
            print(f"Wrote {args.output}")
    except (OSError, ValueError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
