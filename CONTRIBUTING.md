# Contributing

Studiolo has two kinds of content, and they follow different rules.

## The engine (contributions welcome)

`whats_due.py`, `generate_topics.py`, `import_anki.py`, `practice/` (HTML, CSS, JS),
`tests/`, `AGENTS.md`, `ai-tutor/`, `study-plan.md`, `templates.md`, `exam-day.md`,
`resources.md`, `docs/learning-science.md`, the READMEs (root, `practice/`, `anki/`,
`cheatsheets/`), and the `learner-map.md` schema (the format, not the rows).

Rules:

- **Keep it generic.** No subject-specific content in the template. The starter instance
  (topics 1.1 / 1.2, the learning-science demo) is the only content that ships, because it
  teaches the method itself.
- **Keep it dependency-free.** Python 3.9+ stdlib only. Static HTML only. No build steps,
  servers, accounts, or API keys. If it can't run on a school laptop or a phone hotspot,
  it doesn't ship. Keep the practice app as plain classic scripts, one concern per file
  (`core.js` pure helpers, `storage.js` persistence, `ui.js` shared widgets, then one file
  per tab, and `app.js` for boot and Progress).
- **Keep the AI roles honest.** Any change that makes the AI hand over answers more easily
  is a bug. The system works because it makes the learner produce.
- **Write for a 12-year-old too.** Short sentences, simple words, no unexplained jargon.
  Half the audience is not a developer.
- **Never invent a fact.** Practice items carry a `provenance` block with sources and a
  `verified_on` date; `core.js` refuses to load an item without one. If you can't cite it,
  mark it `needs-check` instead of `verified`.

## Checks to run before a PR

```bash
python3 -m unittest discover -s tests    # queue, Anki sync, generated-metadata tests
python3 whats_due.py --check             # learner-map.md parses and validates
python3 generate_topics.py --check       # practice/topics.js matches learner-map.md
```

Then open `practice/index.html` by double-click and click through every tab: the app must work
from `file://` with no server and no build step. Two files are generated and must not be hand
edited: `practice/topics.js` (run `python3 generate_topics.py`) and anything under `__pycache__/`.

## Your instance (don't PR this)

Your learner map, mistake log, daily tracker, generated questions, cards, cheat sheets, and
logs are personal data. They belong in your private copy. Don't open PRs with your own study
content.

## Starter-instance content

Fixes and additions to the learning-science demo (`practice/questions.js` topics 1.1 / 1.2,
`anki/starter-deck.csv`) are welcome, with one rule: every fact must be uncontroversial,
textbook-level learning science, with no invented numbers.

## Process

Small PRs, plain commit messages (`feat:` / `fix:` / `docs:`), and a note in the PR saying
what you tested and how.
