# The Study Plan

> The main idea: you learn by producing (recalling, explaining, applying), not by reading.
> The roles used here are described in [`ai-tutor/README.md`](./ai-tutor/README.md).

There's no fixed topic for each day. Every day, the learner map picks the topic and you run the
same session. The map gets better over time because the Examiner keeps updating your levels.

There are two ways to use it. The session is the same in both:

- **Exam track:** you have a real test date, and you finish with a final sprint.
- **Steady track:** there's no test, you're just learning (an instrument, a language, something
  you're curious about). Skip the final sprint. The weekly ritual is all the structure you need.

```text
Day 1          Interviewer → Mapmaker → find-my-level          (build the map)
Every day      daily session loop on the topic the map picks   (+ weekly ritual every 6th day)
Exam track     final sprint: practice tests → Diagnostician → targeted fixes → test
```

## Ground rules

- **25-minute blocks.** When the timer goes off, switch to the next thing. Don't spend more than
  25 minutes on one activity.
- **Struggle before you ask for help.** Work alone for 10 minutes before you go to the
  Explainer. You can change that time at intake, and only time spent actually working counts.
- **Redo it without help.** Whatever the Explainer helped with, do again from step 1 on your own.
- **Wrong twice, then a flashcard.** The Clerk only makes cards for mistakes you've made twice.
  If you agreed on a different number at intake, use that.
- **Check what the AI tells you.** Look up every number, date, and detail in an authoritative
  source before it goes on a card.
- **Commit the map.** At the end of every session, `git commit` your updated `learner-map.md`
  and logs.

## Day 1: build your map (60 to 75 minutes)

| Block | Role | What to do | Where it goes |
|-------|------|------------|---------------|
| 1 (20 min) | **Interviewer** | Run prompt §1. Be specific about your deadline, how much time you really have, and what you actually know versus what you've only seen. | `learner-map.md` → Intake |
| 2 (20 min) | **Examiner** ("find my level") | Run the "Find my level" prompt once per area, about 5 minutes each. | A rough level per topic |
| 3 (15 min) | **Mapmaker** | Run prompt §2 with your intake and levels. You get the topics, the usual stuck points, and one practice task per topic. | `learner-map.md` → Map and Next up, `labs/practice-library.md` |
| 4 (10 min) | Setup | Pick **one** main resource and **one** question bank (`resources.md`). Only install Anki if you want it. | — |

Low levels on day 1 are fine. They tell the map where to send you.

**The interview always comes first.** Until the Intake says `Status: done`, every AI study
session starts with the Interviewer. Agents do this because of `AGENTS.md`. In a plain AI chat,
the context block (`ai-tutor/prompts.md` §0) does it. An agent writes the intake, levels, and
Next up into `learner-map.md` for you. In a plain chat, you paste them in yourself. Working on
the template itself (reviews, fixes, docs) doesn't need an intake.

## Daily session loop (about 80 minutes)

Pick the topic with the rules in `learner-map.md` → "Picking today's topic", or just run
`python3 whats_due.py`, which applies them for you. Then open that topic's task in
[`labs/practice-library.md`](./labs/practice-library.md).

### Block A: review and first attempt (25 min)

1. **Spaced review** (10 min): do your due Anki cards, if you use Anki. Then for any topic whose
   **Next review** is today or earlier (`python3 whats_due.py` lists them), run a short Examiner
   quiz (prompt §5, stop at the first miss) and update its row. If the practice app's **Spaced
   review** tab has items due, do those too. They use the same first steps (1, 3, 7, and 14
   days), but for single questions instead of whole topics.
2. **Recall first** (2 min): write down 3 things you remember about today's topic without
   looking anything up.
3. **First attempt** (13 min): start the task's **Do it** step before reading or watching
   anything. You'll probably get stuck. That's expected.

### Block B: get unstuck, redo, break it (25 min)

4. **Explainer** (prompt §3): ask only about the exact step you're stuck on. If a whole idea is
   fuzzy, read **one short section** of your main resource instead.
5. **Redo from scratch**: start the task again from step 1, without help.
6. **Break it**: do the task's **Break it** step. Watch it fail, then fix it.

### Block C: explain and get tested (25 min)

7. **Socratic questioner** (prompt §4, 8 min): start with the task's **Socratic seed**.
8. **Listener** (prompt §7, 8 min): record a 2-minute voice note, draw a quick sketch, and write
   5 lines on the **Listener topic**. All three get graded.
9. **Examiner** (prompt §5, 9 min): a quiz on the **Examiner focus** that gets harder as you go.
   Run it in a fresh chat or a subagent that didn't see the lesson. Write the level, today's
   date, and the next review date into `learner-map.md`, and add one row to its **Review
   history**.

### Block D: wrap up (5 min)

10. Add every gap and miss to the mistake log (`templates.md` §2).
11. **Clerk** (prompt §10): anything you got wrong **twice** becomes a flashcard row. Your
    messy notes become an outline for that area's cheat sheet.
12. Tick the row in `daily-tracker.md`, then commit.

If the topic reaches level 4 or higher, the next session picks a new topic. If it's still below
3, the map will probably pick it again. That's fine, the second time goes much faster.

### Short-day fallback (25 min)

Bad day? Do step 1 of Block A (spaced review and any due Examiner checks). Then do one timed
**Exam sprint** in the practice app (`practice/index.html`, scope "My weak topics"), or one
Sparring round in a chat (prompt §9). It still counts. Mark it `[~]` in the tracker.

### Practice app in the daily session (optional, 5 min)

At the end of Block C, after the Examiner, do one **Pair picker** round on today's topic. Then
in Block D, export the misses (Progress & export → mistake-log rows). If the app marks something
`needs-check`, that fact hasn't been verified yet. Check it in your authoritative source before
it goes into your notes or cards.

## Weekly ritual (every 6th session, about 100 minutes)

| Block | Role | What to do |
|-------|------|------------|
| 1 (30 min) | **Sparring partner** | A mini-test on everything you've studied so far: an **Exam sprint** in the practice app, your question bank, or exam sparring (prompt §9). Go at real test pace. Then do one **Visual drill** for this week's area. |
| 2 (15 min) | **Diagnostician** | Export the app's misses first (Progress & export). Then run prompt §8 on this week's mistake log and mini-test misses. Write at most 3 root causes into `learner-map.md`. |
| 3 (25 min) | **Rebuild from memory, then Checker** | Rebuild your weakest task of the week from memory, with no notes and no AI. Then give your work to the Checker (prompt §6). |
| 4 (15 min) | **Clerk** | Turn the week's notes into a one-page cheat sheet for the areas you covered (blank templates are in [`cheatsheets/`](./cheatsheets/)). Then check every `[CHECK]` mark yourself in an authoritative source. |
| 5 (15 min) | **Mapmaker** | Re-map (prompt §2) with the new levels and root causes. Rewrite **Next up**, with the root-cause fix drills first. |

Optional: once a week, do a **pressure simulation** on a weak topic (prompt §9). It's the
closest thing to using the subject for real.

## Final sprint, exam track only (the last 6 days before the test)

| Day | Focus | Roles |
|-----|-------|-------|
| −6 | **Full practice test #1** in the real format and time, with no interruptions. Log every wrong answer **and** every lucky guess (`anki/practice-test-wrong-answer-log-template.md`). | Sparring, then **Diagnostician** on all misses |
| −5 | **Fix root cause #1.** Run the fix drill, redo the matching task, and get the Examiner to level 4. Then 20 questions on your weakest area. | Explainer (only if stuck), Socratic, Examiner |
| −4 | **Full practice test #2**, with different questions. Compare it with #1: do the same root causes show up? | Sparring, then **Diagnostician** (compare both) |
| −3 | **Fix root cause #2**, plus one pressure simulation on your weakest area. | Socratic, Sparring, Examiner |
| −2 | **Light review.** Your own cheat sheets and due flashcards only, no new cards. One Exam sprint in the practice app to stay sharp. | Examiner (due reviews only) |
| −1 | **Test day.** At most 30 minutes of cheat sheets, then stop. For logistics, see [`exam-day.md`](./exam-day.md). | — |

A low score on practice test #1 is normal. It gives the Diagnostician something to work with.
It doesn't predict your result.

### On the day of the test

- Pace yourself: total minutes divided by number of questions, from your Intake. That's the pace
  you practised in Sparring.
- Read each question twice. Look for words like *best*, *most likely*, *least*, *without*, and
  *only*.
- Rule out 2 options first. Flag the ones you're unsure about, but always answer if there's no
  penalty for wrong answers (check your test's rules).
- The ways you usually slip up are in your Intake. Watch for them.

## Steady track (no deadline)

Same daily session and weekly ritual, with a few differences:

- There's no final sprint and no countdown. The weekly ritual is all the structure you need.
- About every 4 weeks, run the Mapmaker over the whole map. Drop topics you don't need anymore
  and add the next part of the subject.
- Measure progress by your levels and cheat sheets, not by scores.

## What you need

| Part | What | Cost |
|------|------|------|
| Plan and memory | `learner-map.md`, committed to a private git repo | Free |
| AI tutor | Any AI chat with `ai-tutor/prompts.md`, or an agent that reads `AGENTS.md` | A free plan works |
| Practice | The tasks in `labs/practice-library.md` plus your own materials | Free |
| Practice app | `practice/index.html`: drills, plus export to the mistake log | Free |
| Flashcards | Anki, optional (decks are in `anki/`, and the app's Flashcard blitz reads the same CSVs without Anki) | Free |
| Voice notes | Your phone's voice recorder and voice-to-text | Free |
