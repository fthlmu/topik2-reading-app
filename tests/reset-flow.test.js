// reset-flow.test.js: 기록 초기화 (Reset progress): the PIN check, the reset itself end to end with the
// real Store and SRS, the dialog markup, and that the PIN is printed nowhere a person can read it.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

global.window = global.window || {};
const PIN = '753698'; // the owner's fixed PIN; this is the only copy outside js/reset-flow.js

function makeStorage() {
  const m = new Map();
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => { m.set(k, String(v)); },
    removeItem: k => { m.delete(k); },
    clear: () => m.clear()
  };
}
const prevWindowLS = global.window.localStorage;
const prevGlobalLS = global.localStorage;
const ls = makeStorage();
global.window.localStorage = ls;
global.localStorage = ls;

try {
  require('../lessons.js');
  const Flow = require('../js/reset-flow.js');
  const SRS = require('../js/srs.js');
  const Store = require('../js/store.js');
  const Dialog = require('../js/screens/reset-dialog.js');
  SRS._useStorage(ls);

  // 1. The PIN check accepts only the exact 6 digits.
  assert.strictEqual(Flow.PIN_LENGTH, 6);
  assert.strictEqual(Flow.pinOk(PIN), true);
  ['', ' ', '75369', '7536980', ' ' + PIN, PIN + ' ', '753699', '053698', '753 698', '７５３６９８', PIN + PIN]
    .forEach(s => assert.strictEqual(Flow.pinOk(s), false, 'rejected: ' + JSON.stringify(s)));
  [null, undefined, 753698, [PIN], { toString: () => PIN }, true].forEach(v =>
    assert.strictEqual(Flow.pinOk(v), false, 'not a string: ' + String(v)));

  // 2. resetAll deletes the progress and the deck, keeps the settings.
  {
    ls.clear();
    Store.resetCache();
    Store.load();
    SRS._useStorage(ls);
    Store.setSetting('uiLang', 'en');
    Store.recordAttempt({ q: 3, mode: 'sprint', chosen: 1, correct: false, sure: true, sessionId: 's1' });
    Store.recordSession({ id: 's1', mode: 'sprint', qs: [3], right: 0, total: 1, overtimeCount: 0, durationMs: 1000 });
    SRS.seedMany(['Q3:v:0', 'Q3:v:1']);
    assert.ok(Store.get().attempts.length === 1 && SRS.stats().total === 2);
    Flow.resetAll({ Store, SRS });
    assert.deepStrictEqual(Store.get().attempts, []);
    assert.deepStrictEqual(Store.get().sessions, []);
    assert.strictEqual(SRS.stats().total, 0);
    assert.strictEqual(Store.get().settings.uiLang, 'en', 'the 한 / EN choice stays');
    assert.strictEqual(Store.statusOf(3), 'untried');
  }

  // 3. Order and calls, with stand-ins: the record first, then the deck.
  {
    const calls = [];
    Flow.resetAll({ Store: { resetProgress: () => calls.push('store') }, SRS: { reset: () => calls.push('srs') } });
    assert.deepStrictEqual(calls, ['store', 'srs']);
  }

  // 4. The dialog markup: a native dialog named by its title, two steps, a 6-digit password field with
  // a visible label, the three buttons per step, and none of the text carries the PIN.
  {
    const html = Dialog.html();
    assert.ok(html.includes('<dialog class="reset-dialog"'));
    assert.ok(html.includes('aria-labelledby="reset-title-confirm"'));
    assert.ok(html.includes('data-act="reset-open">기록 초기화</button>'));
    assert.ok(html.includes('공부 기록을 모두 지울까요?'));
    assert.ok(html.includes('푼 문제, 스프린트와 모의고사 기록, 복습 덱이 모두 지워집니다. 되돌릴 수 없습니다.'));
    assert.ok(/<label[^>]*for="reset-pin"[^>]*>PIN 6자리<\/label>/.test(html), 'visible label');
    const input = /<input[^>]*id="reset-pin"[^>]*>/.exec(html)[0];
    ['type="password"', 'inputmode="numeric"', 'autocomplete="off"', 'maxlength="6"'].forEach(a =>
      assert.ok(input.includes(a), 'input has ' + a));
    assert.ok(html.includes('role="alert"') && html.includes('PIN이 맞지 않습니다.'));
    assert.ok(html.includes('class="btn btn--primary" data-act="reset-next">계속</button>'));
    assert.ok(html.includes('class="btn btn--danger">초기화</button>'));
    assert.strictEqual((html.match(/data-act="reset-cancel"/g) || []).length, 2, '취소 on both steps');
    // The done pop-up (replaced the one-line status, 2026-10-31): its own modal dialog, named by its
    // title, with a decorative badge hidden from screen readers and one 확인 button (EN "OK").
    assert.ok(html.includes('<dialog class="reset-dialog reset-done" data-reset-done aria-labelledby="reset-done-title">'));
    assert.ok(html.includes('id="reset-done-title">기록을 초기화했습니다</h2>'));
    assert.ok(html.includes('진도, 기록, 복습 덱이 모두 비었습니다.'));
    assert.ok(/class="reset-done__badge" aria-hidden="true"/.test(html), 'badge hidden from screen readers');
    assert.ok(html.includes('data-act="reset-done-close" data-ui-en="OK">확인</button>'));
    assert.ok(!html.includes(PIN), 'the dialog does not print the PIN');
  }

  // 5. The PIN is printed nowhere: not in the page, the styles, the guide or the README. It lives in
  // js/reset-flow.js only (and in this test).
  {
    const root = path.join(__dirname, '..');
    const files = ['index.html', 'README.md', 'styles.css'];
    ['js', 'js/screens', 'js/render', 'styles'].forEach(dir => {
      fs.readdirSync(path.join(root, dir)).forEach(f => {
        if (/\.(js|css)$/.test(f)) files.push(dir + '/' + f);
      });
    });
    const holders = files.filter(f => fs.readFileSync(path.join(root, f), 'utf8').includes(PIN));
    assert.deepStrictEqual(holders, ['js/reset-flow.js'], 'the PIN appears in one source file only');
  }
} finally {
  global.window.localStorage = prevWindowLS;
  global.localStorage = prevGlobalLS;
  const Store = require('../js/store.js');
  Store.resetCache();
}
