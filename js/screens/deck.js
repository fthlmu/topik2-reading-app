// deck.js: SRS review deck (#/deck, #/deck/then-sprint). Up to 8 due cards
// (DeckCards.dueCards): front = word or grammar pattern + its question tag;
// click / Space / Enter flips; 몰라요 (J, ←) and 알아요 (K, →) move the card's
// Leitner box (SRS.record) once per card. The end line counts both answers;
// entered via then-sprint, the daily set continues to #/sprint on its own.
// Markup: .deck__aside (heading, counts) + .deck__body (card or boxes), side by
// side at 1000px and up.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc } = Util;

  const AUTO_SPRINT_MS = 600;
  const BOX_DAYS = [1, 2, 4, 8, 16];

  // { root, cards, idx, flipped, results: { key: bool }, thenSprint, done, autoTimer }
  let view = null;

  // ── Card faces ──

  function frontHtml(card) {
    return '<span class="flash__kr' + (card.kind === 'g' ? ' deck__pattern' : '') + '" lang="ko">' + esc(card.front) + '</span>' +
      '<span class="flash__hint">' + (card.kind === 'g' ? '문법' : '어휘') + ' · 눌러서 뜻 보기</span>';
  }

  function backHtml(card) {
    const b = card.back;
    const main = card.kind === 'g'
      ? '<span class="deck__plain" lang="en">' + esc(b.main) + '</span>'
      : '<span class="flash__en" lang="en">' + esc(b.main) + '</span>';
    const ex = b.example
      ? '<span class="deck__example"><span class="deck__ex-kr" lang="ko">' + esc(b.example.kr) + '</span>' +
        '<span class="deck__ex-en" lang="en">' + esc(b.example.en) + '</span></span>'
      : '';
    return '<span class="flash__kr flash__kr--small" lang="ko">' + esc(card.front) + '</span>' +
      (b.sub ? '<span class="flash__roman">' + esc(b.sub) + '</span>' : '') + main +
      (b.note ? '<span class="flash__note" lang="en">' + esc(b.note) + '</span>' : '') + ex;
  }

  function headHtml(title, sub) {
    return '<header class="screen-head deck__head"><div><p class="eyebrow">복습 덱</p>' +
      '<h1 class="screen-title">' + title + '</h1></div>' + (sub || '') + '</header>';
  }

  function cardScreenHtml() {
    const card = view.cards[view.idx];
    const progress = '<p class="deck__progress num" aria-label="카드 ' + (view.idx + 1) + ' / ' + view.cards.length + '">' +
      (view.idx + 1) + ' / ' + view.cards.length + '</p>';
    return '<section class="deck"><div class="deck__aside">' + headHtml('오늘의 카드', progress) + '</div>' +
      '<div class="deck__body"><div class="deck__stage">' +
      '<button type="button" class="flash__card deck__card' + (view.flipped ? ' is-flipped' : '') + '" data-act="flip" data-no-gloss ' +
      'aria-pressed="' + view.flipped + '" aria-keyshortcuts="Space Enter">' +
      '<span class="deck__src num">Q' + esc(card.q) + '</span>' +
      (view.flipped ? backHtml(card) : frontHtml(card)) + '</button>' +
      '<div class="deck__grades">' +
      '<button type="button" class="btn" data-grade="0" aria-keyshortcuts="J ArrowLeft">몰라요 <kbd>J</kbd></button>' +
      '<button type="button" class="btn" data-grade="1" aria-keyshortcuts="K ArrowRight">알아요 <kbd>K</kbd></button>' +
      '</div></div>' +
      '<p class="keys-hint" aria-hidden="true"><kbd>Space</kbd> 뒤집기 · <kbd>J</kbd><kbd>←</kbd> 몰라요 · ' +
      '<kbd>K</kbd><kbd>→</kbd> 알아요 · <kbd>Esc</kbd> 오늘</p></div></section>';
  }

  // ── End + empty states ──

  function endHtml() {
    const values = Object.values(view.results);
    const known = values.filter(Boolean).length;
    const line = '<p class="deck__summary"><span class="num">' + values.length + '</span>장 복습 · ' +
      '<span class="deck__known"><span class="num">' + known + '</span> 알아요</span> · ' +
      '<span class="deck__unknown"><span class="num">' + (values.length - known) + '</span> 몰라요</span></p>';
    const next = view.thenSprint
      ? '<p class="deck__next" role="status">스프린트로 넘어갑니다…</p>'
      : '<div class="set-card__actions"><a class="btn btn--primary btn--lg" href="#/sprint">스프린트 시작</a>' +
        '<a class="btn" href="#/today">오늘로</a></div>';
    return '<section class="deck deck--end"><div class="deck__aside">' + headHtml('복습 끝') + '</div>' +
      '<div class="deck__body">' + line + next + '</div></section>';
  }

  function boxRow(n, i, max) {
    const w = ((n / max) * 100).toFixed(1);
    return '<li class="deck-box"><span class="deck-box__label">상자 <span class="num">' + (i + 1) + '</span></span>' +
      '<svg class="deck-box__bar" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">' +
      '<rect class="deck-box__fill" width="' + esc(w) + '" height="8"></rect>' +
      '<rect class="deck-box__track" x="0.5" y="0.5" width="99" height="7"></rect></svg>' +
      '<span class="deck-box__n num">' + n + '</span>' +
      '<span class="deck-box__gap"><span class="num">' + BOX_DAYS[i] + '</span>일</span></li>';
  }

  function emptyHtml() {
    const st = window.SRS.stats();
    const max = Math.max(1, ...st.byBox);
    const sub = '<p class="screen-sub">전체 <span class="num">' + st.total + '</span>장 · ' +
      '틀리거나 애매했던 문제의 어휘와 문법이 여기에 쌓입니다</p>';
    return '<section class="deck deck--empty"><div class="deck__aside">' + headHtml('복습할 카드가 없습니다') + sub + '</div>' +
      '<div class="deck__body"><ol class="deck-boxes" aria-label="상자별 카드 수 (상자 번호가 클수록 오래 기억한 카드)">' +
      st.byBox.map((n, i) => boxRow(n, i, max)).join('') + '</ol>' +
      '<div class="set-card__actions deck__actions"><a class="btn" href="#/today">오늘로</a></div></div></section>';
  }

  // ── Actions ──

  function draw(focusSel) {
    view.root.innerHTML = view.done ? endHtml() : cardScreenHtml();
    const target = view.root.querySelector(focusSel || '.deck__card');
    if (target) target.focus({ preventScroll: true });
  }

  function flip() {
    if (!view || view.done || !view.cards.length) return;
    view = { ...view, flipped: !view.flipped };
    draw('.deck__card');
  }

  // One SRS.record per card: a repeated key or click on the same card is ignored.
  function grade(isRight) {
    if (!view || view.done) return;
    if (!view.flipped) return; // grade only a card you have actually seen the back of
    const card = view.cards[view.idx];
    if (!card || Object.prototype.hasOwnProperty.call(view.results, card.key)) return;
    window.SRS.record(card.key, isRight);
    const idx = view.idx + 1;
    view = { ...view, results: { ...view.results, [card.key]: isRight }, idx, flipped: false, done: idx >= view.cards.length };
    draw(view.done ? '.deck__summary + .set-card__actions .btn' : '.deck__card');
    if (view.done && view.thenSprint) {
      view = { ...view, autoTimer: setTimeout(() => location.replace('#/sprint'), AUTO_SPRINT_MS) };
    }
  }

  function onClick(e) {
    if (!view) return;
    const g = e.target.closest('button[data-grade]');
    if (g) { grade(g.dataset.grade === '1'); return; }
    const act = e.target.closest('[data-act="flip"]');
    if (act) flip();
  }

  function isKey(e, code, latin, hangul) {
    const k = String(e.key).toLowerCase();
    return e.code === code || k === latin || k === hangul;
  }

  function onKey(e) {
    if (!view) return false;
    if (e.key === 'Escape') { location.hash = '#/today'; return true; }
    if (view.done || !view.cards.length) return false;
    if (e.key === 'Enter' || e.key === ' ') {
      // A focused card or button flips / grades by its own native click.
      if (Util.isControlTarget(e.target)) return false;
      flip();
      return true;
    }
    if (e.key === 'ArrowLeft' || isKey(e, 'KeyJ', 'j', 'ㅓ')) { grade(false); return true; }
    if (e.key === 'ArrowRight' || isKey(e, 'KeyK', 'k', 'ㅏ')) { grade(true); return true; }
    return false;
  }

  // ── Screen API ──

  function mount(root, params) {
    const thenSprint = !!params && params.arg === 'then-sprint';
    const cards = window.DeckCards.dueCards(Util.data().lessons, window.Store.get().settings);
    if (!cards.length && thenSprint) { view = null; location.replace('#/sprint'); return; }
    view = { root, cards, idx: 0, flipped: false, results: {}, thenSprint, done: false, autoTimer: null };
    root.addEventListener('click', onClick);
    if (!cards.length) { root.innerHTML = emptyHtml(); return; }
    draw();
  }

  function unmount() {
    if (view) clearTimeout(view.autoTimer);
    view = null;
  }

  const DeckScreen = { title: '덱', mount, unmount, onKey };

  if (typeof window !== 'undefined') window.DeckScreen = DeckScreen;
  if (typeof module !== 'undefined') module.exports = DeckScreen;
})();
