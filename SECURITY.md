# Security

Studiolo is Markdown, CSS, and plain JavaScript with no build step, no server, no accounts, and
no network calls. Nothing here sends your data anywhere on its own. The parts that run code are
the Python scripts (`whats_due.py`, `generate_topics.py`, `import_anki.py`) and the practice app
in `practice/`.

## Reporting a problem

Please don't open a public issue for a security problem. Use the **Security** tab of this repo
and click **Report a vulnerability**. That channel is private between you and the maintainer.
If you can't use it, open a normal issue that only asks for a private channel, with no details
in it.

A report is easiest to act on when it has:

- what can go wrong, and who it harms
- the file and the lines involved
- the shortest steps that show the problem
- the commit you tested

This is a small project run by one person. There's no bug bounty and no promised response time,
but reports get read.

## What counts as a security problem

In scope:

- anything that can run code or leak data through the practice app, including through a question
  bank (`practice/questions.js`) or a CSV deck you load
- bugs in the Python scripts that could damage or delete files you didn't mean to touch
- the CI workflow in `.github/workflows/`

Usually not in scope:

- **Your own study data being public.** Your learner map, mistake log, tracker, questions, and
  cards are meant to stay private. Publishing them, or committing them and then making the repo
  public, is a privacy mistake rather than a vulnerability. Git keeps old versions, so deleting
  the rows later doesn't remove them from history.
- **What you paste into an AI chat.** That text goes to that AI company. Pick one whose training
  and history settings you're happy with, and treat anything you paste as shared.
- **A wrong or badly sourced question.** That's a content bug: open a normal issue.
- **`import_anki.py` changing your Anki collection.** It only deletes notes it created itself,
  and pruning needs `--prune --confirm-prune`. Back up your collection first anyway.

## Supported versions

Only `main` gets fixes. This repo also runs CodeQL on `main` and on pull requests, and Dependabot
watches the GitHub Actions it uses.
