"use strict";

// ================= VISUAL DRILLS =================
// Diagrams: place every part on the picture. Orders: rebuild a sequence from memory.
// Both share the app's orderControls/selects so keyboard and duplicate-step handling stay in one place.

const SVGNS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}
const BOX_STYLE = { region: "#475569", vpc: "#22d3ee", public: "#34d399", private: "#a78bfa", ext: "#fbbf24" };

renderers.visual = function () {
  const panel = $("panel-visual");
  panel.replaceChildren(el("div", { class: "card" },
    el("h2", { text: "Visual drills" }),
    el("p", { class: "muted", text: "Diagrams: place every part. Orders: click the steps in the right sequence. Rebuild the picture from memory before you look anything up." }),
    el("h3", { text: "Diagrams" }),
    DATA.diagrams.length
      ? el("div", { class: "chips" }, DATA.diagrams.map(d => button(d.topic + "  " + d.title, () => runDiagram(d), "chip")))
      : el("p", { class: "muted", text: "No diagrams in questions.js yet." }),
    el("h3", { text: "Put in order" }),
    DATA.orders.length
      ? el("div", { class: "chips" }, DATA.orders.map(d => button(d.topic + "  " + d.title, () => runOrder(d), "chip")))
      : el("p", { class: "muted", text: "No ordered steps in questions.js yet." })));
};

function runDiagram(d) {
  const panel = $("panel-visual");
  const svg = svgEl("svg", { viewBox: "0 0 800 480", role: "img", "aria-label": d.title });
  const defs = svgEl("defs", {});
  const marker = svgEl("marker", { id: "arrow", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse" });
  marker.append(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: "#94a3b8" }));
  defs.append(marker); svg.append(defs);
  for (const b of d.boxes) {
    const c = BOX_STYLE[b.kind] || "#475569";
    svg.append(svgEl("rect", { x: b.x, y: b.y, width: b.w, height: b.h, rx: 6, fill: c + "14", stroke: c, "stroke-dasharray": b.kind === "region" ? "6 4" : "" }));
    const t = svgEl("text", { x: b.x + 8, y: b.y + 16, fill: c, "font-size": 12, "font-family": "monospace" });
    t.textContent = b.label;
    svg.append(t);
  }
  for (const a of d.arrows || []) svg.append(svgEl("line", { x1: a.x1, y1: a.y1, x2: a.x2, y2: a.y2, stroke: "#94a3b8", "stroke-width": 1.5, "marker-end": "url(#arrow)" }));

  const parts = shuffle(d.parts);
  const selects = d.slots.map((s, i) => el("select", { "aria-label": `Slot ${i + 1}${s.caption ? ": " + s.caption : ""}` },
    el("option", { value: "", text: "— choose —" }), parts.map(p => el("option", { value: p, text: p }))));
  const fixes = d.slots.map(() => el("div", { class: "fix" }));
  const slotEls = d.slots.map((s, i) => el("div", { class: "slot", style: `left:${s.x / 8}%;top:${s.y / 4.8}%` },
    s.caption ? el("div", { class: "cap", text: s.caption }) : null, selects[i], fixes[i]));
  const fb = el("div", { "aria-live": "polite" });
  let checked = false;

  panel.replaceChildren(el("div", { class: "card" },
    el("div", { class: "qtop" }, el("h2", { tabindex: "-1", "data-focus": "", text: d.title }), badge(d.topic)),
    el("p", { class: "muted", text: d.prompt }),
    el("div", { class: "diagram" }, svg, slotEls),
    el("div", { class: "row" },
      button("Check", check),
      button("Retry", () => runDiagram(d), "btn ghost"),
      button("Back to list", renderers.visual, "btn ghost")),
    fb));
  focusStart(panel);

  function check() {
    if (checked) return;
    if (selects.some(s => !s.value)) { fb.replaceChildren(el("p", { class: "warn-t", text: "Fill every slot first. Guessing is fine; blanks aren't." })); return; }
    checked = true;
    let ok = 0;
    d.slots.forEach((s, i) => {
      const right = selects[i].value === s.answer;
      if (right) ok++; else fixes[i].textContent = "→ " + s.answer;
      selects[i].classList.add(right ? "right" : "wrong");
      selects[i].disabled = true;
      record({ mode: "Visual drill", item: `${d.id}#${i + 1}`, topic: d.topic, prompt: `${d.title}: slot ${i + 1}${s.caption ? " (" + s.caption + ")" : ""}`,
        chosenText: selects[i].value, correctText: s.answer, correct: right, guessed: false });
    });
    fb.replaceChildren(feedback(ok === d.slots.length, `${ok} / ${d.slots.length} correct.`, d.why));
  }
  keyHandler = e => { if (e.key === "Enter") { e.preventDefault(); check(); } };
}

function runOrder(d) {
  const panel = $("panel-visual");
  const checkBtn = button("Check", check);
  const oc = orderControls(d, () => checkBtn);
  const fb = el("div", { "aria-live": "polite" });
  let checked = false;

  panel.replaceChildren(el("div", { class: "card" },
    el("div", { class: "qtop" }, el("h2", { tabindex: "-1", "data-focus": "", text: d.title }), badge(d.topic)),
    el("p", { class: "muted", text: d.prompt }),
    el("h3", { text: "Steps (click in order)" }), oc.chipsEl,
    el("h3", { text: "Your order" }), oc.listEl,
    el("div", { class: "row" },
      checkBtn,
      button("Retry", () => runOrder(d), "btn ghost"),
      button("Back to list", renderers.visual, "btn ghost")),
    fb));
  focusStart(panel);

  function check() {
    if (checked) return;
    if (oc.left()) { fb.replaceChildren(el("p", { class: "warn-t", text: "Place every step first." })); return; }
    checked = true;
    const r = oc.check();
    record({ mode: "Visual drill", item: d.id, topic: d.topic, prompt: `Order: ${d.title}`,
      chosenText: r.chosenText, correctText: r.correctText, correct: r.correct, guessed: false });
    fb.replaceChildren(feedback(r.correct, `${r.right} / ${d.steps.length} in the right position.`, d.why),
      r.correct ? null : el("ol", { class: "picked" }, d.steps.map(s => el("li", { class: "right", text: s }))));
  }
  keyHandler = e => { if (e.key === "Enter") { e.preventDefault(); check(); } };
}
