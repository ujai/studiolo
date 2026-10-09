# Contributing

There are two kinds of content in this repo, and they have different rules.

## The template (contributions welcome)

This covers `whats_due.py`, `generate_topics.py`, `import_anki.py`, `practice/` (HTML, CSS, JS),
`tests/`, `AGENTS.md`, `ai-tutor/`, `study-plan.md`, `templates.md`, `exam-day.md`,
`resources.md`, `docs/learning-science.md`, the READMEs (root, `practice/`, `anki/`,
`cheatsheets/`), and the format of `learner-map.md` (the columns and sections, not anyone's
rows).

Rules:

- **Keep it generic.** No subject-specific content. The only content that ships is the starter
  set (topics 1.1 and 1.2, about how learning works), because it teaches the method.
- **No dependencies.** Python 3.9+ with the standard library only, and static HTML only. No
  build steps, servers, accounts, or API keys. If it won't run on a school laptop over a phone
  hotspot, it doesn't go in. The practice app stays as plain classic scripts with one job per
  file: `core.js` for pure helpers, `storage.js` for saving, `ui.js` for shared widgets, one
  file per tab, and `app.js` for startup and the Progress tab.
- **Don't make the AI give answers away.** If a change makes it easier for the AI to just hand
  over the answer, treat it as a bug. The learner has to do the work themselves.
- **Write so a 12-year-old can follow it.** Short sentences, simple words, and explain any
  jargon. A lot of the people using this aren't developers.
- **Don't make up facts.** Every practice question has a `provenance` block with its sources
  and a `verified_on` date, and `core.js` won't load a question without one. If you can't cite
  it, mark it `needs-check` instead of `verified`.

## Checks to run before a PR

```bash
python3 -m unittest discover -s tests    # tests for the queue, Anki sync, and generated topics
python3 whats_due.py --check             # learner-map.md parses and is valid
python3 generate_topics.py --check       # practice/topics.js matches learner-map.md
```

CI (`.github/workflows/checks.yml`) runs the same three checks on Python 3.9 and 3.13 for every
pull request. Changes only reach `main` through a pull request. Run the checks locally anyway,
since that's quicker than waiting for CI.

Then double-click `practice/index.html` and click through every tab. The app has to work when
opened straight from the file, with no server and no build step. Don't edit generated files by
hand: that's `practice/topics.js` (rebuild it with `python3 generate_topics.py`) and anything
in `__pycache__/`.

## Your own study data (don't send PRs with it)

Your learner map, mistake log, daily tracker, generated questions, cards, cheat sheets, and
notes are personal. Keep them in your private copy, and don't include them in a PR.

## The starter set

Fixes and additions to the starter content (topics 1.1 and 1.2 in `practice/questions.js`, and
`anki/starter-deck.csv`) are welcome. Every fact has to be basic, textbook learning science
that nobody disputes, with no made-up numbers.

## How to send a change

Keep PRs small. Use plain commit messages starting with `feat:`, `fix:`, or `docs:`. In the PR,
say what you tested and how. Dependabot's version-bump PRs for the workflow actions keep their
own default message; that's fine.
