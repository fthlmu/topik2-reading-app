// review-mock.js: the mock-exam variant of Review (#/review/<id> when the
// session's mode is 'mock'): score over every mock question, a per-section
// table (questions · right · average time against pace as 1.2×) and the
// wrong-only filter bar. Pure HTML builders over the rows review.js makes
// ({ q, lesson, attempt }); a blank question gets a display-only attempt.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, section, splitSectionLabel, formatTime } = Util;

  const PACE = () => (typeof window !== 'undefined' && window.PACE) || require('../pace.js');

  // Never stored: it only lets Review show a blank question like a wrong one.
  function unanswered(q) {
    return { q, chosen: null, correct: false, sure: null, ms: null, unanswered: true };
  }

  function sectionText(id) {
    const sec = section(id);
    return sec ? splitSectionLabel(sec.label).text : '';
  }

  function isOver(r) {
    return Number.isFinite(r.attempt.ms) && PACE().isOver(r.attempt.ms, r.lesson.section);
  }

  // One entry per section, in exam order: { id, title, n, right, ratio (1 decimal) | null }.
  function sectionStats(rows) {
    const ids = [...new Set(rows.map(r => r.lesson.section))];
    return ids.map(id => {
      const mine = rows.filter(r => r.lesson.section === id);
      const timed = mine.filter(r => Number.isFinite(r.attempt.ms));
      const mean = timed.length
        ? timed.reduce((s, r) => s + PACE().ratio(r.attempt.ms, id), 0) / timed.length
        : null;
      return {
        id, title: sectionText(id), n: mine.length,
        right: mine.filter(r => r.attempt.correct).length,
        ratio: mean === null ? null : Math.round(mean * 10) / 10
      };
    });
  }

  function headHtml(session, rows, toggleHtml) {
    const right = rows.filter(r => r.attempt.correct).length;
    const answered = rows.filter(r => !r.attempt.unanswered).length;
    const pct = rows.length ? Math.round((100 * right) / rows.length) : 0;
    const when = new Date(session.at);
    const stamp = isNaN(when) ? '' : (when.getMonth() + 1) + '월 ' + when.getDate() + '일 ' + formatTime(when);
    const P = PACE();
    return '<header class="screen-head review__head">' +
      '<div class="review__titles"><p class="eyebrow">모의고사 결과 · ' + esc(stamp) + '</p>' +
      '<h1 class="screen-title">점수 <span class="num">' + right + ' / ' + rows.length + '</span> ' +
      '<span class="review__pct num">' + pct + '%</span></h1>' +
      '<p class="screen-sub">시간 <span class="num">' + esc(P.fmt(session.durationMs)) + '</span> / ' +
      '<span class="num">' + esc(P.fmt(P.EXAM_TOTAL_SEC * 1000)) + '</span> · 답함 <span class="num">' + answered +
      '</span> · 미응답 <span class="num">' + (rows.length - answered) + '</span> · 시간 초과 <span class="num">' +
      rows.filter(isOver).length + '</span></p></div>' + toggleHtml + '</header>';
  }

  function ratioCell(ratio) {
    if (ratio === null) return '<td class="mock-table__num">-</td>';
    return '<td class="mock-table__num' + (ratio > 1 ? ' is-over' : '') + '">' + ratio.toFixed(1) + '×</td>';
  }

  function tableHtml(rows) {
    const body = sectionStats(rows).map(s =>
      '<tr' + (s.right < s.n ? ' class="is-weak"' : '') + '><th scope="row">' +
      '<span class="mock-table__id num">' + esc(s.id) + '</span> <span lang="ko">' + esc(s.title) + '</span></th>' +
      '<td class="mock-table__num">' + s.n + '</td><td class="mock-table__num">' + s.right + '</td>' +
      ratioCell(s.ratio) + '</tr>').join('');
    return '<table class="mock-table"><caption class="sr-only">유형별 결과</caption>' +
      '<thead><tr><th scope="col">유형</th><th scope="col" class="mock-table__num">문항</th>' +
      '<th scope="col" class="mock-table__num">정답</th><th scope="col" class="mock-table__num">속도</th></tr></thead>' +
      '<tbody>' + body + '</tbody></table>' +
      '<p class="mock-table__note">속도 = 쓴 시간 ÷ 기준 시간 · <span class="num">1.0×</span> = 기준, 클수록 느림</p>';
  }

  function visibleRows(rows, showAll) {
    return showAll ? rows : rows.filter(r => !r.attempt.correct);
  }

  function filterHtml(rows, showAll) {
    const wrong = rows.filter(r => !r.attempt.correct).length;
    const text = showAll
      ? '모든 문항 <span class="num">' + rows.length + '</span>개'
      : wrong ? '틀리거나 비운 문항 <span class="num">' + wrong + '</span>개만 보는 중' : '모두 맞았습니다';
    return '<div class="review__filter"><p class="review__filter-text">' + text + '</p>' +
      '<button type="button" class="toggle" data-act="toggle-all" aria-pressed="' + showAll + '">모두 보기 ' +
      '<span class="num">' + rows.length + '</span></button></div>';
  }

  const ReviewMock = { unanswered, sectionStats, headHtml, tableHtml, visibleRows, filterHtml };

  if (typeof window !== 'undefined') window.ReviewMock = ReviewMock;
  if (typeof module !== 'undefined') module.exports = ReviewMock;
})();
