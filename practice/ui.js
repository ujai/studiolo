"use strict";

// Shared state and UI helpers. Loaded as a classic script so the app still opens with a double-click.
const C = window.StudioloCore;
const S = window.StudioloStorage;
const DATA = window.PRACTICE_DATA;
const META = window.STUDIOLO_TOPICS || { topics: {}, areas: {} };
const TOPICS = META.topics;
const AREAS = META.areas;
const WEAK_THRESHOLD = 0.7;
const CONTENT = C.validateContent(DATA, META);

let store = S.load();
function record(a) { store = S.record(a); }
window.addEventListener("studiolo-storage-updated", () => { store = S.load(); });
window.addEventListener("studiolo-storage-replaced", () => { store = S.load(); });
function missCount(itemId) { return store.attempts.filter(a => a.item === itemId && !a.correct).length; }

const $ = id => document.getElementById(id);
function el(tag, attrs, ...children) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) n.setAttribute(k, v === true ? "" : v);
  }
  for (const c of children.flat()) if (c != null) n.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return n;
}
function button(text, onclick, cls = "btn", extra = {}) {
  return el("button", { class: cls, type: "button", text, onclick, ...extra });
}
function labeled(text, control) { return el("label", { class: "inline" }, text, control); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function badge(topic) {
  if (!topic) return el("span", { class: "badge", text: "flashcard" });
  const n = Number(C.area(topic)) || 1;
  return el("span", { class: "badge d" + ((((n - 1) % 5) + 5) % 5 + 1), title: TOPICS[topic] || "",
    text: topic + " " + (TOPICS[topic] || "") });
}
function fmtTime(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
function today() { return C.localDay(); }
function focusStart(panel) { const n = panel.querySelector("[data-focus]"); if (n) n.focus(); }
function feedback(ok, head, detail) {
  return el("div", { class: "feedback " + (ok ? "ok" : "bad") }, el("strong", { text: head + " " }), detail);
}
function topicStats(delayed) {
  const stats = {};
  for (const a of store.attempts) {
    if (!a.topic || (a.mode === "Review") !== delayed) continue;
    const s = stats[a.topic] || (stats[a.topic] = { n: 0, ok: 0, last: "" });
    s.n++; if (a.correct && !a.guessed) s.ok++; if (a.at > s.last) s.last = a.at;
  }
  return stats;
}
function weakTopics() {
  const all = {};
  for (const delayed of [false, true]) {
    for (const [t, s] of Object.entries(topicStats(delayed))) {
      const x = all[t] || (all[t] = { n: 0, ok: 0 });
      x.n += s.n; x.ok += s.ok;
    }
  }
  return Object.keys(all).filter(t => all[t].ok / all[t].n < WEAK_THRESHOLD);
}
function scopeOptions(includeWeak) {
  const opts = [el("option", { value: "all", text: "All topics" })];
  if (includeWeak) opts.push(el("option", { value: "weak", text: "My weak topics (< 70%)" }));
  for (const [d, info] of Object.entries(AREAS)) opts.push(el("option", { value: "d" + d, text: info.name }));
  for (const t of Object.keys(TOPICS)) opts.push(el("option", { value: "t" + t, text: t + " " + TOPICS[t] }));
  return opts;
}
function inScope(topic, scope, weak) {
  if (scope === "all") return true;
  if (scope === "weak") return weak.includes(topic);
  if (scope[0] === "d") return C.area(topic) === scope.slice(1);
  return topic === scope.slice(1);
}
function emptyPoolMessage(scope, weak, what) {
  if (scope === "weak" && !weak.length) return "No weak topics yet. Practice first, or pick another scope.";
  return `No ${what} in that scope yet.`;
}

// One interval, one timeout, and one key handler at a time, so a tab switch leaves nothing running.
let activeTimer = null, activeTimeout = null;
function stopTimer() {
  if (activeTimer) { clearInterval(activeTimer); activeTimer = null; }
  if (activeTimeout) { clearTimeout(activeTimeout); activeTimeout = null; }
}
let runGeneration = 0;
let keyHandler = null;
document.addEventListener("keydown", e => {
  const t = e.target;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) && t.type !== "checkbox" && t.type !== "radio") return;
  // A focused button already acts on Enter/Space; handling it here too would advance twice.
  if (t.tagName === "BUTTON" && (e.key === "Enter" || e.key === " ")) return;
  if (keyHandler) keyHandler(e);
});

const renderers = {};

function prepareQuestion(q) {
  const order = shuffle(q.options.map((_, i) => i));
  return { q, options: order.map(i => q.options[i]),
    answer: order.map((orig, i) => q.answer.includes(orig) ? i : -1).filter(i => i >= 0) };
}

// Shared by Exam sprint and Spaced review so both handle any option and answer count.
function scenarioControls(prepared, name) {
  const need = prepared.answer.length;
  const multi = need > 1;
  const inputs = [];
  const opts = prepared.options.map((o, i) => {
    const inp = el("input", { type: multi ? "checkbox" : "radio", name });
    inputs.push(inp);
    return el("label", { class: "opt" }, inp, el("span", { class: "key", "aria-hidden": "true", text: C.optionKey(i) }), el("span", { text: o }));
  });
  const keyed = Math.min(inputs.length, 26);
  return {
    inputs, opts,
    group: el("fieldset", { class: "options" }, el("legend", { class: "sr-only", text: multi ? `Choose ${need} answers` : "Choose one answer" }), opts),
    instruction: multi ? el("p", { class: "warn-t", text: `Choose ${need}.` }) : null,
    hint: `${C.optionKey(0)}-${C.optionKey(keyed - 1)}`,
    chosen: () => inputs.map((inp, i) => inp.checked ? i : -1).filter(i => i >= 0),
    grade: chosen => chosen.length === need && chosen.every(i => prepared.answer.includes(i)),
    text: list => list.map(i => prepared.options[i]).join(" + "),
    reveal(chosen) {
      opts.forEach((o, i) => { if (prepared.answer.includes(i)) o.classList.add("right"); else if (chosen.includes(i)) o.classList.add("wrong"); });
      inputs.forEach(inp => { inp.disabled = true; });
    },
    key(e) {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return false;
      const i = e.key.toUpperCase().charCodeAt(0) - 65;
      if (i < 0 || i >= keyed) return false;
      inputs[i].checked = multi ? !inputs[i].checked : true;
      e.preventDefault();
      return true;
    }
  };
}

// Works on step indices, so repeated step text stays placeable.
// `checkButton` is a getter for the caller's Check button: once every step is placed, focus moves
// there so Enter submits the answer instead of re-arranging the last chip.
function orderControls(d, checkButton) {
  let remaining = shuffle(d.steps.map((_, i) => i));
  if (remaining.length > 1 && remaining.every((s, j) => d.steps[s] === d.steps[j])) remaining.reverse();
  const picked = [];
  let locked = false;
  const chipsEl = el("div", { class: "chips", role: "group", "aria-label": "Steps not placed yet" });
  const listEl = el("ol", { class: "picked", "aria-label": "Your order" });
  function draw(focus) {
    chipsEl.replaceChildren(...remaining.map((s, k) => button(d.steps[s], () => {
      if (locked) return; remaining.splice(k, 1); picked.push(s); draw("chips");
    }, "chip")));
    listEl.replaceChildren(...picked.map((s, j) => el("li", {}, button(d.steps[s], () => {
      if (locked) return; picked.splice(j, 1); remaining.push(s); draw("list");
    }, "chip-inline", { disabled: locked, "aria-label": locked ? d.steps[s] : `Put back: ${d.steps[s]}` }))));
    const check = !remaining.length && !locked && checkButton && checkButton();
    const target = check || (focus === "chips" ? chipsEl.querySelector("button") || listEl.querySelector("li:last-child button")
      : focus === "list" ? listEl.querySelector("li:last-child button") || chipsEl.querySelector("button") : null);
    if (target) target.focus();
  }
  draw();
  return {
    chipsEl, listEl,
    left: () => remaining.length,
    check() {
      locked = true; draw();
      let right = 0;
      [...listEl.children].forEach((li, j) => { const r = d.steps[picked[j]] === d.steps[j]; if (r) right++; li.classList.add(r ? "right" : "wrong"); });
      return { right, correct: right === d.steps.length,
        chosenText: picked.map((s, j) => `${j + 1}) ${d.steps[s]}`).join(" "),
        correctText: d.steps.map((s, j) => `${j + 1}) ${s}`).join(" ") };
    }
  };
}
