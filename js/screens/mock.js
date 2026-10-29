// mock.js: full mock exam. #/mock = confirm screen · #/mock/run = the exam.
// 46 questions in exam order (withheld passages left out), one wall-clock
// 70:00 countdown with no pause, Korean only, no confidence step. A palette
// of numbered dots jumps between questions; answers can change until 끝내기
// (or the countdown reaching 0). The answer strip at the bottom shows the current
// 묶음 as answer-card rows (tap a row to jump). The run lives in the Store's sprint slot
// (mode 'mock'), so a refresh on #/mock/run resumes; 나가기 keeps it.
// Slot steps are pure (RunCore); view + finish are shared with Sprint (Runner).
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc } = Util;

  const SAVE_EVERY_MS = 10000;
  const LOW_MS = 5 * 60 * 1000;

  // { root, phase: intro|run|done, slot, lesson, finishing, advanceTimer, savedAt }
  let view = null;
  let clock = null;
  let detach = null;

  const Store = () => window.Store;
  const Core = () => window.RunCore;
  const R = () => window.Runner;

  function el(sel) {
    return view.root.querySelector(sel);
  }

  function commit(slot) {
    view = { ...view, slot, savedAt: Date.now() };
    if (view.phase === 'run') R().persist(slot);
  }

  // ── Confirm screen ──

  function existingHtml(slot) {
    if (!slot) {
      return '<div class="set-card__actions"><button type="button" class="btn btn--primary btn--lg" data-act="start">시작</button>' +
        '<a class="btn" href="#/today">오늘로</a></div>';
    }
    const isMock = slot.mode === 'mock';
    const now = Date.now();
    const line = isMock
      ? '진행 중인 모의고사가 있습니다 · 답 <span class="num">' + Core().mockAnsweredCount(slot) + ' / ' + slot.qs.length +
        '</span> · ' + (Core().mockTimeUp(slot, now) ? '시간 종료' : '남은 시간 <span class="num">' +
        esc(Core().fmtCountdown(Core().mockRemaining(slot, now))) + '</span>')
      : '진행 중인 스프린트가 있습니다 (<span class="num">' + Math.min(slot.idx + 1, slot.qs.length) + ' / ' +
        slot.qs.length + '</span>). 새로 시작하면 그 스프린트는 버려집니다.';
    const resume = isMock
      ? '<a class="btn btn--primary btn--lg" href="#/mock/run">이어서</a>'
      : '<a class="btn btn--lg" href="#/sprint">스프린트 이어서</a>';
    return '<p class="set-card__line">' + line + '</p><div class="set-card__actions">' + resume +
      '<button type="button" class="btn' + (isMock ? '' : ' btn--primary') + '" data-act="start">새로 시작</button></div>';
  }

  function introHtml(slot) {
    const n = Core().mockQuestions(Util.data().lessons).length;
    return '<section class="mock-intro">' +
      '<header class="screen-head"><p class="eyebrow">실전 연습 · 시험 순서</p>' +
      '<h1 class="screen-title">모의고사 · <span class="num">' + n + '</span>문항 · <span class="num">70:00</span></h1>' +
      '<p class="screen-sub">멈춤 없음 · 나가도 시간은 계속 갑니다 · 나가기는 답한 문항을 저장합니다</p></header>' +
      '<ul class="mock-intro__rules">' +
      '<li>한국어만 · 확실/애매 표시 없음 · 채점은 끝낸 뒤에</li>' +
      '<li>번호판이나 <kbd>←</kbd> <kbd>→</kbd>로 이동하고, 끝내기 전까지 답을 바꿀 수 있습니다</li>' +
      '<li>시간이 <span class="num">00:00</span>이 되면 자동으로 끝나고 채점합니다</li></ul>' +
      '<p class="mock-intro__note">※ 23·24·42·43번은 원문 비공개로 제외</p>' +
      '<section class="set-card" aria-label="모의고사 시작">' + existingHtml(slot) + '</section></section>';
  }

  function startNew() {
    const qs = Core().mockQuestions(Util.data().lessons);
    Store().setSprint(Core().mockCreate(qs, Date.now()));
    location.hash = '#/mock/run';
  }

  function intro(root) {
    view = { root, phase: 'intro' };
    root.innerHTML = introHtml(Store().getSprint());
    detach = R().listen(root, { click: onIntroClick });
  }

  function discardAskHtml() {
    return '<p class="set-card__ask" role="status">진행 중인 답은 기록되지 않고 사라집니다. 버리고 새로 시작할까요?</p>' +
      '<button type="button" class="btn" data-act="discard-yes">버리고 새로 시작</button>' +
      '<button type="button" class="btn btn--quiet" data-act="discard-no">취소</button>';
  }

  // 새로 시작 over a running sprint/mock needs a second click; a 70-minute run must not vanish on a slip.
  function onIntroClick(e) {
    const act = e.target.closest('[data-act]');
    if (!act || !view) return;
    const box = view.root.querySelector('.set-card');
    const action = act.dataset.act;
    if (action === 'start') {
      if (!Store().getSprint()) { startNew(); return; }
      if (box) box.innerHTML = discardAskHtml();
    } else if (action === 'discard-yes') {
      startNew();
    } else if (action === 'discard-no' && box) {
      box.innerHTML = existingHtml(Store().getSprint());
    }
  }

  // ── Run: rendering ──

  function headHtml(slot, lesson) {
    return '<header class="sprint__head">' +
      '<p class="sprint__count">모의고사 <span class="num">' + (slot.idx + 1) + ' / ' + slot.qs.length + '</span> · ' +
      '<span class="num">' + slot.qs[slot.idx] + '</span>번 · ' + esc(lesson.section) + ' 묶음</p>' +
      '<p class="mock__clock num" data-field="countdown" role="timer" aria-label="남은 시간">' +
      esc(Core().fmtCountdown(Core().mockRemaining(slot, Date.now()))) + '</p></header>';
  }

  function paletteHtml(slot) {
    const dots = Core().mockPalette(slot).map(p =>
      '<li><button type="button" class="pal' + (p.answered ? ' is-answered' : '') + (p.current ? ' is-current' : '') +
      '" data-pos="' + p.pos + '"' + (p.current ? ' aria-current="step"' : '') +
      ' aria-label="' + p.q + '번' + (p.answered ? ', 답함' : '') + '"><span class="ov" aria-hidden="true">' + p.q +
      '</span></button></li>').join('');
    return '<nav class="palette" aria-label="문항 번호판"><ol class="palette__list">' + dots + '</ol>' +
      '<p class="palette__count">답 <span class="num">' + Core().mockAnsweredCount(slot) + ' / ' +
      slot.qs.length + '</span></p></nav>';
  }

  function footHtml(slot) {
    const last = slot.idx === slot.qs.length - 1;
    return '<div class="mock__foot">' +
      '<button type="button" class="btn" data-act="prev"' + (slot.idx === 0 ? ' disabled' : '') + '>← 이전</button>' +
      '<button type="button" class="btn" data-act="next"' + (last ? ' disabled' : '') + '>다음 →</button>' +
      '<span class="mock__spacer"></span>' +
      '<button type="button" class="btn btn--quiet" data-act="leave">나가기</button>' +
      '<button type="button" class="btn btn--primary" data-act="finish">끝내기</button></div>' +
      '<div data-slot="finish"></div>';
  }

  function finishBarHtml(slot) {
    const left = slot.qs.length - Core().mockAnsweredCount(slot);
    return '<div class="pause-bar" role="group" aria-label="모의고사 끝내기">' +
      '<p class="pause-bar__text">' + (left ? '미응답 <span class="num">' + left + '</span>문항. ' : '') +
      '지금 끝내고 채점할까요?</p>' +
      '<button type="button" class="btn btn--primary" data-act="finish-yes">끝내고 채점</button>' +
      '<button type="button" class="btn" data-act="finish-no">계속 풀기</button></div>';
  }

  const KEYS_HTML = '<span><kbd>1</kbd>–<kbd>4</kbd> 선택</span><span><kbd>←</kbd><kbd>→</kbd> 이동</span>' +
    '<span><kbd>G</kbd> 주석</span><span><kbd>T</kbd> 번역</span><span><kbd>Tab</kbd> 문장</span><span><kbd>←</kbd><kbd>→</kbd> 단어</span>';

  // The current 묶음's questions in this mock, one answer-card row each.
  function stripHtml(slot) {
    const id = Util.lesson(slot.qs[slot.idx]).section;
    const sec = Util.section(id);
    const rows = slot.qs.map((q, pos) => ({ q, pos }))
      .filter(r => Util.lesson(r.q).section === id)
      .map(r => ({ q: r.q, pos: r.pos, current: r.pos === slot.idx, chosen: slot.answers[r.pos] ? slot.answers[r.pos].chosen : null }));
    const range = sec ? ' · ' + sec.range[0] + ' ~ ' + sec.range[1] + '번' : '';
    return R().answerStrip({ label: id + ' 묶음' + range, rows, keys: KEYS_HTML });
  }

  function runHtml(slot, lesson) {
    return '<article class="sprint sprint--mock" tabindex="-1" aria-label="모의고사 ' + slot.qs[slot.idx] + '번">' +
      headHtml(slot, lesson) + paletteHtml(slot) + R().bodyHtml(lesson, { glossOn: R().glossOn() }) +
      footHtml(slot) + stripHtml(slot) +
      '</article>';
  }

  function drawClock(now) {
    const ms = Core().mockRemaining(view.slot, now);
    const c = el('[data-field="countdown"]');
    c.textContent = Core().fmtCountdown(ms);
    c.classList.toggle('is-low', ms <= LOW_MS);
  }

  function showQuestion() {
    const slot = view.slot;
    const lesson = Util.lesson(slot.qs[slot.idx]);
    view = { ...view, lesson, finishing: false };
    view.root.innerHTML = runHtml(slot, lesson);
    const a = slot.answers[slot.idx];
    if (a) R().markChoices(view.root, a.chosen, false);
    window.scrollTo(0, 0);
    el('.sprint').focus({ preventScroll: true });
  }

  function refreshPalette() {
    const nav = el('.palette');
    if (nav) nav.outerHTML = paletteHtml(view.slot);
    const dock = el('.omr-dock');
    if (dock) dock.outerHTML = stripHtml(view.slot);
  }

  // ── Run: flow ──

  function tick() {
    if (!view || view.phase !== 'run') return;
    const now = Date.now();
    if (Core().mockTimeUp(view.slot, now)) { finish(); return; }
    drawClock(now);
    if (now - view.savedAt >= SAVE_EVERY_MS) commit(Core().mockFold(view.slot, now));
  }

  function go(pos) {
    if (!view || view.phase !== 'run') return;
    clearTimeout(view.advanceTimer);
    const next = Core().mockJump(view.slot, pos, Date.now());
    if (next === view.slot) return;
    commit(next);
    showQuestion();
  }

  function choose(n) {
    if (!view || view.phase !== 'run' || !R().isChoice(view.lesson, n)) return;
    const now = Date.now();
    if (Core().mockTimeUp(view.slot, now)) { finish(); return; }
    const next = Core().mockAnswer(view.slot, n, view.lesson, now);
    if (next === view.slot) return;
    commit(next);
    R().markChoices(view.root, n, false);
    refreshPalette();
    clearTimeout(view.advanceTimer);
    const to = Core().mockNext(view.slot);
    if (to === null) { el('[data-act="finish"]').focus({ preventScroll: true }); return; }
    view = { ...view, advanceTimer: setTimeout(() => go(to), R().advanceDelay()) };
  }

  function openFinish() {
    view = { ...view, finishing: true };
    el('[data-slot="finish"]').innerHTML = finishBarHtml(view.slot);
    el('[data-act="finish-yes"]').focus();
  }

  function closeFinish() {
    view = { ...view, finishing: false };
    el('[data-slot="finish"]').innerHTML = '';
    el('[data-act="finish"]').focus({ preventScroll: true });
  }

  function finish() {
    if (!view || view.phase !== 'run') return;
    const now = Date.now();
    clock.stop();
    clearTimeout(view.advanceTimer);
    const slot = Core().mockSuspend(view.slot, now);
    view = { ...view, slot, phase: 'done' };
    R().finish({
      id: slot.id, mode: 'mock', qs: slot.qs, answers: Core().mockResults(slot), total: slot.qs.length,
      durationMs: Math.min(now, slot.deadline) - slot.startedAt, at: new Date(now).toISOString()
    });
  }

  const ACTIONS = {
    prev: () => go(view.slot.idx - 1),
    next: () => go(view.slot.idx + 1),
    leave: () => { location.hash = '#/today'; },
    finish: openFinish,
    'finish-yes': finish,
    'finish-no': closeFinish
  };

  function onClick(e) {
    if (!view || view.phase !== 'run') return;
    const choice = e.target.closest('button[data-choice]');
    if (choice) { choose(Number(choice.dataset.choice)); return; }
    const pal = e.target.closest('button[data-pos]');
    if (pal) { go(Number(pal.dataset.pos)); return; }
    const act = e.target.closest('[data-act]');
    if (act && ACTIONS[act.dataset.act]) ACTIONS[act.dataset.act]();
  }

  // No pause: hiding the tab only saves; the countdown keeps running.
  function onVisibility() {
    if (!view || view.phase !== 'run') return;
    if (document.hidden) commit(Core().mockFold(view.slot, Date.now()));
    else tick();
  }

  function onPageHide() {
    if (view && view.phase === 'run') commit(Core().mockFold(view.slot, Date.now()));
  }

  function onGloss(e) {
    if (view && view.phase === 'run' && view.lesson) R().refreshPassage(view.root, view.lesson, e.detail.on);
  }

  function run(root, stored) {
    const now = Date.now();
    view = { root, phase: 'run', slot: Core().mockResume(stored, now), finishing: false, advanceTimer: null, savedAt: now };
    clock = R().ticker(tick);
    if (Core().mockTimeUp(view.slot, now)) { finish(); return; }
    commit(view.slot);
    detach = R().listen(root, { click: onClick, visibility: onVisibility, pagehide: onPageHide, gloss: onGloss });
    showQuestion();
    clock.start();
  }

  // ── Screen API ──

  function mount(root, params) {
    const stored = Store().getSprint();
    const wantsRun = !!params && params.arg === 'run';
    if (wantsRun && stored && stored.mode === 'mock') { run(root, stored); return; }
    if (wantsRun) { view = null; location.replace('#/mock'); return; }
    intro(root);
  }

  function unmount() {
    if (!view) return;
    if (view.phase === 'run') commit(Core().mockSuspend(view.slot, Date.now()));
    if (clock) clock.stop();
    clearTimeout(view.advanceTimer);
    if (detach) detach();
    clock = null;
    detach = null;
    view = null;
  }

  function onKey(e) {
    if (!view) return false;
    if (view.phase === 'intro') {
      if (e.key === 'Escape') { location.hash = '#/today'; return true; }
      return false;
    }
    if (view.phase !== 'run') return false;
    if (e.key === 'Escape' && view.finishing) { closeFinish(); return true; }
    const n = R().digit(e);
    if (n) { choose(n); return true; }
    if (e.key === 'ArrowLeft') { go(view.slot.idx - 1); return true; }
    if (e.key === 'ArrowRight') { go(view.slot.idx + 1); return true; }
    return false;
  }

  const MockScreen = { title: '모의고사', mount, unmount, onKey };

  if (typeof window !== 'undefined') window.MockScreen = MockScreen;
  if (typeof module !== 'undefined') module.exports = MockScreen;
})();
