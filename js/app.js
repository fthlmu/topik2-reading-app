// app.js: boot, hash router, screen registry, theme toggle, global keys.
// The English layer (js/translate.js) gets each route first: Sprint and Mock runs are
// exam screens, and its keys (G, T, Escape over an open line) come before the screen's.
// Routes: #/today (default) · #/map · #/study/<n> · #/sprint[/retry] ·
// #/review/<id> (sprint or mock) · #/deck[/then-sprint] · #/mock[/run] · #/guide (사용법).
// The 한 / EN switch (js/ui-lang.js) starts before the English layer, so a screen's UI text
// turns English before its Korean words are wrapped for the gloss layer.
// A screen is { title, mount(root, params), unmount?(), onKey?(e) → handled },
// defined as window.<Name>Screen by a script loaded before this file.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || {};
  const APP_TITLE = 'TOPIK II 읽기 · 102회';
  const NAV_FOR = {
    today: 'today', sprint: 'today', review: 'today', map: 'map', study: 'map', deck: 'deck', mock: 'mock',
    guide: 'guide'
  };
  const SCREENS = {
    today: 'TodayScreen', map: 'MapScreen', study: 'StudyScreen', sprint: 'SprintScreen',
    review: 'ReviewScreen', deck: 'DeckScreen', mock: 'MockScreen', guide: 'GuideScreen'
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
    if (window.UiLang) window.UiLang.syncTitle();
    markNav(name);
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  // The sticky test bar sits right under the header, whose height changes with its rows.
  function trackHeader() {
    const bar = document.querySelector('header.topbar');
    if (!bar) return;
    const set = () => document.documentElement.style.setProperty('--header-h', bar.offsetHeight + 'px');
    set();
    if (typeof ResizeObserver === 'function') new ResizeObserver(set).observe(bar);
    else window.addEventListener('resize', set);
  }

  // The app is light only, like the reference mock test (DESIGN.md section 4, option A).
  // An old saved settings.theme value is kept in storage but no longer read.

  // ── Keys: screens get first refusal; text fields keep their keys ──

  function onKeyDown(e) {
    // A held-down key (e.repeat) must not answer, grade or advance twice.
    if (e.defaultPrevented || e.isComposing || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (Util.isTypingTarget(e.target)) return;
    if (window.Translate && window.Translate.onKey(e)) { e.preventDefault(); return; }
    if (current && typeof current.onKey === 'function' && current.onKey(e)) e.preventDefault();
  }

  function claimIfVisible() {
    if (!document.hidden && window.Store) window.Store.claimTab();
  }

  // Without lesson data the store never loads: the language comes from the pre-paint script.
  function showLoadError() {
    const tpl = document.getElementById('tpl-load-error');
    main.replaceChildren(tpl.content.cloneNode(true));
    if (window.UiLang) window.UiLang.init(document.documentElement.getAttribute('data-ui-lang'));
    document.documentElement.classList.remove('ui-lang-pending');
  }

  function boot() {
    main = document.getElementById('screen');
    trackHeader();
    const data = Util.data();
    if (!data || !data.lessons || !Array.isArray(data.sections)) { showLoadError(); return; }
    window.Store.load();
    // The writer role (Store: only the active tab writes the open run): this page claims it when it
    // loads in the foreground and again whenever it gets focus or becomes visible. The run screens
    // then re-read the stored run and show it if another tab moved on.
    claimIfVisible();
    window.addEventListener('focus', claimIfVisible);
    document.addEventListener('visibilitychange', claimIfVisible);
    const note = document.getElementById('storage-note');
    if (note) note.hidden = window.Store.isPersistent();
    window.Gloss.init(document.getElementById('gloss-tooltip'));
    window.UiLang.init(window.UiLang.langOf(window.Store.get().settings));
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
