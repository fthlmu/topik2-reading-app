// sync-dialog.js: the "기기 동기화" (Sync devices) control on Today, next to 기록 초기화, and the dialog
// behind it (the same native <dialog> look as js/screens/reset-dialog.js). Steps in one dialog:
//   unset  the server address is not filled in yet (js/sync-config.js)
//   off    what sync does, 새 코드 만들기 / 코드 입력
//   join   a code field (typed input is normalized by Sync.normalizeCode), 취소 / 연결
//   on     the code in large type + 복사, the pairing link, the status, 지금 동기화, 이 기기에서 동기화 끄기
//   pair   opened by a pairing link (?sync=CODE): connect this device to that code?
// The status line under the control: off / on · last sync time / offline (retrying) / too large to
// sync (413, not retried until the next change) / not set up yet.
// The markup lives inside the screen root, so the 한 / EN switch translates it; the time sits in its
// own span so the words around it match js/ui-strings.js. bind(root, { onClosed }) wires the clicks and
// returns the unbind function. Network work is js/sync.js (window.Sync); this file only shows it.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('../util.js');
  const { esc } = Util;

  const Sync = () => root.Sync || null;

  const ERRORS = {
    invalid: '코드 형식이 맞지 않습니다.',
    'not-found': '이 코드로 만든 동기화가 없습니다.',
    other: '서버에 연결하지 못했습니다. 잠시 뒤 다시 시도하세요.'
  };

  const pad = n => String(n).padStart(2, '0');

  // Today: "14:32"; another day: "11/12 14:32".
  function timeLabel(iso, now) {
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return '';
    const hm = pad(d.getHours()) + ':' + pad(d.getMinutes());
    return Util.toISODate(d) === Util.toISODate(now) ? hm : (d.getMonth() + 1) + '/' + d.getDate() + ' ' + hm;
  }

  function statusHtml(st, now) {
    if (!st || st.state === 'unset') return '아직 설정되지 않음';
    if (st.state === 'off') return '꺼짐';
    if (st.busy) return '동기화 중';
    if (st.state === 'too-large') return '기록이 너무 커서 동기화할 수 없습니다';
    if (st.state === 'offline') return '오프라인 · 다시 시도 중';
    if (!st.lastSyncAt) return '켜짐';
    return '켜짐 · 마지막 동기화 <span class="num">' + esc(timeLabel(st.lastSyncAt, now || new Date())) + '</span>';
  }

  // ── Markup ──

  const CLOSE = '<button type="button" class="btn btn--quiet" data-act="sync-close">닫기</button>';
  const errorLine = () => '<p class="reset-dialog__error" data-sync-error role="alert" hidden></p>';

  function step(name, title, body, actions) {
    return '<div class="reset-dialog__step" data-step="' + name + '" hidden>' +
      '<h2 class="reset-dialog__title" id="sync-title-' + name + '">' + title + '</h2>' + body +
      '<div class="reset-dialog__actions">' + actions + '</div></div>';
  }

  function joinForm() {
    return '<form class="reset-dialog__step" data-step="join" data-sync-join-form autocomplete="off" novalidate hidden>' +
      '<h2 class="reset-dialog__title" id="sync-title-join">코드 입력</h2>' +
      '<label class="reset-dialog__label" for="sync-code">동기화 코드</label>' +
      '<input class="reset-dialog__input sync-dialog__input" id="sync-code" type="text" autocomplete="off" ' +
      'autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="24" ' +
      'placeholder="XXXX-XXXX-XXXX" aria-describedby="sync-code-error">' +
      '<p class="reset-dialog__error" id="sync-code-error" data-sync-error role="alert" hidden></p>' +
      '<div class="reset-dialog__actions"><button type="button" class="btn btn--quiet" data-act="sync-back">취소</button>' +
      '<button type="submit" class="btn btn--primary">연결</button></div></form>';
  }

  function dialogHtml() {
    return '<dialog class="reset-dialog sync-dialog" data-sync-dialog aria-labelledby="sync-title-off">' +
      step('unset', '기기 동기화', '<p class="reset-dialog__text">동기화 서버가 아직 설정되지 않았습니다.</p>', CLOSE) +
      step('off', '기기 동기화',
        '<p class="reset-dialog__text">컴퓨터와 iPad의 학습 기록과 복습 덱을 맞춥니다. 계정 없이 코드 하나로 연결합니다.</p>' +
        errorLine(),
        CLOSE + '<button type="button" class="btn" data-act="sync-join-open">코드 입력</button>' +
        '<button type="button" class="btn btn--primary" data-act="sync-create">새 코드 만들기</button>') +
      joinForm() +
      step('on', '기기 동기화',
        '<p class="reset-dialog__label">동기화 코드</p>' +
        '<div class="sync-dialog__code-row"><p class="sync-dialog__code num" data-sync-code></p>' +
        '<button type="button" class="btn" data-act="sync-copy">복사</button></div>' +
        '<p class="sync-dialog__copied" data-sync-copied role="status" hidden>복사했습니다</p>' +
        '<p class="sync-dialog__link" data-sync-link></p>' +
        '<p class="reset-dialog__text sync-dialog__status" data-sync-dialog-status></p>' +
        '<p class="reset-dialog__text">설정과 끝나지 않은 스프린트·모의고사는 각 기기에 따로 남습니다.</p>' + errorLine(),
        CLOSE + '<button type="button" class="btn btn--quiet" data-act="sync-leave">이 기기에서 동기화 끄기</button>' +
        '<button type="button" class="btn btn--primary" data-act="sync-now">지금 동기화</button>') +
      step('pair', '이 기기를 연결할까요?',
        '<p class="sync-dialog__code num" data-sync-pair-code></p>' +
        '<p class="reset-dialog__text">이 기기의 학습 기록과 복습 덱이 이 코드의 기록과 합쳐집니다.</p>' + errorLine(),
        '<button type="button" class="btn btn--quiet" data-act="sync-close">취소</button>' +
        '<button type="button" class="btn btn--primary" data-act="sync-pair-yes">연결</button>') +
      '</dialog>';
  }

  // The control, its status line, then the (closed) dialog.
  function html(st) {
    return '<div class="today-sync">' +
      '<button type="button" class="btn btn--quiet" data-act="sync-open">기기 동기화</button>' +
      '<p class="today-sync__status" data-sync-status>' + statusHtml(st) + '</p>' + dialogHtml() + '</div>';
  }

  // ── Behaviour ──

  function bind(rootEl, hooks) {
    const sync = Sync();
    let pairCode = null;
    const dlg = () => rootEl.querySelector('[data-sync-dialog]');
    const q = sel => { const d = dlg(); return d ? d.querySelector(sel) : null; };
    const current = () => { const d = dlg(); const s = d && d.querySelector('[data-step]:not([hidden])'); return s ? s.dataset.step : null; };

    function fillOn(st) {
      const code = sync.formatCode(st.code || '');
      q('[data-sync-code]').textContent = code;
      q('[data-sync-link]').textContent = st.code ? sync.pairingLink(st.code) : '';
      q('[data-sync-dialog-status]').innerHTML = statusHtml(st);
      q('[data-sync-copied]').hidden = true;
      q('[data-act="sync-now"]').disabled = !!st.busy;
    }

    function showError(stepName, kind) {
      const box = q('[data-step="' + stepName + '"] [data-sync-error]');
      if (!box) return;
      box.textContent = kind ? (ERRORS[kind] || ERRORS.other) : '';
      box.hidden = !kind;
      const input = stepName === 'join' ? q('#sync-code') : null;
      if (input) { if (kind) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid'); }
    }

    // Show one step, named by its title; focus its field or its first button.
    function setStep(name) {
      const d = dlg();
      d.querySelectorAll('[data-step]').forEach(s => { s.hidden = s.dataset.step !== name; });
      d.setAttribute('aria-labelledby', 'sync-title-' + name);
      d.querySelectorAll('[data-sync-error]').forEach(e => { e.hidden = true; });
      if (name === 'on') fillOn(sync.status());
      if (name === 'pair') q('[data-sync-pair-code]').textContent = sync.formatCode(pairCode);
      const at = '[data-step="' + name + '"] ';
      const focus = q(at + 'input, ' + at + '.reset-dialog__actions button');
      if (focus) focus.focus();
    }

    const stepFor = st => (st.state === 'unset' ? 'unset' : st.state === 'off' ? 'off' : 'on');

    function open(name) {
      const d = dlg();
      if (!d || !sync) return;
      if (!d.open) {
        if (typeof d.showModal === 'function') d.showModal();
        else d.setAttribute('open', '');
      }
      setStep(name || stepFor(sync.status()));
    }

    function setBusy(stepName, on) {
      const s = q('[data-step="' + stepName + '"]');
      if (s) s.querySelectorAll('button, input').forEach(el => { el.disabled = on; });
    }

    // Run a network action from a step; afterwards go to "on", or show the error on that step.
    async function attempt(stepName, task) {
      const d = dlg();
      setBusy(stepName, true);
      const res = await task();
      setBusy(stepName, false);
      if (dlg() !== d || !d.open) return;
      if (res.ok) setStep('on');
      else showError(stepName, res.error === 'invalid' || res.error === 'not-found' ? res.error : 'other');
    }

    function joinSubmit() {
      const input = q('#sync-code');
      const code = sync.normalizeCode(input.value);
      if (!code) { showError('join', 'invalid'); input.focus(); return; }
      attempt('join', () => sync.join(code));
    }

    function copyCode() {
      const st = sync.status();
      const done = () => { q('[data-sync-copied]').hidden = false; };
      const nav = root.navigator;
      if (st.code && nav && nav.clipboard && nav.clipboard.writeText) {
        nav.clipboard.writeText(sync.formatCode(st.code)).then(done, () => selectCode());
      } else selectCode();
    }

    // No clipboard access: select the code so it can be copied by hand.
    function selectCode() {
      const el = q('[data-sync-code]');
      const sel = root.getSelection ? root.getSelection() : null;
      if (!el || !sel || typeof document === 'undefined') return;
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    const ACTIONS = {
      'sync-open': () => open(),
      'sync-close': () => { const d = dlg(); if (d && d.open) d.close(); },
      'sync-join-open': () => setStep('join'),
      'sync-back': () => setStep('off'),
      'sync-create': () => attempt('off', () => sync.create()),
      'sync-now': () => sync.syncNow(),
      'sync-leave': () => { sync.leave(); setStep('off'); },
      'sync-copy': copyCode,
      'sync-pair-yes': () => attempt('pair', () => sync.join(pairCode))
    };

    function paint(st) {
      const line = rootEl.querySelector('[data-sync-status]');
      if (line) line.innerHTML = statusHtml(st);
      if (current() === 'on' && st.state !== 'off' && st.state !== 'unset') fillOn(st);
    }

    const onClick = e => {
      const el = e.target.closest && e.target.closest('[data-act^="sync-"]');
      if (el && ACTIONS[el.dataset.act]) ACTIONS[el.dataset.act]();
    };
    const onSubmit = e => {
      if (!e.target.closest('[data-sync-join-form]')) return;
      e.preventDefault();
      joinSubmit();
    };
    // 'close' does not bubble: listen in the capture phase.
    const onClose = e => {
      if (e.target.matches && e.target.matches('[data-sync-dialog]') && hooks && hooks.onClosed) hooks.onClosed();
    };

    rootEl.addEventListener('click', onClick);
    rootEl.addEventListener('submit', onSubmit);
    rootEl.addEventListener('close', onClose, true);
    const unsubscribe = sync ? sync.onStatus(paint) : () => {};

    // Opened from a pairing link: ask first (nothing to ask when this device already uses that code).
    const pending = sync ? sync.takePendingPair() : null;
    const st = sync ? sync.status() : null;
    if (pending && st.code !== pending) {
      pairCode = pending;
      open(st.state === 'unset' ? 'unset' : 'pair');
    }

    return () => {
      unsubscribe();
      rootEl.removeEventListener('click', onClick);
      rootEl.removeEventListener('submit', onSubmit);
      rootEl.removeEventListener('close', onClose, true);
    };
  }

  const SyncDialog = { html, bind, statusHtml, timeLabel, ERRORS };

  if (typeof window !== 'undefined') window.SyncDialog = SyncDialog;
  if (typeof module !== 'undefined') module.exports = SyncDialog;
})();
