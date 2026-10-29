// omr.test.js: the answer-card marks. Omr.markOf (six question states onto five
// marks), markOfAttempt, cells (which oval gets which mark), single, the HTML
// builders (row, digit columns, legend, strip), and StoreViews.cardMap.
const assert = require('assert');
global.window = global.window || {};
require('../lessons.js');
const Util = require('../js/util.js');
const Omr = require('../js/render/omr.js');
const StoreViews = require('../js/store-views.js');

// 1. Six stored states map onto the five marks; "seen" (opened in Study only) stays hollow.
{
  const expected = {
    'untried': 'hollow', 'seen': 'hollow', 'right-sure': 'ok',
    'right-unsure': 'unsure', 'wrong': 'bad', 'recovered': 'ok'
  };
  Object.keys(expected).forEach(st => assert.strictEqual(Omr.markOf(st), expected[st], st));
  assert.strictEqual(Omr.markOf('nonsense'), 'hollow');
  assert.strictEqual(Omr.markOf(undefined), 'hollow');
}

// 2. A graded attempt: wrong = bad (even if unsure), right + unsure = unsure, blank = hollow.
{
  assert.strictEqual(Omr.markOfAttempt({ correct: true, sure: true }), 'ok');
  assert.strictEqual(Omr.markOfAttempt({ correct: true, sure: null }), 'ok');
  assert.strictEqual(Omr.markOfAttempt({ correct: true, sure: false }), 'unsure');
  assert.strictEqual(Omr.markOfAttempt({ correct: false, sure: false }), 'bad');
  assert.strictEqual(Omr.markOfAttempt({ correct: false, unanswered: true }), 'hollow');
  assert.strictEqual(Omr.markOfAttempt(null), 'hollow');
  assert.strictEqual(Omr.markOfAttempt({ correct: null }), 'hollow');
}

// 3. cells: one state per choice; the red ring marks the right answer, the slash your wrong fill.
{
  assert.deepStrictEqual(Omr.cells('hollow', 2, 1), ['', '', '', '']);
  assert.deepStrictEqual(Omr.cells('ok', 3, 3), ['', '', 'fill ok', '']);
  assert.deepStrictEqual(Omr.cells('unsure', 4, 4), ['', '', '', 'fill unsure']);
  assert.deepStrictEqual(Omr.cells('bad', 2, 1), ['ok', 'fill bad', '', '']);
  assert.deepStrictEqual(Omr.cells('picked', 2, null), ['', 'fill', '', '']);
  assert.deepStrictEqual(Omr.cells('picked', null, null), ['', '', '', '']);
  assert.deepStrictEqual(Omr.cells('ok', null, 2), ['', 'fill ok', '', ''], 'right with no stored pick: fill the answer');
  assert.deepStrictEqual(Omr.cells('bad', null, 3), ['', '', 'ok', ''], 'wrong with no stored pick: ring only');
  assert.strictEqual(Omr.cells('hollow', null, null, 10).length, 10);
}

// 4. single(): one oval per question (Today's set row, review verdicts).
{
  assert.strictEqual(Omr.single('hollow'), '');
  assert.strictEqual(Omr.single('picked'), 'fill');
  assert.strictEqual(Omr.single('ok'), 'fill ok');
  assert.strictEqual(Omr.single('unsure'), 'fill unsure');
  assert.strictEqual(Omr.single('bad'), 'fill bad');
  assert.strictEqual(Omr.single('???'), '');
}

// 5. HTML builders: ovals are aria-hidden, labels escaped, digits filled at the right place.
{
  assert.strictEqual(Omr.oval(1, 'fill ok', 'lg'), '<span class="ov ov--lg fill ok" aria-hidden="true">1</span>');
  assert.strictEqual(Omr.oval('<', ''), '<span class="ov" aria-hidden="true">&lt;</span>');
  const row = Omr.row({ q: 16, set: 'F', cells: ['ok', 'fill bad', '', ''], tag: 'a', attrs: ' href="#/study/16"' });
  assert.ok(row.startsWith('<a class="omr-row" href="#/study/16">'));
  assert.ok(row.includes('omr-row__set') && row.includes('>F<') && row.includes('>16<'));
  assert.strictEqual((row.match(/class="ov/g) || []).length, 4);
  assert.ok(!Omr.row({ q: 2, cells: [''] }).includes('omr-row__set'), 'no set letter unless given');

  const d = Omr.digitColumns(73, 2);
  assert.strictEqual((d.match(/class="dcol"/g) || []).length, 2);
  assert.strictEqual((d.match(/ov fill/g) || []).length, 2, 'one filled oval per column');
  assert.ok(d.includes('dcol__box">7<') && d.includes('dcol__box">3<'));
  assert.ok(Omr.digitColumns(5, 2).includes('dcol__box">0<'), 'padded to two columns');
  assert.strictEqual((Omr.digitColumns(120, 2).match(/class="dcol"/g) || []).length, 3);
  assert.strictEqual((Omr.ticks(3).match(/omr-tick"/g) || []).length, 3);

  const legend = Omr.legend();
  ['푼 문제', '정답', '오답', '애매'].forEach(t => assert.ok(legend.includes(t), 'legend ' + t));

  const strip = Omr.strip({ label: 'A 묶음 · 1 ~ 2번', rows: ['<div>r</div>'], keys: '<kbd>1</kbd>', pinned: true });
  assert.ok(strip.includes('omr-dock omr-dock--pinned') && strip.includes('omr-panel--ticks'));
  assert.ok(strip.includes('<li><div>r</div></li>') && strip.includes('omr-strip__keys'));
  assert.ok(!Omr.strip({ label: 'x', rows: [], keys: '' }).includes('omr-strip__keys'));
}

// 6. cardMap: status per question plus the pick of the last graded attempt (study picks ignored).
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

  // End to end: Q1's key is ① (lessons.js); the wrong pick ② gets the slash, ① the ring.
  assert.strictEqual(Util.lesson(1).answer, 1);
  assert.deepStrictEqual(Omr.cells(Omr.markOf(card[1].status), card[1].chosen, Util.lesson(1).answer),
    ['ok', 'fill bad', '', '']);
}
