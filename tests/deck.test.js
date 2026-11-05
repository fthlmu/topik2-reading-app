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

// 7. Deck screen grading: no flip needed, and a short lock after each grade so a double-click
// (or a second key) cannot grade the next card, which was drawn under the same buttons unseen.
{
  global.window.Store = { get: () => ({ settings: {} }) };
  global.window.SRS = SRS;
  global.window.DeckCards = DeckCards;
  const DeckScreen = require('../js/screens/deck.js');
  const raw = {};
  SRS._useStorage({
    getItem: k => (k in raw ? raw[k] : null),
    setItem: (k, v) => { raw[k] = String(v); },
    removeItem: k => { delete raw[k]; }
  });
  SRS.seedMany(['Q16:v:0', 'Q16:v:1', 'Q16:v:2']);
  const seen = () => Object.values(JSON.parse(raw[SRS.KEY])).filter(r => r.seen > 0).length;
  const handlers = {};
  const root = { innerHTML: '', addEventListener: (type, fn) => { handlers[type] = fn; }, querySelector: () => null };
  const clickGrade = grade => handlers.click({
    target: { closest: sel => (sel === 'button[data-grade]' ? { dataset: { grade } } : null) }
  });
  const press = (key, code, extra) => DeckScreen.onKey({ key, code, target: null, ...extra });

  const realNow = Date.now;
  let now = 5000000;
  Date.now = () => now;
  try {
    DeckScreen.mount(root, { arg: null });
    clickGrade('1');                       // 알아요 on a card that was never flipped
    assert.strictEqual(seen(), 1, 'grades without flipping first');
    now += 60;
    clickGrade('1');                       // the second click of a double-click
    press('k', 'KeyK');                    // and a quick key press
    press('j', 'KeyJ');
    assert.strictEqual(seen(), 1, 'inside the lock only the first card is graded');
    now += 400;                            // lock over
    press('k', 'KeyK', { repeat: true });  // a held key never grades
    assert.strictEqual(seen(), 1, 'e.repeat ignored');
    clickGrade('0');                       // 몰라요
    assert.strictEqual(seen(), 2, 'a normal click after the lock grades the next card');
    now += 400;
    press('ArrowRight', 'ArrowRight');
    assert.strictEqual(seen(), 3, 'last card');
    now += 400;
    press('k', 'KeyK');
    clickGrade('1');
    assert.strictEqual(seen(), 3, 'nothing left to grade after the end');
  } finally {
    Date.now = realNow;
    DeckScreen.unmount();
  }
}
