# The Study Plan (Learner-Map Driven)

> Core principle: learning comes from producing (recall, explain, apply), not consuming.
> Based on the AI learning roles in [`ai-tutor/README.md`](./ai-tutor/README.md).

This plan doesn't assign a fixed topic to each day. Each day the learner map tells you the
topic, and you run the same session loop. The map gets smarter every day because the Examiner
keeps updating your levels.

Two tracks, same loop:

- **Exam track** — you have a real deadline. End with a final sprint.
- **Steady track** — no test, just learning (an instrument, a language, curiosity). Skip the
  final sprint; the weekly ritual is the whole system.

```text
Day 1          Interviewer → Mapmaker → find-my-level          (build the map)
Every day      daily session loop on the topic the map picks   (+ weekly ritual every 6th day)
Exam track     final sprint: practice tests → Diagnostician → targeted fixes → test
```

## Rules of engagement

- **25-min blocks**: when the timer rings, switch activity. Never more than 25 min on one thing.
- **Struggle before help**: a set window alone before you ask the Explainer — 10 minutes by
  default, yours to change at intake, and it only counts while you're actually working.
- **Redo without help**: whatever the Explainer helped with, redo from step 1 alone.
- **Wrong twice = flashcard**: the Clerk only makes cards for repeated mistakes. Twice is the
  default threshold; if you agreed on a different one at intake, that's the rule.
- **Check AI facts**: verify every number, date, and detail in an authoritative source before it goes on a card.
- **Commit the map**: `git commit` your updated `learner-map.md` and logs at the end of every session.

## Day 1 — Intake: build your map (~60–75 min)

| Block | Role | Do this | Record in |
|-------|------|---------|-----------|
| 1 (20 min) | **Interviewer** | Run prompt §1. Be specific: deadline, real time budget, what you actually know vs have merely seen. | `learner-map.md` → Intake |
| 2 (20 min) | **Examiner** ("find my level") | Run the "Find my level" extra prompt once per area, ~5 min each. | Rough Level per topic |
| 3 (15 min) | **Mapmaker** | Run prompt §2 with your intake + levels. Get the topics, stuck points, and one practice task per topic written. | `learner-map.md` → Next up, `labs/practice-library.md` |
| 4 (10 min) | Setup | Pick **one** main resource and **one** question bank (`resources.md`). Install Anki only if you want it. | — |

Low levels on Day 1 are good news: the map now knows where to send you.

**The interview is gated.** Until Intake says `Status: done`, any AI study session starts with the
Interviewer — agents via `AGENTS.md`, plain chats via the context block
(`ai-tutor/prompts.md` §0). With an agent, the intake, levels, and Next up get written into
`learner-map.md` for you. With a plain chat, you paste them in yourself. Reviews, debugging,
and other template maintenance do not require learner intake.

## Daily session loop (~80 min)

Pick the topic using the rules in `learner-map.md` → "Picking today's topic" — or just run
`python3 whats_due.py`, which applies them for you. Open its practice task in
[`labs/practice-library.md`](./labs/practice-library.md).

### Block A — Review + cold attempt (25 min)

1. **Spaced review** (10 min): Anki due cards, if you use Anki. Then, for any topic whose
   **Next review** is today or earlier (`python3 whats_due.py` lists them), run a short
   Examiner (prompt §5, stop at the first miss) and update its row. If the practice app's
   **Spaced review** tab has items due, clear those in the same block — same ladder, different
   deck.
2. **Recall before review** (2 min): write 3 things you remember about today's topic, without looking.
3. **Cold attempt** (13 min): start the task's **Do it** step cold, before any tutorial. Get stuck. That's the point.

### Block B — Unblock + redo + break (25 min)

4. **Explainer** (prompt §3): only for the exact step you're stuck on. If a concept is fuzzy,
   read **one short section** of your main resource instead.
5. **Redo from scratch**: restart the task from step 1 without help.
6. **Break it**: do the task's **Break it** step, watch it fail, fix it.

### Block C — Produce (25 min)

7. **Socratic questioner** (prompt §4, 8 min): start with the task's **Socratic seed**.
8. **Listener** (prompt §7, 8 min): 2-min voice note + quick sketch + 5-line written version
   of the **Listener topic**, all graded.
9. **Examiner** (prompt §5, 9 min): escalating quiz on the **Examiner focus**. Write the
   level, today's date, and the next review date into `learner-map.md`.

### Block D — Clerk + log (5 min)

10. Log every gap and miss in the mistake log (`templates.md` §2).
11. **Clerk** (prompt §10): anything wrong **twice** becomes a flashcard row. Messy notes go
    into an outline for that area's cheat sheet.
12. Tick the row in `daily-tracker.md`. Commit.

**If the topic reaches level 4+**, the next session picks a new topic. **If it's still below
3**, the map will likely pick it again. That's fine — the second pass is much faster.

### Short-day fallback (25 min)

Bad day? Do Block A step 1 (spaced review + due Examiner checks), then one timed **Exam
sprint** in the practice app (`practice/index.html`, scope "My weak topics"), or one Sparring
round in a chat (prompt §9). It still counts. Mark it `[~]` in the tracker.

### Practice app in the daily loop (optional, 5 min)

On a session day, add one **Pair picker** round on today's topic at the end of Block C, after
the Examiner. Then export the misses (Progress & export → mistake-log rows) during Block D.
Anything the app flagged as `needs-check` is a fact you haven't verified yet: check it in your
authoritative source before it goes into your notes or cards.

## Weekly ritual (every 6th session, ~100 min)

| Block | Role | Do this |
|-------|------|---------|
| 1 (30 min) | **Sparring partner** | Mini-test on everything studied so far: practice app **Exam sprint**, your question bank, or exam sparring (prompt §9). Real pace. Then one **Visual drill** for the week's area. |
| 2 (15 min) | **Diagnostician** | Export the app's misses first (Progress & export). Then run prompt §8 on this week's mistake log + mini-test misses. Write max 3 root causes into `learner-map.md`. |
| 3 (25 min) | **Rebuild from memory → Checker** | Rebuild the weakest task of the week from memory. No notes, no AI. Then paste your work to the Checker (prompt §6). |
| 4 (15 min) | **Clerk** | Turn the week's notes into a one-page cheat sheet for the area(s) you covered (blank templates in [`cheatsheets/`](./cheatsheets/)). Then **you** check every `[CHECK]` mark in an authoritative source. |
| 5 (15 min) | **Mapmaker** | Re-map (prompt §2) with the new levels + root causes. Rewrite **Next up**. Put root-cause fix drills at the front of the queue. |

Optional, any time: one **pressure simulation** per week on a weak topic (prompt §9) — the
closest thing to doing the subject for real.

## Final sprint — exam track only (last ~6 days before the test)

| Day | Focus | Roles |
|-----|-------|-------|
| −6 | **Full practice test #1**: real format, real time, no interruptions. Log every wrong **and** every guessed-right answer (`anki/practice-test-wrong-answer-log-template.md`). | Sparring → **Diagnostician** on all misses |
| −5 | **Fix root cause #1**: run the fix drill, redo the matching task, Examiner to level 4. Then 20 questions on the weakest area. | Explainer (only if stuck), Socratic, Examiner |
| −4 | **Full practice test #2**: a different set. Compare with #1: are the same root causes showing up? | Sparring → **Diagnostician** (compare both) |
| −3 | **Fix root cause #2** + one pressure simulation on the weakest area. | Socratic, Sparring, Examiner |
| −2 | **Light review**: your own cheat sheets, due flashcards only. No new cards. One practice app Exam sprint to stay sharp. | Examiner (due reviews only) |
| −1 | **Test day**: 30 min of cheat sheets max, then stop. Logistics: [`exam-day.md`](./exam-day.md). | — |

A low score on practice test #1 is normal — it's data for the Diagnostician, not a report card.

### Test strategy (test day)

- Pace: total minutes ÷ question count, from your Intake. Sparring practised exactly this.
- Read each question twice. Hunt the constraint words: *best*, *most likely*, *least*,
  *without*, *only*.
- Eliminate 2 options first. Flag if unsure, but always answer if there's no penalty for
  guessing (verify your test's rules).
- Your known failure modes are in the Intake. Counter them deliberately.

## Steady track (no deadline)

Same daily loop, same weekly ritual. Differences:

- No final sprint, no countdown. The weekly ritual is the whole system.
- Every ~4 weeks: run the Mapmaker over the whole map, retire topics you no longer need, and
  add the next stretch of the subject.
- Progress = levels and cheat sheets, not scores.

## What you need

| Layer | What | Cost |
|-------|------|------|
| Plan + memory | `learner-map.md` (committed to a private git repo) | Free |
| AI tutor | Any AI chat + `ai-tutor/prompts.md`, or an agent reading `AGENTS.md` | Free tier OK |
| Practice | Tasks in `labs/practice-library.md` + your own materials | Free |
| Practice app | `practice/index.html`: drills + export to the mistake log | Free |
| Flashcards | Anki, optional (decks in `anki/`; the app's blitz reads the CSVs even without Anki) | Free |
| Voice notes | Phone voice recorder + voice-to-text | Free |
