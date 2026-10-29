// deck-cards.js — turns SRS keys into review cards. Pure: no DOM access.
// DeckCards.cardFor('Q16:v:2', lessons, { romanization }) →
//   { key, q, kind: 'v'|'g', front, back: { main, sub, note, example } }  or null
//   vocab:   front = kr · main = en · note = note · sub = romanization (setting on only)
//   grammar: front = pattern · main = plainEnglish · example = first examples[] { kr, en }
// A key whose lesson or item no longer exists gives null (the deck skips it).
// DeckCards.dueCards(lessons, opts, limit) → the next due cards, SRS order kept.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const SRS = root.SRS || require('./srs.js');

  const DECK_SIZE = 8;

  function vocabCard(key, ref, item, roman) {
    return {
      key, q: ref.q, kind: 'v', front: item.kr,
      back: {
        main: item.en || '',
        sub: roman && item.roman ? item.roman : null,
        note: item.note || null,
        example: null
      }
    };
  }

  function grammarCard(key, ref, point) {
    const ex = (point.examples || [])[0];
    return {
      key, q: ref.q, kind: 'g', front: point.pattern,
      back: {
        main: point.plainEnglish || '',
        sub: null,
        note: null,
        example: ex && ex.kr ? { kr: ex.kr, en: ex.en || '' } : null
      }
    };
  }

  function cardFor(key, lessons, opts) {
    const ref = SRS.parseKey(key);
    const lesson = ref && lessons ? lessons['Q' + ref.q] : null;
    if (!lesson) return null;
    if (ref.kind === 'v') {
      const item = (lesson.vocab || [])[ref.idx];
      return item && item.kr ? vocabCard(key, ref, item, !!(opts && opts.romanization)) : null;
    }
    if (ref.kind === 'g') {
      const point = (lesson.grammar || [])[ref.idx];
      return point && point.pattern ? grammarCard(key, ref, point) : null;
    }
    return null;
  }

  // Every due key in SRS order, broken keys dropped, then the first `limit`.
  function dueCards(lessons, opts, limit) {
    const n = Number.isInteger(limit) ? limit : DECK_SIZE;
    return SRS.dueKeys(Infinity)
      .map(key => cardFor(key, lessons, opts))
      .filter(Boolean)
      .slice(0, n);
  }

  const DeckCards = { DECK_SIZE, cardFor, dueCards };

  if (typeof window !== 'undefined') window.DeckCards = DeckCards;
  if (typeof module !== 'undefined') module.exports = DeckCards;
})();
