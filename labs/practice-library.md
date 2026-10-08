# Practice Library

One task per topic in `learner-map.md`. **You don't follow these top to bottom.** The learner
map picks the topic; this file says what to do with it.

How each task is used in a session (see `study-plan.md`):

- **Do it**: attempt it cold first. Ask the Explainer only for the step you're stuck on, then redo from step 1 without help.
- **Break it**: deliberately break it, watch it fail, fix it. The sting of breaking it helps you remember.
- **Socratic seed**: the first question for the Socratic questioner.
- **Listener topic**: what your voice note, sketch, and 5-line written version must explain.
- **Examiner focus**: what the escalating quiz should target.
- **Example ladder** *(skill-heavy topics only, optional)*: for topics whose skill is running
  a procedure — an integral, a git rebase, a verb form — the first meeting studies a fully
  worked example, then completes a half-worked one, then fills a faded one (steps missing),
  then solves a fresh one cold. Every later pass skips straight to solving cold. Examples
  first is the best-replicated result for novices; the ladder stops helping once you're past
  novice, which is why it's the first meeting only (see `docs/learning-science.md`).

What "Do it" and "Break it" mean depends on the subject (the table in `AGENTS.md` §3): solve
then mutate for math, recall then timeline-break for history, build then misconfigure for
hands-on subjects, perform then isolate-and-slow for music. The Mapmaker writes tasks in
whichever form fits; the labels above never change. For a brand-new procedure, the Example
ladder IS the first "Do it" — from the second pass on, "Do it" is solving a fresh variant cold.

After intake, your agent adds one entry per topic here, in this format.

---

## Area 1 — The science of learning (starter demo)

### 1.1 How memory works
- **Do it** (20 min): Pick any page of notes from any other subject. Close it. Write everything
  you recall in 3 minutes. Open the page and mark what you missed. Repeat tomorrow with the
  same page — notice the jump from one day of spacing.
- **Break it**: Try the same recall with the page open. Notice how it feels easier and how
  much weaker it sticks. That feeling is the fluency illusion: recognition posing as knowledge.
- **Socratic seed**: Why does recalling with the page open feel easier but produce weaker learning?
- **Listener topic**: Encoding vs retrieval — why "pulling it out" is what makes it stay in.
- **Examiner focus**: Familiarity vs recall; why rereading feels productive but tests nothing.

### 1.2 How to practice
- **Do it** (20 min): Take 20 flashcards (any subject, or `anki/starter-deck.csv`). Split them:
  10 cards in one cramming block today; 10 spread over 4 shorter sessions this week. At the
  end of the week test all 20 and record which half did better.
- **Break it**: Skip a spaced day on purpose. Watch those items slide in the review queue —
  and note that the ladder still catches them. Missing once isn't failure; the ladder exists
  because you will.
- **Socratic seed**: Why does spacing beat cramming when total time is equal?
- **Listener topic**: The testing effect and the wrong-twice rule — how mistakes drive the system.
- **Examiner focus**: Spacing vs massing; testing vs rereading; interleaving similar things.

## Pressure simulations (Sparring, prompt §9)

Symptom-first simulations for the Sparring partner. Don't read the answer key first.

**How to run one**

1. Paste the prompt + the simulation into a fresh AI chat (or ask your agent: *"pressure
   simulation, SIM-01"*).
2. Ask for facts one at a time; the AI reveals only what you asked for.
3. 10 minutes to the root cause and the simplest fix.
4. Get scored on: order of checks, wasted steps, simplest correct fix. **Then** read the key.

Rules: one simulation = one 25-min block. Stuck after 10 minutes? Read only the "check order"
line of the key, then keep going. Log every wrong turn in the mistake log, source role = Sparring.

### SIM-01 · The friend who crams (topics 1.1, 1.2)

**Paste to the AI:**
> Run a pressure simulation. Scenario: my friend crams 8 hours the night before every exam and
> scores around 70%. I spread the same 8 hours over two weeks and score higher, but they insist
> cramming "works for them". Give me only their argument first; I'll rebut point by point. Play
> devil's advocate for up to 5 minutes, then score my rebuttals against the learning science.

**Answer key (read after):** Check order: what does "works" mean — survived the test, or kept
it a month later? → what does each schedule optimize (cramming optimizes tomorrow, spacing
optimizes retention)? → can both be right at different horizons? Fix: concede the short-term
win, then show the week-after gap. Trap: "worked for me" measures the wrong horizon.

### SIM-02 · The notes that feel productive (topic 1.1)

**Paste to the AI:**
> Run a pressure simulation. Scenario: I spent 2 hours rereading and highlighting a chapter and
> it felt very productive. I have 10 minutes to decide tonight's plan. Ask me the questions I
> should ask myself, one at a time, until I figure out whether I actually learned anything.
> Score me at the end.

**Answer key:** Check order: can I reproduce anything with the book closed? → can I solve a
problem I haven't seen? → am I recognizing or recalling? Fix: convert the session — 10 minutes
of closed-book recall beats 2 more hours of rereading. Trap: effort and familiarity feel like
learning; only production tests it.

*(After intake, your agent writes simulations here for YOUR subject: incidents for hands-on
subjects, planted-error solutions for math, broken dialogues for languages, source critique
for humanities.)*
