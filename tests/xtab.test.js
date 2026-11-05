// xtab.test.js: the open run across tabs, with the ONE ACTIVE TAB rule. Two "tabs" are two Store
// instances (each has its own tab id) over one shared fake localStorage.
//   - only the active tab (the last one that claimed, key "topik2.activeTab") writes the run
//   - claiming re-reads the stored run; a newer stored revision is adopted (RunCore.claimOutcome)
//   - a stale copy is still refused by the revision check (the tiny window between two claims)
//   - one tab hiding and reloading keeps its pause/elapsed time; a re-pick after a remount is kept
//   - a sprint can only be finished from the stored, finished run (RunCore.sprintDoneRun)
//   - no storage, or a claim that cannot be written: the tab just works alone
const assert = require('assert');

global.window = global.window || {};
require('../lessons.js');
const RunCore = require('../js/run-core.js');

const STORE_PATH = require.resolve('../js/store.js');
function newTab() {
  delete require.cache[STORE_PATH];
  const store = require(STORE_PATH);
  store.resetCache();
  return store;
}

function makeStorage() {
  const m = new Map();
  const ls = {
    writes: [],
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem(k, v) { ls.writes.push(k); m.set(k, String(v)); },
    removeItem: k => { m.delete(k); },
    clear() { m.clear(); ls.writes = []; }
  };
  return ls;
}

const ans = (q, chosen) => ({ q, chosen, correct: false, sure: null, ms: 100, at: '2026-10-29T00:00:00.000Z' });
const mockSlot = n => ({ ...RunCore.mockCreate([16, 17, 18], 1000), id: 'm-' + n });
const sprintSlot = n => ({
  id: 's-' + n, qs: [16, 17], idx: 0, answers: [], startedAt: 1000, shownAt: 1000, elapsedMs: 0, pending: null
});
const answersOf = store => (store.getSprint().answers || []).map(a => a && a.chosen);

const prevWindowLS = global.window.localStorage;
const prevGlobalLS = global.localStorage;
const ls = makeStorage();
global.window.localStorage = ls;
global.localStorage = ls;

try {
  // Fresh storage, tab A starts a mock (starting a run claims the writer role), tab B opens the app.
  const setup = make => {
    ls.clear();
    const A = newTab();
    const B = newTab();
    A.load();
    const base = A.setSprint(make).sprint;
    return { A, B, base, copyB: B.getSprint() };
  };

  // 1. Only the active tab writes the run.
  {
    const { A, B, base, copyB } = setup(mockSlot('1'));
    assert.notStrictEqual(A.tabId, B.tabId, 'every page load has its own id');
    assert.ok(A.isActiveTab() && !B.isActiveTab(), 'starting the run made A the writer');
    const before = ls.getItem('topik2.v2');
    const refused = B.saveRun({ ...copyB, answers: [null, ans(17, 2), null] });
    assert.strictEqual(refused.status, 'inactive');
    assert.strictEqual(refused.slot.id, base.id, 'the stored run comes back');
    assert.strictEqual(ls.getItem('topik2.v2'), before, 'B wrote nothing');
    assert.strictEqual(A.saveRun({ ...base, answers: [ans(16, 1), null, null] }).status, 'saved');

    // B claims (focus, tab visible, or the continue button): now A is the one refused.
    assert.strictEqual(B.claimTab(), true);
    assert.ok(B.isActiveTab() && !A.isActiveTab());
    const afterA = ls.getItem('topik2.v2');
    assert.strictEqual(A.saveRun({ ...base, idx: 1 }).status, 'inactive');
    assert.strictEqual(ls.getItem('topik2.v2'), afterA, 'A, no longer the writer, wrote nothing');
    // Claiming again while already the writer writes nothing (other tabs get no event).
    const claims = () => ls.writes.filter(k => k === B.ACTIVE_KEY).length;
    const n = claims();
    B.claimTab();
    assert.strictEqual(claims(), n);
    // Nobody named (key removed or unreadable): every tab may write.
    ls.removeItem(B.ACTIVE_KEY);
    assert.ok(A.isActiveTab() && B.isActiveTab());
    ls.setItem(B.ACTIVE_KEY, '{not json');
    assert.ok(A.isActiveTab() && B.isActiveTab());
  }

  // 2. Claiming re-reads the stored run and adopts it when it is newer; then the tab can go on.
  {
    const { A, B, base, copyB } = setup(mockSlot('2'));
    const savedA = A.saveRun({ ...base, answers: [ans(16, 1), null, null], idx: 1 });
    assert.strictEqual(savedA.slot.rev, 1);
    B.claimTab();
    const out = RunCore.claimOutcome(copyB, B.getSprint());
    assert.strictEqual(out.kind, 'adopt');
    assert.strictEqual(out.slot.answers[0].chosen, 1, 'B sees A\'s answer');
    const next = B.saveRun({ ...out.slot, answers: [out.slot.answers[0], ans(17, 2), null], idx: 2 });
    assert.deepStrictEqual([next.status, next.slot.rev], ['saved', 2]);
    assert.deepStrictEqual(answersOf(A), [1, 2, null], 'nothing of A\'s was lost');
    // And back: A claims, adopts B's run.
    A.claimTab();
    const back = RunCore.claimOutcome(savedA.slot, A.getSprint());
    assert.deepStrictEqual([back.kind, back.slot.rev], ['adopt', 2]);

    // The other outcomes.
    const keep = RunCore.claimOutcome(next.slot, B.getSprint());
    assert.strictEqual(keep.kind, 'keep', 'same revision');
    assert.deepStrictEqual(keep.slot, next.slot, 'nothing to sync: the same copy');
    assert.deepStrictEqual(RunCore.claimOutcome(next.slot, null), { kind: 'gone' }, 'finished or discarded elsewhere');
    assert.deepStrictEqual(RunCore.claimOutcome(next.slot, { ...next.slot, id: 'other' }), { kind: 'other' });
  }

  // 3. A copy that missed a write is still refused by its revision, even for the writer (two tabs
  // claiming within the same moment): nothing is overwritten.
  {
    const { A, B, base, copyB } = setup(mockSlot('3'));
    A.saveRun({ ...base, answers: [ans(16, 1), null, null] });
    B.claimTab();                                   // B claims but has not adopted yet
    const res = B.saveRun({ ...copyB, spent: [9, 9, 9] });
    assert.strictEqual(res.status, 'stale');
    assert.strictEqual(res.slot.answers[0].chosen, 1);
    assert.deepStrictEqual(answersOf(B), [1, null, null]);
  }

  // 4. One tab hides and the page reloads (Safari reloads background tabs): the pause/elapsed time
  // saved on hide comes back, and the answer afterwards carries it. The reloaded page has a new tab
  // id; it claims on load, so it may write at once.
  {
    ls.clear();
    const T1 = newTab();
    T1.load();
    const made = T1.setSprint(sprintSlot('4')).sprint;
    const shown = RunCore.sprintShow(made, 100000);
    const paused = RunCore.sprintPause(shown, 60000);             // read for 60 s, then the tab is hidden
    assert.strictEqual(T1.saveRun(paused).status, 'saved', 'the active tab saves its pause on hide');
    const T2 = newTab();                                         // reload
    T2.load();
    assert.ok(T2.isActiveTab() === false, 'the new page has not claimed yet');
    T2.claimTab();
    const stored = T2.getSprint();
    assert.strictEqual(stored.elapsedMs, 60000);
    const resumed = RunCore.sprintShow(stored, 500000);          // shownAt = now - elapsed
    const picked = RunCore.sprintChoose(resumed, 1, 500000 + 2000 - resumed.shownAt);
    assert.strictEqual(picked.pending.ms, 62000, 'time on the question includes the 60 s before the reload');
    assert.strictEqual(T2.saveRun(picked).status, 'saved');
    // Mock: the clock saved on hide is kept too.
    const M1 = newTab();
    M1.load();
    const mock = M1.setSprint(mockSlot('4m')).sprint;
    const hid = RunCore.mockVisibility(RunCore.mockResume(mock, 5000), false, 14000);   // 9 s, then hidden
    assert.strictEqual(hid.spent[0], 9000);
    assert.strictEqual(M1.saveRun(hid).slot.spent[0], 9000);
    const M2 = newTab();
    M2.claimTab();
    assert.strictEqual(M2.getSprint().spent[0], 9000, 'the reloaded mock still has the 9 s');
  }

  // 5. A re-pick is never lost to a remount: pick 1, re-pick 4, leave and open Sprint again
  // (a new Store view of the same page), pick 2 → the stored pick is 2.
  {
    ls.clear();
    const T = newTab();
    T.load();
    const made = T.setSprint(sprintSlot('5')).sprint;
    const picked = T.saveRun(RunCore.sprintChoose(RunCore.sprintShow(made, 1000), 1, 3000));
    const repicked = T.saveRun(RunCore.sprintRepick(picked.slot, 4));
    assert.strictEqual(repicked.status, 'saved');
    assert.strictEqual(T.getSprint().pending.chosen, 4);
    T.resetCache();                                              // leave the screen, open it again
    const remounted = T.getSprint();
    assert.deepStrictEqual(remounted.pending, { chosen: 4, ms: 3000 }, 'the newest pick is what a remount reads');
    const again = T.saveRun(RunCore.sprintRepick(remounted, 2));
    assert.deepStrictEqual([again.status, again.slot.pending.chosen], ['saved', 2]);
    T.resetCache();
    assert.strictEqual(T.getSprint().pending.chosen, 2, 'stored pick is 2');
  }

  // 6. A sprint cannot be finished from a rejected save. B re-picks 4 on the last question; A,
  // which still holds pick 1, is refused (it is no longer the writer); only the stored run, once
  // it is really finished, can be recorded, and it carries the pick that was stored.
  {
    ls.clear();
    const A = newTab();
    const B = newTab();
    A.load();
    const made = A.setSprint({ ...sprintSlot('6'), qs: [16] }).sprint;
    const picked = A.saveRun(RunCore.sprintChoose(RunCore.sprintShow(made, 1000), 3, 2000));
    const copyB = B.getSprint();                      // B has seen A's pick (pending 3, revision 1)
    B.claimTab();
    const rePickB = B.saveRun(RunCore.sprintRepick(copyB, 4));
    assert.deepStrictEqual([rePickB.status, rePickB.slot.rev, rePickB.slot.pending.chosen], ['saved', 2, 4]);
    // A re-picks 1 and rates it. It is no longer the writer: refused, nothing is stored as 1.
    const ratedA = RunCore.sprintRate(RunCore.sprintRepick(picked.slot, 1), { num: 16, answer: 1 }, true, 'T');
    assert.strictEqual(A.saveRun(ratedA).status, 'inactive');
    // Even if A claimed again without adopting, its revision is behind: stale, still nothing stored.
    A.claimTab();
    assert.strictEqual(A.saveRun(ratedA).status, 'stale');
    assert.strictEqual(RunCore.sprintDoneRun(A.getSprint(), made.id), null, 'the stored run is not finished');
    assert.strictEqual(A.getSprint().pending.chosen, 4);
    B.claimTab();
    const ratedB = B.saveRun(RunCore.sprintRate(rePickB.slot, { num: 16, answer: 4 }, true, 'T'));
    assert.strictEqual(ratedB.status, 'saved');
    const done = RunCore.sprintDoneRun(A.getSprint(), made.id);   // whichever tab finishes reads the stored run
    assert.strictEqual(done.answers[0].chosen, 4, 'the finished run holds the stored pick');
    assert.strictEqual(RunCore.sprintDoneRun(done, 'other'), null, 'another run id is never taken');
    assert.strictEqual(RunCore.sprintDoneRun(null, made.id), null);
  }

  // 7. Saved study time never goes backwards across tabs (hidden tab B: 1 s; A went on to 11 s).
  {
    const { A, B, base } = setup(mockSlot('7'));
    const first = A.saveRun({ ...base, answers: [ans(16, 1), null, null], spent: [1000, 0, 0] });
    const copyB = B.getSprint();
    const aLater = A.saveRun({ ...first.slot, spent: [11000, 0, 0] });
    assert.strictEqual(aLater.slot.spent[0], 11000);
    assert.strictEqual(B.saveRun({ ...copyB, spent: [1000, 0, 0] }).status, 'inactive', 'B is not the writer');
    B.claimTab();
    const bLater = B.saveRun({ ...copyB, spent: [1000, 0, 0] });   // a claim without adopting: same revision
    assert.strictEqual(bLater.status, 'saved');
    assert.strictEqual(bLater.slot.spent[0], 11000, 'not rolled back to 1000');
  }

  // 8. No storage at all: the tab is its own writer and the run lives in memory (as before).
  {
    global.window.localStorage = null;
    global.localStorage = undefined;
    const S = newTab();
    S.load();
    assert.strictEqual(S.claimTab(), false);
    assert.strictEqual(S.isActiveTab(), true);
    const made = S.setSprint(mockSlot('8')).sprint;
    assert.strictEqual(S.saveRun({ ...made, answers: [ans(16, 1), null, null] }).status, 'saved');
    assert.strictEqual(S.isPersistent(), false);
    global.window.localStorage = ls;
    global.localStorage = ls;
  }

  // 9. A claim that cannot be written. While a readable key names another tab, this tab stays
  // read-only: it can neither save the run nor finish it, and the shared run is left alone. Only
  // when nobody is named (key removed or unreadable) does it work on its own.
  {
    ls.clear();
    const A = newTab();
    const B = newTab();
    A.load();
    const made = A.setSprint(mockSlot('9')).sprint;           // A owns the run (and the key)
    const copyB = B.getSprint();
    const realSet = ls.setItem;
    ls.setItem = (k, v) => { if (k === B.ACTIVE_KEY) throw new Error('quota'); realSet(k, v); };
    assert.strictEqual(B.claimTab(), false);
    ls.setItem = realSet;
    assert.strictEqual(B.isActiveTab(), false, 'the key still names A');
    assert.ok(A.isActiveTab());
    const before = ls.getItem('topik2.v2');
    assert.strictEqual(B.saveRun({ ...copyB, answers: [ans(16, 1), null, null] }).status, 'inactive');
    assert.strictEqual(ls.getItem('topik2.v2'), before, 'B wrote nothing');
    assert.strictEqual(A.saveRun({ ...made, answers: [ans(16, 2), null, null] }).status, 'saved', 'A is still the writer');
    // Nobody named: the tab is on its own again.
    ls.removeItem(B.ACTIVE_KEY);
    assert.ok(B.isActiveTab());
    ls.setItem(B.ACTIVE_KEY, '{not json');
    assert.ok(B.isActiveTab());
    ls.removeItem(B.ACTIVE_KEY);
  }

  // 10. A handoff brings the clock up to date even when the revisions are equal. B holds an older
  // snapshot (read-only, clock stopped); A saved more time only (same revision). B takes over: the
  // time before the handoff and the visible time after it both count.
  {
    // Sprint: B's snapshot says 10 s on the question, A saved 70 s.
    ls.clear();
    let A = newTab();
    let B = newTab();
    A.load();
    const made = A.setSprint(sprintSlot('10')).sprint;
    const copyB = RunCore.sprintPause(RunCore.sprintShow(B.getSprint(), 1000), 10000);
    assert.strictEqual(copyB.elapsedMs, 10000);
    assert.strictEqual(A.saveRun(RunCore.sprintPause(RunCore.sprintShow(made, 1000), 70000)).status, 'saved');
    B.claimTab();
    const out = RunCore.claimOutcome(copyB, B.getSprint());
    assert.strictEqual(out.kind, 'keep');
    assert.strictEqual(out.slot.elapsedMs, 70000, 'the larger stored time');
    const resumed = RunCore.sprintShow(out.slot, 500000);
    const picked = RunCore.sprintChoose(resumed, 1, 500000 + 3000 - resumed.shownAt);
    assert.strictEqual(picked.pending.ms, 73000, '70 s before the handoff + 3 s after (not 13 s)');
    // A snapshot that is AHEAD keeps its own time.
    assert.strictEqual(RunCore.claimOutcome({ ...copyB, elapsedMs: 90000 }, B.getSprint()).slot.elapsedMs, 90000);

    // Mock: B's snapshot says 6 s on Q1, A's periodic save said 7 s.
    ls.clear();
    A = newTab();
    B = newTab();
    A.load();
    const mock = A.setSprint(mockSlot('10m')).sprint;
    const mockB = { ...B.getSprint(), spent: [6000, 0, 0], shownAt: null };
    assert.strictEqual(A.saveRun({ ...mock, spent: [7000, 0, 0] }).status, 'saved');
    B.claimTab();
    const m = RunCore.claimOutcome(mockB, B.getSprint());
    assert.strictEqual(m.kind, 'keep');
    assert.deepStrictEqual(m.slot.spent, [7000, 0, 0]);
    const live = RunCore.mockVisibility(m.slot, true, 9000);            // the question clock restarts here
    const answered = RunCore.mockAnswer(live, 1, { num: 16, answer: 1 }, 9500);
    assert.strictEqual(answered.answers[0].ms, 7500, '7 s before + 0.5 s after (not 6.5 s)');
    // Another run, or another position, is not a clock matter.
    assert.strictEqual(RunCore.syncClock(mockB, { ...B.getSprint(), id: 'other' }), mockB);
  }
} finally {
  global.window.localStorage = prevWindowLS;
  global.localStorage = prevGlobalLS;
}
