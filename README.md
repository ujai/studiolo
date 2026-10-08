# Studiolo

> Your own little study. An AI-driven study system in plain markdown — any subject, any age.

A *studiolo* was a Renaissance scholar's private study: one small room holding their books,
maps, and instruments. This is yours — a folder your AI agent turns into a tutor that makes you
**produce** answers instead of consuming explanations.

## Why this exists

Most studying is rereading, highlighting, and rewatching. It feels like learning, but the
research is blunt: rereading mostly builds *familiarity*, not *recall*. What encodes memory is
producing — retrieving, explaining, applying, failing, fixing.

And most people use AI exactly backwards: as an Explainer, which is just another way to
consume. Studiolo puts AI to work on the jobs that make *you* work: interviewer, examiner,
Socratic questioner, sparring partner, diagnostician, clerk.

## What's inside

| Piece | What it does |
|-------|--------------|
| `learner-map.md` | Source of truth: intake, topics, levels (0–5), dependencies, spaced review dates, review history, root causes |
| `whats_due.py` | Prints today's queue: due reviews (capped at 3 on backlog days), next topic, priority fix drills, deadline countdown, 30-day review pass rate, mistake-log counts (`--check` validates the map) |
| `study-plan.md` | The daily session loop, the weekly ritual, and the final sprint before a test |
| `ai-tutor/` | The 10 AI roles, with copy-paste prompts for any AI chat |
| `practice/` | No-build practice app: timed sprints, pair drills, visual drills, spaced review, flashcard blitz, backup/restore |
| `labs/practice-library.md` | One hands-on task per topic: do it, break it, fix it |
| `mistake-log.md` | Every miss with the *why*. Wrong twice → becomes a flashcard |
| `templates.md`, `daily-tracker.md` | Session, mistake-log, and weekly-ritual formats; the tick-box progress tracker |
| `cheatsheets/` | One blank page per area, filled from your own head |
| `exam-day.md` | Registration, scope re-checks at 30 and 7 days, test-day logistics, retakes |
| `anki/` + `import_anki.py` | Optional Anki sync — or import the CSVs straight into Anki |
| `generate_topics.py` | Regenerates `practice/topics.js` from the map, so the app and the map can't drift apart |
| `docs/learning-science.md` | The research behind each rule |

![The practice app: a visual drill from the starter set](./docs/screenshot-drill.png)

## Quickstart (5 minutes)

1. **Get your own copy** — fork, "Use this template", or clone. Keep it private: it will hold
   your personal learning data.
2. **Open the folder in an AI coding agent** (Droid, Claude Code, Cursor, Codex — anything that
   reads `AGENTS.md`) and say: *"Help me study."*
   The **Interviewer** fires first: up to 12 questions about your subject, deadline, level,
   and how you'll be tested. For subjects or exams with a defined, changing scope (including
   school curricula and professional certifications), it checks the latest official requirements
   that apply to your target date when web lookup is available. If it cannot verify the source,
   it asks you to provide the syllabus, exam guide, or current course materials before building
   an aligned map and practice tasks.
   Then the agent builds your learner map, question bank, and practice tasks.
3. **Every day after**: run `python3 whats_due.py` (or just ask your agent) and do what the
   queue says. 30–80 minutes. Until Intake says `Status: done`, the script only reminds you to
   run the Interviewer.

No agent? Fill in `learner-map.md` yourself and paste the role prompts from
`ai-tutor/prompts.md` into any AI chat. The map, the daily queue, and the practice app all
work without an agent too.

## How it works

The daily loop is the same every session; the map decides the topic:

```
due reviews → recall 3 things cold → attempt the task → unblock ONE step →
redo from scratch → break it on purpose → get examined (level 0–5) → log the misses → commit
```

The rules that make it stick:

- **Recall before review.** Try to produce it before you open your notes.
- **Wrong twice = flashcard.** Only repeated misses become cards. No card spam.
- **The ladder.** Miss a question → it returns after 1, 3, 7, then 14 days. Topics too: pass an
  Examiner review and the next review moves further out — a level-4 topic stretches to 30 days,
  a level-5 one to 60; drop a level and it's back tomorrow. A backlog is met with amnesty:
  `whats_due.py` caps a pile of overdue reviews at three and sends the rest to tomorrow, not to
  a guilt list. The practice app runs its own 1/3/7/14 ladder over questions: miss a question (or
  get it right but tick "I guessed") in any drill and it comes back tomorrow. Flashcard blitz
  is the exception: Anki schedules the cards.
- **Struggle first.** Ten minutes alone before you may ask for help — the window is yours to set
  at intake, and it only counts while you're actually working. The Explainer role answers
  only the one stuck step, in six lines or fewer, then you redo everything yourself.
- **Teach it simply.** If you can't explain it simply, you don't know it yet.

## Works for

| You are studying | "Produce" means |
|------------------|-----------------|
| School subjects (history, biology, …) | closed-book recall, timelines, cause→effect chains, essays, teach-back |
| University courses | past-paper problems, derivations, error-hunting in worked solutions |
| Professional certs (cloud, networking, accounting, …) | scenario questions, build-break-fix labs, incident drills |
| Languages | speaking and writing from prompts, unscripted conversation, drills |
| Anything skill-based (music, chess, art) | perform it, break it down, fix the weak step |

The Interviewer adapts the plan to the subject and the learner. A 12-year-old's math map looks
different from a sysadmin's cert map. The system is the same.

## Requirements

- Any AI chat (free tier is fine), or an AI coding agent for the automated flow
- Python 3.9+ for `whats_due.py`, `generate_topics.py` and `import_anki.py` — standard library
  only, nothing to install
- Anki, optional — import `anki/*.csv` directly (File → Import), or let `import_anki.py` do it
  (that script needs the `anki` Python package)
- A current browser (any recent Chrome, Edge, Firefox, or Safari) for the practice app
- Nothing else. No server, no accounts, no build step, no API keys. `practice/index.html`
  opens with a double-click.

## Developing

Template changes are welcome — the rules are in [CONTRIBUTING.md](./CONTRIBUTING.md). Before you
commit, run the checks:

```bash
python3 -m unittest discover -s tests    # queue, Anki sync, and generated-metadata tests
python3 whats_due.py --check             # learner-map.md is valid
python3 generate_topics.py --check       # practice/topics.js matches learner-map.md
```

Then open `practice/index.html` with a double-click and click through the tabs. The app is plain
HTML/CSS/JS with no build step, so that file:// check is the real test.

## FAQ

**Do I need to know how to code?** No. You edit markdown files — or don't even do that: your
agent does the writing, you do the learning.

**Where do the practice questions come from?** Your agent generates them into
`practice/questions.js` after intake, from your actual syllabus, following the schemas in
`AGENTS.md`. Every question is written as an original — never copied from real, NDA'd, or
copyrighted exam banks — and carries provenance pointing at the source behind it. The starter
set teaches the learning science the system is built on.

**Is this just Anki?** No. Anki stores facts you already have. Studiolo decides *what to study
today* and at what difficulty, makes you produce full answers, finds the root cause behind
your mistakes, and only then feeds the survivors into cards.

**What about my data?** The repo holds markdown files and the app keeps its progress in this
browser's storage — nothing is uploaded, and there is no telemetry. Two things to know:

- Browser progress lives per browser and per device. Use **Progress & export → Download backup**
  to move it, and keep the backup private.
- "Local" covers the repo, not your AI. Whatever you paste into an AI chat goes to that
  provider. Don't paste anything you wouldn't share with a tutor, and never publish your
  learner map, mistake log, or tracker.
- Want to share your copy publicly? Publish only a copy whose learner files are still blank, or
  were never committed. Git keeps every old version, so deleting your rows later doesn't remove
  them from the history. Your commit name and email are public too.

**A teacher, can I use this for a whole class?** Yes — run the Interviewer and Mapmaker once
against your syllabus, then hand each student the pre-mapped copy. They (and their agents)
take it from there.

## Origin and credits

Built by generalizing a real, working instance: an AWS CloudOps Engineer Associate exam-prep
repo used daily through a weeks-long sprint. The 10-role AI tutoring framework comes from
Nick Saraev's ["AI can teach you almost ANYTHING"](https://www.youtube.com/watch?v=FSXHk4hMrY8),
and the method is standard learning science: retrieval practice, spacing, interleaving,
desirable difficulty (see *Make It Stick*, Brown, Roediger & McDaniel — and
[docs/learning-science.md](./docs/learning-science.md) for the source behind each rule).

## License

MIT — see [LICENSE](./LICENSE).
