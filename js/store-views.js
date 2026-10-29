// store-views.js — read-only views over the Store state (pure, no DOM, no writes).
// Each view is fn(getState, ...args, state?): pass an explicit state to stay pure,
// or omit it to read the current state. Store re-exports these with getState bound.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('./util.js');

  const MAX_Q = 50;
  const GRADED_MODES = ['sprint', 'mock'];

  function pace() {
    return root.PACE || require('./pace.js');
  }

  function isGraded(a) {
    return GRADED_MODES.includes(a.mode) && typeof a.correct === 'boolean';
  }

  function gradedFor(q, state) {
    return state.attempts.filter(a => a.q === q && isGraded(a));
  }

  // untried · seen · right-sure · right-unsure · wrong · recovered
  // Colour comes from the last sprint/mock attempt; study attempts only mark "seen".
  function statusIn(q, s) {
    if (!s.attempts.some(a => a.q === q)) return 'untried';
    const graded = gradedFor(q, s);
    if (!graded.length) return 'seen';
    const last = graded[graded.length - 1];
    if (!last.correct) return 'wrong';
    if (last.sure === false) return 'right-unsure';
    const wasWrong = graded.slice(0, -1).some(a => a.correct === false);
    return wasWrong ? 'recovered' : 'right-sure';
  }

  function statusOf(getState, q, state) {
    return statusIn(q, state || getState());
  }

  function statusMap(getState, state) {
    const s = state || getState();
    const map = {};
    for (let q = 1; q <= MAX_Q; q++) map[q] = statusIn(q, s);
    return map;
  }

  // The answer card: per question { status, chosen }, where chosen is the pick
  // of the last graded (sprint or mock) attempt, or null.
  function cardMap(getState, state) {
    const s = state || getState();
    const map = {};
    for (let q = 1; q <= MAX_Q; q++) {
      const graded = gradedFor(q, s);
      const last = graded[graded.length - 1];
      map[q] = { status: statusIn(q, s), chosen: last && Number.isInteger(last.chosen) ? last.chosen : null };
    }
    return map;
  }

  function sectionList(sections) {
    return sections || Util.sections();
  }

  // Per section: latest graded attempt per question → { right, tried, pct|null }.
  function sectionAccuracy(getState, sections, state) {
    const s = state || getState();
    const out = {};
    sectionList(sections).forEach(sec => {
      let right = 0;
      let tried = 0;
      for (let q = sec.range[0]; q <= sec.range[1]; q++) {
        const graded = gradedFor(q, s);
        if (!graded.length) continue;
        tried += 1;
        if (graded[graded.length - 1].correct) right += 1;
      }
      out[sec.id] = { right, tried, pct: tried ? Math.round((100 * right) / tried) : null };
    });
    return out;
  }

  function lastSession(getState, state) {
    const sessions = (state || getState()).sessions;
    return sessions.length ? sessions[sessions.length - 1] : null;
  }

  function lastAttempt(getState, mode, state) {
    const list = (state || getState()).attempts.filter(a => !mode || a.mode === mode);
    return list.length ? list[list.length - 1] : null;
  }

  function nextUntried(getState, state) {
    const s = state || getState();
    for (let q = 1; q <= MAX_Q; q++) if (statusIn(q, s) === 'untried') return q;
    return null;
  }

  // Attempts made today (local calendar day), optionally of one mode.
  function attemptsToday(getState, mode, state) {
    const today = Util.toISODate(new Date());
    return (state || getState()).attempts.filter(a =>
      (!mode || a.mode === mode) && Util.toISODate(new Date(a.at)) === today);
  }

  // Lowest accuracy first over ALL graded attempts in a section ({id, accuracy 0–1, n}).
  // Sections with fewer than minAttempts attempts or a perfect record are left out.
  function weakestSections(getState, k, minAttempts, sections, state) {
    const limit = Number.isInteger(k) ? k : 3;
    const min = Number.isInteger(minAttempts) ? minAttempts : 2;
    const graded = (state || getState()).attempts.filter(isGraded);
    return sectionList(sections)
      .map((sec, order) => {
        const rows = graded.filter(a => a.q >= sec.range[0] && a.q <= sec.range[1]);
        const right = rows.filter(a => a.correct).length;
        const accuracy = rows.length ? Math.round((100 * right) / rows.length) / 100 : 1;
        return { id: sec.id, accuracy, n: rows.length, order };
      })
      .filter(r => r.n >= min && r.accuracy < 1)
      .sort((a, b) => (a.accuracy - b.accuracy) || (b.n - a.n) || (a.order - b.order))
      .slice(0, limit)
      .map(r => ({ id: r.id, accuracy: r.accuracy, n: r.n }));
  }

  function sectionIdOf(q) {
    const l = Util.lesson(q);
    if (l && l.section) return l.section;
    const sec = Util.sections().find(s => q >= s.range[0] && q <= s.range[1]);
    return sec ? sec.id : null;
  }

  // Mean of (time used / pace budget) over a session's timed attempts; null if none.
  function avgPaceRatio(getState, sessionId, state) {
    const timed = (state || getState()).attempts.filter(a =>
      a.sessionId === sessionId && Number.isFinite(a.ms));
    if (!timed.length) return null;
    const P = pace();
    const sum = timed.reduce((acc, a) => acc + P.ratio(a.ms, sectionIdOf(a.q)), 0);
    return Math.round((sum / timed.length) * 100) / 100;
  }

  const StoreViews = {
    statusOf, statusMap, cardMap, sectionAccuracy, lastSession, lastAttempt, nextUntried,
    attemptsToday, weakestSections, avgPaceRatio, sectionIdOf
  };

  if (typeof window !== 'undefined') window.StoreViews = StoreViews;
  if (typeof module !== 'undefined') module.exports = StoreViews;
})();
