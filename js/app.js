// app.js: boot, hash router, screen registry, theme toggle, global keys.
// The English layer (js/translate.js) gets each route first: Sprint and Mock runs are
// exam screens, and its keys (G, T, Escape over an open line) come before the screen's.
// Routes: #/today (default) · #/map · #/study/<n> · #/sprint[/retry] ·
// #/review/<id> (sprint or mock) · #/deck[/then-sprint] · #/mock[/run].
// A screen is { title, mount(root, params), unmount?(), onKey?(e) → handled },
// defined as window.<Name>Screen by a script loaded before this file.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || {};
  const APP_TITLE = 'TOPIK II 읽기 · 102회';
  const THEMES = ['auto', 'light', 'dark'];
  const THEME_LABEL = { auto: '자동', light: '밝게', dark: '어둡게' };
  const NAV_FOR = {
    today: 'today', sprint: 'today', review: 'today', map: 'map', study: 'map', deck: 'deck', mock: 'mock'
  };
  const SCREENS = {
    today: 'TodayScreen', map: 'MapScreen', study: 'StudyScreen', sprint: 'SprintScreen',
    review: 'ReviewScreen', deck: 'DeckScreen', mock: 'MockScreen'
  };

  let main = null;
  let current = null;

  // Unknown route (or a screen whose script failed to load) → null → back to Today.
  function resolve(name) {
    return Object.prototype.hasOwnProperty.call(SCREENS, name) ? window[SCREENS[name]] || null : null;
  }

  function parse(hash) {
    const parts = String(hash || '').replace(/^#\/?/, '').split('/').filter(Boolean);
    const name = parts[0] || 'today';
    return { name, params: name === 'study' ? { q: parts[1] } : { arg: parts[1] || null } };
  }

  function isExam(name, params) {
    return name === 'sprint' || (name === 'mock' && params.arg === 'run');
  }

  function markNav(name) {
    const active = NAV_FOR[name] || null;
    Util.$$('[data-nav]').forEach(a => {
      if (a.dataset.nav === active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function route() {
    // In-page anchors (e.g. the skip link "#screen") are not routes.
    const isRoute = !location.hash || location.hash.indexOf('#/') === 0;
    if (!isRoute && current) return;
    const { name, params } = parse(isRoute ? location.hash : '');
    const screen = resolve(name);
    if (!screen) { location.replace('#/today'); return; }
    if (current && typeof current.unmount === 'function') current.unmount();
    const root = document.createElement('div');
    root.className = 'screen screen--' + name;
    main.replaceChildren(root);
    current = screen;
    document.title = screen.title ? screen.title + ' · ' + APP_TITLE : APP_TITLE;
    if (window.Translate) window.Translate.setContext({ exam: isExam(name, params) });
    screen.mount(root, params);
    markNav(name);
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  // ── Theme ──

  function applyTheme(theme) {
    const t = THEMES.includes(theme) ? theme : 'auto';
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.querySelector('[data-field="theme"]').textContent = THEME_LABEL[t];
    btn.setAttribute('aria-label', '테마 바꾸기, 지금: ' + THEME_LABEL[t]);
  }

  function cycleTheme() {
    const now = window.Store.get().settings.theme;
    const next = THEMES[(THEMES.indexOf(now) + 1) % THEMES.length];
    window.Store.setSetting('theme', next);
    applyTheme(next);
  }

  // ── Keys: screens get first refusal; text fields keep their keys ──

  function onKeyDown(e) {
    // A held-down key (e.repeat) must not answer, grade or advance twice.
    if (e.defaultPrevented || e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (Util.isTypingTarget(e.target)) return;
    if (window.Translate && window.Translate.onKey(e)) { e.preventDefault(); return; }
    if (current && typeof current.onKey === 'function' && current.onKey(e)) e.preventDefault();
  }

  function showLoadError() {
    const tpl = document.getElementById('tpl-load-error');
    main.replaceChildren(tpl.content.cloneNode(true));
  }

  function boot() {
    main = document.getElementById('screen');
    const data = Util.data();
    if (!data || !data.lessons || !Array.isArray(data.sections)) { showLoadError(); return; }
    window.Store.load();
    const note = document.getElementById('storage-note');
    if (note) note.hidden = window.Store.isPersistent();
    applyTheme(window.Store.get().settings.theme);
    document.getElementById('theme-toggle').addEventListener('click', cycleTheme);
    window.Gloss.init(document.getElementById('gloss-tooltip'));
    window.Translate.init();
    window.addEventListener('hashchange', route);
    document.addEventListener('keydown', onKeyDown);
    route();
  }

  const App = { parse, route, isExam };
  window.App = App;
  if (typeof module !== 'undefined') module.exports = App;

  if (typeof document === 'undefined') return;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
