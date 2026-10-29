const assert = require('assert');
global.window = global.window || {};
const PACE = require('../js/pace.js');

// secFor
assert.strictEqual(PACE.secFor('A'), 40);
assert.strictEqual(PACE.secFor('R'), 120);
assert.strictEqual(PACE.secFor('Z'), 90, 'unknown id defaults to 90');
assert.strictEqual(PACE.secFor(undefined), 90);

// tierOf
assert.strictEqual(PACE.tierOf('C'), 'short');
assert.strictEqual(PACE.tierOf('J'), 'medium');
assert.strictEqual(PACE.tierOf('Q'), 'long');

// isOver boundary: exactly at budget is not over
assert.strictEqual(PACE.isOver(40000, 'A'), false);
assert.strictEqual(PACE.isOver(40001, 'A'), true);
assert.strictEqual(PACE.isOver(0, 'A'), false);

// ratio rounding to 2 dp
assert.strictEqual(PACE.ratio(40000, 'A'), 1);
assert.strictEqual(PACE.ratio(20000, 'A'), 0.5);
assert.strictEqual(PACE.ratio(10000, 'C'), 0.33);
assert.strictEqual(PACE.ratio(50000, 'C'), 1.67);

// fmt
assert.strictEqual(PACE.fmt(0), '0:00');
assert.strictEqual(PACE.fmt(47000), '0:47');
assert.strictEqual(PACE.fmt(125000), '2:05');
assert.strictEqual(PACE.fmt(3600000), '60:00');

// constants
assert.strictEqual(PACE.EXAM_TOTAL_SEC, 4200);
assert.strictEqual(global.window.PACE, PACE);
