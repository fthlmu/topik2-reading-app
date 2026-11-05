// tiles.js: the numbered square (DESIGN.md section 1, the app's one motif) as pure HTML
// builders, plus the mapping from question state to tile state. No DOM access.
//
// Five tile states, nothing else (DESIGN.md section 3):
//   untried   white, line edge (not tried, or opened in Study only)
//   answered  brand tint (picked in a Sprint or Mock, not graded yet)
//   correct   green tint (right, or recovered: wrong once, right later)
//   unsure    amber tint (right, but marked 애매)
//   wrong     red tint (also the wrong pick of a graded run)
// square(n) is the gradient badge on every sheet; questionLine(lesson) is the sheet's
// question line: square + the question type (exam label) + the point chip.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('../util.js');
  const { esc, section, splitSectionLabel } = Util;

  const STATES = ['untried', 'answered', 'correct', 'unsure', 'wrong'];
  const STATE_OF_STATUS = {
    'untried': 'untried',
    'seen': 'untried',
    'right-sure': 'correct',
    'right-unsure': 'unsure',
    'wrong': 'wrong',
    'recovered': 'correct'
  };
  const DEFAULT_POINTS = 2;            // TOPIK II reading: 2 points per question
  const POINTS_RE = /각\s*(\d+)\s*점/;  // "(각 2점)" in the group instruction

  function stateOf(status) {
    return STATE_OF_STATUS[status] || 'untried';
  }

  // A graded attempt (sprint or mock result). A blank mock answer stays untried.
  function stateOfAttempt(a) {
    if (!a || a.unanswered || typeof a.correct !== 'boolean') return 'untried';
    if (!a.correct) return 'wrong';
    return a.sure === false ? 'unsure' : 'correct';
  }

  // A pick in a run, before grading.
  function stateOfPick(chosen) {
    return Number.isInteger(chosen) ? 'answered' : 'untried';
  }

  // Points of one question, read from its group instruction "(각 2점)".
  function points(lesson) {
    const kr = lesson && lesson.groupInstruction ? String(lesson.groupInstruction.kr || '') : '';
    const m = POINTS_RE.exec(kr);
    return m ? Number(m[1]) : DEFAULT_POINTS;
  }

  // ── HTML builders ──

  function square(n) {
    return '<span class="sq" aria-hidden="true">' + esc(n) + '</span>';
  }

  // One flat tile. o = { n, state, tag ('span' | 'a' | 'button'), cls?, attrs? (pre-escaped), current? }
  function tile(o) {
    const tag = o.tag || 'span';
    const state = STATES.includes(o.state) ? o.state : 'untried';
    const cls = ['tile', 'tile--' + state, o.current ? 'is-current' : '', o.cls || ''].filter(Boolean).join(' ');
    return '<' + tag + ' class="' + cls + '"' + (o.attrs || '') + '>' + esc(o.n) + '</' + tag + '>';
  }

  // A list of tiles. o = { items: [html] (each goes in an <li>), cls?, attrs? (pre-escaped) }
  function list(o) {
    return '<ol class="tiles' + (o.cls ? ' ' + o.cls : '') + '"' + (o.attrs || '') + '>' +
      o.items.map(t => '<li>' + t + '</li>').join('') + '</ol>';
  }

  // The question line: [16] question type ............ 2점
  // o = { level (1 | 2, default 2), id? }. The prompt is exam text (the section's own label).
  function questionLine(lesson, o) {
    const opts = o || {};
    const tag = opts.level === 1 ? 'h1' : 'h2';
    const sec = section(lesson.section);
    const label = sec ? splitSectionLabel(sec.label).text : '';
    return '<header class="qline">' + square(lesson.num) +
      '<' + tag + ' class="qline__prompt" lang="ko"' + (opts.id ? ' id="' + esc(opts.id) + '"' : '') + '>' +
      '<span class="sr-only">' + esc(lesson.num) + '번 · </span>' + esc(label) + '</' + tag + '>' +
      '<span class="pts"><span class="num">' + points(lesson) + '</span>점</span></header>';
  }

  const Tiles = { STATES, stateOf, stateOfAttempt, stateOfPick, points, square, tile, list, questionLine };

  if (typeof window !== 'undefined') window.Tiles = Tiles;
  if (typeof module !== 'undefined') module.exports = Tiles;
})();
