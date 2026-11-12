// sync-config.js: where the device-sync server lives (the Cloudflare Worker in sync-worker/).
// Empty = sync is not set up yet: the 기기 동기화 control says so and the app makes no network calls.
// After deploying the worker, put its address here, e.g. 'https://topik2-sync.<account>.workers.dev'.
(function () {
  'use strict';

  const SyncConfig = { SYNC_URL: 'https://topik2-sync.fathulmuin-garmin.workers.dev' };

  if (typeof window !== 'undefined') window.SyncConfig = SyncConfig;
  if (typeof module !== 'undefined') module.exports = SyncConfig;
})();
