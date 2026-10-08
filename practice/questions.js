// Practice app content. Every item has a `topic` matching an ID in learner-map.md.
// To add content, append items with a new unique `id`. Saved stats reference ids, so never reuse one.
// scenarios: answer = indices into options (2 indices = "choose 2").
// pairs: answer = "a" or "b".
// orders: steps are listed in the CORRECT order; the app shuffles them.
// diagrams: coordinates use an 800 x 480 canvas; slot answers must appear in parts.
//
// Every item needs `provenance`: where the fact comes from, when you checked it, and whether
// you stand behind it. `sources` are https:// URLs or paths to files in this repo.
//   provenance: { sources: ["https://doi.org/…"], verified_on: "YYYY-MM-DD", status: "verified" }
// Use "needs-check" when the fact is still unconfirmed; the app then flags it on screen.
// The validator in core.js refuses to load an item without provenance, because a quiz that
// teaches wrong facts is worse than no quiz. AGENTS.md §4 has the full schema.
//
// The items below are the STARTER SET: they teach the learning science this system runs on.
// After intake, your agent appends items for YOUR subject here (rules in AGENTS.md §4).

const SOURCE = {
  testing: "https://doi.org/10.1111/j.1467-9280.2006.01693.x",          // Roediger & Karpicke 2006, test-enhanced learning
  retrieval: "https://doi.org/10.1126/science.1199327",                 // Karpicke & Blunt 2011, retrieval vs concept mapping
  techniques: "https://doi.org/10.1177/1529100612453266",               // Dunlosky et al. 2013, study-technique utility review
  spacing: "https://pubmed.ncbi.nlm.nih.gov/16719566/",                 // Cepeda et al. 2006, distributed-practice meta-analysis
  interleaving: "https://doi.org/10.1007/s11251-007-9015-8",            // Rohrer & Taylor 2007, shuffled practice problems
  ladder: "learner-map.md",                                             // the 1-3-7-14 ladder and level definitions
  rules: "AGENTS.md",                                                   // wrong-twice rule and session rules
  loop: "study-plan.md"                                                 // the session loop
};
const VERIFIED_ON = "2026-10-08";

window.PRACTICE_DATA = {
  scenarios: [
    // ---------- 1.1 How memory works ----------
    { id: "S001", topic: "1.1",
      q: "You reread a chapter twice and it feels easy and familiar. What is that feeling measuring?",
      options: ["How well you'll recall it on the test", "Familiarity with the text — not recall of the ideas", "How interesting the chapter was", "Nothing; the feeling is random"],
      answer: [1],
      explain: "Rereading builds fluency, and fluency feels like knowledge. The check: close the book and try to produce it.",
      provenance: { sources: [SOURCE.testing, SOURCE.techniques], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "S002", topic: "1.1",
      q: "Which 10 minutes at the end of a study session produce the most learning?",
      options: ["Reread the notes once more", "Explain the topic out loud without notes", "Highlight the key sentences", "Copy the notes more neatly"],
      answer: [1],
      explain: "Producing from memory (teach-back) is retrieval practice. The other three feel productive but test nothing.",
      provenance: { sources: [SOURCE.techniques], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "S003", topic: "1.1",
      q: "Same time budget: which produces more retention a week later?",
      options: ["Read the notes 4 times", "Read once, then test yourself 3 times", "Watch a video twice", "Highlight while reading"],
      answer: [1],
      explain: "The testing effect: retrieval practice beats rereading for the same time spent. The struggle is the encoding.",
      provenance: { sources: [SOURCE.testing], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "S004", topic: "1.1",
      q: "Which is the real proof that you know something?",
      options: ["It feels clear when you read it", "You can produce it from a blank page, cold", "You recognized the right answer in a list", "You watched two explanations of it"],
      answer: [1],
      explain: "Recognition and feelings are weak signals. Production from memory is the one that predicts test performance.",
      provenance: { sources: [SOURCE.retrieval], verified_on: VERIFIED_ON, status: "verified" } },

    // ---------- 1.2 How to practice ----------
    { id: "S005", topic: "1.2",
      q: "You have 3 hours this week for one chapter, tested in 10 days. Which schedule produces the strongest recall on test day?",
      options: ["One 3-hour block on Sunday", "Six 30-minute blocks spread across the week", "Three 1-hour blocks back to back, the day before", "Skimming the chapter 10 times"],
      answer: [1],
      explain: "Same total time, spread out: spacing beats massed practice. Cramming optimizes tomorrow's quiz and loses next week.",
      provenance: { sources: [SOURCE.spacing], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "S006", topic: "1.2",
      q: "In this system, what happens to a practice question you get wrong?",
      options: ["Nothing; wrong answers are noise", "It is logged and comes back after 1, 3, 7, then 14 days", "It becomes a flashcard immediately", "You delete it and avoid that topic"],
      answer: [1],
      explain: "Misses feed the spaced ladder until you beat them. Only a mistake seen twice becomes a card.",
      provenance: { sources: [SOURCE.ladder, SOURCE.rules], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "S007", topic: "1.2",
      q: "You keep confusing two similar concepts. What is the strongest fix?",
      options: ["Study them in separate weeks so they don't blur", "Practice them mixed together, and after each answer say which is which", "Drop the harder one", "Memorize both definitions word for word"],
      answer: [1],
      explain: "Interleaving trains discrimination — noticing WHICH one you're looking at. That is the skill the test takes.",
      provenance: { sources: [SOURCE.interleaving], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "S008", topic: "1.2",
      q: "The map says your level on a topic is 2. What should the next session target?",
      options: ["Drill level-1 recognition until it's perfect", "Attempt level-3 problems just beyond you, with help only when stuck", "Jump straight to the hardest questions", "Review the cheat sheet and call it done"],
      answer: [1],
      explain: "Level 2 means you can explain it; the edge is level 3, applying it. Too easy encodes nothing; too hard is guessing, not learning.",
      provenance: { sources: [SOURCE.ladder], verified_on: VERIFIED_ON, status: "verified" } }
  ],

  pairs: [
    { id: "P001", topic: "1.1",
      clue: "Producing an answer from memory with the book closed",
      a: "Retrieval practice", b: "Rereading review", answer: "a",
      why: "Retrieval means pulling it out of memory. An open book makes it review, not retrieval.",
      provenance: { sources: [SOURCE.testing], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "P002", topic: "1.1",
      clue: "The feeling of knowing something because it reads smoothly",
      a: "Illusion of competence", b: "Desirable difficulty", answer: "a",
      why: "Fluency is familiarity. The fix is a closed-book check, not more rereading.",
      provenance: { sources: [SOURCE.techniques], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "P003", topic: "1.2",
      clue: "Same total study time, but spread across days",
      a: "Spacing", b: "Cramming (massed practice)", answer: "a",
      why: "Spacing wins at every delay beyond a day or two. Cramming only wins tomorrow's quiz.",
      provenance: { sources: [SOURCE.spacing], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "P004", topic: "1.2",
      clue: "Feels productive but tests nothing",
      a: "Highlighting while rereading", b: "Self-quizzing", answer: "a",
      why: "Highlighting feels like work but forces no retrieval. Quizzing forces production.",
      provenance: { sources: [SOURCE.techniques], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "P005", topic: "1.2",
      clue: "Practice that feels harder but builds stronger memory",
      a: "Desirable difficulty", b: "Effortless review", answer: "a",
      why: "The struggle is the encoding. Practice that feels easy is usually producing recognition, not recall.",
      provenance: { sources: [SOURCE.interleaving], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "P006", topic: "1.2",
      clue: "In this system, missing a question twice produces one of these",
      a: "A flashcard", b: "A paragraph of notes", answer: "a",
      why: "One fact per card, in your own words. Wrong twice means the system expects you to forget it.",
      provenance: { sources: [SOURCE.rules], verified_on: VERIFIED_ON, status: "verified" } }
  ],

  orders: [
    { id: "O001", topic: "1.2", title: "The daily session loop",
      prompt: "Put one full study session in order, first step to last.",
      steps: ["Run the queue: due reviews first", "Write 3 things you recall about the topic, no looking", "Attempt the practice task cold, before any help", "Ask the Explainer for the one stuck step only", "Redo the whole task from scratch without help", "Break it on purpose and fix it", "Examiner quiz: set level and next review date", "Log mistakes; wrong twice becomes a card"],
      why: "Recall before review, struggle before help, log before you forget. The order is the method.",
      provenance: { sources: [SOURCE.loop], verified_on: VERIFIED_ON, status: "verified" } },
    { id: "O002", topic: "1.1", title: "The spaced-review ladder",
      prompt: "One missed question climbs this ladder. Put the rungs in order.",
      steps: ["Miss the question today", "See it again after 1 day", "Then after 3 days", "Then after 7 days", "Beat it at 14 days: graduated"],
      why: "Each pass spaces further out; a miss resets to tomorrow. Four right answers in a row graduate an item.",
      provenance: { sources: [SOURCE.ladder], verified_on: VERIFIED_ON, status: "verified" } }
  ],

  diagrams: [
    { id: "V001", topic: "1.2", title: "The session loop",
      prompt: "Place each piece of the daily loop where it happens.",
      // Two rows of three steps: the top row runs left to right, the bottom row right to left.
      // Each slot sits inside its own step box. Slot order is fixed: saved reviews key on V001#n.
      boxes: [
        { x: 25, y: 50, w: 230, h: 140, label: "1 · Session opens", kind: "ext" },
        { x: 285, y: 50, w: 230, h: 140, label: "2 · Warm-up", kind: "public" },
        { x: 545, y: 50, w: 230, h: 140, label: "3 · The task", kind: "vpc" },
        { x: 545, y: 290, w: 230, h: 140, label: "4 · Stuck point", kind: "private" },
        { x: 285, y: 290, w: 230, h: 140, label: "5 · Start again", kind: "vpc" },
        { x: 25, y: 290, w: 230, h: 140, label: "6 · Wrap-up", kind: "ext" }
      ],
      arrows: [
        { x1: 255, y1: 120, x2: 285, y2: 120 }, { x1: 515, y1: 120, x2: 545, y2: 120 },
        { x1: 660, y1: 190, x2: 660, y2: 290 },
        { x1: 545, y1: 360, x2: 515, y2: 360 }, { x1: 285, y1: 360, x2: 255, y2: 360 }
      ],
      slots: [
        { x: 54, y: 98, caption: "Runs first, before any new topic", answer: "Due reviews" },
        { x: 314, y: 98, caption: "Before opening notes, from memory", answer: "Recall 3 things cold" },
        { x: 574, y: 98, caption: "The attempt itself, before any help", answer: "Cold attempt" },
        { x: 574, y: 338, caption: "Only the stuck step, in 6 lines or fewer", answer: "Explainer" },
        { x: 314, y: 338, caption: "Whole task again, from step 1, alone", answer: "Redo from scratch" },
        { x: 54, y: 338, caption: "The quiz that sets your level", answer: "Examiner" }
      ],
      parts: ["Due reviews", "Recall 3 things cold", "Cold attempt", "Explainer", "Redo from scratch", "Examiner", "A flashcard", "Highlighting", "Watch the video again"],
      why: "The loop is fixed: clear due reviews first, recall before opening notes, attempt cold, unblock only the stuck step, then redo alone. Everything missed feeds the mistake log, and wrong twice becomes a card.",
      provenance: { sources: [SOURCE.loop], verified_on: VERIFIED_ON, status: "verified" } }
  ]
};
