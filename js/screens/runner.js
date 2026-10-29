// runner.js: the DOM side of the question runner shared by Sprint and Mock.
// Pure slot steps live in js/run-core.js; each screen keeps its own small
// state machine and calls these pieces:
//   bodyHtml(lesson, { glossOn }) instruction + passage + choices, Korean on screen; with
//                               glossOn the passage carries word and sentence hooks for the
//                               English layer (js/translate.js decides when it is on)
//   refreshPassage(root, lesson, glossOn)  redraw only the passage after the 주석 toggle
//   markChoices(root, n, lock)  fill the pick's oval (lock = sprint, unlocked = mock)
//   answerStrip(o)              the answer strip pinned at the bottom: one row of
//                               ovals per question, your picks filled, no grading
//   ticker(fn)                  the 250 ms clock
//   listen(root, handlers)      click + visibility + pagehide, returns detach()
//   persist(slot)               save unless another tab started a different run
//   finish(run)                 record once (RunCore.record), then open Review
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, circled } = Util;

  const TICK_MS = 250;
  const ADVANCE_MS = 350;

  function reducedMotion() {
    return typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function advanceDelay() {
    return reducedMotion() ? 0 : ADVANCE_MS;
  }

  // Sprint and mock never carry the editor's notes (showNote false): some name the answer.
  function passageHtml(lesson, glossOn) {
    return window.Passage.renderFull(lesson, { glossOn: !!glossOn, showNote: false });
  }

  function bodyHtml(lesson, opts) {
    const glossOn = !!(opts && opts.glossOn);
    return window.Passage.instruction(lesson) +
      '<section class="sprint__passage" aria-label="지문">' + passageHtml(lesson, glossOn) + '</section>' +
      '<section class="sprint__answer" aria-label="선택지">' +
      window.Choices.render(lesson, { variant: 'exam' }) + '</section>';
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

  // o = { label, rows: [{ q, chosen, current, pos? }], keys }. A row with pos is a
  // button (data-pos) that jumps to that question; without, a read-only mark.
  function answerStrip(o) {
    const Omr = window.Omr;
    const rows = o.rows.map(r => {
      const cells = Omr.cells('picked', r.chosen, null);
      const label = esc(r.q + '번 · ' + (Number.isInteger(r.chosen) ? '답 ' + circled(r.chosen) : '답 없음') +
        (r.current ? ', 지금 문제' : ''));
      const current = r.current ? ' aria-current="step"' : '';
      if (Number.isInteger(r.pos)) {
        return Omr.row({ q: r.q, cells, tag: 'button', attrs: ' type="button" data-pos="' + r.pos + '" aria-label="' + label + '"' + current });
      }
      return Omr.row({ q: r.q, cells, attrs: ' role="img" aria-label="' + label + '"' + current });
    });
    return Omr.strip({ label: o.label, rows, keys: o.keys, pinned: true });
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

  // h.gloss runs on the 주석 toggle ('glosschange' on document, detail.on).
  function listen(root, h) {
    if (h.click) root.addEventListener('click', h.click);
    if (h.visibility) document.addEventListener('visibilitychange', h.visibility);
    if (h.pagehide) window.addEventListener('pagehide', h.pagehide);
    if (h.gloss) document.addEventListener('glosschange', h.gloss);
    return function detach() {
      if (h.click) root.removeEventListener('click', h.click);
      if (h.visibility) document.removeEventListener('visibilitychange', h.visibility);
      if (h.pagehide) window.removeEventListener('pagehide', h.pagehide);
      if (h.gloss) document.removeEventListener('glosschange', h.gloss);
    };
  }

  // A stale tab must not overwrite a run another tab has started since.
  function persist(slot) {
    const current = window.Store.getSprint();
    // No slot at all means another tab finished or discarded this run: never resurrect it.
    if (!current || current.id !== slot.id) return false;
    window.Store.setSprint(slot);
    return true;
  }

  // replace(): browser Back from Review must not land on a finished run.
  function finish(run) {
    const deps = { Store: window.Store, SRS: window.SRS, lessons: Util.data().lessons };
    const hash = window.RunCore.record({ at: new Date().toISOString(), ...run }, deps);
    location.replace(hash);
  }

  function emptyHtml() {
    return '<section class="placeholder"><h1 class="screen-title">풀 문제가 없습니다</h1>' +
      '<p class="placeholder__note"><a href="#/today">오늘</a>로 돌아가세요.</p></section>';
  }

  const Runner = {
    TICK_MS, ADVANCE_MS, reducedMotion, advanceDelay, bodyHtml, refreshPassage, glossOn, markChoices,
    answerStrip, isChoice, digit, ticker, listen, persist, finish, emptyHtml
  };

  if (typeof window !== 'undefined') window.Runner = Runner;
  if (typeof module !== 'undefined') module.exports = Runner;
})();
