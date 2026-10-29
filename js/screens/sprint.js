// sprint.js: timed 5-question set (#/sprint, #/sprint/retry). Korean on screen
// (the English layer follows Translate.examOn: on in the Learn phase), no feedback until Review. Per question: pace line drains over the section's
// budget (never auto-advances), answer by click or 1 to 4, then 확실/애매 (S/U,
// Enter/Space = 확실). Esc opens an inline pause bar. The in-progress slot
// lives in Store (sprint) so a refresh resumes; the clock pauses while the tab
// is hidden or the pause bar is open. Slot steps are pure (RunCore); the
// question view, clock, answer strip and finish are shared with Mock (Runner).
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc } = Util;

  const SET_SIZE = 5;

  // { root, slot, lesson, budgetMs, phase: answer|confirm|advancing|done,
  //   shownAt, paused, barOpen, advanceTimer }
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

  // Keep the stored slot in step with the view (never after the sprint is done).
  function persist(slot) {
    if (!view || view.phase === 'done') return;
    R().persist(slot);
    set({ slot });
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
    const slot = window.Session.createSlot(qs, Date.now());
    Store().setSprint(slot);
    return { slot };
  }

  // ── Rendering ──

  function headHtml(slot, lesson, budgetMs) {
    return '<header class="sprint__head">' +
      '<p class="sprint__count">스프린트 <span class="num">' + (slot.idx + 1) + ' / ' + slot.qs.length +
      '</span> · ' + esc(lesson.section) + ' 묶음</p>' +
      '<p class="sprint__clock num" data-field="clock"><span class="sr-only">경과 시간 </span>' +
      '<span data-field="elapsed">0:00</span> / ' + esc(PACE().fmt(budgetMs)) + '</p>' +
      '</header>' +
      '<div class="pace" data-field="pace" aria-hidden="true"><span class="pace__fill"></span></div>';
  }

  const KEYS_HTML = '<span><kbd>1</kbd>–<kbd>4</kbd> 선택</span><span><kbd>S</kbd> 확실</span>' +
    '<span><kbd>U</kbd> 애매</span><span><kbd>G</kbd> 주석</span><span><kbd>T</kbd> 번역</span><span><kbd>Tab</kbd> 문장</span><span><kbd>←</kbd><kbd>→</kbd> 단어</span>' +
    '<span><kbd>Esc</kbd> 멈춤</span>';

  // Answered questions and the pick waiting for 확실/애매 are filled.
  function chosenAt(slot, i) {
    if (i < slot.answers.length) return slot.answers[i].chosen;
    return i === slot.idx && slot.pending ? slot.pending.chosen : null;
  }

  function stripHtml(slot) {
    return R().answerStrip({
      label: '스프린트 · ' + slot.qs.length + '문제',
      rows: slot.qs.map((q, i) => ({ q, chosen: chosenAt(slot, i), current: i === slot.idx })),
      keys: KEYS_HTML
    });
  }

  // The dock must stay a direct child of the article, or it cannot stick.
  function drawStrip() {
    const dock = el('.omr-dock');
    if (dock) dock.outerHTML = stripHtml(view.slot);
  }

  function questionHtml(slot, lesson, budgetMs) {
    return '<article class="sprint" tabindex="-1" aria-label="스프린트 문제 ' + (slot.idx + 1) + '">' +
      headHtml(slot, lesson, budgetMs) +
      '<div data-slot="bar"></div>' + R().bodyHtml(lesson, { glossOn: R().glossOn() }) +
      '<div data-slot="confirm"></div>' + stripHtml(slot) + '</article>';
  }

  function confirmHtml() {
    return '<div class="confidence" role="group" aria-label="얼마나 확실한가요">' +
      '<p class="confidence__q">얼마나 확실해요?</p>' +
      '<button type="button" class="btn" data-sure="1" aria-keyshortcuts="S">확실해요 <kbd>S</kbd></button>' +
      '<button type="button" class="btn" data-sure="0" aria-keyshortcuts="U">애매해요 <kbd>U</kbd></button>' +
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
    const over = ms > view.budgetMs;
    const left = Math.max(0, 1 - ms / view.budgetMs);
    const line = el('[data-field="pace"]');
    el('[data-field="elapsed"]').textContent = PACE().fmt(ms);
    el('[data-field="clock"]').classList.toggle('is-over', over);
    line.classList.toggle('is-over', over);
    line.style.setProperty('--pace-left', left.toFixed(4));
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
    if (!view || view.phase !== 'answer' || !view.paused || view.barOpen) return;
    const slot = Core().sprintShow(view.slot, Date.now());
    set({ paused: false, shownAt: slot.shownAt });
    persist(slot);
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
    window.scrollTo(0, 0);
    el('.sprint').focus({ preventScroll: true });
    if (slot.pending) {
      drawClock(slot.pending.ms);
      R().markChoices(view.root, slot.pending.chosen, true);
      showConfirm();
      return;
    }
    persist(shown);
    clock.start();
    // The tab went hidden during the 350 ms hand-over: start this question paused.
    if (document.hidden) pause();
  }

  function choose(n) {
    if (!view || view.phase !== 'answer' || view.paused) return;
    if (!R().isChoice(view.lesson, n)) return;
    const ms = elapsed();
    clock.stop();
    drawClock(ms);
    set({ phase: 'confirm' });
    persist(Core().sprintChoose(view.slot, n, ms));
    R().markChoices(view.root, n, true);
    drawStrip();
    showConfirm();
  }

  function rate(sure) {
    if (!view || view.phase !== 'confirm') return;
    set({ phase: 'advancing' });
    persist(Core().sprintRate(view.slot, view.lesson, sure, new Date().toISOString()));
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

  function finish() {
    const slot = view.slot;
    clock.stop();
    set({ phase: 'done' });
    R().finish({ id: slot.id, mode: 'sprint', qs: slot.qs, answers: slot.answers });
  }

  // ── Pause bar ──

  function openBar() {
    if (view.barOpen || view.phase === 'advancing') return;
    pause();
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
    const choice = e.target.closest('button[data-choice]');
    if (choice) { choose(Number(choice.dataset.choice)); return; }
    const sure = e.target.closest('button[data-sure]');
    if (sure) { rate(sure.dataset.sure === '1'); return; }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'resume') closeBar();
    else if (act.dataset.act === 'leave') location.hash = '#/today';
  }

  function onVisibility() {
    if (!view) return;
    if (document.hidden) pause();
    else resume();
  }

  function onPageHide() {
    pause();
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
    if (view.phase === 'answer' && n) { choose(n); return true; }
    if (view.phase === 'confirm') return confirmKey(e);
    return false;
  }

  // ── Screen API ──

  function mount(root, params) {
    const start = startSlot(params);
    if (start.redirect) { view = null; location.replace(start.redirect); return; }
    if (!start.slot) { root.innerHTML = R().emptyHtml(); view = null; return; }
    view = { root, slot: start.slot, phase: 'answer', paused: false, barOpen: false, advanceTimer: null };
    clock = R().ticker(tick);
    detach = R().listen(root, { click: onClick, visibility: onVisibility, pagehide: onPageHide, gloss: onGloss });
    if (Core().isSprintDone(start.slot)) finish();
    else showQuestion();
  }

  function unmount() {
    if (!view) return;
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
