// gloss-text.test.js: the English layer's pure parts.
//   GlossText: UI key normalizer, sentence splitter (Q1, Q9, Q39), sentence and UI lookups,
//   word glosses, keyword, line composition. Translate: the Learn/Drill phase rule.
const assert = require('assert');
global.window = global.window || {};
require('../lessons.js');
require('../data/sentences-102.js');
require('../js/ui-strings.js');
require('../js/util.js');
const GT = require('../js/gloss-text.js');
const Passage = require('../js/render/passage.js');
const Translate = require('../js/translate.js');

const L = n => global.window.TOPIK2.lessons['Q' + n];
const SENT = global.window.TOPIK2_SENT;
const UI = global.window.UI_EN;
const keysOf = html => (html.match(/data-sent-key="([^"]*)"/g) || []).map(m => m.slice(15, -1));

// 1. hasHangul counts syllables only; compact drops every whitespace (ideographic space too).
assert.strictEqual(GT.hasHangul('시작'), true);
assert.strictEqual(GT.hasHangul('ㅎ'), false, 'a lone jamo (IME key) is not copy');
assert.strictEqual(GT.hasHangul('Q16 / 50'), false);
assert.strictEqual(GT.compact(' 이 동네로\t이사를 (　　) '), '이동네로이사를()');

// 2. uiKey: whitespace out; edge separators, a final mark and unpartnered edge brackets trimmed.
{
  const cases = {
    '오늘의 세트': '오늘의세트',
    ' · 복습 ': '복습',
    '지난 세트: ': '지난세트',
    '← 이전': '이전',
    '다음 →': '다음',
    '결과 보기 →': '결과보기',
    '아직 스프린트 기록이 없습니다.': '아직스프린트기록이없습니다',
    '스프린트로 넘어갑니다…': '스프린트로넘어갑니다',
    '무엇에 대한 글인가?': '무엇에대한글인가',
    ' (틀린 문제 ': '틀린문제',
    '인물의 심정 (소설)': '인물의심정(소설)',
    '《안내》': '《안내》',
    '(자기 채점)': '(자기채점)',
    'TOPIK II 읽기 · 102회': 'TOPIKII읽기·102회',
    '-(으)ㄴ 지': '-(으)ㄴ지',
    '오답 · 정답은 ': '오답·정답은',
    '': ''
  };
  Object.keys(cases).forEach(k => assert.strictEqual(GT.uiKey(k), cases[k], 'uiKey(' + JSON.stringify(k) + ')'));
  assert.strictEqual(GT.uiKey(GT.uiKey('· 테마 바꾸기, 지금: ')), GT.uiKey('· 테마 바꾸기, 지금: '), 'idempotent');
}

// 3. Sentence ends: . ? ! and full-width forms, closing quotes allowed, a cut decimal is not an end.
assert.strictEqual(GT.isSentenceEnd('됐다.'), true);
assert.strictEqual(GT.isSentenceEnd('할까요？'), true);
assert.strictEqual(GT.isSentenceEnd('선물하세요!'), true);
assert.strictEqual(GT.isSentenceEnd("편지'라고."), true);
assert.strictEqual(GT.isSentenceEnd('했다."'), true, 'closing quote after the mark');
assert.strictEqual(GT.isSentenceEnd('23.6세로'), false, 'decimal inside a token');
assert.strictEqual(GT.isSentenceEnd('23.', '6세로'), false, 'decimal cut across tokens');
assert.strictEqual(GT.isSentenceEnd('2.', '공연'), true);
assert.strictEqual(GT.isSentenceEnd('(㉠)'), false);
assert.strictEqual(GT.isSentenceEnd('이사를'), false);

// 4. Q1: one sentence, the blank kept as "()" in the key, which the table holds.
{
  const s = GT.splitSentences(L(1).passageTokens);
  assert.strictEqual(s.length, 1);
  assert.strictEqual(GT.sentKey(s[0]), '이동네로이사를()일년이됐다');
  assert.ok(GT.lookupSent(SENT, GT.sentKey(s[0])), 'Q1 sentence is in the table');
}

// 5. Q39: 23.6 does not split; the position mark (㉠) after a sentence is its own unit.
{
  const para = L(39).passageParas[1].tokens;
  const keys = GT.splitSentences(para).map(GT.sentKey);
  assert.deepStrictEqual(keys, ['운동선수들의평균은퇴연령은23.6세로매우짧은편이다.', '(㉠)']);
  const cut = [{ kr: '연령은' }, { kr: '23.' }, { kr: '6세로' }, { kr: '짧다.' }, { kr: '그래서' }, { kr: '찾는다.' }];
  assert.deepStrictEqual(GT.splitSentences(cut).map(GT.sentKey), ['연령은23.6세로짧다.', '그래서찾는다.']);
  const html = Passage.render(L(39), { glossOn: true });
  keysOf(html).forEach(k => assert.ok(GT.lookupSent(SENT, k), 'Q39 key in table: ' + k));
  assert.ok(!keysOf(html).includes('운동선수들의평균은퇴연령은23.'), 'no key cut at the decimal');
}

// 6. Q9 (notice): each line is one sentence, the URL's dots never split, every key is in the table.
{
  const item = L(9).notice.items.find(it => it.kr.includes('www.'));
  const tokens = item.kr.split(' ').map(kr => ({ kr }));
  assert.strictEqual(GT.splitSentences(tokens).length, 1, 'URL line stays whole');
  const headline = L(9).notice.headline.split(' ').map(kr => ({ kr }));
  assert.strictEqual(GT.splitSentences(headline).length, 1);
  const keys = keysOf(Passage.render(L(9), { glossOn: true }));
  assert.ok(keys.length >= 10, 'category, headline, activity, 4 labels, 4 items');
  keys.forEach(k => assert.ok(GT.lookupSent(SENT, k), 'Q9 key in table: ' + k));
}

// 7. Every sentence any passage renders has its English (all 50 questions).
{
  const missing = [];
  Object.values(global.window.TOPIK2.lessons).forEach(l =>
    keysOf(Passage.renderFull(l, { glossOn: true })).forEach(k => {
      const raw = k.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      if (!GT.lookupSent(SENT, raw)) missing.push('Q' + l.num + ' ' + raw);
    }));
  assert.deepStrictEqual(missing, [], 'sentences without English');
}

// 8. lookupSent: a key the table lacks but whose sentences it holds is answered part by part.
{
  const t = { '1.': { en: '1.', key: '1.' }, '공연날짜를고르세요.': { en: 'Choose the date.', key: '고르세요' } };
  assert.deepStrictEqual(GT.lookupSent(t, '1.공연날짜를고르세요.'), { en: '1. Choose the date.', key: '고르세요' });
  assert.strictEqual(GT.lookupSent(t, 'www.mailex.or.kr에서'), null);
  assert.strictEqual(GT.lookupSent(t, ''), null);
  assert.strictEqual(GT.lookupSent(null, '1.'), null);
}

// 9. uiSegments: the whole line when keyed, else its parts cut at middle dots (marks kept).
{
  const whole = GT.uiSegments(UI, '시험까지');
  assert.strictEqual(whole.length, 1);
  assert.strictEqual(whole[0].entry, UI['시험까지']);
  const parts = GT.uiSegments(UI, '오늘의 세트 · 복습 ');
  assert.deepStrictEqual(parts.map(p => p.key), ['오늘의세트', '', '복습']);
  assert.ok(parts[0].entry && parts[2].entry, 'both halves are keyed');
  assert.strictEqual(GT.uiSegments(UI, '없는 문장')[0].entry, null);
}

// 10. Word glosses match through edge punctuation; the keyword is the longest Korean word.
{
  const words = { '바꾸기,': 'changing', '지금:': 'now', '(저장소': '(storage' };
  assert.strictEqual(GT.wordIn(words, '바꾸기'), 'changing');
  assert.strictEqual(GT.wordIn(words, '지금:'), 'now');
  assert.strictEqual(GT.wordIn(words, '저장소'), '(storage');
  assert.strictEqual(GT.wordIn(words, '없음'), '');
  assert.strictEqual(GT.wordIn(null, '없음'), '');
  assert.strictEqual(GT.stripWord('"차단)."'), '차단');
  assert.strictEqual(GT.stripWord('-(으)ㄴ'), '-(으)ㄴ', 'a grammar pattern keeps its dash');
  assert.strictEqual(GT.keywordOf([{ words: { '오늘의': "today's", '세트': 'set' } }, { words: { 'G': 'G' } }]), '오늘의');
  assert.strictEqual(GT.keywordOf([]), '');
}

// 11. composeLine joins English and raw bits without stray spaces.
assert.strictEqual(GT.composeLine(['Review', '3', 'cards, deck total', '12', 'cards']), 'Review 3 cards, deck total 12 cards');
assert.strictEqual(GT.composeLine(['Correct', ' 3 ', '/', '5', '', null, '(', 'sure', ')']), 'Correct 3 / 5 (sure)');

// 12. Phase rule: Learn (to 2026-11-17) on by default, Drill (from 2026-11-18) off;
//     a run override counts only in its own phase; the master toggle off also turns Learn off.
{
  const T = Translate;
  assert.strictEqual(T.phaseOf('2026-11-17'), 'learn');
  assert.strictEqual(T.phaseOf('2026-11-18'), 'drill');
  assert.strictEqual(T.examOn({}, '2026-10-29'), true);
  assert.strictEqual(T.examOn({}, '2026-11-17'), true);
  assert.strictEqual(T.examOn({}, '2026-11-18'), false);
  assert.strictEqual(T.examOn({ gloss: false }, '2026-10-29'), false, 'master off');
  assert.strictEqual(T.examOn({ glossExam: { on: false, phase: 'learn' } }, '2026-10-29'), false);
  assert.strictEqual(T.examOn({ glossExam: { on: true, phase: 'learn' } }, '2026-11-20'), false, 'learn override expires');
  assert.strictEqual(T.examOn({ glossExam: { on: true, phase: 'drill' } }, '2026-11-20'), true);
  assert.strictEqual(T.layerOn({ gloss: false }, '2026-10-29', false), false);
  assert.strictEqual(T.layerOn({}, '2026-12-01', false), true, 'study screens ignore the phase');
  assert.strictEqual(T.layerOn({ glossExam: { on: false, phase: 'learn' } }, '2026-10-29', false), true);
}

// Roving tabindex: Left/Right step inside one sentence and stop at its ends.
{
  assert.strictEqual(GT.rovingIndex(4, 1, 'ArrowRight'), 2);
  assert.strictEqual(GT.rovingIndex(4, 1, 'ArrowLeft'), 0);
  assert.strictEqual(GT.rovingIndex(4, 3, 'ArrowRight'), 3, 'stops at the last word');
  assert.strictEqual(GT.rovingIndex(4, 0, 'ArrowLeft'), 0, 'stops at the first word');
  assert.strictEqual(GT.rovingIndex(1, 0, 'ArrowRight'), -1, 'a one-word line leaves the key to the screen');
  assert.strictEqual(GT.rovingIndex(4, 1, 'ArrowDown'), -1);
  assert.strictEqual(GT.rovingIndex(4, -1, 'ArrowRight'), -1, 'focus is not in the group');
  assert.strictEqual(GT.rovingIndex(0, 0, 'ArrowRight'), -1);
}

// A glossed passage has exactly one Tab stop (tabindex 0) per sentence.
{
  const html = Passage.render(L(1), { glossOn: true });
  html.split('<span class="sent"').slice(1).forEach(part => {
    const sent = part.split('</span></span>')[0];
    const zero = (sent.match(/tabindex="0"/g) || []).length;
    assert.ok(zero <= 1, 'at most one Tab stop per sentence');
  });
  assert.ok(/tabindex="-1"/.test(html), 'other words are reachable by arrow keys');
}
