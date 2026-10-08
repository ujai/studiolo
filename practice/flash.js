"use strict";

// ================= FLASHCARD BLITZ =================
// Decks are the repo's anki/*.csv files. The blitz is a speed check on top of them:
// Anki owns the scheduling, so blitz attempts never enter the app's review ladder.

function parseCSV(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; }
      else field += c;
      // Like Python's csv module: a quote only opens a field at its start, so a stray quote
      // mid-field stays literal instead of swallowing the rest of the file.
    } else if (c === '"' && field === "") quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some(f => f.trim())) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some(f => f.trim())) rows.push(row);
  return rows;
}

function cardsFromCSV(text, source) {
  // Lines starting with "#" are Anki file comments (the decks use "#Front,Back,Tags" as a header).
  const rows = parseCSV(text).filter(r => !(r[0] || "").trimStart().startsWith("#"));
  if (rows.length && ["front", "text"].includes((rows[0][0] || "").trim().toLowerCase())) rows.shift();
  return rows.filter(r => !!(r[0] || "").trim() && r[1] !== undefined)
    .map((r, i) => ({ id: `${source}#${i + 1}`, front: r[0], back: r[1] || "", tags: r[2] || "", source }));
}

function clozeParts(text) {
  // {{c1::answer}} or {{c1::answer::hint}}
  const re = /\{\{c\d+::(.*?)(?:::(.*?))?\}\}/g;
  return { front: text.replace(re, (_, a, h) => `[${h || "..."}]`), back: text.replace(re, (_, a) => `«${a}»`) };
}

renderers.flash = function () {
  const panel = $("panel-flash");
  const file = el("input", { type: "file", accept: ".csv", multiple: true, "aria-label": "CSV decks to load" });
  const filter = el("input", { type: "text", placeholder: "tag filter, e.g. networking", "aria-label": "Tag filter" });
  const info = el("p", { class: "muted", role: "status" });
  function refreshInfo() {
    const sources = [...new Set(store.flashcards.map(c => c.source))];
    info.textContent = store.flashcards.length
      ? `${store.flashcards.length} cards loaded from: ${sources.join(", ")}`
      : "No cards loaded yet.";
  }
  file.addEventListener("change", async () => {
    const loaded = [];
    for (const f of file.files) loaded.push(...cardsFromCSV(await f.text(), f.name));
    const names = new Set([...file.files].map(f => f.name));
    store = S.setDecks(store.flashcards.filter(c => !names.has(c.source)).concat(loaded));
    file.value = "";
    refreshInfo();
  });
  panel.replaceChildren(el("div", { class: "card" },
    el("h2", { text: "Flashcard blitz" }),
    el("p", { class: "muted", text: "Load one or more CSV decks from the repo's anki/ folder. Basic and cloze decks both work. Answer out loud before you flip. This is a speed blitz, not a replacement for Anki's scheduling — missed cards still belong in Anki's own queue." }),
    el("div", { class: "row" }, file),
    el("div", { class: "row" }, filter,
      button("Start 25-card blitz", () => {
        const f = filter.value.trim().toLowerCase();
        const pool = store.flashcards.filter(c => !f || c.tags.toLowerCase().includes(f));
        if (!pool.length) { info.textContent = store.flashcards.length ? "No cards match that tag." : "Load a CSV deck first."; return; }
        runBlitz(shuffle(pool).slice(0, 25));
      }),
      button("Unload decks", () => { store = S.setDecks([]); refreshInfo(); }, "btn ghost")),
    info));
  refreshInfo();
};

function runBlitz(cards) {
  const panel = $("panel-flash");
  const gen = runGeneration;
  let idx = 0, ok = 0;

  function show() {
    if (gen !== runGeneration) return;
    if (idx >= cards.length) return finish();
    const c = cards[idx];
    const cloze = /\{\{c\d+::/.test(c.front);
    const shown = cloze ? clozeParts(c.front) : { front: c.front, back: c.back };
    let flipped = false;

    // The card is a real button, so Enter/Space flip it the same way a click does.
    const box = el("button", { class: "card flash", type: "button", "aria-expanded": "false", onclick: () => flip() });
    box.append(el("div", { text: shown.front }), el("div", { class: "muted", text: "(think of the answer, then click or press Space)" }));
    const announced = el("div", { class: "sr-only", "aria-live": "polite" });
    const actions = el("div", { class: "row" });
    panel.replaceChildren(el("div", { class: "qtop" },
      el("span", { class: "muted", text: `${idx + 1} / ${cards.length}` }),
      el("span", { class: "badge", text: c.source })), box, announced, actions);

    function flip() {
      if (flipped) return;
      flipped = true;
      box.setAttribute("aria-expanded", "true");
      box.replaceChildren(el("div", { text: shown.front }), el("div", { class: "back", text: shown.back }));
      if (cloze && c.back) box.append(el("div", { class: "extra", text: c.back }));
      announced.textContent = "Answer: " + (cloze ? shown.back : c.back);
      // Focus stays on the card so a repeated Space can't land on "Knew it"; 1 / 2 grade instead.
      actions.replaceChildren(
        button("Knew it (1)", () => mark(true)),
        button("Missed (2)", () => mark(false), "btn danger"));
    }
    function mark(knew) {
      if (knew) ok++;
      record({ mode: "Flashcard blitz", item: c.id, topic: "", prompt: cloze ? shown.front : c.front,
        chosenText: knew ? "knew it" : "missed", correctText: cloze ? shown.back : c.back,
        correct: knew, guessed: false, tags: c.tags });
      idx++;
      show();
    }
    keyHandler = e => {
      if (!flipped && (e.key === " " || e.key === "Enter")) { e.preventDefault(); return flip(); }
      if (flipped && e.key === "1") mark(true);
      else if (flipped && e.key === "2") mark(false);
    };
    box.focus();
  }

  function finish() {
    keyHandler = null;
    panel.replaceChildren(el("div", { class: "card" },
      el("h2", { tabindex: "-1", "data-focus": "", text: "Blitz done" }),
      el("div", { class: "big", text: `${ok} / ${cards.length} known` }),
      el("p", { class: "muted", text: "Missed cards are in Progress & export. If a missed card is also due in Anki, mark it Again there too — this blitz doesn't schedule anything." }),
      el("div", { class: "row" }, button("Again", renderers.flash))));
    focusStart(panel);
  }

  show();
}
