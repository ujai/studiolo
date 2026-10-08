"use strict";

// ================= SPACED REVIEW =================
// The schedule lives in the attempt history, not in a separate object: storage.js replays
// misses and Review-mode answers through core.js scheduleFromAttempts while it merges state.
// So this tab only has to ask "what is due" and answer items as mode "Review".
// Ladder: miss -> +1 day, then +3, +7, +14 while you keep answering right. Four rights graduate it.

const REVIEW_LADDER = [1, 3, 7, 14];

// A scheduled id can point at a scenario, a pair, an order, or one slot of a diagram (id#n).
function reviewTarget(id) {
  for (const q of DATA.scenarios) if (q.id === id) return { kind: "scenario", d: q };
  for (const p of DATA.pairs) if (p.id === id) return { kind: "pair", d: p };
  for (const o of DATA.orders) if (o.id === id) return { kind: "order", d: o };
  const [dId, slot] = String(id).split("#");
  const d = DATA.diagrams.find(x => x.id === dId);
  const i = Number(slot) - 1;
  if (d && slot && Number.isInteger(i) && d.slots[i]) return { kind: "slot", d, i };
  return null;
}

function reviewPreview(id, it) {
  const t = it.kind === "scenario" ? it.d.q : it.kind === "pair" ? it.d.clue
    : it.kind === "order" ? it.d.prompt : (it.d.slots[it.i].caption || it.d.title);
  return t.length > 90 ? t.slice(0, 87) + "..." : t;
}

function dueEntries() {
  const entries = Object.entries(store.review)
    .map(([id, r]) => ({ id, r, it: reviewTarget(id) }))
    .sort((a, b) => a.r.due.localeCompare(b.r.due) || a.id.localeCompare(b.id));
  return { due: entries.filter(e => e.it && e.r.due <= today()), orphans: entries.filter(e => !e.it) };
}

renderers.review = function () {
  const panel = $("panel-review");
  const { due, orphans } = dueEntries();
  const upcoming = Object.entries(store.review)
    .filter(([id, r]) => reviewTarget(id) && r.due > today())
    .sort((a, b) => a[1].due.localeCompare(b[1].due) || a[0].localeCompare(b[0]));
  const repaired = el("p", { class: "muted", role: "status" });
  const cleanBtn = button(`Remove ${orphans.length} orphaned ${orphans.length === 1 ? "entry" : "entries"}`, () => {
    if (!confirm("These saved items are not in questions.js any more, so they can never be reviewed. Remove them from the schedule?")) return;
    const review = { ...store.review };
    for (const e of orphans) delete review[e.id];
    const next = S.replace({ ...store, review });
    if (!next) { repaired.textContent = "Could not save the cleanup. Download a backup before closing the page."; return; }
    store = next;
    renderers.review();
  }, "btn ghost");

  panel.replaceChildren(el("div", { class: "card" },
    el("h2", { text: "Spaced review" }),
    el("p", { class: "muted", text: "Every question you miss (or guess) in the other drills comes back tomorrow, then after 3, 7 and 14 days while you keep getting it right. One miss resets the ladder. Anki schedules the CSV decks; this schedules the app questions." }),
    el("div", { class: "big", text: `${due.length} due today` }),
    el("p", { class: "muted", text: upcoming.length ? `${upcoming.length} more scheduled, next on ${upcoming[0][1].due}.` : "Nothing else scheduled. Miss something first — that's what feeds this queue." }),
    el("div", { class: "row" },
      button(`Review ${due.length} due`, () => runReview(due.map(e => e.id)), "btn", { disabled: !due.length })),
    orphans.length ? el("div", { class: "row" }, el("p", { class: "muted", text: `${orphans.length} saved ${orphans.length === 1 ? "item is" : "items are"} no longer in questions.js: ${orphans.map(e => e.id).join(", ")}.` }), cleanBtn) : null,
    repaired,
    due.length ? el("div", {}, el("h3", { text: "Due today" }),
      due.map(e => el("div", { class: "review-item" }, badge(e.it.d.topic), " ", el("span", { class: "muted", text: `stage ${e.r.stage + 1} of ${REVIEW_LADDER.length} · ` }), reviewPreview(e.id, e.it)))) : null));
};

function runReview(ids) {
  const panel = $("panel-review");
  const items = ids.map(id => ({ id, it: reviewTarget(id) })).filter(x => x.it);
  const gen = runGeneration;
  let idx = 0, ok = 0;

  function nextItem() { idx++; show(); }

  function show() {
    stopTimer();
    keyHandler = null;
    if (gen !== runGeneration) return;
    if (idx >= items.length) return finish();
    const { id, it } = items[idx];
    const { kind, d } = it;
    let done = false;
    const fb = el("div", { "aria-live": "polite" });
    const head = el("div", { class: "qtop" },
      el("span", { class: "muted", text: `Review ${idx + 1} / ${items.length}` }),
      badge(d.topic),
      el("span", { class: "muted", text: `stage ${(store.review[id]?.stage ?? 0) + 1} of ${REVIEW_LADDER.length}` }));
    const body = el("div", { class: "card" }, head);

    function settle(correct, chosenText, correctText, prompt, detail) {
      // mode "Review" is what advances the ladder; a miss sends the item back to +1 day.
      record({ mode: "Review", item: id, topic: d.topic, prompt, chosenText, correctText, correct, guessed: false });
      if (correct) ok++;
      const nextBtn = button(idx + 1 < items.length ? "Next (Enter)" : "See summary (Enter)", nextItem);
      fb.replaceChildren(feedback(correct, correct ? "Correct." : "Wrong.", detail), el("div", { class: "row" }, nextBtn));
      nextBtn.focus();
    }

    if (kind === "scenario") {
      const prepared = prepareQuestion(d);
      const sc = scenarioControls(prepared, `review-opt-${idx}`);
      const submitBtn = button("Check (Enter)", () => submit());
      body.append(
        el("div", { class: "qtext", tabindex: "-1", "data-focus": "", text: d.q }),
        sc.instruction, sc.group,
        el("div", { class: "row" }, submitBtn,
          el("span", { class: "muted" }, el("kbd", { text: sc.hint }), " select  ", el("kbd", { text: "Enter" }), " check / next")),
        fb);
      function submit() {
        if (done) return;
        const chosen = sc.chosen();
        if (!chosen.length) { fb.replaceChildren(el("p", { class: "warn-t", text: "Pick an answer first." })); return; }
        done = true;
        sc.reveal(chosen); submitBtn.disabled = true;
        settle(sc.grade(chosen), sc.text(chosen), sc.text(prepared.answer), d.q, d.explain);
      }
      keyHandler = e => {
        if (e.key === "Enter") { e.preventDefault(); return done ? nextItem() : submit(); }
        if (!done) sc.key(e);
      };
    } else if (kind === "pair") {
      const sides = Math.random() < 0.5 ? ["b", "a"] : ["a", "b"];
      const btns = sides.map((s, j) => button((j === 0 ? "← " : "") + d[s] + (j === 1 ? " →" : ""), () => answer(s), "pairbtn"));
      body.append(
        el("div", { class: "clue", tabindex: "-1", "data-focus": "", text: d.clue }),
        el("div", { class: "pairbtns" }, btns), fb);
      function answer(side) {
        if (done) return; done = true;
        btns.forEach((b, j) => {
          if (sides[j] === d.answer) b.classList.add("right");
          else if (sides[j] === side) b.classList.add("wrong");
          b.disabled = true;
        });
        settle(side === d.answer, d[side], d[d.answer], `${d.clue} (${d.a} vs ${d.b})`, d.why);
      }
      keyHandler = e => {
        if (!done && (e.key === "ArrowLeft" || e.key === "1")) answer(sides[0]);
        else if (!done && (e.key === "ArrowRight" || e.key === "2")) answer(sides[1]);
        else if (done && e.key === "Enter") nextItem();
      };
    } else if (kind === "order") {
      const checkBtn = button("Check (Enter)", () => submitOrder());
      const oc = orderControls(d, () => checkBtn);
      body.append(
        el("div", { class: "qtext", tabindex: "-1", "data-focus": "", text: d.prompt }),
        el("h3", { text: "Steps (click in order)" }), oc.chipsEl,
        el("h3", { text: "Your order" }), oc.listEl,
        el("div", { class: "row" }, checkBtn), fb);
      function submitOrder() {
        if (done) return;
        if (oc.left()) { fb.replaceChildren(el("p", { class: "warn-t", text: "Place every step first." })); return; }
        done = true;
        const r = oc.check();
        settle(r.correct, r.chosenText, r.correctText, `Order: ${d.title}`,
          el("span", {}, `${r.right} / ${d.steps.length} in position. `, d.why,
            r.correct ? null : el("ol", { class: "picked" }, d.steps.map(s => el("li", { class: "right", text: s })))));
      }
      keyHandler = e => { if (e.key === "Enter") { e.preventDefault(); return done ? nextItem() : submitOrder(); } };
    } else {
      const s = d.slots[it.i];
      const sel = el("select", { "aria-label": `Slot ${it.i + 1}${s.caption ? ": " + s.caption : ""}` },
        el("option", { value: "", text: "— choose —" }), shuffle(d.parts).map(p => el("option", { value: p, text: p })));
      body.append(
        el("div", { class: "qtext", tabindex: "-1", "data-focus": "", text: `${d.title} — where does this part go?` }),
        s.caption ? el("p", { class: "warn-t", text: s.caption }) : null,
        el("div", { class: "row" }, sel, button("Check (Enter)", () => submitSlot())), fb);
      function submitSlot() {
        if (done) return;
        if (!sel.value) { fb.replaceChildren(el("p", { class: "warn-t", text: "Pick a part first." })); return; }
        done = true;
        const right = sel.value === s.answer;
        sel.classList.add(right ? "right" : "wrong");
        sel.disabled = true;
        settle(right, sel.value, s.answer, `${d.title}: slot ${it.i + 1}${s.caption ? " (" + s.caption + ")" : ""}`,
          el("span", {}, right ? null : `Right answer: ${s.answer}. `, d.why));
      }
      keyHandler = e => { if (e.key === "Enter") { e.preventDefault(); return done ? nextItem() : submitSlot(); } };
    }

    panel.replaceChildren(body);
    focusStart(panel);
  }

  function finish() {
    keyHandler = null;
    const missed = items.length - ok;
    const graduated = ok >= REVIEW_LADDER.length;
    panel.replaceChildren(el("div", { class: "card" },
      el("h2", { tabindex: "-1", "data-focus": "", text: "Review round done" }),
      el("div", { class: "big", text: `${ok} / ${items.length} remembered` }),
      el("p", { class: "muted", text: missed
        ? `${missed} missed — ${missed === 1 ? "it comes" : "they come"} back tomorrow with the ladder reset.`
        : "Nothing missed. Every item moved up the 1-3-7-14 ladder; four right answers in a row graduate an item." }),
      graduated && !missed ? el("p", { class: "ok-t", text: "That was a full ladder of correct answers." }) : null,
      el("p", { class: "muted", text: "Misses here are also in Progress & export, ready for the mistake log." }),
      el("div", { class: "row" }, button("Back to review", renderers.review))));
    focusStart(panel);
  }

  show();
}
