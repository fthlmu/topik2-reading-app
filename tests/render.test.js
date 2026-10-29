// render.test.js — Util.esc / richText, Passage.render (all 7 passage types,
// 〈보기〉 box, withheld, lead passages), Choices.render (exam + review), App.parse.
const assert = require('assert');
global.window = global.window || {};
require('../lessons.js');
const Util = require('../js/util.js');
const Passage = require('../js/render/passage.js');
const Choices = require('../js/render/choices.js');
const App = require('../js/app.js');

const L = n => global.window.TOPIK2.lessons['Q' + n];

// 1. Util.esc covers all five HTML-special characters.
assert.strictEqual(Util.esc('<a href="x">&\''), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
assert.strictEqual(Util.esc(null), '');
assert.strictEqual(Util.esc(undefined), '');
assert.strictEqual(Util.esc(0), '0');

// 2. richText re-allows only bare <b>, <em>, <strong>; everything else stays escaped.
assert.strictEqual(Util.richText('<b>bold</b> <em>e</em> <strong>s</strong>'), '<b>bold</b> <em>e</em> <strong>s</strong>');
assert.strictEqual(Util.richText('<script>x()</script>'), '&lt;script&gt;x()&lt;/script&gt;');
assert.ok(Util.richText('<b onclick="evil()">x</b>').startsWith('&lt;b onclick=&quot;evil()&quot;&gt;x'),
  'tags with attributes stay escaped');
assert.strictEqual(Util.richText('<B>x</B> <i>y</i>'), '&lt;B&gt;x&lt;/B&gt; &lt;i&gt;y&lt;/i&gt;');
assert.strictEqual(Util.richText('a & "b"'), 'a &amp; &quot;b&quot;');

// 3. Every passage type renders in both modes; Korean-only mode has no gloss hooks.
const SAMPLES = { 'sentence': 1, 'ad': 5, 'numbered-steps': 8, 'notice': 9, 'chart': 10, 'multi-para': 16, 'ordering': 13 };
Object.keys(SAMPLES).forEach(type => {
  const lesson = L(SAMPLES[type]);
  assert.strictEqual(lesson.passageType, type, 'sample Q' + lesson.num + ' is ' + type);
  const on = Passage.render(lesson, { glossOn: true });
  const off = Passage.render(lesson, { glossOn: false });
  [on, off].forEach(html => assert.ok(html.includes('passage--' + type), type + ' class'));
  assert.ok(on.includes('gloss-word') && on.includes('is-glossed'), type + ' glossed');
  assert.ok(on.includes('tabindex="0"'), type + ' gloss words are focusable');
  ['gloss-word', 'data-roman', 'data-en', 'tabindex'].forEach(bit =>
    assert.ok(!off.includes(bit), type + ' Korean-only has no ' + bit));
});

// 4. Notes are never printed: they ride on the first sentence (data-note) for its line
//    translation, only in glossed mode, and showNote: false drops them.
{
  const chart = Passage.render(L(10), { glossOn: true });
  assert.ok(!chart.includes('passage-note'), 'no printed note');
  assert.strictEqual((chart.match(/data-note="/g) || []).length, 1, 'chart note on one sentence');
  assert.ok(chart.indexOf('data-note="') < chart.indexOf('data-sent-key="'),
    'note sits on the first sentence');
  assert.ok(!Passage.render(L(10), { glossOn: true, showNote: false }).includes('data-note'));
  assert.ok(!Passage.render(L(10), { glossOn: false }).includes('data-note'), 'Korean-only mode has no note');
  assert.ok(!Passage.render(L(1), { glossOn: true }).includes('data-note'), 'Q1 has no note');
  // Glossed sentences carry their table key; Korean-only output has none.
  assert.ok(Passage.render(L(1), { glossOn: true }).includes('data-sent-key="이동네로이사를()일년이됐다"'));
  assert.ok(!Passage.render(L(1), { glossOn: false }).includes('data-sent-key'));
}

// 5. Q39: the given sentence moves into the 〈보기〉 box; its "[삽입할 문장]" paragraph is dropped.
{
  const html = Passage.render(L(39), { glossOn: false });
  assert.ok(html.includes('insert-box') && html.includes('〈보기〉'));
  assert.ok(!html.includes('[삽입할 문장]'));
  const firstWord = String(L(39).insertSentence.kr).split(' ')[0];
  assert.ok(html.includes(Util.esc(firstWord)), 'insert sentence text shown');
  assert.ok(!Passage.render(L(16), { glossOn: false }).includes('insert-box'));
}

// 6. Q23: withheld passage is flagged and its notice shows in Korean-only mode too.
{
  assert.strictEqual(Passage.isWithheld(L(23)), true);
  assert.strictEqual(Passage.isWithheld(L(16)), false);
  const html = Passage.render(L(23), { glossOn: false });
  assert.ok(html.includes('passage--withheld'));
  assert.ok(Passage.render(L(23), { glossOn: true }).includes('data-note="'), 'withheld note on the line layer');
}

// 7. Recap-only lessons point at the question holding the full shared passage.
{
  const leads = { 22: 21, 45: 44, 47: 46, 49: 48, 50: 48, 21: null, 46: null, 48: null, 19: null, 16: null };
  Object.keys(leads).forEach(q => assert.strictEqual(Passage.leadOf(L(Number(q))), leads[q], 'leadOf Q' + q));
  const full = Passage.renderFull(L(49), { glossOn: false });
  assert.ok(full.includes('passage-lead'));
  assert.ok(full.includes(Passage.render(L(48), { glossOn: false, showNote: false })), 'Q48 passage first');
  assert.strictEqual(Passage.renderFull(L(48), { glossOn: false }), Passage.render(L(48), { glossOn: false }));
}

// 8. Data is escaped in text and attributes; unknown types degrade.
{
  const evil = { num: 99, passageType: 'sentence', passageTokens: [{ kr: '<img src=x onerror=1>', roman: '"r', en: "'e" }] };
  const on = Passage.render(evil, { glossOn: true });
  assert.ok(!on.includes('<img') && on.includes('&lt;img'));
  assert.ok(on.includes('data-roman="&quot;r"') && on.includes('data-en="&#39;e"'));
  const odd = Passage.render({ passageType: 'hologram' }, { glossOn: false });
  assert.ok(odd.includes('passage--unknown') && odd.includes('지문 없음'));
  assert.strictEqual(Passage.render(null), '');
}

// 9. Choices: exam = Korean-only buttons; review = marks + roman/English.
{
  const l = L(16);
  const exam = Choices.render(l, { variant: 'exam' });
  assert.strictEqual((exam.match(/data-choice="/g) || []).length, l.choices.length);
  assert.ok(exam.includes('①') && exam.includes('choices--exam'));
  assert.ok(!exam.includes('choice__roman') && !exam.includes('choice__en'), 'exam is Korean only');

  const wrongPick = l.answer === 1 ? 2 : 1;
  const review = Choices.render(l, { variant: 'review', chosen: wrongPick });
  assert.ok(review.includes('choices--review') && review.includes('choice__roman'));
  assert.ok(!review.includes('choice__en'), 'choice English is never printed');
  assert.strictEqual((review.match(/data-line-en="/g) || []).length, l.choices.length, 'each choice has its line');
  assert.strictEqual((exam.match(/data-sent-key="/g) || []).length, l.choices.length);
  assert.ok(!review.includes('data-choice'), 'review is not clickable');
  assert.strictEqual((review.match(/is-correct/g) || []).length, 1);
  assert.strictEqual((review.match(/is-wrong is-chosen/g) || []).length, 1);
  // Red-pen marks live on the ovals: ring on the right answer, slash through the wrong pick.
  assert.ok(review.includes('ov ov--lg ok') && review.includes('ov ov--lg fill bad'));
  assert.ok(!review.includes('✓') && !review.includes('✗'), 'no check-mark glyphs');
  assert.ok(Choices.render(l, { variant: 'review', chosen: l.answer, sure: false }).includes('ov ov--lg fill unsure'),
    'right but unsure gets the triangle');
  assert.ok(Choices.render(l, { variant: 'review', chosen: l.answer, fresh: true }).includes('fill ok is-fresh'),
    'fresh pick animates its fill');
  assert.ok(exam.includes('ov ov--lg') && !exam.includes('fill'), 'exam ovals start hollow');

  const rightPick = Choices.render(l, { variant: 'review', chosen: l.answer });
  assert.ok(!rightPick.includes('is-wrong') && rightPick.includes('is-correct is-chosen'));

  const evil = { answer: 1, choices: [{ num: 1, kr: '<b>x</b>', roman: '"', en: '<i>' }] };
  const html = Choices.render(evil, { variant: 'review', chosen: 1 });
  assert.ok(!html.includes('<b>x') && html.includes('&lt;b&gt;x') && html.includes('&lt;i&gt;'));
  assert.strictEqual(Choices.render(null), '');
  assert.ok(Choices.verdict(l, l.answer).includes('verdict--right'));
  const key = l.choices.find(c => c.num === l.answer);
  const verdict = Choices.verdict(l, wrongPick);
  assert.ok(verdict.includes('오답 · 정답은 <span class="verdict__key"'));
  assert.ok(verdict.includes('>' + Util.circled(l.answer) + ' ' + Util.esc(key.kr) + '</span>'));
  assert.strictEqual(Choices.verdict(l, null), '');
}

// 10. App.parse: route names and params, including edge cases.
{
  const P = h => App.parse(h);
  assert.deepStrictEqual(P(''), { name: 'today', params: { arg: null } });
  assert.deepStrictEqual(P(null), { name: 'today', params: { arg: null } });
  assert.deepStrictEqual(P('#/'), { name: 'today', params: { arg: null } });
  assert.deepStrictEqual(P('#/study/16'), { name: 'study', params: { q: '16' } });
  assert.deepStrictEqual(P('#/study'), { name: 'study', params: { q: undefined } });
  assert.deepStrictEqual(P('#/review/s1abc'), { name: 'review', params: { arg: 's1abc' } });
  assert.deepStrictEqual(P('#/sprint/retry'), { name: 'sprint', params: { arg: 'retry' } });
  assert.deepStrictEqual(P('#//map//'), { name: 'map', params: { arg: null } });
  assert.deepStrictEqual(P('#map'), { name: 'map', params: { arg: null } });
}
