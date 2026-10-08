#!/usr/bin/env python3
"""Print today's study queue from learner-map.md.

Due reviews (capped at three on backlog days), the suggested next topic (the map's
own picking rules), open root causes, the deadline countdown, the 30-day review
pass rate, and mistake-log counts. Run it first thing in every session, before
you open anything else:

    python3 whats_due.py
    python3 whats_due.py --file /tmp/fake-map.md    # try a different map
    python3 whats_due.py --check                    # validate the map, no queue
"""
import argparse
import datetime as dt
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent
DATE_RE = re.compile(r"\d{4}-\d{2}-\d{2}")
TOPIC_RE = re.compile(r"\d+\.\d+(?:\.\d+)*")
# The review ladder. The +30 rung needs a topic at level 4, the +60 rung level 5;
# rung_days() enforces the caps. Question-level ladders in the practice app stay
# at 1/3/7/14 — only topic reviews stretch with mastery.
REVIEW_STEPS = (1, 3, 7, 14, 30, 60)


def cells(line):
    """Split a Markdown table row without treating escaped pipes as separators."""
    row, cell, escaped = [], [], False
    for char in line.strip().removeprefix("|").removesuffix("|"):
        if escaped:
            cell.append(char if char == "|" else "\\" + char)
            escaped = False
        elif char == "\\":
            escaped = True
        elif char == "|":
            row.append("".join(cell).strip())
            cell = []
        else:
            cell.append(char)
    if escaped:
        cell.append("\\")
    return row + ["".join(cell).strip()]


def section(text, heading):
    """Return the body of a `## heading` section, up to the next `## `.

    Headings may carry suffixes (e.g. "## Next up (Mapmaker output)"), so
    match the whole heading line, not just the heading text.
    """
    m = re.search(rf"^## {re.escape(heading)}[^\n]*\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    return m.group(1) if m else ""


def parse_map(text):
    topics = []
    for line in section(text, "Map").splitlines():
        if not line.startswith("|"):
            continue
        c = cells(line)
        if len(c) < 8 or not TOPIC_RE.fullmatch(c[0]):
            continue
        try:
            level = int(c[5])
        except ValueError:
            raise ValueError(f"Topic {c[0]}: Level must be an integer from 0 to 5.") from None
        try:
            reviews = int(c[8]) if len(c) > 8 and c[8] else 0
        except ValueError:
            raise ValueError(f"Topic {c[0]}: Review count must be a nonnegative integer.") from None
        deps = [] if c[2] in ("", "—", "-") else [d.strip() for d in c[2].split(",")]
        topics.append({"id": c[0], "name": c[1], "deps": deps, "level": level,
                       "last_tested": c[6], "next_review": c[7], "reviews": reviews})
    return topics


def parse_review_history(text):
    """Rows of the `## Review history` table: date, topic, level, pass/drop."""
    rows = []
    for line in section(text, "Review history").splitlines():
        if not line.startswith("|"):
            continue
        c = cells(line)
        if len(c) < 4 or c[0].lower().startswith("date") or not c[0] or not c[1] or set(c[0]) <= {"-"}:
            continue
        rows.append({"date": c[0], "topic": c[1], "level": c[2], "result": c[3].lower()})
    return rows


def validate_map(topics, deadline=None, history=()):
    errors, ids = [], {t["id"] for t in topics}
    if len(ids) != len(topics):
        errors.append("Topic IDs must be unique.")
    for t in topics:
        if not 0 <= t["level"] <= 5 or t["reviews"] < 0:
            errors.append(f"Topic {t['id']}: invalid level or review count.")
        for field in ("last_tested", "next_review"):
            if t[field]:
                try:
                    dt.date.fromisoformat(t[field])
                    if not DATE_RE.fullmatch(t[field]):
                        raise ValueError
                except ValueError:
                    errors.append(f"Topic {t['id']}: {field} must be a real YYYY-MM-DD date.")
        for dep in t["deps"]:
            if dep not in ids:
                errors.append(f"Topic {t['id']}: missing dependency {dep}.")
    graph = {t["id"]: t["deps"] for t in topics}
    visiting, visited = set(), set()

    def visit(node):
        if node in visiting:
            errors.append(f"Dependency cycle involving {node}.")
            return
        if node in visited or node not in graph:
            return
        visiting.add(node)
        for dep in graph[node]:
            visit(dep)
        visiting.remove(node)
        visited.add(node)

    for node in graph:
        visit(node)
    for row in history:
        try:
            dt.date.fromisoformat(row["date"])
            if not DATE_RE.fullmatch(row["date"]):
                raise ValueError
        except ValueError:
            errors.append(f"Review history row: {row['topic'] or '?'} has an invalid date.")
            continue
        if row["topic"] not in ids:
            errors.append(f"Review history row {row['date']}: unknown topic {row['topic']}.")
        if row["level"] not in ("0", "1", "2", "3", "4", "5"):
            errors.append(f"Review history row {row['date']} {row['topic']}: level must be 0-5.")
        if row["result"] not in ("pass", "drop"):
            errors.append(f"Review history row {row['date']} {row['topic']}: result must be pass or drop.")
    for field in ("date", "commit_by"):
        value = (deadline or {}).get(field)
        if value:
            try:
                dt.date.fromisoformat(value)
            except ValueError:
                errors.append(f"Deadline {field}: invalid date {value}.")
    return list(dict.fromkeys(errors))


def rung_days(count, level):
    """Days until the next review after the count-th consecutive pass.

    The ladder tops out at +14 below level 4: only proven mastery earns long gaps
    (+30 at level 4, +60 at level 5). `count` is clamped to the ladder's length.
    """
    rung = max(0, min(count - 1, len(REVIEW_STEPS) - 1))
    if rung > 3:  # the +30/+60 rungs are gated by level
        rung = 3 if level < 4 else (4 if level < 5 else rung)
    return REVIEW_STEPS[rung]


def next_review(previous_level, level, review_count, today):
    """Return (consecutive successful reviews, date) using the default topic policy."""
    if not 0 <= level <= 5 or not 0 <= previous_level <= 5 or review_count < 0:
        raise ValueError("Invalid level or review count.")
    count = 1 if level < previous_level else review_count + 1
    return count, (today + dt.timedelta(days=rung_days(count, level))).isoformat()


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


def suggest(topics, queue=()):
    """The map's picking rules: lowest level first, deps all at level 3+, map order breaks ties."""
    levels = {t["id"]: t["level"] for t in topics}
    eligible = [t for t in topics if all(levels.get(d, 0) >= 3 for d in t["deps"])]
    priority = {}
    for item in queue:
        match = re.search(r"(?<![\d.])\d+\.\d+(?:\.\d+)*(?![\d.])", item)
        if match:
            priority.setdefault(match.group(), len(priority))
    eligible.sort(key=lambda t: (t["level"], priority.get(t["id"], len(priority))))
    return eligible


def build_queue(topics, queue, causes, today):
    """Pure queue calculation; fix drills precede new-topic work, not due reviews."""
    return {
        "due": sorted((t for t in topics if t["next_review"] and
                       t["next_review"] <= today.isoformat()), key=lambda t: t["next_review"]),
        "fixes": [c for c in causes if not c["fixed"].lower().startswith("yes")],
        "ranked": suggest(topics, queue),
        "mastered": bool(topics) and all(t["level"] >= 4 for t in topics),
    }


def main(argv=None):
    ap = argparse.ArgumentParser(description="Print today's study queue from learner-map.md.")
    ap.add_argument("--file", default=str(REPO / "learner-map.md"), help="path to a learner map")
    ap.add_argument("--check", action="store_true", help="validate the map without starting study")
    args = ap.parse_args(argv)

    try:
        text = Path(args.file).read_text(encoding="utf-8")
        topics = parse_map(text)
    except (OSError, ValueError) as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    if not topics:
        print("No topic rows found in the Map table. Is this a learner-map.md file?")
        return 1
    today = dt.date.today()
    deadline = parse_deadline(text)
    history = parse_review_history(text)
    errors = validate_map(topics, deadline, history)
    if errors:
        print("\n".join(f"ERROR: {e}" for e in errors), file=sys.stderr)
        return 1
    if args.check:
        print(f"Map valid: {len(topics)} topics, {len(history)} review-history rows.")
        return 0
    log = parse_mistake_log(Path(args.file).resolve().parent / "mistake-log.md")

    # --- interview gate ---
    if not parse_intake_done(text):
        print(">>> INTAKE NOT DONE: run the Interviewer first (ai-tutor/prompts.md §1),")
        print(">>> or just tell your agent \"help me study\". Nothing else happens until then.\n")
        return 0
    queue = parse_next_up(text)
    causes = parse_root_causes(text)
    plan = build_queue(topics, queue, causes, today)

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
        head = "steady learning — no deadline"
    print(f"=== {today.isoformat()} · {head} ===\n")

    # --- due reviews (backlog amnesty: cap a pile at three, most overdue first) ---
    due = plan["due"]
    if due:
        shown = due[:3] if len(due) > 3 else due
        print(f"Due reviews ({len(due)}) — short unaided Examiner checks, prompt §5:")
        for t in shown:
            overdue = (today - dt.date.fromisoformat(t["next_review"])).days
            when = "today" if overdue == 0 else f"{overdue} day{'s' if overdue != 1 else ''} overdue"
            rung = rung_days(t["reviews"] + 1, t["level"])
            print(f"  {t['id']:4} {t['name'][:52]:52} level {t['level']} · {when} · +{rung}d if it holds")
        if len(due) > len(shown):
            print(f"  (+{len(due) - len(shown)} more waiting — clear the 3 above first; the rest are first in line tomorrow.)")
            print("   A backlog is normal after time off. Welcome back — keep today's session short.")
        print()
    else:
        print("Due reviews: none today\n")

    # --- next up queue ---
    open_causes = plan["fixes"]
    if open_causes:
        print(f"Priority fix drills ({len(open_causes)}) — before new-topic work:")
        for c in open_causes:
            print(f"  {c['cause'][:70]}")
            print(f"       fix drill: {c['drill'][:70]}")
        print()
    if queue:
        print("Next up queue (from the map):")
        for i, item in enumerate(queue[:6], 1):
            print(f"  {i}. {item}")
        print()
    else:
        print("Next up queue: empty — run the Mapmaker (ai-tutor/prompts.md §2)\n")

    # --- suggested main session ---
    ranked = plan["ranked"]
    if plan["mastered"]:
        print("Every topic is at level 4+. The map says: switch to full practice tests + Diagnostician.\n")
    elif ranked:
        print("Suggested main session (lowest level first, dependencies at level 3+):")
        for i, t in enumerate(ranked[:3], 1):
            print(f"  {i}. {t['id']:4} {t['name'][:52]:52} level {t['level']}")
        blocked = len(topics) - len(ranked)
        if blocked:
            print(f"  ({blocked} topic{'s' if blocked != 1 else ''} skipped for now: dependencies still below level 3)")
        print()
    else:
        print("No eligible topic. Check dependencies or run the Mapmaker.\n")

    # --- root causes ---
    # The open ones were already listed above as priority fix drills; here they only get counted.
    if causes:
        print(f"Root causes: {len(open_causes)} open, {len(causes) - len(open_causes)} fixed\n")
    else:
        print("Root causes: none logged\n")

    # --- review history: the 30-day pass rate (the receipt trail in the map) ---
    if history:
        cutoff = (today - dt.timedelta(days=30)).isoformat()
        recent = [r for r in history if r["date"] >= cutoff]
        if recent:
            passed = sum(1 for r in recent if r["result"] == "pass")
            drops = len(recent) - passed
            pct = round(100 * passed / len(recent))
            print(f"Reviews, last 30 days: {len(recent)} logged — {passed} passed, "
                  f"{drops} drop{'s' if drops != 1 else ''} ({pct}% holding)")
        else:
            print("Reviews, last 30 days: none logged — every Examiner run adds a row")
    else:
        print("Reviews: no history yet — one row per Examiner run starts it (learner-map.md → Review history)")

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
