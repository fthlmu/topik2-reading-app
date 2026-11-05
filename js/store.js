// store.js — persistent study record in localStorage key "topik2.v2".
// Schema (plan): { version, attempts[], sessions[], settings{}, streak{}, sprint, retryQs }.
// settings: { romanization, theme, fontScale, gloss (주석 on/off), glossExam (sprint/mock override),
//   uiLang ('ko' | 'en': the app's own UI text, never the exam content; js/ui-lang.js) }.
// "sprint" is the one in-progress run: a sprint slot, or a mock slot (mode 'mock').
// The run carries a revision ("rev", absent = 0) that moves on whenever its content changes
// (questions, position, answers, pending pick). saveRun() only writes for the ACTIVE tab (the one
// that claimed the writer role last, key "topik2.activeTab") and only when the stored revision is
// the one the saving tab last read or wrote, so a stale tab cannot roll a run back. All saves are
// synchronous.
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
      settings: { romanization: false, theme: 'auto', fontScale: 1, gloss: true, glossExam: null, uiLang: 'ko' },
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

  // Revision of the open run. A run that never changed has no "rev" field (reads as 0).
  const revOf = s => (s && isCount(s.rev) ? s.rev : 0);
  const withRev = (slot, rev) => (rev > 0 ? { ...slot, rev } : slot);

  // In-progress sprint: { id, qs, idx, answers[], startedAt, shownAt, elapsedMs, pending, rev? }.
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
    return withRev({
      id: s.id, qs, idx: s.idx, answers,
      startedAt: numOr(s.startedAt, 0),
      shownAt: numOr(s.shownAt, null),
      elapsedMs: Math.max(0, numOr(s.elapsedMs, 0)),
      pending
    }, revOf(s));
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
    return withRev({
      id: s.id, mode: 'mock', qs, idx: s.idx, answers,
      spent: qs.map((_, i) => Math.max(0, numOr(spent[i], 0))),
      startedAt: numOr(s.startedAt, 0),
      deadline: s.deadline,
      shownAt: numOr(s.shownAt, null)
    }, revOf(s));
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
        glossExam: normalizeGlossExam(settings.glossExam),
        uiLang: settings.uiLang === 'en' ? 'en' : 'ko'
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
    // The rejected string stays the "last read" one: while it is unchanged in storage, get() keeps
    // this in-memory state (and everything done to it) instead of reloading the corrupt blob.
    cache = defaults();
    cacheRaw = raw;
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

  // ── The active tab ──
  // Several tabs can show the app, but only one writes the open run: the last tab that claimed the
  // role. A tab claims on load, on focus, when it becomes visible, when it starts a run, and when the
  // person presses "continue here". The claim is a small separate key, {id, at}, so it never races
  // with the study record. A tab that is not named reads the run but does not write it.

  const ACTIVE_KEY = 'topik2.activeTab';
  const TAB_ID = 't' + Math.floor(Math.random() * 0xffffffff).toString(36) + Date.now().toString(36);

  function readActive() {
    const raw = readRaw(ACTIVE_KEY);
    if (raw == null) return null;
    try {
      const v = JSON.parse(raw);
      return isObject(v) && typeof v.id === 'string' ? v : null;
    } catch (err) {
      return null;
    }
  }

  // Become the writer. true = this tab is named (also when it already was: nothing is written then,
  // so the other tabs get no event). false = no storage, or the write failed.
  function claimTab() {
    const ls = storage();
    if (!ls) return false;
    const current = readActive();
    if (current && current.id === TAB_ID) return true;
    try {
      ls.setItem(ACTIVE_KEY, JSON.stringify({ id: TAB_ID, at: Date.now() }));
      return true;
    } catch (err) {
      return false;
    }
  }

  // May this tab write the run? A readable key that names another tab says no, whatever happened to
  // this tab's own claim (a claim that could not be written does not make it the writer). Nobody
  // named (never claimed, key removed or unreadable) or no storage at all: yes, this tab is alone.
  function isActiveTab() {
    if (!storage()) return true;
    const current = readActive();
    return !current || current.id === TAB_ID;
  }

  // Start (or replace) the open run, whatever is stored, and become the writer. A different run
  // starts at the slot's own revision (0); the same run id again moves its revision on so other
  // tabs notice.
  function setSprint(slot) {
    const sprint = normalizeSprint(slot);
    if (!sprint) throw new TypeError('Store.setSprint: invalid sprint slot');
    claimTab();
    return update(state => {
      const prev = state.sprint;
      const rev = prev && prev.id === sprint.id ? revOf(prev) + 1 : revOf(sprint);
      return { ...state, sprint: withRev(sprint, rev) };
    });
  }

  // What a revision protects: the run's questions, position, answers and pending pick. Time
  // bookkeeping (spent, shownAt, elapsedMs, deadline) is not content, so two open tabs that
  // only save the clock do not invalidate each other.
  const contentKey = s => JSON.stringify([s.qs, s.idx, s.answers, s.pending || null]);

  // Same revision, so nobody changed the content; the clock may differ. Saved study time only grows:
  // per question the larger of the stored and the saved time wins (a tab with an older clock cannot
  // roll it back). Sprint slots have no per-question time list and pass through.
  function mergeSpent(stored, next) {
    if (!Array.isArray(stored.spent) || !Array.isArray(next.spent)) return next;
    return { ...next, spent: next.spent.map((ms, i) => Math.max(ms, numOr(stored.spent[i], 0))) };
  }

  // Save of the open run, synchronous. Only the ACTIVE tab writes it, and a write must carry the
  // revision this tab last read or wrote; the check runs on the freshly re-read stored blob.
  //   { status: 'saved', slot }  written; slot is the stored copy (revision moved on if the
  //                              content changed): keep working from it
  //   { status: 'inactive', slot }  another tab is the writer: nothing written, slot is the
  //                              stored run (or null)
  //   { status: 'stale', slot }  another tab changed this run since (two tabs claiming within the
  //                              same moment): nothing written, slot is the stored run to adopt
  //   { status: 'gone', slot: null }  no stored run, or a different one: nothing written
  function saveRun(slot) {
    const next = normalizeSprint(slot);
    if (!next) throw new TypeError('Store.saveRun: invalid run slot');
    if (!isActiveTab()) return { status: 'inactive', slot: get().sprint };
    let result = { status: 'gone', slot: null };
    update(state => {
      const stored = state.sprint;
      if (!stored || stored.id !== next.id) return state;
      if (revOf(stored) !== revOf(next)) { result = { status: 'stale', slot: stored }; return state; }
      const merged = mergeSpent(stored, next);
      const rev = revOf(stored) + (contentKey(stored) === contentKey(merged) ? 0 : 1);
      const written = withRev(merged, rev);
      result = { status: 'saved', slot: written };
      return { ...state, sprint: written };
    });
    return result;
  }

  // Clear the run slot; with an id, only when that run is still the stored one.
  function clearSprint(id) {
    return update(state => (state.sprint && (!id || state.sprint.id === id) ? { ...state, sprint: null } : state));
  }

  function setRetry(qs) {
    return update(state => ({ ...state, retryQs: normalizeQs(qs) }));
  }

  // 기록 초기화: delete the progress (attempts, sessions, streak, the open sprint/mock run, the retry
  // list) and keep the settings (uiLang, gloss, glossExam, romanization, the old theme value). This
  // tab becomes the writer first. Works with storage blocked (memory only). Another open tab reads the
  // empty record on its next read and leaves its run (the run is gone). The old "topik2_progress"
  // key and the .bak keys are left alone.
  function resetProgress() {
    claimTab();
    return update(state => ({ ...defaults(), settings: state.settings }));
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
    recordAttempt, recordAttempts, setSetting, recordSession, getSprint, setSprint, saveRun,
    clearSprint, setRetry, resetProgress, sessionById, isPersistent, resetCache,
    ACTIVE_KEY, tabId: TAB_ID, claimTab, isActiveTab,
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
