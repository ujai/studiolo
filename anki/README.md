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

Basic deck — first line is a comment header, then `Front,Back,Tags` rows. An optional 4th
column is a stable ID that keeps a reworded card on the same note:

```
#Front,Back,Tags,ID
What does rereading mostly build?,"Familiarity — not recall.",studyskills,mem-rereading
```

Cloze deck (the file name must contain `cloze`) — `#Text,Extra,Tags` with `{{c1::…}}` blanks:

```
#Text,Extra,Tags
Spacing beats {{c1::cramming}} at equal total time.,"",studyskills
```

Rules: one fact per card. Back max one sentence. Quote fields that contain commas. IDs use
letters, digits, `_` and `-` only, and must be unique in the file. Check every fact in your
authoritative source first — AI invents details.

## Import into Anki

**Easiest path: let Anki import the CSV.** Open Anki → **File → Import** → pick the file → map
`Front`, `Back`, `Tags` → Import. Nothing to install, and Anki's own scheduler (including FSRS)
owns the cards from then on.

`import_anki.py` is the optional automation path for when you re-sync often. It needs the
`anki` Python package installed in the same environment, and Anki must be **closed** (the script
writes into the collection file):

```bash
python3 import_anki.py --list          # show deck keys and target files
python3 import_anki.py --dry-run       # report what would change, touch nothing
python3 import_anki.py                 # add/update all decks (writes a timestamped backup first)
python3 import_anki.py networking      # sync one deck key only
python3 import_anki.py --prune --confirm-prune   # also delete cards you removed from the CSV
```

Details worth knowing:

- Each CSV becomes an Anki deck named `Studiolo::<file name>`.
- **Scheduling is Anki's.** The script sets no due dates and no intervals: it only adds and
  updates notes, so your FSRS settings, your review history, and your own tags survive.
- **Identity.** A note is matched by its optional 4th column (`#Front,Back,Tags,ID`) or by its
  `studiolo-id::<id>` tag. Rewording a card then updates the same note instead of adding a
  duplicate. Leave the column out and the script falls back to matching on the front text.
- **Deletion is explicit and narrow.** `--prune` alone does nothing: `--confirm-prune` is
  required, and even then only notes the script created (tagged `studiolo-managed`) are removed.
  Your own cards are never touched.
- **Backups.** Every real write snapshots the collection first (`collection-<timestamp>.anki2`
  next to it), and `--dry-run` validates the whole plan on a temporary copy, so a broken CSV
  can't damage your collection.
- Missing the `anki` package, a missing collection, or a malformed CSV exits with code 1 and a
  message that says what to do.

If you don't use Anki at all: skip this. The practice app's Flashcard blitz reads the same CSVs.

## Practice-test wrong-answer log

When you take a full-length practice test, log the misses with
`practice-test-wrong-answer-log-template.md`, then feed the rows to the Diagnostician.
