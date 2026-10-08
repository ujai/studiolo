"use strict";

// ================= EXAM SPRINT =================
renderers.sprint = function () {
  const panel = $("panel-sprint");
  const count = el("select", {}, [10, 20, 30, 50].map(n => el("option", { value: n, text: n + " questions" })));
  const scope = el("select", {}, scopeOptions(true));
  const mode = el("select", {}, el("option", { value: "instant", text: "Feedback after each question" }),
    el("option", { value: "exam", text: "Exam mode: feedback at the end" }));
  const timer = el("select", {}, [["120", "2:00 per question"], ["180", "3:00 per question"], ["300", "5:00 per question"], ["0", "No timer"]]
    .map(([v, t]) => el("option", { value: v, text: t })));
  const msg = el("p", { class: "muted", role: "status" });
  panel.replaceChildren(el("div", { class: "card" },
    el("h2", { text: "Exam sprint" }),
    el("p", { class: "muted", text: "Scenario questions at test pace. Pick a timer that fits you, or turn it off. Tick \"I guessed\" when you're not sure: guessed-right answers are exported and come back for review too." }),
    el("div", { class: "row" }, labeled("Length", count), labeled("Scope", scope), labeled("Feedback", mode), labeled("Timer", timer)),
    el("div", { class: "row" }, button("Start", () => {
      const weak = weakTopics();
      const pool = DATA.scenarios.filter(q => inScope(q.topic, scope.value, weak));
      if (!pool.length) { msg.textContent = emptyPoolMessage(scope.value, weak, "questions"); return; }
      runSprint(shuffle(pool).slice(0, +count.value), mode.value, +timer.value);
    })),
    msg));
};

function runSprint(questions, mode, seconds) {
  const panel = $("panel-sprint");
  const items = questions.map(prepareQuestion);
  const results = [];
  let idx = 0;

  function show() {
    stopTimer();
    if (idx >= items.length) return finish();
    const it = items[idx];
    const sc = scenarioControls(it, "sprint-opt");
    const guessKey = it.options.length < 7;  // "G" is an option key from the seventh option on
    let left = seconds, submitted = false;
    const timerEl = el("span", { class: "timer", role: "timer", text: seconds ? fmtTime(left) : "" });
    const guessed = el("input", { type: "checkbox" });
    const fb = el("div", { "aria-live": "polite" });
    const submitBtn = button("Submit", () => submit(false));
    panel.replaceChildren(el("div", { class: "card" },
      el("div", { class: "qtop" }, el("span", { class: "muted", text: `Question ${idx + 1} / ${items.length}` }), badge(it.q.topic), timerEl),
      el("div", { class: "qtext", tabindex: "-1", "data-focus": "", text: it.q.q }),
      sc.instruction, sc.group,
      el("div", { class: "row" }, el("label", { class: "inline" }, guessed, "I guessed"), submitBtn,
        el("span", { class: "muted" }, el("kbd", { text: sc.hint }), " select  ",
          guessKey ? [el("kbd", { text: "G" }), " guessed  "] : null, el("kbd", { text: "Enter" }), " submit")),
      fb));
    focusStart(panel);

    function submit(timedOut) {
      if (submitted) return;
      const chosen = sc.chosen();
      if (!timedOut && !chosen.length) { fb.replaceChildren(el("p", { class: "warn-t", text: "Pick an answer first." })); return; }
      submitted = true; stopTimer();
      const correct = sc.grade(chosen);
      results.push({ it, sc, chosen, correct, guessed: guessed.checked });
      record({ mode: "Exam sprint", item: it.q.id, topic: it.q.topic, prompt: it.q.q,
        chosenText: timedOut && !chosen.length ? "(time ran out)" : sc.text(chosen),
        correctText: sc.text(it.answer), correct, guessed: guessed.checked });
      if (mode !== "instant") return next();
      sc.reveal(chosen); guessed.disabled = true; submitBtn.disabled = true;
      const head = timedOut ? "Time's up." : correct ? (guessed.checked ? "Correct, but you guessed. It comes back for review." : "Correct.") : "Wrong.";
      const nextBtn = button(idx + 1 < items.length ? "Next (Enter)" : "See results (Enter)", next);
      fb.replaceChildren(feedback(correct && !timedOut, head, it.q.explain), el("div", { class: "row" }, nextBtn));
      nextBtn.focus();
    }
    function next() { idx++; show(); }

    keyHandler = e => {
      if (!submitted && sc.key(e)) return;
      if (!submitted && guessKey && e.key.toLowerCase() === "g") guessed.checked = !guessed.checked;
      else if (e.key === "Enter") { e.preventDefault(); submitted ? next() : submit(false); }
    };
    if (seconds) {
      activeTimer = setInterval(() => {
        left--; timerEl.textContent = fmtTime(Math.max(left, 0));
        timerEl.classList.toggle("low", left <= 20);
        if (left <= 0) submit(true);
      }, 1000);
    }
  }

  function finish() {
    keyHandler = null;
    const ok = results.filter(r => r.correct).length;
    const lucky = results.filter(r => r.correct && r.guessed).length;
    const byTopic = {};
    for (const r of results) {
      const t = r.it.q.topic, s = byTopic[t] || (byTopic[t] = { n: 0, ok: 0 });
      s.n++; if (r.correct) s.ok++;
    }
    panel.replaceChildren(
      el("div", { class: "card" },
        el("h2", { tabindex: "-1", "data-focus": "", text: "Results" }),
        el("div", { class: "big", text: `${ok} / ${results.length}  (${Math.round(ok / results.length * 100)}%)` }),
        el("p", { class: "muted", text: `${lucky} correct-but-guessed. Misses and guesses are in Progress & export, ready for the mistake log, and come back in Spaced review.` }),
        el("table", {}, el("tr", {}, el("th", { text: "Topic" }), el("th", { text: "Score" })),
          Object.entries(byTopic).sort().map(([t, s]) => el("tr", {}, el("td", {}, badge(t)),
            el("td", { class: s.ok / s.n < WEAK_THRESHOLD ? "weak" : "good", text: `${s.ok}/${s.n}` })))),
        el("div", { class: "row" }, button("New sprint", renderers.sprint))),
      el("div", { class: "card" }, el("h2", { text: "Review" }),
        results.map((r, i) => el("div", { class: "review-item" },
          el("div", {}, el("span", { class: r.correct ? (r.guessed ? "warn-t" : "ok-t") : "bad-t", text: r.correct ? (r.guessed ? "GUESSED " : "RIGHT ") : "WRONG " }), `Q${i + 1}. `, r.it.q.q),
          el("div", { class: "muted", text: "You: " + (r.chosen.length ? r.sc.text(r.chosen) : "(no answer)") }),
          el("div", { class: "ok-t", text: "Correct: " + r.sc.text(r.it.answer) }),
          el("div", { class: "muted", text: r.it.q.explain })))));
    focusStart(panel);
  }
  show();
}

// ================= PAIR PICKER =================
renderers.picker = function () {
  const panel = $("panel-picker");
  const scope = el("select", {}, scopeOptions(true));
  const timer = el("select", {}, [["10", "10 seconds per clue"], ["20", "20 seconds per clue"], ["0", "No timer"]]
    .map(([v, t]) => el("option", { value: v, text: t })));
  const msg = el("p", { class: "muted", role: "status" });
  panel.replaceChildren(el("div", { class: "card" },
    el("h2", { text: "Pair picker" }),
    el("p", { class: "muted", text: "Fast drills on the pairs your subject loves to confuse. Use ← / → (or 1 / 2) to answer. When you miss, read the reason before moving on." }),
    el("div", { class: "row" }, labeled("Scope", scope), labeled("Timer", timer), button("Start 15-clue round", () => {
      const weak = weakTopics();
      const pool = DATA.pairs.filter(p => inScope(p.topic, scope.value, weak));
      if (!pool.length) { msg.textContent = emptyPoolMessage(scope.value, weak, "pairs"); return; }
      runPicker(shuffle(pool).slice(0, 15), +timer.value);
    })), msg));
};

function runPicker(items, seconds) {
  const panel = $("panel-picker");
  const gen = runGeneration;
  let idx = 0, ok = 0;
  function show() {
    stopTimer();
    if (gen !== runGeneration) return;
    if (idx >= items.length) {
      keyHandler = null;
      panel.replaceChildren(el("div", { class: "card" }, el("h2", { tabindex: "-1", "data-focus": "", text: "Round done" }),
        el("div", { class: "big", text: `${ok} / ${items.length}` }),
        el("p", { class: "muted", text: "Misses are saved in Progress & export and come back in Spaced review." }),
        el("div", { class: "row" }, button("Again", renderers.picker))));
      focusStart(panel);
      return;
    }
    const p = items[idx];
    const sides = Math.random() < 0.5 ? ["b", "a"] : ["a", "b"];
    let done = false, advanced = false, left = seconds * 10;
    const fill = el("div", { style: "width:100%" });
    const fb = el("div", { "aria-live": "polite" });
    const btns = sides.map((s, i) => button((i === 0 ? "← " : "") + p[s] + (i === 1 ? " →" : ""), () => answer(s), "pairbtn"));
    panel.replaceChildren(el("div", { class: "card" },
      el("div", { class: "qtop" }, el("span", { class: "muted", text: `${idx + 1} / ${items.length}` }), badge(p.topic)),
      el("div", { class: "clue", tabindex: "-1", "data-focus": "", text: p.clue }),
      seconds ? el("div", { class: "bar", "aria-hidden": "true" }, fill) : null,
      el("div", { class: "pairbtns" }, btns), fb));
    focusStart(panel);

    // The automatic advance and Enter share this guard, so one answer moves exactly one clue.
    function advance() {
      if (advanced || gen !== runGeneration) return;
      advanced = true; idx++; show();
    }
    function answer(side) {
      if (done) return; done = true; stopTimer();
      const correct = side === p.answer;
      if (correct) ok++;
      btns.forEach((b, i) => { if (sides[i] === p.answer) b.classList.add("right"); else if (sides[i] === side) b.classList.add("wrong"); });
      record({ mode: "Pair picker", item: p.id, topic: p.topic, prompt: `${p.clue} (${p.a} vs ${p.b})`,
        chosenText: side ? p[side] : "(time ran out)", correctText: p[p.answer], correct });
      if (correct) {
        fb.replaceChildren(feedback(true, "Correct.", p.why));
        activeTimeout = setTimeout(advance, 900);
      } else {
        const nextBtn = button("Next (Enter)", advance);
        fb.replaceChildren(feedback(false, side ? "Wrong." : "Too slow.", p.why), el("div", { class: "row" }, nextBtn));
        nextBtn.focus();
      }
    }
    keyHandler = e => {
      if (!done && (e.key === "ArrowLeft" || e.key === "1")) answer(sides[0]);
      else if (!done && (e.key === "ArrowRight" || e.key === "2")) answer(sides[1]);
      else if (done && e.key === "Enter") advance();
    };
    if (seconds) {
      activeTimer = setInterval(() => {
        left--; fill.style.width = (left / (seconds * 10) * 100) + "%";
        if (left <= 0) answer(null);
      }, 100);
    }
  }
  show();
}
