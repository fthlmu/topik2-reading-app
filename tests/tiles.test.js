// tiles.test.js: the numbered square and its tiles (replaces omr.test.js). Tiles.stateOf (six
// question states onto five tile states), stateOfAttempt, stateOfPick, points, the HTML
// builders (square, tile, list, questionLine), StoreViews.cardMap end to end, the run tiles
// (Runner.tilesHtml), the Map and Today palette (MapScreen.html), and the 사용법 page.
const assert = require('assert');
global.window = global.window || {};
require('../lessons.js');
const Util = require('../js/util.js');
const Tiles = require('../js/render/tiles.js');
global.window.Tiles = Tiles;
const StoreViews = require('../js/store-views.js');
const Runner = require('../js/screens/runner.js');
const Store = require('../js/store.js');
const MapScreen = require('../js/screens/map.js');
const GuideScreen = require('../js/screens/guide.js');

// 1. Six stored states map onto five tile states; "seen" (opened in Study only) stays untried.
{
  const expected = {
    'untried': 'untried', 'seen': 'untried', 'right-sure': 'correct',
    'right-unsure': 'unsure', 'wrong': 'wrong', 'recovered': 'correct'
  };
  Object.keys(expected).forEach(st => assert.strictEqual(Tiles.stateOf(st), expected[st], st));
  assert.strictEqual(Tiles.stateOf('nonsense'), 'untried');
  assert.strictEqual(Tiles.stateOf(undefined), 'untried');
  assert.deepStrictEqual(Tiles.STATES, ['untried', 'answered', 'correct', 'unsure', 'wrong']);
}

// 2. A graded attempt: wrong = wrong (even if unsure), right + unsure = unsure, blank = untried.
{
  assert.strictEqual(Tiles.stateOfAttempt({ correct: true, sure: true }), 'correct');
  assert.strictEqual(Tiles.stateOfAttempt({ correct: true, sure: null }), 'correct');
  assert.strictEqual(Tiles.stateOfAttempt({ correct: true, sure: false }), 'unsure');
  assert.strictEqual(Tiles.stateOfAttempt({ correct: false, sure: false }), 'wrong');
  assert.strictEqual(Tiles.stateOfAttempt({ correct: false, unanswered: true }), 'untried');
  assert.strictEqual(Tiles.stateOfAttempt(null), 'untried');
  assert.strictEqual(Tiles.stateOfAttempt({ correct: null }), 'untried');
}

// 3. A pick in a run (before grading) is "answered"; no pick stays untried.
{
  assert.strictEqual(Tiles.stateOfPick(2), 'answered');
  assert.strictEqual(Tiles.stateOfPick(null), 'untried');
  assert.strictEqual(Tiles.stateOfPick(undefined), 'untried');
}

// 4. Points come from the group instruction "(각 2점)": 2 for every one of the 50 questions.
{
  for (let q = 1; q <= 50; q++) assert.strictEqual(Tiles.points(Util.lesson(q)), 2, 'points Q' + q);
  assert.strictEqual(Tiles.points({ groupInstruction: { kr: '[1~2] 고르십시오. (각 3점)' } }), 3);
  assert.strictEqual(Tiles.points({}), 2, 'no instruction: TOPIK II reading default');
  assert.strictEqual(Tiles.points(null), 2);
}

// 5. HTML builders: squares and tiles escape their label; a bad state falls back to untried.
{
  assert.strictEqual(Tiles.square(16), '<span class="sq" aria-hidden="true">16</span>');
  assert.strictEqual(Tiles.square('<'), '<span class="sq" aria-hidden="true">&lt;</span>');
  assert.strictEqual(Tiles.tile({ n: 3, state: 'wrong' }), '<span class="tile tile--wrong">3</span>');
  assert.strictEqual(Tiles.tile({ n: 3, state: 'bogus' }), '<span class="tile tile--untried">3</span>');
  const link = Tiles.tile({ n: 16, state: 'correct', tag: 'a', current: true, attrs: ' href="#/study/16"' });
  assert.strictEqual(link, '<a class="tile tile--correct is-current" href="#/study/16">16</a>');
  const list = Tiles.list({ items: ['<i>a</i>', '<i>b</i>'], cls: 'x', attrs: ' aria-label="y"' });
  assert.strictEqual(list, '<ol class="tiles x" aria-label="y"><li><i>a</i></li><li><i>b</i></li></ol>');

  const line = Tiles.questionLine(Util.lesson(16), { level: 1, id: 'h' });
  assert.ok(line.includes('<span class="sq" aria-hidden="true">16</span>'));
  assert.ok(line.includes('<h1 class="qline__prompt" lang="ko" id="h">'));
  assert.ok(line.includes('<span class="pts"><span class="num">2</span>점</span>'), 'point chip');
  assert.ok(Tiles.questionLine(Util.lesson(16)).includes('<h2 class="qline__prompt"'), 'h2 by default');
}

// 6. cardMap: status per question plus the pick of the last graded attempt (study picks ignored),
//    and the tile state that follows from it.
{
  const state = {
    attempts: [
      { q: 1, mode: 'sprint', chosen: 2, correct: false, sure: true },
      { q: 1, mode: 'study', chosen: 1, correct: true, sure: null },
      { q: 2, mode: 'study', chosen: 3, correct: false, sure: null },
      { q: 3, mode: 'mock', chosen: 4, correct: true, sure: null },
      { q: 4, mode: 'sprint', chosen: 1, correct: false, sure: true },
      { q: 4, mode: 'sprint', chosen: 4, correct: true, sure: false }
    ]
  };
  const card = StoreViews.cardMap(null, state);
  assert.strictEqual(Object.keys(card).length, 50);
  assert.deepStrictEqual(card[1], { status: 'wrong', chosen: 2 });
  assert.deepStrictEqual(card[2], { status: 'seen', chosen: null });
  assert.deepStrictEqual(card[3], { status: 'right-sure', chosen: 4 });
  assert.deepStrictEqual(card[4], { status: 'right-unsure', chosen: 4 });
  assert.deepStrictEqual(card[5], { status: 'untried', chosen: null });
  assert.deepStrictEqual([1, 2, 3, 4, 5].map(q => Tiles.stateOf(card[q].status)),
    ['wrong', 'untried', 'correct', 'unsure', 'untried']);
}

// 7. Run tiles: picks tinted, the current one marked; with pos a tile is a jump button.
{
  const html = Runner.tilesHtml({ label: '스프린트 · 2문제', rows: [{ q: 16, chosen: 2, current: false }, { q: 17, chosen: null, current: true }] });
  assert.ok(html.startsWith('<ol class="tiles run-tiles" aria-label="스프린트 · 2문제">'));
  assert.ok(html.includes('tile tile--answered') && html.includes('tile tile--untried is-current'));
  assert.ok(html.includes('aria-label="16번 · 답 ②"') && html.includes('aria-label="17번 · 답 없음 · 지금 문제"'));
  const jump = Runner.tilesHtml({ label: 'x', rows: [{ q: 5, chosen: 1, current: true, pos: 3 }] });
  assert.ok(jump.includes('<button class="tile tile--answered" type="button" data-pos="3"'));
  assert.ok(jump.includes('aria-current="step"'));
}

// 8. Map and Today palette from the stored record.
{
  const m = new Map();
  const ls = { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
  const prev = global.window.localStorage;
  global.window.localStorage = ls;
  global.localStorage = ls;
  try {
    Store.resetCache();
    Store.load();
    global.window.Store = Store;
    Store.recordAttempt({ q: 16, mode: 'sprint', chosen: Util.lesson(16).answer, correct: true, sure: true });
    Store.recordAttempt({ q: 17, mode: 'sprint', chosen: 1, correct: false, sure: true });
    const full = MapScreen.html({ compact: false });
    assert.strictEqual((full.match(/class="sheet map-sec"/g) || []).length, 18, 'one sheet per 묶음');
    assert.strictEqual((full.match(/<a class="tile /g) || []).length, 50, 'one linked tile per question');
    assert.ok(full.includes('<a class="tile tile--correct" href="#/study/16"'));
    assert.ok(full.includes('<a class="tile tile--wrong" href="#/study/17"'));
    const compact = MapScreen.html({ compact: true });
    assert.ok(compact.startsWith('<a class="palette-link" href="#/map" aria-label="지도 열기 · 본 문제 2 / 50">'));
    assert.strictEqual((compact.match(/class="tile /g) || []).length, 50);
  } finally {
    global.window.localStorage = prev;
    Store.resetCache();
  }
}

// 9. 사용법: every screen, every tile state and every shortcut key the screens handle.
{
  const html = GuideScreen.html();
  ['오늘', '지도', '공부', '스프린트', '리뷰', '덱', '모의고사'].forEach(s =>
    assert.ok(html.includes('<dt>' + s + '</dt>'), 'guide explains ' + s));
  Tiles.STATES.forEach(st => assert.ok(html.includes('tile--' + st), 'guide shows ' + st));
  ['G', 'T', 'Esc', 'Tab', '1', '4', 'S', 'U', 'J', 'K', 'Space', 'Enter', '←', '→'].forEach(k =>
    assert.ok(html.includes('<kbd>' + k + '</kbd>'), 'guide key ' + k));
  assert.ok(!html.includes(String.fromCharCode(0x2014)), 'no em dash');
}
