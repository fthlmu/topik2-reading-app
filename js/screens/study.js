// study.js: untimed lesson view for one question (#/study/<n>).
// Guess first (Korean-only choices, one oval each), then red-pen marks on the
// ovals, the verdict line, explanation, and fold-out vocab / grammar / practice
// quiz (study-tabs.js). At the bottom the set strip: this 묶음's questions as
// answer-card rows (marks from the card; this question shows the live answer).
// The passage always carries the English layer's hooks; the top bar's 주석 toggle
// (key G, js/translate.js) hides them. Keys: 1 to 4 choose · left/right prev/next ·
// G 주석 · T line translation · Esc map.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, richText, circled, section, splitSectionLabel, total } = Util;

  let view = null; // { root, q, lesson, chosen }

  function slot(name) {
    return view.root.querySelector('[data-slot="' + name + '"]');
  }

  // ── Static parts ──

  function headHtml(l) {
    const sec = section(l.section);
    const label = sec ? splitSectionLabel(sec.label) : { range: '', text: '' };
    return '<header class="study__head">' +
      '<p class="eyebrow"><span class="num">Q' + esc(l.num) + '</span> / ' + total() + ' · ' +
      esc(l.section) + ' 묶음 · <span lang="ko">' + esc(label.text) + '</span></p>' +
      '</header>';
  }

  function foldHtml(title, count, body, slotName) {
    const n = count ? ' <span class="fold__count num">' + count + '</span>' : '';
    return '<details class="fold"><summary class="fold__summary">' + title + n + '</summary>' +
      '<div class="fold__body"' + (slotName ? ' data-slot="' + slotName + '"' : '') + '>' + (body || '') + '</div></details>';
  }

  function pagerHtml(q) {
    const prev = q > 1
      ? '<a class="pager__link" href="#/study/' + (q - 1) + '" rel="prev">← <span class="num">Q' + (q - 1) + '</span></a>'
      : '<span class="pager__link is-disabled" aria-hidden="true">←</span>';
    const next = q < total()
      ? '<a class="pager__link" href="#/study/' + (q + 1) + '" rel="next"><span class="num">Q' + (q + 1) + '</span> →</a>'
      : '<span class="pager__link is-disabled" aria-hidden="true">→</span>';
    return '<nav class="pager" aria-label="문항 이동">' + prev +
      '<a class="pager__link pager__map" href="#/map">지도</a>' + next + '</nav>';
  }

  function shellHtml(l) {
    return '<article class="study">' + headHtml(l) +
      '<div class="study__instr" data-slot="instr"></div>' +
      '<section class="study__passage" data-slot="passage" aria-label="지문"></section>' +
      '<section class="study__answer" aria-label="선택지">' +
      '<div data-slot="choices"></div><div class="study__verdict" data-slot="verdict"></div></section>' +
      '<div class="folds">' +
      '<div data-slot="explain"></div>' +
      foldHtml('어휘', (l.vocab || []).length, '', 'vocab') +
      foldHtml('문법', (l.grammar || []).length, window.StudyTabs.grammarHtml(l), null) +
      foldHtml('연습 퀴즈', (l.quiz || []).length, '', 'quiz') +
      '</div><div data-slot="strip"></div>' + pagerHtml(l.num) + '</article>';
  }

  // ── Set strip: one answer-card row per question of this 묶음 ──

  const KEYS_HTML = '<span><kbd>1</kbd>–<kbd>4</kbd> 선택</span><span><kbd>←</kbd><kbd>→</kbd> 이동</span>' +
    '<span><kbd>G</kbd> 주석</span><span><kbd>T</kbd> 번역</span><span><kbd>Tab</kbd> 문장</span><span><kbd>←</kbd><kbd>→</kbd> 단어</span><span><kbd>Esc</kbd> 지도</span>';

  function stripRow(q, entry) {
    const Omr = window.Omr;
    const l = Util.lesson(q);
    const answer = l ? l.answer : null;
    const isHere = q === view.q;
    const live = isHere && Number.isInteger(view.chosen);
    const cells = live
      ? Omr.cells(view.chosen === answer ? 'ok' : 'bad', view.chosen, answer)
      : Omr.cells(Omr.markOf(entry.status), entry.chosen, answer);
    const status = live ? (view.chosen === answer ? '정답' : '오답') : window.MapScreen.STATUS_LABEL[entry.status];
    const label = esc(q + '번 · ' + status);
    if (isHere) return Omr.row({ q, cells, attrs: ' role="img" aria-current="true" aria-label="' + label + ', 지금 문제"' });
    return Omr.row({ q, cells, tag: 'a', attrs: ' href="#/study/' + q + '" aria-label="' + label + '"' });
  }

  function drawStrip() {
    const sec = section(view.lesson.section);
    const el = slot('strip');
    if (!sec || !el) return;
    const card = window.Store.cardMap();
    const qs = [];
    for (let q = sec.range[0]; q <= sec.range[1]; q++) qs.push(q);
    el.innerHTML = window.Omr.strip({
      label: sec.id + ' 묶음 · ' + sec.range[0] + ' ~ ' + sec.range[1] + '번',
      rows: qs.map(q => stripRow(q, card[q])),
      keys: KEYS_HTML
    });
  }

  // ── Dynamic parts ──

  function drawInstruction() {
    slot('instr').innerHTML = window.Passage.instruction(view.lesson);
  }

  function drawPassage() {
    slot('passage').innerHTML = window.Passage.render(view.lesson, { glossOn: true });
  }

  function explainHtml(l, chosen) {
    const wrong = l.whyWrong || {};
    const keys = Object.keys(wrong).map(Number).filter(n => n !== l.answer)
      .sort((a, b) => (a === chosen ? -1 : b === chosen ? 1 : a - b));
    const items = keys.map(k =>
      '<li class="why__item' + (k === chosen ? ' is-chosen' : '') + '">' +
      '<span class="why__num" aria-hidden="true">' + esc(circled(k)) + '</span>' +
      '<div class="why__text" lang="en">' + (k === chosen ? '<span class="why__tag">고른 답</span> ' : '') +
      richText(wrong[String(k)]) + '</div></li>').join('');
    return '<details class="fold fold--explain" open><summary class="fold__summary">해설</summary>' +
      '<div class="fold__body">' +
      '<div class="why why--right"><p class="why__label">정답 ' + esc(circled(l.answer)) + '</p>' +
      '<div class="why__text" lang="en">' + richText(l.whyRight) + '</div></div>' +
      (items ? '<div class="why why--wrong"><p class="why__label">오답 풀이</p><ul class="why__list">' + items + '</ul></div>' : '') +
      '</div></details>';
  }

  function nextLink(q) {
    return q < total()
      ? '<a class="btn btn--primary" href="#/study/' + (q + 1) + '">다음 문제 <span class="num">Q' + (q + 1) + '</span></a>'
      : '';
  }

  // fresh: the oval was just filled by this answer, so its fill animates.
  function drawAnswer(fresh) {
    const { lesson, chosen } = view;
    const answered = Number.isInteger(chosen);
    slot('choices').innerHTML = window.Choices.render(lesson, { variant: answered ? 'review' : 'exam', chosen, fresh: !!fresh });
    slot('verdict').innerHTML = answered
      ? window.Choices.verdict(lesson, chosen) + '<div class="study__verdict-actions">' +
        '<button type="button" class="btn btn--quiet" data-act="retry-choice">다시 풀기</button>' + nextLink(lesson.num) + '</div>'
      : '';
    slot('explain').innerHTML = answered ? explainHtml(lesson, chosen) : '';
    drawStrip();
  }

  // ── Actions ──

  function choose(n) {
    const { lesson } = view;
    if (Number.isInteger(view.chosen) || !lesson.choices.some(c => c.num === n)) return;
    view = { ...view, chosen: n };
    window.Store.recordAttempt({ q: lesson.num, mode: 'study', chosen: n, correct: n === lesson.answer });
    drawAnswer(true);
    const v = slot('verdict').querySelector('.verdict');
    if (v) { v.tabIndex = -1; v.focus({ preventScroll: true }); }
  }

  function retry() {
    view = { ...view, chosen: null };
    drawAnswer();
    const first = slot('choices').querySelector('.choice');
    if (first) first.focus({ preventScroll: true });
  }

  function go(q) {
    if (q >= 1 && q <= total()) location.hash = '#/study/' + q;
  }

  function onClick(e) {
    const choiceBtn = e.target.closest('button[data-choice]');
    if (choiceBtn) { choose(Number(choiceBtn.dataset.choice)); return; }
    const act = e.target.closest('[data-act]');
    if (act && act.dataset.act === 'retry-choice') retry();
  }

  // ── Screen API ──

  function mount(root, params) {
    const q = Number(params && params.q);
    const lesson = Number.isInteger(q) ? Util.lesson(q) : null;
    if (!lesson) {
      root.innerHTML = '<section class="placeholder"><h1 class="screen-title">문항을 찾을 수 없습니다</h1>' +
        '<p><a href="#/map">지도</a>에서 문항을 고르세요.</p></section>';
      view = null;
      return;
    }
    view = { root, q, lesson, chosen: null };
    root.innerHTML = shellHtml(lesson);
    drawInstruction();
    drawPassage();
    drawAnswer();
    window.StudyTabs.vocab(slot('vocab'), lesson);
    window.StudyTabs.quiz(slot('quiz'), lesson);
    root.addEventListener('click', onClick);
    document.title = 'Q' + q + ' · TOPIK II 읽기';
  }

  function unmount() {
    view = null;
    if (window.Gloss) window.Gloss.hide();
  }

  // Returns true when the key was handled.
  function onKey(e) {
    if (!view) return false;
    // Inside the fold-outs (flashcards, quiz) digits/arrows belong to those widgets.
    const inFolds = e.target && e.target.closest && e.target.closest('.folds');
    if (inFolds) {
      if (e.key === 'Escape') { location.hash = '#/map'; return true; }
      return false;
    }
    if (/^[1-4]$/.test(e.key)) { choose(Number(e.key)); return true; }
    if (e.key === 'ArrowLeft') { go(view.q - 1); return true; }
    if (e.key === 'ArrowRight') { go(view.q + 1); return true; }
    if (e.key === 'Escape') { location.hash = '#/map'; return true; }
    return false;
  }

  const StudyScreen = { title: '공부', mount, unmount, onKey };

  if (typeof window !== 'undefined') window.StudyScreen = StudyScreen;
  if (typeof module !== 'undefined') module.exports = StudyScreen;
})();
