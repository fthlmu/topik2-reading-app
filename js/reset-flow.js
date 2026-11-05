// reset-flow.js: the pure part of "기록 초기화" (Reset progress on the Today screen). No DOM.
//   pinOk(s)       true only for the exact PIN string. The PIN is a guard against pressing reset by
//                  accident, not security: it sits in this file, in the open. It is never printed on
//                  a screen, in the guide or in the README.
//   resetAll(deps) delete the progress: the study record (attempts, sessions, streak, the open run,
//                  the retry list; settings stay) and the review deck. deps = { Store, SRS }.
// The dialog that asks for the confirmation and the PIN is js/screens/reset-dialog.js.
(function () {
  'use strict';

  const RESET_PIN = '753698';

  function pinOk(s) {
    return typeof s === 'string' && s === RESET_PIN;
  }

  function resetAll(deps) {
    deps.Store.resetProgress();
    deps.SRS.reset();
  }

  const ResetFlow = { PIN_LENGTH: RESET_PIN.length, pinOk, resetAll };

  if (typeof window !== 'undefined') window.ResetFlow = ResetFlow;
  if (typeof module !== 'undefined') module.exports = ResetFlow;
})();
