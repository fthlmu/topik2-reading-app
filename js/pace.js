// pace.js - per-section time budgets for the TOPIK II reading app.
// Pure logic, no DOM. Attaches to window.PACE.
(function () {
  var SEC = { A: 40, B: 40, C: 30, D: 60, E: 60, F: 70, G: 90, H: 90, I: 80, J: 60, K: 90, L: 110, M: 100, N: 110, O: 110, P: 110, Q: 120, R: 120 };
  var TIER = {
    short: ['A', 'B', 'C', 'D', 'E'],
    medium: ['F', 'G', 'H', 'I', 'J', 'K'],
    long: ['L', 'M', 'N', 'O', 'P', 'Q', 'R']
  };
  var DEFAULT_SEC = 90;

  function secFor(id) {
    return Object.prototype.hasOwnProperty.call(SEC, id) ? SEC[id] : DEFAULT_SEC;
  }

  function tierOf(id) {
    var names = Object.keys(TIER);
    for (var i = 0; i < names.length; i++) {
      if (TIER[names[i]].indexOf(id) !== -1) return names[i];
    }
    return 'medium';
  }

  function isOver(ms, id) { return ms > secFor(id) * 1000; }

  function ratio(ms, id) { return Math.round((ms / (secFor(id) * 1000)) * 100) / 100; }

  function fmt(ms) {
    var total = Math.max(0, Math.floor(ms / 1000));
    var m = Math.floor(total / 60);
    var s = total % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  var PACE = { SEC: SEC, TIER: TIER, EXAM_TOTAL_SEC: 70 * 60, secFor: secFor, tierOf: tierOf, isOver: isOver, ratio: ratio, fmt: fmt };
  if (typeof window !== 'undefined') window.PACE = PACE;
  if (typeof module !== 'undefined') module.exports = PACE;
})();
