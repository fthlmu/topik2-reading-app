const assert = require('assert');
global.window = global.window || {};
const SRS = require('../js/srs.js');

function memStore() {
  const m = {};
  return {
    getItem: k => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: k => { delete m[k]; },
    _raw: m
  };
}
function fresh() { const s = memStore(); SRS._useStorage(s); return s; }
function rec(s, key) { return JSON.parse(s._raw.topik2_srs)[key]; }

const today = SRS._todayStr();
const iv = [1, 2, 4, 8, 16];

// keyOf / parseKey round-trip
assert.strictEqual(SRS.keyOf(16, 'v', 2), 'Q16:v:2');
assert.deepStrictEqual(SRS.parseKey('Q16:g:0'), { q: 16, kind: 'g', idx: 0 });
assert.deepStrictEqual(SRS.parseKey(SRS.keyOf(5, 'v', 11)), { q: 5, kind: 'v', idx: 11 });
assert.strictEqual(SRS.parseKey('garbage'), null);

// seed idempotent
let s = fresh();
SRS.seed('Q1:v:0');
assert.deepStrictEqual(rec(s, 'Q1:v:0'), { box: 1, due: today, seen: 0, wrong: 0, added: today });
SRS.record('Q1:v:0', true);
SRS.seed('Q1:v:0');
assert.strictEqual(rec(s, 'Q1:v:0').box, 2, 'seed must not reset existing record');
SRS.seedMany(['Q1:v:0', 'Q1:v:1']);
assert.strictEqual(SRS.stats().total, 2);

// right climbs to max box 5, never above; due follows intervals
s = fresh();
const k = 'Q2:v:0';
for (let i = 1; i <= 7; i++) {
  const r = SRS.record(k, true);
  const expectBox = Math.min(i + 1, 5);
  assert.strictEqual(r.box, expectBox);
  assert.strictEqual(r.due, SRS._addDays(today, iv[expectBox - 1]));
}
assert.strictEqual(rec(s, k).seen, 7);

// wrong resets to box 1, increments wrong, due = today + 1
const r = SRS.record(k, false);
assert.strictEqual(r.box, 1);
assert.strictEqual(r.wrong, 1);
assert.strictEqual(r.due, SRS._addDays(today, 1));
SRS.record(k, false);
assert.strictEqual(rec(s, k).wrong, 2);

// _addDays crosses month/year boundaries
assert.strictEqual(SRS._addDays('2026-12-31', 1), '2027-01-01');
assert.strictEqual(SRS._addDays('2026-03-01', -1), '2026-02-28');

// dueKeys ordering and limit (state written directly for determinism)
s = fresh();
s.setItem('topik2_srs', JSON.stringify({
  'Q1:v:0': { box: 3, due: today, seen: 2, wrong: 0, added: today },
  'Q1:v:1': { box: 1, due: today, seen: 3, wrong: 2, added: today },
  'Q1:v:2': { box: 1, due: today, seen: 0, wrong: 0, added: today },
  'Q1:v:3': { box: 2, due: SRS._addDays(today, 5), seen: 1, wrong: 0, added: today }
}));
assert.deepStrictEqual(SRS.dueKeys(), ['Q1:v:1', 'Q1:v:2', 'Q1:v:0']);
assert.deepStrictEqual(SRS.dueKeys(2), ['Q1:v:1', 'Q1:v:2']);
assert.strictEqual(SRS.dueKeys(8, SRS._addDays(today, 5)).length, 4);
assert.deepStrictEqual(SRS.dueKeys(0), []);

// stats
const st = SRS.stats();
assert.strictEqual(st.total, 4);
assert.strictEqual(st.due, 3);
assert.deepStrictEqual(st.byBox, [2, 1, 1, 0, 0]);

// remove
SRS.remove('Q1:v:1');
assert.strictEqual(SRS.stats().total, 3);
assert.strictEqual(rec(s, 'Q1:v:1'), undefined);
SRS.remove('Q9:v:9'); // no-op, no throw

// broken storage degrades silently
const boom = () => { throw new Error('x'); };
SRS._useStorage({ getItem: boom, setItem: boom, removeItem: boom });
assert.doesNotThrow(() => {
  SRS.seed('Q1:v:0'); SRS.record('Q1:v:0', true); SRS.stats(); SRS.dueKeys(); SRS.remove('Q1:v:0');
});
