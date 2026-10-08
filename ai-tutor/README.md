# AI Tutor: How Studiolo Uses AI

Based on Nick Saraev's video ["AI can teach you almost ANYTHING. Here is how"](https://www.youtube.com/watch?v=FSXHk4hMrY8), adapted for any subject.

## The main idea

You learn by **producing** answers, not by **reading** them.

| Method | After 5 minutes | After 1 week |
|--------|----------------|--------------|
| Reread 4 times | 83% | 40% |
| Read once, then tested 3 times | 71% | 61% |

These numbers come from Roediger & Karpicke (2006), *Psychological Science* 17(3), 249–255
(<https://doi.org/10.1111/j.1467-9280.2006.01693.x>), which compared studying again and again
with testing again and again. If you quote them somewhere else, cite the paper, not this README.

Rereading feels like learning, but testing yourself is what actually builds memory. Most people
only use AI as an **Explainer**, and reading its explanation is still just reading. The other
nine roles make you do the work: recall, predict, explain, and build.

## The 10 roles

| Role | Use it when | What you produce | Where it goes |
|------|-------------|------------------|---------------|
| **Interviewer** | Day 1, or when you feel lost | Honest answers about your goal, level, and test format | `learner-map.md` → Intake |
| **Mapmaker** | Day 1, and the weekly re-plan | A topic map with dependencies and usual stuck points | `learner-map.md` → Map |
| **Explainer** | You're stuck on *one step* of a task | Nothing yet. **You redo the whole task from scratch afterwards.** | — |
| **Socratic questioner** | You think you understand a topic | Answers to "why" and "what if" questions | Gaps → mistake log |
| **Examiner** | At the end of every topic session | A level (0–5) from a quiz that gets harder as you go | `learner-map.md` → Level |
| **Checker** | You built or wrote something (a solution, essay, build, or cheat sheet) | Your own work, checked step by step | Fixes → redo the task |
| **Listener** | After a task, to teach it back | A voice note, a sketch, and a written explanation, all graded | Missed points → mistake log |
| **Diagnostician** | Weekly, and after every test | The misunderstanding behind your repeated mistakes | `learner-map.md` → Root causes |
| **Sparring partner** | Timed drills and pressure simulations | Fast answers under time pressure | Score → tracker |
| **Clerk** | At the end of a session | Tidy notes and Anki rows in **your own** words | Cheat sheets, Anki CSV |

The prompts for every role, ready to paste, are in [`prompts.md`](./prompts.md). The order you
use them in each day is in [`../study-plan.md`](../study-plan.md).

## Rules for using AI without it doing your learning for you

The video warns that AI can stop you from learning, the same way GPS makes you worse at finding
your way. Memory forms while you struggle. So:

1. **Struggle first.** Try the task or question on your own before you ask the Explainer. The
   default is 10 minutes. You can set your own time at intake, and only time spent actually
   working counts.
2. **Only ask about the part you're stuck on.** Never ask the AI for all the steps up front.
3. **Redo it from scratch without help.** After the Explainer gets you unstuck, start the task
   again from step 1 on your own. It takes a bit longer, but that's where it sticks.
4. **Don't trust facts from AI.** AI makes up numbers, dates, and details. Check every fact in an
   authoritative source for your subject before it goes on a card or cheat sheet.
5. **Don't accept "you're right".** AI tends to agree when you're only half right. Ask it what's
   wrong or missing first.
6. **The Clerk only organizes, it never adds.** Your notes and cards have to come from your own
   thinking.
7. **Stay just above your level.** If every question feels easy, make them harder. If you're
   guessing, go down a level.

## Practice app

The video also suggests getting AI to build you a practice app, so you can do quick drills and
show what you know with pictures, not just words. This repo has one:
[`../practice/index.html`](../practice/index.html). Open it in any browser. There's nothing to
install.

| Mode | What it's for |
|------|---------------|
| Exam sprint (2, 3, or 5 minutes per question, or no timer, with an "I guessed" box) | Examiner and Sparring practice under real test conditions |
| Pair picker (10 or 20 seconds per clue, or no timer) | Quickly telling apart the pairs your subject mixes up |
| Visual drills (place parts on a diagram, put steps in order) | Rebuilding a diagram or a sequence from memory |
| Flashcard blitz (choose `anki/*.csv` files to load) | Quick rounds on your own cards. Anki still schedules them. |
| Spaced review | Every miss or guess in the other drills comes back after 1, 3, 7, and 14 days |
| Progress & export | The Clerk's job: misses become mistake-log rows, anything missed twice becomes Anki rows, plus backup and restore |

**Spaced review** isn't from the video, it's something this repo adds. Every miss (and every "I
guessed") comes back after 1, 3, 7, and 14 days until you get it right each time. Topic reviews
in `learner-map.md` start with the same gaps, but only topics go on to 30 and 60 days, at levels
4 and 5. Getting a due item right in Spaced review moves it to the next gap. Missing it anywhere
brings it back tomorrow. Flashcard blitz answers aren't scheduled, because Anki handles those
cards. The schedule is worked out from your answer history, so it's included in a backup.

Your progress is only saved in this browser. To move it to another browser or computer, use
**Download backup** and **Restore** in Progress & export. The app also checks the `provenance`
block on every question. Anything marked `needs-check` gets a warning on screen, and a question
with no provenance at all won't load. A quiz that teaches wrong facts does more harm than having
no quiz.

The app can't interview you or grade written explanations, because there's no AI in it. The
Interviewer, Socratic, Listener, and Diagnostician roles still happen in an AI chat, or with an
agent that reads `AGENTS.md`. To add questions, add them to `practice/questions.js` (the rules
are in `AGENTS.md`).
