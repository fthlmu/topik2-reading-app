// topik2-sync: the device-sync server for the TOPIK II reading app (Cloudflare Worker + one
// SQLite-backed Durable Object per sync code). No account, no secrets, no dependencies.
//   GET  /                 200 "ok"
//   GET  /v1/space/:code   200 { version, doc }   (a new space: version 0, doc null)
//   PUT  /v1/space/:code   body { baseVersion, doc }
//                          baseVersion = stored version: store doc, version + 1, 200 { version }
//                          otherwise 409 { version, doc } (the current one)
//   OPTIONS                CORS preflight
// code = 12 characters of Crockford base32, else 400. Body over 1.5 MB: 413. doc must be a plain
// object with format 1 and baseVersion a non-negative integer, else 400.
// Rate limits per client IP (CF-Connecting-IP, 'none' when absent), Workers rate-limiting bindings in
// wrangler.toml: every PUT checks PUT_LIMIT (30 a minute), a PUT with baseVersion 0 (a new space) also
// checks CREATE_LIMIT (5 a minute). Over a limit: 429 { error: 'rate' }, CORS headers still set. A
// binding missing from env (tests, local dev) is not checked.
// CORS: https://fthlmu.github.io and any http://localhost[:port] / http://127.0.0.1[:port]. A request
// from another origin gets 403; one without an Origin header (curl, a health check) is served without
// CORS headers. Every response says Cache-Control: no-store.
// The Durable Object keeps version and doc (as JSON text) in one storage.put({ version, doc }), and
// reads and writes them with nothing but storage calls in between, so the version check and the
// write are one atomic step.

const CODE_RE = /^[0-9ABCDEFGHJKMNPQRSTVWXYZ]{12}$/;
const MAX_BODY = 1.5 * 1024 * 1024;
const PAGES_ORIGIN = 'https://fthlmu.github.io';
const LOCAL_ORIGIN = /^http:\/\/(localhost|127\.0\.0\.1)(:\d{1,5})?$/;
const SPACE_PATH = /^\/v1\/space\/([^/]*)$/;

const isPlain = v => v !== null && typeof v === 'object' && !Array.isArray(v);

export function originAllowed(origin) {
  return typeof origin === 'string' && (origin === PAGES_ORIGIN || LOCAL_ORIGIN.test(origin));
}

function jsonText(status, text) {
  return new Response(text, { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}

function plain(status, text) {
  return new Response(text, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

const errorJson = (status, error) => jsonText(status, JSON.stringify({ error }));

// The current space as response text, without parsing the stored document again.
const spaceText = (version, docJson) => '{"version":' + version + ',"doc":' + (docJson === null ? 'null' : docJson) + '}';

// Every response: no caching, Vary: Origin, and the CORS headers for an allowed origin.
function finish(res, origin) {
  const out = new Response(res.body, res);
  out.headers.set('Cache-Control', 'no-store');
  out.headers.set('Vary', 'Origin');
  if (originAllowed(origin)) {
    out.headers.set('Access-Control-Allow-Origin', origin);
    out.headers.set('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    out.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    out.headers.set('Access-Control-Max-Age', '86400');
  }
  return out;
}

// The body as text, or null when it is over the limit (stated or actual size).
async function readCapped(request) {
  const stated = request.headers.get('Content-Length');
  if (stated !== null && Number(stated) > MAX_BODY) {
    if (request.body) await request.body.cancel(); // not read: tell the runtime so the upload stops
    return null;
  }
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let at = 0;
  chunks.forEach(c => { all.set(c, at); at += c.byteLength; });
  return new TextDecoder().decode(all);
}

// { baseVersion, doc } from a PUT body, or an error response.
async function parsePut(request) {
  const text = await readCapped(request);
  if (text === null) return { error: errorJson(413, 'too-large') };
  let body = null;
  try { body = JSON.parse(text); } catch (err) { return { error: errorJson(400, 'json') }; }
  if (!isPlain(body) || !Number.isInteger(body.baseVersion) || body.baseVersion < 0) {
    return { error: errorJson(400, 'base-version') };
  }
  if (!isPlain(body.doc) || body.doc.format !== 1) return { error: errorJson(400, 'doc') };
  return { baseVersion: body.baseVersion, doc: body.doc };
}

// True when this client may go on. No binding in env: no limit. A limiter that fails lets the request
// through: the limits guard against abuse and must never block normal syncing.
async function allowed(limiter, request) {
  if (!limiter || typeof limiter.limit !== 'function') return true;
  try {
    const { success } = await limiter.limit({ key: request.headers.get('CF-Connecting-IP') || 'none' });
    return success !== false;
  } catch (err) {
    return true;
  }
}

async function handleSpace(request, env, code) {
  if (!CODE_RE.test(code)) return errorJson(400, 'code');
  const stub = env.SPACE.get(env.SPACE.idFromName(code));
  if (request.method === 'GET') return stub.fetch('https://space/', { method: 'GET' });
  if (request.method !== 'PUT') {
    const res = errorJson(405, 'method');
    res.headers.set('Allow', 'GET, PUT, OPTIONS');
    return res;
  }
  if (!(await allowed(env.PUT_LIMIT, request))) {
    if (request.body) await request.body.cancel(); // not read: tell the runtime so the upload stops
    return errorJson(429, 'rate');
  }
  const put = await parsePut(request);
  if (put.error) return put.error;
  if (put.baseVersion === 0 && !(await allowed(env.CREATE_LIMIT, request))) return errorJson(429, 'rate');
  return stub.fetch('https://space/', {
    method: 'PUT',
    headers: { 'X-Base-Version': String(put.baseVersion), 'Content-Type': 'application/json' },
    body: JSON.stringify(put.doc)
  });
}

async function route(request, env) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  const path = new URL(request.url).pathname;
  if (path === '/') return request.method === 'GET' || request.method === 'HEAD' ? plain(200, 'ok') : errorJson(405, 'method');
  const m = SPACE_PATH.exec(path);
  if (!m) return errorJson(404, 'not-found');
  return handleSpace(request, env, m[1]);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    if (origin !== null && !originAllowed(origin)) return finish(plain(403, 'forbidden'), null);
    return finish(await route(request, env), origin);
  }
};

// One sync space (one code). Stored keys: version (integer), doc (the document as JSON text).
export class SyncSpace {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
  }

  async read() {
    const got = await this.ctx.storage.get(['version', 'doc']);
    const version = got.get('version');
    const doc = got.get('doc');
    return { version: Number.isInteger(version) ? version : 0, doc: typeof doc === 'string' ? doc : null };
  }

  async fetch(request) {
    if (request.method === 'GET') {
      const cur = await this.read();
      return jsonText(200, spaceText(cur.version, cur.doc));
    }
    if (request.method !== 'PUT') return errorJson(405, 'method');
    const base = Number(request.headers.get('X-Base-Version'));
    const docJson = await request.text();
    // From here to the write only storage calls run, so no other request can slip in between.
    const cur = await this.read();
    if (base !== cur.version) return jsonText(409, spaceText(cur.version, cur.doc));
    const version = cur.version + 1;
    await this.ctx.storage.put({ version, doc: docJson });
    return jsonText(200, JSON.stringify({ version }));
  }
}
