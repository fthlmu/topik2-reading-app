// sync-merge.test.js: js/sync-merge.js, the pure merge of two devices' records (no DOM, no network).
//   - normalizing: wrong shapes are dropped, a wrong format gives an empty document
//   - resetAt: the later one wins; attempts, sessions, cards and tombstones older than it are dropped
//   - attempts: union, one copy per [q, mode, at, sessionId, chosen, correct], sorted by at (stable)
//   - sessions: union by id, the local copy on a clash, sorted by at
//   - deck: newer write per card (t), tombstones, 120-day pruning
//   - streak: recomputed with Store's day rule; a merge with an empty remote keeps a recorded streak
//   - local-only fields pass through; the merge is idempotent and commutative
const assert = require('assert');

global.window = global.window || {};
const Store = require('../js/store.js');
const M = require('../js/sync-merge.js');

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.parse('2026-11-12T03:00:00.000Z');
const iso = ms => new Date(ms).toISOString();
const att = (q, ms, extra) => ({
  q, mode: 'sprint', chosen: 1, correct: true, sure: true, ms: 1000, at: iso(ms), sessionId: 's' + ms, ...extra
});
const ses = (id, ms, extra) => ({ id, at: iso(ms), mode: 'sprint', qs: [16], right: 1, total: 1, overtimeCount: 0, durationMs: 1000, ...extra });
const card = (t, extra) => ({ box: 1, due: '2026-11-12', seen: 0, wrong: 0, added: '2026-11-12', ...(t === undefined ? {} : { t }), ...extra });
const doc = parts => ({ format: 1, resetAt: null, attempts: [], sessions: [], deck: {}, deckRemoved: {}, ...parts });
const C = M.canonical;

// 1. Normalizing: the same rules as the store and the deck.
{
  assert.deepStrictEqual(M.normalizeDoc(null), M.emptyDoc());
  assert.deepStrictEqual(M.normalizeDoc({ format: 2, attempts: [att(1, NOW)] }), M.emptyDoc(), 'another format: nothing read');
  const n = M.normalizeDoc(doc({
    resetAt: 'not a date',
    attempts: [att(1, NOW), { q: 99, mode: 'sprint' }, 'x'],
    sessions: [ses('a', NOW), { at: iso(NOW) }],
    deck: { 'Q1:v:0': card(5), 'Q1:v:1': card(5, { box: 9 }), junk: card(5), 'Q2:v:0': card(undefined), 'Q3:v:0': card('x') },
    deckRemoved: { 'Q4:v:0': NOW, 'Q4:v:1': 'soon', bad: NOW }
  }));
  assert.strictEqual(n.resetAt, null);
  assert.strictEqual(n.attempts.length, 1);
  assert.deepStrictEqual(n.sessions.map(s => s.id), ['a']);
  assert.deepStrictEqual(Object.keys(n.deck), ['Q1:v:0', 'Q2:v:0'], 'bad cards dropped, a card without t kept');
  assert.deepStrictEqual(n.deckRemoved, { 'Q4:v:0': NOW });
  assert.strictEqual(M.normalizeDoc(doc({ resetAt: '2026-11-12T03:00:00Z' })).resetAt, '2026-11-12T03:00:00.000Z');
  // Canonical JSON ignores key order.
  assert.ok(M.sameDoc({ deck: {}, format: 1, attempts: [] }, M.emptyDoc()));
  assert.strictEqual(C({ b: 1, a: { d: 2, c: 3 } }), '{"a":{"c":3,"d":2},"b":1}');
}

// 2. resetAt: the later one wins, null loses; anything older is dropped from both sides.
{
  const r1 = iso(NOW - 2 * DAY);
  const r2 = iso(NOW - DAY);
  assert.strictEqual(M.merge(doc({ resetAt: r1 }), doc({ resetAt: r2 }), NOW).resetAt, r2);
  assert.strictEqual(M.merge(doc({ resetAt: r2 }), doc({ resetAt: r1 }), NOW).resetAt, r2);
  assert.strictEqual(M.merge(doc({ resetAt: null }), doc({ resetAt: r1 }), NOW).resetAt, r1);
  assert.strictEqual(M.merge(doc(), doc(), NOW).resetAt, null);

  const local = doc({
    resetAt: r2,
    attempts: [att(1, NOW - 3 * DAY), att(2, NOW - DAY / 2)],
    sessions: [ses('old', NOW - 3 * DAY), ses('new', NOW - DAY / 2)],
    deck: { 'Q1:v:0': card(undefined), 'Q2:v:0': card(NOW - DAY / 2) },
    deckRemoved: { 'Q3:v:0': NOW - 3 * DAY, 'Q4:v:0': NOW - DAY / 2 }
  });
  const remote = doc({ attempts: [att(5, NOW - 2 * DAY)], deck: { 'Q5:v:0': card(NOW - 2 * DAY) } });
  const m = M.merge(local, remote, NOW);
  assert.deepStrictEqual(m.attempts.map(a => a.q), [2], 'attempts before the reset are gone, from both sides');
  assert.deepStrictEqual(m.sessions.map(s => s.id), ['new']);
  assert.deepStrictEqual(Object.keys(m.deck), ['Q2:v:0'], 'an old card (no t) and a card from before the reset are gone');
  assert.deepStrictEqual(m.deckRemoved, { 'Q4:v:0': NOW - DAY / 2 });
}

// 3. Attempts: union, one copy per key (the local one), sorted by at, ties in their order.
{
  const shared = att(16, NOW - 5000);
  const local = doc({ attempts: [att(17, NOW - 1000), shared, { ...att(18, NOW - 3000), ms: 111 }] });
  const remote = doc({ attempts: [shared, { ...att(18, NOW - 3000), ms: 999 }, att(20, NOW - 4000)] });
  const m = M.merge(local, remote, NOW);
  assert.deepStrictEqual(m.attempts.map(a => a.q), [16, 20, 18, 17]);
  assert.strictEqual(m.attempts.find(a => a.q === 18).ms, 111, 'same key: the local copy is kept');
  // One finished run writes all its attempts with one time stamp: their order stays.
  const T = NOW - 2000;
  const run = [att(30, T, { sessionId: 'r' }), att(25, T, { sessionId: 'r' }), att(27, T, { sessionId: 'r' })];
  const m2 = M.merge(doc({ attempts: run }), doc({ attempts: [att(1, T - 1), att(2, T + 1)] }), NOW);
  assert.deepStrictEqual(m2.attempts.map(a => a.q), [1, 30, 25, 27, 2], 'stable on equal times');
  // A different pick or result is another attempt.
  const m3 = M.merge(doc({ attempts: [shared] }), doc({ attempts: [{ ...shared, chosen: 2, correct: false }] }), NOW);
  assert.strictEqual(m3.attempts.length, 2);
}

// 4. Sessions: union by id (the local copy on a clash), sorted by at.
{
  const local = doc({ sessions: [ses('b', NOW - 1000, { right: 1 }), ses('c', NOW - 500)] });
  const remote = doc({ sessions: [ses('a', NOW - 3000), ses('b', NOW - 1000, { right: 0 })] });
  const m = M.merge(local, remote, NOW);
  assert.deepStrictEqual(m.sessions.map(s => s.id), ['a', 'b', 'c']);
  assert.strictEqual(m.sessions.find(s => s.id === 'b').right, 1, 'clash: the local copy');
}

// 5. Deck: the newer write per card wins; tombstones; pruning after 120 days.
{
  const local = doc({
    deck: {
      'Q1:v:0': card(NOW - 1000, { box: 3 }),
      'Q1:v:1': card(undefined, { box: 2, seen: 4 }),
      'Q1:v:2': card(NOW - 9000),
      'Q1:v:3': card(NOW - 1000),
      'Q1:v:5': card(0, { seen: 1 })
    },
    deckRemoved: { 'Q1:v:4': NOW - 2000, 'Q9:v:0': NOW - 121 * DAY, 'Q9:v:1': NOW - 119 * DAY }
  });
  const remote = doc({
    deck: {
      'Q1:v:0': card(NOW - 5000, { box: 1 }),
      'Q1:v:1': card(NOW - 9000, { box: 1, seen: 1 }),
      'Q1:v:4': card(NOW - 3000),
      'Q1:v:5': card(undefined, { seen: 3 })
    },
    deckRemoved: { 'Q1:v:2': NOW - 5000, 'Q1:v:3': NOW - 5000 }
  });
  const m = M.merge(local, remote, NOW);
  assert.strictEqual(m.deck['Q1:v:0'].box, 3, 'newer t wins');
  assert.strictEqual(m.deck['Q1:v:1'].t, NOW - 9000, 'a card with t beats one without');
  assert.ok(!m.deck['Q1:v:2'], 'removed after its last write: gone');
  assert.ok(m.deck['Q1:v:3'], 'written after the removal: kept');
  assert.ok(!m.deck['Q1:v:4'], 'the tombstone is newer than the remote card');
  assert.strictEqual(m.deck['Q1:v:5'].seen, 3, 'equal t (0): the card seen more often');
  assert.deepStrictEqual(m.deckRemoved, { 'Q1:v:2': NOW - 5000, 'Q1:v:4': NOW - 2000, 'Q9:v:1': NOW - 119 * DAY },
    'a tombstone under a newer card goes; one older than 120 days is pruned');
  assert.deepStrictEqual(M.deckOf(m), { deck: m.deck, removed: m.deckRemoved });
}

// 5b. A reviewed card beats a fresh seed whatever the times (PC grades Q5:v:0 to box 4 at 10:00, the
// iPad seeds the same key at 10:05 after a wrong answer): both argument orders, and both seeds.
{
  const at = h => new Date(2026, 10, 12, h).getTime();
  const graded = card(at(10), { box: 4, seen: 3, due: '2026-11-20' });
  const seeded = card(at(10) + 5 * 60 * 1000);
  const pc = doc({ deck: { 'Q5:v:0': graded } });
  const ipad = doc({ deck: { 'Q5:v:0': seeded } });
  assert.strictEqual(M.merge(pc, ipad, NOW).deck['Q5:v:0'].box, 4, 'local reviewed, remote seed');
  assert.strictEqual(M.merge(ipad, pc, NOW).deck['Q5:v:0'].box, 4, 'local seed, remote reviewed');
  assert.strictEqual(C(M.merge(pc, ipad, NOW)), C(M.merge(ipad, pc, NOW)));
  // A reviewed card without t (from before sync) still beats a newer seed.
  const old = card(undefined, { box: 2, seen: 1 });
  assert.strictEqual(M.merge(doc({ deck: { 'Q5:v:0': seeded } }), doc({ deck: { 'Q5:v:0': old } }), NOW).deck['Q5:v:0'].box, 2);
  // Both only seeded: the existing order (newer t, then canonical) decides, the same both ways.
  const seedA = card(at(9), { added: '2026-11-11' });
  const seedB = card(at(11), { added: '2026-11-12' });
  [[seedA, seedB], [seedB, seedA]].forEach(([x, y]) => {
    assert.strictEqual(M.merge(doc({ deck: { 'Q5:v:0': x } }), doc({ deck: { 'Q5:v:0': y } }), NOW).deck['Q5:v:0'].t, at(11));
  });
  const tieA = card(at(9), { due: '2026-11-12' });
  const tieB = card(at(9), { due: '2026-11-13' });
  assert.strictEqual(C(M.merge(doc({ deck: { 'Q5:v:0': tieA } }), doc({ deck: { 'Q5:v:0': tieB } }), NOW)),
    C(M.merge(doc({ deck: { 'Q5:v:0': tieB } }), doc({ deck: { 'Q5:v:0': tieA } }), NOW)), 'equal t and seen: canonical, both ways');
  // Both reviewed: the newer write wins, as before.
  const g1 = card(at(9), { box: 2, seen: 1 });
  const g2 = card(at(11), { box: 5, seen: 1 });
  assert.strictEqual(M.merge(doc({ deck: { 'Q5:v:0': g1 } }), doc({ deck: { 'Q5:v:0': g2 } }), NOW).deck['Q5:v:0'].box, 5);
  assert.strictEqual(M.merge(doc({ deck: { 'Q5:v:0': g2 } }), doc({ deck: { 'Q5:v:0': g1 } }), NOW).deck['Q5:v:0'].box, 5);
}

// 5c. Pairing (union: true): no reset cut-off on either side, resetAt null. Each side's own reset
// already cleared its own data; pairing must never delete the other device's older history.
{
  const older = doc({
    attempts: [att(1, NOW - 90 * DAY)], sessions: [ses('old', NOW - 90 * DAY)],
    deck: { 'Q1:v:0': card(NOW - 90 * DAY, { seen: 2 }), 'Q1:v:1': card(undefined) }
  });
  const resetRecently = doc({ resetAt: iso(NOW - DAY), attempts: [att(2, NOW - DAY / 2)], deck: { 'Q2:v:0': card(NOW - DAY / 2) } });
  [[older, resetRecently], [resetRecently, older]].forEach(([local, remote], i) => {
    const m = M.merge(local, remote, NOW, { union: true });
    assert.strictEqual(m.resetAt, null, 'pairing result has no reset time (' + i + ')');
    assert.deepStrictEqual(m.attempts.map(a => a.q), [1, 2], 'every attempt kept (' + i + ')');
    assert.deepStrictEqual(m.sessions.map(s => s.id), ['old']);
    assert.deepStrictEqual(Object.keys(m.deck).sort(), ['Q1:v:0', 'Q1:v:1', 'Q2:v:0'], 'every card kept (' + i + ')');
  });
  assert.strictEqual(C(M.merge(older, resetRecently, NOW, { union: true })), C(M.merge(resetRecently, older, NOW, { union: true })));
  // Without the option (a normal sync) the reset still clears the older history.
  assert.deepStrictEqual(M.merge(older, resetRecently, NOW).attempts.map(a => a.q), [2]);
}

// 6. Streak: Store's day rule over the merged sessions; local-only fields untouched.
{
  const day = (d, h) => new Date(2026, 10, d, h || 12).toISOString();
  assert.deepStrictEqual(M.streakOf([]), { last: null, count: 0 });
  assert.deepStrictEqual(M.streakOf([ses('a', Date.parse(day(9))), ses('b', Date.parse(day(10))), ses('c', Date.parse(day(10, 20)))]),
    { last: '2026-11-10', count: 2 });
  assert.deepStrictEqual(M.streakOf([ses('a', Date.parse(day(7))), ses('b', Date.parse(day(10)))]),
    { last: '2026-11-10', count: 1 }, 'a gap starts over');

  // A streak built by recordSession is unchanged by a merge with an empty remote.
  const m = new Map();
  const ls = { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
  const prevW = global.window.localStorage;
  const prevG = global.localStorage;
  global.window.localStorage = ls;
  global.localStorage = ls;
  try {
    Store.resetCache();
    Store.load();
    Store.setSetting('uiLang', 'en');
    Store.setRetry([16, 17]);
    [[9, 's1'], [10, 's2'], [10, 's3'], [11, 's4']].forEach(([d, id]) =>
      Store.recordSession({ id, at: day(d), mode: 'sprint', qs: [16], right: 1, total: 1 }));
    const state = Store.get();
    assert.deepStrictEqual(state.streak, { last: '2026-11-11', count: 3 });
    const merged = M.merge(M.docOf(state, { deck: {}, removed: {} }), M.emptyDoc(), NOW);
    const next = M.applyToState(state, merged);
    assert.deepStrictEqual(next.streak, state.streak, 'same streak');
    assert.strictEqual(next.settings, state.settings, 'settings untouched');
    assert.strictEqual(next.retryQs, state.retryQs, 'retry list untouched');
    assert.strictEqual(next.sprint, state.sprint, 'open run untouched');
    assert.strictEqual(next.version, 2);
    // Sessions from the other device extend the streak.
    const other = doc({ sessions: [ses('x', Date.parse(day(12)))] });
    assert.deepStrictEqual(M.applyToState(state, M.merge(M.docOf(state, {}), other, NOW)).streak, { last: '2026-11-12', count: 4 });
  } finally {
    global.window.localStorage = prevW;
    global.localStorage = prevG;
    Store.resetCache();
  }
}

// 7. Idempotent and commutative on a realistic pair (shared history, then each device on its own).
{
  const shared = { attempts: [att(16, NOW - 9 * DAY)], sessions: [ses('s0', NOW - 9 * DAY)] };
  const a = doc({
    resetAt: iso(NOW - 10 * DAY),
    attempts: [...shared.attempts, att(17, NOW - 2 * DAY), att(18, NOW - DAY)],
    sessions: [...shared.sessions, ses('a1', NOW - 2 * DAY)],
    deck: { 'Q16:v:0': card(NOW - 3 * DAY, { box: 2 }), 'Q17:v:0': card(NOW - DAY) },
    deckRemoved: { 'Q20:v:0': NOW - DAY }
  });
  const b = doc({
    attempts: [...shared.attempts, att(19, NOW - DAY / 3), att(9, NOW - 11 * DAY)],
    sessions: [...shared.sessions, ses('b1', NOW - DAY / 3)],
    deck: { 'Q16:v:0': card(NOW - DAY, { box: 3 }), 'Q20:v:0': card(NOW - 2 * DAY), 'Q21:v:0': card(NOW - DAY) },
    deckRemoved: { 'Q17:v:0': NOW - 2 * DAY }
  });
  const ab = M.merge(a, b, NOW);
  const ba = M.merge(b, a, NOW);
  assert.strictEqual(C(ab), C(ba), 'commutative');
  assert.strictEqual(C(M.merge(ab, ab, NOW)), C(ab), 'merge(m, m) = m');
  assert.strictEqual(C(M.merge(ab, b, NOW)), C(ab), 'merging a side again changes nothing');
  assert.strictEqual(C(M.merge(a, ab, NOW)), C(ab));
  assert.ok(M.sameDoc(ab, ba));
  assert.deepStrictEqual(ab.attempts.map(x => x.q), [16, 17, 18, 19], 'the 11-day-old attempt is before the reset');
  assert.deepStrictEqual(Object.keys(ab.deck).sort(), ['Q16:v:0', 'Q17:v:0', 'Q21:v:0']);
  assert.strictEqual(ab.deck['Q16:v:0'].box, 3);
  // Nothing to push when the server already holds the merged document.
  assert.ok(M.sameDoc(M.merge(a, ab, NOW), ab));
  assert.ok(!M.sameDoc(M.merge(a, b, NOW), b), 'the merge differs from the remote side: push');
}

// 8. docOf: the synced parts of a store state + SRS.exportSync(); nothing local-only.
{
  const state = { ...Store.defaults(), resetAt: iso(NOW), attempts: [att(1, NOW)], settings: { uiLang: 'en' }, retryQs: [3] };
  const d = M.docOf(state, { deck: { 'Q1:v:0': card(NOW) }, removed: { 'Q2:v:0': NOW } });
  assert.deepStrictEqual(Object.keys(d).sort(), ['attempts', 'deck', 'deckRemoved', 'format', 'resetAt', 'sessions']);
  assert.strictEqual(d.resetAt, iso(NOW));
  assert.deepStrictEqual(d.deckRemoved, { 'Q2:v:0': NOW });
  assert.ok(M.storePart(d) !== M.storePart(M.emptyDoc()) && M.deckPart(d) !== M.deckPart(M.emptyDoc()));
}
