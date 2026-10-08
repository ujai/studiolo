# Study Templates

These are short on purpose. Fill them in from memory. The Clerk can tidy them up afterwards,
but it never writes them for you.

## 1) Session log (one per day)

```md
# Day [X] – [Date] – Topic [ID]

## Why this topic
- The learner map picked it because: (lowest level / due review / root-cause fix)

## What I remember before studying (no looking)
-
-
-

## First attempt
- Got as far as:
- Stuck at:

## What I asked the Explainer (one step only)
-

## Redid it from scratch without help: yes / no
## Break it: what I broke, what the failure looked like, how I fixed it
-

## Gaps the Socratic questions found
1.
2.
3.

## Listener: what I missed
-

## Examiner
- Level: _ (was _)
- What stopped me:
- Next review date:
- Review history row (date · topic · level · pass/drop):

## Mistakes logged: _   Cards made: _
```

## 2) Mistake log

Every gap from the Socratic, Listener, Examiner, Sparring, and practice-test sessions goes
here. The Diagnostician reads this file, so be honest in the **Why wrong** and **Root?**
columns.

The real log is [`mistake-log.md`](./mistake-log.md). This section explains its format.

```md
| ID | Date | Topic | Source role | What I said / chose | Correct | Why wrong | Missed clue | Root? | Seen before? |
|----|------|-------|-------------|---------------------|---------|-----------|-------------|-------|--------------|
| M1 | | | | | | | | | no |
```

- **Source role**: Socratic / Listener / Examiner / Sparring / Practice test / Checker / Practice app (mode)
- **Why wrong**: pick one of `concept-gap`, `misread-keyword`, `concept-confusion`, `rushed`, `overthought`, `bad-elimination`, `changed-correct-answer`
- **Root?**: leave it blank. The Diagnostician fills it in with a root cause ID (R1, R2…) during the weekly ritual.
- **Seen before? = yes** means it's the second time you got it wrong, so the Clerk makes a flashcard.

### Example

```md
| M7 | 2026-10-08 | 1.1 | Practice app (Exam sprint) | "One 3-hour session on Sunday" | "Six shorter sessions spread over the week" | concept-gap | "3 hours this week" means spread it out, don't cram | R1 | no |
```

## 3) Listener sheet (teaching it back)

```md
# Listener – Topic [ID] – [Date]

## Voice (2 min, transcribed)
(paste transcript)

## Sketch
(photo link, or ASCII boxes and arrows)

## Written (5 lines max)
1.
2.
3.
4.
5.

## Listener feedback
- Missed:
- Wrong:
- Where the voice, sketch, and written versions disagree:
```

## 4) Weekly ritual sheet

```md
# Week [N] ritual – [Date]

## Mini-test (Sparring): __/30
- Weakest topics:

## Root causes from the Diagnostician (max 3)
| ID | Root misunderstanding | Evidence (mistake IDs) | Fix drill |
|----|----------------------|------------------------|-----------|
| R1 | | | |

## Rebuild from memory, then Checker
- Task rebuilt:
- What the Checker found:
- Fixed it and ran it again? yes / no

## Clerk cheat sheet
- Area:
- `[CHECK]` items verified in an authoritative source? yes / no

## Re-map: next 6 sessions
1.
2.
3.
4.
5.
6.
```

## 5) Topic page (optional, for topics you keep failing)

```md
# Topic [ID]: [name]

## What it is (2 sentences, in my own words)
## What I actually did
## The trap the test sets
## How to explain it simply (3 lines)
## One problem I can solve now
## Cards made (wrong twice only)
```
