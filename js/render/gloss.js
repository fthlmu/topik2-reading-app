// gloss.js: word tooltip (romanization + English) for .gloss-word elements.
// Port of legacy app.js L767-806; adds tap-to-show for touch screens and
// focus-to-show for keyboard users (gloss words are focusable, one Tab stop per sentence;
// translate.js moves focus between the words with the arrow keys). The word a tooltip
// belongs to points at it with aria-describedby while it is shown.
// Hover listens to mouse and pen pointers only: a touch tap must never "hover" first,
// or iPad Safari treats the first tap on a button as a hover and drops the click.
// A word inside a control (button, link, summary) shows on hover only; a tap presses
// the control. setEnabled(false) (the 주석 toggle) hides and stops every tooltip.
// Position is passed through CSS custom properties (--tt-x / --tt-y).
(function () {
  'use strict';

  const HIDE_DELAY_MS = 80;
  const GAP_PX = 8;
  const EDGE_PX = 8;

  let tip = null;
  let romanEl = null;
  let enEl = null;
  let hideTimer = null;
  let bound = false;
  let current = null; // the word the tooltip belongs to
  let enabled = true;

  const CONTROL = 'a, button, summary, label, [role="button"]';

  function show(word) {
    const roman = word.dataset.roman || '';
    const en = word.dataset.en || '';
    if (!tip || !enabled || (!roman && !en)) return;
    clearTimeout(hideTimer);
    if (current && current !== word) current.removeAttribute('aria-describedby');
    current = word;
    word.setAttribute('aria-describedby', tip.id);
    romanEl.textContent = roman;
    romanEl.hidden = !roman;
    enEl.textContent = en;
    tip.hidden = false;
    place(word);
  }

  // Centre above the word; flip below when there is no room; clamp to viewport.
  function place(word) {
    const r = word.getBoundingClientRect();
    tip.style.setProperty('--tt-x', '0px');
    tip.style.setProperty('--tt-y', '0px');
    const t = tip.getBoundingClientRect();
    const half = t.width / 2;
    const minX = EDGE_PX + half;
    const maxX = window.innerWidth - EDGE_PX - half;
    const x = Math.min(Math.max(r.left + r.width / 2, minX), Math.max(minX, maxX));
    const above = r.top - t.height - GAP_PX;
    const y = above >= EDGE_PX ? above : r.bottom + GAP_PX;
    tip.style.setProperty('--tt-x', x + 'px');
    tip.style.setProperty('--tt-y', y + 'px');
  }

  function hideSoon() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, HIDE_DELAY_MS);
  }

  function hide() {
    clearTimeout(hideTimer);
    if (current) current.removeAttribute('aria-describedby');
    current = null;
    if (tip) tip.hidden = true;
  }

  // A re-render can remove the word the tooltip belongs to; close it then.
  function hideIfDetached() {
    if (current && !current.isConnected) hide();
  }

  // Focus moves can scroll the page; keep a focused word's tooltip attached.
  function onScroll() {
    if (current && tip && !tip.hidden && document.activeElement === current) place(current);
    else hide();
  }

  // Keyboard focus only: a tap or long-press also focuses the word, and the tap is handled
  // by onClick (a long-press shows the line instead, so no tooltip).
  function isKeyboardFocus(el) {
    try { return el.matches(':focus-visible'); } catch (err) { return true; }
  }

  function onFocusIn(e) {
    const word = e.target.closest && e.target.closest('.gloss-word');
    if (word && isKeyboardFocus(word)) show(word);
  }

  function onFocusOut(e) {
    const word = e.target.closest && e.target.closest('.gloss-word');
    if (word && word === current) hideSoon();
  }

  function isHover(e) {
    return e.pointerType === 'mouse' || e.pointerType === 'pen';
  }

  function onOver(e) {
    hideIfDetached();
    if (!isHover(e)) return;
    const word = e.target.closest && e.target.closest('.gloss-word');
    if (word) show(word);
  }

  function onOut(e) {
    if (!isHover(e)) return;
    const word = e.target.closest && e.target.closest('.gloss-word');
    const into = e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.gloss-word');
    if (word && into !== word) hideSoon();
  }

  // Touch: tap a word to show its gloss, tap anywhere else to dismiss.
  function onClick(e) {
    const word = e.target.closest && e.target.closest('.gloss-word');
    if (word && !word.closest(CONTROL)) show(word);
    else hide();
  }

  function setEnabled(on) {
    enabled = !!on;
    if (!enabled) hide();
  }

  // True while the tooltip belongs to the focused word (Escape should close it).
  function isFocusShown() {
    return !!current && !!tip && !tip.hidden && document.activeElement === current;
  }

  function init(tooltipEl) {
    if (bound || !tooltipEl) return;
    tip = tooltipEl;
    romanEl = tip.querySelector('[data-tt="roman"]');
    enEl = tip.querySelector('[data-tt="en"]');
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('click', onClick);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', hide);
    bound = true;
  }

  const Gloss = { init, hide, hideIfDetached, setEnabled, isFocusShown };

  if (typeof window !== 'undefined') window.Gloss = Gloss;
  if (typeof module !== 'undefined') module.exports = Gloss;
})();
