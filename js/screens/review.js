// review.js: results of one sprint or mock (#/review/<sessionId>; no id = latest).
// Sprint: header totals + a results strip (one answer-card row per question,
// graded in red pen), then one block per question in order:
// strategy card, glossed passage, red-pen choices, explanation (chosen
// distractor first), vocab chips, link to Study. Footer: retry wrong ones.
// Mock (session.mode 'mock', see review-mock.js): score over every question,
// per-section table, then blocks for wrong or blank questions only (모두 보기).
// Romanization (choices + chips) follows settings.romanization; the header
// toggle flips it via a class on the screen root (no re-render).
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, richText, circled, section, splitSectionLabel, formatTime } = Util;

  let view = null; // { root, session, rows: [{ q, lesson, attempt }], isMock, showAll }

  const PACE = () => window.PACE;

  function sectionText(id) {
    const sec = section(id);
    return sec ? splitSectionLabel(sec.label).text : '';
  }

  function isOver(row) {
    return Number.isFinite(row.attempt.ms) && PACE().isOver(row.attempt.ms, row.lesson.section);
  }

  function timeText(ms) {
    return Number.isFinite(ms) ? PACE().fmt(ms) : '-';
  }

  // ── Header + strip ──

  function totals(rows) {
    const P = PACE();
    return {
      right: rows.filter(r => r.attempt.correct).length,
      total: rows.length,
      usedMs: rows.reduce((s, r) => s + (Number.isFinite(r.attempt.ms) ? r.attempt.ms : 0), 0),
      paceMs: rows.reduce((s, r) => s + P.secFor(r.lesson.section) * 1000, 0),
      over: rows.filter(isOver).length,
      unsure: rows.filter(r => r.attempt.sure === false).length
    };
  }

  function romanToggleHtml(romanOn) {
    return '<button type="button" class="toggle" data-act="toggle-roman" aria-pressed="' + romanOn + '">로마자</button>';
  }

  function headHtml(session, t, romanOn) {
    const when = new Date(session.at);
    const stamp = isNaN(when) ? '' : (when.getMonth() + 1) + '월 ' + when.getDate() + '일 ' + formatTime(when);
    const pct = t.total ? Math.round((100 * t.right) / t.total) : 0;
    return '<header class="screen-head review__head">' +
      '<div class="review__titles"><p class="eyebrow">스프린트 결과 · ' + esc(stamp) + '</p>' +
      '<h1 class="screen-title">결과 <span class="num">' + t.right + ' / ' + t.total + '</span> ' +
      '<span class="review__pct num">' + pct + '%</span></h1>' +
      '<p class="screen-sub">시간 <span class="num">' + esc(PACE().fmt(t.usedMs)) + '</span> / 기준 ' +
      '<span class="num">' + esc(PACE().fmt(t.paceMs)) + '</span> · 시간 초과 <span class="num">' + t.over +
      '</span> · 애매 <span class="num">' + t.unsure + '</span></p></div>' + romanToggleHtml(romanOn) + '</header>';
  }

  // The question's answer-card row: your fill with the red-pen mark, red ○ on the right answer.
  function marksHtml(row) {
    const Omr = window.Omr;
    const a = row.attempt;
    return Omr.row({ q: row.q, cells: Omr.cells(Omr.markOfAttempt(a), a.chosen, row.lesson.answer) });
  }

  function cellHtml(row) {
    const a = row.attempt;
    const over = isOver(row);
    const unsure = a.sure === false;
    const flags = (over ? '<span aria-hidden="true">+</span><span class="sr-only">시간 초과</span>' : '') +
      (unsure ? '<span aria-hidden="true">?</span><span class="sr-only">애매</span>' : '');
    return '<li><a class="result ' + (a.correct ? 'is-right' : 'is-wrong') + '" href="#rq-' + row.q + '" ' +
      'data-jump="' + row.q + '"><span class="result__top">' +
      '<span class="result__q num">Q' + row.q + '</span>' +
      '<span class="sr-only">' + (a.correct ? '정답' : '오답') + '</span>' +
      '<span class="result__time num">' + esc(timeText(a.ms)) + '</span>' +
      '<span class="result__flags num">' + flags + '</span></span>' + marksHtml(row) + '</a></li>';
  }

  function stripHtml(rows) {
    return '<ol class="results" aria-label="문항별 결과">' + rows.map(cellHtml).join('') + '</ol>';
  }

  // ── Per-question block ──

  function strategyHtml(id, open) {
    const s = window.STRATEGIES && window.STRATEGIES[id];
    if (!s) return '';
    const steps = (s.steps || []).map(st => '<li>' + esc(st) + '</li>').join('');
    const signals = (s.signals || []).map(sg => '<li class="chip" lang="ko">' + esc(sg) + '</li>').join('');
    return '<details class="fold strategy"' + (open ? ' open' : '') + '>' +
      '<summary class="fold__summary">전략 <span class="strategy__title" lang="ko">' + esc(s.title) + '</span>' +
      '<span class="strategy__en" lang="en">' + esc(s.titleEn) + '</span></summary>' +
      '<div class="fold__body"><ol class="strategy__steps" lang="en">' + steps + '</ol>' +
      (signals ? '<p class="rq__label">신호 단어</p><ul class="chips chips--sm">' + signals + '</ul>' : '') +
      (s.trap ? '<p class="strategy__trap"><span class="strategy__trap-label">함정</span>' +
        '<span lang="en">' + esc(s.trap) + '</span></p>' : '') +
      '</div></details>';
  }

  function whyItem(k, text, isChosen) {
    return '<li class="why__item' + (isChosen ? ' is-chosen' : '') + '">' +
      '<span class="why__num" aria-hidden="true">' + esc(circled(k)) + '</span>' +
      '<div class="why__text" lang="en">' + (isChosen ? '<span class="why__tag">고른 답</span> ' : '') +
      richText(text) + '</div></li>';
  }

  function explainHtml(l, chosen) {
    const wrong = l.whyWrong || {};
    const keys = Object.keys(wrong).map(Number).filter(n => n !== l.answer).sort((a, b) => a - b);
    const isWrongPick = chosen !== l.answer && keys.includes(chosen);
    const rest = keys.filter(k => !isWrongPick || k !== chosen);
    const first = isWrongPick
      ? '<div class="why why--wrong"><ul class="why__list">' + whyItem(chosen, wrong[String(chosen)], true) + '</ul></div>'
      : '';
    const more = rest.length
      ? '<details class="why-more"><summary class="why-more__summary">다른 오답 풀이 <span class="num">' +
        rest.length + '</span></summary><ul class="why__list">' +
        rest.map(k => whyItem(k, wrong[String(k)], false)).join('') + '</ul></details>'
      : '';
    return '<div class="rq__explain"><h3 class="rq__label">해설</h3>' +
      '<div class="why why--right"><p class="why__label">정답 ' + esc(circled(l.answer)) + '</p>' +
      '<div class="why__text" lang="en">' + richText(l.whyRight) + '</div></div>' + first + more + '</div>';
  }

  function vocabHtml(l, toDeck) {
    const items = l.vocab || [];
    if (!items.length) return '';
    const chips = items.map(v => '<li class="chip"><span class="chip__kr" lang="ko">' + esc(v.kr) + '</span>' +
      (v.roman ? '<span class="chip__roman">' + esc(v.roman) + '</span>' : '') +
      '<span class="chip__sep" aria-hidden="true">·</span><span class="chip__en" lang="en">' + esc(v.en) + '</span></li>').join('');
    return '<div class="rq__vocab"><h3 class="rq__label">어휘' +
      (toDeck ? ' <span class="rq__deck">복습 덱에 추가됨</span>' : '') + '</h3>' +
      '<ul class="chips">' + chips + '</ul></div>';
  }

  function verdictText(a) {
    const mark = window.Omr.oval('', window.Omr.single(window.Omr.markOfAttempt(a)));
    if (a.unanswered) return mark + '미응답';
    return mark + (a.correct ? '정답' : '오답');
  }

  function metaHtml(row) {
    const a = row.attempt;
    const budget = PACE().secFor(row.lesson.section) * 1000;
    return '<p class="rq__meta"><span class="rq__verdict ' + (a.correct ? 'is-right' : 'is-wrong') + '">' +
      verdictText(a) + '</span> · <span class="num">' + esc(timeText(a.ms)) + ' / ' +
      esc(PACE().fmt(budget)) + '</span>' + (isOver(row) ? ' · <span class="rq__over">시간 초과</span>' : '') +
      (a.sure === false ? ' · 애매' : '') + '</p>';
  }

  function blockHtml(row) {
    const { q, lesson: l, attempt: a } = row;
    // Blank mock questions were never read, so they are not seeded into the deck.
    const needsWork = (!a.correct && !a.unanswered) || a.sure === false;
    return '<section class="rq" id="rq-' + q + '" tabindex="-1" aria-labelledby="rq-' + q + '-h">' +
      '<header class="rq__head"><h2 class="rq__title" id="rq-' + q + '-h"><span class="num">Q' + q + '</span> · ' +
      esc(l.section) + ' 묶음 · <span lang="ko">' + esc(sectionText(l.section)) + '</span></h2>' +
      metaHtml(row) + '</header>' +
      strategyHtml(l.section, !a.correct) +
      window.Passage.instruction(l) +
      '<div class="rq__passage" aria-label="지문">' + window.Passage.renderFull(l, { glossOn: true }) + '</div>' +
      '<div class="rq__choices">' + window.Choices.render(l, { variant: 'review', chosen: a.chosen, sure: a.sure }) + '</div>' +
      explainHtml(l, a.chosen) + vocabHtml(l, needsWork) +
      '<p class="rq__study"><a href="#/study/' + q + '">공부하기 <span aria-hidden="true">→</span></a></p>' +
      '</section>';
  }

  // Questions to redo: answered wrong (a blank mock question was never read).
  function wrongQs(rows) {
    return rows.filter(r => !r.attempt.correct && !r.attempt.unanswered).map(r => r.q);
  }

  function footHtml(rows) {
    const wrong = wrongQs(rows).length;
    const retry = wrong
      ? '<button type="button" class="btn btn--primary" data-act="retry">다시 풀기 (틀린 문제 <span class="num">' +
        wrong + '</span>)</button>'
      : '';
    return '<footer class="review__foot">' + retry + '<a class="btn" href="#/today">오늘로</a></footer>';
  }

  // ── Data ──

  // Latest attempt per question of this session, in order. A mock question
  // left blank has no attempt: it gets a display-only "unanswered" one.
  function rowsOf(session) {
    const attempts = window.Store.get().attempts.filter(a => a.sessionId === session.id);
    const blank = session.mode === 'mock' ? window.ReviewMock.unanswered : () => null;
    return session.qs.map(q => {
      const mine = attempts.filter(a => a.q === q);
      return { q, lesson: Util.lesson(q), attempt: mine[mine.length - 1] || blank(q) };
    }).filter(r => r.lesson && r.attempt);
  }

  function notFoundHtml() {
    return '<section class="placeholder"><h1 class="screen-title">리뷰할 세트가 없습니다</h1>' +
      '<p class="placeholder__note"><a href="#/today">오늘</a>에서 스프린트를 시작하세요.</p></section>';
  }

  // ── Actions ──

  function jump(q) {
    const block = view.root.querySelector('#rq-' + q);
    if (!block) return;
    const smooth = !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    block.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    block.focus({ preventScroll: true });
  }

  function toggleRoman(btn) {
    const on = !window.Store.get().settings.romanization;
    window.Store.setSetting('romanization', on);
    view.root.classList.toggle('is-roman', on);
    btn.setAttribute('aria-pressed', String(on));
  }

  function blocksHtml() {
    const rows = view.isMock ? window.ReviewMock.visibleRows(view.rows, view.showAll) : view.rows;
    return rows.map(blockHtml).join('');
  }

  // Mock: wrong-only ⇄ every question; re-renders the block list in place.
  function toggleAll() {
    view = { ...view, showAll: !view.showAll };
    view.root.querySelector('[data-slot="filter"]').innerHTML = window.ReviewMock.filterHtml(view.rows, view.showAll);
    view.root.querySelector('[data-slot="blocks"]').innerHTML = blocksHtml();
    if (window.Gloss) window.Gloss.hide();
    const btn = view.root.querySelector('[data-act="toggle-all"]');
    if (btn) btn.focus({ preventScroll: true });
  }

  function retry() {
    const wrong = wrongQs(view.rows);
    if (!wrong.length) return;
    window.Store.setRetry(wrong);
    location.hash = '#/sprint/retry';
  }

  function onClick(e) {
    const cell = e.target.closest('[data-jump]');
    if (cell) { e.preventDefault(); jump(Number(cell.dataset.jump)); return; }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'toggle-roman') toggleRoman(act);
    else if (act.dataset.act === 'toggle-all') toggleAll();
    else if (act.dataset.act === 'retry') retry();
  }

  // ── Screen API ──

  function mount(root, params) {
    const id = params && params.arg;
    const session = id ? window.Store.sessionById(id) : window.Store.lastSession();
    const rows = session ? rowsOf(session) : [];
    if (!session || !rows.length) { root.innerHTML = notFoundHtml(); view = null; return; }
    const romanOn = window.Store.get().settings.romanization;
    const isMock = session.mode === 'mock';
    view = { root, session, rows, isMock, showAll: false };
    root.classList.toggle('is-roman', romanOn);
    const M = window.ReviewMock;
    const top = isMock
      ? M.headHtml(session, rows, romanToggleHtml(romanOn)) + M.tableHtml(rows) +
        '<div data-slot="filter">' + M.filterHtml(rows, false) + '</div>'
      : headHtml(session, totals(rows), romanOn) + stripHtml(rows);
    root.innerHTML = '<div class="review"><div class="review__side">' + top + '</div>' +
      '<div class="review__main"><div data-slot="blocks">' + blocksHtml() + '</div>' + footHtml(rows) + '</div></div>';
    root.addEventListener('click', onClick);
  }

  function unmount() {
    view = null;
    if (window.Gloss) window.Gloss.hide();
  }

  function onKey(e) {
    if (!view) return false;
    if (e.key === 'Escape') { location.hash = '#/today'; return true; }
    return false;
  }

  const ReviewScreen = { title: '리뷰', mount, unmount, onKey };

  if (typeof window !== 'undefined') window.ReviewScreen = ReviewScreen;
  if (typeof module !== 'undefined') module.exports = ReviewScreen;
})();
