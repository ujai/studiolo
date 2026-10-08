"use strict";

// ================= BOOT, PROGRESS, EXPORT, BACKUP =================
// Loaded last: wires the tabs, reports content/storage problems to the learner, and owns
// Progress & export. All state lives in storage.js; this file never touches localStorage directly.

function mdCell(s) { return String(s || "").replace(/\|/g, "/").replace(/\s+/g, " ").trim(); }
function csvCell(s) {
  const v = String(s || "");
  return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
}
function downloadText(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = el("a", { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
// Progress is re-rendered after a restore or reset, which rebuilds that panel's status line.
function setProgressNote(text) {
  const n = document.querySelector('#panel-progress p[role="status"]');
  if (n) n.textContent = text;
}

// ---------- content and storage banners ----------
// Broken content must never take tabs down silently: say exactly which item is wrong.
function renderNotices() {
  const box = $("notices");
  const items = [];
  if (CONTENT.errors.length) {
    items.push(el("div", { class: "feedback bad", role: "alert" },
      el("strong", { text: `questions.js has ${CONTENT.errors.length} problem${CONTENT.errors.length === 1 ? "" : "s"}. ` }),
      "Fix them before trusting the scores. Items with errors may not load correctly.",
      el("ul", { class: "notice-list" }, CONTENT.errors.slice(0, 12).map(e => el("li", { text: e })),
        CONTENT.errors.length > 12 ? el("li", { text: `…and ${CONTENT.errors.length - 12} more.` }) : null)));
  }
  if (CONTENT.warnings.length) {
    items.push(el("div", { class: "feedback", role: "status" },
      el("strong", { text: `${CONTENT.warnings.length} item${CONTENT.warnings.length === 1 ? "" : "s"} still marked needs-check. ` }),
      el("span", { class: "muted", text: CONTENT.warnings.join(" ") })));
  }
  box.replaceChildren(...items);
}

// ---------- tabs ----------
$("tabs").addEventListener("click", e => {
  const b = e.target.closest(".tab");
  if (!b) return;
  stopTimer();
  keyHandler = null;
  runGeneration++;               // delayed callbacks from an abandoned drill must not restart it
  document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t === b));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === "panel-" + b.dataset.panel));
  renderers[b.dataset.panel]();
});

// ---------- progress & export ----------
renderers.progress = function () {
  const panel = $("panel-progress");
  const stats = {};
  for (const delayed of [false, true]) {
    for (const [topic, s] of Object.entries(topicStats(delayed))) {
      const x = stats[topic] || (stats[topic] = { n: 0, ok: 0, last: "" });
      x.n += s.n;
      x.ok += s.ok;   // guesses already excluded by topicStats: a lucky answer is not knowledge
      if (s.last > x.last) x.last = s.last;
    }
  }
  const pendingNow = () => store.attempts.filter(a => !a.exported && (!a.correct || a.guessed));
  const nextDue = {};
  for (const [id, r] of Object.entries(store.review)) {
    const it = reviewTarget(id);
    if (!it) continue;
    const t = it.d.topic;
    if (!nextDue[t] || r.due < nextDue[t]) nextDue[t] = r.due;
  }
  const out = el("textarea", { readonly: true, placeholder: "Exported text appears here.", "aria-label": "Exported text" });
  const note = el("p", { class: "muted", role: "status" });
  const pendingInfo = el("p", { class: "muted" });
  const refreshPending = () => {
    const n = pendingNow().length;
    pendingInfo.textContent = n ? `${n} new miss or guess${n === 1 ? "" : "es"} not yet exported.` : "Nothing new to export.";
  };

  function copy(text, what) {
    out.value = text;
    const done = () => { note.textContent = `${what} copied below${navigator.clipboard ? " and to the clipboard" : ""}.`; };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }
  function exportMistakes() {
    const pending = pendingNow();
    if (!pending.length) { note.textContent = "Nothing new to export."; return; }
    const rows = pending.map(a => {
      const misses = missCount(a.item);
      const q = mdCell(a.prompt);
      const said = `Q: ${q.length > 140 ? q.slice(0, 137) + "..." : q} → ${mdCell(a.chosenText)}`;
      const topic = a.topic || mdCell(a.tags);
      return `| app-${a.item} | ${a.at.slice(0, 10)} | ${topic} | Practice app (${a.mode}) | ${said} | ${mdCell(a.correctText)} | ${a.correct && a.guessed ? "guessed-right" : ""} |  |  | ${misses >= 2 ? "yes" : "no"} |`;
    });
    copy(rows.join("\n"), `${rows.length} mistake-log row${rows.length === 1 ? "" : "s"}`);
    store = S.updateAttempts(pending.map(a => ({ ...a, exported: true })));
    refreshPending();
  }
  function exportCards() {
    const seen = new Map();
    for (const a of store.attempts) {
      if (!a.correct && a.mode !== "Flashcard blitz" && missCount(a.item) >= 2) seen.set(a.item, a);
    }
    if (!seen.size) { note.textContent = "No item has been missed twice yet. Wrong twice = flashcard."; return; }
    const lines = [...seen.values()].map(a => [
      csvCell(a.prompt), csvCell(a.correctText),
      csvCell(`studiolo ${AREAS[C.area(a.topic)]?.tag || a.topic} practice-app`.replace(/\s+/g, " "))
    ].join(","));
    copy(lines.join("\n"), `${lines.length} Anki row${lines.length === 1 ? "" : "s"} (Front,Back,Tags)`);
  }
  function downloadBackup() {
    downloadText(`studiolo-practice-${today()}.json`, JSON.stringify(store, null, 1), "application/json");
    note.textContent = "Backup downloaded. Keep it with your repo, not on a public share.";
  }
  function downloadRaw() {
    downloadText(`studiolo-raw-storage-${today()}.json`, JSON.stringify(S.rawBackup(), null, 1), "application/json");
    note.textContent = "Raw storage downloaded. This is the recovery copy if the app ever calls your data unreadable.";
  }
  const importInput = el("input", { type: "file", accept: ".json", "aria-label": "Restore a backup file" });
  importInput.addEventListener("change", async () => {
    const file = importInput.files[0];
    if (!file) return;
    let parsed;
    try { parsed = C.validateStore(JSON.parse(await file.text())); }
    catch (e) { note.textContent = `That file isn't a practice-app backup (${e.message}).`; importInput.value = ""; return; }
    if (!confirm(`Replace the progress in this browser with ${parsed.attempts.length} saved attempts from the backup?`)) { importInput.value = ""; return; }
    const next = S.replace(parsed);
    importInput.value = "";
    if (!next) { note.textContent = "The restore could not be saved. Download a backup before closing the page."; return; }
    store = next;
    renderers.progress();
    setProgressNote(`Backup restored: ${next.attempts.length} attempt${next.attempts.length === 1 ? "" : "s"}, ${Object.keys(next.review).length} scheduled.`);
  });

  refreshPending();
  panel.replaceChildren(
    el("div", { class: "card" },
      el("h2", { text: "Per-topic accuracy" }),
      el("p", { class: "muted", text: "This is a hint, not your level. Levels in learner-map.md come from the Examiner. Topics under 70% are good candidates for the next session or the \"weak topics\" scope." }),
      el("table", {},
        el("tr", {}, el("th", { text: "Topic" }), el("th", { text: "Attempts" }), el("th", { text: "Accuracy" }), el("th", { text: "Last practiced" }), el("th", { text: "Next review" })),
        Object.keys(TOPICS).map(t => {
          const s = stats[t];
          return el("tr", {},
            el("td", {}, badge(t)),
            el("td", { text: s ? s.n : "–" }),
            el("td", { class: s ? (s.ok / s.n < WEAK_THRESHOLD ? "weak" : "good") : "", text: s ? Math.round(s.ok / s.n * 100) + "%" : "not practiced" }),
            el("td", { class: "muted", text: s ? s.last.slice(0, 10) : "" }),
            el("td", { class: "muted", text: nextDue[t] ? nextDue[t] + (nextDue[t] <= today() ? " (due)" : "") : "" }));
        }))),
    el("div", { class: "card" },
      el("h2", { text: "Export" }),
      pendingInfo,
      el("div", { class: "row" },
        button("Mistake-log rows (templates.md §2)", exportMistakes),
        button("Anki rows for items missed twice", exportCards)),
      el("p", { class: "muted", text: "Paste the rows into your mistake log and fill in Why wrong and Missed clue yourself. Writing them is part of the learning. The Diagnostician reads that log on ritual day. Check every fact on the Anki rows against an authoritative source for your subject before importing." }),
      note, out),
    el("div", { class: "card" },
      el("h2", { text: "Backup" }),
      el("p", { class: "muted", text: "Progress is saved in this browser only, and only on this device. Download a backup to move it to another browser or keep it with the repo." }),
      el("div", { class: "row" },
        button("Download backup (.json)", downloadBackup, "btn ghost"),
        el("label", { class: "inline" }, "Restore:", importInput)),
      el("div", { class: "row" },
        button("Download raw storage (recovery)", downloadRaw, "btn ghost"),
        button("Reset all progress", () => {
          if (!confirm("Delete all practice history, the review schedule, and loaded flashcard decks in this browser? Download a backup first if you might want it back.")) return;
          const next = S.replace(C.emptyStore());
          if (!next) { note.textContent = "The reset could not be saved. Download a backup before closing the page."; return; }
          store = next;
          renderers.progress();
          setProgressNote("Progress reset. The decks and history in this browser are gone.");
        }, "btn danger"))));
};

// ---------- start ----------
renderNotices();
renderers.sprint();
