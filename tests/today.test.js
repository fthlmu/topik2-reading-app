// today.test.js: when 시작 / 한 세트 더 runs the review deck before the sprint.
// The deck goes first only before the day's first set: once a set is finished today,
// 한 세트 더 opens the next sprint directly (the deck stays one tap away under 덱만 보기).
const assert = require('assert');
global.window = global.window || {};
const TodayScreen = require('../js/screens/today.js');

const { deckFirst } = TodayScreen;
const DONE = { mode: 'sprint', right: 1, total: 5, qs: [5, 10, 16, 25, 46], states: [] };

// First set of the day: cards due → deck first; nothing due → straight to the sprint.
assert.strictEqual(deckFirst(8, null), true, 'cards due before the first set: deck first');
assert.strictEqual(deckFirst(0, null), false, 'nothing due: sprint at once');

// A set already finished today: 한 세트 더 skips the deck, even with new cards due.
assert.strictEqual(deckFirst(8, DONE), false, 'after a finished set: next sprint, not the deck');
assert.strictEqual(deckFirst(0, DONE), false);
assert.strictEqual(deckFirst(3, { ...DONE, mode: 'mock' }), false, 'a finished mock counts too');

// Bad input never sends anyone to the deck.
assert.strictEqual(deckFirst(undefined, null), false);
assert.strictEqual(deckFirst(-1, null), false);
