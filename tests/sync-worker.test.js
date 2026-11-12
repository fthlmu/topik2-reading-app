// sync-worker.test.js: the device-sync server (sync-worker/src/index.js, an ES module) with a fake
// Durable Object namespace: one SyncSpace per code over a Map-backed storage.
//   - GET / is a health check; a new space is version 0 with no document
//   - create (PUT baseVersion 0), a stale PUT gets 409 with the current document, then a good one
//   - bad code 400, oversize 413 (stated and actual size), bad body 400, unknown path 404, method 405
//   - CORS: the preflight, allowed origins echoed, any other origin 403, every response no-store
const assert = require('assert');
const W = require('../sync-worker/src/index.js');

const worker = W.default;
const ORIGIN = 'https://fthlmu.github.io';
const CODE = 'ABCDEFGHJKMN';
const BASE = 'https://topik2-sync.example.workers.dev';
const doc = n => ({ format: 1, resetAt: null, attempts: [{ q: n }], sessions: [], deck: {}, deckRemoved: {} });

function mapStorage() {
  const m = new Map();
  return {
    async get(keys) {
      if (!Array.isArray(keys)) return m.get(keys);
      const out = new Map();
      keys.forEach(k => { if (m.has(k)) out.set(k, m.get(k)); });
      return out;
    },
    async put(a, b) {
      if (typeof a === 'string') m.set(a, b);
      else Object.keys(a).forEach(k => m.set(k, a[k]));
    },
    _map: m
  };
}

function fakeEnv() {
  const objects = new Map();
  const SPACE = {
    idFromName: name => ({ name }),
    get(id) {
      if (!objects.has(id.name)) objects.set(id.name, new W.SyncSpace({ storage: mapStorage() }, {}));
      const obj = objects.get(id.name);
      return { fetch: (input, init) => obj.fetch(new Request(input, init)) };
    }
  };
  return { SPACE, objects };
}

async function call(env, method, path, opts) {
  const o = opts || {};
  const headers = new Headers(o.headers || {});
  if (o.origin !== null) headers.set('Origin', o.origin || ORIGIN);
  const init = { method, headers };
  if (o.body !== undefined) init.body = typeof o.body === 'string' ? o.body : JSON.stringify(o.body);
  const res = await worker.fetch(new Request(BASE + path, init), env);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (err) { json = null; }
  return { status: res.status, headers: res.headers, text, json };
}

module.exports = (async () => {
  const env = fakeEnv();
  const space = '/v1/space/' + CODE;

  // 1. Health check, and no caching anywhere.
  {
    const r = await call(env, 'GET', '/', { origin: null });
    assert.strictEqual(r.status, 200);
    assert.strictEqual(r.text, 'ok');
    assert.strictEqual(r.headers.get('Cache-Control'), 'no-store');
    assert.strictEqual(r.headers.get('Access-Control-Allow-Origin'), null, 'no Origin header: no CORS headers');
  }

  // 2. A new space: version 0, no document, nothing stored. CORS headers echo the allowed origin.
  {
    const r = await call(env, 'GET', space);
    assert.strictEqual(r.status, 200);
    assert.deepStrictEqual(r.json, { version: 0, doc: null });
    assert.strictEqual(r.headers.get('Access-Control-Allow-Origin'), ORIGIN);
    assert.strictEqual(r.headers.get('Vary'), 'Origin');
    assert.strictEqual(r.headers.get('Cache-Control'), 'no-store');
    assert.ok(/application\/json/.test(r.headers.get('Content-Type')));
  }

  // 3. Create: PUT baseVersion 0 stores the document as version 1, in one storage write.
  {
    const r = await call(env, 'PUT', space, { body: { baseVersion: 0, doc: doc(1) } });
    assert.strictEqual(r.status, 200);
    assert.deepStrictEqual(r.json, { version: 1 });
    const g = await call(env, 'GET', space);
    assert.deepStrictEqual(g.json, { version: 1, doc: doc(1) });
    const stored = env.objects.get(CODE).ctx.storage._map;
    assert.strictEqual(stored.get('version'), 1);
    assert.deepStrictEqual(JSON.parse(stored.get('doc')), doc(1));
  }

  // 4. A stale PUT: 409 with the current version and document; nothing written. Then the right base.
  {
    const r = await call(env, 'PUT', space, { body: { baseVersion: 0, doc: doc(2) } });
    assert.strictEqual(r.status, 409);
    assert.deepStrictEqual(r.json, { version: 1, doc: doc(1) });
    const ahead = await call(env, 'PUT', space, { body: { baseVersion: 5, doc: doc(2) } });
    assert.strictEqual(ahead.status, 409, 'a base from the future is stale too');
    const ok = await call(env, 'PUT', space, { body: { baseVersion: 1, doc: doc(2) } });
    assert.deepStrictEqual([ok.status, ok.json], [200, { version: 2 }]);
    assert.deepStrictEqual((await call(env, 'GET', space)).json, { version: 2, doc: doc(2) });
    // Another code is another space.
    assert.deepStrictEqual((await call(env, 'GET', '/v1/space/0123456789AB')).json, { version: 0, doc: null });
  }

  // 5. Bad codes: 400 (not 12 characters, or not Crockford base32: lower case, I, L, O, U).
  for (const bad of ['abcdefghjkmn', 'ABCDEFGHJKM', 'ABCDEFGHJKMNP', 'ABCDEFGHIKMN', 'ABCDEFGHJKLN', 'ABCDEFGHJKMO',
    'ABCDEFGHJKMU', 'ABCD-EFGH-JK', '']) {
    const g = await call(env, 'GET', '/v1/space/' + bad);
    assert.strictEqual(g.status, 400, 'GET ' + bad);
    const p = await call(env, 'PUT', '/v1/space/' + bad, { body: { baseVersion: 0, doc: doc(1) } });
    assert.strictEqual(p.status, 400, 'PUT ' + bad);
  }

  // 6. Over 1.5 MB: 413, by the stated length or by the bytes that arrive.
  {
    const big = JSON.stringify({ baseVersion: 2, doc: { ...doc(3), pad: 'x'.repeat(1.6 * 1024 * 1024) } });
    const r = await call(env, 'PUT', space, { body: big });
    assert.strictEqual(r.status, 413);
    const stated = await call(env, 'PUT', space, { body: '{}', headers: { 'Content-Length': String(2 * 1024 * 1024) } });
    assert.strictEqual(stated.status, 413, 'a stated length over the limit');
    assert.strictEqual((await call(env, 'GET', space)).json.version, 2, 'nothing written');
    // Just under the limit is fine.
    const fits = JSON.stringify({ baseVersion: 2, doc: { ...doc(3), pad: 'x'.repeat(1024 * 1024) } });
    assert.strictEqual((await call(env, 'PUT', space, { body: fits })).status, 200);
  }

  // 7. Bad bodies: 400, nothing written.
  {
    const before = (await call(env, 'GET', space)).json.version;
    const bodies = ['not json', '[]', 'null', '{"baseVersion":3}',
      { baseVersion: -1, doc: doc(1) }, { baseVersion: 1.5, doc: doc(1) }, { baseVersion: '3', doc: doc(1) },
      { baseVersion: before, doc: null }, { baseVersion: before, doc: [doc(1)] }, { baseVersion: before, doc: { format: 2 } },
      { baseVersion: before, doc: { attempts: [] } }];
    for (const body of bodies) {
      const r = await call(env, 'PUT', space, { body });
      assert.strictEqual(r.status, 400, 'body ' + JSON.stringify(body));
      assert.ok(r.json && typeof r.json.error === 'string');
    }
    assert.strictEqual((await call(env, 'GET', space)).json.version, before);
  }

  // 8. The preflight, and the allowed origins (the site, any local port).
  {
    const pre = await call(env, 'OPTIONS', space, { headers: { 'Access-Control-Request-Method': 'PUT' } });
    assert.strictEqual(pre.status, 204);
    assert.strictEqual(pre.headers.get('Access-Control-Allow-Origin'), ORIGIN);
    assert.strictEqual(pre.headers.get('Access-Control-Allow-Methods'), 'GET, PUT, OPTIONS');
    assert.strictEqual(pre.headers.get('Access-Control-Allow-Headers'), 'Content-Type');
    assert.strictEqual(pre.headers.get('Access-Control-Max-Age'), '86400');
    assert.strictEqual(pre.headers.get('Vary'), 'Origin');
    for (const origin of ['http://localhost:8765', 'http://127.0.0.1:5500', 'http://localhost']) {
      const r = await call(env, 'GET', space, { origin });
      assert.strictEqual(r.status, 200, origin);
      assert.strictEqual(r.headers.get('Access-Control-Allow-Origin'), origin);
    }
  }

  // 9. Any other origin: 403 and no CORS headers (also for the preflight).
  for (const origin of ['https://evil.example', 'null', 'http://fthlmu.github.io', 'https://fthlmu.github.io.evil.example',
    'http://localhost.evil.example', 'https://localhost:8765', 'http://127.0.0.2:80']) {
    for (const method of ['GET', 'OPTIONS']) {
      const r = await call(env, method, space, { origin });
      assert.strictEqual(r.status, 403, method + ' ' + origin);
      assert.strictEqual(r.headers.get('Access-Control-Allow-Origin'), null);
      assert.strictEqual(r.headers.get('Cache-Control'), 'no-store');
    }
  }
  assert.strictEqual(W.originAllowed(undefined), false);

  // 10. Unknown paths 404, other methods 405.
  assert.strictEqual((await call(env, 'GET', '/v1/space')).status, 404);
  assert.strictEqual((await call(env, 'GET', '/v1/space/' + CODE + '/x')).status, 404);
  assert.strictEqual((await call(env, 'GET', '/v2/space/' + CODE)).status, 404);
  const del = await call(env, 'DELETE', space);
  assert.strictEqual(del.status, 405);
  assert.strictEqual(del.headers.get('Allow'), 'GET, PUT, OPTIONS');
  assert.strictEqual((await call(env, 'POST', '/')).status, 405);

  // 11. Two PUTs at the same baseVersion: the first wins (200), the second gets 409 with the first's doc.
  {
    const e2 = fakeEnv();
    const p = '/v1/space/' + CODE;
    await call(e2, 'PUT', p, { body: { baseVersion: 0, doc: doc(1) } });
    const first = await call(e2, 'PUT', p, { body: { baseVersion: 1, doc: doc(10) } });
    const second = await call(e2, 'PUT', p, { body: { baseVersion: 1, doc: doc(20) } });
    assert.deepStrictEqual([first.status, first.json], [200, { version: 2 }]);
    assert.deepStrictEqual([second.status, second.json], [409, { version: 2, doc: doc(10) }]);
  }

  // 12. Rate limits (Workers rate-limiting bindings, faked): keyed on CF-Connecting-IP ('none' when
  // absent); every PUT checks PUT_LIMIT, a PUT with baseVersion 0 also CREATE_LIMIT; 429 keeps CORS.
  {
    const limiter = max => {
      const counts = new Map();
      return {
        keys: [],
        async limit({ key }) {
          this.keys.push(key);
          counts.set(key, (counts.get(key) || 0) + 1);
          return { success: counts.get(key) <= max };
        }
      };
    };
    const e3 = { ...fakeEnv(), PUT_LIMIT: limiter(3), CREATE_LIMIT: limiter(1) };
    const ip = a => ({ 'CF-Connecting-IP': a });
    const put = (code, base, headers) => call(e3, 'PUT', '/v1/space/' + code, { body: { baseVersion: base, doc: doc(base) }, headers });

    const created = await put('AAAAAAAAAAAA', 0, ip('1.1.1.1'));
    assert.strictEqual(created.status, 200);
    const create2 = await put('BBBBBBBBBBBB', 0, ip('1.1.1.1'));
    assert.deepStrictEqual([create2.status, create2.json], [429, { error: 'rate' }], 'second new space in a minute');
    assert.strictEqual(create2.headers.get('Access-Control-Allow-Origin'), ORIGIN, 'a 429 still carries CORS');
    assert.strictEqual(create2.headers.get('Cache-Control'), 'no-store');
    assert.strictEqual((await call(e3, 'GET', '/v1/space/BBBBBBBBBBBB')).json.version, 0, 'not created');
    assert.strictEqual((await put('AAAAAAAAAAAA', 1, ip('1.1.1.1'))).status, 200, 'a normal PUT is not a create');
    const over = await put('AAAAAAAAAAAA', 2, ip('1.1.1.1'));
    assert.deepStrictEqual([over.status, over.json], [429, { error: 'rate' }], 'the fourth PUT in a minute');
    assert.strictEqual(over.headers.get('Access-Control-Allow-Origin'), ORIGIN);
    assert.strictEqual((await put('AAAAAAAAAAAA', 2, ip('2.2.2.2'))).status, 200, 'another address has its own count');
    assert.strictEqual((await put('AAAAAAAAAAAA', 3)).status, 200, 'no address header: key "none"');
    assert.ok(e3.PUT_LIMIT.keys.includes('none') && e3.PUT_LIMIT.keys.includes('2.2.2.2'));
    assert.deepStrictEqual(e3.CREATE_LIMIT.keys, ['1.1.1.1', '1.1.1.1'], 'only creates check CREATE_LIMIT');
    assert.strictEqual((await call(e3, 'GET', '/v1/space/AAAAAAAAAAAA', { headers: ip('1.1.1.1') })).status, 200, 'GET is not limited');

    // No binding (tests, local dev): no limit at all. A limiter that throws lets the request through.
    const e4 = fakeEnv();
    for (let i = 0; i < 40; i += 1) {
      const r = await call(e4, 'PUT', '/v1/space/CCCCCCCCCCCC', { body: { baseVersion: i, doc: doc(i) }, headers: ip('1.1.1.1') });
      assert.strictEqual(r.status, 200, 'PUT ' + i + ' without a binding');
    }
    const e5 = { ...fakeEnv(), PUT_LIMIT: { limit: async () => { throw new Error('limiter down'); } } };
    assert.strictEqual((await call(e5, 'PUT', '/v1/space/' + CODE, { body: { baseVersion: 0, doc: doc(1) } })).status, 200);
  }
})();
