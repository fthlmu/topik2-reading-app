// map.js: the question map (#/map). Every section (묶음) is a white sheet with a header
// (letter, range, label, sprint accuracy), then one numbered tile per question; a tile
// opens the question in Study. MapScreen.html({ compact: true }) is Today's palette:
// all 50 tiles inside one link to #/map.
// Tile state comes from the last sprint/mock attempt (Store.cardMap + Tiles.stateOf).
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

  const T = () => root.Tiles;

  function rangeOf(sec) {
    const out = [];
    for (let q = sec.range[0]; q <= sec.range[1]; q++) out.push(q);
    return out;
  }

  function entryOf(entry) {
    return entry || { status: 'untried', chosen: null };
  }

  function rowLabel(q, entry) {
    const e = entryOf(entry);
    return q + '번 · ' + STATUS_LABEL[e.status] + (e.chosen ? ' · 고른 답 ' + Util.circled(e.chosen) : '');
  }

  // ── Today: the 50 tiles as one link to the map ──

  function compact(card) {
    const tiles = [];
    for (let q = 1; q <= total(); q++) tiles.push(T().tile({ n: q, state: T().stateOf(entryOf(card[q]).status), cls: 'tile--sm' }));
    const seen = Object.values(card).filter(e => e.status !== 'untried').length;
    return '<a class="palette-link" href="#/map" aria-label="지도 열기 · 본 문제 ' + seen + ' / ' + total() + '">' +
      '<span class="palette-link__tiles" aria-hidden="true">' + tiles.join('') + '</span></a>';
  }

  // ── #/map: one sheet per 묶음 ──

  function accText(acc) {
    return acc && acc.pct !== null ? acc.pct + '%' : '-';
  }

  function tileLink(q, entry) {
    return T().tile({
      n: q, state: T().stateOf(entryOf(entry).status), tag: 'a',
      attrs: ' href="#/study/' + q + '" aria-label="' + esc(rowLabel(q, entry)) + '"'
    });
  }

  function sectionHtml(sec, card, acc) {
    const label = splitSectionLabel(sec.label);
    const a = acc[sec.id];
    const accTitle = a && a.tried ? '스프린트 정답 ' + a.right + ' / ' + a.tried : '스프린트 기록 없음';
    return '<li class="sheet map-sec">' +
      '<div class="map-sec__head">' +
      '<span class="map-sec__id">' + esc(sec.id) + '</span>' +
      '<span class="map-sec__range num">' + esc(label.range) + '</span>' +
      '<span class="map-sec__label" lang="ko" data-line-en="' + esc(sec.sublabel) + '">' + esc(label.text) + '</span>' +
      '<span class="map-sec__acc num" title="' + esc(accTitle) + '"><span class="sr-only">정답률 </span>' +
      esc(accText(a)) + '</span>' +
      '</div>' +
      T().list({ items: rangeOf(sec).map(q => tileLink(q, card[q])), cls: 'map-sec__tiles' }) + '</li>';
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
    return '<ol class="map-secs">' + sections().map(sec => sectionHtml(sec, card, acc)).join('') + '</ol>';
  }

  function mount(rootEl) {
    const c = counts(root.Store.cardMap());
    rootEl.innerHTML =
      '<header class="screen-head map__head">' +
      '<h1 class="screen-title">지도</h1>' +
      '<p class="screen-sub"><span class="num">' + c.seen + '</span> / ' + c.total + ' 봄 · ' +
      '채점 <span class="num">' + c.graded + '</span></p></header>' + html({ compact: false });
  }

  const MapScreen = { title: '지도', mount, html, STATUS_LABEL };

  if (typeof window !== 'undefined') window.MapScreen = MapScreen;
  if (typeof module !== 'undefined') module.exports = MapScreen;
})();
