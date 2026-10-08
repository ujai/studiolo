# Practice Test Wrong-Answer Log

Use this after every full-length practice test. Misses from short drills go straight into
`mistake-log.md` instead. Log the questions you got wrong **and** the ones you got right by
guessing, because a lucky guess is still something you don't know.

```md
# Practice test — [date] — [source]

Score: __/__
Time used: ___ of ___

| # | Topic ID | Question (short) | My choice | Correct | Why I missed it | Guessed? | Seen before? |
|---|----------|------------------|-----------|---------|-----------------|-----------|--------------|
| 1 | | | | | | | |
```

Then:

1. Give the whole table to the **Diagnostician** (`ai-tutor/prompts.md` §8). It comes back with
   at most 3 root causes. Write them into `learner-map.md` → Root causes.
2. Do the fix drills it suggests before any new topics.
3. Copy each row into `mistake-log.md` with source role = Practice test. Anything you've seen
   before becomes a flashcard (Clerk, §10).
