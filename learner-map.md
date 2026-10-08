# Learner Map

This file runs your study sessions. Every session starts by reading it and ends by updating it.
If you're working on the template itself, leave the Intake below empty.

If you use a plain AI chat, paste the **Intake**, **Map**, and **Root causes** sections in at the
start of each study chat (`ai-tutor/prompts.md` §0). Agents that read `AGENTS.md` do this for
you when you study.

## Intake (Interviewer output, Day 1)

> As long as the status below says `not done`, every study session starts with the Interviewer
> (`ai-tutor/prompts.md` §1). Working on the template doesn't need this. The Interviewer fills it
> in when you start studying your subject.

- Status: not done
- Subject / goal:
- Study jurisdiction / grade or qualification / exam code and version / academic year (if applicable):
- Official requirements source: (authority, title, version/year, applicable/effective date, official URL, checked date)
- Source status: (not checked / official source verified (applicable version) / learner-provided (currentness unverified) / conflicting sources, awaiting clarification / unable to verify, awaiting learner source / recheck required / not applicable (general study))
- Deadline: none yet (add a real test date, or a target date you set yourself; without a date, plans tend to drift)
- Time budget: ___ per day, ___ per week
- How I'm tested: (format, question types, number of questions and time, pass mark, topic weightings if they're published, or "no test, steady learning")
- Exam language / regional variant (the language the exam is written in, if it's not the one we chat in):
- Accessibility / accommodations (extra time, screen reader, large print… and how far ahead they need booking; or "none"):
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
| 1 | You can recognize it and name it |
| 2 | You can explain it in your own words |
| 3 | You can apply it correctly in a simple problem |
| 4 | You can solve realistic problems with several constraints |
| 5 | You can troubleshoot problems you haven't seen before, and explain why the tempting wrong answers are wrong |

**Next review** (spaced repetition): after each Examiner quiz, set the next review date:

| Times reviewed at the same or higher level | Next review in |
|----|----|
| 1st | +1 day |
| 2nd | +3 days |
| 3rd | +7 days |
| 4th | +14 days |
| 5th | +30 days (level 4–5 only) |
| 6th+ | +60 days (level 5 only) |
| Level dropped | back to +1 day |

The gaps only get long once you've shown you really know a topic. Below level 4 they stop at +14
days, and `whats_due.py` applies that limit for you. The practice app's question reviews stay at
1, 3, 7, and 14 days (a miss brings a question back tomorrow). Only topic reviews go longer.
`python3 whats_due.py` shows the next gap for each topic and how overdue it is.

**Picking today's topic:**

1. If a topic's **Next review** is today or earlier, start with a 10-minute Examiner review of
   it (not a full session).
2. For the main session, pick the topic with the **lowest level** whose **dependencies are all at
   level 3 or higher**.
3. If there's a tie, go with the one higher up in this file, unless the **Next up** list says
   otherwise.
4. Once every topic is at level 4 or higher, switch to full practice tests and the Diagnostician.

## Map (Mapmaker output; update weekly)

> Topic IDs are `area.topic` numbers (1.1, 1.2, 2.1 …). One area is one chapter, unit, or theme.
> The two starter rows below show the format and teach how this system works. Keep them or
> replace them at intake.
>
> The last column (**Times reviewed**) is optional. It counts the reviews you passed at the same
> or a higher level, and `whats_due.py` uses it to show the next gap. Add 1 when you pass, and
> set it back to 0 when your level drops. Leave the column out if you don't want it. The map
> still works, it just can't tell you which gap is next.

| ID | Topic | Depends on | Where people get stuck | Practice task | Level | Last tested | Next review | Times reviewed |
|----|-------|-----------|------------------------|---------------|-------|-------------|-------------|----------------|
| 1.1 | How memory works *(starter demo)* | — | Familiarity vs recall: rereading feels productive but tests nothing | [task](./labs/practice-library.md#11-how-memory-works) | 0 | | | |
| 1.2 | How to practice *(starter demo)* | — | Cramming vs spacing; testing vs rereading; the wrong-twice rule | [task](./labs/practice-library.md#12-how-to-practice) | 0 | | | |

## Next up (Mapmaker output)

> The next 6 sessions, most important first. Rewrite this after every weekly ritual.
> It's empty for now. Run the Mapmaker (`ai-tutor/prompts.md` §2) to fill it in.

1.
2.
3.
4.
5.
6.

## Root causes (Diagnostician output, weekly)

> Misunderstandings that keep coming back, not one-off slips. Their fix drills go before new topics.

| Date found | Root misunderstanding | Evidence (mistake IDs) | Fix drill | Fixed? |
|------------|----------------------|--------------------------|-----------|--------|
| | | | | |

## Review history (Examiner output, one row per review)

> After every Examiner quiz, and after any check you do in chat later on without help, add one
> row: the date, the topic, the level you ended up at, and `pass` (the level stayed the same or
> went up) or `drop` (it went down). `whats_due.py` reads these rows to show your pass rate for
> the last 30 days. A `drop` also sends that topic's next review back to +1 day.

| Date | Topic | Level | Result |
|------|-------|-------|--------|
| | | | |
