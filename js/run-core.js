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
  // Wrong or unsure answers seed their vocab + first grammar point into the deck.
  // Returns the review route for the run.
  function record(run, deps) {
    const { Store, SRS, lessons } = deps;
    const recorded = Store.get().attempts.some(a => a.sessionId === run.id);
    if (!recorded) Store.recordAttempts(run.answers.map(a => ({ ...a, mode: run.mode, sessionId: run.id })));
    Store.recordSession(summaryOf(run, q => (lessons && lessons['Q' + q]) || null));
    const keys = Session.deckKeys(run.answers, lessons, SRS.keyOf);
    if (keys.length) SRS.seedMany(keys);
    Store.clearSprint(run.id);
    return '#/review/' + run.id;
  }

  const RunCore = {
    MOCK_MS,
    sprintStart, isSprintDone, sprintShow, sprintPause, sprintChoose, sprintRate,
    mockQuestions, mockCreate, mockRemaining, mockTimeUp, mockFold, mockSuspend, mockResume,
    mockJump, mockAnswer, mockNext, mockAnsweredCount, mockPalette, mockResults, fmtCountdown,
    summaryOf, record
  };

  if (typeof window !== 'undefined') window.RunCore = RunCore;
  if (typeof module !== 'undefined') module.exports = RunCore;
})();
