# Practice App

`index.html` is the whole app. Double-click it to open it. There's no server, build step, or
package to install. The rest of this page is for when you want to change the app.

## Files

| File | What's in it |
|------|--------------|
| `index.html` | The page layout and the order the scripts load in. Every file is a classic script, not a module, so the app works when opened straight from the file (`file://`). |
| `styles.css` | All the styling. Dark theme, one class per widget. |
| `topics.js` | **Generated** from `learner-map.md` by `python3 generate_topics.py`. Don't edit it by hand. |
| `questions.js` | Your question bank. The format, including `provenance`, is in `AGENTS.md` §4. This file is loaded as a script, so it runs as code (see the rules below). |
| `core.js` | Pure helpers: dates, option letters, the question checker, and rebuilding the review schedule from your answers. No page code. |
| `storage.js` | Everything about saving. Each open browser tab saves to its own localStorage key, and they're merged when the app reads them. Also backup/restore and the warning shown when saving fails. |
| `ui.js` | Shared state and widgets: `el`, `button`, badges, scope pickers, and the controls for multiple-choice and put-in-order questions. |
| `drills.js` | Exam sprint and Pair picker. |
| `review.js` | Spaced review of the items you missed. |
| `visual.js` | Diagram and put-in-order drills. |
| `flash.js` | Loading CSV decks and the Flashcard blitz. |
| `app.js` | Startup, switching tabs, Progress & export, backup/restore, and the warnings at the top of the page. |

## Rules

- **No dependencies and no build step.** If a change needs `npm`, a bundler, or a server, it
  doesn't belong here. The app has to keep working from `file://` on a school laptop.
- **Keep `core.js` pure.** It's the part you can reason about and test without a browser. Code
  that touches the page goes in the tab files.
- **Every question needs `provenance`.** The checker won't load a question without sources, a
  `verified_on` date, and a `status`. Anything marked `needs-check` gets a warning on screen.
- **`questions.js` is code, not data.** `index.html` loads it with a `<script src>` tag, so
  everything in it runs on your machine with the same reach as the rest of the app, including
  your saved progress. Write your own bank, or read one closely before you use it, and never
  load a file a stranger sent you. That also means the file can't be a copy of someone else's
  question bank: see the originality rule in `AGENTS.md` §4.
- **Never reuse an id.** Saved stats and the review schedule are tied to question ids.
- **One timer and one key handler at a time.** Drills that keep running call `stopTimer()` and
  check `runGeneration`, so a round you left can't keep running after you switch tabs.

## Testing it

Run these from the repo root:

```bash
python3 -m unittest discover -s tests    # Python tests: queue, Anki sync, generated topics
python3 whats_due.py --check
python3 generate_topics.py --check
```

Then open `index.html` and click through every tab. The browser console should stay empty.
Progress is saved in the browser you open it in, so test answers only stay in that browser.
**Progress & export → Reset all progress** clears them.
