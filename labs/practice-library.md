# Practice Library

One task per topic in `learner-map.md`. **You don't work through this file from top to bottom.**
The learner map picks the topic, and this file tells you what to do with it.

How each part of a task is used in a session (see `study-plan.md`):

- **Do it**: try it on your own first. Only ask the Explainer about the step you're stuck on,
  then redo it from step 1 without help.
- **Break it**: break it on purpose, watch it fail, and fix it. Seeing it fail helps you
  remember it.
- **Socratic seed**: the first question for the Socratic questioner.
- **Listener topic**: what your voice note, sketch, and 5 written lines need to explain.
- **Examiner focus**: what the quiz should test.
- **Example ladder** *(optional, only for skill topics)*: for topics where the skill is following
  a procedure (an integral, a git rebase, a verb form). The first time, you study a fully worked
  example, then finish a half-done one, then fill in one with steps missing, then solve a new one
  on your own. After that first time, you go straight to solving. Starting with examples is what
  works best for beginners, and it stops helping once you're past that stage, so it's only for
  the first time (see `docs/learning-science.md`).

What "Do it" and "Break it" look like depends on the subject (see the table in `AGENTS.md` §3).
In math you solve a problem, then change it. In history you recall the events, then mix up the
timeline. In hands-on subjects you build something, then misconfigure it. In music you play the
piece, then slow down the hardest part. The Mapmaker writes each task in the form that fits, and
the labels stay the same. For a brand-new procedure, the Example ladder is the first "Do it".
From the second time on, "Do it" means solving a new version on your own.

After the interview, your agent adds one entry per topic here, in this format.

---

## Area 1: The science of learning (starter demo)

### 1.1 How memory works
- **Do it** (20 min): Take a page of notes from any other subject. Close it, and write down
  everything you remember in 3 minutes. Then open the page and mark what you missed. Do the same
  page again tomorrow, and see how much more you remember after a day's gap.
- **Break it**: Do the same recall with the page open. Notice that it feels easier, and that it
  sticks much less. That's the fluency illusion: recognizing something feels like knowing it.
- **Socratic seed**: Why does recalling with the page open feel easier, but help you learn less?
- **Listener topic**: Storing versus recalling, and why pulling it out of your memory is what
  makes it stay.
- **Examiner focus**: Familiarity versus recall, and why rereading feels productive but tests
  nothing.

### 1.2 How to practice
- **Do it** (20 min): Take 20 flashcards (from any subject, or `anki/starter-deck.csv`). Split
  them into two groups of 10. Study the first 10 in one block today, and spread the other 10
  over 4 shorter sessions this week. At the end of the week, test yourself on all 20 and write
  down which group you did better on.
- **Break it**: Skip one of the spaced days on purpose. Watch those cards fall behind in the
  review queue, and notice that the schedule still brings them back. Missing a day isn't a
  failure. The schedule is built for the days you miss.
- **Socratic seed**: Why does spacing beat cramming when the total time is the same?
- **Listener topic**: The testing effect and the wrong-twice rule, and how your mistakes decide
  what you practise.
- **Examiner focus**: Spacing versus cramming, testing versus rereading, and mixing similar
  topics together.

## Pressure simulations (Sparring, prompt §9)

Simulations for the Sparring partner where you start from a problem and work out the cause.
Don't read the answer key first.

**How to run one**

1. Paste the prompt and the simulation into a new AI chat, or ask your agent: *"pressure
   simulation, SIM-01"*.
2. Ask for facts one at a time. The AI only tells you what you ask for.
3. You have 10 minutes to find the cause and the simplest fix.
4. You get scored on the order you checked things in, wasted steps, and whether your fix was the
   simplest one that works. **Then** read the key.

Rules: one simulation is one 25-minute block. If you're stuck after 10 minutes, read only the
"Check order" line of the key, then keep going. Log every wrong turn in the mistake log, with
source role = Sparring.

### SIM-01 · The friend who crams (topics 1.1, 1.2)

**Paste to the AI:**
> Run a pressure simulation. Scenario: my friend crams 8 hours the night before every exam and
> scores around 70%. I spread the same 8 hours over two weeks and score higher, but they insist
> cramming "works for them". Give me only their argument first; I'll rebut point by point. Play
> devil's advocate for up to 5 minutes, then score my rebuttals against the learning science.

**Answer key (read it afterwards):** Check order: what does "works" mean, passing the test or
still remembering it a month later? Then: what does each schedule help with (cramming helps
tomorrow, spacing helps you keep it)? Then: can both be right over different time spans? Fix:
agree that cramming wins in the short term, then show the gap a week later. Trap: "it works for
me" is measured over the wrong time span.

### SIM-02 · The notes that feel productive (topic 1.1)

**Paste to the AI:**
> Run a pressure simulation. Scenario: I spent 2 hours rereading and highlighting a chapter and
> it felt very productive. I have 10 minutes to decide tonight's plan. Ask me the questions I
> should ask myself, one at a time, until I figure out whether I actually learned anything.
> Score me at the end.

**Answer key:** Check order: can I write anything down with the book closed? Then: can I solve a
problem I haven't seen before? Then: am I recognizing it or recalling it? Fix: change the plan.
10 minutes of recalling with the book closed does more than 2 more hours of rereading. Trap:
effort and familiarity feel like learning, but only producing the answer shows whether you
learned it.

*(After the interview, your agent writes simulations here for your own subject: troubleshooting
problems for hands-on subjects, worked solutions with planted mistakes for math, broken
dialogues for languages, and source criticism for humanities.)*
