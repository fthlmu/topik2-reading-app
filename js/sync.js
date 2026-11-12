// sync.js: device sync (computer <-> iPad), window.Sync. No account: the devices share a random
// 12-character code (Crockford base32, shown as XXXX-XXXX-XXXX). The server (sync-worker/) keeps one
// document + version per code; js/sync-merge.js decides what the merged record is.
//   syncNow()  GET -> merge into this device (store + deck, in one synchronous step after the reply)
//              -> if the merged document differs from the server's, PUT it with the version just read.
//              A 409 (another device wrote first) merges the returned document and tries again (max 3).
//              Every request times out after 10 s. A failure is stored in the meta (lastError) and retried
//              after 30 s, doubling up to 5 min (a 429 too); a 413 (record too large) is not retried
//              until the next local change. Nothing here ever throws into the app.
//   Triggers   start(): once on boot, on focus / when the tab becomes visible (at most every 20 s), 3 s
//              after a local change to the synced parts (skipped when nothing changed since the last
//              sync), and at once when the page is hidden. Only the active tab (Store.isActiveTab()) syncs.
//   create()   a new code: PUT version 0 with this device's record (its resetAt dropped: see join).
//   join(code) GET first; version 0 = nobody made that code: an error, and no space is created.
//              Otherwise merge and push. That first merge is a pure union with resetAt null: a reset
//              only travels between devices that are already paired (js/sync-merge.js, "Pairing").
//   leave()    forget the code on this device; the local record stays.
// Meta in localStorage "topik2.sync": { code, version (last server version seen), lastSyncAt, lastError,
// resetAt (the server's reset time at the last sync: see withoutSentReset) }.
// SYNC_URL empty (js/sync-config.js) = not set up yet: status 'unset' and no network calls at all.
(function () {
  'use strict';

  const META_KEY = 'topik2.sync';
  const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const CODE_LEN = 12;
  const CODE_RE = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{12}$/;
  const PAIR_BASE = 'https://fthlmu.github.io/topik2-reading-app/';
  const TIMEOUT_MS = 10 * 1000;
  const DEBOUNCE_MS = 3 * 1000;
  const FOCUS_THROTTLE_MS = 20 * 1000;
  const BACKOFF_MIN_MS = 30 * 1000;
  const BACKOFF_MAX_MS = 5 * 60 * 1000;
  const MAX_CONFLICT_RETRIES = 3;
  const CREATE_TRIES = 3;
  // create() and join(): the first merge of two devices is a pure union (no reset cut-off).
  const PAIRING = Object.freeze({ union: true });

  // ── Codes (pure) ──

  // Typed input: spaces and dashes go, letters are uppercased, O reads as 0, I and L as 1.
  function normalizeCode(input) {
    if (typeof input !== 'string') return null;
    const s = input.replace(/[\s-]+/g, '').toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1');
    return CODE_RE.test(s) ? s : null;
  }

  function formatCode(code) {
    return CODE_RE.test(code) ? code.slice(0, 4) + '-' + code.slice(4, 8) + '-' + code.slice(8) : '';
  }

  function pairingLink(code) {
    return PAIR_BASE + '?sync=' + code;
  }

  // 32 letters: a random byte's low 5 bits pick one evenly.
  function newCode(randomBytes) {
    return Array.from(randomBytes(CODE_LEN), b => ALPHABET[b & 31]).join('');
  }

  function memoryStorage() {
    const m = new Map();
    return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
  }

  const isVersion = v => Number.isInteger(v) && v >= 0;
  const isoOf = ms => new Date(ms).toISOString();
  const safeCall = (fn, arg) => {
    try { fn(arg); } catch (err) { /* a listener never breaks sync: its error stays with it */ }
  };

  // deps: { url, fetch, Store, SRS, Merge, storage, win, doc, randomBytes, now, setTimeout, clearTimeout }
  function createSync(deps) {
    const net = typeof deps.fetch === 'function' ? deps.fetch : null;
    const url = net ? String(deps.url || '').trim().replace(/\/+$/, '') : '';
    const { Store, SRS, Merge } = deps;
    const storage = deps.storage || memoryStorage();
    const now = deps.now || (() => Date.now());
    const later = deps.setTimeout || ((fn, ms) => setTimeout(fn, ms));
    const cancel = deps.clearTimeout || (id => clearTimeout(id));

    let chain = Promise.resolve();
    let queued = null;        // a sync waiting in the chain, not started yet
    let busy = false;
    let lastStart = -Infinity; // when the last sync started (the focus throttle)
    let syncedCanon = null;   // canonical document this page last knew to equal the server's
    let failures = 0;
    let retryTimer = null;
    let debounceTimer = null;
    let pendingPair = null;
    let started = false;
    const statusFns = new Set();
    const appliedFns = new Set();

    // ── Meta ──
    // resetAt: the reset time the server held after this device's last successful sync (older
    // metas without it read as null).

    function readMeta() {
      let m = null;
      try { m = JSON.parse(storage.getItem(META_KEY)); } catch (err) { return null; }
      if (!m || typeof m !== 'object' || !CODE_RE.test(m.code)) return null;
      return {
        code: m.code,
        version: isVersion(m.version) ? m.version : 0,
        lastSyncAt: typeof m.lastSyncAt === 'string' ? m.lastSyncAt : null,
        lastError: typeof m.lastError === 'string' ? m.lastError : null,
        resetAt: typeof m.resetAt === 'string' ? m.resetAt : null
      };
    }

    // A reset this device already sent belongs to the server from then on: when a join cleared it
    // there (pairing is a union), it must not come back from this device and delete the joiner's
    // history. Only a reset newer than what the server last held still travels.
    function withoutSentReset(local) {
      const m = readMeta();
      return m && local.resetAt !== null && local.resetAt === m.resetAt ? { ...local, resetAt: null } : local;
    }

    // Storage blocked: the app already says nothing is saved; sync then lasts for this page only.
    function writeMeta(m) {
      try { storage.setItem(META_KEY, JSON.stringify(m)); } catch (err) { /* see above */ }
    }

    const isOn = () => !!url && !!readMeta();
    const isCurrent = code => { const m = readMeta(); return !!m && m.code === code; };

    function status() {
      const m = url ? readMeta() : null;
      const state = !url ? 'unset' : !m ? 'off' : m.lastError === 'too-large' ? 'too-large' : m.lastError ? 'offline' : 'on';
      return { state, code: m ? m.code : null, lastSyncAt: m ? m.lastSyncAt : null, lastError: m ? m.lastError : null, busy };
    }

    function notify() {
      const st = status();
      [...statusFns].forEach(fn => safeCall(fn, st));
    }

    function subscribe(set, fn) {
      set.add(fn);
      return () => { set.delete(fn); };
    }

    // ── Network ──

    // One request; never rejects: { status, data, error } (error: 'timeout' | 'network' | null).
    function call(method, code, payload) {
      const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
      let timer = null;
      const timeout = new Promise(resolve => {
        timer = later(() => {
          if (ctrl) ctrl.abort();
          resolve({ status: 0, data: null, error: 'timeout' });
        }, TIMEOUT_MS);
      });
      const init = { method, cache: 'no-store', signal: ctrl ? ctrl.signal : undefined };
      if (payload !== undefined) {
        init.headers = { 'Content-Type': 'application/json' };
        init.body = JSON.stringify(payload);
      }
      const work = (async () => {
        try {
          const res = await net(url + '/v1/space/' + code, init);
          let data = null;
          try { data = await res.json(); } catch (err) { data = null; }
          return { status: res.status, data, error: null };
        } catch (err) {
          return { status: 0, data: null, error: 'network' };
        }
      })();
      return Promise.race([work, timeout]).then(r => { cancel(timer); return r; });
    }

    const spaceOf = d => (d && isVersion(d.version) ? { version: d.version, doc: d.doc && typeof d.doc === 'object' ? d.doc : null } : null);
    const errorOf = r => r.error || (r.status === 413 ? 'too-large' : r.status === 429 ? 'rate' : 'server');

    // ── One sync ──

    function stopRetry() { if (retryTimer !== null) { cancel(retryTimer); retryTimer = null; } }
    function stopDebounce() { if (debounceTimer !== null) { cancel(debounceTimer); debounceTimer = null; } }

    // Merge the server's document into this device, synchronously: read, merge, write store + deck.
    // opts = PAIRING for create() and join(): a pure union (js/sync-merge.js, "Pairing").
    function mergeIn(remoteDoc, opts) {
      const local = Merge.docOf(Store.get(), SRS.exportSync());
      const merged = Merge.merge(withoutSentReset(local), remoteDoc, now(), opts);
      const storeChanged = Merge.storePart(merged) !== Merge.storePart(local);
      const deckChanged = Merge.deckPart(merged) !== Merge.deckPart(local);
      if (storeChanged) Store.applySynced(s => Merge.applyToState(s, merged));
      if (deckChanged) SRS.importSync(Merge.deckOf(merged));
      if (storeChanged || deckChanged) [...appliedFns].forEach(fn => safeCall(fn));
      return { merged, changed: storeChanged || deckChanged };
    }

    function succeed(code, version, merged, changed) {
      if (!isCurrent(code)) return { ok: false, error: 'left' };
      writeMeta({ code, version, lastSyncAt: isoOf(now()), lastError: null, resetAt: merged.resetAt });
      syncedCanon = Merge.canonical(Merge.normalizeDoc(merged));
      failures = 0;
      stopRetry();
      return { ok: true, changed };
    }

    // A record too large for the server (413) is not retried on a timer: retrying cannot help. The
    // next local change (or a focus) tries again.
    function fail(code, error) {
      if (!isCurrent(code)) return { ok: false, error };
      writeMeta({ ...readMeta(), lastError: error });
      failures += 1;
      stopRetry();
      if (error === 'too-large') return { ok: false, error };
      retryTimer = later(() => { retryTimer = null; syncNow(); },
        Math.min(BACKOFF_MIN_MS * Math.pow(2, failures - 1), BACKOFF_MAX_MS));
      return { ok: false, error };
    }

    // Merge, then push while the server holds something else; a 409 brings the newer document.
    // opts = PAIRING during join(): its 409 retries are still the first merge, so they stay a union.
    async function settle(code, first, opts) {
      let space = first;
      let changed = false;
      for (let retry = 0; retry <= MAX_CONFLICT_RETRIES; retry += 1) {
        if (!isCurrent(code)) return { ok: false, error: 'left' };
        const step = mergeIn(space.doc, opts);
        changed = changed || step.changed;
        if (Merge.sameDoc(step.merged, space.doc)) return succeed(code, space.version, step.merged, changed);
        const put = await call('PUT', code, { baseVersion: space.version, doc: step.merged });
        if (put.status === 200 && put.data && isVersion(put.data.version)) {
          return succeed(code, put.data.version, step.merged, changed);
        }
        const newer = put.status === 409 ? spaceOf(put.data) : null;
        if (!newer) return fail(code, errorOf(put));
        space = newer;
      }
      return fail(code, 'conflict');
    }

    async function run() {
      const meta = readMeta();
      if (!url || !meta) return { ok: false, error: 'off' };
      if (!Store.isActiveTab()) return { ok: false, error: 'inactive' };
      lastStart = now();
      const got = await call('GET', meta.code);
      const space = got.status === 200 ? spaceOf(got.data) : null;
      if (!space) return fail(meta.code, errorOf(got));
      return settle(meta.code, space);
    }

    // One operation at a time; each resolves (never rejects) and updates the status on both ends.
    function exclusive(task) {
      const p = chain.then(async () => {
        busy = true;
        notify();
        try {
          return await task();
        } catch (err) {
          const m = readMeta();
          return m ? fail(m.code, 'internal') : { ok: false, error: 'internal' };
        } finally {
          busy = false;
          notify();
        }
      });
      chain = p;
      return p;
    }

    function syncNow() {
      if (queued) return queued;
      const p = exclusive(() => { queued = null; return run(); });
      queued = p;
      return p;
    }

    function create() {
      if (!url) return Promise.resolve({ ok: false, error: 'unset' });
      return exclusive(async () => {
        for (let i = 0; i < CREATE_TRIES; i += 1) {
          const code = newCode(deps.randomBytes);
          // Pairing starts here: this device's own reset time is dropped (here and on the server), so a
          // later join can never use it to delete the other device's history.
          const doc = mergeIn(null, PAIRING).merged;
          const put = await call('PUT', code, { baseVersion: 0, doc });
          if (put.status === 200 && put.data && isVersion(put.data.version)) {
            writeMeta({ code, version: put.data.version, lastSyncAt: isoOf(now()), lastError: null, resetAt: null });
            syncedCanon = Merge.canonical(doc);
            failures = 0;
            stopRetry();
            return { ok: true, code };
          }
          if (put.status !== 409) return { ok: false, error: errorOf(put) };
        }
        return { ok: false, error: 'conflict' };
      });
    }

    function join(input) {
      if (!url) return Promise.resolve({ ok: false, error: 'unset' });
      const code = normalizeCode(input);
      if (!code) return Promise.resolve({ ok: false, error: 'invalid' });
      return exclusive(async () => {
        const got = await call('GET', code);
        const space = got.status === 200 ? spaceOf(got.data) : null;
        if (!space) return { ok: false, error: errorOf(got) };
        if (space.version === 0) return { ok: false, error: 'not-found' };
        writeMeta({ code, version: space.version, lastSyncAt: null, lastError: null, resetAt: null });
        syncedCanon = null;
        failures = 0;
        stopRetry();
        const res = await settle(code, space, PAIRING);
        return { ok: true, code, synced: res.ok, error: res.ok ? null : res.error };
      });
    }

    function leave() {
      try { storage.removeItem(META_KEY); } catch (err) { /* storage blocked: nothing was kept */ }
      syncedCanon = null;
      failures = 0;
      stopRetry();
      stopDebounce();
      notify();
    }

    // ── Triggers ──

    // After the quiet period: push only when the synced parts differ from what the server has.
    // While a retry is pending (offline), that retry carries the change.
    function pushIfChanged() {
      debounceTimer = null;
      if (!isOn() || retryTimer !== null || !Store.isActiveTab()) return;
      if (Merge.canonical(Merge.docOf(Store.get(), SRS.exportSync())) === syncedCanon) return;
      syncNow();
    }

    function onLocalChange(state, meta) {
      if ((meta && meta.synced) || !isOn()) return;
      stopDebounce();
      debounceTimer = later(pushIfChanged, DEBOUNCE_MS);
    }

    function onShow() {
      if (isOn() && now() - lastStart >= FOCUS_THROTTLE_MS) syncNow();
    }

    function flush() {
      if (!isOn()) return;
      stopDebounce();
      if (Store.isActiveTab() && Merge.canonical(Merge.docOf(Store.get(), SRS.exportSync())) !== syncedCanon) syncNow();
    }

    function start() {
      if (started) return;
      started = true;
      Store.onChange(onLocalChange);
      SRS.onChange(() => onLocalChange(null, null));
      const win = deps.win;
      const doc = deps.doc;
      if (win) {
        win.addEventListener('focus', onShow);
        win.addEventListener('pagehide', flush);
      }
      if (doc) doc.addEventListener('visibilitychange', () => (doc.hidden ? flush() : onShow()));
      if (isOn()) syncNow();
    }

    return {
      META_KEY, isConfigured: () => !!url, isOn, status, syncNow, create, join, leave, start,
      idle: () => chain,
      onStatus: fn => subscribe(statusFns, fn),
      onApplied: fn => subscribe(appliedFns, fn),
      setPendingPair: code => { pendingPair = normalizeCode(code); },
      takePendingPair: () => { const c = pendingPair; pendingPair = null; return c; },
      normalizeCode, formatCode, pairingLink
    };
  }

  const SyncApi = { create: createSync, normalizeCode, formatCode, pairingLink, newCode, META_KEY, ALPHABET };

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    let ls = null;
    try { ls = window.localStorage; } catch (err) { ls = null; }
    window.Sync = createSync({
      url: (window.SyncConfig || {}).SYNC_URL,
      fetch: typeof window.fetch === 'function' ? window.fetch.bind(window) : null,
      Store: window.Store, SRS: window.SRS, Merge: window.SyncMerge,
      storage: ls, win: window, doc: document,
      randomBytes: n => window.crypto.getRandomValues(new Uint8Array(n))
    });
  }
  if (typeof module !== 'undefined') module.exports = SyncApi;
})();
