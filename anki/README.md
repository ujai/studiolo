# Anki Decks

Flashcards are the last and smallest part of the system. Cards only come from mistakes you've
logged **twice** (the Clerk role, `ai-tutor/prompts.md` §10). Don't turn a whole chapter into
cards.

## Files

- `starter-deck.csv`: the 13-card starter deck. It covers the learning science this system is
  built on, so it's useful whatever you study. Import it into Anki, or just run through it in
  the practice app (Flashcard blitz → load this file). It works with or without Anki.
- Your own decks go here once the Clerk starts making cards. Use one CSV per area or theme, with
  short lowercase names (`math-algebra.csv`, `spanish-verbs-cloze.csv`).

## CSV format

For a basic deck, the first line is a comment header, then one `Front,Back,Tags` row per card.
You can add a 4th column with a stable ID. It keeps a card linked to the same Anki note when you
reword it:

```
#Front,Back,Tags,ID
What does rereading mostly build?,"Familiarity, not recall.",studyskills,mem-rereading
```

For a cloze deck (the file name must contain `cloze`), use `#Text,Extra,Tags` with `{{c1::…}}`
blanks:

```
#Text,Extra,Tags
Spacing beats {{c1::cramming}} at equal total time.,"",studyskills
```

Rules: one fact per card, and at most one sentence on the back. Put quotes around any field that
has a comma in it. IDs can only use letters, digits, `_`, and `-`, and each one has to be unique
in the file. Check every fact in your authoritative source first, because AI makes up details.

## Importing into Anki

**The easiest way is to let Anki import the CSV.** In Anki, go to **File → Import**, pick the
file, match the columns to `Front`, `Back`, and `Tags`, and click Import. There's nothing to
install, and from then on Anki's own scheduler (including FSRS) handles the cards.

`import_anki.py` is optional. It's useful if you sync often. It needs the `anki` Python package
installed in the same environment, and Anki has to be **closed** while it runs, because the
script writes straight into your collection file:

```bash
python3 import_anki.py --list          # show deck keys and their files
python3 import_anki.py --dry-run       # show what would change without changing anything
python3 import_anki.py                 # add/update all decks (makes a timestamped backup first)
python3 import_anki.py starter-deck    # sync one deck only (the key is the CSV file name)
python3 import_anki.py --prune --confirm-prune   # also delete cards you removed from the CSV
```

Good to know:

- Each CSV becomes an Anki deck called `Studiolo::<file name>`.
- **Anki does the scheduling.** The script doesn't set due dates or intervals. It only adds and
  updates notes, so your FSRS settings, review history, and your own tags stay as they are.
- **How cards are matched.** A note is matched by the optional 4th column (`#Front,Back,Tags,ID`)
  or by its `studiolo-id::<id>` tag, so rewording a card updates the same note instead of adding
  a copy. Without that column, the script matches on the front text. That means a card you made
  yourself in the same deck, with the same front as a CSV row, gets its back updated too.
- **Deleting is opt-in and limited.** `--prune` on its own stops with an error. Preview it with
  `--prune --dry-run` first, then run it with `--prune --confirm-prune`. Even then it only
  deletes notes the script created (tagged `studiolo-managed`). Cards you made yourself are
  never deleted.
- **Backups.** Before every real write, the script saves a copy of your collection next to it
  (`studiolo-backup-<timestamp>.anki2`). `--dry-run` checks the whole plan on a temporary copy,
  so a broken CSV can't damage your collection.
- If the `anki` package is missing, the collection can't be found, or a CSV is broken, the
  script exits with code 1 and tells you what to do.

Don't use Anki? Skip all of this. The practice app's Flashcard blitz reads the same CSV files.

## Logging wrong answers from a practice test

After a full-length practice test, log your misses with
`practice-test-wrong-answer-log-template.md`, then give the rows to the Diagnostician.
