# Studiolo

> A small study system in plain Markdown files. Any subject, any age.

A *studiolo* was a private study room in Renaissance Italy, where a scholar kept their books,
maps, and tools. This repo is that room for you. You open it with an AI agent, and the agent
becomes a tutor that keeps asking you to answer, explain, and build things yourself instead of
just explaining things to you.

## Why I made this

Most studying is rereading, highlighting, and rewatching. It feels productive, but rereading
mostly makes the material look familiar. It doesn't train you to recall it. What actually
helps you remember is pulling the answer out of your own head: recalling it, explaining it,
using it, getting it wrong, and fixing it.

Most people also use AI as an explainer, and reading an explanation is still just reading.
Studiolo gives the AI other jobs: interviewing you, quizzing you, asking you "why", timing you,
and finding the pattern behind your mistakes.

## What's inside

| File or folder | What it's for |
|----------------|---------------|
| `learner-map.md` | The main file. Your intake answers, topics, levels (0–5), dependencies, review dates, review history, and root causes. |
| `whats_due.py` | Prints today's plan: due reviews (at most 3 on a backlog day), the next topic, fix drills, days to your deadline, your 30-day review pass rate, and mistake-log counts. `--check` validates the map. |
| `study-plan.md` | The daily session, the weekly ritual (a bigger review every 6th session), and the final sprint before a test. |
| `ai-tutor/` | The 10 AI roles, with prompts you can paste into any AI chat. |
| `practice/` | A practice app with no install: timed questions, pair drills, diagrams, spaced review, flashcards, and backup/restore. |
| `labs/practice-library.md` | One practice task per topic: do it, break it, fix it. |
| `mistake-log.md` | Every miss and why it happened. Get something wrong twice and it becomes a flashcard. |
| `templates.md`, `daily-tracker.md` | Formats for session notes, the mistake log, and the weekly ritual, plus a tick-box tracker. |
| `cheatsheets/` | One blank page per area that you fill in from memory. |
| `exam-day.md` | Booking the test, checking the syllabus at 30 and 7 days out, the test day itself, and retakes. |
| `anki/` and `import_anki.py` | Optional Anki decks. Import the CSVs into Anki yourself, or sync them with the script. |
| `generate_topics.py` | Rebuilds `practice/topics.js` from the map, so the app and the map always list the same topics. |
| `docs/learning-science.md` | The research behind each rule. |

![The practice app showing a diagram drill from the starter set](./docs/screenshot-drill.png)

## Getting started (about 5 minutes)

1. **Make your own private copy.** Click **Use this template** and pick **Private**, or clone
   it into a new private repo. Don't fork it: a fork of a public repo is always public, and
   your copy will hold your own study data.
2. **Open the folder in an AI coding agent** (Droid, Claude Code, Cursor, Codex, or anything
   else that reads `AGENTS.md`) and say *"Help me study."*

   The agent starts as the Interviewer. It asks up to 12 questions about your subject, your
   deadline, your level, and how you'll be tested. If you're studying for something with an
   official syllabus that changes over time, like a school curriculum or a professional
   certification, it looks up the current official requirements for your test date. If it
   can't confirm them, it asks you for the syllabus, exam guide, or course materials before it
   builds anything.

   After that it builds your learner map, question bank, and practice tasks.
3. **Every day after that,** run `python3 whats_due.py` (or ask your agent) and do what it
   says. A session takes 30 to 80 minutes. Until the Intake in `learner-map.md` says
   `Status: done`, the script only reminds you to do the interview first.

Don't have an agent? Fill in `learner-map.md` yourself and paste the prompts from
`ai-tutor/prompts.md` into any AI chat. The map, the daily plan, and the practice app all work
without one.

## How a session works

Every session follows the same steps. The map picks the topic.

```
due reviews → recall 3 things from memory → try the task → get help on ONE stuck step →
redo it from scratch → break it on purpose → get quizzed (level 0–5) → log mistakes → commit
```

The rules:

- **Recall before you review.** Try to come up with the answer before you open your notes.
- **Wrong twice, then a flashcard.** Only mistakes you make twice become cards, so your deck
  stays small.
- **Spaced reviews.** A missed question comes back after 1, 3, 7, and then 14 days. Topics
  work the same way, but they can go longer: each time you pass a topic review, the next one
  is further out, up to 30 days at level 4 and 60 days at level 5. If your level drops, the
  topic comes back the next day. If you fall behind, `whats_due.py` only shows the 3 most
  overdue reviews and moves the rest to tomorrow, so a backlog doesn't swamp you. The practice
  app does the same 1, 3, 7, 14 days for single questions. A question you miss, or get right
  but mark "I guessed", comes back the next day. Flashcard blitz is the exception, because
  Anki schedules your cards.
- **Struggle first.** Work on it alone for 10 minutes before you ask for help. You can pick a
  different time at intake, and only time spent actually working counts. When you do ask, the
  Explainer only explains the one step you're stuck on, in 6 lines or fewer. Then you redo
  the whole task yourself.
- **Explain it simply.** If you can't explain it in simple words, you don't know it yet.

## What it works for

| What you're studying | What practice looks like |
|----------------------|--------------------------|
| School subjects (history, biology, and so on) | recalling with the book closed, timelines, cause and effect, essays, teaching it back |
| University courses | past-paper problems, derivations, finding errors in worked solutions |
| Professional certifications (cloud, networking, accounting, and so on) | scenario questions, build-and-break labs, troubleshooting drills |
| Languages | speaking and writing from prompts, unscripted conversation, drills |
| Skills (music, chess, art) | doing it, finding the weak part, fixing it |

The Interviewer fits the plan to you and your subject. A 12-year-old's math map won't look like
a sysadmin's certification map, but the system is the same.

## What you need

- Any AI chat (a free plan works), or an AI coding agent if you want it to do the setup for you
- Python 3.9 or newer for `whats_due.py`, `generate_topics.py`, and `import_anki.py`. They only
  use the standard library, so there's nothing to install.
- Anki, if you want it. Import `anki/*.csv` with File → Import, or use `import_anki.py` (which
  needs the `anki` Python package).
- A recent browser (Chrome, Edge, Firefox, or Safari) for the practice app
- That's it. There's no server, account, build step, or API key. Double-click
  `practice/index.html` to open the app.

## Working on the template

Changes to the template are welcome. The rules are in [CONTRIBUTING.md](./CONTRIBUTING.md).
Security problems go through the private reporting in [SECURITY.md](./SECURITY.md) instead of a
public issue, and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) says how we treat each other.

Run these before you commit:

```bash
python3 -m unittest discover -s tests    # tests for the queue, Anki sync, and generated topics
python3 whats_due.py --check             # learner-map.md is valid
python3 generate_topics.py --check       # practice/topics.js matches learner-map.md
```

Then double-click `practice/index.html` and click through every tab. The app is plain
HTML, CSS, and JavaScript with no build step, so opening it straight from the file is the real
test.

## FAQ

**Do I need to know how to code?** No. Everything is Markdown files, and your agent can edit
them for you.

**Where do the practice questions come from?** After the interview, your agent writes them into
`practice/questions.js` from your actual syllabus, using the format in `AGENTS.md`. Each question
is written from scratch. None are copied from real exams or paid question banks. Each one also
lists the source that backs up its answer. The starter questions are about the learning science
this system uses.

**Is this just Anki?** No. Anki is good at keeping facts you've already learned. Studiolo
decides what to study today and how hard, makes you write out full answers, and finds the
cause behind repeated mistakes. Only the mistakes you keep making end up as Anki cards.

**What about my data?** The practice app and the scripts never send anything anywhere, and
there's no tracking. Your data only leaves your computer when you send it: when you paste it
into an AI chat, when your agent searches the web, or when you push your repo. A few things to
know:

- The practice app saves progress in the browser you use, on that device only. To move it, use
  **Progress & export → Download backup**, and keep that file private.
- Anything you paste into an AI chat goes to that AI company. Don't paste anything you wouldn't
  show a tutor, and never publish your learner map, mistake log, or tracker.
- Only write down the exam conditions you actually get, like extra time, a screen reader, or a
  separate room. Your map needs the condition, not the reason, so leave any diagnosis or medical
  details out of both the map and the chat.
- If you're studying for school, your school's rules come first. Ask a teacher, parent, or
  guardian before you paste schoolwork into a chat.
- If you want to make your copy public, only publish it while the learner files are still
  blank, or if they were never committed. Git keeps every old version, so deleting your rows
  later doesn't remove them from the history. Your commit name and email are public too.

**I'm a teacher. Can I use this with a class?** Yes. Run the Interviewer and Mapmaker once with
your syllabus, then give each student a copy of that map. They and their agents take it from
there. Each student's work stays in their own private copy. Check your school's rules on student
data and AI tools first, and get sign-off from whoever owns them: what students may paste into a
chat differs between schools and countries.

## Where it came from

I built this from a repo I used every day for several weeks while preparing for the AWS
CloudOps Engineer Associate exam, then made it work for any subject. The 10 AI roles come from
Nick Saraev's video ["AI can teach you almost ANYTHING"](https://www.youtube.com/watch?v=FSXHk4hMrY8).
The method itself is standard learning science: practice recalling, space your reviews, mix
similar topics together, and keep the work a bit hard. *Make It Stick* by Brown, Roediger, and
McDaniel explains it well, and [docs/learning-science.md](./docs/learning-science.md) lists the
research behind each rule.

## License

MIT. See [LICENSE](./LICENSE).
