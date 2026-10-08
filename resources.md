# Resources

## Pick one of each, then stick with it

Choosing between too many options wears you out. The plan works with any one combination. It
stops working when you keep switching. So pick:

- **One authoritative source.** This is whatever decides what's correct for your subject: the
  official textbook, your teacher's or course notes, or the official syllabus. For technical
  subjects, it's the official documentation.
- **One question bank.** Something that makes you answer questions: past papers, problem sets,
  or official practice questions. The practice app in this repo counts too.
- **One AI tutor.** Any AI chat with the roles in `ai-tutor/prompts.md`, or an agent that reads
  `AGENTS.md`.
- **Optional:** Anki for flashcards (the decks are in `anki/`).

You don't need a second course, a third playlist, or nicer notes. Every hour spent collecting
resources is an hour you're not practising.

## What to pick, by budget

### No budget
- the official syllabus and whatever your teacher or school hands out
- a free question bank (past papers, end-of-chapter problems)
- the free plan of any AI chat
- the practice app (already in this repo)

### Some budget
- the recommended textbook for the course
- one official question bank or pack of past papers
- an AI chat (the free plan is fine)

### Certifications and professional exams
- the official exam guide and official practice questions, always first
- one well-reviewed course, or the official learning platform
- one well-reviewed source of practice exams
- the official docs as your authoritative source

## Flashcards

Only make flashcards for:
- things you got wrong twice
- ideas you keep mixing up
- steps you keep putting in the wrong order

Don't make flashcards for:
- long definitions
- whole paragraphs
- every detail in the source

The **Clerk** role (`ai-tutor/prompts.md` §10) can turn your mistake log into CSV rows. Check
every fact in your authoritative source first, because AI makes up details.

### Good examples
- **Q:** What does rereading mostly build? **A:** Familiarity, not recall.
- **Q:** In this system, when does a mistake become a card? **A:** When you get it wrong twice.

## Use AI to find explanations at your level

Your main resource won't explain every topic in a way that makes sense to you. When it doesn't,
use the "Find the best human explanation" prompt in `ai-tutor/prompts.md`. Give it your level
from `learner-map.md`. Open every link it suggests to make sure it actually exists before you
rely on it.

## What not to do

- don't buy four books or courses
- don't spend hours making pretty notes
- don't spend the whole week watching videos
- don't skip practice tests because low scores feel bad
- don't keep rereading weak topics without testing yourself
- don't only ask AI to explain things. Have it question you, test you, and grade you.

## Day 1 checklist

Follow **Day 1: build your map** in `study-plan.md`:

1. run the Interviewer, "find my level", and Mapmaker prompts, and fill in `learner-map.md`
2. pick your one authoritative source and your one question bank
3. only import the starter deck if you want to use Anki (Anki → File → Import, or
   `python3 import_anki.py` if you'll sync often; see `anki/README.md`)
