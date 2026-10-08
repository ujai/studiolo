# Learner Map

This file drives learner study sessions. Each study session starts by reading it and ends
by updating it. Leave the starter Intake empty when maintaining the reusable template.
Paste the **Intake**, **Map**, and **Root causes** sections into a plain AI chat at the start
of each study chat (`ai-tutor/prompts.md` §0); agents that read `AGENTS.md` do this automatically
for study.

## Intake (Interviewer output, Day 1)

> While the status below says `not done`, every study session starts with the Interviewer
> (`ai-tutor/prompts.md` §1). This does not gate template maintenance. The Interviewer fills
> this in when you start studying your subject.

- Status: not done
- Subject / goal:
- Study jurisdiction / grade or qualification / exam code and version / academic year (if applicable):
- Official requirements source: (authority, title, version/year, applicable/effective date, official URL, checked date)
- Source status: (not checked / official source verified (applicable version) / learner-provided (currentness unverified) / conflicting sources, awaiting clarification / unable to verify, awaiting learner source / recheck required / not applicable (general study))
- Deadline: none — set one (a real test date, or a self-imposed target; a map without a date drifts)
- Time budget: ___ per day, ___ per week
- How I'm tested: (format, question types, count/duration, pass mark, topic weightings if published — or "no test, steady learning")
- Exam language / regional variant (the language of the exam papers, if not how we chat):
- Accessibility / accommodations (extra time, screen reader, large print… note lead time; or "none"):
- What counts as practice for this subject: (problems? essays? speaking? building?)
- Strong areas:
- Weak areas:
- Biggest risk / how I usually fail:

Interviewer 12-line summary (pasted after the interview):

## How to read the map

**Level** (set by the Examiner, `ai-tutor/prompts.md` §5):

| Level | Meaning |
|-------|---------|
| 0 | Not tested yet |
| 1 | Recognize it, name it |
| 2 | Explain it in your own words |
| 3 | Apply it correctly in a simple problem |
| 4 | Solve realistic scenarios with multiple constraints |
| 5 | Troubleshoot novel problems, and explain why tempting wrong answers are wrong |

**Next review** (spaced repetition): after each Examiner run, set the next review date:

| Times reviewed at the same or higher level | Next review in |
|----|----|
| 1st | +1 day |
| 2nd | +3 days |
| 3rd | +7 days |
| 4th | +14 days |
| 5th | +30 days (level 4–5 only) |
| 6th+ | +60 days (level 5 only) |
| Level dropped | reset to +1 day |

Only proven mastery stretches the gaps: below level 4 the ladder tops out at +14 days, and
`whats_due.py` applies that cap for you. The practice app's question ladder stays at 1, 3, 7
and 14 days (a miss sends a question back to tomorrow) — topic reviews are the ones that
stretch. `python3 whats_due.py` prints which rung is next for a topic, and how overdue it is.

**Picking today's topic:**

1. A topic with **Next review ≤ today** gets a 10-minute Examiner review first (not a full session).
2. For the main session, pick the topic with the **lowest level** whose **dependencies are all at level 3 or higher**.
3. Ties: order in this file (earlier rows first), unless the **Next up** queue says otherwise.
4. When every topic is at level 4+, switch to full practice tests and the Diagnostician.

## Map (Mapmaker output; update weekly)

> Topic IDs are `area.topic` numbers (1.1, 1.2, 2.1 …). One area = one chapter, unit, or
> theme. The two starter rows below show the format and teach the method itself — keep them
> or replace them at intake.
>
> The last column (**Times reviewed**) is optional: it counts reviews passed at the same or a
> higher level, and `whats_due.py` uses it to show the next rung. Increase it on a pass, reset
> it to 0 on a drop. Add the column when you want the extra guidance; the map works without it.

| ID | Topic | Depends on | Where people get stuck | Practice task | Level | Last tested | Next review | Times reviewed |
|----|-------|-----------|------------------------|---------------|-------|-------------|-------------|----------------|
| 1.1 | How memory works *(starter demo)* | — | Familiarity vs recall: rereading feels productive but tests nothing | [task](./labs/practice-library.md#11-how-memory-works) | 0 | | | |
| 1.2 | How to practice *(starter demo)* | — | Cramming vs spacing; testing vs rereading; the wrong-twice rule | [task](./labs/practice-library.md#12-how-to-practice) | 0 | | | |

## Next up (Mapmaker output)

> The next 6 sessions, highest priority first. Rewrite after every weekly ritual.
> Empty for now — run the Mapmaker (`ai-tutor/prompts.md` §2).

1.
2.
3.
4.
5.
6.

## Root causes (Diagnostician output, weekly)

> Recurring misunderstandings, not one-off slips. Fix drills jump the queue.

| Date found | Root misunderstanding | Evidence (mistake IDs) | Fix drill | Fixed? |
|------------|----------------------|--------------------------|-----------|--------|
| | | | | |

## Review history (Examiner output — one row per review)

> The receipt trail. After every Examiner run — and after any delayed check you do unaided
> in chat — append one row: date, topic, the level you landed on, and `pass` (the level held
> or rose) or `drop` (the level fell). `whats_due.py` reads these rows to show your 30-day
> review pass rate. A `drop` also resets the topic's review ladder to +1 day.

| Date | Topic | Level | Result |
|------|-------|-------|--------|
| | | | |
