// srs.js - Leitner spaced-repetition boxes for the TOPIK II reading app.
// Keys: "Q<num>:<kind>:<index>" (kind v = vocab, g = grammar). No DOM access.
// Record: { box:1..5, due:'YYYY-MM-DD', seen, wrong, added:'YYYY-MM-DD', t? }
// t = ms time of the card's last seed or grade (device sync: the newer write of a card wins;
// cards from before sync have no t and count as 0).
// load() validates the stored deck: a root that is not an object, or a card that does not
// match the record shape, is skipped. The raw value is copied to "topik2_srs.bak" first, then
// the cleaned deck is written back (if the copy fails, the original is never overwritten).
// If a write fails, the deck stays in memory for the page session (isPersistent() says false).
// remove() leaves a tombstone { key: tMs } in "topik2_srs.removed" so a synced device drops the
// card too. exportSync()/importSync() hand the deck + tombstones to js/sync.js; onChange(fn)
// is called after every seed, grade, removal and reset (not after importSync).
(function () {
  var KEY = 'topik2_srs';
  var BAK_KEY = 'topik2_srs.bak';
  var REMOVED_KEY = 'topik2_srs.removed';
  var INTERVALS = [1, 2, 4, 8, 16];
  var MAX_BOX = INTERVALS.length;
  var listeners = [];

  function memoryStorage() {
    var m = {};
    return {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(m, k) ? m[k] : null; },
      setItem: function (k, v) { m[k] = String(v); },
      removeItem: function (k) { delete m[k]; }
    };
  }

  var storage;
  try { storage = (typeof window !== 'undefined' && window.localStorage) || memoryStorage(); }
  catch (e) { storage = memoryStorage(); }

  function pad(n) { return String(n).padStart(2, '0'); }
  function fmtDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function todayStr() { return fmtDate(new Date()); }
  function addDays(dateStr, n) {
    var p = dateStr.split('-').map(Number);
    return fmtDate(new Date(p[0], p[1] - 1, p[2] + n));
  }

  function keyOf(q, kind, idx) { return 'Q' + q + ':' + kind + ':' + idx; }
  function parseKey(key) {
    var m = /^Q(\d+):([a-z]+):(\d+)$/.exec(String(key));
    return m ? { q: Number(m[1]), kind: m[2], idx: Number(m[3]) } : null;
  }

  // ── Validation: what a stored deck may contain ──

  function isPlain(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
  function isCount(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v && v >= 0; }
  function isDateStr(s) {
    var m = typeof s === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(s) : null;
    if (!m) return false;
    var y = Number(m[1]), mo = Number(m[2]) - 1, d = Number(m[3]);
    var date = new Date(y, mo, d);
    return date.getFullYear() === y && date.getMonth() === mo && date.getDate() === d;
  }
  function isCard(r) {
    return isPlain(r) && isCount(r.box) && r.box >= 1 && r.box <= MAX_BOX &&
      isDateStr(r.due) && isCount(r.seen) && isCount(r.wrong) && isDateStr(r.added) &&
      (r.t === undefined || (typeof r.t === 'number' && isFinite(r.t)));
  }

  // Keep the well-formed cards under well-formed keys. dropped = something was skipped.
  function clean(parsed) {
    var store = {}, dropped = !isPlain(parsed);
    if (!dropped) {
      Object.keys(parsed).forEach(function (k) {
        if (parseKey(k) && isCard(parsed[k])) store[k] = parsed[k];
        else dropped = true;
      });
    }
    return { store: store, dropped: dropped };
  }

  // ── Storage ──

  var blocked = false;    // a corrupt value could not be backed up: never overwrite it
  var persistent = true;  // false once a write failed, until one goes through again
  // When a write fails (storage full or blocked) or is held back, the deck stays in memory for this
  // page session: grades and seeds are not lost, and every read returns it, as long as storage still
  // holds the same string it was built on (if another tab changed it, or it was removed, storage wins).
  var mem = null;         // the deck kept in memory
  var memRaw = null;      // the stored string that deck is newer than
  var lastRaw = null;     // the stored string the latest load() saw

  // Corrupt value: copy it to KEY.bak, then write the cleaned deck. No copy, no write.
  function keepBackup(raw, store) {
    try { storage.setItem(BAK_KEY, raw); } catch (e) { blocked = true; return; }
    blocked = false;
    save(store);
  }

  function load() {
    var raw;
    try { raw = storage.getItem(KEY); } catch (e) { return mem || {}; }
    var key = raw == null ? null : raw;
    var keep = mem && key === memRaw ? mem : null;
    if (!keep) mem = null;
    lastRaw = key;
    // Nothing stored: whatever was corrupt is gone, so writing is safe again.
    if (raw == null || raw === '') { blocked = false; return keep || {}; }
    var res;
    try { res = clean(JSON.parse(raw)); } catch (e) { res = { store: {}, dropped: true }; }
    var deck = keep || res.store;
    if (res.dropped) keepBackup(raw, deck);
    else blocked = false;
    return deck;
  }

  function save(store) {
    if (!blocked) {
      try {
        var raw = JSON.stringify(store);
        storage.setItem(KEY, raw);
        mem = null;
        lastRaw = raw;
        persistent = true;
        return;
      } catch (e) { /* kept in memory below */ }
    }
    mem = store;
    memRaw = lastRaw;
    persistent = false;
  }

  function fresh() {
    var day = todayStr();
    return { box: 1, due: day, seen: 0, wrong: 0, added: day, t: Date.now() };
  }

  // A listener never breaks a seed or a grade: its error is kept from the deck code on purpose.
  function emit() {
    listeners.slice().forEach(function (fn) { try { fn(); } catch (e) { /* see above */ } });
  }

  function onChange(fn) {
    listeners.push(fn);
    return function () { listeners = listeners.filter(function (x) { return x !== fn; }); };
  }

  function seedMany(keys) {
    var store = load(), changed = false;
    keys.forEach(function (k) { if (!store[k]) { store[k] = fresh(); changed = true; } });
    if (changed) { save(store); emit(); }
  }
  function seed(key) { seedMany([key]); }

  function record(key, isRight) {
    var store = load();
    var rec = store[key] || fresh();
    rec.seen += 1;
    if (isRight) { rec.box = Math.min(rec.box + 1, MAX_BOX); }
    else { rec.box = 1; rec.wrong += 1; }
    rec.due = addDays(todayStr(), INTERVALS[rec.box - 1]);
    rec.t = Date.now();
    store[key] = rec;
    save(store);
    emit();
    return rec;
  }

  // ── Tombstones of removed cards ("topik2_srs.removed": { key: tMs }) ──
  // A write that fails keeps them in memory until a write goes through again.

  var removedMem = null;

  function cleanRemoved(parsed) {
    var out = {};
    if (!isPlain(parsed)) return out;
    Object.keys(parsed).forEach(function (k) {
      var t = parsed[k];
      if (parseKey(k) && typeof t === 'number' && isFinite(t)) out[k] = t;
    });
    return out;
  }

  function loadRemoved() {
    if (removedMem) return cleanRemoved(removedMem);
    var raw = null;
    try { raw = storage.getItem(REMOVED_KEY); } catch (e) { return {}; }
    try { return cleanRemoved(JSON.parse(raw || '{}')); } catch (e) { return {}; }
  }

  function saveRemoved(map) {
    try { storage.setItem(REMOVED_KEY, JSON.stringify(map)); removedMem = null; }
    catch (e) { removedMem = map; }
  }

  // ── Device sync (js/sync.js) ──

  // Copies, so the caller can never change the stored deck by accident.
  function exportSync() {
    return { deck: JSON.parse(JSON.stringify(load())), removed: loadRemoved() };
  }

  // Replace the deck and its tombstones with a merged copy. Bad cards and keys are skipped.
  function importSync(data) {
    var src = isPlain(data) ? data : {};
    load();
    save(clean(src.deck).store);
    saveRemoved(cleanRemoved(src.removed));
  }

  // Due keys, hardest first: lowest box, then most wrong, then oldest due.
  function dueKeys(limit, today) {
    var store = load(), t = today || todayStr();
    var n = limit === undefined ? 8 : limit;
    return Object.keys(store)
      .filter(function (k) { return store[k].due <= t; })
      .sort(function (a, b) {
        var x = store[a], y = store[b];
        return (x.box - y.box) || (y.wrong - x.wrong) || (x.due < y.due ? -1 : x.due > y.due ? 1 : 0);
      })
      .slice(0, n);
  }

  function stats() {
    var store = load(), t = todayStr();
    var out = { total: 0, due: 0, byBox: [0, 0, 0, 0, 0] };
    Object.keys(store).forEach(function (k) {
      var r = store[k];
      out.total += 1;
      if (r.due <= t) out.due += 1;
      out.byBox[r.box - 1] += 1;
    });
    return out;
  }

  // Remove a card and leave its tombstone, so a synced device drops it too.
  function remove(key) {
    var store = load();
    if (!store[key]) return;
    delete store[key];
    save(store);
    var removed = loadRemoved();
    removed[key] = Date.now();
    saveRemoved(removed);
    emit();
  }

  // 기록 초기화: empty the deck and its tombstones, in storage and in memory. If a corrupt value could
  // not be backed up, the original is still not overwritten (the empty deck then lives in memory
  // only). The .bak key stays.
  function reset() {
    load();
    save({});
    saveRemoved({});
    emit();
  }

  var SRS = {
    KEY: KEY, BAK_KEY: BAK_KEY, REMOVED_KEY: REMOVED_KEY, INTERVALS: INTERVALS, MAX_BOX: MAX_BOX,
    keyOf: keyOf, parseKey: parseKey, isCard: isCard, seed: seed, seedMany: seedMany, record: record,
    dueKeys: dueKeys, stats: stats, remove: remove, reset: reset,
    exportSync: exportSync, importSync: importSync, onChange: onChange,
    isPersistent: function () { return persistent; },
    _todayStr: todayStr, _addDays: addDays,
    _useStorage: function (obj) {
      storage = obj || memoryStorage();
      blocked = false; persistent = true; mem = null; memRaw = null; lastRaw = null; removedMem = null;
    }
  };
  if (typeof window !== 'undefined') window.SRS = SRS;
  if (typeof module !== 'undefined') module.exports = SRS;
})();
