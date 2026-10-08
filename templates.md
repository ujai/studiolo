# Study Templates

Short on purpose. Fill these from your own head. The Clerk can tidy them later, but never write them for you.

## 1) Session log (one per day)

```md
# Day [X] – [Date] – Topic [ID]

## Why this topic
- Picked by learner map because: (lowest level / due review / root-cause fix)

## Recall before studying (no looking)
-
-
-

## Cold attempt
- Got as far as:
- Stuck at:

## Explainer used for (one step only)
-

## Redo from scratch without help: done? yes / no
## Break it: what I broke, what the failure looked like, how I fixed it
-

## Socratic gaps found
1.
2.
3.

## Listener: what I missed
-

## Examiner
- Level: _ (was _)
- Stopped by:
- Next review date:
- Review history row (date · topic · level · pass/drop):

## Mistakes logged: _   Cards made: _
```

## 2) Mistake log

Every gap from the Socratic, Listener, Examiner, Sparring, and practice test sessions goes
here. The Diagnostician reads this file, so keep the **Why** and **Root?** columns honest.

The live copy is [`mistake-log.md`](./mistake-log.md); this section defines the format.

```md
| ID | Date | Topic | Source role | What I said / chose | Correct | Why wrong | Missed clue | Root? | Seen before? |
|----|------|-------|-------------|---------------------|---------|-----------|-------------|-------|--------------|
| M1 | | | | | | | | | no |
```

- **Source role**: Socratic / Listener / Examiner / Sparring / Practice test / Checker / Practice app (mode)
- **Why wrong**: `concept-gap`, `misread-keyword`, `concept-confusion`, `rushed`, `overthought`, `bad-elimination`, `changed-correct-answer`
- **Root?**: leave blank. The Diagnostician fills it in with a root cause ID (R1, R2…) on ritual day.
- **Seen before? = yes** → second time wrong → the Clerk makes a flashcard.

### Example

```md
| M7 | 2026-10-08 | 1.1 | Practice app (Exam sprint) | "One 3-hour session on Sunday" | "Six shorter sessions spread over the week" | concept-gap | "3 hours this week" — spacing beats cramming | R1 | no |
```

## 3) Listener sheet (teach-back)

```md
# Listener – Topic [ID] – [Date]

## Voice (2 min, transcribed)
(paste transcript)

## Sketch
(photo link, or ASCII boxes + arrows)

## Written (5 lines max)
1.
2.
3.
4.
5.

## Listener feedback
- Missed:
- Wrong:
- Voice vs sketch vs written contradictions:
```

## 4) Weekly ritual sheet

```md
# Week [N] ritual – [Date]

## Mini test (Sparring): __/30
- Weakest topics:

## Diagnostician root causes (max 3)
| ID | Root misunderstanding | Evidence (mistake IDs) | Fix drill |
|----|----------------------|------------------------|-----------|
| R1 | | | |

## Rebuild from memory → Checker
- Task rebuilt:
- Checker findings:
- Fixed and reran? yes / no

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

## What it is (2 sentences, own words)
## What I actually did
## The trap the test sets
## How to explain it simply (3 lines)
## One problem I can now solve
## Cards made (wrong twice only)
```
