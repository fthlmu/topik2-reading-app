// ui-strings.test.js: js/ui-strings.js (window.UI_EN) holds every line of the app's own
// Korean copy, and nothing else.
// Sources:
//   - Korean string literals (and template fragments) in index.html, js/app.js, js/util.js
//     (the date line), js/screens/*.js, js/render/*.js, js/strategies.js, js/deck-cards.js. Comments and
//     regex literals are skipped. Each literal is cut at HTML tags and quotes; attribute
//     values that people read (aria-label, title, placeholder, alt) count as lines too.
//   - js/strategies.js card titles and signal words (shown as chips); their English steps
//     and traps are English content and need no entry.
//   - lessons.js section labels and group instructions: data, but shown as UI lines.
// Every Korean piece is normalized with GlossText.uiKey, the same normalizer the page uses.
const assert = require('assert');
global.window = global.window || {};
require('../js/ui-strings.js');
const GT = require('../js/gloss-text.js');
const { collect, jsStrings, piecesOf, SYLLABLE } = require('./ui-copy.js');

const UI = global.window.UI_EN;
const need = collect();

// 1. The tokenizer itself: comments and regexes are not strings; quotes inside strings are.
assert.deepStrictEqual(jsStrings("// '주석'\nconst a = '하나'; /* \"둘\" */ const r = /'/g; x = \"셋 'q'\";"),
  ['하나', "셋 'q'"]);
assert.deepStrictEqual(jsStrings("return /^[1-4]$/.test(k) ? '가' : '나';"), ['가', '나']);
assert.deepStrictEqual(jsStrings('`앞 ${a ? \'x\' : "y"} 뒤`'), ['앞 ', ' 뒤']);
assert.deepStrictEqual(piecesOf('<a class="x" aria-label="지도 열기 · 본 문제 ').filter(p => SYLLABLE.test(p)),
  ['지도 열기 · 본 문제 ']);
assert.ok(piecesOf('</span>장 · 덱 전체 <span class="num">').includes('장 · 덱 전체 '));
assert.ok(need.size > 150, 'found the copy (' + need.size + ' lines)');

// 2. Every line has an entry with English and per-word glosses.
const missing = [...need.keys()].filter(k => !UI[k]);
assert.deepStrictEqual(missing.map(k => need.get(k) + ': ' + k), [], 'UI lines without a UI_EN entry');
const malformed = Object.keys(UI).filter(k => !UI[k] || typeof UI[k].en !== 'string' || !UI[k].en ||
  !UI[k].words || typeof UI[k].words !== 'object');
assert.deepStrictEqual(malformed, [], 'entries need en and words');

// 3. No stale entries: every key is still produced by some source, and is in normalized form.
const stale = Object.keys(UI).filter(k => !need.has(k));
assert.deepStrictEqual(stale, [], 'UI_EN entries no source produces');
const unnormalized = Object.keys(UI).filter(k => GT.uiKey(k) !== k);
assert.deepStrictEqual(unnormalized, [], 'keys must be in uiKey form');

// 4. Copy rules: no em dash in UI copy or in the table's English.
const EM_DASH = String.fromCharCode(0x2014);
const dashed = [...need.keys()].filter(k => k.includes(EM_DASH))
  .concat(Object.keys(UI).filter(k => UI[k].en.includes(EM_DASH)));
assert.deepStrictEqual(dashed, [], 'em dash in copy');
