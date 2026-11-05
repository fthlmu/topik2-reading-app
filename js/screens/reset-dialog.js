// reset-dialog.js: the "기록 초기화" (Reset progress) control at the bottom of the Today screen and the
// dialog behind it. A native <dialog> opened with showModal(): Escape closes it, focus moves in and
// returns to the button, aria-labelledby names the visible step. Two steps in the same dialog:
//   1. confirm: what will be deleted, 취소 / 계속
//   2. PIN: a 6-digit password field, 취소 / 초기화; Enter submits. A wrong PIN shows an inline error,
//      clears and refocuses the field, and deletes nothing. The right PIN (ResetFlow.pinOk) resets
//      (ResetFlow.resetAll), closes the dialog and hands control back to the screen (onDone).
// The markup lives inside the screen root, so the 한 / EN switch translates it. Today routes the
// clicks (data-act) and the form submit here; this file keeps no state except the open dialog itself.
(function () {
  'use strict';

  const Flow = () => window.ResetFlow;

  // The centered "done" pop-up shown after a reset (Fathul, 2026-10-31): a blue badge pops in and a
  // white check draws itself, then the message and 확인. Escape or 확인 closes it.
  function doneHtml() {
    return '<dialog class="reset-dialog reset-done" data-reset-done aria-labelledby="reset-done-title">' +
      '<div class="reset-done__badge" aria-hidden="true"><svg viewBox="0 0 32 32" width="32" height="32" focusable="false">' +
      '<path class="reset-done__tick" d="M8 16.5l5.5 5.5L24 11" fill="none" stroke="#FFFFFF" stroke-width="3.2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
      '<h2 class="reset-dialog__title reset-done__title" id="reset-done-title">기록을 초기화했습니다</h2>' +
      '<p class="reset-dialog__text reset-done__text">진도, 기록, 복습 덱이 모두 비었습니다.</p>' +
      '<div class="reset-dialog__actions reset-done__actions">' +
      '<button type="button" class="btn btn--primary" data-act="reset-done-close" data-ui-en="OK">확인</button></div>' +
      '</dialog>';
  }

  // The control, then the (closed) confirm + PIN dialog and the (closed) done pop-up.
  function html() {
    return '<div class="today-reset">' +
      '<button type="button" class="btn btn--quiet" data-act="reset-open">기록 초기화</button>' +
      '<dialog class="reset-dialog" data-reset-dialog aria-labelledby="reset-title-confirm">' +
      '<div class="reset-dialog__step" data-step="confirm">' +
      '<h2 class="reset-dialog__title" id="reset-title-confirm">공부 기록을 모두 지울까요?</h2>' +
      '<p class="reset-dialog__text">푼 문제, 스프린트와 모의고사 기록, 복습 덱이 모두 지워집니다. 되돌릴 수 없습니다.</p>' +
      '<div class="reset-dialog__actions">' +
      '<button type="button" class="btn btn--quiet" data-act="reset-cancel" autofocus>취소</button>' +
      '<button type="button" class="btn btn--primary" data-act="reset-next">계속</button></div></div>' +
      '<form class="reset-dialog__step" data-step="pin" data-reset-form autocomplete="off" novalidate hidden>' +
      '<h2 class="reset-dialog__title" id="reset-title-pin">PIN 입력</h2>' +
      '<label class="reset-dialog__label" for="reset-pin">PIN 6자리</label>' +
      '<input class="reset-dialog__input" id="reset-pin" type="password" inputmode="numeric" autocomplete="off" ' +
      'maxlength="' + Flow().PIN_LENGTH + '" spellcheck="false" aria-describedby="reset-pin-error">' +
      '<p class="reset-dialog__error" id="reset-pin-error" role="alert" hidden>PIN이 맞지 않습니다.</p>' +
      '<div class="reset-dialog__actions">' +
      '<button type="button" class="btn btn--quiet" data-act="reset-cancel">취소</button>' +
      '<button type="submit" class="btn btn--danger">초기화</button></div></form>' +
      '</dialog>' + doneHtml() + '</div>';
  }

  function dialogOf(root) {
    return root.querySelector('[data-reset-dialog]');
  }

  function pinOf(dlg) {
    return dlg.querySelector('#reset-pin');
  }

  // Show one step: the others are hidden, and the dialog is named by the visible step's title.
  function setStep(dlg, step) {
    dlg.querySelectorAll('[data-step]').forEach(s => { s.hidden = s.dataset.step !== step; });
    dlg.setAttribute('aria-labelledby', 'reset-title-' + step);
  }

  function clearPin(dlg) {
    const input = pinOf(dlg);
    input.value = '';
    input.removeAttribute('aria-invalid');
    dlg.querySelector('#reset-pin-error').hidden = true;
  }

  // Back to step 1 with an empty field, whichever way the dialog was closed (Escape, 취소, reset).
  function reset(dlg) {
    clearPin(dlg);
    setStep(dlg, 'confirm');
  }

  function open(root) {
    const dlg = dialogOf(root);
    if (!dlg || dlg.open) return;
    reset(dlg);
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    const first = dlg.querySelector('[data-step="confirm"] [data-act="reset-cancel"]');
    if (first) first.focus();
  }

  function cancel(root) {
    const dlg = dialogOf(root);
    if (dlg && dlg.open) dlg.close();
  }

  function next(root) {
    const dlg = dialogOf(root);
    if (!dlg) return;
    clearPin(dlg);
    setStep(dlg, 'pin');
    pinOf(dlg).focus();
  }

  // The form was submitted (the 초기화 button or Enter). True when the right PIN was given and the
  // progress is deleted; the screen then redraws.
  function submit(root, deps) {
    const dlg = dialogOf(root);
    if (!dlg) return false;
    const input = pinOf(dlg);
    if (!Flow().pinOk(input.value)) {
      input.value = '';
      input.setAttribute('aria-invalid', 'true');
      dlg.querySelector('#reset-pin-error').hidden = false;
      input.focus();
      return false;
    }
    Flow().resetAll(deps);
    reset(dlg);
    dlg.close();
    return true;
  }

  // Native close (Escape, close() above): leave the dialog ready for its next opening.
  function onClose(root) {
    const dlg = dialogOf(root);
    if (dlg) reset(dlg);
  }

  // After a reset: open the centered done pop-up. showModal() remembers the focused control (the 기록
  // 초기화 button, focused by the caller first) and returns focus to it when the pop-up closes.
  function showDone(root) {
    const dlg = root.querySelector('[data-reset-done]');
    if (!dlg || dlg.open) return;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    const ok = dlg.querySelector('[data-act="reset-done-close"]');
    if (ok) ok.focus();
  }

  function closeDone(root) {
    const dlg = root.querySelector('[data-reset-done]');
    if (dlg && dlg.open) dlg.close();
  }

  const ResetDialog = { html, open, cancel, next, submit, onClose, showDone, closeDone };

  if (typeof window !== 'undefined') window.ResetDialog = ResetDialog;
  if (typeof module !== 'undefined') module.exports = ResetDialog;
})();
