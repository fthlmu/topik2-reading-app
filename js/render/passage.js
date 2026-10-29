// passage.js: exam passage renderers (port of legacy app.js L293-442).
// Passage.render(lesson, { glossOn, showNote }) -> HTML string.
//   glossOn true  -> every Korean unit is a .gloss-word with data-roman/data-en
//                   (hover/tap/focus tooltip; the first word of each sentence is the
//                   Tab stop, tabindex=0, the rest -1 for arrow keys), and every sentence or line is a
//                   <span class="sent" data-sent-key="..."> for the line layer (js/translate.js);
//                   no English printed inline.
//   glossOn false -> Korean text only: no tooltip hooks, no sentence spans, no English.
//   showNote      -> the English editor's note rides on the first sentence as data-note,
//                   shown only with that sentence's line translation (default = glossOn;
//                   Sprint and Mock pass false: some notes name the answer).
// Passage.instruction(lesson) -> the Korean group instruction, its English as data-line-en.
// Passage.renderFull(lesson, opts) -> same, but a lesson that only holds a recap of
//   a passage shared with an earlier question (its note says "see Q48" or
//   "shown in Q21") is preceded by that earlier question's full passage.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const GT = (typeof window !== 'undefined' && window.GlossText) || require('../gloss-text.js');
  const { esc, cleanNote } = Util;

  const INSERT_MARKER = '[삽입할 문장]';
  const LEAD_RE = /\b(?:see|shown in)\s+Q(\d+)\b/i;
  const WITHHELD_MARKER = '《안내》';
  const BLANK = '<span class="blank">(<span class="blank__gap" aria-hidden="true"></span>)' +
    '<span class="sr-only">빈칸</span></span>';

  // One Korean unit (word, line, label…). Empty text renders nothing.
  // rove: false gives the word tabindex -1 (reachable by arrow keys, not a Tab stop).
  function unit(text, roman, en, glossOn, extraClass, rove) {
    if (text == null || text === '') return '';
    const cls = extraClass ? ' ' + extraClass : '';
    if (!glossOn) return extraClass ? '<span class="' + extraClass + '">' + esc(text) + '</span>' : esc(text);
    const focusable = roman || en ? (rove === false ? ' tabindex="-1"' : ' tabindex="0"') : '';
    return '<span class="gloss-word' + cls + '"' + focusable + ' data-roman="' + esc(roman) + '" data-en="' +
      esc(en) + '">' + esc(text) + '</span>';
  }

  function token(t, glossOn, rove) {
    if (!t) return '';
    if (t.isBlank) return BLANK;
    return unit(t.kr, t.roman, t.en, glossOn, t.isUnderline ? 'ul' : '', rove);
  }

  function joinTokens(list, glossOn) {
    // One Tab stop per sentence: the first focusable word; the rest are reached with the arrow keys.
    let rove = true;
    return (list || []).map(t => {
      const html = token(t, glossOn, rove);
      if (html.indexOf(' tabindex="0"') >= 0) rove = false;
      return html;
    }).filter(Boolean).join(' ');
  }

  // One sentence or line for the line layer. lineEn = the data's own English, used when
  // data/sentences-102.js has no entry for the key.
  function sentSpan(key, inner, lineEn) {
    if (!inner) return '';
    return '<span class="sent" data-sent-key="' + esc(key) + '"' +
      (lineEn ? ' data-line-en="' + esc(lineEn) + '"' : '') + '>' + inner + '</span>';
  }

  // Glossed: one .sent span per sentence (split at . ? ! with the mark kept).
  function tokens(list, glossOn) {
    if (!glossOn) return joinTokens(list, false);
    return GT.splitSentences(list || [])
      .map(s => sentSpan(GT.sentKey(s), joinTokens(s, true)))
      .filter(Boolean).join(' ');
  }

  // A whole-line unit (ad line, notice item, chart label) as one sentence.
  function line(text, roman, en, glossOn, extraClass) {
    const inner = unit(text, roman, en, glossOn, extraClass);
    return glossOn ? sentSpan(GT.compact(text), inner, en) : inner;
  }

  // ── Renderers by passageType ──

  function sentence(lesson, g) {
    return '<p class="passage__sentence">' + tokens(lesson.passageTokens, g) + '</p>';
  }

  function lines(lesson, g, kind) {
    const rows = (lesson.passageLines || []).map(l =>
      '<p class="passage__line">' + line(l.kr, l.roman, l.en, g) + '</p>').join('');
    return '<div class="passage__box passage__box--' + kind + '">' + rows + '</div>';
  }

  function notice(lesson, g) {
    const n = lesson.notice || {};
    const items = (n.items || []).map(it =>
      '<div class="notice__row"><dt>' + line(it.label, '', it.labelEn, g) + '</dt>' +
      '<dd>' + line(it.kr, it.roman, it.en, g) + '</dd></div>').join('');
    return '<div class="passage__box notice">' +
      '<p class="notice__category">' + line(n.category, '', n.categoryEn, g) + '</p>' +
      '<p class="notice__headline">' + line(n.headline, n.headlineRoman, n.headlineEn, g) + '</p>' +
      (n.activity ? '<p class="notice__activity">' + line(n.activity, '', n.activityEn, g) + '</p>' : '') +
      '<dl class="notice__items">' + items + '</dl></div>';
  }

  // Bars are SVG rects sized by attribute (no inline style); width is
  // relative to the largest value, as in the legacy renderer.
  function chart(lesson, g) {
    const c = lesson.chart || {};
    const data = c.data || [];
    const maxPct = Math.max(1, ...data.map(d => Number(d.pct) || 0));
    const rows = data.map(d => {
      const w = (((Number(d.pct) || 0) / maxPct) * 100).toFixed(1);
      return '<li class="chart__row' + (Number(d.rank) === 1 ? ' chart__row--top' : '') + '">' +
        '<span class="chart__label">' + line(d.label, '', d.labelEn, g) + '</span>' +
        '<svg class="chart__bar" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">' +
        '<rect class="chart__track" width="100" height="10"></rect>' +
        '<rect class="chart__fill" width="' + esc(w) + '" height="10"></rect></svg>' +
        '<span class="chart__pct">' + esc(d.pct) + '%</span></li>';
    }).join('');
    const subtitle = c.subtitle
      ? '<span class="chart__subtitle">' + line(c.subtitle, '', c.subtitleEn, g) + '</span>' : '';
    return '<figure class="passage__box chart">' +
      '<figcaption class="chart__title">' + line(c.title, '', c.titleEn, g) + subtitle + '</figcaption>' +
      '<ol class="chart__bars">' + rows + '</ol></figure>';
  }

  function firstKr(para) {
    return para && para.tokens && para.tokens[0] ? para.tokens[0].kr : '';
  }

  // In sentence-insertion lessons the data repeats the given sentence as
  // paragraph 0 (prefixed "[삽입할 문장]"); it moves into the 〈보기〉 box.
  function hasInsertPara(lesson) {
    return !!lesson.insertSentence && firstKr((lesson.passageParas || [])[0]) === INSERT_MARKER;
  }

  function multiPara(lesson, g) {
    const paras = (lesson.passageParas || []).slice(hasInsertPara(lesson) ? 1 : 0);
    return paras.map(p => '<p class="passage__para">' + tokens(p.tokens, g) + '</p>').join('');
  }

  function ordering(lesson, g) {
    const items = (lesson.orderingItems || []).map(it =>
      '<li class="ordering__item"><span class="ordering__label">' + esc(it.label) + '</span>' +
      '<span class="ordering__text">' + tokens(it.tokens, g) + '</span></li>').join('');
    return '<ol class="ordering">' + items + '</ol>';
  }

  const RENDERERS = {
    'sentence': sentence,
    'ad': (l, g) => lines(l, g, 'ad'),
    'numbered-steps': (l, g) => lines(l, g, 'steps'),
    'notice': notice,
    'chart': chart,
    'multi-para': multiPara,
    'ordering': ordering
  };

  // 〈보기〉 box for sentence-insertion lessons (legacy never rendered it).
  function insertBox(lesson, g) {
    const ins = lesson.insertSentence;
    if (!ins || !ins.kr) return '';
    let inner = line(ins.kr, ins.roman, ins.en, g);
    if (hasInsertPara(lesson)) {
      const rest = lesson.passageParas[0].tokens.slice(1);
      const joined = rest.map(t => t.kr || '').join(' ').trim();
      if (joined === String(ins.kr).trim()) inner = tokens(rest, g);
    }
    return '<aside class="insert-box" aria-label="보기: 들어갈 문장">' +
      '<p class="insert-box__label">〈보기〉 <span class="insert-box__hint">삽입할 문장</span></p>' +
      '<p class="insert-box__text" lang="ko">' + inner + '</p></aside>';
  }

  function noteOf(lesson) {
    if (lesson.passageType === 'notice' && lesson.notice) return lesson.notice.note;
    if (lesson.passageType === 'chart' && lesson.chart) return lesson.chart.note;
    return lesson.passageNote;
  }

  function isWithheld(lesson) {
    const paras = lesson.passageParas || [];
    return paras.length === 1 && firstKr(paras[0]) === WITHHELD_MARKER;
  }

  // The note joins the first sentence's line translation (data-note on the first .sent).
  function attachNote(html, note) {
    const at = html.indexOf('<span class="sent" ');
    if (!note || at < 0) return html;
    const head = '<span class="sent" ';
    return html.slice(0, at) + head + 'data-note="' + esc(note) + '" ' + html.slice(at + head.length);
  }

  function render(lesson, opts) {
    if (!lesson) return '';
    const o = opts || {};
    const g = o.glossOn !== false;
    const showNote = o.showNote === undefined ? g : !!o.showNote;
    const fn = RENDERERS[lesson.passageType];
    const type = fn ? lesson.passageType : 'unknown';
    const body = fn ? fn(lesson, g) : '<p class="passage__missing">지문 없음</p>';
    const classes = ['passage', 'passage--' + type];
    if (isWithheld(lesson)) classes.push('passage--withheld');
    if (g) classes.push('is-glossed');
    const note = showNote && g ? cleanNote(noteOf(lesson)) : '';
    return attachNote(insertBox(lesson, g) +
      '<div class="' + classes.join(' ') + '" lang="ko">' + body + '</div>', note);
  }

  // Earlier question whose full passage this recap-only lesson refers to, or null.
  function leadOf(lesson) {
    const m = LEAD_RE.exec((lesson && lesson.passageNote) || '');
    const n = m ? Number(m[1]) : null;
    return n && n < lesson.num ? n : null;
  }

  function renderFull(lesson, opts) {
    const n = leadOf(lesson);
    const lead = n ? Util.lesson(n) : null;
    if (!lead) return render(lesson, opts);
    return '<div class="passage-lead">' + render(lead, { ...(opts || {}), showNote: false }) + '</div>' +
      render(lesson, opts);
  }

  // The group instruction ("[1~2] ( )에 들어갈 말로 ..."), Korean only. Its English is the
  // line translation (data-line-en), never printed.
  function instruction(lesson) {
    const gi = (lesson && lesson.groupInstruction) || {};
    return '<p class="instruction" lang="ko"' + (gi.en ? ' data-line-en="' + esc(gi.en) + '"' : '') + '>' +
      esc(gi.kr) + '</p>';
  }

  const Passage = { render, renderFull, leadOf, tokens, isWithheld, noteOf, instruction };

  if (typeof window !== 'undefined') window.Passage = Passage;
  if (typeof module !== 'undefined') module.exports = Passage;
})();
