// study.js: untimed lesson view for one question (#/study/<n>).
// One question sheet: ※ instruction, question line, passage, Korean-only choice rows.
// Pick a choice (change it freely), then 확인 grades it (Fathul, 2026-11-13: one tap was final):
// graded rows (green 정답, red 오답), the verdict line, the explanation,
// and fold-out vocab / grammar / practice quiz (study-tabs.js) on a quiet sheet. Below,
// this 묶음's questions as numbered tiles (state from the Map; this question shows the
// live answer). The passage always carries the English layer's hooks; the top bar's 주석
// toggle (key G, js/translate.js) hides them. Keys: 1 to 4 pick · Enter 확인 · left/right prev/next ·
// G 주석 · T line translation · Esc map.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, richText, circled, section, total } = Util;

  // picked: the current pick, still changeable · chosen: the pick 확인 graded (null until then)
  let view = null; // { root, q, lesson, picked, chosen }

  function slot(name) {
    return view.root.querySelector('[data-slot="' + name + '"]');
  }

  // ── Static parts ──

  function foldHtml(title, count, body, slotName) {
    const n = count ? ' <span class="fold__count num">' + count + '</span>' : '';
    return '<details class="fold"><summary class="fold__summary">' + title + n + '</summary>' +
      '<div class="fold__body"' + (slotName ? ' data-slot="' + slotName + '"' : '') + '>' + (body || '') + '</div></details>';
  }

  function pagerHtml(q) {
    const prev = q > 1
      ? '<a class="btn btn--quiet pager__link" href="#/study/' + (q - 1) + '" rel="prev">이전 <span class="num">Q' + (q - 1) + '</span></a>'
      : '<span class="pager__link" aria-hidden="true"></span>';
    const next = q < total()
      ? '<a class="btn btn--quiet pager__link" href="#/study/' + (q + 1) + '" rel="next">다음 <span class="num">Q' + (q + 1) + '</span></a>'
      : '<span class="pager__link" aria-hidden="true"></span>';
    return '<nav class="pager" aria-label="문항 이동">' + prev +
      '<a class="btn btn--quiet pager__link" href="#/map">지도</a>' + next + '</nav>';
  }

  // The question sheet (instruction, question line, passage, choices), then the quiet sheet of
  // study content (해설 once answered, 어휘, 문법, 연습 퀴즈), the 묶음 tiles and the pager.
  function shellHtml(l) {
    return '<article class="study">' +
      '<section class="sheet qsheet" aria-labelledby="study-q-h">' +
      '<div data-slot="instr"></div>' + window.Tiles.questionLine(l, { level: 1, id: 'study-q-h' }) +
      '<section class="study__passage" data-slot="passage" aria-label="지문"></section>' +
      '<section class="study__answer" aria-label="선택지">' +
      '<div data-slot="choices"></div><div class="study__verdict" data-slot="verdict"></div></section></section>' +
      '<div class="sheet folds">' +
      '<div data-slot="explain"></div>' +
      foldHtml('어휘', (l.vocab || []).length, '', 'vocab') +
      foldHtml('문법', (l.grammar || []).length, window.StudyTabs.grammarHtml(l), null) +
      foldHtml('연습 퀴즈', (l.quiz || []).length, '', 'quiz') +
      '</div><div data-slot="strip"></div>' + pagerHtml(l.num) + '</article>';
  }

  // ── 묶음 tiles: one numbered tile per question of this 묶음 ──

  function stripTile(q, entry) {
    const T = window.Tiles;
    const l = Util.lesson(q);
    const answer = l ? l.answer : null;
    const isHere = q === view.q;
    const live = isHere && Number.isInteger(view.chosen);
    const state = live ? (view.chosen === answer ? 'correct' : 'wrong') : T.stateOf(entry.status);
    const status = live ? (view.chosen === answer ? '정답' : '오답') : window.MapScreen.STATUS_LABEL[entry.status];
    const label = esc(q + '번 · ' + status);
    if (isHere) return T.tile({ n: q, state, current: true, attrs: ' role="img" aria-current="true" aria-label="' + label + ' · 지금 문제"' });
    return T.tile({ n: q, state, tag: 'a', attrs: ' href="#/study/' + q + '" aria-label="' + label + '"' });
  }

  function drawStrip() {
    const sec = section(view.lesson.section);
    const el = slot('strip');
    if (!sec || !el) return;
    const card = window.Store.cardMap();
    const qs = [];
    for (let q = sec.range[0]; q <= sec.range[1]; q++) qs.push(q);
    const label = sec.id + ' 묶음 · ' + sec.range[0] + ' ~ ' + sec.range[1] + '번';
    el.innerHTML = '<section class="set-tiles" aria-label="' + esc(label) + '">' +
      '<p class="set-tiles__label">' + esc(label) + '</p>' +
      window.Tiles.list({ items: qs.map(q => stripTile(q, card[q])) }) + '</section>';
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

  // Before 확인 the verdict slot holds the 확인 button, enabled once a choice is picked.
  function confirmHtml(picked) {
    return '<div class="study__verdict-actions"><button type="button" class="btn btn--primary" data-act="confirm-choice"' +
      (Number.isInteger(picked) ? '' : ' disabled') + ' aria-keyshortcuts="Enter">확인</button></div>';
  }

  // fresh: the oval was just filled by this answer, so its fill animates.
  function drawAnswer(fresh) {
    const { lesson, picked, chosen } = view;
    const answered = Number.isInteger(chosen);
    slot('choices').innerHTML = answered
      ? window.Choices.render(lesson, { variant: 'review', chosen, fresh: !!fresh })
      : window.Choices.render(lesson, { variant: 'exam', picked });
    slot('verdict').innerHTML = answered
      ? window.Choices.verdict(lesson, chosen) + '<div class="study__verdict-actions">' +
        '<button type="button" class="btn btn--quiet" data-act="retry-choice">다시 풀기</button>' + nextLink(lesson.num) + '</div>'
      : confirmHtml(picked);
    slot('explain').innerHTML = answered ? explainHtml(lesson, chosen) : '';
    drawStrip();
  }

  // ── Actions ──

  // A pick only marks the row (in place, so focus and the English layer's hooks stay): it can
  // change any number of times until 확인.
  function pick(n) {
    const { lesson } = view;
    if (Number.isInteger(view.chosen) || !lesson.choices.some(c => c.num === n)) return;
    view = { ...view, picked: n };
    slot('choices').querySelectorAll('button[data-choice]').forEach(b => {
      const on = Number(b.dataset.choice) === n;
      b.classList.toggle('is-picked', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const ok = slot('verdict').querySelector('[data-act="confirm-choice"]');
    if (ok) ok.disabled = false;
  }

  // 확인: the pick becomes the answer, is recorded once, and the rows are graded.
  function confirmPick() {
    const { lesson, picked } = view;
    if (Number.isInteger(view.chosen) || !Number.isInteger(picked)) return;
    view = { ...view, chosen: picked };
    window.Store.recordAttempt({ q: lesson.num, mode: 'study', chosen: picked, correct: picked === lesson.answer });
    drawAnswer(true);
    const v = slot('verdict').querySelector('.verdict');
    if (v) { v.tabIndex = -1; v.focus({ preventScroll: true }); }
  }

  function retry() {
    view = { ...view, picked: null, chosen: null };
    drawAnswer();
    const first = slot('choices').querySelector('.choice');
    if (first) first.focus({ preventScroll: true });
  }

  function go(q) {
    if (q >= 1 && q <= total()) location.hash = '#/study/' + q;
  }

  function onClick(e) {
    const choiceBtn = e.target.closest('button[data-choice]');
    if (choiceBtn) { pick(Number(choiceBtn.dataset.choice)); return; }
    const act = e.target.closest('[data-act]');
    if (!act) return;
    if (act.dataset.act === 'confirm-choice') confirmPick();
    else if (act.dataset.act === 'retry-choice') retry();
  }

  // ── Screen API ──

  function mount(root, params) {
    const q = Number(params && params.q);
    const lesson = Number.isInteger(q) ? Util.lesson(q) : null;
    if (!lesson) {
      root.innerHTML = '<section class="sheet placeholder"><h1 class="screen-title">문항을 찾을 수 없습니다</h1>' +
        '<p><a href="#/map">지도</a>에서 문항을 고르세요.</p></section>';
      view = null;
      return;
    }
    view = { root, q, lesson, picked: null, chosen: null };
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
    if (/^[1-4]$/.test(e.key)) { pick(Number(e.key)); return true; }
    // Enter on a focused button or link keeps its own meaning (a choice row picks, 다음 goes on).
    const onControl = e.target && e.target.closest && e.target.closest('button, a, summary');
    if (e.key === 'Enter' && !onControl && Number.isInteger(view.picked) && !Number.isInteger(view.chosen)) {
      confirmPick();
      return true;
    }
    if (e.key === 'ArrowLeft') { go(view.q - 1); return true; }
    if (e.key === 'ArrowRight') { go(view.q + 1); return true; }
    if (e.key === 'Escape') { location.hash = '#/map'; return true; }
    return false;
  }

  const StudyScreen = { title: '공부', mount, unmount, onKey };

  if (typeof window !== 'undefined') window.StudyScreen = StudyScreen;
  if (typeof module !== 'undefined') module.exports = StudyScreen;
})();
