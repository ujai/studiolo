## What this changes

## Why

## Checks I ran

- [ ] `python3 -m unittest discover -s tests`
- [ ] `python3 whats_due.py --check`
- [ ] `python3 generate_topics.py --check`
- [ ] Opened `practice/index.html` from the file and clicked through every tab (if the app changed)

## House rules

- [ ] No personal study data in this PR (learner map, mistake log, tracker, questions, cards)
- [ ] No new dependencies or build steps, and `practice/index.html` still works from `file://`
- [ ] Nothing here makes it easier for the AI to hand the learner an answer
- [ ] Any new question has `provenance` with real sources and a `verified_on` date, and nothing is
      copied or reworded from a real exam or a paid bank
- [ ] Generated files were rebuilt, not hand-edited (`practice/topics.js`)
