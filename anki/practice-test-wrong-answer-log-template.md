# Practice-Test Wrong-Answer Log Template

Use after every full-length practice test (not after short drills — those go straight into
`mistake-log.md`). Log wrong **and** guessed-right answers: a lucky guess is a gap you got
away with.

```md
# Practice test — [date] — [source]

Score: __/__
Time used: ___ of ___

| # | Topic ID | Question (short) | My choice | Correct | Why I missed it | Guessed? | Seen before? |
|---|----------|------------------|-----------|---------|-----------------|-----------|--------------|
| 1 | | | | | | | |
```

After logging:

1. Feed the whole table to the **Diagnostician** (`ai-tutor/prompts.md` §8): it returns max 3
   root causes → write them into `learner-map.md` → Root causes.
2. Run the fix drills it proposes; they jump the queue (root-cause fixes beat new topics).
3. Copy each row into `mistake-log.md` with source role = Practice test. Anything seen before
   becomes a flashcard (Clerk §10).
