// sync-merge.js: the pure part of device sync (computer <-> iPad). No DOM, no network.
// The synced document (format 1):
//   { format: 1, resetAt: ISO|null, attempts: [...], sessions: [...], deck: {key: card}, deckRemoved: {key: tMs} }
// Never synced (each device keeps its own): settings, the open sprint/mock run, retryQs, the active tab.
// Merge rules (merge(a, b, nowMs)):
//   1. resetAt: the later of the two (null loses).
//   2. attempts: union, one copy per [q, mode, at, sessionId, chosen, correct] (the first side's copy
//      is kept), none older than resetAt, sorted by at (stable: ties keep their order).
//   3. sessions: union by id (on a clash the first side's copy is kept), none older than resetAt,
//      sorted by at (stable).
//   4. streak: not in the document; applyToState() recomputes it from the merged sessions with the
//      same day rule as Store.nextStreak.
//   5. deck: a card that was reviewed (seen > 0) beats one that was only seeded (seen 0), whatever
//      their times; otherwise the newer write (t, ms; a card without t counts as 0) wins, then the
//      card seen more often, then the larger canonical JSON. A removed card leaves a tombstone
//      deckRemoved[key] = t; a card survives only if its t is later than its tombstone. Cards and
//      tombstones older than resetAt are dropped; tombstones older than 120 days are pruned.
//   6. local-only fields pass through applyToState() untouched.
// Pairing (merge(local, remote, now, { union: true }), used by Sync create() and join()): a reset
// travels only between devices that are already paired. The first merge ignores both resetAt values
// (each side's own reset already cleared its own data) and the result has resetAt null, so pairing
// never deletes the other device's older history. Accepted edge case: a third device that was offline
// during a reset and has not synced since can bring its old data back after a later join.
// Call merge(local, remote): the first argument is the local side. The result is idempotent and,
// whenever both sides hold the same copy under the same id (always the case in this app: a recorded
// session is never changed), commutative. sameDoc() compares canonical JSON (sorted keys).
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('./util.js');
  const Store = root.Store || require('./store.js');
  const SRS = root.SRS || require('./srs.js');

  const FORMAT = 1;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const TOMBSTONE_TTL_MS = 120 * DAY_MS;

  const isPlain = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const has = (obj, k) => Object.prototype.hasOwnProperty.call(obj, k);
  const msOf = iso => {
    const n = typeof iso === 'string' ? Date.parse(iso) : NaN;
    return Number.isFinite(n) ? n : null;
  };
  const atMs = x => {
    const n = msOf(x.at);
    return n === null ? 0 : n;
  };
  const isoOrNull = v => (msOf(v) === null ? null : new Date(msOf(v)).toISOString());
  const tOf = card => (card && typeof card.t === 'number' && Number.isFinite(card.t) ? card.t : 0);

  // ── Canonical JSON: object keys sorted at every level, arrays in order ──

  function sortKeys(v) {
    if (Array.isArray(v)) return v.map(sortKeys);
    if (!isPlain(v)) return v;
    const out = {};
    Object.keys(v).sort().forEach(k => { out[k] = sortKeys(v[k]); });
    return out;
  }

  function canonical(v) {
    return JSON.stringify(sortKeys(v));
  }

  // ── Normalizing: the same rules as the store and the deck ──

  function cleanDeck(raw) {
    const out = {};
    if (!isPlain(raw)) return out;
    Object.keys(raw).sort().forEach(k => {
      const c = raw[k];
      if (!SRS.parseKey(k) || !SRS.isCard(c)) return;
      const card = { box: c.box, due: c.due, seen: c.seen, wrong: c.wrong, added: c.added };
      out[k] = typeof c.t === 'number' ? { ...card, t: c.t } : card;
    });
    return out;
  }

  function cleanRemoved(raw) {
    const out = {};
    if (!isPlain(raw)) return out;
    Object.keys(raw).sort().forEach(k => {
      if (SRS.parseKey(k) && typeof raw[k] === 'number' && Number.isFinite(raw[k])) out[k] = raw[k];
    });
    return out;
  }

  function emptyDoc() {
    return { format: FORMAT, resetAt: null, attempts: [], sessions: [], deck: {}, deckRemoved: {} };
  }

  // Any input (a server reply included) -> a valid format-1 document. Wrong shape -> empty parts.
  function normalizeDoc(raw) {
    const d = isPlain(raw) && raw.format === FORMAT ? raw : {};
    const rec = Store.normalize({ version: 2, attempts: d.attempts, sessions: d.sessions });
    return {
      format: FORMAT,
      resetAt: isoOrNull(d.resetAt),
      attempts: rec.attempts,
      sessions: rec.sessions,
      deck: cleanDeck(d.deck),
      deckRemoved: cleanRemoved(d.deckRemoved)
    };
  }

  // The synced part of this device: the store state + SRS.exportSync() ({ deck, removed }).
  function docOf(state, deckData) {
    const s = isPlain(state) ? state : {};
    const dd = isPlain(deckData) ? deckData : {};
    return normalizeDoc({
      format: FORMAT, resetAt: s.resetAt, attempts: s.attempts, sessions: s.sessions,
      deck: dd.deck, deckRemoved: dd.removed
    });
  }

  // ── Merge ──

  function laterIso(a, b) {
    if (a === null) return b;
    if (b === null) return a;
    return msOf(b) > msOf(a) ? b : a;
  }

  // Sorted by at; equal times keep their order (index as the tie-break: a stable sort everywhere).
  function byAt(list) {
    return list.map((x, i) => [atMs(x), i, x]).sort((p, q) => p[0] - q[0] || p[1] - q[1]).map(r => r[2]);
  }

  const attemptKey = a => JSON.stringify([a.q, a.mode, a.at, a.sessionId, a.chosen, a.correct]);

  function unionBy(list, keyOf, cut) {
    const seen = new Set();
    return list.filter(x => {
      const k = keyOf(x);
      if (seen.has(k) || atMs(x) < cut) return false;
      seen.add(k);
      return true;
    });
  }

  // The card to keep. A reviewed card beats a fresh seed (a wrong answer seeds a key that the other
  // device may already have graded up). Then the newer write; a tie goes to more reviews, then to the
  // larger canonical JSON. Symmetric: newer(x, y) and newer(y, x) pick the same card.
  function newer(x, y) {
    if (!x) return y;
    if (!y) return x;
    if ((x.seen === 0) !== (y.seen === 0)) return x.seen === 0 ? y : x;
    if (tOf(x) !== tOf(y)) return tOf(x) > tOf(y) ? x : y;
    if (x.seen !== y.seen) return x.seen > y.seen ? x : y;
    return canonical(x) >= canonical(y) ? x : y;
  }

  function mergeDeck(a, b, cut, now) {
    const tomb = {};
    [a.deckRemoved, b.deckRemoved].forEach(m => Object.keys(m).forEach(k => {
      tomb[k] = has(tomb, k) ? Math.max(tomb[k], m[k]) : m[k];
    }));
    const deck = {};
    [...new Set([...Object.keys(a.deck), ...Object.keys(b.deck)])].sort().forEach(k => {
      const card = newer(a.deck[k], b.deck[k]);
      const t = tOf(card);
      if (t < cut || (has(tomb, k) && !(t > tomb[k]))) return;
      deck[k] = card;
    });
    const deckRemoved = {};
    Object.keys(tomb).sort().forEach(k => {
      const t = tomb[k];
      if (t < cut || t < now - TOMBSTONE_TTL_MS || has(deck, k)) return;
      deckRemoved[k] = t;
    });
    return { deck, deckRemoved };
  }

  // opts.union: the pairing merge (see the header): no reset cut-off, resetAt null.
  function merge(localDoc, remoteDoc, nowMs, opts) {
    const a = normalizeDoc(localDoc);
    const b = normalizeDoc(remoteDoc);
    const now = Number.isFinite(nowMs) ? nowMs : Date.now();
    const resetAt = opts && opts.union ? null : laterIso(a.resetAt, b.resetAt);
    const cut = resetAt === null ? -Infinity : msOf(resetAt);
    const { deck, deckRemoved } = mergeDeck(a, b, cut, now);
    return {
      format: FORMAT,
      resetAt,
      attempts: byAt(unionBy(a.attempts.concat(b.attempts), attemptKey, cut)),
      sessions: byAt(unionBy(a.sessions.concat(b.sessions), s => s.id, cut)),
      deck,
      deckRemoved
    };
  }

  function sameDoc(a, b) {
    return canonical(normalizeDoc(a)) === canonical(normalizeDoc(b));
  }

  // ── Back onto this device ──

  // The streak the sessions earn, day by day (local calendar dates), with Store's own rule.
  function streakOf(sessions) {
    return byAt((sessions || []).filter(s => msOf(s.at) !== null))
      .reduce((st, s) => Store.nextStreak(st, Util.toISODate(new Date(s.at))), { last: null, count: 0 });
  }

  // The store state with the merged synced parts; everything local-only stays as it was.
  function applyToState(state, doc) {
    return {
      ...state,
      resetAt: doc.resetAt,
      attempts: doc.attempts,
      sessions: doc.sessions,
      streak: streakOf(doc.sessions)
    };
  }

  function deckOf(doc) {
    return { deck: doc.deck, removed: doc.deckRemoved };
  }

  // Which parts differ (so a device writes only what changed).
  function storePart(doc) {
    return canonical([doc.resetAt, doc.attempts, doc.sessions]);
  }

  function deckPart(doc) {
    return canonical([doc.deck, doc.deckRemoved]);
  }

  const SyncMerge = {
    FORMAT, TOMBSTONE_TTL_MS, emptyDoc, normalizeDoc, docOf, merge, canonical, sameDoc,
    streakOf, applyToState, deckOf, storePart, deckPart
  };

  if (typeof window !== 'undefined') window.SyncMerge = SyncMerge;
  if (typeof module !== 'undefined') module.exports = SyncMerge;
})();
