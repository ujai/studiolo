# Learner Map

This file drives everything. Every session starts by reading it and ends by updating it.
Paste the **Intake**, **Map**, and **Root causes** sections into a plain AI chat at the start
of each chat (`ai-tutor/prompts.md` §0); agents that read `AGENTS.md` do this automatically.

## Intake (Interviewer output, Day 1)

> While the status below says `not done`, every session starts with the Interviewer
> (`ai-tutor/prompts.md` §1) — whatever else you asked for. The Interviewer fills this in.

- Status: not done
- Subject / goal:
- Deadline: none — set one (a real test date, or a self-imposed target; a map without a date drifts)
- Time budget: ___ per day, ___ per week
- How I'm tested: (format, style, pass mark — or "no test, steady learning")
- What counts as practice for this subject: (problems? essays? speaking? building?)
- Strong areas:
- Weak areas:
- Biggest risk / how I usually fail:

Interviewer 10-line summary (pasted after the interview):

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
| 4th+ | +14 days |
| Level dropped | reset to +1 day |

**Picking today's topic:**

1. A topic with **Next review ≤ today** gets a 10-minute Examiner review first (not a full session).
2. For the main session, pick the topic with the **lowest level** whose **dependencies are all at level 3 or higher**.
3. Ties: order in this file (earlier rows first), unless the **Next up** queue says otherwise.
4. When every topic is at level 4+, switch to full practice tests and the Diagnostician.

## Map (Mapmaker output; update weekly)

> Topic IDs are `area.topic` numbers (1.1, 1.2, 2.1 …). One area = one chapter, unit, or
> theme. The two starter rows below show the format and teach the method itself — keep them
> or replace them at intake.

| ID | Topic | Depends on | Where people get stuck | Practice task | Level | Last tested | Next review |
|----|-------|-----------|------------------------|---------------|-------|-------------|-------------|
| 1.1 | How memory works *(starter demo)* | — | Familiarity vs recall: rereading feels productive but tests nothing | [task](./labs/practice-library.md#11-how-memory-works) | 0 | | |
| 1.2 | How to practice *(starter demo)* | — | Cramming vs spacing; testing vs rereading; the wrong-twice rule | [task](./labs/practice-library.md#12-how-to-practice) | 0 | | |

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
