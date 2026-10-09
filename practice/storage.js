"use strict";

// Tabs own separate keys. No read/modify/write race can erase another tab's attempts.
window.StudioloStorage = (() => {
  const C = window.StudioloCore;
  const LEGACY_KEY = "studiolo-practice-v1";
  const BASE_KEY = "studiolo-practice-v2";
  const SESSION_PREFIX = BASE_KEY + ":session:";
  // randomUUID needs a secure context (missing over plain http); getRandomValues does not.
  const randomId = () => globalThis.crypto.randomUUID?.() ||
    Array.from(globalThis.crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, "0")).join("");
  const sessionKey = SESSION_PREFIX + randomId();
  let available = true, blocked = false, own = C.emptyStore(), baseline = C.emptyStore();
  const status = message => {
    const n = document.getElementById("storage-status");
    if (n) { n.textContent = message; n.hidden = !message; }
  };
  const failure = error => {
    available = false;
    status(`Progress is only in memory: ${error.message || "browser storage unavailable"}. Download a backup before closing this page.`);
  };
  function read(key) {
    const raw = localStorage.getItem(key);
    return raw === null ? null : C.validateStore(JSON.parse(raw));
  }
  function identity(a, i) {
    return a.id || `legacy:${a.at}:${a.item}:${i}`;
  }
  function merge(states, base) {
    const attempts = new Map(), decks = new Map();
    for (const state of states) {
      state.attempts.forEach((a, i) => {
        const id = identity(a, i);
        const previous = attempts.get(id);
        attempts.set(id, { ...a, id, exported: Boolean(a.exported || previous?.exported) });
      });
      for (const c of state.flashcards) decks.set(c.id, c);
    }
    const rows = [...attempts.values()].sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));
    // Preserve schedules from legacy backups; replay only new session events over that baseline.
    const review = { ...base.review };
    const baseIds = new Set(base.attempts.map(identity));
    for (const a of rows.filter(a => !baseIds.has(a.id))) {
      const one = C.scheduleFromAttempts([{ ...a }]);
      if (Object.hasOwn(one, a.item)) review[a.item] = one[a.item];
      else if ((a.mode === "Review" || a.mode === "Retention check") && a.correct && !a.guessed && review[a.item]) {
        const r = { ...review[a.item], stage: review[a.item].stage + 1 };
        if (r.stage >= 4) delete review[a.item];
        else review[a.item] = { stage: r.stage, due: C.addDays(a.day || a.at.slice(0, 10), [1, 3, 7, 14][r.stage]) };
      }
    }
    return { schemaVersion: 2, attempts: rows, flashcards: [...decks.values()], review };
  }
  function load() {
    if (!available) return merge([baseline, own], baseline);
    try {
      baseline = read(BASE_KEY) || read(LEGACY_KEY) || C.emptyStore();
      const states = [baseline];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(SESSION_PREFIX) && key !== sessionKey) {
          const state = read(key);
          if (state) states.push(state);
        }
      }
      states.push(own);
      return merge(states, baseline);
    } catch (e) {
      blocked = true;
      failure(new Error("Stored data is unreadable. It was left untouched; use Backup to recover or explicitly reset it"));
      return merge([baseline, own], baseline);
    }
  }
  function persist() {
    if (blocked) return false;
    try {
      localStorage.setItem(sessionKey, JSON.stringify(own));
      available = true;
      status("");
      return true;
    } catch (e) { failure(e); return false; }
  }
  function record(attempt) {
    own.attempts.push({ exported: false, guessed: false, ...attempt,
      id: randomId(),
      at: new Date().toISOString(), day: C.localDay() });
    persist();
    return load();
  }
  function updateAttempts(attempts) {
    const byId = new Map(own.attempts.map(a => [a.id, a]));
    for (const a of attempts) byId.set(a.id, a);
    own.attempts = [...byId.values()];
    persist();
    return load();
  }
  function setDecks(cards) {
    // Decks are local to the current page until a deliberate checkpoint/restore.
    own.flashcards = cards;
    persist();
    const s = load();
    s.flashcards = cards;
    return s;
  }
  function checkpoint(value) {
    const validated = C.validateStore(value);
    const keys = [];
    // Explicit replacement only, never an automatic save. Other tabs stop writing.
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(SESSION_PREFIX)) keys.push(key);
    }
    localStorage.setItem(BASE_KEY, JSON.stringify(validated));
    for (const key of keys) localStorage.removeItem(key);
    localStorage.removeItem(LEGACY_KEY);
    own = C.emptyStore(); baseline = validated; blocked = false; available = true;
    status("");
    return load();
  }
  function replace(value) {
    try { return checkpoint(value); }
    catch (e) { failure(e); return null; }
  }
  function rawBackup() {
    const values = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === BASE_KEY || key === LEGACY_KEY || key.startsWith(SESSION_PREFIX)) values[key] = localStorage.getItem(key);
    }
    return values;
  }
  window.addEventListener("storage", e => {
    if (e.key === BASE_KEY) {
      blocked = true; available = false;
      status("Another tab restored or reset progress. This page is now read-only. Download a backup, then reload before practicing.");
      window.dispatchEvent(new Event("studiolo-storage-replaced"));
    } else if (e.key?.startsWith(SESSION_PREFIX)) window.dispatchEvent(new Event("studiolo-storage-updated"));
  });
  return { load, record, updateAttempts, setDecks, replace, rawBackup, status, merge };
})();
