# Anki Decks

Flashcards are the smallest, last piece of the system. Cards come only from mistakes you've
logged **twice** (Clerk role, `ai-tutor/prompts.md` §10). Never turn a whole chapter into cards.

## Files

- `starter-deck.csv` — the 12-card starter deck. It teaches the learning science the system
  runs on, so it's useful for every subject. Import it into Anki, or just blitz it in the
  practice app (Flashcard blitz → load this file) — it works with or without Anki.
- Your subject's decks appear here once the Clerk starts making cards. One CSV per area or
  theme; keep names short and lowercase (`math-algebra.csv`, `spanish-verbs-cloze.csv`).

## CSV format

Basic deck — first line is a comment header, then `Front,Back,Tags` rows:

```
#Front,Back,Tags
What does rereading mostly build?,"Familiarity — not recall.",studyskills
```

Cloze deck (the file name must contain `cloze`) — `#Text,Extra,Tags` with `{{c1::…}}` blanks:

```
#Text,Extra,Tags
Spacing beats {{c1::cramming}} at equal total time.,"",studyskills
```

Rules: one fact per card. Back max one sentence. Quote fields that contain commas. Check every
fact in your authoritative source first — AI invents details.

## Import into Anki

With Anki desktop **closed** (the script writes straight into the collection file):

```bash
python3 import_anki.py --dry-run    # see what would change
python3 import_anki.py              # add/update all decks
python3 import_anki.py --prune      # also delete cards you removed from the CSV
python3 import_anki.py --list       # show deck keys
```

Each CSV becomes an Anki deck named `Studiolo::<file name>`. Your own tags inside Anki survive
syncs. If you don't use Anki: skip all of this. The practice app's Flashcard blitz reads the
same CSVs.

## Practice-test wrong-answer log

When you take a full-length practice test, log the misses with
`practice-test-wrong-answer-log-template.md`, then feed the rows to the Diagnostician.
