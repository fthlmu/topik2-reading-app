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

// corrupt storage: a bad root or a bad card record never throws; bad entries are skipped and the raw
// value is copied to "topik2_srs.bak" before the cleaned deck is written back
{
  const BAK = 'topik2_srs.bak';
  assert.strictEqual(SRS.BAK_KEY, BAK);
  const good = { box: 2, due: today, seen: 1, wrong: 0, added: today };
  const noDeck = { total: 0, due: 0, byBox: [0, 0, 0, 0, 0] };

  // The reported case: a null card record.
  let st2 = fresh();
  st2.setItem('topik2_srs', '{"Q1:v:0":null}');
  assert.doesNotThrow(() => SRS.dueKeys());
  assert.deepStrictEqual(SRS.dueKeys(), []);
  assert.deepStrictEqual(SRS.stats(), noDeck);
  assert.strictEqual(st2._raw[BAK], '{"Q1:v:0":null}', 'raw corrupt value kept');
  assert.strictEqual(st2._raw.topik2_srs, '{}', 'deck rewritten clean');

  // Mixed: only the well-formed card survives, in the right box; the raw blob is the backup.
  st2 = fresh();
  const bad = {
    'Q1:v:0': good,
    'Q1:v:1': null,
    'Q1:v:2': { ...good, box: 9 },
    'Q1:v:3': { ...good, box: 0 },
    'Q1:v:4': { ...good, box: 1.5 },
    'Q1:v:5': { ...good, due: '2026-13-45' },
    'Q1:v:6': { ...good, due: 'soon' },
    'Q1:v:7': { ...good, due: 20261031 },
    'Q1:v:8': { ...good, seen: -1 },
    'Q1:v:9': { ...good, wrong: 'x' },
    'Q1:v:10': { ...good, added: null },
    'Q1:v:11': 'text',
    'Q1:v:12': [good],
    junk: good
  };
  Object.defineProperty(bad, '__proto__', { value: good, enumerable: true }); // an own "__proto__" key
  const mixed = JSON.stringify(bad);
  assert.ok(mixed.includes('"__proto__"'));
  st2.setItem('topik2_srs', mixed);
  assert.deepStrictEqual(SRS.dueKeys(), ['Q1:v:0']);
  assert.deepStrictEqual(SRS.stats(), { total: 1, due: 1, byBox: [0, 1, 0, 0, 0] });
  assert.strictEqual(st2._raw[BAK], mixed);
  assert.deepStrictEqual(JSON.parse(st2._raw.topik2_srs), { 'Q1:v:0': good });

  // A root that is not a plain object is dropped whole (an array used to be accepted as the deck).
  ['[]', '[1,2]', '"hi"', 'null', '7', 'true', '{not json'].forEach(raw => {
    const s3 = fresh();
    s3.setItem('topik2_srs', raw);
    assert.deepStrictEqual(SRS.stats(), noDeck, 'root ' + raw);
    assert.deepStrictEqual(SRS.dueKeys(), []);
    assert.strictEqual(s3._raw[BAK], raw, 'backup of root ' + raw);
  });

  // Valid data is untouched and never copied; an empty or missing value is not corruption.
  st2 = fresh();
  const clean = JSON.stringify({ 'Q1:v:0': good, 'Q2:g:1': { ...good, box: 5 } });
  st2.setItem('topik2_srs', clean);
  assert.strictEqual(SRS.stats().total, 2);
  assert.strictEqual(st2._raw[BAK], undefined, 'no backup for a healthy deck');
  assert.strictEqual(st2._raw.topik2_srs, clean, 'healthy deck not rewritten');
  st2 = fresh();
  SRS.stats();
  st2.setItem('topik2_srs', '');
  SRS.stats();
  assert.strictEqual(st2._raw[BAK], undefined);

  // Grading keeps working on top of a repaired deck; the dropped cards do not come back.
  st2 = fresh();
  st2.setItem('topik2_srs', JSON.stringify({ 'Q1:v:0': good, 'Q1:v:1': null }));
  SRS.record('Q1:v:0', true);
  assert.strictEqual(rec(st2, 'Q1:v:0').box, 3);
  assert.strictEqual(rec(st2, 'Q1:v:1'), undefined);

  // If the backup cannot be written, the original value is never overwritten.
  st2 = fresh();
  st2.setItem('topik2_srs', '{"Q1:v:0":null}');
  const realSet = st2.setItem;
  st2.setItem = (k, v) => { if (k === BAK) throw new Error('quota'); realSet(k, v); };
  assert.doesNotThrow(() => { SRS.stats(); SRS.dueKeys(); SRS.record('Q3:v:0', true); });
  assert.strictEqual(st2._raw.topik2_srs, '{"Q1:v:0":null}', 'original kept when the backup fails');
  st2.setItem = realSet;
  assert.strictEqual(SRS.stats().total, 1, 'the card graded while blocked is kept in memory');
  assert.strictEqual(st2._raw[BAK], '{"Q1:v:0":null}', 'backup retried once storage works');
  assert.ok(rec(st2, 'Q3:v:0'), 'and written together with the cleaned deck');

  // The "no backup, no write" state does not stick: once storage works again and the corrupt value
  // is gone (removed, or emptied), cards are saved again.
  ['remove', 'empty'].forEach(how => {
    const s4 = fresh();
    s4.setItem('topik2_srs', '{"Q1:v:0":null}');
    const set4 = s4.setItem;
    s4.setItem = (k, v) => { if (k === BAK) throw new Error('quota'); set4(k, v); };
    SRS.stats();                                   // backup fails: writes are held back
    SRS.seed('Q4:v:0');
    assert.strictEqual(s4._raw.topik2_srs, '{"Q1:v:0":null}', how + ': held back while blocked');
    s4.setItem = set4;                             // storage recovers
    if (how === 'remove') s4.removeItem('topik2_srs'); else s4.setItem('topik2_srs', '');
    SRS.seed('Q5:v:0');
    assert.strictEqual(SRS.stats().total, 1, how + ': a card is saved again');
    assert.ok(rec(s4, 'Q5:v:0'), how + ': stored');
    SRS.record('Q5:v:0', true);
    assert.strictEqual(rec(s4, 'Q5:v:0').box, 2, how + ': grading persists too');
  });

  // Or the corrupt value is replaced by a healthy deck.
  {
    const s5 = fresh();
    s5.setItem('topik2_srs', '[]');
    const set5 = s5.setItem;
    s5.setItem = (k, v) => { if (k === BAK) throw new Error('quota'); set5(k, v); };
    SRS.stats();
    s5.setItem = set5;
    s5.setItem('topik2_srs', JSON.stringify({ 'Q1:v:0': good }));
    SRS.record('Q1:v:0', true);
    assert.strictEqual(rec(s5, 'Q1:v:0').box, 3);
  }
}

// writes failing (storage full or blocked): grades and seeds stay in memory for the page session.
// Reopening the deck (a new read) shows them; isPersistent() says they are not saved.
{
  const card = { box: 1, due: today, seen: 0, wrong: 0, added: today };
  const s6 = fresh();
  s6.setItem('topik2_srs', JSON.stringify({ 'Q1:v:0': card, 'Q1:v:1': card }));
  const stored0 = s6._raw.topik2_srs;
  assert.strictEqual(SRS.isPersistent(), true);
  const realSet6 = s6.setItem;
  s6.setItem = () => { throw new Error('quota'); };

  const graded = SRS.record('Q1:v:0', true);                     // 알아요 on a due card
  assert.strictEqual(graded.seen, 1);
  assert.deepStrictEqual(SRS.dueKeys(), ['Q1:v:1'], 'the graded card is no longer due on the next read');
  SRS.seed('Q2:v:0');                                            // a new seed (a wrong answer in a sprint)
  assert.strictEqual(SRS.stats().total, 3, 'new seeds stay too');
  assert.deepStrictEqual(SRS.dueKeys().sort(), ['Q1:v:1', 'Q2:v:0']);
  SRS.record('Q1:v:1', false);                                   // and a second grade on top
  assert.strictEqual(SRS.stats().due, 1);
  assert.strictEqual(SRS.isPersistent(), false, 'not saved, and it says so');
  assert.strictEqual(s6._raw.topik2_srs, stored0, 'nothing reached storage');

  // Storage works again: the next write carries the whole deck, including what was held in memory.
  s6.setItem = realSet6;
  SRS.record('Q2:v:0', false);
  assert.strictEqual(SRS.isPersistent(), true);
  const saved6 = JSON.parse(s6._raw.topik2_srs);
  assert.deepStrictEqual(Object.keys(saved6).sort(), ['Q1:v:0', 'Q1:v:1', 'Q2:v:0']);
  assert.strictEqual(saved6['Q1:v:0'].box, 2);
  assert.strictEqual(saved6['Q1:v:1'].wrong, 1);

  // While writes fail, another tab's change to the stored deck wins over the page's memory.
  const s7 = fresh();
  s7.setItem('topik2_srs', JSON.stringify({ 'Q1:v:0': card }));
  const realSet7 = s7.setItem;
  s7.setItem = () => { throw new Error('quota'); };
  SRS.seed('Q9:v:0');
  assert.strictEqual(SRS.stats().total, 2);
  realSet7('topik2_srs', JSON.stringify({ 'Q1:v:0': card, 'Q5:v:0': card, 'Q6:v:0': card }));
  assert.strictEqual(SRS.stats().total, 3, 'the changed stored deck is read, not the memory');

  // No stored deck at all (first run) and writes failing: seeds still show.
  const s8 = fresh();
  s8.setItem = () => { throw new Error('quota'); };
  SRS.seedMany(['Q3:v:0', 'Q3:g:0']);
  assert.deepStrictEqual(SRS.dueKeys().sort(), ['Q3:g:0', 'Q3:v:0']);
  assert.strictEqual(SRS.isPersistent(), false);
}

// reset (기록 초기화): the deck is emptied in storage and in memory; the .bak key stays.
{
  const BAK = 'topik2_srs.bak';
  const s9 = fresh();
  s9.setItem(BAK, 'older copy');
  SRS.seedMany(['Q1:v:0', 'Q1:v:1', 'Q2:g:0']);
  SRS.record('Q1:v:0', true);
  assert.strictEqual(SRS.stats().total, 3);
  SRS.reset();
  assert.deepStrictEqual(SRS.stats(), { total: 0, due: 0, byBox: [0, 0, 0, 0, 0] });
  assert.deepStrictEqual(SRS.dueKeys(), []);
  assert.strictEqual(s9._raw.topik2_srs, '{}');
  assert.strictEqual(s9._raw[BAK], 'older copy', 'the backup is left alone');
  SRS.reset();                                                  // an empty deck: still fine
  SRS.seed('Q3:v:0');                                           // and the deck works again afterwards
  assert.strictEqual(SRS.stats().total, 1);

  // Writes failing: the deck held in memory is emptied too.
  const s10 = fresh();
  SRS.seed('Q1:v:0');
  s10.setItem = () => { throw new Error('quota'); };
  SRS.seed('Q2:v:0');
  assert.strictEqual(SRS.stats().total, 2);
  SRS.reset();
  assert.strictEqual(SRS.stats().total, 0, 'the in-memory copy is gone');
  assert.strictEqual(SRS.isPersistent(), false);

  // A corrupt value that could not be backed up is not overwritten by a reset either.
  const s11 = fresh();
  s11.setItem('topik2_srs', '{"Q1:v:0":null}');
  const set11 = s11.setItem;
  s11.setItem = (k, v) => { if (k === BAK) throw new Error('quota'); set11(k, v); };
  SRS.reset();
  assert.strictEqual(s11._raw.topik2_srs, '{"Q1:v:0":null}');
  assert.strictEqual(SRS.stats().total, 0);
}

// broken storage degrades silently
const boom = () => { throw new Error('x'); };
SRS._useStorage({ getItem: boom, setItem: boom, removeItem: boom });
assert.doesNotThrow(() => {
  SRS.seed('Q1:v:0'); SRS.record('Q1:v:0', true); SRS.stats(); SRS.dueKeys(); SRS.remove('Q1:v:0');
});
// ... and storage that can neither be read nor written still gives a working deck in memory.
SRS._useStorage({ getItem: boom, setItem: boom, removeItem: boom });
SRS.seedMany(['Q1:v:0', 'Q1:v:1']);
SRS.record('Q1:v:0', true);
assert.strictEqual(SRS.stats().total, 2);
assert.deepStrictEqual(SRS.dueKeys(), ['Q1:v:1']);
assert.strictEqual(SRS.isPersistent(), false);
