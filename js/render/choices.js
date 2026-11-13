// choices.js: the answer list as full-width rows, one numbered circle per choice.
// Choices.render(lesson, { variant, chosen, sure, fresh, picked })
//   variant 'exam'   Korean only, clickable buttons (data-choice="n"); a pick gets is-picked
//                    (brand fill, filled circle; set by Runner.markChoices, or by picked: n in Study,
//                    where a pick can still change until 확인)
//   variant 'review' Korean + romanization (shown by Review's 로마자 toggle), graded rows, not
//                    clickable: green row + 정답 on the right answer, red row + 오답 on a wrong
//                    pick, an amber 애매 chip when the right pick was marked unsure (sure === false)
//   fresh: true      the chosen row fills over 150ms (Study, right after answering)
// Each choice's English is never printed: it is the line translation of .choice__kr
// (data-sent-key into data/sentences-102.js, data-line-en = the lesson's own English).
// Choices.verdict(lesson, chosen) gives "오답 · 정답은 ① 온 지" or "정답".
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('../util.js');
  const GT = root.GlossText || require('../gloss-text.js');
  const { esc, circled } = Util;

  // The line layer's hooks for one Korean choice text (js/translate.js reads them).
  function lineAttrs(ch) {
    return ' data-sent-key="' + esc(GT.compact(ch.kr)) + '"' + (ch.en ? ' data-line-en="' + esc(ch.en) + '"' : '');
  }

  function circle(n) {
    return '<span class="choice__n" aria-hidden="true">' + esc(n) + '</span>';
  }

  // picked (Study, before 확인): the pick's row is marked and every row says whether it is pressed.
  // undefined (Sprint, Mock): plain rows; Runner.markChoices marks the pick.
  function examItem(ch, picked) {
    const on = ch.num === picked;
    const state = picked === undefined ? '' : ' aria-pressed="' + on + '"';
    return '<li><button type="button" class="choice' + (on ? ' is-picked' : '') + '" data-choice="' + esc(ch.num) + '"' +
      state + '>' + circle(ch.num) +
      '<span class="sr-only">' + esc(circled(ch.num)) + ' </span>' +
      '<span class="choice__kr" lang="ko"' + lineAttrs(ch) + '>' + esc(ch.kr) + '</span></button></li>';
  }

  // Visible state chips (screen readers get the sr-only text instead).
  function chipsFor(isAnswer, isChosen, sure) {
    if (isAnswer) {
      return '<span class="state state--good" aria-hidden="true">정답</span>' +
        (isChosen && sure === false ? ' <span class="state state--unsure" aria-hidden="true">애매</span>' : '');
    }
    return isChosen ? '<span class="state state--bad" aria-hidden="true">오답</span>' : '';
  }

  function reviewItem(ch, answer, o) {
    const isAnswer = ch.num === answer;
    const isChosen = ch.num === o.chosen;
    const state = isAnswer ? 'is-correct' : isChosen ? 'is-wrong' : 'is-other';
    const sr = isAnswer ? '정답' : isChosen ? '고른 답, 오답' : '';
    const roman = ch.roman ? '<span class="choice__roman">' + esc(ch.roman) + '</span>' : '';
    const fresh = o.fresh && isChosen ? ' is-fresh' : '';
    return '<li class="choice ' + state + (isChosen ? ' is-chosen' : '') + fresh + '">' + circle(ch.num) +
      '<span class="choice__body"><span class="sr-only">' + esc(circled(ch.num)) + (sr ? ' ' + sr : '') + ' </span>' +
      '<span class="choice__kr" lang="ko"' + lineAttrs(ch) + '>' + esc(ch.kr) + '</span>' + roman + '</span>' +
      chipsFor(isAnswer, isChosen, o.sure) + '</li>';
  }

  function render(lesson, opts) {
    if (!lesson || !Array.isArray(lesson.choices)) return '';
    const o = opts || {};
    const variant = o.variant === 'review' ? 'review' : 'exam';
    const review = { chosen: Number.isInteger(o.chosen) ? o.chosen : null, sure: o.sure, fresh: !!o.fresh };
    const picked = 'picked' in o ? (Number.isInteger(o.picked) ? o.picked : null) : undefined;
    const items = lesson.choices.map(ch =>
      variant === 'review' ? reviewItem(ch, lesson.answer, review) : examItem(ch, picked)).join('');
    return '<ol class="choices choices--' + variant + '">' + items + '</ol>';
  }

  function verdict(lesson, chosen) {
    if (!lesson || !Number.isInteger(chosen)) return '';
    const right = chosen === lesson.answer;
    const key = (lesson.choices || []).find(c => c.num === lesson.answer);
    const body = right
      ? '정답'
      : '오답 · 정답은 <span class="verdict__key" lang="ko"' + (key ? lineAttrs(key) : '') + '>' +
        esc(circled(lesson.answer) + (key ? ' ' + key.kr : '')) + '</span>';
    return '<p class="verdict ' + (right ? 'verdict--right' : 'verdict--wrong') + '" role="status">' + body + '</p>';
  }

  const Choices = { render, verdict };

  if (typeof window !== 'undefined') window.Choices = Choices;
  if (typeof module !== 'undefined') module.exports = Choices;
})();
