// srs.js - Leitner spaced-repetition boxes for the TOPIK II reading app.
// Keys: "Q<num>:<kind>:<index>" (kind v = vocab, g = grammar). No DOM access.
// Record: { box:1..5, due:'YYYY-MM-DD', seen, wrong, added:'YYYY-MM-DD' }
(function () {
  var KEY = 'topik2_srs';
  var INTERVALS = [1, 2, 4, 8, 16];
  var MAX_BOX = INTERVALS.length;

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

  function load() {
    try {
      var raw = storage.getItem(KEY);
      var obj = raw ? JSON.parse(raw) : {};
      return obj && typeof obj === 'object' ? obj : {};
    } catch (e) { return {}; }
  }
  function save(store) {
    try { storage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* degrade silently */ }
  }

  function keyOf(q, kind, idx) { return 'Q' + q + ':' + kind + ':' + idx; }
  function parseKey(key) {
    var m = /^Q(\d+):([a-z]+):(\d+)$/.exec(String(key));
    return m ? { q: Number(m[1]), kind: m[2], idx: Number(m[3]) } : null;
  }

  function fresh() {
    var t = todayStr();
    return { box: 1, due: t, seen: 0, wrong: 0, added: t };
  }

  function seedMany(keys) {
    var store = load(), changed = false;
    keys.forEach(function (k) { if (!store[k]) { store[k] = fresh(); changed = true; } });
    if (changed) save(store);
  }
  function seed(key) { seedMany([key]); }

  function record(key, isRight) {
    var store = load();
    var rec = store[key] || fresh();
    rec.seen += 1;
    if (isRight) { rec.box = Math.min(rec.box + 1, MAX_BOX); }
    else { rec.box = 1; rec.wrong += 1; }
    rec.due = addDays(todayStr(), INTERVALS[rec.box - 1]);
    store[key] = rec;
    save(store);
    return rec;
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

  function remove(key) {
    var store = load();
    if (store[key]) { delete store[key]; save(store); }
  }

  var SRS = {
    KEY: KEY, INTERVALS: INTERVALS, MAX_BOX: MAX_BOX,
    keyOf: keyOf, parseKey: parseKey, seed: seed, seedMany: seedMany, record: record,
    dueKeys: dueKeys, stats: stats, remove: remove,
    _todayStr: todayStr, _addDays: addDays,
    _useStorage: function (obj) { storage = obj || memoryStorage(); }
  };
  if (typeof window !== 'undefined') window.SRS = SRS;
  if (typeof module !== 'undefined') module.exports = SRS;
})();
