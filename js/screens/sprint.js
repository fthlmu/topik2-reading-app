// sprint.js: timed 5-question set (#/sprint, #/sprint/retry). Korean on screen
// (the English layer follows Translate.examOn: on in the Learn phase), no feedback until Review.
// Test bar: n / N 풀었음 + the timer chip (time on this question / the section's pace budget,
// red once over; never auto-advances) + the progress track. Answer by click or 1 to 4, then
// 확실/애매 (S/U, Enter/Space = 확실). Esc opens an inline pause bar. The in-progress slot
// lives in Store (sprint) so a refresh resumes; the clock pauses while the tab
// is hidden or the pause bar is open. Slot steps are pure (RunCore); the
// question sheet, test bar, tiles and finish are shared with Mock (Runner).
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc } = Util;

  const SET_SIZE = 5;

  // { root, slot, lesson, budgetMs, phase: answer|confirm|advancing|done,
  //   shownAt, paused, barOpen, advanceTimer, readOnly, leaving }
  let view = null;
  let clock = null;
  let detach = null;

  const Store = () => window.Store;
  const PACE = () => window.PACE;
  const Core = () => window.RunCore;
  const R = () => window.Runner;

  function set(patch) {
    view = { ...view, ...patch };
  }

  function el(sel) {
    return view.root.querySelector(sel);
  }

  // One active tab writes the run (Store: the last tab that claimed the role). Keep the stored slot
  // in step with the view, synchronously (never after the sprint is done). true = saved. false = not
  // saved, and the screen has already reacted: another tab is the writer (this tab turns read-only),
  // or it changed the run (this tab adopts the stored run). The caller then stops.
  function persist(slot) {
    if (!view || view.phase === 'done') return true;
    const res = R().persist(slot);
    if (res.status === 'inactive' || res.status === 'stale') {
      if (view.leaving) return false;   // leaving the screen: leave the stored run alone, redraw nothing
      if (res.status === 'inactive') enterReadOnly(); else adopt(res.slot);
      return false;
    }
    set({ slot: res.status === 'saved' ? res.slot : slot });
    return true;
  }

  // May this tab act on the run? Only the active tab. Otherwise the screen goes read-only, and the
  // action is dropped. (Already read-only but the role is ours again: take over, then drop it.)
  function guard() {
    if (!Store().isActiveTab()) { enterReadOnly(); return false; }
    if (view.readOnly) { claimHere(); return false; }
    return true;
  }

  // Another tab is the writer: stop this tab's clock, ignore actions, say so. The open question's
  // elapsed time is kept in memory only (nothing is saved from here).
  function enterReadOnly() {
    if (!view || view.phase === 'done' || view.readOnly) return;
    clearTimeout(view.advanceTimer);
    clock.stop();
    const open = view.phase === 'answer';
    const slot = open && !view.paused ? Core().sprintPause(view.slot, elapsed()) : view.slot;
    set({ readOnly: true, paused: open || view.paused, slot, advanceTimer: null });
    const box = el('[data-slot="notice"]');
    if (box) box.innerHTML = R().noticeHtml();
  }

  // Become the writer (focus, tab visible, 여기서 계속): re-read the stored run first. Newer → show
  // it; finished or replaced elsewhere → leave; same → carry on, the clock running again.
  function claimHere() {
    if (!view || view.phase === 'done') return;
    const stored = Store().getSprint();
    Store().claimTab();
    // A claim that could not be written leaves another tab named: stay read-only.
    if (!Store().isActiveTab()) { enterReadOnly(); return; }
    const out = Core().claimOutcome(view.slot, stored);
    if (out.kind === 'gone' || out.kind === 'other') { leaveRun(); return; }
    if (out.kind === 'adopt') { adopt(out.slot); return; }
    // Same revision: keep this copy, with the time the other tab saved since (never less).
    set({ slot: out.slot });
    if (!view.readOnly) return;
    set({ readOnly: false });
    el('[data-slot="notice"]').innerHTML = '';
    if (view.phase === 'advancing') advance();
    else resume();
  }

  // The run is no longer stored: another tab finished it (open its Review) or dropped it.
  function leaveRun() {
    const done = Store().sessionById(view.slot.id);
    clock.stop();
    clearTimeout(view.advanceTimer);
    set({ phase: 'done' });
    location.replace(done ? '#/review/' + done.id : '#/today');
  }

  // The stored run is newer than this tab's copy (a stale tab came back): show it, not ours.
  function adopt(stored) {
    clearTimeout(view.advanceTimer);
    clock.stop();
    set({ slot: stored, advanceTimer: null, readOnly: false });
    if (Core().isSprintDone(stored)) finish();
    else showQuestion();
  }

  // ── Slot lifecycle ──

  // → { slot } | { redirect } | {} (nothing to run)
  function startSlot(params) {
    const wantsRetry = !!params && params.arg === 'retry';
    const d = Core().sprintStart(Store().getSprint(), wantsRetry, Store().get().retryQs);
    if (d.clearRetry) Store().setRetry(null);
    if (d.kind === 'resume') return { slot: d.slot };
    if (d.kind === 'mock') return { redirect: '#/mock/run' };
    if (d.kind === 'nothing') return { redirect: '#/today' };
    const qs = d.kind === 'new'
      ? d.qs
      : window.Session.pick(SET_SIZE, window.Session.contextOf(Store().get(), Util.data()));
    if (!qs.length) return {};
    const slot = Store().setSprint(window.Session.createSlot(qs, Date.now())).sprint;
    return { slot };
  }

  // ── Rendering ──

  // Answered questions and the pick waiting for 확실/애매 count as picked.
  function chosenAt(slot, i) {
    if (i < slot.answers.length) return slot.answers[i].chosen;
    return i === slot.idx && slot.pending ? slot.pending.chosen : null;
  }

  function pickedCount(slot) {
    return slot.qs.filter((_, i) => Number.isInteger(chosenAt(slot, i))).length;
  }

  // Test bar: title, n / N 풀었음, and the timer chip (time on this question / its pace budget;
  // it turns red when the question goes over pace).
  function headHtml(slot, budgetMs) {
    const clock = '<p class="timer" data-field="clock"><span class="sr-only">경과 시간 </span>' +
      '<span class="num" data-field="elapsed">0:00</span><span class="timer__of num"> / ' +
      esc(PACE().fmt(budgetMs)) + '</span></p>';
    return R().runHead({ title: '스프린트', done: pickedCount(slot), total: slot.qs.length, clockHtml: clock });
  }

  function stripHtml(slot) {
    return R().tilesHtml({
      label: '스프린트 · ' + slot.qs.length + '문제',
      rows: slot.qs.map((q, i) => ({ q, chosen: chosenAt(slot, i), current: i === slot.idx }))
    });
  }

  function drawStrip() {
    const tiles = el('.run-tiles');
    if (tiles) tiles.outerHTML = stripHtml(view.slot);
    R().setCount(view.root, view.slot.id, pickedCount(view.slot), view.slot.qs.length);
  }

  function questionHtml(slot, lesson, budgetMs) {
    return '<article class="sprint" tabindex="-1" aria-label="스프린트 문제 ' + (slot.idx + 1) + '">' +
      headHtml(slot, budgetMs) +
      '<div data-slot="notice"></div><div data-slot="bar"></div>' +
      R().bodyHtml(lesson, { glossOn: R().glossOn() }) +
      '<div data-slot="confirm"></div>' + stripHtml(slot) + '</article>';
  }

  function confirmHtml() {
    return '<div class="sheet confidence" role="group" aria-label="얼마나 확실한가요">' +
      '<p class="confidence__q">얼마나 확실해요?</p>' +
      '<button type="button" class="btn btn--lg" data-sure="1" aria-keyshortcuts="S">확실해요</button>' +
      '<button type="button" class="btn btn--lg" data-sure="0" aria-keyshortcuts="U">애매해요</button>' +
      '</div>';
  }

  function barHtml() {
    return '<div class="pause-bar" role="group" aria-label="스프린트 멈춤">' +
      '<p class="pause-bar__text">스프린트를 멈출까요? 진행 상황은 저장됩니다</p>' +
      '<button type="button" class="btn btn--primary" data-act="resume">계속</button>' +
      '<button type="button" class="btn" data-act="leave">오늘로</button></div>';
  }

  // ── Clock + pace line ──

  function elapsed() {
    return view.paused ? view.slot.elapsedMs : Math.max(0, Date.now() - view.shownAt);
  }

  function drawClock(ms) {
    el('[data-field="elapsed"]').textContent = PACE().fmt(ms);
    el('[data-field="clock"]').classList.toggle('is-over', ms > view.budgetMs);
  }

  function tick() {
    if (view && view.phase === 'answer' && !view.paused) drawClock(elapsed());
  }

  function pause() {
    if (!view || view.phase !== 'answer' || view.paused) return;
    const ms = elapsed();
    clock.stop();
    set({ paused: true });
    persist(Core().sprintPause(view.slot, ms));
  }

  function resume() {
    if (!view || view.phase !== 'answer' || !view.paused || view.barOpen || view.readOnly) return;
    const slot = Core().sprintShow(view.slot, Date.now());
    set({ paused: false, shownAt: slot.shownAt });
    if (!persist(slot)) return;
    clock.start();
  }

  // ── Question flow ──

  function showConfirm() {
    el('[data-slot="confirm"]').innerHTML = confirmHtml();
    el('[data-sure="1"]').focus({ preventScroll: true });
  }

  function showQuestion() {
    const slot = view.slot;
    const lesson = Util.lesson(slot.qs[slot.idx]);
    const budgetMs = PACE().secFor(lesson.section) * 1000;
    const shown = Core().sprintShow(slot, Date.now());
    set({ lesson, budgetMs, shownAt: shown.shownAt, paused: false, barOpen: false, phase: slot.pending ? 'confirm' : 'answer' });
    view.root.innerHTML = questionHtml(slot, lesson, budgetMs);
    R().setTrack(view.root, slot.id, pickedCount(slot) / slot.qs.length);
    window.scrollTo(0, 0);
    el('.sprint').focus({ preventScroll: true });
    if (slot.pending) {
      drawClock(slot.pending.ms);
      R().markChoices(view.root, slot.pending.chosen, false);
      showConfirm();
      return;
    }
    if (!persist(shown)) return;
    clock.start();
    // The tab went hidden during the 350 ms hand-over: start this question paused.
    if (document.hidden) pause();
  }

  // The choices stay open until 확실해요 / 애매해요: a new pick replaces the pending one.
  function choose(n) {
    if (!view || (view.phase !== 'answer' && view.phase !== 'confirm')) return;
    if (!R().isChoice(view.lesson, n)) return;
    if (!guard() || view.paused || view.barOpen) return;
    if (view.phase === 'confirm') { repick(n); return; }
    const ms = elapsed();
    clock.stop();
    drawClock(ms);
    set({ phase: 'confirm' });
    if (!persist(Core().sprintChoose(view.slot, n, ms))) return;
    R().markChoices(view.root, n, false);
    drawStrip();
    showConfirm();
  }

  function repick(n) {
    if (!persist(Core().sprintRepick(view.slot, n))) return;
    R().markChoices(view.root, view.slot.pending.chosen, false);
    drawStrip();
  }

  function rate(sure) {
    if (!view || view.phase !== 'confirm' || !guard()) return;
    set({ phase: 'advancing' });
    R().markChoices(view.root, view.slot.pending.chosen, true);
    if (!persist(Core().sprintRate(view.slot, view.lesson, sure, new Date().toISOString()))) return;
    const btn = el('[data-sure="' + (sure ? 1 : 0) + '"]');
    if (btn) btn.setAttribute('aria-pressed', 'true');
    el('.confidence').querySelectorAll('button').forEach(b => { b.disabled = true; });
    set({ advanceTimer: setTimeout(advance, R().advanceDelay()) });
  }

  function advance() {
    if (!view) return;
    if (Core().isSprintDone(view.slot)) finish();
    else showQuestion();
  }

  // Only the active tab finishes the sprint, and only from the STORED run once every question is
  // answered: a save that was refused can never end up in the record. If the stored run is not
  // finished, show it instead.
  function finish() {
    if (!view || view.phase === 'done' || !guard()) return;
    const stored = Store().getSprint();
    const done = Core().sprintDoneRun(stored, view.slot.id);
    if (!done) {
      if (stored && stored.id === view.slot.id) adopt(stored); else leaveRun();
      return;
    }
    clock.stop();
    set({ phase: 'done' });
    R().finish({ id: done.id, mode: 'sprint', qs: done.qs, answers: done.answers });
  }

  // ── Pause bar ──

  function openBar() {
    if (view.barOpen || view.phase === 'advancing' || view.readOnly) return;
    pause();
    // pause() found a newer stored run, showed it and restarted its clock: pause that one too.
    if (view.phase === 'answer' && !view.paused) pause();
    set({ barOpen: true });
    el('[data-slot="bar"]').innerHTML = barHtml();
    el('[data-act="resume"]').focus();
  }

  function closeBar() {
    set({ barOpen: false });
    el('[data-slot="bar"]').innerHTML = '';
    resume();
    if (view.phase === 'confirm') el('[data-sure="1"]').focus({ preventScroll: true });
    else el('.sprint').focus({ preventScroll: true });
  }

  // ── Events ──

  function onClick(e) {
    if (!view || view.phase === 'done') return;
    if (e.target.closest('[data-act="claim"]')) { claimHere(); return; }
    const choice = e.target.closest('button[data-choice]');
    if (choice) { choose(Number(choice.dataset.choice)); return; }
    const sure = e.target.closest('button[data-sure]');
    if (sure) { rate(sure.dataset.sure === '1'); return; }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'resume') closeBar();
    else if (act.dataset.act === 'leave') location.hash = '#/today';
  }

  // Hidden: the active tab pauses and saves the elapsed time (so a reload keeps it). On return the
  // tab claims the writer role: it re-reads the stored run and shows it if another tab moved on,
  // before anything on screen can be clicked.
  function onVisibility() {
    if (!view || view.phase === 'done') return;
    if (document.hidden) { pause(); return; }
    claimHere();
    if (view && view.phase !== 'done' && !view.readOnly) resume();
  }

  function onPageHide() {
    pause();
  }

  function onFocus() {
    if (view && view.phase !== 'done') claimHere();
  }

  // Another tab wrote the active-tab key: if it is not this tab any more, go read-only.
  function onStorage(e) {
    if (!view || view.phase === 'done') return;
    if (e.key === null || e.key === Store().ACTIVE_KEY) {
      if (!Store().isActiveTab()) enterReadOnly();
    }
  }

  function onGloss(e) {
    if (view && view.lesson && view.phase !== 'done') R().refreshPassage(view.root, view.lesson, e.detail.on);
  }

  // e.code is layout-independent (works while the Korean IME is on).
  function isKey(e, code, latin, hangul) {
    const k = String(e.key).toLowerCase();
    return e.code === code || k === latin || k === hangul;
  }

  function confirmKey(e) {
    if (isKey(e, 'KeyS', 's', 'ㄴ')) { rate(true); return true; }
    if (isKey(e, 'KeyU', 'u', 'ㅕ')) { rate(false); return true; }
    if (e.key !== 'Enter' && e.key !== ' ') return false;
    // Enter/Space on a link, button or other control keeps its own meaning.
    if (Util.isControlTarget(e.target)) return false;
    rate(true);
    return true;
  }

  function onKey(e) {
    if (!view || view.phase === 'done') return false;
    if (view.barOpen) {
      if (e.key === 'Escape') { closeBar(); return true; }
      return /^[1-4]$/.test(e.key);
    }
    if (e.key === 'Escape') { openBar(); return true; }
    const n = R().digit(e);
    if ((view.phase === 'answer' || view.phase === 'confirm') && n) { choose(n); return true; }
    if (view.phase === 'confirm') return confirmKey(e);
    return false;
  }

  // ── Screen API ──

  function mount(root, params) {
    const start = startSlot(params);
    if (start.redirect) { view = null; location.replace(start.redirect); return; }
    if (!start.slot) { root.innerHTML = R().emptyHtml(); view = null; return; }
    view = {
      root, slot: start.slot, phase: 'answer', paused: false, barOpen: false, advanceTimer: null,
      readOnly: false, leaving: false
    };
    clock = R().ticker(tick);
    detach = R().listen(root, {
      click: onClick, visibility: onVisibility, pagehide: onPageHide, focus: onFocus, storage: onStorage,
      gloss: onGloss
    });
    if (Core().isSprintDone(start.slot)) {
      // A finished run that was never recorded (reload at the end): finishing it is this tab's call.
      Store().claimTab();
      finish();
      return;
    }
    showQuestion();
    // Not the writer (another tab claimed since this page loaded): look, do not touch.
    if (!Store().isActiveTab()) enterReadOnly();
  }

  function unmount() {
    if (!view) return;
    set({ leaving: true });
    pause();
    clock.stop();
    clearTimeout(view.advanceTimer);
    if (detach) detach();
    detach = null;
    view = null;
  }

  const SprintScreen = { title: '스프린트', mount, unmount, onKey, SET_SIZE };

  if (typeof window !== 'undefined') window.SprintScreen = SprintScreen;
  if (typeof module !== 'undefined') module.exports = SprintScreen;
})();
