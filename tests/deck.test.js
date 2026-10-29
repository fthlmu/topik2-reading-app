// deck.test.js — DeckCards.cardFor (vocab / grammar / missing keys) and
// dueCards (SRS order kept, broken keys skipped, limit 8, SRS left untouched).
const assert = require('assert');
global.window = global.window || {};
require('../lessons.js');
const SRS = require('../js/srs.js');
const DeckCards = require('../js/deck-cards.js');

const LESSONS = global.window.TOPIK2.lessons;
const L = n => LESSONS['Q' + n];

function memStore() {
  const m = {};
  return {
    getItem: k => (k in m ? m[k] : null),
    setItem: (k, v) => { m[k] = String(v); },
    removeItem: k => { delete m[k]; }
  };
}

// 1. Vocab card: front = Korean, back = English; romanization only when the setting is on.
{
  const item = L(16).vocab[0];
  assert.deepStrictEqual(DeckCards.cardFor('Q16:v:0', LESSONS), {
    key: 'Q16:v:0', q: 16, kind: 'v', front: item.kr,
    back: { main: item.en, sub: null, note: item.note || null, example: null }
  });
  assert.strictEqual(DeckCards.cardFor('Q16:v:0', LESSONS, { romanization: true }).back.sub, item.roman);
  assert.strictEqual(DeckCards.cardFor('Q16:v:0', LESSONS, { romanization: false }).back.sub, null);
}

// 2. A vocab note (when the data has one) rides along on the back.
{
  let found = null;
  Object.values(LESSONS).some(l => (l.vocab || []).some((v, i) => {
    if (v.note) found = { q: l.num, i, note: v.note };
    return !!v.note;
  }));
  if (found) assert.strictEqual(DeckCards.cardFor('Q' + found.q + ':v:' + found.i, LESSONS).back.note, found.note);
}

// 3. Grammar card: front = pattern, back = plain English + first example (kr + en).
{
  const gp = L(16).grammar[0];
  const card = DeckCards.cardFor('Q16:g:0', LESSONS, { romanization: true });
  assert.strictEqual(card.kind, 'g');
  assert.strictEqual(card.q, 16);
  assert.strictEqual(card.front, gp.pattern);
  assert.strictEqual(card.back.main, gp.plainEnglish);
  assert.deepStrictEqual(card.back.example, { kr: gp.examples[0].kr, en: gp.examples[0].en });
  assert.strictEqual(card.back.sub, null, 'grammar has no romanization line');
}

// 4. Keys whose lesson or item no longer exists → null (the deck skips them).
{
  ['Q99:v:0', 'Q16:v:99', 'Q16:g:9', 'Q16:x:0', 'garbage', '', null, undefined].forEach(k =>
    assert.strictEqual(DeckCards.cardFor(k, LESSONS), null, 'null for ' + k));
  assert.strictEqual(DeckCards.cardFor('Q16:v:0', null), null);
  assert.strictEqual(DeckCards.cardFor('Q16:v:0', {}), null);
}

// 5. dueCards keeps SRS order (lowest box, most wrong, oldest due), drops broken keys.
{
  const s = memStore();
  SRS._useStorage(s);
  const today = SRS._todayStr();
  const rec = (box, wrong, due) => ({ box, due: due || today, seen: 1, wrong, added: today });
  s.setItem(SRS.KEY, JSON.stringify({
    'Q16:v:1': rec(2, 0),
    'Q99:v:0': rec(1, 0),
    'Q17:g:0': rec(1, 2),
    'Q18:v:0': rec(1, 0),
    'Q19:v:0': rec(3, 0, SRS._addDays(today, 3))
  }));
  const order = SRS.dueKeys(Infinity);
  assert.deepStrictEqual(order, ['Q17:g:0', 'Q99:v:0', 'Q18:v:0', 'Q16:v:1']);
  const before = s.getItem(SRS.KEY);
  assert.deepStrictEqual(DeckCards.dueCards(LESSONS).map(c => c.key), ['Q17:g:0', 'Q18:v:0', 'Q16:v:1']);
  assert.strictEqual(s.getItem(SRS.KEY), before, 'building the deck writes nothing');
  assert.deepStrictEqual(SRS.dueKeys(Infinity), order, 'due ordering untouched');

  // Grading moves a card out of today's list either way (right → later box, wrong → tomorrow).
  SRS.record('Q17:g:0', true);
  SRS.record('Q18:v:0', false);
  assert.deepStrictEqual(DeckCards.dueCards(LESSONS).map(c => c.key), ['Q16:v:1']);
}

// 6. At most 8 cards per deck by default; a broken key does not cost a slot.
{
  SRS._useStorage(memStore());
  const keys = ['Q99:v:0'];
  for (let i = 0; i < 5; i++) keys.push('Q16:v:' + i, 'Q17:v:' + i);
  SRS.seedMany(keys);
  assert.strictEqual(SRS.stats().due, 11);
  assert.strictEqual(DeckCards.DECK_SIZE, 8);
  const cards = DeckCards.dueCards(LESSONS);
  assert.strictEqual(cards.length, 8);
  assert.ok(cards.every(c => c.key !== 'Q99:v:0'));
  assert.strictEqual(DeckCards.dueCards(LESSONS, null, 3).length, 3);
  SRS._useStorage(memStore());
  assert.deepStrictEqual(DeckCards.dueCards(LESSONS), [], 'empty deck');
}
