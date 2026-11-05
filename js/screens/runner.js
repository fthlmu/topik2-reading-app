// runner.js: the DOM side of the question runner shared by Sprint and Mock.
// Pure slot steps live in js/run-core.js; each screen keeps its own small
// state machine and calls these pieces:
//   bodyHtml(lesson, { glossOn }) the question sheet: ※ instruction + question line + passage +
//                               choices, Korean on screen; with glossOn the passage carries word
//                               and sentence hooks for the English layer (js/translate.js decides)
//   refreshPassage(root, lesson, glossOn)  redraw only the passage after the 주석 toggle
//   markChoices(root, n, lock)  mark the pick's row (lock = sprint, unlocked = mock)
//   runHead(o)                  the sticky test bar (title, n / N 풀었음, timer) + progress track
//   setCount(root, runId, done, total)  update the bar's count and the track after a pick
//   tilesHtml(o)                one numbered tile per question: your picks tinted, no grading
//   ticker(fn)                  the 250 ms clock
//   listen(root, handlers)      click + visibility + pagehide, returns detach()
//   persist(slot)               synchronous save (only the active tab writes) →
//                               { status: saved | inactive | stale | gone, slot }
//   noticeHtml()                the read-only notice: 다른 탭에서 진행 중입니다 + 여기서 계속
//   finish(run)                 record once (RunCore.record), then open Review
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, circled } = Util;

  const TICK_MS = 250;
  const ADVANCE_MS = 350;

  // The track's last width per run, so a redrawn bar eases from where it was.
  let lastTrack = { id: null, frac: 0 };

  function reducedMotion() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function advanceDelay() {
    return reducedMotion() ? 0 : ADVANCE_MS;
  }

  function T() {
    return (typeof window !== 'undefined' && window.Tiles) || require('../render/tiles.js');
  }

  // Sprint and mock never carry the editor's notes (showNote false): some name the answer.
  function passageHtml(lesson, glossOn) {
    return window.Passage.renderFull(lesson, { glossOn: !!glossOn, showNote: false });
  }

  function bodyHtml(lesson, opts) {
    const glossOn = !!(opts && opts.glossOn);
    return '<section class="sheet qsheet" aria-label="문제">' + window.Passage.instruction(lesson) +
      T().questionLine(lesson, { level: 1 }) +
      '<section class="sprint__passage" aria-label="지문">' + passageHtml(lesson, glossOn) + '</section>' +
      '<section class="sprint__answer" aria-label="선택지">' +
      window.Choices.render(lesson, { variant: 'exam' }) + '</section></section>';
  }

  function refreshPassage(root, lesson, glossOn) {
    const el = root && lesson ? root.querySelector('.sprint__passage') : null;
    if (el) el.innerHTML = passageHtml(lesson, glossOn);
  }

  function glossOn() {
    return !!(window.Translate && window.Translate.isOn());
  }

  function markChoices(root, chosen, lock) {
    const list = root.querySelector('.choices');
    if (list) list.classList.toggle('choices--locked', !!lock);
    root.querySelectorAll('button[data-choice]').forEach(b => {
      const on = Number(b.dataset.choice) === chosen;
      if (lock) b.disabled = true;
      b.classList.toggle('is-picked', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  // ── Test bar ──

  function countHtml(done, total) {
    return '<span class="num">' + done + ' / ' + total + '</span> 풀었음';
  }

  // o = { title, done, total, clockHtml }
  function runHead(o) {
    return '<div class="runhead"><div class="testbar">' +
      '<p class="testbar__title">' + esc(o.title) + '</p>' +
      '<div class="testbar__right"><p class="testbar__count" data-field="count">' + countHtml(o.done, o.total) + '</p>' +
      o.clockHtml + '</div></div>' +
      '<div class="track" aria-hidden="true"><span class="track__fill" data-field="track"></span></div></div>';
  }

  // Draw the bar's width: start from the last width of this run, then ease to the new one.
  function setTrack(root, runId, frac) {
    const fill = root.querySelector('[data-field="track"]');
    if (!fill) return;
    const to = Math.max(0, Math.min(1, frac));
    const from = lastTrack.id === runId ? lastTrack.frac : to;
    lastTrack = { id: runId, frac: to };
    fill.style.setProperty('--p', from.toFixed(4));
    if (from === to) return;
    requestAnimationFrame(() => requestAnimationFrame(() => fill.style.setProperty('--p', to.toFixed(4))));
  }

  function setCount(root, runId, done, total) {
    const el = root.querySelector('[data-field="count"]');
    if (el) el.innerHTML = countHtml(done, total);
    setTrack(root, runId, total ? done / total : 0);
  }

  // ── Run tiles ──

  // o = { label, rows: [{ q, chosen, current, pos? }], cls? }. A row with pos is a button
  // (data-pos) that jumps to that question; without, a read-only tile.
  function tilesHtml(o) {
    const items = o.rows.map(r => {
      const label = esc(r.q + '번 · ' + (Number.isInteger(r.chosen) ? '답 ' + circled(r.chosen) : '답 없음') +
        (r.current ? ' · 지금 문제' : ''));
      const current = r.current ? ' aria-current="step"' : '';
      const base = { n: r.q, state: T().stateOfPick(r.chosen) };
      if (Number.isInteger(r.pos)) {
        return T().tile({ ...base, tag: 'button', attrs: ' type="button" data-pos="' + r.pos + '" aria-label="' + label + '"' + current });
      }
      return T().tile({ ...base, current: r.current, attrs: ' role="img" aria-label="' + label + '"' });
    });
    return T().list({ items, cls: 'run-tiles' + (o.cls ? ' ' + o.cls : ''), attrs: ' aria-label="' + esc(o.label) + '"' });
  }

  function isChoice(lesson, n) {
    return !!lesson && Array.isArray(lesson.choices) && lesson.choices.some(c => c.num === n);
  }

  // 1–4 as a choice number, else null.
  function digit(e) {
    return /^[1-4]$/.test(e.key) ? Number(e.key) : null;
  }

  function ticker(fn) {
    let id = null;
    return {
      start() { clearInterval(id); id = setInterval(fn, TICK_MS); fn(); },
      stop() { clearInterval(id); id = null; }
    };
  }

  // h.gloss runs on the 주석 toggle ('glosschange' on document, detail.on). h.focus is the window
  // focus; h.storage is the 'storage' event (another tab wrote: used to see who is the writer).
  function listen(root, h) {
    if (h.click) root.addEventListener('click', h.click);
    if (h.visibility) document.addEventListener('visibilitychange', h.visibility);
    if (h.pagehide) window.addEventListener('pagehide', h.pagehide);
    if (h.gloss) document.addEventListener('glosschange', h.gloss);
    if (h.focus) window.addEventListener('focus', h.focus);
    if (h.storage) window.addEventListener('storage', h.storage);
    return function detach() {
      if (h.click) root.removeEventListener('click', h.click);
      if (h.visibility) document.removeEventListener('visibilitychange', h.visibility);
      if (h.pagehide) window.removeEventListener('pagehide', h.pagehide);
      if (h.gloss) document.removeEventListener('glosschange', h.gloss);
      if (h.focus) window.removeEventListener('focus', h.focus);
      if (h.storage) window.removeEventListener('storage', h.storage);
    };
  }

  // Revision-checked save of the open run (Store.saveRun, synchronous) → { status, slot }:
  //   saved     written; slot is the stored copy (its revision may have moved on): keep working from it
  //   inactive  another tab is the writer: nothing written; the screen becomes read-only
  //   stale     another tab changed this run since this tab last read it: nothing was written,
  //             slot is the stored run, which the caller adopts and redraws from
  //   gone      no stored run (finished or discarded in another tab) or a different run: nothing is
  //             written, so a finished run is never resurrected
  function persist(slot) {
    return window.Store.saveRun(slot);
  }

  // The one-line notice a read-only tab shows (the pause bar look): another tab is the writer.
  // The button claims the role here (data-act="claim"); the screen re-reads the run and redraws.
  function noticeHtml() {
    return '<div class="pause-bar" role="status" data-notice>' +
      '<p class="pause-bar__text">다른 탭에서 진행 중입니다</p>' +
      '<button type="button" class="btn btn--primary" data-act="claim">여기서 계속</button></div>';
  }

  // Finish a run: record it once (RunCore.record), then open Review. Only the active tab calls this,
  // with the run taken from the stored one. replace(): browser Back from Review must not land on a
  // finished run.
  function finish(run) {
    const deps = { Store: window.Store, SRS: window.SRS, lessons: Util.data().lessons };
    const hash = window.RunCore.record({ at: new Date().toISOString(), ...run }, deps);
    location.replace(hash);
  }

  function emptyHtml() {
    return '<section class="sheet placeholder"><h1 class="screen-title">풀 문제가 없습니다</h1>' +
      '<p class="placeholder__note"><a href="#/today">오늘</a>로 돌아가세요.</p></section>';
  }

  const Runner = {
    TICK_MS, ADVANCE_MS, reducedMotion, advanceDelay, bodyHtml, refreshPassage, glossOn, markChoices,
    runHead, setCount, setTrack, tilesHtml, isChoice, digit, ticker, listen, persist, noticeHtml, finish, emptyHtml
  };

  if (typeof window !== 'undefined') window.Runner = Runner;
  if (typeof module !== 'undefined') module.exports = Runner;
})();
