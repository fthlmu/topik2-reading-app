// ui-lang.test.js: the 한 / EN switch (js/ui-lang.js) without a DOM.
//   1. settings.uiLang: default 'ko', old records without it read as 'ko', a saved 'en' is kept.
//   2. enOf: Korean UI text becomes the UI_EN English, numbers and separators kept in place.
//   3. Exam content never switches: in the HTML of a sprint/mock question sheet, a graded
//      review row, a 〈보기〉 passage and a verdict, every Korean text run of the exam sits
//      inside a KEEP element; the only Korean outside KEEP is UI copy that has an entry.
//   4. UI labels that sit inside a KEEP container (UI_IN_KEEP) are marked in the markup, have an
//      entry, and read fully English; the study content around them stays Korean.
//   5. Composed labels (aria-label / title) read fully English: a key followed by a circled digit
//      or a count, parts joined with a middle dot; "1 day / 3 days", "1 question / 5 questions";
//      the theme label; the 사용법 page in English.
const assert = require('assert');
global.window = global.window || {};
require('../lessons.js');
require('../js/ui-strings.js');
require('../js/util.js');
const UiLang = require('../js/ui-lang.js');
const Store = require('../js/store.js');
const Passage = require('../js/render/passage.js');
const Choices = require('../js/render/choices.js');
global.window.Tiles = require('../js/render/tiles.js');
const Runner = require('../js/screens/runner.js');
const StudyTabs = require('../js/screens/study-tabs.js');
const GuideScreen = require('../js/screens/guide.js');
const DeckScreen = require('../js/screens/deck.js');
const MapScreen = require('../js/screens/map.js');
const GT = require('../js/gloss-text.js');

const UI = global.window.UI_EN;
const L = n => global.window.TOPIK2.lessons['Q' + n];

function makeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
}

// 1. Stored language.
{
  const prevW = global.window.localStorage;
  const ls = makeStorage();
  global.window.localStorage = ls;
  global.localStorage = ls;
  try {
    Store.resetCache();
    Store.load();
    assert.strictEqual(Store.get().settings.uiLang, 'ko', 'default is Korean');
    assert.strictEqual(UiLang.langOf(Store.get().settings), 'ko');

    // An older record written before the switch existed.
    const old = JSON.parse(ls.getItem('topik2.v2'));
    delete old.settings.uiLang;
    ls.setItem('topik2.v2', JSON.stringify(old));
    Store.resetCache();
    assert.strictEqual(Store.get().settings.uiLang, 'ko', 'missing field reads as Korean');

    Store.setSetting('uiLang', 'en');
    Store.resetCache();
    assert.strictEqual(Store.get().settings.uiLang, 'en', 'saved English survives a reload');
    assert.strictEqual(UiLang.langOf(Store.get().settings), 'en');
    assert.strictEqual(JSON.parse(ls.getItem('topik2.v2')).settings.uiLang, 'en', 'in topik2.v2');

    Store.setSetting('uiLang', 'fr');
    assert.strictEqual(Store.get().settings.uiLang, 'ko', 'unknown value falls back to Korean');
    assert.strictEqual(UiLang.langOf(null), 'ko');
  } finally {
    global.window.localStorage = prevW;
    Store.resetCache();
  }
}

// 2. Text: whole lines, pieces between separators, number + counter, spaces kept.
{
  const en = t => UiLang.enOf(t, UI);
  assert.strictEqual(en('사용법'), 'How to use');
  assert.strictEqual(en('오늘의 세트 · 복습 '), "Today's set · Review ");
  assert.strictEqual(en(' 풀었음'), ' answered');
  assert.strictEqual(en('3일 전'), '3 days ago');
  assert.strictEqual(en('맞힌 문제'), 'Correct answers');
  assert.strictEqual(en('Q16'), 'Q16', 'no Korean: unchanged');
  assert.strictEqual(en('기록은 이 브라우저에만 저장됩니다.'), 'Records are saved in this browser only.');
  assert.ok(!/[가-힣]/.test(en('진행 중인 모의고사가 있습니다 · 답 ')), 'a known line has no Korean left');
  assert.strictEqual(en(' · 시험일 '), ' · exam date ', 'separator kept around a whole-key match');
  assert.strictEqual(en('F 묶음 · 16 ~ 18번'), 'F group · Q16 ~ 18', 'question numbers read Q16');
  assert.strictEqual(en('16번 · 정답'), 'Q16 · Correct');
  assert.strictEqual(UiLang.spaced('questions', '5'), ' questions', 'number + English counter get a space');
  assert.strictEqual(UiLang.spaced('questions', '5 '), 'questions');
  assert.strictEqual(UiLang.spaced('· Review', '5'), '· Review');
}

// 3. Exam content is protected. A tiny scanner over our own (well-formed) HTML.
const KEEP_CLASSES = UiLang.KEEP.filter(s => s.startsWith('.')).map(s => s.slice(1));
const KEEP_TAGS = UiLang.KEEP.filter(s => /^[a-z]+$/.test(s));

function isKept(node) {
  if (KEEP_TAGS.includes(node.tag)) return true;
  if (/\bdata-no-gloss\b/.test(node.attrs) || /\blang="en"/.test(node.attrs)) return true;
  const cls = (/\bclass="([^"]*)"/.exec(node.attrs) || [])[1] || '';
  return cls.split(/\s+/).some(c => KEEP_CLASSES.includes(c));
}

const UI_LABEL_CLASSES = UiLang.UI_IN_KEEP.map(s => s.slice(1));

// A UI label inside a KEEP container (UiLang.UI_IN_KEEP): it switches even though KEEP holds it.
function isUiLabel(node) {
  const cls = (/\bclass="([^"]*)"/.exec(node.attrs) || [])[1] || '';
  return cls.split(/\s+/).some(c => UI_LABEL_CLASSES.includes(c));
}

// Every text run with Hangul: { text, kept, label } (kept = some ancestor is a KEEP element;
// label = some ancestor is a UI_IN_KEEP label).
function koreanRuns(html) {
  const out = [];
  const stack = [];
  const re = /<(\/?)([a-z0-9]+)([^>]*)>|([^<]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    if (m[4] !== undefined) {
      if (/[가-힣]/.test(m[4])) out.push({ text: m[4], kept: stack.some(isKept), label: stack.some(isUiLabel) });
    } else if (m[1]) {
      stack.pop();
    } else if (!/\/$/.test(m[3]) && !/^(input|br|img)$/i.test(m[2])) {
      stack.push({ tag: m[2].toLowerCase(), attrs: m[3] });
    }
  }
  return out;
}

function sr(html) {
  // sr-only labels are UI (screen-reader copy), not exam text: drop them for this check.
  return html.replace(/<span class="sr-only">[^<]*<\/span>/g, '');
}

{
  const samples = {
    'sprint Q16': Runner.bodyHtml(L(16), { glossOn: true }),
    'mock Q39 (보기)': Runner.bodyHtml(L(39), { glossOn: false }),
    'mock Q49 (lead passage)': Runner.bodyHtml(L(49), { glossOn: false }),
    'review rows Q16': Choices.render(L(16), { variant: 'review', chosen: 1, sure: false }),
    'verdict Q16': Choices.verdict(L(16), L(16).answer === 1 ? 2 : 1),
    'study passage Q10': Passage.render(L(10), { glossOn: true })
  };
  Object.keys(samples).forEach(name => {
    const runs = koreanRuns(sr(samples[name]));
    assert.ok(runs.some(r => r.kept), name + ': has exam text');
    const loose = runs.filter(r => !r.kept).map(r => r.text.trim());
    // Outside KEEP only UI copy may stay: the point chip, the graded chips, the verdict lead.
    loose.forEach(t => assert.ok(UI[GT.uiKey(t)], name + ': Korean outside KEEP without a UI entry: ' + t));
    assert.ok(loose.every(t => ['점', '정답', '오답', '애매', '오답 · 정답은'].includes(t)),
      name + ': unexpected UI text outside KEEP: ' + loose.join(' | '));
  });
  // The question line's prompt (the exam's own question type) is kept.
  assert.ok(koreanRuns(Runner.bodyHtml(L(16))).filter(r => r.kept).length >= 4, 'instruction, prompt, passage, choices');
}

const hasHangul = s => /[가-힣]/.test(s);
const en = t => UiLang.enOf(t, UI);

// 4. UI labels inside a KEEP container switch; the study content around them does not.
{
  const lessons = Object.values(global.window.TOPIK2.lessons);
  const withMistake = lessons.find(l => (l.grammar || []).some(g => g.commonMistake));
  const prev = { DeckCards: global.window.DeckCards, Store: global.window.Store };
  const cards = ['g', 'v'].map((kind, i) => ({
    key: 'Q16:' + kind + ':' + i, q: 16, kind, front: kind === 'g' ? '-(으)ㄴ지' : '가뭄',
    back: { main: 'x', sub: null, note: null, example: null }
  }));
  global.window.DeckCards = { dueCards: () => cards };
  global.window.Store = { get: () => ({ settings: {} }) };
  let deckHtml = '';
  try {
    const stub = { innerHTML: '', addEventListener() {}, querySelector() { return null; } };
    DeckScreen.mount(stub, { arg: null });
    deckHtml = stub.innerHTML;
    DeckScreen.unmount();
  } finally {
    global.window.DeckCards = prev.DeckCards;
    global.window.Store = prev.Store;
  }
  const samples = {
    'grammar card (흔한 실수)': StudyTabs.grammarHtml(withMistake),
    '삽입할 문장 box (Q39)': Passage.render(L(39), { glossOn: false }),
    'deck card front (문법 / 어휘)': deckHtml
  };
  Object.keys(samples).forEach(name => {
    const runs = koreanRuns(samples[name]);
    const labels = runs.filter(r => r.label);
    assert.ok(labels.length >= 1, name + ': has a UI label');
    labels.forEach(r => {
      assert.ok(UI[GT.uiKey(r.text)], name + ': label without an entry: ' + r.text);
      assert.ok(!hasHangul(en(r.text)), name + ': label reads English: ' + r.text);
    });
    assert.ok(runs.some(r => r.kept && !r.label), name + ': the study content around it stays kept');
  });
  // The quiz's typed-answer line and the Review labels are built by DOM screens: their markup is
  // checked in the source, so a renamed class cannot drop out of UI_IN_KEEP unnoticed.
  const fs = require('fs');
  const path = require('path');
  const code = ['js/screens/study.js', 'js/screens/review.js', 'js/screens/study-tabs.js', 'js/screens/deck.js',
    'js/render/passage.js'].map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
  UI_LABEL_CLASSES.forEach(c => assert.ok(new RegExp('class="[^"]*\\b' + c + '\\b').test(code), 'markup uses ' + c));
  assert.strictEqual(en('내 답:'), 'My answer:');
  assert.strictEqual(en('고른 답'), 'Your pick');
  assert.strictEqual(en('함정'), 'Trap');
  assert.strictEqual(en('흔한 실수'), 'Common mistake');
  assert.strictEqual(en('삽입할 문장'), 'Sentence to insert');
  assert.strictEqual(en('문법') + ' / ' + en('어휘'), 'Grammar / Vocabulary');
}

// 5. Composed labels read fully English.
{
  const labelsOf = html => (html.match(/(?:aria-label|title)="[^"]*"/g) || []).map(a => a.replace(/^[a-z-]+="|"$/g, ''));
  const english = labels => labels.forEach(l => assert.ok(!hasHangul(en(l)), 'English: ' + l + ' -> ' + en(l)));

  // A key followed by a circled digit or a count; parts joined with a middle dot.
  assert.strictEqual(en('16번 · 답 없음 · 지금 문제'), 'Q16 · No answer · current question');
  assert.strictEqual(en('16번 · 답 ③ · 지금 문제'), 'Q16 · answers ③ · current question');
  assert.strictEqual(en('고른 답 ③'), 'Your pick ③');
  assert.strictEqual(en('16번 · 정답 · 확실 · 고른 답 ③'), 'Q16 · Correct · Sure · Your pick ③');
  assert.strictEqual(en('지도 열기 · 본 문제 12 / 50'), 'Open map, questions seen: 12 / 50');
  assert.strictEqual(en('카드 3 / 8'), 'Card 3 / 8');
  assert.strictEqual(en('· 약한 유형 E'), '· Weak types E', 'a section letter after a key');
  assert.strictEqual(en('② 고른 답, 오답 '), '② Chosen answer, wrong ', 'a circled digit in front of a line');
  assert.strictEqual(en('③ 정답 '), '③ Correct ');
  // The screen-reader text of graded choices (circled digit + state) reads English too.
  const wrongPick = L(16).choices.map(c => c.num).find(n => n !== L(16).answer);
  const reviewRows = Choices.render(L(16), { variant: 'review', chosen: wrongPick, sure: true });
  const srText = (reviewRows.match(/<span class="sr-only">[^<]*<\/span>/g) || []).map(s => s.replace(/<[^>]*>/g, '')).filter(hasHangul);
  assert.ok(srText.length >= 2, 'graded rows carry screen-reader state text');
  english(srText);
  Object.values(MapScreen.STATUS_LABEL).forEach(s => english(['16번 · ' + s + ' · 지금 문제', '16번 · ' + s + ' · 고른 답 ④']));

  // The run tiles (Runner.tilesHtml), as the Sprint and the Mock draw them.
  const tiles = Runner.tilesHtml({ label: '스프린트 · 5문제', rows: [
    { q: 16, chosen: 3, current: true }, { q: 17, chosen: null, current: true }, { q: 18, chosen: null, current: false }] });
  english(labelsOf(tiles));
  assert.ok(labelsOf(tiles).includes('16번 · 답 ③ · 지금 문제'), 'parts joined with a middle dot');
  assert.strictEqual(en('스프린트 · 5문제'), 'Sprint · 5 questions');

  // The Map (every tile) and Today's palette link.
  const ls = (() => {
    const m = new Map();
    return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
  })();
  const prevLs = global.window.localStorage;
  const prevGlobalLs = global.localStorage;
  global.window.localStorage = ls;
  global.localStorage = ls;
  try {
    Store.resetCache();
    Store.load();
    Store.recordAttempt({ q: 16, mode: 'sprint', chosen: L(16).answer, correct: true, sure: true });
    Store.recordAttempt({ q: 17, mode: 'sprint', chosen: 1, correct: false, sure: true });
    const map = labelsOf(MapScreen.html({ compact: false }));
    english(map);
    assert.strictEqual(en(map.find(l => l.startsWith('16번'))), 'Q16 · Correct · Sure · Your pick ' + '①②③④'[L(16).answer - 1]);
    const palette = labelsOf(MapScreen.html({ compact: true }));
    assert.strictEqual(en(palette[0]), 'Open map, questions seen: 2 / 50');
  } finally {
    global.window.localStorage = prevLs;
    global.localStorage = prevGlobalLs;
    Store.resetCache();
  }

  // Counters agree with the number: 1 day / 3 days, 1 question / 5 questions.
  assert.strictEqual(en('1일'), '1 day');
  assert.strictEqual(en('3일'), '3 days');
  assert.strictEqual(en('1문제'), '1 question');
  assert.strictEqual(en('5문제'), '5 questions');
  assert.strictEqual(en('3일 전'), '3 days ago');
  assert.strictEqual(UiLang.agree('day', '1'), 'day');
  assert.strictEqual(UiLang.agree('day', '2'), 'days');
  assert.strictEqual(UiLang.agree('day', '11'), 'days');
  assert.strictEqual(UiLang.agree('day', ''), 'day', 'no number before it: unchanged');
  assert.strictEqual(UiLang.agree('Review', '2'), 'Review', 'only the day counter');

  // 사용법 in English: no Hangul left (the 한 / EN button's own name is the one exception), the
  // buttons are named as they read in English, and T sits under 문장 안.
  const guide = GuideScreen.html();
  const runs = guide.replace(/<[^>]*>/g, '\n').split('\n').map(s => s.trim()).filter(hasHangul);
  const left = runs.map(en).filter(hasHangul);
  assert.deepStrictEqual(left, ["The 한 / EN button switches only the app's text to English. Exam questions do not change."]);
  const guideEn = runs.map(en).join('\n');
  assert.ok(guideEn.includes('The Gloss button or the G key') && guideEn.includes('with Gloss off') && guideEn.includes('While Gloss is on'));
  assert.ok(guideEn.includes("choose I'm sure or I'm unsure") && /^I'm sure$/m.test(guideEn) && /^I'm unsure$/m.test(guideEn));
  ['주석', '확실해요', '애매해요'].forEach(k => assert.ok(guide.includes(k), 'Korean guide names ' + k));
  const area = name => GuideScreen.KEYS.find(([a]) => a === name)[1].map(([keys]) => keys.join('+'));
  assert.ok(!area('어디서나').includes('T') && area('문장 안').includes('T'), 'T acts only inside a sentence');
}
