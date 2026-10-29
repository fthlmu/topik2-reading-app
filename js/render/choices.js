// choices.js: the answer list as answer-card rows, one big oval per choice.
// Choices.render(lesson, { variant, chosen, sure, fresh })
//   variant 'exam'   Korean only, clickable buttons (data-choice="n"); a pick fills its oval
//   variant 'review' Korean + romanization (shown by Review's 로마자 toggle), red-pen marks on
//                    the ovals, not clickable: red ○ on the right answer, red / through a
//                    wrong pick, red △ when the right pick was marked unsure (sure === false)
//   fresh: true      animates the chosen oval's fill (Study, right after answering)
// Each choice's English is never printed: it is the line translation of .choice__kr
// (data-sent-key into data/sentences-102.js, data-line-en = the lesson's own English).
// Choices.verdict(lesson, chosen) gives "오답 · 정답은 ① 온 지" or "정답", in red pen.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('../util.js');
  const Omr = root.Omr || require('./omr.js');
  const GT = root.GlossText || require('../gloss-text.js');
  const { esc, circled } = Util;

  // The line layer's hooks for one Korean choice text (js/translate.js reads them).
  function lineAttrs(ch) {
    return ' data-sent-key="' + esc(GT.compact(ch.kr)) + '"' + (ch.en ? ' data-line-en="' + esc(ch.en) + '"' : '');
  }

  function examItem(ch) {
    return '<li><button type="button" class="choice" data-choice="' + esc(ch.num) + '">' +
      Omr.oval(ch.num, '', 'lg') +
      '<span class="sr-only">' + esc(circled(ch.num)) + ' </span>' +
      '<span class="choice__kr" lang="ko"' + lineAttrs(ch) + '>' + esc(ch.kr) + '</span></button></li>';
  }

  function ovalState(isAnswer, isChosen, sure) {
    if (isAnswer && isChosen) return sure === false ? 'fill unsure' : 'fill ok';
    if (isAnswer) return 'ok';
    return isChosen ? 'fill bad' : '';
  }

  function reviewItem(ch, answer, o) {
    const isAnswer = ch.num === answer;
    const isChosen = ch.num === o.chosen;
    const state = isAnswer ? 'is-correct' : isChosen ? 'is-wrong' : 'is-other';
    const sr = isAnswer ? '정답' : isChosen ? '고른 답, 오답' : '';
    const roman = ch.roman ? '<span class="choice__roman">' + esc(ch.roman) + '</span>' : '';
    return '<li class="choice ' + state + (isChosen ? ' is-chosen' : '') + '">' +
      Omr.oval(ch.num, ovalState(isAnswer, isChosen, o.sure), 'lg', o.fresh && isChosen ? 'is-fresh' : '') +
      '<span class="choice__body"><span class="sr-only">' + esc(circled(ch.num)) + (sr ? ' ' + sr : '') + ' </span>' +
      '<span class="choice__kr" lang="ko"' + lineAttrs(ch) + '>' + esc(ch.kr) + '</span>' + roman + '</span></li>';
  }

  function render(lesson, opts) {
    if (!lesson || !Array.isArray(lesson.choices)) return '';
    const o = opts || {};
    const variant = o.variant === 'review' ? 'review' : 'exam';
    const review = { chosen: Number.isInteger(o.chosen) ? o.chosen : null, sure: o.sure, fresh: !!o.fresh };
    const items = lesson.choices.map(ch =>
      variant === 'review' ? reviewItem(ch, lesson.answer, review) : examItem(ch)).join('');
    return '<ol class="choices choices--' + variant + '">' + items + '</ol>';
  }

  function verdict(lesson, chosen) {
    if (!lesson || !Number.isInteger(chosen)) return '';
    const right = chosen === lesson.answer;
    const key = (lesson.choices || []).find(c => c.num === lesson.answer);
    const body = right
      ? '정답'
      : '오답 · 정답은 <span class="verdict__key"' + (key ? lineAttrs(key) : '') + '>' +
        esc(circled(lesson.answer) + (key ? ' ' + key.kr : '')) + '</span>';
    return '<p class="verdict ' + (right ? 'verdict--right' : 'verdict--wrong') + '" role="status">' + body + '</p>';
  }

  const Choices = { render, verdict };

  if (typeof window !== 'undefined') window.Choices = Choices;
  if (typeof module !== 'undefined') module.exports = Choices;
})();
