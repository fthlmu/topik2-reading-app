// map.js: the answer card (답안지). #/map prints every section (묶음) as a header
// with its sprint accuracy, then one row per question (number + four ovals);
// a row opens the question in Study. MapScreen.html({ compact: true }) is
// Today's 5 x 10 progress card, one link to #/map.
// Marks come from the last sprint/mock attempt (Store.cardMap + Omr.cells).
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('../util.js');
  const { esc, sections, splitSectionLabel, total } = Util;

  const STATUS_LABEL = {
    'untried': '안 풀어 봄',
    'seen': '봄',
    'right-sure': '정답 · 확실',
    'right-unsure': '정답 · 애매',
    'wrong': '오답',
    'recovered': '오답 → 정답'
  };
  const COLS = 5;

  const Omr = () => root.Omr;

  function rangeOf(sec) {
    const out = [];
    for (let q = sec.range[0]; q <= sec.range[1]; q++) out.push(q);
    return out;
  }

  function cellsFor(q, entry) {
    const l = Util.lesson(q);
    const e = entry || { status: 'untried', chosen: null };
    return Omr().cells(Omr().markOf(e.status), e.chosen, l ? l.answer : null);
  }

  function rowLabel(q, entry) {
    const e = entry || { status: 'untried', chosen: null };
    return q + '번 · ' + STATUS_LABEL[e.status] + (e.chosen ? ' · 고른 답 ' + Util.circled(e.chosen) : '');
  }

  // ── Today: 5 columns x 10 rows; set letters on each section's first question ──

  function compact(card) {
    const firstOf = {};
    sections().forEach(sec => { firstOf[sec.range[0]] = sec.id; });
    const per = Math.ceil(total() / COLS);
    const cols = Array.from({ length: COLS }, (_, c) => {
      const rows = [];
      for (let q = c * per + 1; q <= Math.min(total(), (c + 1) * per); q++) {
        rows.push(Omr().row({ q, set: firstOf[q] || '', cells: cellsFor(q, card[q]) }));
      }
      return '<div class="omr-grid__col">' + rows.join('') + '</div>';
    }).join('');
    const seen = Object.values(card).filter(e => e.status !== 'untried').length;
    return '<a class="omr-panel omr-grid" href="#/map" aria-label="지도 열기 · 본 문제 ' + seen + ' / ' + total() + '">' +
      cols + '</a>';
  }

  // ── #/map: one printed section per 묶음 ──

  function accText(acc) {
    return acc && acc.pct !== null ? acc.pct + '%' : '-';
  }

  function rowLink(q, entry) {
    return '<li>' + Omr().row({
      tag: 'a', cls: 'omr-row--link', q, size: 'md', cells: cellsFor(q, entry),
      attrs: ' href="#/study/' + q + '" aria-label="' + esc(rowLabel(q, entry)) + '"'
    }) + '</li>';
  }

  function sectionHtml(sec, card, acc) {
    const label = splitSectionLabel(sec.label);
    const a = acc[sec.id];
    const accTitle = a && a.tried ? '스프린트 정답 ' + a.right + ' / ' + a.tried : '스프린트 기록 없음';
    return '<li class="map-sec">' +
      '<div class="map-sec__head">' +
      '<span class="map-sec__id">' + esc(sec.id) + '</span>' +
      '<span class="map-sec__range">' + esc(label.range) + '</span>' +
      '<span class="map-sec__label" lang="ko" data-line-en="' + esc(sec.sublabel) + '">' + esc(label.text) + '</span>' +
      '<span class="map-sec__acc" title="' + esc(accTitle) + '"><span class="sr-only">정답률 </span>' +
      esc(accText(a)) + '</span>' +
      '</div>' +
      '<ol class="map-sec__rows">' + rangeOf(sec).map(q => rowLink(q, card[q])).join('') + '</ol></li>';
  }

  function counts(card) {
    const values = Object.values(card).map(e => e.status);
    return {
      seen: values.filter(s => s !== 'untried').length,
      graded: values.filter(s => s !== 'untried' && s !== 'seen').length,
      total: values.length
    };
  }

  function html(opts) {
    const o = opts || {};
    const card = root.Store.cardMap();
    if (o.compact) return compact(card);
    const acc = root.Store.sectionAccuracy(sections());
    return '<div class="omr-panel map-card"><ol class="map-secs">' +
      sections().map(sec => sectionHtml(sec, card, acc)).join('') + '</ol></div>';
  }

  function mount(rootEl) {
    const c = counts(root.Store.cardMap());
    rootEl.innerHTML =
      '<header class="screen-head map__head"><div>' +
      '<p class="eyebrow">18묶음 · 50문항</p>' +
      '<h1 class="screen-title">지도</h1>' +
      '<p class="screen-sub"><span class="num">' + c.seen + '</span> / ' + c.total + ' 봄 · ' +
      '채점 <span class="num">' + c.graded + '</span> · 정답률은 스프린트 기록 기준</p></div>' +
      Omr().legend() + '</header>' + html({ compact: false });
  }

  const MapScreen = { title: '지도', mount, html, STATUS_LABEL };

  if (typeof window !== 'undefined') window.MapScreen = MapScreen;
  if (typeof module !== 'undefined') module.exports = MapScreen;
})();
