// translate.js: the on-demand English layer on every screen (DESIGN.md section 8).
//
// Word layer: every Korean word is a .gloss-word whose tooltip (js/render/gloss.js) shows
//   romanization (when known) and English on mouse hover, keyboard focus or one tap.
//   Passages render their own words (passage.js). Everything else under header.topbar
//   and #screen is wrapped here after every render (a MutationObserver), with glosses
//   from UI_EN (js/ui-strings.js) and, for lesson words, from lessons.js. Words inside a
//   button, link or summary are not Tab stops and show their tooltip on mouse hover only,
//   so one tap still presses the control.
// Line layer: right-click (mouse) or long-press (touch: 500 ms, under 8 px of movement) on
//   a sentence or UI line toggles its full English in a .line-en right beneath it, Korean
//   keyword in bold. T toggles the line of the focused word; Escape closes every line.
// Keyboard: one Tab stop per sentence (or per UI line); ArrowLeft/ArrowRight move focus between
//   the words of that line (roving tabindex, GlossText.rovingIndex).
// Master toggle (주석, key G, top bar): hides both layers everywhere. Stored in
//   settings.gloss; Sprint and Mock follow examOn() instead: on before LEARN_END, off from
//   it, unless the learner toggled during a run in the same phase (settings.glossExam).
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const GT = root.GlossText || require('./gloss-text.js');

  const LEARN_END = '2026-11-18'; // first day of the Drill phase
  const LONG_PRESS_MS = 500;
  const MOVE_PX = 8;
  const CLICK_GUARD_MS = 800;

  const SKIP = '.gloss-word, .gloss-run, code, kbd, input, textarea, select, option, script, style, svg, template, ' +
    '.line-en, .sr-only, [data-no-gloss], [lang="en"], .passage, .insert-box__text, #gloss-tooltip';
  const CONTROL = 'a, button, summary, label, [role="button"]';
  const HOST = '.sent, [data-sent-key], [data-line-en], p, h1, h2, h3, h4, h5, h6, li, dt, dd, th, td, ' +
    'caption, figcaption, summary, legend, label, button, a';
  const LINE_SKIP = 'input, textarea, select, [data-no-gloss], [lang="en"]';
  const COMPOSE_SKIP = '.line-en, .sr-only, .ov, svg, script, style, [lang="en"]';

  // ── Pure: which state applies ──

  function phaseOf(iso) {
    return String(iso) < LEARN_END ? 'learn' : 'drill';
  }

  // Sprint and Mock: an override from the same phase wins; else on in Learn (unless the
  // master toggle is off), off in Drill.
  function examOn(settings, iso) {
    const s = settings || {};
    const phase = phaseOf(iso);
    const o = s.glossExam;
    if (o && o.phase === phase && typeof o.on === 'boolean') return o.on;
    return phase === 'learn' && s.gloss !== false;
  }

  function layerOn(settings, iso, exam) {
    return exam ? examOn(settings, iso) : (settings || {}).gloss !== false;
  }

  // ── State ──

  let ctx = { exam: false };
  let roots = [];
  let observer = null;
  let press = null;          // { id, x, y, host, timer, fired }
  let lastPressAt = 0;
  let guardClickUntil = 0;
  let uiIdx = null;
  let lessonIdx = null;
  const lineOf = new WeakMap(); // host -> .line-en
  const hostOf = new WeakMap(); // .line-en -> host
  let open = [];

  const UI = () => root.UI_EN || {};
  const SENT = () => root.TOPIK2_SENT || {};
  const Gloss = () => root.Gloss || null;

  function today() {
    return root.Util.toISODate(new Date());
  }

  function settingsNow() {
    return root.Store ? root.Store.get().settings : {};
  }

  // The layer state is cached: isOn() runs on every pointer, key and DOM event, and Store.get()
  // reads localStorage. refresh() runs when the inputs change (toggle, setContext, glosschange).
  let onCache = null;

  function refresh() {
    onCache = layerOn(settingsNow(), today(), ctx.exam);
    return onCache;
  }

  function isOn() {
    return onCache === null ? refresh() : onCache;
  }

  // ── Word glosses ──

  function uiWordIndex() {
    if (uiIdx) return uiIdx;
    const m = new Map();
    Object.values(UI()).forEach(e => Object.keys(e.words || {}).forEach(k => {
      const w = GT.stripWord(k);
      if (w && !m.has(w)) m.set(w, e.words[k]);
    }));
    uiIdx = m;
    return m;
  }

  function addTokens(m, list) {
    (list || []).forEach(t => {
      const w = t && !t.isBlank ? GT.stripWord(t.kr) : '';
      if (w && t.en && !m.has(w)) m.set(w, { en: t.en, roman: GT.stripWord(t.roman) });
    });
  }

  // Word forms from the passages and vocab lists: { en, roman } by stripped Korean form.
  function lessonIndex() {
    if (lessonIdx) return lessonIdx;
    const m = new Map();
    const data = root.Util && root.Util.data();
    Object.values((data && data.lessons) || {}).forEach(l => {
      addTokens(m, l.passageTokens);
      (l.passageParas || []).forEach(p => addTokens(m, p.tokens));
      (l.orderingItems || []).forEach(it => addTokens(m, it.tokens));
      addTokens(m, l.vocab);
    });
    lessonIdx = m;
    return m;
  }

  // Order: the line's own entry, a table entry for the word itself, any entry's gloss of
  // it, then the lessons. "29일" / "5문제": the number stays, its counter is glossed.
  function glossFor(word, entries) {
    const w = GT.stripWord(word);
    if (!w || !GT.hasHangul(w)) return null;
    const lw = lessonIndex().get(w);
    let en = '';
    (entries || []).some(e => { en = GT.wordIn(e.words, word); return !!en; });
    if (!en) { const e = UI()[GT.uiKey(w)]; en = e ? e.en : ''; }
    if (!en) en = uiWordIndex().get(w) || '';
    if (!en && lw) en = lw.en;
    if (!en) {
      const m = /^([\d.,]+)(.+)$/.exec(w);
      const unit = m ? glossFor(m[2], []) : null;
      if (unit) en = m[1] + ' ' + unit.en;
    }
    return en ? { en, roman: lw ? lw.roman : '' } : null;
  }

  // ── UI pass: wrap Korean words of UI copy in .gloss-word spans ──

  function inRoots(el) {
    return !!el && roots.some(r => r === el || r.contains(el));
  }

  function isSkipped(el) {
    return !el || !!el.closest(SKIP);
  }

  function hostFor(el) {
    const host = el.closest(HOST);
    return host && inRoots(host) ? host : el;
  }

  function wordSpan(chunk, g, focusable) {
    const span = document.createElement('span');
    span.className = 'gloss-word';
    span.dataset.en = g.en;
    if (g.roman) span.dataset.roman = g.roman;
    if (focusable) span.tabIndex = -1; // roveGroup picks the one Tab stop of the line
    span.textContent = chunk;
    return span;
  }

  function wrapText(node) {
    const parent = node.parentElement;
    if (!parent || !GT.hasHangul(node.nodeValue) || isSkipped(parent) || !inRoots(parent)) return;
    const entries = GT.uiSegments(UI(), node.nodeValue).map(s => s.entry).filter(Boolean);
    const focusable = !parent.closest(CONTROL) && !parent.closest('[aria-hidden="true"]');
    // One span per text node: in a flex row (a .btn, a fold summary) the words stay one item,
    // so the row's gap does not open between them.
    const run = document.createElement('span');
    run.className = 'gloss-run';
    let wrapped = 0;
    node.nodeValue.split(/(\s+)/).forEach(chunk => {
      if (!chunk) return;
      const g = GT.hasHangul(chunk) ? glossFor(chunk, entries) : null;
      if (g) wrapped += 1;
      run.appendChild(g ? wordSpan(chunk, g, focusable) : document.createTextNode(chunk));
    });
    if (!wrapped) return;
    hostFor(parent).classList.add('ui-line');
    node.replaceWith(run);
    roveWithin(run);
  }

  function textNodes(el) {
    const out = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: t => (GT.hasHangul(t.nodeValue) && !isSkipped(t.parentElement)
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
    });
    while (walker.nextNode()) out.push(walker.currentNode);
    return out;
  }

  function passNode(n) {
    if (!n || !n.isConnected) return;
    if (n.nodeType === 3) { wrapText(n); return; }
    if (n.nodeType === 1 && !isSkipped(n)) textNodes(n).forEach(wrapText);
  }

  // ── Roving tabindex: one Tab stop per sentence / UI line ──

  const WORD_TAB = '.gloss-word[tabindex]';

  function groupOf(word) {
    return word.closest(HOST) || word.parentElement;
  }

  function groupWords(group) {
    return Array.from(group.querySelectorAll(WORD_TAB)).filter(w => groupOf(w) === group);
  }

  // Exactly one word of the group has tabindex 0: the one that has it, else the first.
  function roveGroup(group) {
    const words = groupWords(group);
    const keep = words.find(w => w.tabIndex === 0) || words[0];
    words.forEach(w => { w.tabIndex = w === keep ? 0 : -1; });
  }

  function roveWithin(el) {
    if (!el || el.nodeType !== 1) return;
    const list = Array.from(el.querySelectorAll(WORD_TAB));
    if (el.matches(WORD_TAB)) list.push(el);
    new Set(list.map(groupOf).filter(Boolean)).forEach(roveGroup);
  }

  // Off: words stay in the page but leave the Tab order.
  function untab(el) {
    if (!el || el.nodeType !== 1) return;
    const sel = '.gloss-word[tabindex="0"]';
    const list = Array.from(el.querySelectorAll(sel));
    if (el.matches(sel)) list.push(el);
    list.forEach(w => { w.tabIndex = -1; });
  }

  // The focused word becomes its line's Tab stop, so Shift+Tab and Tab resume from it.
  function onFocusIn(e) {
    const word = e.target && e.target.closest && e.target.closest(WORD_TAB);
    if (!word || !isOn()) return;
    groupWords(groupOf(word)).forEach(w => { w.tabIndex = w === word ? 0 : -1; });
  }

  // ArrowLeft/ArrowRight on a focused word: focus its neighbour in the line. True when handled.
  function moveWord(key) {
    const cur = document.activeElement;
    if (!isOn() || !cur || !cur.matches || !cur.matches(WORD_TAB)) return false;
    const words = groupWords(groupOf(cur));
    const next = GT.rovingIndex(words.length, words.indexOf(cur), key);
    if (next < 0) return false;
    words[next].focus();
    return true;
  }

  function onMutations(records) {
    const g = Gloss();
    if (g) g.hideIfDetached();
    const on = isOn();
    records.forEach(r => r.addedNodes.forEach(n => {
      if (on) { passNode(n); roveWithin(n); } else untab(n);
    }));
    observer.takeRecords(); // the spans just added are ours
  }

  // ── Line layer ──

  function findLineHost(target) {
    if (!isOn() || !target || !target.closest) return null;
    const line = target.closest('.line-en');
    if (line) return hostOf.get(line) || null;
    if (!inRoots(target) || target.closest(LINE_SKIP)) return null;
    const host = target.closest(HOST);
    if (!host || !inRoots(host)) return null;
    // Inside a passage only sentences translate (not the gap between two of them).
    if (host.closest('.passage') && !host.matches('.sent, [data-sent-key], [data-line-en]')) return null;
    return host;
  }

  function segmentEn(seg, entries) {
    if (seg.entry) { entries.push(seg.entry); return seg.entry.en; }
    if (!GT.hasHangul(seg.text)) return seg.text;
    return seg.text.split(/\s+/).map(w => {
      if (!GT.hasHangul(w)) return w;
      const e = UI()[GT.uiKey(w)];
      if (e) { entries.push(e); return e.en; }
      const g = glossFor(w, []);
      return g ? g.en : '';
    }).join(' ');
  }

  function runEn(text, pieces, entries) {
    if (!text.trim()) return;
    if (!GT.hasHangul(text)) { pieces.push(text); return; }
    GT.uiSegments(UI(), text).forEach(seg => pieces.push(segmentEn(seg, entries)));
  }

  // Text nodes and the word spans wrapped from them read as one run, as the code wrote it.
  function composePieces(el, host, pieces, entries) {
    let run = '';
    Array.from(el.childNodes).forEach(n => {
      if (n.nodeType === 3 || (n.nodeType === 1 && n.matches('.gloss-word, .gloss-run'))) { run += n.textContent; return; }
      runEn(run, pieces, entries);
      run = '';
      if (n.nodeType !== 1 || n.matches(COMPOSE_SKIP)) return;
      if (n !== host && n.hasAttribute('data-line-en')) { pieces.push(n.dataset.lineEn); entries.push({ words: {} }); return; }
      composePieces(n, host, pieces, entries);
    });
    runEn(run, pieces, entries);
  }

  // A UI line: the English of each text piece, numbers and marks kept in place.
  function composeUi(host) {
    const pieces = [];
    const entries = [];
    composePieces(host, host, pieces, entries);
    const en = GT.composeLine(pieces);
    return entries.length && /[A-Za-z]/.test(en) ? { en, key: GT.keywordOf(entries), note: '' } : null;
  }

  function entriesOf(text) {
    return GT.uiSegments(UI(), text).map(s => s.entry).filter(Boolean);
  }

  function lineFor(host) {
    if (host.hasAttribute('data-sent-key')) {
      const s = GT.lookupSent(SENT(), host.dataset.sentKey);
      const en = s ? s.en : host.dataset.lineEn || '';
      return en ? { en, key: s ? s.key : '', note: host.dataset.note || '' } : null;
    }
    if (host.hasAttribute('data-line-en')) {
      return { en: host.dataset.lineEn, key: GT.keywordOf(entriesOf(host.textContent)), note: '' };
    }
    return composeUi(host);
  }

  function buildLine(line) {
    const el = document.createElement('span');
    el.className = 'line-en';
    el.lang = 'en';
    el.setAttribute('role', 'status');
    if (line.key) {
      const b = document.createElement('b');
      b.lang = 'ko';
      b.textContent = line.key;
      el.append(b, ' ');
    }
    el.append(line.en);
    if (line.note) {
      const note = document.createElement('span');
      note.className = 'line-en__note';
      note.textContent = '※ ' + line.note;
      el.append(note);
    }
    return el;
  }

  function isRowFlex(el) {
    const cs = getComputedStyle(el);
    return /flex/.test(cs.display) && !/column/.test(cs.flexDirection) && cs.flexWrap === 'nowrap';
  }

  // Sentences and controls get the line after them (inside the paragraph, or under the
  // row of buttons); any other line holds it as its last child. A row that cannot wrap
  // hands the line to its parent.
  function place(host, el) {
    if (host.matches('summary') || (!host.matches('.sent, a, button') && !isRowFlex(host))) {
      host.appendChild(el);
      return;
    }
    let t = host;
    while (t.parentElement && isRowFlex(t.parentElement) && inRoots(t.parentElement.parentElement)) t = t.parentElement;
    t.after(el);
  }

  function openLine(host) {
    const el = lineOf.get(host);
    return el && el.isConnected ? el : null;
  }

  // → true when a line was shown or hidden.
  function toggleLine(host) {
    const shown = openLine(host);
    if (shown) {
      shown.remove();
      open = open.filter(x => x !== shown);
      return true;
    }
    const line = lineFor(host);
    if (!line) return false;
    const el = buildLine(line);
    place(host, el);
    lineOf.set(host, el);
    hostOf.set(el, host);
    open = [...open.filter(x => x.isConnected), el];
    if (Gloss()) Gloss().hide();
    return true;
  }

  function closeAll() {
    const live = open.filter(x => x.isConnected);
    live.forEach(x => x.remove());
    open = [];
    return live.length > 0;
  }

  // ── Gestures ──

  function cancelPress() {
    if (press) clearTimeout(press.timer);
    press = null;
  }

  function onPointerDown(e) {
    cancelPress();
    guardClickUntil = 0; // a new press: the old long-press sent no click, so stop guarding
    if (e.pointerType === 'mouse' || !e.isPrimary || e.button > 0) return;
    const host = findLineHost(e.target);
    if (!host) return;
    const p = { id: e.pointerId, x: e.clientX, y: e.clientY, host, timer: null, fired: false };
    p.timer = setTimeout(() => {
      if (press !== p) return;
      p.fired = true;
      lastPressAt = Date.now();
      toggleLine(p.host);
    }, LONG_PRESS_MS);
    press = p;
  }

  function onPointerMove(e) {
    if (!press || e.pointerId !== press.id || press.fired) return;
    if (Math.hypot(e.clientX - press.x, e.clientY - press.y) > MOVE_PX) cancelPress();
  }

  function onPointerEnd(e) {
    if (!press || e.pointerId !== press.id) return;
    if (press.fired) guardClickUntil = Date.now() + CLICK_GUARD_MS;
    cancelPress();
  }

  // The click that ends a long-press must not press the button under it.
  function onClickCapture(e) {
    if (Date.now() >= guardClickUntil) return;
    guardClickUntil = 0;
    e.preventDefault();
    e.stopPropagation();
  }

  function onContextMenu(e) {
    if (!isOn()) return;
    // The menu a touch browser opens after our long-press: swallow it.
    if ((press && press.fired) || Date.now() - lastPressAt < CLICK_GUARD_MS) { e.preventDefault(); return; }
    const host = findLineHost(e.target);
    if (!host) return;
    if (press) { clearTimeout(press.timer); press.fired = true; lastPressAt = Date.now(); }
    if (toggleLine(host)) e.preventDefault();
  }

  // ── Master toggle ──

  function apply() {
    const on = isOn();
    document.documentElement.classList.toggle('gloss-off', !on);
    const btn = document.getElementById('gloss-toggle');
    if (btn) btn.setAttribute('aria-pressed', String(on));
    if (Gloss()) Gloss().setEnabled(on);
    if (!on) closeAll();
    if (on) {
      roots.forEach(passNode);
      roots.forEach(roveWithin);
    } else {
      untab(document.body);
    }
    if (observer) observer.takeRecords();
  }

  function toggle() {
    const on = !isOn();
    if (ctx.exam) root.Store.setSetting('glossExam', { on, phase: phaseOf(today()) });
    else root.Store.setSetting('gloss', on);
    refresh();
    apply();
    document.dispatchEvent(new CustomEvent('glosschange', { detail: { on } }));
  }

  // Called by the router before a screen mounts: Sprint and Mock runs are exam screens.
  function setContext(next) {
    cancelPress(); // a pending long-press must not fire on a host the old screen removed
    ctx = { exam: !!(next && next.exam) };
    refresh();
    apply();
  }

  function isKey(e, code, latin, hangul) {
    const k = String(e.key).toLowerCase();
    return e.code === code || k === latin || k === hangul;
  }

  // Global keys, before the screen's own: G, T, and Escape while a line or a focus tooltip is open.
  function onKey(e) {
    const g = Gloss();
    if (e.key === 'Escape') {
      if (closeAll()) return true;
      const focused = !!(g && g.isFocusShown());
      if (g) g.hide();
      return focused;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') return moveWord(e.key);
    if (isKey(e, 'KeyG', 'g', 'ㅎ')) { toggle(); return true; }
    if (isKey(e, 'KeyT', 't', 'ㅅ')) {
      const host = findLineHost(document.activeElement);
      return host ? (toggleLine(host), true) : false;
    }
    return false;
  }

  function init() {
    roots = [document.querySelector('header.topbar'), document.getElementById('screen')].filter(Boolean);
    observer = new MutationObserver(onMutations);
    roots.forEach(r => observer.observe(r, { childList: true, subtree: true }));
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerup', onPointerEnd, { passive: true });
    document.addEventListener('pointercancel', onPointerEnd, { passive: true });
    document.addEventListener('click', onClickCapture, true);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('glosschange', refresh);
    const btn = document.getElementById('gloss-toggle');
    if (btn) btn.addEventListener('click', toggle);
    apply();
  }

  const Translate = {
    LEARN_END, phaseOf, examOn, layerOn, init, setContext, isOn, toggle, onKey,
    toggleLine, closeAll, findLineHost, lineFor
  };

  if (typeof window !== 'undefined') window.Translate = Translate;
  if (typeof module !== 'undefined') module.exports = Translate;
})();
