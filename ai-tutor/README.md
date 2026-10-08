# AI Tutor: How This Study System Uses AI

Adapted from Nick Saraev, ["AI can teach you almost ANYTHING. Here is how"](https://www.youtube.com/watch?v=FSXHk4hMrY8), for any subject.

## The one idea that matters

You learn by **producing**, not by **consuming**.

| Method | After 5 minutes | After 1 week |
|--------|----------------|--------------|
| Reread 4 times | 83% | 40% |
| Read once + tested 3 times | 71% | 61% |

Rereading *feels* like learning. Testing *is* learning. Most people only use AI as an
**Explainer**, which is just another way to consume. The other nine roles make you produce:
recall, predict, explain, build.

## The 10 roles

| Role | Use it when | What you produce | Output goes to |
|------|-------------|------------------|----------------|
| **Interviewer** | Day 1, or when you feel lost | Honest answers about goal, level, test format | `learner-map.md` → Intake |
| **Mapmaker** | Day 1, and weekly re-plan | A topic map with dependencies and stuck points | `learner-map.md` → Map |
| **Explainer** | You're stuck on *one step* of a task | Nothing yet. **You must redo the task from scratch after** | — |
| **Socratic questioner** | You think you understand a topic | Answers to "why" and "what if" questions | Gaps → mistake log |
| **Examiner** | End of every topic session | A level score (0–5) from an escalating quiz | `learner-map.md` → Level |
| **Checker** | You built or wrote something (solution, essay, build, cheat sheet) | Your work, checked step by step | Fixes → redo the task |
| **Listener** | After a task: teach-back | A voice note, a sketch, and a written explanation, all graded | Missed points → mistake log |
| **Diagnostician** | Weekly, and after every test | The root misunderstanding behind repeated mistakes | `learner-map.md` → Root causes |
| **Sparring partner** | Timed drills, pressure simulations | Fast answers under time pressure | Score → tracker |
| **Clerk** | End of session | Clean notes and Anki rows from **your own** words | Cheat sheets, Anki CSV |

Copy-paste prompts for every role are in [`prompts.md`](./prompts.md). The daily order is in
[`../study-plan.md`](../study-plan.md).

## Rules (the case against AI)

The video warns that AI can kill learning, the same way GPS weakens your sense of direction.
Struggle is where memory forms. So:

1. **Struggle first.** Try the task or question alone for at least 10 minutes before asking the Explainer.
2. **Explain only the stuck part.** Never ask AI for the full task steps up front.
3. **Redo from scratch without help.** After the Explainer unblocks you, restart the task from step 1 alone. This costs about 10–15% extra time and is where the learning sticks.
4. **Don't trust AI facts.** AI invents numbers, dates, and details. Check every fact against an authoritative source for your subject before it goes on a card or cheat sheet.
5. **Don't accept "you're right".** AI agrees when you're half-right. Ask it to name what is wrong or missing first.
6. **Clerk organizes, never adds.** Notes and cards must come from your own thinking.
7. **Stay at the edge of your level.** If every question feels easy, raise the difficulty. If you're guessing, drop one level.

## Practice app

The video also suggests having AI build you practice apps, so you can blitz through drills
and show what you know visually, not only in words. This repo has one:
[`../practice/index.html`](../practice/index.html). Open it in any browser. There is nothing
to install.

| Mode | What it covers |
|------|----------------|
| Exam sprint (timed per question, "I guessed" flag) | Examiner + Sparring under real test conditions |
| Pair picker (10 s per clue) | Rapid retrieval of the pairs your subject confuses |
| Visual drills (place parts in a diagram, order the steps) | Showing what you know visually, not only in words |
| Flashcard blitz (loads `anki/*.csv`) | Spaced-repetition reps between Anki sessions |
| Spaced review | Every miss in any mode comes back after 1, 3, 7 and 14 days |
| Progress & export | Clerk: misses become mistake-log rows, and anything missed twice becomes Anki rows |

**Spaced review** is this repo's own addition, not from the video: every miss comes back
after 1, 3, 7 and 14 days until you've beaten it — the same ladder the map uses for topic
reviews in `learner-map.md`.

The app can't interview you or grade free-text explanations. It has no AI behind it, so the
Interviewer, Socratic, Listener, and Diagnostician roles still happen in an AI chat (or with
an agent that reads `AGENTS.md`). To add questions, append to `practice/questions.js`
(rules in `AGENTS.md`).
