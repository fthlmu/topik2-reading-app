// util.js — shared helpers: escaping, DOM lookup, data access, dates.
// Classic script: attaches window.Util; also exports for Node tests.
(function () {
  'use strict';

  const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const CIRCLED = ['', '①', '②', '③', '④', '⑤'];
  const EXAM_DATE = '2027-01-10';
  const DAY_MS = 86400000;
  const WEEKDAYS_KR = ['일', '월', '화', '수', '목', '금', '토'];

  // Escape any value for safe insertion into HTML text or attribute values.
  function esc(value) {
    if (value == null) return '';
    return String(value).replace(/[&<>"']/g, ch => ESC_MAP[ch]);
  }

  // Lesson explanations carry a few inline tags (<b>, <em>, <strong>).
  // Escape everything first, then re-allow only those exact bare tags.
  function richText(value) {
    return esc(value).replace(/&lt;(\/?)(b|em|strong)&gt;/g, '<$1$2>');
  }

  // Data notes start with an emoji warning sign; the UI uses no emoji.
  function cleanNote(value) {
    if (value == null) return '';
    return String(value)
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{26FF}\uFE0F\u200D]/gu, '')
      .trim();
  }

  function circled(n) {
    return CIRCLED[n] || String(n);
  }

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  // ── Lesson data access (window.TOPIK2 from lessons.js) ──
  function data() {
    const root = typeof window !== 'undefined' ? window : globalThis;
    return root.TOPIK2 || null;
  }

  function total() {
    const d = data();
    return d && d.meta && d.meta.total ? d.meta.total : 50;
  }

  function lesson(n) {
    const d = data();
    return d && d.lessons ? d.lessons['Q' + n] || null : null;
  }

  function sections() {
    const d = data();
    return d && Array.isArray(d.sections) ? d.sections : [];
  }

  function section(id) {
    return sections().find(s => s.id === id) || null;
  }

  // "[1–2] 빈칸에 알맞은 말" → { range: '1–2', text: '빈칸에 알맞은 말' }
  function splitSectionLabel(label) {
    const m = /^\[([^\]]+)\]\s*(.*)$/.exec(label || '');
    return m ? { range: m[1], text: m[2] } : { range: '', text: label || '' };
  }

  // ── Dates (local calendar days) ──
  function toISODate(date) {
    const d = date || new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  function daysUntil(iso, now) {
    const [y, m, d] = iso.split('-').map(Number);
    const from = now || new Date();
    const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    return Math.round((Date.UTC(y, m - 1, d) - a) / DAY_MS);
  }

  // "2026-10-28" + n days → "YYYY-MM-DD" (local calendar arithmetic).
  function addDays(iso, n) {
    const [y, m, d] = String(iso).split('-').map(Number);
    return toISODate(new Date(y, m - 1, d + n));
  }

  function formatDateKr(date) {
    const d = date || new Date();
    return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' +
      WEEKDAYS_KR[d.getDay()] + ')';
  }

  function formatTime(date) {
    return String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  }

  // True when a key event should be left to a text field.
  function isTypingTarget(el) {
    if (!el || !el.tagName) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable === true;
  }

  // True when Enter/Space on this element belongs to a control (link, button,
  // fold, focusable word) and must not trigger a screen-level shortcut.
  function isControlTarget(el) {
    return !!(el && el.closest && el.closest('a, button, summary, [tabindex="0"]'));
  }

  const Util = {
    EXAM_DATE, esc, richText, cleanNote, circled, $, $$,
    data, total, lesson, sections, section, splitSectionLabel,
    toISODate, addDays, daysUntil, formatDateKr, formatTime, isTypingTarget, isControlTarget
  };

  if (typeof window !== 'undefined') window.Util = Util;
  if (typeof module !== 'undefined') module.exports = Util;
})();
