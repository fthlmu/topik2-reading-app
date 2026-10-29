// store.js — persistent study record in localStorage key "topik2.v2".
// Schema (plan): { version, attempts[], sessions[], settings{}, streak{}, sprint, retryQs }.
// settings: { romanization, theme, fontScale, gloss (주석 on/off), glossExam (sprint/mock override) }.
// "sprint" is the one in-progress run: a sprint slot, or a mock slot (mode 'mock').
// All updates return new objects; the cached state is replaced, never mutated.
// Every write re-reads the stored blob first, so two open tabs do not clobber
// each other. A corrupt or newer-version blob is copied to "topik2.v2.bak"
// before the store resets. Derived (read-only) views live in store-views.js.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('./util.js');
  const Views = root.StoreViews || require('./store-views.js');

  const KEY = 'topik2.v2';
  const BAK_KEY = 'topik2.v2.bak';
  const LEGACY_KEY = 'topik2_progress';
  const VERSION = 2;
  const MAX_Q = 50;
  const MODES = ['sprint', 'study', 'mock'];
  const THEMES = ['auto', 'light', 'dark'];

  let cache = null;
  let cacheRaw = null;   // the exact string last read from / written to storage
  let persistent = true;
  let blocked = false;   // an unreadable blob could not be backed up: never overwrite it

  function defaults() {
    return {
      version: VERSION,
      attempts: [],
      sessions: [],
      settings: { romanization: false, theme: 'auto', fontScale: 1, gloss: true, glossExam: null },
      streak: { last: null, count: 0 },
      sprint: null,
      retryQs: null
    };
  }

  function storage() {
    try {
      const host = typeof window !== 'undefined' && window.localStorage ? window : globalThis;
      return host.localStorage || null;
    } catch (err) {
      return null;
    }
  }

  function readRaw(key) {
    const ls = storage();
    if (!ls) return null;
    try { return ls.getItem(key); } catch (err) { return null; }
  }

  const isValidQ = q => Number.isInteger(q) && q >= 1 && q <= MAX_Q;
  const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const isCount = v => Number.isInteger(v) && v >= 0;
  const numOr = (v, d) => (Number.isFinite(v) ? v : d);
  const isoOr = v => (typeof v === 'string' ? v : new Date(0).toISOString());

  function normalizeAttempt(a) {
    if (!isObject(a) || !isValidQ(a.q) || !MODES.includes(a.mode)) return null;
    const base = {
      q: a.q,
      mode: a.mode,
      chosen: Number.isInteger(a.chosen) ? a.chosen : null,
      correct: typeof a.correct === 'boolean' ? a.correct : null,
      sure: typeof a.sure === 'boolean' ? a.sure : null,
      ms: numOr(a.ms, null),
      at: isoOr(a.at),
      sessionId: typeof a.sessionId === 'string' ? a.sessionId : null
    };
    return a.source === 'legacy' ? { ...base, source: 'legacy' } : base;
  }

  function normalizeSession(s) {
    if (!isObject(s) || typeof s.id !== 'string' || !s.id) return null;
    const qs = Array.isArray(s.qs) ? s.qs.filter(isValidQ) : [];
    return {
      id: s.id,
      at: isoOr(s.at),
      mode: MODES.includes(s.mode) ? s.mode : 'sprint',
      qs,
      right: isCount(s.right) ? s.right : 0,
      total: isCount(s.total) ? s.total : qs.length,
      overtimeCount: isCount(s.overtimeCount) ? s.overtimeCount : 0,
      durationMs: numOr(s.durationMs, 0)
    };
  }

  function normalizeAnswer(a) {
    if (!isObject(a) || !isValidQ(a.q) || typeof a.correct !== 'boolean') return null;
    return {
      q: a.q,
      chosen: Number.isInteger(a.chosen) ? a.chosen : null,
      correct: a.correct,
      sure: typeof a.sure === 'boolean' ? a.sure : null,
      ms: numOr(a.ms, 0),
      at: isoOr(a.at)
    };
  }

  // In-progress sprint: { id, qs, idx, answers[], startedAt, shownAt, elapsedMs, pending }.
  // answers.length must equal idx; pending = chosen but confidence not yet given.
  function normalizeSprint(s) {
    if (!isObject(s) || typeof s.id !== 'string' || !s.id || !Array.isArray(s.qs)) return null;
    if (s.mode === 'mock') return normalizeMock(s);
    const qs = s.qs.filter(isValidQ);
    const answers = (Array.isArray(s.answers) ? s.answers : []).map(normalizeAnswer);
    if (!qs.length || qs.length !== s.qs.length || answers.some(a => !a)) return null;
    if (!isCount(s.idx) || s.idx > qs.length || answers.length !== s.idx) return null;
    const p = s.pending;
    const pending = isObject(p) && Number.isInteger(p.chosen) ? { chosen: p.chosen, ms: numOr(p.ms, 0) } : null;
    return {
      id: s.id, qs, idx: s.idx, answers,
      startedAt: numOr(s.startedAt, 0),
      shownAt: numOr(s.shownAt, null),
      elapsedMs: Math.max(0, numOr(s.elapsedMs, 0)),
      pending
    };
  }

  // In-progress mock: { id, mode:'mock', qs, idx, answers[answer|null per q], spent[ms per q],
  // startedAt, deadline, shownAt }. answers[i] must belong to qs[i]; idx is the open question.
  function normalizeMock(s) {
    const qs = s.qs.filter(isValidQ);
    const raw = Array.isArray(s.answers) ? s.answers : [];
    if (!qs.length || qs.length !== s.qs.length || raw.length !== qs.length) return null;
    const answers = raw.map(a => (a == null ? null : normalizeAnswer(a)));
    if (answers.some((a, i) => raw[i] != null && (!a || a.q !== qs[i]))) return null;
    if (!isCount(s.idx) || s.idx >= qs.length || !Number.isFinite(s.deadline)) return null;
    const spent = Array.isArray(s.spent) ? s.spent : [];
    return {
      id: s.id, mode: 'mock', qs, idx: s.idx, answers,
      spent: qs.map((_, i) => Math.max(0, numOr(spent[i], 0))),
      startedAt: numOr(s.startedAt, 0),
      deadline: s.deadline,
      shownAt: numOr(s.shownAt, null)
    };
  }

  // Sprint/mock 주석 override: { on, phase: 'learn' | 'drill' } (js/translate.js examOn).
  function normalizeGlossExam(v) {
    if (!isObject(v) || typeof v.on !== 'boolean' || (v.phase !== 'learn' && v.phase !== 'drill')) return null;
    return { on: v.on, phase: v.phase };
  }

  function normalizeQs(list) {
    if (!Array.isArray(list)) return null;
    const qs = [...new Set(list.filter(isValidQ))];
    return qs.length ? qs : null;
  }

  // Coerce unknown/corrupted input into a valid v2 state.
  function normalize(raw) {
    if (!isObject(raw) || raw.version !== VERSION) return defaults();
    const settings = isObject(raw.settings) ? raw.settings : {};
    const streak = isObject(raw.streak) ? raw.streak : {};
    return {
      version: VERSION,
      attempts: (Array.isArray(raw.attempts) ? raw.attempts : []).map(normalizeAttempt).filter(Boolean),
      sessions: (Array.isArray(raw.sessions) ? raw.sessions : []).map(normalizeSession).filter(Boolean),
      settings: {
        romanization: settings.romanization === true,
        theme: THEMES.includes(settings.theme) ? settings.theme : 'auto',
        fontScale: numOr(settings.fontScale, 1),
        gloss: settings.gloss !== false,
        glossExam: normalizeGlossExam(settings.glossExam)
      },
      streak: {
        last: typeof streak.last === 'string' ? streak.last : null,
        count: isCount(streak.count) ? streak.count : 0
      },
      sprint: normalizeSprint(raw.sprint),
      retryQs: normalizeQs(raw.retryQs)
    };
  }

  // Pure: add one "study" attempt (correct:null) per question listed in the
  // legacy "topik2_progress" JSON array. Unknown/garbled input adds nothing.
  function migrateLegacy(state, rawLegacy, nowIso) {
    let list;
    try { list = JSON.parse(rawLegacy); } catch (err) { return state; }
    if (!Array.isArray(list)) return state;
    const qs = [...new Set(list.map(Number).filter(isValidQ))].sort((a, b) => a - b);
    if (!qs.length) return state;
    const at = nowIso || new Date().toISOString();
    const migrated = qs.map(q => ({
      q, mode: 'study', chosen: null, correct: null, sure: null, ms: null,
      at, sessionId: null, source: 'legacy'
    }));
    return { ...state, attempts: [...state.attempts, ...migrated] };
  }

  function save(state) {
    cache = state;
    const ls = storage();
    if (!ls || blocked) { persistent = false; return false; }
    try {
      const raw = JSON.stringify(state);
      ls.setItem(KEY, raw);
      cacheRaw = raw;
      persistent = true;
      return true;
    } catch (err) {
      persistent = false;
      return false;
    }
  }

  // Parse a stored blob. Not JSON, not an object, or another version → null.
  function parseStored(raw) {
    let parsed = null;
    try { parsed = JSON.parse(raw); } catch (err) { return null; }
    return isObject(parsed) && parsed.version === VERSION ? normalize(parsed) : null;
  }

  // Keep a copy of an unreadable/newer blob, then reset. If the copy cannot be
  // written, stay in memory only so the original is never overwritten.
  function backupAndReset(raw) {
    const ls = storage();
    let copied = false;
    try { ls.setItem(BAK_KEY, raw); copied = true; } catch (err) { copied = false; }
    blocked = !copied;
    if (copied) { save(defaults()); return cache; }
    cache = defaults();
    cacheRaw = null;
    persistent = false;
    return cache;
  }

  // Load v2 state; on first run seed it from the legacy key (left in place).
  function load() {
    const raw = readRaw(KEY);
    if (raw == null) {
      const legacy = readRaw(LEGACY_KEY);
      save(legacy != null ? migrateLegacy(defaults(), legacy) : defaults());
      return cache;
    }
    const state = parseStored(raw);
    if (!state) return backupAndReset(raw);
    blocked = false;
    cache = state;
    cacheRaw = raw;
    persistent = storage() !== null;
    return cache;
  }

  // Current state; re-read when another tab changed the stored blob.
  function get() {
    if (!cache) return load();
    const raw = readRaw(KEY);
    if (raw == null || raw === cacheRaw) return cache;
    return load();
  }

  // Read-modify-write on the freshest stored state.
  function update(fn) {
    const base = get();
    const next = fn(base);
    if (next !== base) save(next);
    return next;
  }

  function toAttempt(input, at) {
    const attempt = normalizeAttempt({ at, ...input });
    if (!attempt) throw new TypeError('Store.recordAttempt: invalid attempt ' + JSON.stringify(input));
    return attempt;
  }

  function recordAttempt(input) {
    const attempt = toAttempt(input, new Date().toISOString());
    return update(state => ({ ...state, attempts: [...state.attempts, attempt] }));
  }

  // All attempts of one finished run in a single write (all valid, or none stored).
  function recordAttempts(inputs) {
    const at = new Date().toISOString();
    const list = (inputs || []).map(input => toAttempt(input, at));
    if (!list.length) return get();
    return update(state => ({ ...state, attempts: [...state.attempts, ...list] }));
  }

  function setSetting(key, value) {
    return update(state => normalize({ ...state, settings: { ...state.settings, [key]: value } }));
  }

  // Streak: +1 when the last active day was yesterday, 1 after a gap, same day unchanged.
  function nextStreak(streak, day) {
    if (streak.last && streak.last >= day) return streak;
    const yesterday = Util.addDays(day, -1);
    return { last: day, count: streak.last === yesterday ? streak.count + 1 : 1 };
  }

  // Append a finished session (no-op if its id is already stored) and update the streak.
  function recordSession(input) {
    const session = normalizeSession({ at: new Date().toISOString(), ...input });
    if (!session) throw new TypeError('Store.recordSession: invalid session ' + JSON.stringify(input));
    return update(state => {
      if (state.sessions.some(s => s.id === session.id)) return state;
      const day = Util.toISODate(new Date(session.at));
      return { ...state, sessions: [...state.sessions, session], streak: nextStreak(state.streak, day) };
    });
  }

  // ── In-progress sprint slot + retry list ──

  function getSprint() {
    return get().sprint;
  }

  function setSprint(slot) {
    const sprint = normalizeSprint(slot);
    if (!sprint) throw new TypeError('Store.setSprint: invalid sprint slot');
    return update(state => ({ ...state, sprint }));
  }

  // Clear the run slot; with an id, only when that run is still the stored one.
  function clearSprint(id) {
    return update(state => (state.sprint && (!id || state.sprint.id === id) ? { ...state, sprint: null } : state));
  }

  function setRetry(qs) {
    return update(state => ({ ...state, retryQs: normalizeQs(qs) }));
  }

  function sessionById(id) {
    return get().sessions.find(s => s.id === id) || null;
  }

  function isPersistent() {
    return persistent;
  }

  // Test hook: forget the in-memory cache so the next get() re-reads storage.
  function resetCache() {
    cache = null;
    cacheRaw = null;
    persistent = true;
    blocked = false;
  }

  // Views take (getState, ...args); the last arg may be an explicit state.
  const view = fn => (...args) => fn(get, ...args);

  const Store = {
    KEY, BAK_KEY, LEGACY_KEY, defaults, normalize, migrateLegacy, load, get, save,
    recordAttempt, recordAttempts, setSetting, recordSession, getSprint, setSprint, clearSprint, setRetry,
    sessionById, isPersistent, resetCache,
    statusOf: view(Views.statusOf),
    statusMap: view(Views.statusMap),
    cardMap: view(Views.cardMap),
    sectionAccuracy: view(Views.sectionAccuracy),
    lastSession: view(Views.lastSession),
    lastAttempt: view(Views.lastAttempt),
    nextUntried: view(Views.nextUntried),
    attemptsToday: view(Views.attemptsToday),
    weakestSections: view(Views.weakestSections),
    avgPaceRatio: view(Views.avgPaceRatio)
  };

  if (typeof window !== 'undefined') window.Store = Store;
  if (typeof module !== 'undefined') module.exports = Store;
})();
