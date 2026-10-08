# Resource Recommendations

## Pick one of each. Then commit.

Decision fatigue is real. The plan works with any single combination; it fails when you keep
switching. So:

- **One authoritative source** (the thing that defines truth for your subject): the official
  textbook, the teacher's or course notes, the official syllabus — for technical subjects, the
  official documentation.
- **One question bank** (things that make you produce): past papers, problem sets, official
  practice questions — plus the practice app in this repo.
- **One AI tutor**: any AI chat with the roles in `ai-tutor/prompts.md`, or an agent reading
  `AGENTS.md`.
- **Optional**: Anki for flashcards (decks in `anki/`).

Not on the list: a second course, a third playlist, prettier notes. Every hour spent
collecting resources is an hour not spent producing.

## How to pick, by budget

### Zero budget
- the official syllabus + whatever your teacher or school gives out
- a free question bank (past papers, end-of-chapter problems)
- the free tier of any AI chat
- the practice app (already in this repo)

### Some budget
- the recommended textbook for the course
- one official question bank or past-paper pack
- AI chat (free tier is fine)

### Certification / professional tests
- the official exam guide and official practice questions first — always
- one reputable course OR the official learning platform
- one reputable practice-exam source
- official docs as the "authoritative source" the rules keep mentioning

## Flashcard rules

Only create flashcards for:
- things you got wrong twice
- concepts you keep confusing
- steps you keep misordering

Do **not** create flashcards for:
- long definitions
- giant paragraphs
- every detail in the source

Let the **Clerk** role (`ai-tutor/prompts.md` §10) turn your mistake log into CSV rows, but
check every fact in your authoritative source first. AI invents details.

### Good flashcard examples
- **Q:** What does rereading mostly build? — **A:** Familiarity, not recall.
- **Q:** In this system, when does a mistake become a card? — **A:** When it's wrong twice.

## Use AI to find resources at your level

Your main resource won't explain every topic in a way that clicks. When one doesn't, use the
"Find the best human explanation" prompt in `ai-tutor/prompts.md`. Give it your level from
`learner-map.md`, and open every link it suggests to confirm it exists before you rely on it.

## What not to do

- do not buy four books or courses
- do not make giant pretty notes
- do not spend the whole week watching videos
- do not avoid practice tests because low scores feel bad
- do not reread weak topics passively without testing yourself
- do not use AI only to explain things; make it question, test, and grade you instead

## Starter checklist

Do **Day 1 — Intake** in `study-plan.md`:

1. run the Interviewer, find-my-level, and Mapmaker prompts → fill in `learner-map.md`
2. pick the one authoritative source and the one question bank
3. import the starter deck only if you want Anki in the loop (`python3 import_anki.py`)
