// omr.js: the OMR answer card (답안지) as pure HTML builders, plus the mapping
// from question state to the card's marks. No DOM access.
//
// Five marks, nothing else (DESIGN.md §3):
//   hollow   not answered (untried, or opened in Study only)
//   ok       your fill + red ○ (right, or recovered: wrong once, right later)
//   unsure   your fill + red △ (right but marked 애매)
//   bad      your fill + red /, and the red ○ on the right answer
//   picked   your fill only (Sprint and Mock before grading)
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc } = Util;

  const CHOICES = 4;
  const MARK_OF_STATUS = {
    'untried': 'hollow',
    'seen': 'hollow',
    'right-sure': 'ok',
    'right-unsure': 'unsure',
    'wrong': 'bad',
    'recovered': 'ok'
  };
  // Oval class for a mark drawn on a single oval (Today's set row, result cells).
  const SINGLE = { hollow: '', picked: 'fill', ok: 'fill ok', unsure: 'fill unsure', bad: 'fill bad' };

  function markOf(status) {
    return MARK_OF_STATUS[status] || 'hollow';
  }

  // A graded attempt (sprint or mock result). A blank mock answer stays hollow.
  function markOfAttempt(a) {
    if (!a || a.unanswered || typeof a.correct !== 'boolean') return 'hollow';
    if (!a.correct) return 'bad';
    return a.sure === false ? 'unsure' : 'ok';
  }

  function single(mark) {
    return SINGLE[mark] || '';
  }

  // Oval states for one row, index 0 = choice 1:
  // '' · 'fill' · 'fill ok' · 'fill unsure' · 'fill bad' · 'ok' (the right answer, not chosen).
  function cells(mark, chosen, answer, count) {
    const n = Number.isInteger(count) && count > 0 ? count : CHOICES;
    const pick = Number.isInteger(chosen) ? chosen : null;
    const key = Number.isInteger(answer) ? answer : null;
    return Array.from({ length: n }, (_, i) => {
      const c = i + 1;
      if (mark === 'picked') return c === pick ? 'fill' : '';
      if (mark === 'ok' || mark === 'unsure') return c === (pick || key) ? 'fill ' + mark : '';
      if (mark === 'bad') return c === pick ? 'fill bad' : c === key ? 'ok' : '';
      return '';
    });
  }

  // ── HTML builders ──

  function oval(label, state, size, extra) {
    const cls = ['ov', size ? 'ov--' + size : '', state || '', extra || ''].filter(Boolean).join(' ');
    return '<span class="' + cls + '" aria-hidden="true">' + esc(label) + '</span>';
  }

  function ovals(states, size) {
    return states.map((st, i) => oval(i + 1, st, size)).join('');
  }

  // One answer-card row: [set letter] number ① ② ③ ④.
  // o = { q, cells, set?, size?, tag? ('div' | 'a' | 'button'), cls?, attrs? (pre-escaped) }
  function row(o) {
    const tag = o.tag || 'div';
    const set = o.set === undefined ? '' : '<span class="omr-row__set" aria-hidden="true">' + esc(o.set) + '</span>';
    return '<' + tag + ' class="omr-row' + (o.cls ? ' ' + o.cls : '') + '"' + (o.attrs || '') + '>' + set +
      '<span class="omr-row__qn" aria-hidden="true">' + esc(o.q) + '</span>' +
      '<span class="omr-row__ovals">' + ovals(o.cells, o.size) + '</span></' + tag + '>';
  }

  function ticks(count) {
    return '<span class="omr-ticks" aria-hidden="true">' + '<span class="omr-tick"></span>'.repeat(count) + '</span>';
  }

  // Countdown as 수험번호 digit columns: a printed box with the digit, then
  // 0 to 9 ovals with that digit filled. At least `minCols` columns.
  function digitColumns(value, minCols) {
    const digits = String(Math.max(0, Math.floor(value))).padStart(minCols || 2, '0').split('').map(Number);
    return '<span class="dcols" aria-hidden="true">' + digits.map(d =>
      '<span class="dcol"><span class="dcol__box">' + d + '</span>' +
      Array.from({ length: 10 }, (_, i) => oval(i, i === d ? 'fill' : '')).join('') + '</span>').join('') +
      '</span>';
  }

  const LEGEND = [['fill', '푼 문제'], ['ok', '정답'], ['fill bad', '오답'], ['fill unsure', '애매']];

  function legend() {
    return '<ul class="omr-legend" aria-label="표기 설명">' + LEGEND.map(([st, text]) =>
      '<li>' + oval('', st) + esc(text) + '</li>').join('') + '</ul>';
  }

  // Strip panel (Study set strip, Sprint and Mock answer strip).
  // o = { label, rows (array of row HTML, each wrapped in <li>), keys (HTML) | '', pinned }
  function strip(o) {
    return '<div class="omr-dock' + (o.pinned ? ' omr-dock--pinned' : '') + '">' +
      '<section class="omr-panel omr-panel--ticks omr-strip" aria-label="' + esc(o.aria || o.label) + '">' +
      ticks(3) +
      '<div class="omr-strip__set"><p class="omr-strip__label">' + esc(o.label) + '</p>' +
      '<ol class="omr-strip__rows">' + o.rows.map(r => '<li>' + r + '</li>').join('') + '</ol></div>' +
      (o.keys ? '<p class="omr-strip__keys" aria-hidden="true">' + o.keys + '</p>' : '') +
      '</section></div>';
  }

  const Omr = { CHOICES, markOf, markOfAttempt, single, cells, oval, ovals, row, ticks, digitColumns, legend, strip };

  if (typeof window !== 'undefined') window.Omr = Omr;
  if (typeof module !== 'undefined') module.exports = Omr;
})();
