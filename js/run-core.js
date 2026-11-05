// run-core.js — pure slot logic for the question runner (Sprint + Mock). No DOM.
// Every function returns a new slot (or the same one when the step is not allowed).
//   Sprint slot: { id, qs, idx, answers[], startedAt, shownAt, elapsedMs, pending }
//     answers.length === idx; pending = an answer picked, confidence not yet given.
//   Mock slot:   { id, mode:'mock', qs, idx, answers[answer|null per q], spent[ms per q],
//     startedAt, deadline, shownAt }. The countdown is wall-clock (no pause); time
//     only counts toward a question while it is on screen (shownAt set).
// record(run, deps) stores a finished run exactly once: attempts, session, deck seeds.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Session = root.Session || require('./session.js');
  const PACE = root.PACE || require('./pace.js');

  const MOCK_MS = 70 * 60 * 1000;

  // ── Revision (see js/store.js saveRun) ──

  // Revision of an open run; a run that never changed has no "rev" field and reads as 0.
  function revOf(slot) {
    return slot && Number.isInteger(slot.rev) && slot.rev > 0 ? slot.rev : 0;
  }

  // What a tab does with its own copy when it claims the writer role and re-reads the stored run:
  //   { kind: 'adopt', slot }  the stored revision differs (another tab went on): show the stored run
  //   { kind: 'keep', slot }   same revision: carry on with this tab's copy, its clock totals brought
  //                            up to the stored ones (see syncClock)
  //   { kind: 'gone' }         no stored run: it was finished or discarded in the other tab
  //   { kind: 'other' }        a different run is stored now
  function claimOutcome(mine, stored) {
    if (!stored) return { kind: 'gone' };
    if (!mine || stored.id !== mine.id) return { kind: 'other' };
    return revOf(stored) !== revOf(mine) ? { kind: 'adopt', slot: stored } : { kind: 'keep', slot: syncClock(mine, stored) };
  }

  // Same revision, so the content is the same, but the tab that was writing may have saved more time
  // since this copy was taken (its pause, its periodic save). Take the larger clock totals, never
  // less: sprint elapsed time on the open question, mock time per question. The question clock then
  // restarts from these totals, so time before the handoff and visible time after it both count.
  function syncClock(mine, stored) {
    if (!mine || !stored || stored.id !== mine.id) return mine;
    const next = { ...mine };
    if (Array.isArray(mine.spent) && Array.isArray(stored.spent)) {
      next.spent = mine.spent.map((ms, i) => Math.max(ms, stored.spent[i] || 0));
    }
    if (Number.isFinite(mine.elapsedMs) && Number.isFinite(stored.elapsedMs)) {
      next.elapsedMs = Math.max(mine.elapsedMs, stored.elapsedMs);
    }
    return next;
  }

  // The stored sprint, when it is the run with this id and every question is answered; else null.
  // A sprint is finished from this and nothing else, so a save that was refused can never end up
  // in the record.
  function sprintDoneRun(stored, id) {
    return stored && stored.id === id && stored.idx >= stored.qs.length ? stored : null;
  }

  // The stored mock slot with this tab's clock folded in (time only grows; mine is already folded
  // and suspended, so no question clock is running), or this tab's own copy when nothing is stored
  // under the id. A mock is finished from this.
  function mockFinalSlot(stored, mine) {
    return stored && stored.id === mine.id ? { ...accepted(stored, mine), shownAt: null } : mine;
  }

  // This tab's slot after a save came back as stored: keep the tab's own (possibly newer) content,
  // take the stored revision, and let per-question time (mock) only grow. Another run: unchanged.
  function accepted(current, saved) {
    if (!saved || !current || saved.id !== current.id) return current;
    const next = { ...current };
    const rev = Math.max(revOf(current), revOf(saved));
    if (rev > 0) next.rev = rev; else delete next.rev;
    if (Array.isArray(current.spent) && Array.isArray(saved.spent)) {
      next.spent = current.spent.map((ms, i) => Math.max(ms, saved.spent[i] || 0));
    }
    return next;
  }

  // ── Sprint ──

  // What #/sprint should do with the stored slot and retry list.
  // An in-progress run always wins; an ignored or empty retry list is cleared.
  function sprintStart(existing, wantsRetry, retryQs) {
    const hasRetry = Array.isArray(retryQs) && retryQs.length > 0;
    if (existing && existing.mode === 'mock') return { kind: 'mock', clearRetry: wantsRetry && hasRetry };
    if (existing) return { kind: 'resume', slot: existing, clearRetry: wantsRetry && hasRetry };
    if (wantsRetry) {
      return hasRetry ? { kind: 'new', qs: retryQs.slice(), clearRetry: true } : { kind: 'nothing', clearRetry: true };
    }
    return { kind: 'pick', clearRetry: false };
  }

  function isSprintDone(slot) {
    return slot.idx >= slot.qs.length;
  }

  // Shown again (fresh or after a pause): the clock continues from elapsedMs.
  function sprintShow(slot, nowMs) {
    return { ...slot, shownAt: nowMs - slot.elapsedMs };
  }

  function sprintPause(slot, ms) {
    return { ...slot, elapsedMs: ms, shownAt: null };
  }

  // Pick an answer; a second pick (or a pick after the last question) is ignored.
  function sprintChoose(slot, chosen, ms) {
    if (slot.pending || isSprintDone(slot)) return slot;
    return { ...slot, pending: { chosen, ms }, elapsedMs: 0, shownAt: null };
  }

  // A different choice before 확실/애매 replaces the pending pick (Fathul, 2026-10-29).
  // The time stays the first pick's: the clock stopped there. Ignored without a pick.
  function sprintRepick(slot, chosen) {
    if (!slot.pending || isSprintDone(slot) || slot.pending.chosen === chosen) return slot;
    return { ...slot, pending: { ...slot.pending, chosen } };
  }

  // Confidence for the pending pick → answer stored, next question. Ignored without a pick.
  function sprintRate(slot, lesson, sure, atIso) {
    if (!slot.pending || isSprintDone(slot)) return slot;
    const { chosen, ms } = slot.pending;
    const answer = { q: lesson.num, chosen, correct: chosen === lesson.answer, sure, ms, at: atIso };
    return { ...slot, answers: [...slot.answers, answer], idx: slot.idx + 1, pending: null, elapsedMs: 0, shownAt: null };
  }

  // ── Mock ──

  // Exam order, minus the questions whose passage the exam paper withholds.
  function mockQuestions(lessons) {
    return Object.values(lessons || {})
      .filter(l => l && Number.isInteger(l.num) && !Session.isWithheld(l))
      .map(l => l.num)
      .sort((a, b) => a - b);
  }

  function mockCreate(qs, nowMs, rng) {
    const base = Session.createSlot(qs, nowMs, rng);
    return {
      id: base.id, mode: 'mock', qs: base.qs, idx: 0,
      answers: base.qs.map(() => null), spent: base.qs.map(() => 0),
      startedAt: base.startedAt, deadline: base.startedAt + MOCK_MS, shownAt: base.startedAt
    };
  }

  function mockRemaining(slot, nowMs) {
    return Math.max(0, slot.deadline - nowMs);
  }

  function mockTimeUp(slot, nowMs) {
    return nowMs >= slot.deadline;
  }

  // Add the on-screen time since shownAt to the open question (never past the deadline).
  function mockFold(slot, nowMs) {
    if (slot.shownAt == null) return slot;
    const dt = Math.max(0, Math.min(nowMs, slot.deadline) - slot.shownAt);
    return { ...slot, spent: slot.spent.map((ms, i) => (i === slot.idx ? ms + dt : ms)), shownAt: nowMs };
  }

  // Off screen (left the mock): fold the time, stop counting it toward the question.
  function mockSuspend(slot, nowMs) {
    return { ...mockFold(slot, nowMs), shownAt: null };
  }

  // Back on screen (mount / reload): time spent away is not charged to the question.
  function mockResume(slot, nowMs) {
    return { ...slot, shownAt: nowMs };
  }

  // The tab went hidden or came back. Hidden: fold and stop the question's clock; visible: start
  // it again. The 70-minute deadline is wall clock and never moves. Already in that state: unchanged.
  function mockVisibility(slot, visible, nowMs) {
    if (visible) return slot.shownAt == null ? mockResume(slot, nowMs) : slot;
    return slot.shownAt == null ? slot : mockSuspend(slot, nowMs);
  }

  function mockJump(slot, pos, nowMs) {
    if (!Number.isInteger(pos) || pos < 0 || pos >= slot.qs.length || pos === slot.idx) return slot;
    return { ...mockFold(slot, nowMs), idx: pos };
  }

  // Answer (or change the answer to) the open question. Same pick again or time up → unchanged.
  function mockAnswer(slot, chosen, lesson, nowMs) {
    const current = slot.answers[slot.idx];
    if (mockTimeUp(slot, nowMs) || (current && current.chosen === chosen)) return slot;
    const folded = mockFold(slot, nowMs);
    const answer = {
      q: lesson.num, chosen, correct: chosen === lesson.answer, sure: null,
      ms: folded.spent[slot.idx], at: new Date(nowMs).toISOString()
    };
    return { ...folded, answers: folded.answers.map((a, i) => (i === slot.idx ? answer : a)) };
  }

  function mockNext(slot) {
    return slot.idx + 1 < slot.qs.length ? slot.idx + 1 : null;
  }

  function mockAnsweredCount(slot) {
    return slot.answers.filter(Boolean).length;
  }

  function mockPalette(slot) {
    return slot.qs.map((q, pos) => ({ pos, q, answered: !!slot.answers[pos], current: pos === slot.idx }));
  }

  // Answered questions in exam order; ms = all the time spent on that question.
  function mockResults(slot) {
    return slot.answers
      .map((a, pos) => (a ? { ...a, ms: slot.spent[pos] } : null))
      .filter(Boolean);
  }

  // Countdown text "69:12": rounds up, so it reads 00:00 only when time is really up.
  function fmtCountdown(ms) {
    const total = Math.ceil(Math.max(0, ms) / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  // ── Finish ──

  // run = { id, mode, qs, answers, at, total?, durationMs? }
  function summaryOf(run, lessonOf) {
    const answers = run.answers;
    const over = a => {
      const l = lessonOf(a.q);
      return Number.isFinite(a.ms) && PACE.isOver(a.ms, l ? l.section : null);
    };
    return {
      id: run.id,
      at: run.at,
      mode: run.mode,
      qs: run.qs.slice(),
      right: answers.filter(a => a.correct).length,
      total: Number.isInteger(run.total) ? run.total : answers.length,
      overtimeCount: answers.filter(over).length,
      durationMs: Number.isFinite(run.durationMs) ? run.durationMs : answers.reduce((s, a) => s + (a.ms || 0), 0)
    };
  }

  // Idempotent: a run whose attempts are already stored is not written twice.
  // A finished session id is final: a second tab finishing the same run later (even one that had
  // no answers the first time) changes nothing, so Review and the saved session always agree.
  // Wrong or unsure answers seed their vocab + first grammar point into the deck.
  // Returns the review route for the run.
  function record(run, deps) {
    const { Store, SRS, lessons } = deps;
    const route = '#/review/' + run.id;
    if (Store.sessionById(run.id)) {
      Store.clearSprint(run.id);
      return route;
    }
    const recorded = Store.get().attempts.some(a => a.sessionId === run.id);
    if (!recorded) Store.recordAttempts(run.answers.map(a => ({ ...a, mode: run.mode, sessionId: run.id })));
    Store.recordSession(summaryOf(run, q => (lessons && lessons['Q' + q]) || null));
    const keys = Session.deckKeys(run.answers, lessons, SRS.keyOf);
    if (keys.length) SRS.seedMany(keys);
    Store.clearSprint(run.id);
    return route;
  }

  const RunCore = {
    MOCK_MS, revOf, accepted, claimOutcome, syncClock, sprintDoneRun, mockFinalSlot,
    sprintStart, isSprintDone, sprintShow, sprintPause, sprintChoose, sprintRepick, sprintRate,
    mockQuestions, mockCreate, mockRemaining, mockTimeUp, mockFold, mockSuspend, mockResume, mockVisibility,
    mockJump, mockAnswer, mockNext, mockAnsweredCount, mockPalette, mockResults, fmtCountdown,
    summaryOf, record
  };

  if (typeof window !== 'undefined') window.RunCore = RunCore;
  if (typeof module !== 'undefined') module.exports = RunCore;
})();
