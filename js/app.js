// app.js: boot, hash router, screen registry, theme toggle, global keys.
// The English layer (js/translate.js) gets each route first: Sprint and Mock runs are
// exam screens, and its keys (G, T, Escape over an open line) come before the screen's.
// Routes: #/today (default) · #/map · #/study/<n> · #/sprint[/retry] ·
// #/review/<id> (sprint or mock) · #/deck[/then-sprint] · #/mock[/run] · #/guide (사용법).
// The 한 / EN switch (js/ui-lang.js) starts before the English layer, so a screen's UI text
// turns English before its Korean words are wrapped for the gloss layer.
// A screen is { title, mount(root, params), unmount?(), onKey?(e) → handled },
// defined as window.<Name>Screen by a script loaded before this file.
// A failing boot or screen mount shows a short message with a 새로고침 (Reload) button instead of a
// blank page (a new index.html mixed with old cached scripts did that on the iPad). Device sync
// (js/sync.js) is optional: without window.Sync the app boots as before. A pairing link (?sync=CODE)
// is taken off the address and handed to Sync, and Today asks before it connects.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || {};
  const APP_TITLE = 'TOPIK II 읽기 · 102회';
  const REFRESH_ROUTES = ['today', 'map'];
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

  // Something failed while starting or drawing a screen: a short message and a reload button. The
  // language comes from the pre-paint script (UiLang may be the part that failed).
  function showFatal(err) {
    const host = main || document.getElementById('screen') || document.body;
    const en = document.documentElement.getAttribute('data-ui-lang') === 'en';
    const box = document.createElement('section');
    box.className = 'sheet placeholder app-error';
    box.setAttribute('role', 'alert');
    box.innerHTML = '<h1 class="screen-title">' + (en ? 'The app could not open this screen.' : '화면을 열지 못했습니다') +
      '</h1><p class="placeholder__note">' + (en ? 'Reloading the page usually fixes it.' : '새로고침하면 대부분 해결됩니다.') +
      '</p><p><button type="button" class="btn btn--primary" data-act="app-reload">' + (en ? 'Reload' : '새로고침') +
      '</button></p><p class="app-error__detail"><code></code></p>';
    box.querySelector('code').textContent = String(err && err.message ? err.message : err);
    box.querySelector('[data-act="app-reload"]').addEventListener('click', () => location.reload());
    host.replaceChildren(box);
    document.documentElement.classList.remove('ui-lang-pending');
  }

  function route() {
    show(false);
  }

  // quiet: a redraw after a sync, so the scroll position and the focus stay where they are.
  function show(quiet) {
    // In-page anchors (e.g. the skip link "#screen") are not routes.
    const isRoute = !location.hash || location.hash.indexOf('#/') === 0;
    if (!isRoute && current) return;
    const { name, params } = parse(isRoute ? location.hash : '');
    const screen = resolve(name);
    if (!screen) { location.replace('#/today'); return; }
    const y = window.scrollY;
    try {
      if (current && typeof current.unmount === 'function') current.unmount();
      const root = document.createElement('div');
      root.className = 'screen screen--' + name;
      main.replaceChildren(root);
      current = screen;
      document.title = screen.title ? screen.title + ' · ' + APP_TITLE : APP_TITLE;
      if (window.Translate) window.Translate.setContext({ exam: isExam(name, params) });
      screen.mount(root, params);
    } catch (err) {
      current = null;
      showFatal(err);
      return;
    }
    if (window.UiLang) window.UiLang.syncTitle();
    markNav(name);
    if (quiet) { window.scrollTo(0, y); return; }
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  // Device sync changed this device's record: redraw Today or the Map in place. Never another screen
  // (a sprint or mock run is never re-mounted), and never under an open dialog.
  function refresh() {
    if (!main || !REFRESH_ROUTES.includes(parse(location.hash).name)) return;
    if (main.querySelector('dialog[open]')) return;
    show(true);
  }

  // ?sync=CODE (a pairing link): off the address at once, then Today asks.
  function takePairParam(sync) {
    let params = null;
    try { params = new URLSearchParams(location.search); } catch (err) { return; }
    if (!params.has('sync')) return;
    sync.setPendingPair(params.get('sync'));
    params.delete('sync');
    const rest = params.toString();
    history.replaceState(history.state, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
  }

  function startSync() {
    const sync = window.Sync;
    if (!sync || typeof sync.start !== 'function') return;
    takePairParam(sync);
    sync.onApplied(refresh);
    sync.start();
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
    // Sync is optional: if it cannot start, studying on this device still works, so boot goes on.
    try { startSync(); } catch (err) { /* see above */ }
    route();
  }

  function safeBoot() {
    try { boot(); } catch (err) { showFatal(err); }
  }

  const App = { parse, route, refresh, isExam };
  window.App = App;
  if (typeof module !== 'undefined') module.exports = App;

  if (typeof document === 'undefined') return;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', safeBoot);
  else safeBoot();
})();
