// sync-client.test.js: js/sync.js against the real worker (sync-worker/src/index.js) behind a fake
// fetch, with a fake clock. Each "device" has its own storage, Store and SRS module.
//   - codes: normalizing typed input, formatting, random codes, the pairing link
//   - SYNC_URL empty: status 'unset' and not a single network call
//   - create, join (merge, nothing lost), sync both ways, a reset reaching the other device
//   - a 409 (another device wrote first) merged and retried; a request timing out
//   - offline: stored as lastError without throwing, retried with backoff, then recovered
//   - the 3 s debounce after a local change, skipped when the synced parts did not change
//   - join with a code nobody made: an error, and no space is created; only the active tab syncs
const assert = require('assert');
const crypto = require('crypto');

global.window = global.window || {};
const SyncApi = require('../js/sync.js');
const Merge = require('../js/sync-merge.js');
const W = require('../sync-worker/src/index.js');

const STORE_PATH = require.resolve('../js/store.js');
const SRS_PATH = require.resolve('../js/srs.js');
const URL_BASE = 'https://sync.test';
const T0 = Date.parse('2026-11-12T03:00:00.000Z');

const saved = {
  store: require.cache[STORE_PATH], srs: require.cache[SRS_PATH],
  wStore: global.window.Store, wSRS: global.window.SRS, wLs: global.window.localStorage, gLs: global.localStorage
};

function makeStorage() {
  const m = new Map();
  return { getItem: k => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: k => m.delete(k) };
}

function freshModule(p) {
  delete require.cache[p];
  return require(p);
}

// Store reads window.localStorage on every call: point it at the device about to act.
function use(dev) {
  global.window.localStorage = dev.ls;
  global.localStorage = dev.ls;
  return dev;
}

function device() {
  const dev = use({ ls: makeStorage() });
  dev.Store = freshModule(STORE_PATH);
  dev.Store.resetCache();
  dev.Store.load();
  dev.SRS = freshModule(SRS_PATH);
  dev.SRS._useStorage(dev.ls);
  return dev;
}

const settle = async () => { for (let i = 0; i < 30; i += 1) await new Promise(r => setImmediate(r)); };

function fakeClock(start) {
  let t = start;
  let id = 0;
  const timers = new Map();
  return {
    now: () => t,
    setTimeout: (fn, ms) => { id += 1; timers.set(id, { at: t + ms, fn }); return id; },
    clearTimeout: i => { timers.delete(i); },
    delays: () => [...timers.values()].map(x => x.at - t).sort((a, b) => a - b),
    async advance(ms) {
      await settle(); // let work already started register its timers first
      const end = t + ms;
      for (;;) {
        const next = [...timers.entries()].filter(([, x]) => x.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        timers.delete(next[0]);
        t = Math.max(t, next[1].at);
        next[1].fn();
        await settle();
      }
      t = end;
      await settle();
    }
  };
}

function mapStorage() {
  const m = new Map();
  return {
    async get(keys) { const out = new Map(); keys.forEach(k => { if (m.has(k)) out.set(k, m.get(k)); }); return out; },
    async put(obj) { Object.keys(obj).forEach(k => m.set(k, obj[k])); }
  };
}

// The real worker behind a fake fetch: records every call, can go offline, can run a hook before a PUT.
function fakeServer() {
  const objects = new Map();
  const env = {
    SPACE: {
      idFromName: name => ({ name }),
      get(id) {
        if (!objects.has(id.name)) objects.set(id.name, new W.SyncSpace({ storage: mapStorage() }, {}));
        const obj = objects.get(id.name);
        return { fetch: (input, init) => obj.fetch(new Request(input, init)) };
      }
    }
  };
  const srv = { calls: [], offline: false, beforePut: null, hang: false };
  const send = (method, url, body) => {
    const headers = new Headers({ Origin: 'http://localhost:8765' });
    if (body !== undefined) headers.set('Content-Type', 'application/json');
    return W.default.fetch(new Request(url, { method, headers, body }), env);
  };
  srv.fetch = async (url, init) => {
    srv.calls.push(init.method + ' ' + url.replace(URL_BASE, ''));
    if (srv.hang) {
      return new Promise((resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(new Error('aborted')));
      });
    }
    if (srv.offline) throw new TypeError('Failed to fetch');
    if (init.method === 'PUT' && srv.beforePut) { const hook = srv.beforePut; srv.beforePut = null; await hook(); }
    return send(init.method, url, init.body);
  };
  srv.get = async code => (await send('GET', URL_BASE + '/v1/space/' + code)).json();
  srv.put = async (code, baseVersion, doc) => (await send('PUT', URL_BASE + '/v1/space/' + code, JSON.stringify({ baseVersion, doc }))).json();
  return srv;
}

function eventTarget() {
  const handlers = {};
  return {
    hidden: false,
    addEventListener: (type, fn) => { handlers[type] = (handlers[type] || []).concat(fn); },
    fire: type => (handlers[type] || []).forEach(fn => fn())
  };
}

function syncFor(dev, srv, clock, url) {
  dev.win = eventTarget();
  dev.doc = eventTarget();
  dev.sync = SyncApi.create({
    url: url === undefined ? URL_BASE : url, fetch: srv.fetch, Store: dev.Store, SRS: dev.SRS, Merge,
    storage: dev.ls, win: dev.win, doc: dev.doc, now: clock.now,
    setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout,
    randomBytes: n => new Uint8Array(crypto.randomBytes(n))
  });
  return dev.sync;
}

const attempt = (q, extra) => ({ q, mode: 'sprint', chosen: 1, correct: true, sure: true, ms: 1000, sessionId: 's' + q, ...extra });
const qsOf = dev => dev.Store.get().attempts.map(a => a.q).sort((a, b) => a - b);
const metaOf = dev => JSON.parse(dev.ls.getItem(SyncApi.META_KEY));

// A promise that never settles would let node exit quietly: a real timer turns that into a FAIL.
function withWatchdog(run, ms) {
  let timer = null;
  const watchdog = new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error('sync-client: no result after ' + ms + ' ms')), ms);
  });
  return Promise.race([run(), watchdog]).finally(() => clearTimeout(timer));
}

module.exports = withWatchdog(async () => {
  try {
    // 1. Codes.
    {
      const N = SyncApi.normalizeCode;
      assert.strictEqual(N(' abcd-efgh-jkmn '), 'ABCDEFGHJKMN');
      assert.strictEqual(N('abcd efgh jkmn'), 'ABCDEFGHJKMN');
      assert.strictEqual(N('OOOO-IIII-LLLL'), '000011111111', 'O reads as 0, I and L as 1');
      ['ABCD-EFGH-JKMU', 'ABCD-EFGH-JKM', 'ABCD-EFGH-JKMNP', 'ABCD_EFGH_JKMN', ''].forEach(s => assert.strictEqual(N(s), null, s));
      [null, undefined, 123456789012, {}].forEach(v => assert.strictEqual(N(v), null));
      assert.strictEqual(SyncApi.formatCode('ABCDEFGHJKMN'), 'ABCD-EFGH-JKMN');
      assert.strictEqual(SyncApi.pairingLink('ABCDEFGHJKMN'), 'https://fthlmu.github.io/topik2-reading-app/?sync=ABCDEFGHJKMN');
      for (let i = 0; i < 200; i += 1) {
        const c = SyncApi.newCode(n => new Uint8Array(crypto.randomBytes(n)));
        assert.ok(/^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{12}$/.test(c), c);
      }
      assert.strictEqual(SyncApi.newCode(n => new Uint8Array(n).fill(255)), 'ZZZZZZZZZZZZ');
    }

    // 2. SYNC_URL empty: 'unset' and no network call at all, whatever happens.
    {
      const srv = fakeServer();
      const clock = fakeClock(T0);
      const dev = device();
      const sync = syncFor(dev, srv, clock, '');
      sync.start();
      assert.strictEqual(sync.status().state, 'unset');
      assert.strictEqual(sync.isConfigured(), false);
      assert.deepStrictEqual(await sync.syncNow(), { ok: false, error: 'off' });
      assert.deepStrictEqual(await sync.create(), { ok: false, error: 'unset' });
      assert.deepStrictEqual(await sync.join('ABCD-EFGH-JKMN'), { ok: false, error: 'unset' });
      dev.Store.recordAttempt(attempt(16));
      dev.win.fire('focus');
      dev.doc.hidden = true;
      dev.doc.fire('visibilitychange');
      await clock.advance(10 * 60 * 1000);
      assert.deepStrictEqual(srv.calls, []);
      assert.strictEqual(dev.ls.getItem(SyncApi.META_KEY), null);
    }

    // 3. Two devices: create, join (a union), sync back, then a reset reaching the other device.
    {
      const srv = fakeServer();
      const clock = fakeClock(T0);
      const A = device();
      A.Store.recordAttempt(attempt(16));
      A.SRS.seedMany(['Q16:v:0']);
      A.Store.setSetting('uiLang', 'en');
      const syncA = syncFor(A, srv, clock);
      assert.strictEqual(syncA.status().state, 'off');
      const made = await syncA.create();
      assert.ok(made.ok && /^[0-9A-Z]{12}$/.test(made.code));
      assert.deepStrictEqual(srv.calls, ['PUT /v1/space/' + made.code]);
      assert.deepStrictEqual(Object.keys(metaOf(A)).sort(), ['code', 'lastError', 'lastSyncAt', 'resetAt', 'version']);
      assert.strictEqual(metaOf(A).version, 1);
      assert.strictEqual(syncA.status().state, 'on');

      const B = device();
      B.Store.recordAttempt(attempt(20));
      B.SRS.seedMany(['Q20:g:0']);
      const syncB = syncFor(B, srv, clock);
      const joined = await syncB.join(SyncApi.formatCode(made.code).toLowerCase());
      assert.deepStrictEqual(joined, { ok: true, code: made.code, synced: true, error: null });
      assert.deepStrictEqual(qsOf(B), [16, 20], 'B now has both records');
      assert.deepStrictEqual(Object.keys(B.SRS.exportSync().deck).sort(), ['Q16:v:0', 'Q20:g:0']);
      assert.strictEqual(B.Store.get().settings.uiLang, 'ko', 'settings stay per device');
      assert.strictEqual((await srv.get(made.code)).version, 2);

      use(A);
      const back = await syncA.syncNow();
      assert.deepStrictEqual(back, { ok: true, changed: true });
      assert.deepStrictEqual(qsOf(A), [16, 20]);
      assert.strictEqual(A.Store.get().settings.uiLang, 'en');
      const again = await syncA.syncNow();
      assert.deepStrictEqual(again, { ok: true, changed: false });
      assert.strictEqual(srv.calls.filter(c => c.startsWith('PUT')).length, 2, 'nothing new: no PUT');

      // 기록 초기화 on A reaches B: B's older records go, B's settings stay.
      clock.advance(1000);
      A.Store.resetProgress();
      A.SRS.reset();
      await syncA.syncNow();
      use(B);
      await syncB.syncNow();
      assert.deepStrictEqual(qsOf(B), []);
      assert.strictEqual(B.SRS.stats().total, 0);
      assert.ok(B.Store.get().resetAt, 'the reset time came along');
      // Leaving forgets the code; the record stays.
      B.Store.recordAttempt(attempt(30));
      syncB.leave();
      assert.strictEqual(syncB.status().state, 'off');
      assert.deepStrictEqual(qsOf(B), [30]);
      assert.deepStrictEqual(await syncB.syncNow(), { ok: false, error: 'off' });
    }

    // 4. 409: another device writes between this device's GET and PUT; merged and retried.
    {
      const srv = fakeServer();
      const clock = fakeClock(T0);
      const A = device();
      const syncA = syncFor(A, srv, clock);
      const { code } = await syncA.create();
      A.Store.recordAttempt(attempt(17));
      srv.calls.length = 0;
      srv.beforePut = async () => {
        const other = Merge.merge(Merge.emptyDoc(), { format: 1, attempts: [{ ...attempt(40), at: new Date(T0).toISOString() }] }, T0);
        assert.deepStrictEqual(await srv.put(code, 1, other), { version: 2 });
      };
      const r = await syncA.syncNow();
      assert.deepStrictEqual(r, { ok: true, changed: true });
      assert.deepStrictEqual(srv.calls, ['GET /v1/space/' + code, 'PUT /v1/space/' + code, 'PUT /v1/space/' + code]);
      const server = await srv.get(code);
      assert.strictEqual(server.version, 3);
      assert.deepStrictEqual(server.doc.attempts.map(a => a.q).sort(), [17, 40], 'both writes kept');
      assert.deepStrictEqual(qsOf(A), [17, 40]);
      assert.strictEqual(metaOf(A).version, 3);
    }

    // 5. Offline: the error is stored, nothing throws, retries back off (30 s, 60 s), then recover.
    {
      const srv = fakeServer();
      const clock = fakeClock(T0);
      const A = device();
      const syncA = syncFor(A, srv, clock);
      await syncA.create();
      srv.offline = true;
      const r = await syncA.syncNow();
      assert.deepStrictEqual(r, { ok: false, error: 'network' });
      assert.strictEqual(metaOf(A).lastError, 'network');
      assert.strictEqual(syncA.status().state, 'offline');
      assert.deepStrictEqual(clock.delays(), [30 * 1000]);
      await clock.advance(30 * 1000);
      assert.deepStrictEqual(clock.delays(), [60 * 1000], 'the next retry waits twice as long');
      for (let i = 0; i < 5; i += 1) await clock.advance(clock.delays()[0]);
      assert.deepStrictEqual(clock.delays(), [5 * 60 * 1000], 'never longer than 5 minutes');
      srv.offline = false;
      A.Store.recordAttempt(attempt(18));
      await clock.advance(5 * 60 * 1000);
      await syncA.idle();
      assert.strictEqual(syncA.status().state, 'on');
      assert.strictEqual(metaOf(A).lastError, null);
      assert.deepStrictEqual(clock.delays(), [], 'no retry left');
      assert.deepStrictEqual((await srv.get(metaOf(A).code)).doc.attempts.map(a => a.q), [18]);

      // A request that hangs gives up after 10 s.
      srv.hang = true;
      const pending = syncA.syncNow();
      await clock.advance(10 * 1000);
      assert.deepStrictEqual(await pending, { ok: false, error: 'timeout' });
      srv.hang = false;
    }

    // 6. Debounce: 3 s after the last local change; skipped when the synced parts did not change.
    {
      const srv = fakeServer();
      const clock = fakeClock(T0);
      const A = device();
      const syncA = syncFor(A, srv, clock);
      await syncA.create();
      syncA.start();
      await syncA.idle();
      srv.calls.length = 0;
      A.Store.recordAttempt(attempt(21));
      await clock.advance(1000);
      A.SRS.seedMany(['Q21:v:0']);
      await clock.advance(1000);
      A.Store.recordAttempt(attempt(22));
      await clock.advance(2900);
      assert.deepStrictEqual(srv.calls, [], 'still inside the quiet period');
      await clock.advance(200);
      await syncA.idle();
      assert.deepStrictEqual(srv.calls.map(c => c.split(' ')[0]), ['GET', 'PUT'], 'one sync for three changes');
      const server = await srv.get(metaOf(A).code);
      assert.deepStrictEqual(server.doc.attempts.map(a => a.q), [21, 22]);
      assert.deepStrictEqual(Object.keys(server.doc.deck), ['Q21:v:0']);

      srv.calls.length = 0;
      A.Store.setSetting('gloss', false);
      await clock.advance(3100);
      await syncA.idle();
      assert.deepStrictEqual(srv.calls, [], 'a settings change is not synced');

      // Focus syncs at most every 20 s; hiding the page pushes a pending change at once.
      A.win.fire('focus');
      await syncA.idle();
      assert.deepStrictEqual(srv.calls, [], 'the last sync started under 20 s ago');
      await clock.advance(20 * 1000);
      A.win.fire('focus');
      await syncA.idle();
      assert.strictEqual(srv.calls.length, 1, 'focus: one GET (nothing to push)');
      await clock.advance(5000);
      A.win.fire('focus');
      await syncA.idle();
      assert.strictEqual(srv.calls.length, 1, 'throttled');
      A.Store.recordAttempt(attempt(23));
      A.doc.hidden = true;
      A.doc.fire('visibilitychange');
      await syncA.idle();
      assert.deepStrictEqual(srv.calls.slice(1).map(c => c.split(' ')[0]), ['GET', 'PUT'], 'flushed on hide');
      assert.deepStrictEqual(clock.delays(), [], 'the debounce was cancelled by the flush');
    }

    // 7. Join with a code nobody made: an error, nothing stored, no space created.
    {
      const srv = fakeServer();
      const clock = fakeClock(T0);
      const B = device();
      const syncB = syncFor(B, srv, clock);
      assert.deepStrictEqual(await syncB.join('ZZZZ-ZZZZ-ZZZZ'), { ok: false, error: 'not-found' });
      assert.deepStrictEqual(srv.calls, ['GET /v1/space/ZZZZZZZZZZZZ']);
      assert.strictEqual(B.ls.getItem(SyncApi.META_KEY), null);
      assert.strictEqual(syncB.status().state, 'off');
      assert.strictEqual((await srv.get('ZZZZZZZZZZZZ')).version, 0, 'the space was not created');
      assert.deepStrictEqual(await syncB.join('not a code'), { ok: false, error: 'invalid' });
      assert.strictEqual(srv.calls.length, 1, 'an invalid code makes no call');
      srv.offline = true;
      assert.deepStrictEqual(await syncB.join('ZZZZ-ZZZZ-ZZZZ'), { ok: false, error: 'network' });
      assert.deepStrictEqual(clock.delays(), [], 'a failed join schedules nothing');
    }

    // 8. Only the active tab syncs; a pairing code waits for Today.
    {
      const srv = fakeServer();
      const clock = fakeClock(T0);
      const A = device();
      const syncA = syncFor(A, srv, clock);
      await syncA.create();
      srv.calls.length = 0;
      A.ls.setItem(A.Store.ACTIVE_KEY, JSON.stringify({ id: 'another-tab', at: T0 }));
      assert.deepStrictEqual(await syncA.syncNow(), { ok: false, error: 'inactive' });
      assert.deepStrictEqual(srv.calls, []);
      syncA.setPendingPair('abcd-efgh-jkmn');
      assert.strictEqual(syncA.takePendingPair(), 'ABCDEFGHJKMN');
      assert.strictEqual(syncA.takePendingPair(), null, 'asked once');
      syncA.setPendingPair('nonsense');
      assert.strictEqual(syncA.takePendingPair(), null);
      // Status listeners hear about busy and done; an unsubscribed one does not.
      A.ls.removeItem(A.Store.ACTIVE_KEY);
      const seen = [];
      const off = syncA.onStatus(st => seen.push(st.busy));
      await syncA.syncNow();
      off();
      await syncA.syncNow();
      assert.deepStrictEqual(seen, [true, false]);
    }

    // 10. Pairing never deletes history: a reset travels only between devices already paired.
    {
      const DAY = 24 * 60 * 60 * 1000;
      const old = (q, days) => attempt(q, { at: new Date(Date.now() - days * DAY).toISOString(), sessionId: 'old' + q });
      const oldSession = (id, days) => ({ id, at: new Date(Date.now() - days * DAY).toISOString(), mode: 'sprint', qs: [16], right: 1, total: 1 });
      const sessionsOf = dev => dev.Store.get().sessions.map(s => s.id).sort();
      const cardsOf = dev => Object.keys(dev.SRS.exportSync().deck).sort();
      const later = () => new Promise(r => setTimeout(r, 5)); // a reset time strictly after what came before

      // (a) The space holds a reset newer than the joiner's history (paired devices A and C reset).
      {
        const srv = fakeServer();
        const clock = fakeClock(T0);
        const B = device();                                    // months of history, never reset
        B.Store.recordAttempt(old(5, 90));
        B.Store.recordSession(oldSession('b-old', 90));
        B.SRS.record('Q5:v:0', false);
        const syncB = syncFor(B, srv, clock);
        const A = device();
        A.Store.recordAttempt(old(6, 60));
        const syncA = syncFor(A, srv, clock);
        const { code } = await syncA.create();
        await later();
        A.Store.resetProgress();                               // a normal reset on the paired device
        A.SRS.reset();
        await later();
        A.Store.recordAttempt(attempt(7));
        await syncA.syncNow();
        assert.ok((await srv.get(code)).doc.resetAt, 'the reset reached the server');

        use(B);
        const joined = await syncB.join(code);
        assert.strictEqual(joined.ok && joined.synced, true);
        assert.deepStrictEqual(qsOf(B), [5, 7], 'the joiner keeps all of its attempts, plus the union');
        assert.deepStrictEqual(sessionsOf(B), ['b-old']);
        assert.deepStrictEqual(cardsOf(B), ['Q5:v:0']);
        assert.strictEqual((await srv.get(code)).doc.resetAt, null, 'the pairing result has no reset time');
        // The device that reset earlier does not bring that reset back on its next sync.
        use(A);
        await syncA.syncNow();
        assert.deepStrictEqual(qsOf(A), [5, 7]);
        assert.strictEqual(A.Store.get().resetAt, null);
        use(B);
        await syncB.syncNow();
        assert.deepStrictEqual(qsOf(B), [5, 7], 'still all there after both devices synced again');
        assert.deepStrictEqual(cardsOf(B), ['Q5:v:0']);

        // (c) After the join, a normal reset on one device still clears the other.
        use(A);
        await later();
        A.Store.resetProgress();
        A.SRS.reset();
        await syncA.syncNow();
        use(B);
        await syncB.syncNow();
        assert.deepStrictEqual(qsOf(B), [], 'a reset after pairing travels');
        assert.deepStrictEqual(sessionsOf(B), []);
        assert.deepStrictEqual(cardsOf(B), []);
        assert.ok(B.Store.get().resetAt);
      }

      // (b) The joiner reset recently; the space holds older history from the other device.
      {
        const srv = fakeServer();
        const clock = fakeClock(T0);
        const A = device();
        A.Store.recordAttempt(old(8, 120));
        A.Store.recordSession(oldSession('a-old', 120));
        A.SRS.record('Q8:v:0', true);
        const syncA = syncFor(A, srv, clock);
        const { code } = await syncA.create();
        const B = device();
        B.Store.recordAttempt(old(9, 200));
        await later();
        B.Store.resetProgress();                               // before pairing: clears B's own data only
        B.SRS.reset();
        await later();
        B.Store.recordAttempt(attempt(10));
        const syncB = syncFor(B, srv, clock);
        await syncB.join(code);
        assert.deepStrictEqual(qsOf(B), [8, 10], "the other device's older history is kept");
        assert.deepStrictEqual(sessionsOf(B), ['a-old']);
        assert.deepStrictEqual(cardsOf(B), ['Q8:v:0']);
        assert.strictEqual(B.Store.get().resetAt, null, "the joiner's own reset stays its own");
        use(A);
        await syncA.syncNow();
        assert.deepStrictEqual(qsOf(A), [8, 10], 'the other device keeps its history too');
        assert.deepStrictEqual(cardsOf(A), ['Q8:v:0']);
      }

      // create() drops this device's own earlier reset, so a later join cannot use it either.
      {
        const srv = fakeServer();
        const clock = fakeClock(T0);
        const A = device();
        A.Store.resetProgress();
        await later();
        A.Store.recordAttempt(attempt(11));
        const syncA = syncFor(A, srv, clock);
        const { code } = await syncA.create();
        assert.strictEqual((await srv.get(code)).doc.resetAt, null);
        assert.strictEqual(A.Store.get().resetAt, null);
        assert.deepStrictEqual(qsOf(A), [11]);
      }
    }

    // 11. A 429 backs off like any error; a 413 shows its own state and waits for the next change.
    {
      const srv = fakeServer();
      const clock = fakeClock(T0);
      const A = device();
      // GETs reach the real worker (a new space: version 0); every PUT is refused with `status`.
      const answer = status => async (url, init) => (init.method === 'PUT'
        ? new Response(JSON.stringify({ error: 'x' }), { status }) : srv.fetch(url, init));
      A.Store.recordAttempt(attempt(12));
      const limited = SyncApi.create({
        url: URL_BASE, fetch: answer(429), Store: A.Store, SRS: A.SRS, Merge, storage: A.ls,
        now: clock.now, setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout
      });
      A.ls.setItem(SyncApi.META_KEY, JSON.stringify({ code: 'ZZZZZZZZZZZZ', version: 0 }));
      assert.deepStrictEqual(await limited.syncNow(), { ok: false, error: 'rate' });
      assert.strictEqual(limited.status().state, 'offline');
      assert.deepStrictEqual(clock.delays(), [30 * 1000], '429: the usual backoff');
      limited.leave();

      const big = SyncApi.create({
        url: URL_BASE, fetch: answer(413), Store: A.Store, SRS: A.SRS, Merge, storage: A.ls,
        now: clock.now, setTimeout: clock.setTimeout, clearTimeout: clock.clearTimeout
      });
      big.start();
      A.ls.setItem(SyncApi.META_KEY, JSON.stringify({ code: 'ZZZZZZZZZZZZ', version: 0 }));
      assert.deepStrictEqual(await big.syncNow(), { ok: false, error: 'too-large' });
      assert.strictEqual(big.status().state, 'too-large');
      assert.deepStrictEqual(clock.delays(), [], '413: no timed retry');
      A.Store.recordAttempt(attempt(13));                      // the next local change tries again
      await clock.advance(3100);
      await big.idle();
      assert.strictEqual(big.status().state, 'too-large', 'tried again, still too large');
      assert.deepStrictEqual(clock.delays(), []);
      big.leave();
    }

    // 9. The Today control and its dialog (markup only): status lines, the steps, the reset line.
    {
      const Dialog = require('../js/screens/sync-dialog.js');
      require('../js/reset-flow.js'); // window.ResetFlow, read by the reset dialog markup
      const Reset = require('../js/screens/reset-dialog.js');
      const now = new Date(2026, 10, 12, 15, 0);
      const S = st => Dialog.statusHtml(st, now);
      assert.strictEqual(S({ state: 'unset' }), '아직 설정되지 않음');
      assert.strictEqual(S({ state: 'off' }), '꺼짐');
      assert.strictEqual(S({ state: 'offline', lastError: 'network' }), '오프라인 · 다시 시도 중');
      assert.strictEqual(S({ state: 'too-large', lastError: 'too-large' }), '기록이 너무 커서 동기화할 수 없습니다');
      assert.strictEqual(S({ state: 'on', busy: true }), '동기화 중');
      assert.strictEqual(S({ state: 'on', lastSyncAt: null }), '켜짐');
      assert.strictEqual(S({ state: 'on', lastSyncAt: new Date(2026, 10, 12, 9, 5).toISOString() }),
        '켜짐 · 마지막 동기화 <span class="num">09:05</span>');
      assert.strictEqual(Dialog.timeLabel(new Date(2026, 10, 10, 21, 30).toISOString(), now), '11/10 21:30');
      const html = Dialog.html({ state: 'off' });
      assert.ok(html.includes('data-act="sync-open">기기 동기화</button>'));
      assert.ok(html.includes('<dialog class="reset-dialog sync-dialog" data-sync-dialog'));
      ['unset', 'off', 'join', 'on', 'pair'].forEach(s => assert.ok(html.includes('data-step="' + s + '"'), 'step ' + s));
      assert.ok(html.includes('컴퓨터와 iPad의 학습 기록과 복습 덱을 맞춥니다. 계정 없이 코드 하나로 연결합니다.'));
      ['새 코드 만들기', '코드 입력', '지금 동기화', '이 기기에서 동기화 끄기', '복사'].forEach(t => assert.ok(html.includes('>' + t + '<'), t));
      assert.ok(html.includes('설정과 끝나지 않은 스프린트·모의고사는 각 기기에 따로 남습니다.'));
      assert.ok(/<label[^>]*for="sync-code"[^>]*>동기화 코드<\/label>/.test(html), 'the code field has a visible label');
      assert.strictEqual((html.match(/data-act="sync-close"/g) || []).length, 4, 'a visible way out of every step but the form');
      assert.ok(Reset.html({ synced: true }).includes('동기화된 다른 기기의 기록도 함께 지워집니다.'));
      assert.ok(!Reset.html().includes('동기화된'), 'without sync, no extra line');
    }
  } finally {
    require.cache[STORE_PATH] = saved.store;
    require.cache[SRS_PATH] = saved.srs;
    global.window.Store = saved.wStore;
    global.window.SRS = saved.wSRS;
    global.window.localStorage = saved.wLs;
    global.localStorage = saved.gLs;
  }
}, 20 * 1000);
