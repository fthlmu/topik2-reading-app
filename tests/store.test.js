// store.test.js — standalone Node check for js/store.js: migration, derived status,
// sessions + streak, sprint slot, retry list, backup-on-corrupt, cross-tab re-read.
// Run: node tests/store.test.js   (also picked up by tests/run.js)
const assert = require('assert');

function makeStorage() {
  const m = new Map();
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: k => { m.delete(k); },
    clear: () => m.clear()
  };
}

// Isolate from other test files that share this process.
global.window = global.window || {};
const prevWindowLS = global.window.localStorage;
const prevGlobalLS = global.localStorage;
const ls = makeStorage();
global.window.localStorage = ls;
global.localStorage = ls;

require('../lessons.js'); // window.TOPIK2 for section lookups (avgPaceRatio)
const Store = require('../js/store.js');
const atLocal = (y, m, d, h) => new Date(y, m - 1, d, h || 12, 0, 0).toISOString();
let checks = 0;
function check(fn) { fn(); checks += 1; }

function fresh(legacyValue) {
  ls.clear();
  if (legacyValue !== undefined) ls.setItem(Store.LEGACY_KEY, legacyValue);
  Store.resetCache();
  return Store.load();
}

try {
  // 1. Empty storage → defaults, everything untried, v2 key written.
  check(() => {
    const s = fresh();
    assert.strictEqual(s.version, 2);
    assert.deepStrictEqual(s.attempts, []);
    assert.strictEqual(Store.statusOf(1), 'untried');
    assert.ok(ls.getItem(Store.KEY), 'v2 key saved on first load');
    assert.strictEqual(Store.nextUntried(), 1);
  });

  // 2. Legacy "[1,2,3]" → three study attempts with correct:null, shown as "seen".
  check(() => {
    const s = fresh('[1,2,3]');
    assert.strictEqual(s.attempts.length, 3);
    s.attempts.forEach(a => {
      assert.strictEqual(a.mode, 'study');
      assert.strictEqual(a.correct, null);
      assert.strictEqual(a.source, 'legacy');
    });
    assert.strictEqual(Store.statusOf(1), 'seen');
    assert.strictEqual(Store.statusOf(3), 'seen');
    assert.strictEqual(Store.statusOf(4), 'untried');
    assert.strictEqual(ls.getItem(Store.LEGACY_KEY), '[1,2,3]', 'legacy key left in place');
    assert.strictEqual(Store.nextUntried(), 4);
  });

  // 3. Migration runs once: a later load reads v2 and does not duplicate.
  check(() => {
    Store.resetCache();
    const again = Store.load();
    assert.strictEqual(again.attempts.length, 3);
  });

  // 4. Garbled legacy data is filtered or ignored, never thrown.
  check(() => {
    assert.strictEqual(fresh('[2,"x",99,2,0,5]').attempts.map(a => a.q).join(','), '2,5');
    assert.strictEqual(fresh('"oops"').attempts.length, 0);
    assert.strictEqual(fresh('{not json').attempts.length, 0);
  });

  // 5. Corrupted v2 JSON → copied to the .bak key, then defaults; no throw.
  check(() => {
    ls.clear();
    ls.setItem(Store.KEY, '{broken');
    Store.resetCache();
    assert.deepStrictEqual(Store.load().attempts, []);
    assert.strictEqual(ls.getItem(Store.BAK_KEY), '{broken', 'corrupt blob backed up');
    assert.strictEqual(JSON.parse(ls.getItem(Store.KEY)).version, 2, 'main key reset to v2');
  });

  // 5b. A blob from a newer app version is also backed up before the reset.
  check(() => {
    ls.clear();
    const newer = JSON.stringify({ version: 3, attempts: [{ q: 1 }], future: true });
    ls.setItem(Store.KEY, newer);
    Store.resetCache();
    assert.deepStrictEqual(Store.load().attempts, []);
    assert.strictEqual(ls.getItem(Store.BAK_KEY), newer);
  });

  // 5c. If the backup cannot be written, the original blob is left untouched.
  check(() => {
    ls.clear();
    ls.setItem(Store.KEY, '{broken');
    const realSet = ls.setItem;
    ls.setItem = () => { throw new Error('quota'); };
    Store.resetCache();
    Store.load();
    ls.setItem = (k, v) => { if (k === Store.BAK_KEY) throw new Error('quota'); realSet(k, v); };
    Store.recordAttempt({ q: 1, mode: 'study', chosen: 1, correct: true });
    ls.setItem = realSet;
    assert.strictEqual(ls.getItem(Store.KEY), '{broken', 'main key never overwritten without a backup');
    assert.strictEqual(Store.isPersistent(), false);
  });

  // 6. statusOf transitions use the last sprint/mock attempt.
  check(() => {
    fresh();
    Store.recordAttempt({ q: 7, mode: 'study', chosen: 2, correct: false });
    assert.strictEqual(Store.statusOf(7), 'seen', 'study attempts only mark seen');
    Store.recordAttempt({ q: 7, mode: 'sprint', chosen: 2, correct: false, sure: true });
    assert.strictEqual(Store.statusOf(7), 'wrong');
    Store.recordAttempt({ q: 7, mode: 'sprint', chosen: 1, correct: true, sure: false });
    assert.strictEqual(Store.statusOf(7), 'right-unsure');
    Store.recordAttempt({ q: 7, mode: 'mock', chosen: 1, correct: true, sure: true });
    assert.strictEqual(Store.statusOf(7), 'recovered');
    Store.recordAttempt({ q: 7, mode: 'study', chosen: 3, correct: false });
    assert.strictEqual(Store.statusOf(7), 'recovered', 'later study attempt does not override');
    Store.recordAttempt({ q: 8, mode: 'sprint', chosen: 1, correct: true, sure: true });
    assert.strictEqual(Store.statusOf(8), 'right-sure');
  });

  // 7. sectionAccuracy: latest graded attempt per question; null when none.
  check(() => {
    const sections = [{ id: 'C', range: [5, 8] }, { id: 'A', range: [1, 2] }];
    const acc = Store.sectionAccuracy(sections);
    assert.deepStrictEqual(acc.C, { right: 2, tried: 2, pct: 100 });
    assert.deepStrictEqual(acc.A, { right: 0, tried: 0, pct: null });
  });

  // 8. recordAttempt is immutable and validates input.
  check(() => {
    const before = Store.get();
    const count = before.attempts.length;
    const after = Store.recordAttempt({ q: 1, mode: 'study', chosen: 1, correct: true });
    assert.strictEqual(before.attempts.length, count, 'previous state untouched');
    assert.strictEqual(after.attempts.length, count + 1);
    assert.throws(() => Store.recordAttempt({ q: 51, mode: 'study' }), TypeError);
    assert.throws(() => Store.recordAttempt({ q: 1, mode: 'cheat' }), TypeError);
  });

  // 9. Settings + lastAttempt + lastSession.
  check(() => {
    Store.setSetting('theme', 'dark');
    assert.strictEqual(Store.get().settings.theme, 'dark');
    Store.setSetting('theme', 'neon');
    assert.strictEqual(Store.get().settings.theme, 'auto', 'unknown theme falls back to auto');
    // 주석 (English layer): on by default, off persists; the sprint/mock override is validated.
    assert.strictEqual(Store.get().settings.gloss, true);
    assert.strictEqual(Store.get().settings.glossExam, null);
    Store.setSetting('gloss', false);
    assert.strictEqual(Store.get().settings.gloss, false);
    Store.setSetting('glossExam', { on: true, phase: 'learn' });
    assert.deepStrictEqual(Store.get().settings.glossExam, { on: true, phase: 'learn' });
    Store.setSetting('glossExam', { on: 'yes', phase: 'learn' });
    assert.strictEqual(Store.get().settings.glossExam, null, 'bad override dropped');
    Store.setSetting('glossExam', { on: false, phase: 'someday' });
    assert.strictEqual(Store.get().settings.glossExam, null);
    Store.setSetting('gloss', true);
    assert.strictEqual(Store.lastAttempt('study').q, 1);
    assert.strictEqual(Store.lastSession(), null);
  });
  // 10. recordSession appends once per id and drives the streak.
  check(() => {
    fresh();
    const base = { qs: [1, 2], right: 1, total: 2, overtimeCount: 0, durationMs: 1000, mode: 'sprint' };
    Store.recordSession({ ...base, id: 's1', at: atLocal(2026, 10, 27, 9) });
    assert.deepStrictEqual(Store.get().streak, { last: '2026-10-27', count: 1 });
    Store.recordSession({ ...base, id: 's1', at: atLocal(2026, 10, 27, 10) });
    assert.strictEqual(Store.get().sessions.length, 1, 'same id is not stored twice');
    Store.recordSession({ ...base, id: 's2', at: atLocal(2026, 10, 27, 20) });
    assert.deepStrictEqual(Store.get().streak, { last: '2026-10-27', count: 1 }, 'same day unchanged');
    Store.recordSession({ ...base, id: 's3', at: atLocal(2026, 10, 28, 8) });
    assert.deepStrictEqual(Store.get().streak, { last: '2026-10-28', count: 2 }, 'next day +1');
    Store.recordSession({ ...base, id: 's4', at: atLocal(2026, 10, 31, 8) });
    assert.deepStrictEqual(Store.get().streak, { last: '2026-10-31', count: 1 }, 'gap resets to 1');
    assert.deepStrictEqual(Store.lastSession(), { ...base, id: 's4', at: atLocal(2026, 10, 31, 8) });
    assert.strictEqual(Store.sessionById('s2').id, 's2');
    assert.strictEqual(Store.sessionById('nope'), null);
    assert.throws(() => Store.recordSession({ qs: [1] }), TypeError);
  });

  // 11. In-progress sprint slot lives in the same blob and survives a reload.
  check(() => {
    fresh();
    const slot = {
      id: 'sx', qs: [3, 16, 48], idx: 1, startedAt: 1000, shownAt: 2000, elapsedMs: 0,
      pending: { chosen: 2, ms: 4000 },
      answers: [{ q: 3, chosen: 4, correct: true, sure: false, ms: 30000, at: atLocal(2026, 10, 28) }]
    };
    Store.setSprint(slot);
    assert.deepStrictEqual(Store.getSprint(), slot);
    assert.deepStrictEqual(JSON.parse(ls.getItem(Store.KEY)).sprint, slot, 'stored under "sprint"');
    Store.resetCache();
    assert.deepStrictEqual(Store.getSprint(), slot, 'resumes after reload');
    assert.throws(() => Store.setSprint({ ...slot, idx: 2 }), TypeError, 'answers must match idx');
    assert.throws(() => Store.setSprint({ ...slot, qs: [3, 99] }), TypeError);
    Store.clearSprint();
    assert.strictEqual(Store.getSprint(), null);
    assert.strictEqual(Store.normalize({ version: 2, sprint: { id: 'x', qs: 'nope' } }).sprint, null);
  });

  // 12. Retry list: valid distinct questions only.
  check(() => {
    Store.setRetry([3, 3, 99, 4]);
    assert.deepStrictEqual(Store.get().retryQs, [3, 4]);
    Store.setRetry(null);
    assert.strictEqual(Store.get().retryQs, null);
  });

  // 13. Writes re-read storage first: another tab's attempt is kept.
  check(() => {
    fresh();
    Store.recordAttempt({ q: 1, mode: 'study', chosen: 1, correct: true });
    const other = JSON.parse(ls.getItem(Store.KEY));
    const extra = { q: 2, mode: 'study', chosen: 1, correct: false, at: atLocal(2026, 10, 28) };
    ls.setItem(Store.KEY, JSON.stringify({ ...other, attempts: [...other.attempts, extra] }));
    Store.recordAttempt({ q: 3, mode: 'study', chosen: 1, correct: true });
    assert.deepStrictEqual(Store.get().attempts.map(a => a.q), [1, 2, 3]);
    Store.setSetting('romanization', true);
    assert.strictEqual(JSON.parse(ls.getItem(Store.KEY)).attempts.length, 3);
  });

  // 14. attemptsToday filters by local calendar day and mode.
  check(() => {
    fresh();
    Store.recordAttempt({ q: 1, mode: 'sprint', chosen: 1, correct: true, sure: true });
    Store.recordAttempt({ q: 2, mode: 'study', chosen: 1, correct: true });
    Store.recordAttempt({ q: 3, mode: 'sprint', chosen: 1, correct: true, at: atLocal(2020, 1, 1) });
    assert.strictEqual(Store.attemptsToday().length, 2);
    assert.deepStrictEqual(Store.attemptsToday('sprint').map(a => a.q), [1]);
    assert.strictEqual(Store.attemptsToday('mock').length, 0);
  });

  // 15. weakestSections: all graded attempts, min n, perfect sections left out, ascending.
  check(() => {
    fresh();
    const secs = [{ id: 'A', range: [1, 2] }, { id: 'B', range: [3, 4] }, { id: 'C', range: [5, 8] }, { id: 'D', range: [9, 12] }];
    const g = (q, correct) => Store.recordAttempt({ q, mode: 'sprint', chosen: 1, correct, sure: true });
    g(1, false); g(2, true);   // A 0.5 (n 2)
    g(3, false); g(3, false);  // B 0.0 (n 2)
    g(5, false);               // C n 1 → too few at minAttempts 2
    g(9, true); g(10, true);   // D perfect → not weak
    Store.recordAttempt({ q: 4, mode: 'study', chosen: 1, correct: false }); // study ignored
    assert.deepStrictEqual(Store.weakestSections(3, 2, secs),
      [{ id: 'B', accuracy: 0, n: 2 }, { id: 'A', accuracy: 0.5, n: 2 }]);
    assert.deepStrictEqual(Store.weakestSections(1, 2, secs).map(w => w.id), ['B']);
    assert.deepStrictEqual(Store.weakestSections(3, 1, secs).map(w => w.id), ['B', 'C', 'A']);
  });

  // 16. avgPaceRatio: mean of ms / section budget for one session.
  check(() => {
    fresh();
    Store.recordAttempt({ q: 1, mode: 'sprint', chosen: 1, correct: true, ms: 20000, sessionId: 'sp' });  // A 40 s → 0.5
    Store.recordAttempt({ q: 16, mode: 'sprint', chosen: 1, correct: true, ms: 70000, sessionId: 'sp' }); // F 70 s → 1
    Store.recordAttempt({ q: 2, mode: 'sprint', chosen: 1, correct: true, ms: 99000, sessionId: 'other' });
    assert.strictEqual(Store.avgPaceRatio('sp'), 0.75);
    assert.strictEqual(Store.avgPaceRatio('none'), null);
  });

  // 17. Mock slot (mode 'mock') shares the "sprint" key; sparse answers survive a reload.
  const mockSlot = {
    id: 'm1', mode: 'mock', qs: [1, 2, 3], idx: 1,
    answers: [{ q: 1, chosen: 2, correct: false, sure: null, ms: 3000, at: atLocal(2026, 10, 28) }, null, null],
    spent: [3000, 500, 0], startedAt: 10, deadline: 10 + 4200000, shownAt: 20
  };
  check(() => {
    fresh();
    Store.setSprint(mockSlot);
    Store.resetCache();
    assert.deepStrictEqual(Store.getSprint(), mockSlot);
    assert.deepStrictEqual(Store.setSprint({ ...mockSlot, spent: [1, 'x'], shownAt: null }).sprint.spent, [1, 0, 0]);
    const bad = [
      { ...mockSlot, answers: [null, null] },
      { ...mockSlot, answers: [null, mockSlot.answers[0], null] },
      { ...mockSlot, idx: 3 },
      { ...mockSlot, deadline: undefined },
      { ...mockSlot, qs: [1, 2, 99] },
      { ...mockSlot, answers: [{ q: 1, chosen: 1 }, null, null] }
    ];
    bad.forEach((slot, i) => assert.throws(() => Store.setSprint(slot), TypeError, 'bad mock slot ' + i));
    assert.strictEqual(Store.normalize({ version: 2, sprint: { ...mockSlot, idx: -1 } }).sprint, null);
  });

  // 18. recordAttempts: one write for a whole run; one invalid entry → nothing stored.
  check(() => {
    fresh();
    const a = q => ({ q, mode: 'mock', chosen: 1, correct: q === 1, sure: null, ms: 1000 * q, sessionId: 'm1' });
    Store.recordAttempts([a(1), a(2)]);
    const stored = Store.get().attempts;
    assert.deepStrictEqual(stored.map(x => [x.q, x.mode, x.sessionId]), [[1, 'mock', 'm1'], [2, 'mock', 'm1']]);
    assert.strictEqual(stored[0].at, stored[1].at, 'same timestamp');
    assert.throws(() => Store.recordAttempts([a(3), { q: 99, mode: 'mock' }]), TypeError);
    assert.strictEqual(Store.get().attempts.length, 2, 'all-or-nothing');
    Store.recordAttempts([]);
    assert.strictEqual(Store.get().attempts.length, 2);
    assert.strictEqual(Store.statusOf(1), 'right-sure', 'mock right (sure:null) colours the map');
    assert.strictEqual(Store.statusOf(2), 'wrong');
  });

  // 19. Mock sessions are stored as mode 'mock'; clearSprint(id) only clears that run.
  check(() => {
    Store.recordSession({ id: 'm1', mode: 'mock', qs: [1, 2, 3], right: 1, total: 3, overtimeCount: 0, durationMs: 60000 });
    assert.deepStrictEqual([Store.sessionById('m1').mode, Store.sessionById('m1').total], ['mock', 3]);
    Store.setSprint({ ...mockSlot, id: 'live' });
    Store.clearSprint('other');
    assert.strictEqual(Store.getSprint().id, 'live', 'a different id leaves the run alone');
    Store.clearSprint('live');
    assert.strictEqual(Store.getSprint(), null);
  });
} finally {
  global.window.localStorage = prevWindowLS;
  global.localStorage = prevGlobalLS;
  Store.resetCache();
}

if (require.main === module) console.log('store.test.js: ' + checks + ' checks passed');
