// runner.test.js — the question runner without a DOM:
//   Runner.bodyHtml is Korean on screen for every sprint/mock question and never carries an
//   editor's note (some name the answer); gloss hooks only when the layer is on;
//   RunCore sprint steps (start decision, retry, resume with pending, double keys, done);
//   RunCore.record (idempotent finish + deck seeding, id-scoped slot clear);
//   RunCore mock steps (countdown, time per question, palette, answer changes, time up).
const assert = require('assert');
global.window = global.window || {};
require('../lessons.js');
require('../js/util.js');
const Passage = require('../js/render/passage.js');
require('../js/render/choices.js');
const Session = require('../js/session.js');
const RunCore = require('../js/run-core.js');
const Runner = require('../js/screens/runner.js');
const Store = require('../js/store.js');
const SRS = require('../js/srs.js');

const LESSONS = global.window.TOPIK2.lessons;
const L = n => LESSONS['Q' + n];

function makeStorage() {
  const m = new Map();
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: k => { m.delete(k); },
    clear: () => m.clear()
  };
}

// 1. Sprint/mock question body: Korean only for all 46 eligible questions.
{
  const qs = RunCore.mockQuestions(LESSONS);
  assert.strictEqual(qs.length, 46);
  assert.deepStrictEqual([23, 24, 42, 43].filter(q => qs.includes(q)), [], 'withheld passages excluded');
  assert.deepStrictEqual(qs, qs.slice().sort((a, b) => a - b), 'exam order');
  const URL_RE = /\b(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:kr|com|org|net)\b/gi;
  qs.forEach(q => {
    const off = Runner.bodyHtml(L(q));
    const on = Runner.bodyHtml(L(q), { glossOn: true });
    assert.ok(!off.includes('gloss-word') && !off.includes('class="sent"'), 'layer off: no gloss hooks Q' + q);
    assert.ok(on.includes('gloss-word') || Passage.isWithheld(L(q)), 'layer on: gloss hooks Q' + q);
    [on, off].forEach(html => {
      assert.ok(!html.includes('data-note') && !html.includes('passage-note'), 'no editor note Q' + q);
      const text = html.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;|&#\d+;/g, ' ').replace(URL_RE, ' ');
      const latin = text.match(/[A-Za-z]{4,}/);
      assert.ok(!latin, 'no English words on screen in Q' + q + ': ' + (latin && latin[0]));
    });
  });
  // The same notes do exist outside sprint/mock (Study, Review), so the test above means something.
  [10, 23, 39, 49].forEach(q => assert.ok(Passage.renderFull(L(q), { glossOn: true }).includes('data-note="'),
    'Q' + q + ' note exists outside sprint/mock'));
}

// 2. Where #/sprint starts: in-progress run wins; retry list used once or cleared.
{
  const slot = Session.createSlot([3, 16], 1000);
  assert.deepStrictEqual(RunCore.sprintStart(null, false, null), { kind: 'pick', clearRetry: false });
  assert.deepStrictEqual(RunCore.sprintStart(null, true, [5, 6]), { kind: 'new', qs: [5, 6], clearRetry: true });
  assert.deepStrictEqual(RunCore.sprintStart(null, true, null), { kind: 'nothing', clearRetry: true }, 'empty retry');
  assert.deepStrictEqual(RunCore.sprintStart(null, true, []), { kind: 'nothing', clearRetry: true });
  const r = RunCore.sprintStart(slot, true, [5]);
  assert.strictEqual(r.kind, 'resume');
  assert.strictEqual(r.slot, slot);
  assert.strictEqual(r.clearRetry, true, 'retry ignored because a sprint exists → list cleared');
  assert.strictEqual(RunCore.sprintStart(slot, false, [5]).clearRetry, false, 'list kept when not asked for');
  assert.strictEqual(RunCore.sprintStart(RunCore.mockCreate([1, 2], 1000), false, null).kind, 'mock');
}

// 3. Sprint steps: pick → confidence → next; double keys are ignored; done at the end.
{
  let s = RunCore.sprintShow(Session.createSlot([16, 17], 0), 5000);
  assert.strictEqual(s.shownAt, 5000);
  s = RunCore.sprintChoose(s, 2, 12000);
  assert.deepStrictEqual(s.pending, { chosen: 2, ms: 12000 });
  assert.strictEqual(s.shownAt, null);
  assert.strictEqual(RunCore.sprintChoose(s, 3, 15000), s, 'second pick ignored');
  const rated = RunCore.sprintRate(s, L(16), false, 'T1');
  assert.strictEqual(rated.idx, 1);
  assert.strictEqual(rated.pending, null);
  assert.deepStrictEqual(rated.answers[0], { q: 16, chosen: 2, correct: L(16).answer === 2, sure: false, ms: 12000, at: 'T1' });
  assert.strictEqual(RunCore.sprintRate(rated, L(16), true, 'T2'), rated, 'second confidence ignored');

  const paused = RunCore.sprintPause({ ...rated, shownAt: 1000 }, 7000);
  assert.deepStrictEqual([paused.elapsedMs, paused.shownAt], [7000, null]);
  assert.strictEqual(RunCore.sprintShow(paused, 20000).shownAt, 13000, 'clock continues from 7 s');

  let done = RunCore.sprintChoose(RunCore.sprintShow(rated, 0), 1, 3000);
  done = RunCore.sprintRate(done, L(17), true, 'T3');
  assert.ok(RunCore.isSprintDone(done));
  assert.strictEqual(RunCore.sprintChoose(done, 1, 1), done, 'no pick after the last question');
  assert.strictEqual(RunCore.sprintRate(done, L(17), true, 'T4'), done);
}

const prevWindowLS = global.window.localStorage;
const prevGlobalLS = global.localStorage;
const ls = makeStorage();
global.window.localStorage = ls;
global.localStorage = ls;

try {
  // 4. Resume through a reload: a pending pick and a finished-but-unrecorded slot both survive.
  {
    ls.clear();
    Store.resetCache();
    Store.load();
    const pending = RunCore.sprintChoose(Session.createSlot([16, 17], 0), 4, 9000);
    Store.setSprint(pending);
    Store.resetCache();
    const d = RunCore.sprintStart(Store.getSprint(), false, null);
    assert.strictEqual(d.kind, 'resume');
    assert.deepStrictEqual(d.slot.pending, { chosen: 4, ms: 9000 }, 'confidence step resumes');
    let end = RunCore.sprintRate(d.slot, L(16), true, 'a');
    end = RunCore.sprintRate(RunCore.sprintChoose(end, 1, 100), L(17), true, 'b');
    Store.setSprint(end);
    Store.resetCache();
    const again = Store.getSprint();
    assert.ok(RunCore.isSprintDone(again), 'idx === qs.length is a valid resumable slot (finish on mount)');
  }

  // 5. Finish: attempts + session written once, wrong/unsure seed the deck, slot cleared by id.
  {
    ls.clear();
    Store.resetCache();
    Store.load();
    SRS._useStorage(makeStorage());
    const slot = Session.createSlot([16, 17, 18], 1000);
    Store.setSprint(slot);
    const wrong16 = (L(16).answer % 4) + 1;
    const answers = [
      { q: 16, chosen: wrong16, correct: false, sure: true, ms: 80000, at: 'x' },
      { q: 17, chosen: L(17).answer, correct: true, sure: false, ms: 20000, at: 'x' },
      { q: 18, chosen: L(18).answer, correct: true, sure: true, ms: 30000, at: 'x' }
    ];
    const run = { id: slot.id, mode: 'sprint', qs: slot.qs, answers, at: new Date(2026, 9, 28, 9).toISOString() };
    const deps = { Store, SRS, lessons: LESSONS };
    assert.strictEqual(RunCore.record(run, deps), '#/review/' + slot.id);
    const seeded = L(16).vocab.length + 1 + L(17).vocab.length + 1;
    const check = () => {
      assert.strictEqual(Store.get().attempts.length, 3);
      assert.ok(Store.get().attempts.every(a => a.mode === 'sprint' && a.sessionId === slot.id));
      assert.strictEqual(Store.get().sessions.length, 1);
      assert.strictEqual(SRS.stats().total, seeded, 'wrong Q16 + unsure Q17 seeded, sure Q18 not');
    };
    check();
    assert.strictEqual(Store.getSprint(), null);
    const other = Session.createSlot([1], 5);
    Store.setSprint(other);
    RunCore.record(run, deps);
    check();
    assert.strictEqual(Store.getSprint().id, other.id, 'another run is not cleared');
    assert.deepStrictEqual(Store.get().sessions[0], {
      id: slot.id, at: run.at, mode: 'sprint', qs: [16, 17, 18], right: 2, total: 3, overtimeCount: 1, durationMs: 130000
    });
  }
} finally {
  global.window.localStorage = prevWindowLS;
  global.localStorage = prevGlobalLS;
  Store.resetCache();
}

// 6. Mock: countdown text, time per question, palette, answer changes, away time.
{
  const T0 = 1000000;
  const qs = RunCore.mockQuestions(LESSONS);
  let m = RunCore.mockCreate(qs, T0);
  assert.strictEqual(m.mode, 'mock');
  assert.strictEqual(m.deadline - m.startedAt, 70 * 60 * 1000);
  assert.ok(m.answers.length === 46 && m.answers.every(a => a === null) && m.spent.every(x => x === 0));
  const fmt = RunCore.fmtCountdown;
  assert.strictEqual(fmt(RunCore.mockRemaining(m, T0)), '70:00');
  assert.strictEqual(fmt(RunCore.mockRemaining(m, T0 + 48000)), '69:12');
  assert.deepStrictEqual([fmt(0), fmt(1), fmt(-5), fmt(9 * 60000 + 5000)], ['00:00', '00:01', '00:00', '09:05']);

  m = RunCore.mockAnswer(m, 2, L(qs[0]), T0 + 30000);
  assert.strictEqual(m.spent[0], 30000);
  assert.deepStrictEqual({ ...m.answers[0], at: 'x' },
    { q: qs[0], chosen: 2, correct: L(qs[0]).answer === 2, sure: null, ms: 30000, at: 'x' });
  assert.strictEqual(RunCore.mockAnswer(m, 2, L(qs[0]), T0 + 31000), m, 'same pick again = no change');

  m = RunCore.mockJump(m, 5, T0 + 40000);
  assert.deepStrictEqual([m.idx, m.spent[0]], [5, 40000], 'time after answering still counts');
  [-1, 46, 5, 1.5].forEach(p => assert.strictEqual(RunCore.mockJump(m, p, T0 + 41000), m, 'jump ignored: ' + p));
  const pal = RunCore.mockPalette(m);
  assert.strictEqual(pal.length, 46);
  assert.deepStrictEqual(pal[0], { pos: 0, q: qs[0], answered: true, current: false });
  assert.deepStrictEqual(pal[5], { pos: 5, q: qs[5], answered: false, current: true });
  assert.strictEqual(RunCore.mockAnsweredCount(m), 1);
  assert.strictEqual(RunCore.mockNext(m), 6);
  assert.strictEqual(RunCore.mockNext({ ...m, idx: 45 }), null);

  m = RunCore.mockJump(m, 0, T0 + 50000);
  m = RunCore.mockAnswer(m, 1, L(qs[0]), T0 + 55000);
  assert.deepStrictEqual([m.spent[5], m.answers[0].chosen, m.answers[0].ms], [10000, 1, 45000], 'answer changed on revisit');

  m = RunCore.mockSuspend(m, T0 + 60000);
  assert.deepStrictEqual([m.shownAt, m.spent[0]], [null, 50000]);
  assert.strictEqual(RunCore.mockFold(m, T0 + 900000), m, 'nothing counts while away');
  m = RunCore.mockResume(m, T0 + 600000);
  assert.deepStrictEqual([m.shownAt, m.spent[0]], [T0 + 600000, 50000], 'away time not charged');

  const res = RunCore.mockResults(m);
  assert.strictEqual(res.length, 1);
  assert.strictEqual(res[0].ms, 50000, 'result ms = total time on the question');
  const sum = RunCore.summaryOf({ id: m.id, mode: 'mock', qs, answers: res, total: qs.length, durationMs: 60000, at: 'x' }, L);
  assert.deepStrictEqual([sum.mode, sum.total, sum.right, sum.durationMs], ['mock', 46, res[0].correct ? 1 : 0, 60000]);
}

// 7. Mock countdown reaching 0: time up, answers refused, time capped at the deadline.
{
  const qs = RunCore.mockQuestions(LESSONS);
  const m = RunCore.mockResume(RunCore.mockCreate(qs, 0), 4000000);
  const end = m.deadline;
  assert.ok(!RunCore.mockTimeUp(m, end - 1));
  assert.ok(RunCore.mockTimeUp(m, end));
  assert.strictEqual(RunCore.mockRemaining(m, end + 5000), 0);
  assert.strictEqual(RunCore.fmtCountdown(RunCore.mockRemaining(m, end - 400)), '00:01');
  assert.strictEqual(RunCore.mockAnswer(m, 3, L(qs[0]), end), m, 'no answer after time up');
  const folded = RunCore.mockFold(m, end + 99999);
  assert.strictEqual(folded.spent[0], end - 4000000, 'time per question stops at the deadline');
}
