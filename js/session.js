// session.js — builds the daily sprint set. Pure logic: no DOM access.
// Session.pick(n, ctx, rng) → n distinct question numbers, exam order.
//   ctx = { lessons (TOPIK2.lessons), sections, attempts (graded sprint/mock), todayStr }
//   Weight from the question's last graded attempt (see weightOf); questions
//   already graded today are skipped unless the fresh pool is smaller than n.
//   Tier mix 40 % short · 40 % medium · rest long; at most 2 per section.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('./util.js');
  const PACE = root.PACE || require('./pace.js');

  const GRADED = ['sprint', 'mock'];
  const SECTION_CAP = 2;
  const TIERS = ['short', 'medium', 'long'];
  const W = { untried: 1, wrong: 3, unsure: 2, sure: 0.5, sureTwice: 0.25 };
  const WITHHELD_MARKER = '《안내》';

  function isGraded(a) {
    return a && GRADED.includes(a.mode) && typeof a.correct === 'boolean';
  }

  // Lessons whose passage was withheld in the source exam cannot be read in a sprint.
  function isWithheld(lesson) {
    const paras = (lesson && lesson.passageParas) || [];
    const first = paras.length === 1 && paras[0].tokens && paras[0].tokens[0];
    return !!first && first.kr === WITHHELD_MARKER;
  }

  function questionNums(lessons) {
    return Object.values(lessons || {})
      .map(l => l && l.num)
      .filter(Number.isInteger)
      .sort((a, b) => a - b);
  }

  function sectionOf(q, ctx) {
    const l = ctx.lessons && ctx.lessons['Q' + q];
    if (l && l.section) return l.section;
    const sec = (ctx.sections || []).find(s => q >= s.range[0] && q <= s.range[1]);
    return sec ? sec.id : null;
  }

  // Graded attempts per question, oldest first (attempts are stored in order).
  function historyByQ(attempts) {
    const out = {};
    (attempts || []).filter(isGraded).forEach(a => { (out[a.q] = out[a.q] || []).push(a); });
    return out;
  }

  // none 1.0 · wrong 3.0 · right+unsure 2.0 · right+sure 0.5 · right+sure twice 0.25
  function weightOf(history) {
    if (!history || !history.length) return W.untried;
    const last = history[history.length - 1];
    if (!last.correct) return W.wrong;
    if (last.sure === false) return W.unsure;
    const prev = history[history.length - 2];
    return prev && prev.correct && prev.sure !== false ? W.sureTwice : W.sure;
  }

  // { q: weight } for every question; withheld passages weigh 0 (never picked).
  function weights(ctx) {
    const hist = historyByQ(ctx.attempts);
    const out = {};
    questionNums(ctx.lessons).forEach(q => {
      out[q] = isWithheld(ctx.lessons['Q' + q]) ? 0 : weightOf(hist[q]);
    });
    return out;
  }

  function gradedToday(ctx) {
    const day = ctx.todayStr || Util.toISODate(new Date());
    return new Set((ctx.attempts || [])
      .filter(a => isGraded(a) && Util.toISODate(new Date(a.at)) === day)
      .map(a => a.q));
  }

  function tierTargets(n) {
    const short = Math.round(n * 0.4);
    const medium = Math.round(n * 0.4);
    return { short, medium, long: Math.max(0, n - short - medium) };
  }

  // One weighted draw; returns the chosen candidate.
  function weightedDraw(cands, w, rng) {
    const total = cands.reduce((s, q) => s + w[q], 0);
    let x = rng() * total;
    for (let i = 0; i < cands.length; i++) {
      x -= w[cands[i]];
      if (x < 0) return cands[i];
    }
    return cands[cands.length - 1];
  }

  // Draw up to `count` more questions from `pool` into `acc` (sampling without replacement).
  function drawInto(acc, pool, count, env, useCap) {
    let next = acc;
    for (let k = 0; k < count; k++) {
      const cands = pool.filter(q => !next.picked.includes(q) &&
        (!useCap || (next.perSection[env.sec[q]] || 0) < SECTION_CAP));
      if (!cands.length) break;
      const q = weightedDraw(cands, env.w, env.rng);
      const s = env.sec[q];
      next = { picked: [...next.picked, q], perSection: { ...next.perSection, [s]: (next.perSection[s] || 0) + 1 } };
    }
    return next;
  }

  function pick(n, ctx, rng) {
    const size = Math.max(0, Math.floor(n) || 0);
    const env = { w: weights(ctx), rng: rng || Math.random, sec: {} };
    const all = Object.keys(env.w).map(Number).filter(q => env.w[q] > 0);
    all.forEach(q => { env.sec[q] = sectionOf(q, ctx); });
    const today = gradedToday(ctx);
    const fresh = all.filter(q => !today.has(q));
    const targets = tierTargets(size);
    let acc = { picked: [], perSection: {} };
    TIERS.forEach(t => {
      acc = drawInto(acc, fresh.filter(q => PACE.tierOf(env.sec[q]) === t), targets[t], env, true);
    });
    acc = drawInto(acc, fresh, size - acc.picked.length, env, true);  // a tier ran out
    acc = drawInto(acc, all, size - acc.picked.length, env, true);    // fresh pool too small
    acc = drawInto(acc, all, size - acc.picked.length, env, false);   // last resort: no cap
    return acc.picked.slice().sort((a, b) => a - b);
  }

  function estimateSec(qs, lessons) {
    return (qs || []).reduce((sum, q) => {
      const l = lessons && lessons['Q' + q];
      return sum + PACE.secFor(l ? l.section : null);
    }, 0);
  }

  // Build ctx from the stored state + TOPIK2 data.
  function contextOf(state, data, todayStr) {
    return {
      lessons: (data && data.lessons) || {},
      sections: (data && data.sections) || [],
      attempts: ((state && state.attempts) || []).filter(isGraded),
      todayStr: todayStr || Util.toISODate(new Date())
    };
  }

  function newId(nowMs, rng) {
    const r = Math.floor((rng || Math.random)() * 1679616).toString(36).padStart(4, '0');
    return 's' + Math.floor(nowMs).toString(36) + r;
  }

  // Fresh in-progress sprint slot (stored by Store.setSprint).
  function createSlot(qs, nowMs, rng) {
    const now = Number.isFinite(nowMs) ? nowMs : Date.now();
    return {
      id: newId(now, rng), qs: qs.slice(), idx: 0, answers: [],
      startedAt: now, shownAt: now, elapsedMs: 0, pending: null
    };
  }

  // SRS keys to seed for every wrong or unsure answer: all vocab + first grammar point.
  function deckKeys(answers, lessons, keyOf) {
    const keys = [];
    (answers || []).filter(a => a.correct === false || a.sure === false).forEach(a => {
      const l = lessons && lessons['Q' + a.q];
      if (!l) return;
      (l.vocab || []).forEach((_, i) => keys.push(keyOf(a.q, 'v', i)));
      if (l.grammar && l.grammar[0]) keys.push(keyOf(a.q, 'g', 0));
    });
    return [...new Set(keys)];
  }

  const Session = {
    WEIGHTS: W, SECTION_CAP, pick, weights, weightOf, estimateSec, tierTargets,
    contextOf, createSlot, deckKeys, isWithheld
  };

  if (typeof window !== 'undefined') window.Session = Session;
  if (typeof module !== 'undefined') module.exports = Session;
})();
