// session.test.js — Session.pick / weights / helpers with a seeded rng and a fake ctx.
const assert = require('assert');
global.window = global.window || {};
const Session = require('../js/session.js');
const PACE = require('../js/pace.js');

// mulberry32: small deterministic PRNG for reproducible picks.
function seeded(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SECTIONS = [
  ['A', 1, 2], ['B', 3, 4], ['C', 5, 8], ['D', 9, 12], ['E', 13, 15], ['F', 16, 18],
  ['G', 19, 20], ['H', 21, 22], ['I', 23, 24], ['J', 25, 27], ['K', 28, 31], ['L', 32, 34],
  ['M', 35, 38], ['N', 39, 41], ['O', 42, 43], ['P', 44, 45], ['Q', 46, 47], ['R', 48, 50]
].map(([id, a, b]) => ({ id, range: [a, b] }));

const WITHHELD = [23, 24];
const TODAY = '2026-10-28';
const atLocal = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0).toISOString();

function fakeLessons() {
  const out = {};
  SECTIONS.forEach(sec => {
    for (let q = sec.range[0]; q <= sec.range[1]; q++) {
      const paras = WITHHELD.includes(q)
        ? [{ tokens: [{ kr: '《안내》' }, { kr: '저작권' }] }]
        : [{ tokens: [{ kr: '문장' }] }];
      out['Q' + q] = {
        num: q, section: sec.id, passageParas: paras,
        vocab: [{ kr: 'a' }, { kr: 'b' }, { kr: 'c' }], grammar: q % 2 ? [{ pattern: 'g' }] : []
      };
    }
  });
  return out;
}

const LESSONS = fakeLessons();
const ctxWith = attempts => ({ lessons: LESSONS, sections: SECTIONS, attempts, todayStr: TODAY });
const att = (q, correct, sure, at) => ({ q, mode: 'sprint', correct, sure, at: at || atLocal(2026, 10, 20) });
const tierCount = qs => qs.reduce((m, q) => {
  const t = PACE.tierOf(LESSONS['Q' + q].section);
  return { ...m, [t]: (m[t] || 0) + 1 };
}, {});
const maxPerSection = qs => Math.max(...Object.values(qs.reduce((m, q) => {
  const s = LESSONS['Q' + q].section;
  return { ...m, [s]: (m[s] || 0) + 1 };
}, {})));

// 1. Weights table from the last graded attempt(s).
{
  const w = Session.weights(ctxWith([
    att(1, false, true),
    att(3, true, false),
    att(5, true, true),
    att(6, true, true), att(6, true, true),
    att(7, false, true), att(7, true, true),
    att(9, true, true), att(9, false, true),
    att(10, true, true), att(10, true, false),
    { q: 11, mode: 'study', correct: false, sure: null, at: atLocal(2026, 10, 20) },
    att(12, true, true), att(12, true, null)
  ]));
  assert.strictEqual(w[2], 1, 'untried = 1.0');
  assert.strictEqual(w[1], 3, 'wrong = 3.0');
  assert.strictEqual(w[3], 2, 'right + unsure = 2.0');
  assert.strictEqual(w[5], 0.5, 'right + sure = 0.5');
  assert.strictEqual(w[6], 0.25, 'right + sure twice = 0.25');
  assert.strictEqual(w[7], 0.5, 'wrong then right+sure = 0.5');
  assert.strictEqual(w[9], 3, 'right then wrong = 3.0');
  assert.strictEqual(w[10], 2, 'last attempt decides: unsure');
  assert.strictEqual(w[11], 1, 'study attempts are ignored');
  assert.strictEqual(w[12], 0.25, 'sure:null counts as sure');
  assert.strictEqual(w[23], 0, 'withheld passage never picked');
  assert.strictEqual(Object.keys(w).length, 50);
}

// 2. Empty history: n distinct, sorted, 2/2/1 tier mix, section cap, no withheld.
for (let seed = 1; seed <= 300; seed++) {
  const qs = Session.pick(5, ctxWith([]), seeded(seed));
  assert.strictEqual(qs.length, 5);
  assert.strictEqual(new Set(qs).size, 5, 'distinct');
  assert.deepStrictEqual(qs, qs.slice().sort((a, b) => a - b), 'exam order');
  assert.deepStrictEqual(tierCount(qs), { short: 2, medium: 2, long: 1 }, 'tier mix seed ' + seed);
  assert.ok(maxPerSection(qs) <= Session.SECTION_CAP, 'section cap');
  assert.ok(!qs.some(q => WITHHELD.includes(q)), 'withheld excluded');
}

// 3. Section cap holds even when one section is heavily weighted.
{
  const heavy = [16, 17, 18].map(q => att(q, false, true));
  for (let seed = 1; seed <= 200; seed++) {
    const qs = Session.pick(5, ctxWith(heavy), seeded(seed));
    assert.ok(qs.filter(q => q >= 16 && q <= 18).length <= 2, 'max 2 from F');
  }
}

// 4. Weighted sampling favours wrong over right+sure-twice.
{
  const hist = [att(16, false, true), att(17, true, true), att(17, true, true)];
  let n16 = 0;
  let n17 = 0;
  for (let seed = 1; seed <= 2000; seed++) {
    const qs = Session.pick(5, ctxWith(hist), seeded(seed));
    if (qs.includes(16)) n16 += 1;
    if (qs.includes(17)) n17 += 1;
  }
  assert.ok(n16 > 4 * n17, 'wrong Q16 (' + n16 + ') picked far more than mastered Q17 (' + n17 + ')');
}

// 5. Today's attempts are skipped while the fresh pool is big enough.
{
  const today = [];
  for (let q = 1; q <= 20; q++) today.push(att(q, true, true, atLocal(2026, 10, 28)));
  const yesterday = [att(25, false, true, atLocal(2026, 10, 27))];
  for (let seed = 1; seed <= 200; seed++) {
    const qs = Session.pick(5, ctxWith(today.concat(yesterday)), seeded(seed));
    assert.strictEqual(qs.length, 5);
    assert.ok(!qs.some(q => q <= 20), 'no question graded today');
    assert.ok(maxPerSection(qs) <= 2);
  }
}

// 6. …and are used as a fallback when the fresh pool is smaller than n.
{
  const keep = [1, 16, 40];
  const today = [];
  for (let q = 1; q <= 50; q++) if (!keep.includes(q)) today.push(att(q, true, true, atLocal(2026, 10, 28)));
  for (let seed = 1; seed <= 100; seed++) {
    const qs = Session.pick(5, ctxWith(today), seeded(seed));
    assert.strictEqual(qs.length, 5);
    keep.forEach(q => assert.ok(qs.includes(q), 'fresh Q' + q + ' always kept'));
  }
}

// 7. Asking for more than the pool returns every pickable question once.
{
  const qs = Session.pick(60, ctxWith([]), seeded(7));
  assert.strictEqual(qs.length, 48);
  assert.strictEqual(new Set(qs).size, 48);
  assert.deepStrictEqual(Session.pick(0, ctxWith([]), seeded(1)), []);
}

// 8. Helpers: tierTargets, estimateSec, createSlot, deckKeys, contextOf.
{
  assert.deepStrictEqual(Session.tierTargets(5), { short: 2, medium: 2, long: 1 });
  assert.deepStrictEqual(Session.tierTargets(3), { short: 1, medium: 1, long: 1 });
  assert.strictEqual(Session.estimateSec([1, 16, 48], LESSONS), 40 + 70 + 120);
  assert.strictEqual(Session.estimateSec([], LESSONS), 0);

  const slot = Session.createSlot([3, 9], 1000, seeded(3));
  assert.deepStrictEqual({ ...slot, id: 'x' },
    { id: 'x', qs: [3, 9], idx: 0, answers: [], startedAt: 1000, shownAt: 1000, elapsedMs: 0, pending: null });
  assert.ok(/^s[0-9a-z]+$/.test(slot.id));
  assert.notStrictEqual(Session.createSlot([1], 1000, seeded(4)).id, slot.id);

  const keyOf = (q, k, i) => 'Q' + q + ':' + k + ':' + i;
  const keys = Session.deckKeys([
    { q: 17, correct: false, sure: true },
    { q: 16, correct: true, sure: false },
    { q: 18, correct: true, sure: true }
  ], LESSONS, keyOf);
  assert.deepStrictEqual(keys, ['Q17:v:0', 'Q17:v:1', 'Q17:v:2', 'Q17:g:0', 'Q16:v:0', 'Q16:v:1', 'Q16:v:2']);

  const ctx = Session.contextOf({ attempts: [att(1, true, true), { q: 2, mode: 'study', correct: null }] },
    { lessons: LESSONS, sections: SECTIONS }, TODAY);
  assert.strictEqual(ctx.attempts.length, 1, 'only graded attempts');
  assert.strictEqual(ctx.todayStr, TODAY);
}
