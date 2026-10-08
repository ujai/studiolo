#!/usr/bin/env python3
"""Print today's study queue from learner-map.md.

Due reviews, the suggested next topic (the map's own picking rules), open root
causes, the deadline countdown, and mistake-log counts. Run it first thing in
every session, before you open anything else:

    python3 whats_due.py
    python3 whats_due.py --file /tmp/fake-map.md    # try a different map
"""
import argparse
import datetime as dt
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent
DATE_RE = re.compile(r"\d{4}-\d{2}-\d{2}")


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def section(text, heading):
    """Return the body of a `## heading` section, up to the next `## `.

    Headings may carry suffixes (e.g. "## Next up (Mapmaker output)"), so
    match the whole heading line, not just the heading text.
    """
    m = re.search(rf"^## {re.escape(heading)}[^\n]*\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    return m.group(1) if m else ""


def parse_map(text):
    topics = []
    for line in text.splitlines():
        if not line.startswith("|"):
            continue
        c = cells(line)
        # Topic IDs are area.topic numbers (1, 1.1, 2.3, ...).
        if len(c) < 8 or not re.fullmatch(r"\d+(?:\.\d+)*", c[0]):
            continue
        try:
            level = int(c[5])
        except ValueError:
            level = 0
        deps = [] if c[2] in ("", "—", "-") else [d.strip() for d in c[2].split(",")]
        topics.append({"id": c[0], "name": c[1], "deps": deps, "level": level, "next_review": c[7]})
    return topics


def parse_intake_done(text):
    line = next((l for l in text.splitlines() if l.startswith("- Status:")), "")
    value = line.split(":", 1)[1].strip().lower() if ":" in line else ""
    return value.startswith("done")  # "done (2026-10-08)" yes; "not done" no


def parse_root_causes(text):
    causes = []
    for line in section(text, "Root causes").splitlines():
        if not line.startswith("|"):
            continue
        c = cells(line)
        if len(c) < 5 or c[0].lower() == "date found" or (c[0] and set(c[0]) <= {"-"}):
            continue
        if c[1]:
            causes.append({"date": c[0], "cause": c[1], "evidence": c[2], "drill": c[3], "fixed": c[4]})
    return causes


def parse_next_up(text):
    queue = []
    for line in section(text, "Next up").splitlines():
        m = re.match(r"\s*\d+\.\s+(.+)", line)
        if m and m.group(1).strip():
            queue.append(m.group(1).strip())
    return queue


def parse_deadline(text):
    line = next((l for l in text.splitlines() if l.startswith("- Deadline:") or l.startswith("- Exam date:")), "")
    date = DATE_RE.search(line)
    commit_by = re.search(r"(?:book|commit) by (\d{4}-\d{2}-\d{2})", line)
    vague = "none" in line.lower() or "not set" in line.lower()
    return {
        "date": date.group(0) if date else None,
        "committed": bool(line) and "not booked" not in line and "not committed" not in line and not vague,
        "commit_by": commit_by.group(1) if commit_by else None,
    }


def parse_mistake_log(path):
    if not path.exists():
        return None
    rows, twice = 0, 0
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.startswith("|"):
            continue
        c = cells(line)
        if len(c) >= 10 and c[0] and not c[0].startswith("ID"):
            if set(c[0]) <= {"-"}:  # an empty placeholder row like | - | - |
                continue
            rows += 1
            if c[9].lower().startswith("yes"):
                twice += 1
    return rows, twice


def suggest(topics):
    """The map's picking rules: lowest level first, deps all at level 3+, map order breaks ties."""
    levels = {t["id"]: t["level"] for t in topics}
    eligible = [t for t in topics if all(levels.get(d, 0) >= 3 for d in t["deps"])]
    eligible.sort(key=lambda t: t["level"])
    return eligible


def main(argv=None):
    ap = argparse.ArgumentParser(description="Print today's study queue from learner-map.md.")
    ap.add_argument("--file", default=str(REPO / "learner-map.md"), help="path to a learner map")
    args = ap.parse_args(argv)

    text = Path(args.file).read_text(encoding="utf-8")
    topics = parse_map(text)
    if not topics:
        print("No topic rows found in the Map table. Is this a learner-map.md file?")
        return 1
    today = dt.date.today()
    deadline = parse_deadline(text)
    log = parse_mistake_log(REPO / "mistake-log.md")

    # --- interview gate ---
    if not parse_intake_done(text):
        print(">>> INTAKE NOT DONE: run the Interviewer first (ai-tutor/prompts.md §1),")
        print(">>> or just tell your agent \"help me study\". Nothing else happens until then.\n")

    # --- header: deadline countdown ---
    if deadline["date"]:
        d_day = dt.date.fromisoformat(deadline["date"])
        days = (d_day - today).days
        if days >= 0:
            head = f"deadline in {days} day{'s' if days != 1 else ''} ({deadline['date']})"
        else:
            head = f"deadline was {-days} day{'s' if days != -1 else ''} ago ({deadline['date']})"
        if not deadline["committed"]:
            head += " — TARGET ONLY, NOT COMMITTED."
            if deadline["commit_by"]:
                by_day = dt.date.fromisoformat(deadline["commit_by"])
                by_days = (by_day - today).days
                head += f" Commit by {deadline['commit_by']} ({by_days} day{'s' if by_days != 1 else ''} left)" if by_days >= 0 else f" COMMIT OVERDUE ({deadline['commit_by']}) — commit now"
            else:
                head += " Set the real date this week."
    else:
        head = "no deadline in Intake — set one (a real test date beats a vague goal)"
    print(f"=== {today.isoformat()} · {head} ===\n")

    # --- due reviews ---
    due = [t for t in topics if t["next_review"] and t["next_review"] <= today.isoformat()]
    due.sort(key=lambda t: t["next_review"])
    if due:
        print(f"Due reviews ({len(due)}) — 10-min Examiner each, prompt §5, stop at first miss:")
        for t in due:
            overdue = (today - dt.date.fromisoformat(t["next_review"])).days
            when = "today" if overdue == 0 else f"{overdue} day{'s' if overdue != 1 else ''} overdue"
            print(f"  {t['id']:4} {t['name'][:52]:52} level {t['level']} · {when}")
        print()
    else:
        print("Due reviews: none today\n")

    # --- next up queue ---
    queue = parse_next_up(text)
    if queue:
        print("Next up queue (from the map):")
        for i, item in enumerate(queue[:6], 1):
            print(f"  {i}. {item}")
        print()
    else:
        print("Next up queue: empty — run the Mapmaker (ai-tutor/prompts.md §2)\n")

    # --- suggested main session ---
    ranked = suggest(topics)
    if ranked and ranked[0]["level"] >= 4:
        print("Every topic is at level 4+. The map says: switch to full practice tests + Diagnostician.\n")
    elif ranked:
        print("Suggested main session (lowest level first, dependencies at level 3+):")
        for i, t in enumerate(ranked[:3], 1):
            print(f"  {i}. {t['id']:4} {t['name'][:52]:52} level {t['level']}")
        blocked = len(topics) - len(ranked)
        if blocked:
            print(f"  ({blocked} topic{'s' if blocked != 1 else ''} skipped for now: dependencies still below level 3)")
        print()

    # --- root causes ---
    open_causes = [c for c in parse_root_causes(text) if not c["fixed"].lower().startswith("yes")]
    if open_causes:
        print(f"Open root causes ({len(open_causes)}) — fix drills jump the queue:")
        for c in open_causes:
            print(f"  {c['date']}: {c['cause'][:70]}")
            if c["drill"]:
                print(f"       fix drill: {c['drill'][:70]}")
        print()
    else:
        print("Open root causes: none\n")

    # --- mistake log ---
    if log is None:
        print("Mistake log: mistake-log.md not found")
    else:
        rows, twice = log
        extra = f", {twice} wrong twice → flashcard rows due (Clerk §10)" if twice else ""
        print(f"Mistake log: {rows} row{'s' if rows != 1 else ''}{extra}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
