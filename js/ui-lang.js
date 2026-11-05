// ui-lang.js: the 한 / EN switch (DESIGN.md section 8b). It changes the app's own UI text
// (nav, buttons, titles, labels, counts, empty states, the test bar, result tiles, deck
// controls, the 사용법 page) between Korean and English. TOPIK exam content never switches:
// passages, the question line, the ※ group instruction, choices and 〈보기〉; neither does
// study content (explanations, vocab, grammar, quizzes, flashcards, strategy cards). A UI label
// that sits inside such a container (UI_IN_KEEP: "고른 답", "함정", "흔한 실수", ...) still switches.
//
// How: the screens always render Korean. In English mode every Korean UI text node outside
// KEEP becomes <span class="ui-en" lang="en" data-ko="원문">English</span>, and read
// attributes (aria-label, title, placeholder) are swapped the same way, from the UI_EN table
// (js/ui-strings.js). A line whose word order needs a whole-line English carries data-ui-en.
// Going back to Korean restores the stored originals in place, so the current question, the
// picked answer, an open run and its timer are never re-rendered or lost.
// js/translate.js calls onAdded() for every node a screen adds, before it wraps words for the
// gloss layer; English UI text has lang="en", so it gets no gloss or line translation.
// Stored in settings.uiLang ('ko' default; old records without the field read as 'ko').
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const GT = root.GlossText || require('./gloss-text.js');

  // Exam and study content: never switched.
  const KEEP = [
    '.passage', '.passage-lead', '.insert-box', '.instruction', '.choice__kr', '.verdict__key', '.qline__prompt',
    '.flash__card', '.deck__card', '.quiz__q', '.quiz__choices', '.quiz__answer', '.quiz__typed', '.quiz__explain',
    '.grammar', '.why__text', '.chips', '.strategy__title', '.strategy__steps', '.strategy__trap',
    '.lang-toggle', '[data-no-gloss]', '[lang="en"]', 'code', 'kbd', 'script', 'style', 'svg', 'template',
    '.line-en', '.gloss-tip'
  ];
  const KEEP_SEL = KEEP.join(', ');
  // UI labels that sit inside a KEEP container, next to study content: they switch, the
  // content around them stays. Each is a span holding the label and nothing else.
  const UI_IN_KEEP = [
    '.why__tag', '.strategy__trap-label', '.grammar__mistake-label', '.quiz__typed-label',
    '.deck__kind', '.insert-box__hint'
  ];
  const UI_IN_KEEP_SEL = UI_IN_KEEP.join(', ');
  const ATTRS = ['aria-label', 'title', 'placeholder'];
  const NUM_LEAD = /^(\s*[\d.,:/×%~\s-]*\d[%×]?)\s*(.+)$/;
  // A key followed by a circled digit, a count or a section letter: "고른 답 ③", "본 문제 12 / 50",
  // "약한 유형 E". A circled digit in front of the line ("② 고른 답, 오답") is set aside the same way.
  const TAIL = /^(.*[가-힣)])\s*([①-⑩]|[A-Z]|\d[\d\s/.,%×~-]*)$/;
  const CIRCLED_LEAD = /^([①-⑩])\s+(?=\S)/;
  // Counters whose English takes a plural: [one, many].
  const COUNTERS = { '일': ['day', 'days'], '문제': ['question', 'questions'] };

  let lang = 'ko';
  let roots = [];
  let koTitle = null;
  let attrObserver = null;
  const savedHtml = new WeakMap(); // [data-ui-en] element -> its Korean innerHTML

  // ── Pure ──

  function langOf(settings) {
    return settings && settings.uiLang === 'en' ? 'en' : 'ko';
  }

  function table() {
    return root.UI_EN || {};
  }

  // "16번" is question 16: English puts the Q first. "1일" / "3일", "1문제" / "5문제" agree in number.
  function numbered(num, restKey, t) {
    if (restKey === '번') return 'Q' + num.replace(/\s+/g, ' ').trim();
    const rest = t[restKey];
    if (!rest) return null;
    const forms = COUNTERS[restKey];
    return num.trim() + ' ' + (forms ? forms[/^\s*1\s*$/.test(num) ? 0 : 1] : rest.en);
  }

  // A key plus a trailing circled digit or count, in English: "고른 답 ③" -> "Your pick ③".
  function tailEn(text, t) {
    const m = TAIL.exec(String(text).trim());
    const hit = m && t[GT.uiKey(m[1])];
    return hit ? hit.en + ' ' + m[2].trim() : null;
  }

  function wordEn(w, t) {
    const e = t[GT.uiKey(w)];
    if (e) return e.en;
    const m = NUM_LEAD.exec(w);
    return (m && numbered(m[1], GT.uiKey(m[2]), t)) || w;
  }

  // One piece between separators: the whole piece, then "number + rest", then word by word.
  function pieceEn(text, t) {
    const whole = t[GT.uiKey(text)];
    if (whole) return whole.en;
    const m = NUM_LEAD.exec(text);
    const num = m ? numbered(m[1], GT.uiKey(m[2]), t) : null;
    if (num) return num;
    const counted = tailEn(text, t);
    if (counted) return counted;
    return text.split(/(\s+)/).map(w => (GT.hasHangul(w) ? wordEn(w, t) : w)).join('');
  }

  // English for one run of Korean UI text. Leading and trailing spaces and middle-dot
  // separators are kept (a whole-line key match drops them from the key, not from the line).
  function enOf(text, tbl) {
    const s = String(text == null ? '' : text);
    if (!GT.hasHangul(s)) return s;
    const t = tbl || table();
    const lead = /^[\s·]*/.exec(s)[0];
    const tail = /[\s·]*$/.exec(s)[0];
    const core = s.slice(lead.length, s.length - tail.length);
    const circled = CIRCLED_LEAD.exec(core);
    if (circled) return lead + circled[1] + ' ' + enOf(core.slice(circled[0].length), t) + tail;
    // A whole-line key with a count after it ("지도 열기 · 본 문제 12 / 50") is one entry.
    const counted = t[GT.uiKey(core)] ? null : tailEn(core, t);
    if (counted) return lead + counted + tail;
    const pieces = GT.uiSegments(t, core).map(seg => {
      if (seg.entry) return seg.entry.en;
      return GT.hasHangul(seg.text) ? pieceEn(seg.text, t) : seg.text;
    });
    const out = GT.composeLine(pieces);
    return out ? lead + out + tail : s;
  }

  // "5" + "문제" reads "5questions" once the counter is English: add the missing space.
  function spaced(en, prevText) {
    return /^[A-Za-z(]/.test(en) && /[0-9A-Za-z%×)]$/.test(prevText || '') ? ' ' + en : en;
  }

  // "2" + "day" reads "2 days": the counter takes the plural unless the number before it is 1.
  function agree(en, prevText) {
    const prev = String(prevText || '');
    return en === 'day' && /\d\s*$/.test(prev) && !/(^|[^\d.])1\s*$/.test(prev) ? 'days' : en;
  }

  function isEn() {
    return lang === 'en';
  }

  // ── DOM: to English ──

  // Exam and study content stays; a UI label inside it (UI_IN_KEEP) still switches.
  function kept(el) {
    if (!el) return true;
    return !el.closest(UI_IN_KEEP_SEL) && !!el.closest(KEEP_SEL);
  }

  function textToEn(node) {
    const parent = node.parentElement;
    if (!parent || kept(parent) || parent.closest('[data-ui-en]')) return;
    const raw = enOf(node.nodeValue);
    if (raw === node.nodeValue) return;
    const prev = node.previousSibling ? node.previousSibling.textContent : '';
    const en = spaced(agree(raw, prev), prev);
    const span = document.createElement('span');
    span.className = 'ui-en';
    span.lang = 'en';
    span.dataset.ko = node.nodeValue;
    span.textContent = en;
    node.replaceWith(span);
  }

  function attrsToEn(el) {
    ATTRS.forEach(a => {
      const v = el.getAttribute(a);
      if (!v || !GT.hasHangul(v)) return;
      el.setAttribute('data-ko-' + a, v);
      el.setAttribute(a, enOf(v));
    });
  }

  function withSelf(el, sel) {
    const list = Array.from(el.querySelectorAll(sel));
    return el.matches && el.matches(sel) ? [el, ...list] : list;
  }

  function localize(node) {
    if (!isEn() || !node || !node.isConnected) return;
    if (node.nodeType === 3) { textToEn(node); return; }
    if (node.nodeType !== 1) return;
    withSelf(node, '[data-ui-en]').forEach(el => {
      if (kept(el.parentElement) || el.lang === 'en') return;
      savedHtml.set(el, el.innerHTML);
      el.textContent = el.dataset.uiEn;
      el.lang = 'en';
    });
    // Words the gloss layer wrapped become one text node again before they switch.
    withSelf(node, '.gloss-run').forEach(run => {
      if (!kept(run.parentElement)) run.replaceWith(document.createTextNode(run.textContent));
    });
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: t => (GT.hasHangul(t.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
    });
    const texts = [];
    while (walker.nextNode()) texts.push(walker.currentNode);
    texts.forEach(textToEn);
    withSelf(node, ATTRS.map(a => '[' + a + ']').join(', ')).forEach(attrsToEn);
  }

  // ── DOM: back to Korean ──

  function restore(el) {
    withSelf(el, '.ui-en').forEach(span => span.replaceWith(document.createTextNode(span.dataset.ko || '')));
    withSelf(el, '[data-ui-en]').forEach(x => {
      if (!savedHtml.has(x)) return;
      x.innerHTML = savedHtml.get(x);
      savedHtml.delete(x);
      x.removeAttribute('lang');
    });
    ATTRS.forEach(a => withSelf(el, '[data-ko-' + a + ']').forEach(x => {
      x.setAttribute(a, x.getAttribute('data-ko-' + a));
      x.removeAttribute('data-ko-' + a);
    }));
  }

  // ── State ──

  function syncTitle() {
    if (typeof document === 'undefined') return;
    if (isEn()) {
      koTitle = document.title;
      document.title = enOf(koTitle);
    } else if (koTitle !== null) {
      koTitle = null;
    }
  }

  function syncButton() {
    const btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(isEn()));
    btn.querySelectorAll('[data-lang]').forEach(o => o.classList.toggle('is-on', o.dataset.lang === lang));
  }

  function apply() {
    document.documentElement.setAttribute('data-ui-lang', lang);
    if (isEn()) roots.forEach(localize);
    else {
      roots.forEach(restore);
      if (koTitle !== null) { document.title = koTitle; koTitle = null; }
    }
    if (isEn()) syncTitle();
    syncButton();
    if (root.Translate && root.Translate.refreshUi) root.Translate.refreshUi();
    document.documentElement.classList.remove('ui-lang-pending');
  }

  function toggle() {
    lang = isEn() ? 'ko' : 'en';
    if (root.Store) root.Store.setSetting('uiLang', lang);
    apply();
  }

  // Attributes a screen changes later (a theme label, a count) switch too.
  function onAttrs(records) {
    if (!isEn()) return;
    records.forEach(r => {
      const el = r.target;
      if (el.nodeType === 1 && GT.hasHangul(el.getAttribute(r.attributeName) || '')) attrsToEn(el);
    });
    attrObserver.takeRecords();
  }

  // Called by js/translate.js for every node a screen adds.
  function onAdded(node) {
    if (isEn()) localize(node);
  }

  function init(initial) {
    lang = initial === 'en' ? 'en' : 'ko';
    roots = ['.skip-link', 'header.topbar', '#screen', '#storage-note'].map(s => document.querySelector(s)).filter(Boolean);
    attrObserver = new MutationObserver(onAttrs);
    roots.forEach(r => attrObserver.observe(r, { subtree: true, attributes: true, attributeFilter: ATTRS }));
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.addEventListener('click', toggle);
    apply();
  }

  const UiLang = { KEEP, UI_IN_KEEP, langOf, enOf, spaced, agree, isEn, init, toggle, apply, localize, restore, onAdded, syncTitle };

  if (typeof window !== 'undefined') window.UiLang = UiLang;
  if (typeof module !== 'undefined') module.exports = UiLang;
})();
