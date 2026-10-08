"use strict";

// Pure helpers shared by the app and its content validator. No DOM access.
window.StudioloCore = (() => {
  const object = v => v !== null && typeof v === "object" && !Array.isArray(v);
  const text = v => typeof v === "string";
  const date = v => text(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    Number.isFinite(Date.parse(v + "T00:00:00Z")) &&
    new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v;
  const area = topic => String(topic).split(".")[0];
  const localDay = (now = new Date()) =>
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const addDays = (iso, days) => {
    const d = new Date(iso + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
  };
  const optionKey = i => i < 26 ? String.fromCharCode(65 + i) : String(i + 1);
  function validateContent(data, metadata) {
    const errors = [], warnings = [], ids = new Set();
    if (!object(data) || !object(metadata) || !object(metadata.topics) || !object(metadata.areas)) {
      return { errors: ["Missing question bank or generated topic metadata."], warnings };
    }
    for (const [id, name] of Object.entries(metadata.topics)) {
      if (!/^\d+\.\d+(?:\.\d+)*$/.test(id) || !text(name) || !name.trim() || !object(metadata.areas[area(id)])) {
        errors.push(`Invalid topic metadata: ${id}.`);
      }
    }
    for (const [id, info] of Object.entries(metadata.areas)) {
      if (!object(info) || !text(info.name) || !text(info.tag)) errors.push(`Invalid area metadata: ${id}.`);
    }
    const nonempty = v => text(v) && v.trim().length > 0;
    const strings = v => Array.isArray(v) && v.length > 0 && v.every(nonempty);
    const fields = (item, names) => names.every(name => nonempty(item[name]));
    // A fact may be sourced to the literature (https://…) or to a file in this repo. Nothing else.
    const provenanceSource = s => /^https?:\/\/\S+$/.test(s) || /^[A-Za-z0-9][\w./-]*\.(md|csv|js|json|py|txt|html)$/.test(s);
    for (const [kind, prefix] of Object.entries({ scenarios: "S", pairs: "P", orders: "O", diagrams: "V" })) {
      if (!Array.isArray(data[kind])) { errors.push(`${kind} must be an array.`); continue; }
      for (const item of data[kind]) {
        if (!object(item)) { errors.push(`Invalid ${kind} item.`); continue; }
        const label = text(item.id) ? item.id : kind;
        if (!text(item.id) || !new RegExp(`^${prefix}\\d+$`).test(item.id) || ids.has(item.id)) errors.push(`${label}: invalid or duplicate ID.`);
        ids.add(item.id);
        if (!Object.hasOwn(metadata.topics, item.topic)) errors.push(`${label}: topic is absent from learner-map.md. Regenerate topics.js.`);
        if (!object(item.provenance) || !strings(item.provenance.sources) || !date(item.provenance.verified_on) ||
            !["verified", "needs-check"].includes(item.provenance.status)) {
          errors.push(`${label}: add source URLs or repo file paths, verified_on, and verification status.`);
        } else {
          if (!item.provenance.sources.every(provenanceSource)) errors.push(`${label}: a source must be an https:// URL or a repo file path.`);
          if (item.provenance.status !== "verified") warnings.push(`${label}: facts still need verification.`);
        }
        if (kind === "scenarios") {
          if (!fields(item, ["q", "explain"]) || !strings(item.options) || item.options.length < 2 ||
              !Array.isArray(item.answer) || !item.answer.length || new Set(item.answer).size !== item.answer.length ||
              !item.answer.every(i => Number.isInteger(i) && i >= 0 && i < item.options.length)) {
            errors.push(`${label}: invalid scenario options or answers.`);
          }
        } else if (kind === "pairs") {
          if (!fields(item, ["clue", "a", "b", "why"]) || !["a", "b"].includes(item.answer)) errors.push(`${label}: invalid pair.`);
        } else if (kind === "orders") {
          if (!fields(item, ["title", "prompt", "why"]) || !strings(item.steps)) errors.push(`${label}: invalid ordered steps.`);
        } else {
          const coords = (v, names) => object(v) && names.every(n => Number.isFinite(v[n]));
          if (!fields(item, ["title", "prompt", "why"]) || !strings(item.parts) ||
              !Array.isArray(item.boxes) || !item.boxes.every(b => coords(b, ["x", "y", "w", "h"]) &&
                b.w > 0 && b.h > 0 && nonempty(b.label) && ["ext", "region", "vpc", "public", "private"].includes(b.kind)) ||
              !Array.isArray(item.arrows) || !item.arrows.every(a => coords(a, ["x1", "y1", "x2", "y2"])) ||
              !Array.isArray(item.slots) || !item.slots.length ||
              !item.slots.every(s => coords(s, ["x", "y"]) && s.x >= 0 && s.x <= 800 && s.y >= 0 && s.y <= 480 &&
                item.parts.includes(s.answer) && (s.caption === undefined || text(s.caption)))) {
            errors.push(`${label}: invalid diagram geometry or missing slot answer in parts.`);
          }
        }
      }
    }
    return { errors, warnings };
  }
  function emptyStore() {
    return { schemaVersion: 2, attempts: [], flashcards: [], review: {} };
  }
  function validateStore(value) {
    if (!object(value) || (value.schemaVersion !== undefined && ![1, 2].includes(value.schemaVersion)) ||
        !Array.isArray(value.attempts) || !Array.isArray(value.flashcards || []) || !object(value.review || {})) {
      throw new Error("Unsupported or malformed backup.");
    }
    const s = { ...emptyStore(), attempts: value.attempts, flashcards: value.flashcards || [], review: value.review || {} };
    for (const a of s.attempts) {
      if (!object(a) || !["item", "topic", "mode", "prompt", "chosenText", "correctText", "at"].every(k => text(a[k])) ||
          !Number.isFinite(Date.parse(a.at)) || typeof a.correct !== "boolean" ||
          (a.guessed !== undefined && typeof a.guessed !== "boolean") ||
          (a.exported !== undefined && typeof a.exported !== "boolean") ||
          (a.id !== undefined && !text(a.id)) || (a.tags !== undefined && !text(a.tags))) throw new Error("Invalid attempt in backup.");
    }
    for (const c of s.flashcards) {
      if (!object(c) || !["id", "front", "back", "tags", "source"].every(k => text(c[k]))) throw new Error("Invalid flashcard in backup.");
    }
    for (const r of Object.values(s.review)) {
      if (!object(r) || !Number.isInteger(r.stage) || r.stage < 0 || r.stage > 3 || !date(r.due)) throw new Error("Invalid review schedule in backup.");
    }
    return s;
  }
  function scheduleFromAttempts(attempts) {
    const review = {};
    for (const a of attempts) {
      if (a.mode === "Flashcard blitz") continue;
      const day = a.day || a.at.slice(0, 10);
      if (!a.correct || a.guessed) review[a.item] = { stage: 0, due: addDays(day, 1) };
      else if ((a.mode === "Review" || a.mode === "Retention check") && review[a.item]) {
        const r = review[a.item];
        r.stage++;
        if (r.stage >= 4) delete review[a.item];
        else r.due = addDays(day, [1, 3, 7, 14][r.stage]);
      }
    }
    return review;
  }
  return { object, date, area, localDay, addDays, optionKey, validateContent, emptyStore, validateStore, scheduleFromAttempts };
})();
