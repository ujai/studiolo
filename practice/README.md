# Practice App

`index.html` is the whole app. Open it with a double-click — no server, no build, no packages.
Everything below is for when you want to change it.

## Files

| File | What lives there |
|------|------------------|
| `index.html` | Markup and the script order. Loaded in that order; each file is a classic script, no modules, so `file://` works. |
| `styles.css` | All styling. Dark theme, one class per widget. |
| `topics.js` | **Generated** from `learner-map.md` by `python3 generate_topics.py`. Never edit by hand. |
| `questions.js` | Your question bank (see `AGENTS.md` §4 for the schema, including `provenance`). |
| `core.js` | Pure helpers: dates, option keys, the content validator, and the review-schedule replay. No DOM. |
| `storage.js` | All persistence. One localStorage key per tab, merged on read, plus backup/restore and the failure banner. |
| `ui.js` | Shared state and widgets: `el`, `button`, badges, scope pickers, the scenario and ordered-step controls. |
| `drills.js` | Exam sprint and pair picker. |
| `review.js` | Spaced review over the items you missed. |
| `visual.js` | Diagram and step-order drills. |
| `flash.js` | CSV decks and the flashcard blitz. |
| `app.js` | Boot, tab switching, Progress & export, backup/restore, and the on-screen warnings. |

## Rules of the road

- **No dependencies, no build step.** If a change needs `npm`, a bundler, or a server, it does
  not belong here. The app must keep working from `file://` on a school laptop.
- **`core.js` stays pure.** It is the part that can be reasoned about (and tested) without a
  browser; DOM code goes in the tab files.
- **Every question needs `provenance`.** The validator refuses to load an item without sources,
  a `verified_on` date, and a `status`. Facts marked `needs-check` are flagged on screen.
- **Ids are forever.** Saved stats and the review schedule key on item ids; never reuse one.
- **One timer, one key handler.** Long-running drills call `stopTimer()` and check
  `runGeneration` so an abandoned round can't keep running after a tab switch.

## Trying it

```bash
python3 -m unittest discover -s tests    # Python side: queue, Anki sync, generated metadata
python3 whats_due.py --check
python3 generate_topics.py --check
```

Then open `index.html` and click through the tabs. Check the browser console: it should be
empty. Progress is stored in the browser you open it in, so test data stays local to that
browser; **Progress & export → Reset all progress** clears it.
