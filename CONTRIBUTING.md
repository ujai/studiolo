# Contributing

Studiolo has two kinds of content, and they follow different rules.

## The engine (contributions welcome)

`whats_due.py`, `import_anki.py`, `practice/index.html`, `AGENTS.md`, `ai-tutor/`,
`study-plan.md`, `templates.md`, `exam-day.md`, `resources.md`, and the `learner-map.md`
schema (the format, not the rows).

Rules:

- **Keep it generic.** No subject-specific content in the template. The starter instance
  (topics 1.1 / 1.2, the learning-science demo) is the only content that ships, because it
  teaches the method itself.
- **Keep it dependency-free.** Python 3 stdlib only. Static HTML only. No build steps,
  servers, accounts, or API keys. If it can't run on a school laptop or a phone hotspot,
  it doesn't ship.
- **Keep the AI roles honest.** Any change that makes the AI hand over answers more easily
  is a bug. The system works because it makes the learner produce.
- **Write for a 12-year-old too.** Short sentences, simple words, no unexplained jargon.
  Half the audience is not a developer.

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
