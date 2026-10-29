// gloss-text.js: pure text helpers for the English layer (no DOM access).
//   hasHangul(s)               true when s holds a Hangul syllable (jamo alone do not count)
//   compact(s)                 s with every whitespace removed: the TOPIK2_SENT key form
//   uiKey(s)                   the UI_EN key form (see below)
//   isSentenceEnd(kr, next)    a token ends a sentence (. ? ! and full-width forms, not "23." + "6")
//   splitSentences(tokens)     token list -> one token list per sentence, marks kept
//   sentKey(tokens)            TOPIK2_SENT key of one sentence's tokens
//   lookupSent(table, key)     { en, key } for a sentence key, or null
//   uiSegments(table, text)    a UI text node as [{ text, key, entry }] (whole line, or cut at · : arrows)
//   stripWord(w)               a word without edge punctuation
//   wordIn(words, w)           gloss of w in one entry's words map (keys compared stripped), or ''
//   keywordOf(entries)         the longest Korean word in the entries' words maps, or ''
//   composeLine(pieces)        English pieces and raw bits (numbers, separators) as one line
//   rovingIndex(n, i, key)     roving tabindex: index to focus after ArrowLeft/ArrowRight in a group of n words, or -1
//
// UI_EN key form: all whitespace removed; then, until nothing changes, separator marks
// (middle dot, colon, comma, arrows, pipe, slash, period) are trimmed from both ends, a final
// ? ! or ellipsis is trimmed from the end, and an edge bracket with no partner inside is
// trimmed ("(틀린문제" -> "틀린문제", "있습니다(" -> "있습니다", but "인물의심정(소설)" stays).
(function () {
  'use strict';

  const HANGUL = /[가-힣]/;
  const WS = /\s+/g;
  const EDGE_LEAD = /^[·:,，、;→←↑↓‹›|/.]+/;
  const EDGE_TAIL = /[·:,，、;→←↑↓‹›|/.?!…。？！．]+$/;
  const PAIRS = { '(': ')', '[': ']', '〈': '〉', '《': '》', '「': '」', '『': '』', '【': '】', '{': '}', '<': '>' };
  const CLOSE_OF = Object.keys(PAIRS).reduce((m, k) => ({ ...m, [PAIRS[k]]: k }), {});
  const CLOSERS_TAIL = /["'”’」』)\]〉》]+$/;
  const SENT_END = /[.?!。？！．]$/;
  const SPLIT_SEP = /([·:→←|])/;
  const WORD_EDGE = /^[\s.,!?:;·…'"“”‘’()[\]〈〉《》「」『』→←~]+|[\s.,!?:;·…'"“”‘’()[\]〈〉《》「」『』→←~]+$/g;
  // Inside a compacted key: a final mark (plus closing quotes) right before a Hangul syllable.
  const COMPACT_CUT = /([.?!。？！．]["'”’」』)\]]*)(?=[가-힣(])/g;

  function hasHangul(s) {
    return HANGUL.test(String(s == null ? '' : s));
  }

  function compact(s) {
    return String(s == null ? '' : s).replace(WS, '');
  }

  function count(s, ch) {
    return s.split(ch).length - 1;
  }

  // An opener at the end or a closer at the start never has its partner; an opener at the
  // start or a closer at the end is trimmed only when the line holds no partner for it.
  function trimBrackets(s) {
    let out = s;
    const first = out.charAt(0);
    if (CLOSE_OF[first] || (PAIRS[first] && count(out, first) > count(out, PAIRS[first]))) out = out.slice(1);
    const last = out.charAt(out.length - 1);
    if (PAIRS[last] || (CLOSE_OF[last] && count(out, last) > count(out, CLOSE_OF[last]))) out = out.slice(0, -1);
    return out;
  }

  function uiKey(s) {
    let prev = null;
    let out = compact(s);
    while (out !== prev) {
      prev = out;
      out = trimBrackets(out.replace(EDGE_LEAD, '').replace(EDGE_TAIL, ''));
    }
    return out;
  }

  function isSentenceEnd(kr, nextKr) {
    const s = String(kr == null ? '' : kr).replace(CLOSERS_TAIL, '');
    if (!SENT_END.test(s)) return false;
    // A decimal cut across two tokens ("23." then "6세로") does not end the sentence.
    return !(/\d[.．]$/.test(s) && /^\d/.test(String(nextKr == null ? '' : nextKr)));
  }

  function splitSentences(tokens) {
    const list = Array.isArray(tokens) ? tokens : [];
    const out = [];
    let cur = [];
    list.forEach((t, i) => {
      if (!t) return;
      cur = [...cur, t];
      const next = list[i + 1];
      if (!t.isBlank && isSentenceEnd(t.kr, next && next.kr)) {
        out.push(cur);
        cur = [];
      }
    });
    if (cur.length) out.push(cur);
    return out;
  }

  function sentKey(tokens) {
    return compact((tokens || []).map(t => (t && t.kr) || '').join(''));
  }

  function hit(entry) {
    return entry && entry.en ? { en: entry.en, key: entry.key || '' } : null;
  }

  // A key holding several sentences ("1.공연날짜,…") is answered part by part.
  function lookupSent(table, key) {
    if (!table || !key) return null;
    const own = hit(table[key]);
    if (own) return own;
    const parts = String(key).replace(COMPACT_CUT, '$1\n').split('\n').filter(Boolean);
    if (parts.length < 2) return null;
    const hits = parts.map(p => hit(table[p]));
    if (hits.some(h => !h)) return null;
    const main = parts.reduce((best, p, i) => (p.length > parts[best].length ? i : best), 0);
    return { en: hits.map(h => h.en).join(' '), key: hits[main].key };
  }

  function segment(table, text) {
    const key = uiKey(text);
    return { text, key, entry: key && table ? table[key] || null : null };
  }

  function uiSegments(table, text) {
    const whole = segment(table, text);
    if (whole.entry) return [whole];
    const parts = String(text == null ? '' : text).split(SPLIT_SEP).filter(p => p !== '');
    return parts.length > 1 ? parts.map(p => segment(table, p)) : [whole];
  }

  function stripWord(w) {
    return String(w == null ? '' : w).replace(WORD_EDGE, '');
  }

  function wordIn(words, w) {
    if (!words) return '';
    if (Object.prototype.hasOwnProperty.call(words, w)) return words[w];
    const target = stripWord(w);
    const k = Object.keys(words).find(x => stripWord(x) === target);
    return k ? words[k] : '';
  }

  function keywordOf(entries) {
    return (entries || []).reduce((best, e) => {
      const words = Object.keys((e && e.words) || {}).map(stripWord).filter(hasHangul);
      return words.reduce((b, w) => (w.length > b.length ? w : b), best);
    }, '');
  }

  function composeLine(pieces) {
    return (pieces || [])
      .map(p => String(p == null ? '' : p).trim())
      .filter(Boolean)
      .join(' ')
      .replace(/\s+([,.;:!?%)\]])/g, '$1')
      .replace(/([([])\s+/g, '$1')
      .replace(/\s{2,}/g, ' ');
  }

  // Roving tabindex inside one sentence: Left/Right step by one and stop at the ends.
  // -1 = not handled (another key, a group of fewer than 2 words, or a bad index).
  function rovingIndex(count, index, key) {
    if (!(count > 1) || !(index >= 0 && index < count)) return -1;
    if (key === 'ArrowRight') return Math.min(index + 1, count - 1);
    if (key === 'ArrowLeft') return Math.max(index - 1, 0);
    return -1;
  }

  const GlossText = {
    hasHangul, compact, uiKey, isSentenceEnd, splitSentences, sentKey, lookupSent,
    uiSegments, stripWord, wordIn, keywordOf, composeLine, rovingIndex
  };

  if (typeof window !== 'undefined') window.GlossText = GlossText;
  if (typeof module !== 'undefined') module.exports = GlossText;
})();
