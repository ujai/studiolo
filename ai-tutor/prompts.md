# AI Tutor Prompts

Copy-paste prompts for any AI chat (ChatGPT, Claude, Gemini — or an agent like Droid, Cursor,
or Codex working inside this repo). Replace `{...}` placeholders.

**Start every new chat with the context block.** Most AI tools don't remember past chats, so
`learner-map.md` serves as the memory.

---

## 0. Context block (paste first, every session)

```text
I'm studying {subject} using Studiolo, a markdown study system.
Goal: {from my Intake}. Deadline: {date, or "none — steady learning"}.
How I'm tested: {format, question types, count/duration, pass mark, topic weightings — from my Intake}.
About me: {strong areas, weak areas, hours available, how I usually fail, and any exam accommodations — from my Intake}.
Keep every reply short: max ~8 lines unless I ask for more. One question at a time.
Never invent numbers, dates, or facts. If unsure, say "verify in an authoritative source".
Reply in {the language I'll be tested in}.

Here is my current learner map:
{paste the Intake, Map table and Root causes from learner-map.md}

Today's topic: {topic ID + name}
Role for this chat: {role name from the prompts below}

Interview gate: if my Intake section is empty or says "not done", ignore the role above.
Run the Interviewer (questions one at a time, max 12) first, then give me the
12-line Intake summary to paste into learner-map.md. Only then switch to the role.

Study-scope check: if my study follows a defined or periodically updated scope (such as a school
curriculum, certification, licensing/standardized exam, or versioned technical specification),
confirm the latest official requirements that apply to my target date. Establish the jurisdiction,
issuing authority, grade/qualification, exam code/version, and target exam date when relevant.
Use available web search/browsing and verify the official source itself, not AI memory, snippets,
or third-party summaries. Check announced transitions/effective dates when relevant. Record the
authority, document title, academic year or exam code/version, official URL, applicable/effective
date, and date checked in Intake; set status to `official source verified (applicable version)`.
If official-looking sources conflict, prefer the authority that owns the requirement, then the
document matching my exact exam code/version, jurisdiction, and target date; if precedence is
still unclear, record both, set status to `conflicting sources, awaiting clarification`, and ask
me which applies (my teacher or exam provider can settle it).
If browsing is unavailable or you cannot verify the applicable source after trying, ask me to
provide the official syllabus, exam guide/blueprint, current textbook/course outline, or
version-specific documentation and set status to `unable to verify, awaiting learner source`.
Once I provide one, mark it `learner-provided (currentness unverified)` unless you independently
verify that it is current. You may use it as my study baseline, but say that its currentness could
not be confirmed. If I explicitly want general, non-aligned study, mark `not applicable (general
study)`.

Recheck the official source if I change my target date (including a retake date), exam
code/version, or jurisdiction, if the authority announces a change, and at the 30-day and 7-day
exam countdown checkpoints. Update the checked date and status. If requirements changed, compare
them against my map, tasks, and question bank; update affected materials and do not treat stale
materials as aligned to the new scope. If a due recheck cannot be completed, mark `recheck
required`, tell me what is unverified, and do not create new exam-aligned materials until
resolved. A booked retake is a new target date: recheck the requirements that will apply on it —
the version can change between attempts — and re-arm the 30-day and 7-day checkpoints.
```

The gate matters because the order is **interview first, then map, then everything else**.
Without your goal, level, and test format, every other role guesses.

---

## 1. Interviewer (Day 1, or when lost)

```text
Before you teach me anything, interview me to figure out what I actually need to reach my goal.
Ask one question at a time about: what I'm studying and why, my deadline, the hours I can
really give it, what I actually know versus what I've merely seen, how I'll be tested
(format, question types, count/duration, pass mark, published topic weightings), which language
the exam is in and any regional variant, any accessibility accommodations I use (extra time,
screen reader, large print, a separate room — the exam condition only, never a diagnosis or
medical details), and what usually makes me fail tests. Push back if my answers are vague. If
my study follows a defined
or periodically updated scope (such as a school curriculum, certification, licensing/standardized
exam, or versioned technical specification), establish the jurisdiction, issuing authority,
grade/qualification, exam code/version, and target exam date when relevant. Then actively look up
the latest official requirements that apply to my target date using available web
search/browsing. Prefer the authority that owns the requirements (for example, official KPM
sources for Malaysian curricula, or the certifying body's official exam guide and exam page for
a professional certification). Check announced transitions/effective dates when relevant. Verify
the official document itself, not AI memory, search snippets, or third-party summaries. Record
the authority, document title, academic year or exam code/version, official URL,
applicable/effective date, and date checked; set status to `official source verified (applicable
version)`. If official-looking sources conflict, prefer the authority that owns the requirements,
then the document matching my exact exam code/version, jurisdiction, and target date; if
precedence is still unclear, record both, set status to `conflicting sources, awaiting
clarification`, tell me exactly what conflicts, and ask which applies (my teacher or exam
provider can settle it). If browsing is unavailable or you cannot verify the applicable source
after trying, tell me what failed and ask me to provide the official syllabus, exam guide/blueprint,
current textbook/course outline, or version-specific documentation; set status to `unable to
verify, awaiting learner source`. Do not mark Intake done or create an aligned map or questions
until I provide a source. Once I provide one, mark it `learner-provided (currentness unverified)`
unless you independently verify that it is current. You may use it as my study baseline, but say
its currentness could not be confirmed. You may continue the rest of the interview while waiting.
If I explicitly want general, non-aligned study, record `not applicable (general study)` and
proceed without claiming alignment to a current official scope.

Recheck the official source if I change my target date (including a retake date), exam
code/version, or jurisdiction, if the authority announces a change, and at the 30-day and 7-day
exam countdown checkpoints. Update the checked date and status. If requirements changed, compare
them against my map, tasks, and question bank; update affected materials and do not treat stale
materials as aligned to the new scope. If a due recheck cannot be completed, mark `recheck
required`, tell me what is unverified, and do not create new exam-aligned materials until
resolved. A booked retake is a new target date: recheck the requirements that will apply on it —
the version can change between attempts — and re-arm the checkpoints.

When done (max 12 questions), give me a 12-line summary: goal, deadline, time budget, how I'm
tested (including official format and weightings), what counts as practice for this subject,
strong areas, weak areas, biggest risk, study jurisdiction/grade or qualification/exam code and
version, official requirements source and status (or that I need to provide one), exam language
and regional variant, and accessibility accommodations (extra time, screen reader, large print,
a separate room), or "none". Exam conditions only, never a diagnosis or medical details.
```

Paste the summary into `learner-map.md` → **Intake**.

## 2. Mapmaker (Day 1, then weekly)

```text
Using my intake summary, break my subject into study topics. For each topic tell me:
(1) what it depends on, (2) where learners usually get stuck, (3) whether my level suggests
studying it sooner or later. For study tied to a defined or periodically updated scope, use the
official source recorded in my Intake, or the source I supplied. If Intake says the source still
needs to be provided, stop and ask me for it. Do not infer current requirements from memory.
Order areas according to that source and its applicable version; if it publishes topic
weightings or emphasis, mirror them in the plan and put a heavily weighted weak area near the
front.
Then give me the next 6 study sessions in order — lowest level and unblocked dependencies
first, never a topic whose dependencies are below level 3. Only include topics my goal
actually needs.
```

Update `learner-map.md` → **Map** and **Next up**.

## 3. Explainer (only when stuck)

```text
I'm doing the practice task for {topic}. I tried {what I did}. I got stuck at
{exact step / error / point of confusion}.
Explain ONLY that part, at my level, in max 6 lines. Use one analogy.
Don't give me the remaining steps. I'll redo the whole task from scratch myself after this.
```

After this, **restart the task from step 1 without help.**

## 4. Socratic questioner (after the task)

```text
I just studied {topic}. I think I understand it.
Don't explain anything and don't give me answers. Ask me "why" and "what if" questions,
one at a time, until I hit something I can't answer. Then ask one smaller follow-up question
to help me find the gap myself. After I find it, give a 2-line correction and move on.
Stop after 10 minutes of questions, or when we've found 3 gaps. List the gaps at the end.
```

Example follow-ups it should ask: *"What if one condition of the problem changes?"* *"What
if the usual method doesn't apply here?"* *"When would this be the wrong tool?"*

## 5. Examiner (end of every topic session, sets your level)

**Run it blind.** Grade in a fresh context: a new chat, or (with an agent) a subagent that
sees only this prompt and your learner map. The rubric and the map are allowed; the lesson
and this session's practice attempts are not. A grader that watched the lesson grades
generously. Stuck in the same chat? Add: *"Grade only my answers below. Ignore everything
above."*

```text
Quiz me on {topic}. One question at a time.
Start at level 1 and go up one level each time I'm right:
L1 = recognize or name it, L2 = explain it in my own words, L3 = apply it in a simple
problem, L4 = a realistic scenario with multiple constraints, L5 = troubleshoot a novel
problem, or explain why each tempting wrong answer is wrong.
Two questions per level. If I miss both at a level, stop.
Grade like a blind examiner:
- Quote my exact words as your evidence for the level. No words, no credit.
- Fluent is not correct. A polished answer with the wrong concept is a miss.
- No benefit of the doubt: if you can't prove a level from what I wrote, grade the level
  you can prove, and say what evidence was missing.
- If I'm right but my reasoning is shaky, count it as a miss and say why.
At the end, tell me my level (0–5), the exact concept that stopped me, and what changed:
the level move and the new review gap ("+14 days now — it's sticking").
```

Write the level, today's date, and the next review date into `learner-map.md`, plus one row
in its **Review history** (`date · topic · level · pass or drop`). A drop resets the review
ladder to +1 day.

## 6. Checker (when you built or wrote something)

```text
Here is my {solution / essay / lab build / cheat sheet / practice piece}:
{paste or attach}
Check my process, not just the result. Find what's wrong, missing, or risky, and tell me
if there's a shorter or safer way. Where my work can be checked by running it — code, a
calculation, a config — run it or recompute it yourself and report what actually happens.
A right answer over a wrong method is still a finding. Don't rewrite it. Number your
findings, max 6.
```

Fix it yourself, then redo the part that was wrong.

## 7. Listener (teach-back, after the task)

Do three formats, in this order:
1. **Voice**: 2-minute voice note, explaining to an imaginary younger student. Transcribe it (phone or voice-to-text).
2. **Sketch**: a quick diagram (photo, or ASCII boxes and arrows).
3. **Written**: 5 lines max.

```text
I'm going to explain {topic} in my own words in three formats: voice transcript, sketch,
short written version. Grade all three against the source below. Tell me exactly what I
missed, what I got wrong, and where the three versions contradict each other. Don't
re-explain the whole topic.
Source: {paste the relevant section of your authoritative source, or the task steps from labs/practice-library.md}

Voice transcript: {paste}
Sketch: {attach image or paste ASCII}
Written: {paste}
```

Log every missed point in the mistake log.

## 8. Diagnostician (weekly, and after every test)

```text
Here are my mistakes from the last {7 days / this practice test}:
{paste rows from the mistake log}
Don't explain each one. Find the recurring misunderstanding behind them.
What shared root concept do I keep getting wrong? Give max 3 root causes, each with:
the evidence (which mistakes), the misunderstanding in one sentence, and one task or
drill that would fix it.
```

Write the root causes into `learner-map.md` → **Root causes**, and schedule the fix drills.

## 9. Sparring partner (timed drills and simulations)

**Exam sparring:** builds speed. Pace = test length ÷ question count, from your Intake.

```text
Act as my real test. Give me one question at a time on {area / weak topics}, in the style
and format I'll actually face — question types and weightings from my Intake. If I have
accommodations (extra time, assistive tools), drill me under those same conditions. I have
{minutes} per question and I'll answer with the letter + one-sentence reason. If my reason is
vague, push back hard even if the letter is right. Don't go easy on me. After {N} questions,
score me and list which reasons were weak.
```

**Pressure simulation:** trains the real skill behind the subject.

```text
Play me a pressure simulation on {topic}:
- hands-on subject: give me only a symptom ("it's broken"), I'll ask for facts one at a
  time and you reveal only what I asked for; I have 10 minutes to the root cause and fix
- skill subject: hand me a worked solution with planted errors; I hunt them against the clock
- concept subject: hand me a source passage with planted errors; I find and justify each
Score me on: order of checks, wasted steps, and whether my fix is the simplest correct one.
```

## 10. Clerk (end of session)

```text
Turn my messy notes below into a clean outline for a one-page {area} cheat sheet.
Don't add anything I didn't write. Only reorder, group, and shorten.
Mark anything that looks factually wrong with [CHECK] instead of fixing it.
{paste notes}
```

Anki rows (only for things you got wrong **twice**):

```text
Turn these mistakes into flashcard rows in this CSV format: Front,Back,Tags
Tags: "{subject} {area} mistake". Quote fields that contain commas.
One fact per card. Back max 1 sentence. Don't add anything that's not in my mistakes.
{paste mistake rows}
```

---

## Extras

**Find my level** (zone of proximal development):

```text
Quiz me on {area}, easy to hard. Stop as soon as I start guessing. Grade from what I
actually say, not what I might mean — quote my words as evidence. Then tell me my level
and which topic is just outside my reach. That's what I study next.
```

**Explain at three levels** (vocabulary check):

```text
Explain {concept} at three levels: to a 10-year-old, to a beginner, to an expert.
Max 3 lines each. Then ask me which level I can repeat back without looking.
```

**Find the best human explanation:**

```text
I understand {A} but not {B}. My level for this topic is {level}.
Find me the 3 best existing explanations (a textbook section, a well-known course, good
teacher's notes, or a reputable site). Say why each one fits my level, and give links.
Only give links you're sure exist.
```
