// mock.js: full mock exam. #/mock = confirm screen · #/mock/run = the exam.
// 46 questions in exam order (withheld passages left out), one wall-clock
// 70:00 countdown with no pause, Korean only, no confidence step. The start screen is the
// hero card (46 문항 · 70분 · 92점, all computed). The run: the test bar (n / 46 풀었음 +
// countdown) and progress track, the question sheet, 이전/다음/나가기/끝내기, then the
// number palette (one tile per question; a tile jumps there). Answers can change until
// 끝내기 (or the countdown reaching 0). The run lives in the Store's sprint slot
// (mode 'mock'), so a refresh on #/mock/run resumes; 나가기 keeps it.
// Slot steps are pure (RunCore); view + finish are shared with Sprint (Runner).
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc } = Util;

  const SAVE_EVERY_MS = 10000;
  const LOW_MS = 5 * 60 * 1000;

  // { root, phase: intro|run|done, slot, lesson, finishing, advanceTimer, savedAt, readOnly }
  let view = null;
  let clock = null;
  let detach = null;

  const Store = () => window.Store;
  const Core = () => window.RunCore;
  const R = () => window.Runner;

  function el(sel) {
    return view.root.querySelector(sel);
  }

  // One active tab writes the run (Store: the last tab that claimed the role). This tab saves the
  // slot synchronously. true = saved. false = not saved, and the screen has already reacted: another
  // tab is the writer (this tab turns read-only), or it changed the run (this tab adopts the stored
  // run); the caller drops its change.
  function commit(slot) {
    let saved = slot;
    if (view.phase === 'run') {
      const res = R().persist(slot);
      if (res.status === 'inactive') { enterReadOnly(); return false; }
      if (res.status === 'stale') { adopt(res.slot); return false; }
      if (res.status === 'saved') saved = res.slot;
    }
    view = { ...view, slot: saved, savedAt: Date.now() };
    return true;
  }

  // May this tab act on the run? Only the active tab. Otherwise the screen goes read-only, and the
  // action is dropped. (Already read-only but the role is ours again: take over, then drop it.)
  function guard() {
    if (!Store().isActiveTab()) { enterReadOnly(); return false; }
    if (view.readOnly) { claimHere(); return false; }
    return true;
  }

  // Another tab is the writer: stop this tab's question clock, ignore actions, say so.
  function enterReadOnly() {
    if (!view || view.phase !== 'run' || view.readOnly) return;
    clearTimeout(view.advanceTimer);
    view = { ...view, readOnly: true, advanceTimer: null, slot: Core().mockVisibility(view.slot, false, Date.now()) };
    const box = el('[data-slot="notice"]');
    if (box) box.innerHTML = R().noticeHtml();
  }

  // Become the writer (focus, tab visible, 여기서 계속): re-read the stored run first. Newer → show
  // it; finished or replaced elsewhere → leave; same → carry on, clock running again.
  function claimHere() {
    if (!view || view.phase !== 'run') return;
    const stored = Store().getSprint();
    Store().claimTab();
    // A claim that could not be written leaves another tab named: stay read-only.
    if (!Store().isActiveTab()) { enterReadOnly(); return; }
    const out = Core().claimOutcome(view.slot, stored);
    if (out.kind === 'gone' || out.kind === 'other') { leaveRun(); return; }
    if (out.kind === 'adopt') { adopt(out.slot); return; }
    // Same revision: keep this copy, with the time the other tab saved since (never less).
    view = { ...view, slot: out.slot };
    if (!view.readOnly) return;
    view = { ...view, readOnly: false };
    el('[data-slot="notice"]').innerHTML = '';
    view = { ...view, slot: Core().mockVisibility(view.slot, !document.hidden, Date.now()) };
    tick();
  }

  // The run is no longer stored: another tab finished it (open its Review) or dropped it.
  function leaveRun() {
    const done = Store().sessionById(view.slot.id);
    clock.stop();
    view = { ...view, phase: 'done' };
    location.replace(done ? '#/review/' + done.id : '#/today');
  }

  // The question's clock runs only while the tab is visible (per-question time, not the countdown).
  function clockedAt(slot, now) {
    return document.hidden ? { ...slot, shownAt: null } : Core().mockResume(slot, now);
  }

  // Show the stored run instead of this tab's older copy.
  function adopt(stored) {
    clearTimeout(view.advanceTimer);
    const now = Date.now();
    view = { ...view, slot: stored, advanceTimer: null, readOnly: false, savedAt: now };
    if (Core().mockTimeUp(stored, now)) { finish(); return; }
    view = { ...view, slot: clockedAt(stored, now) };
    showQuestion();
  }

  // ── Confirm screen ──

  // The hero's actions (and, with a run open, the line saying so).
  function existingHtml(slot) {
    if (!slot) {
      return '<button type="button" class="btn btn--white btn--lg" data-act="start">시작</button>' +
        '<a class="btn btn--quiet" href="#/today">오늘로</a>';
    }
    const isMock = slot.mode === 'mock';
    const now = Date.now();
    const line = isMock
      ? '진행 중인 모의고사가 있습니다 · 답 <span class="num">' + Core().mockAnsweredCount(slot) + ' / ' + slot.qs.length +
        '</span> · ' + (Core().mockTimeUp(slot, now) ? '시간 종료' : '남은 시간 <span class="num">' +
        esc(Core().fmtCountdown(Core().mockRemaining(slot, now))) + '</span>')
      : '진행 중인 스프린트가 있습니다 (<span class="num">' + Math.min(slot.idx + 1, slot.qs.length) + ' / ' +
        slot.qs.length + '</span>)';
    // Whole-line English for the 한 / EN switch: word-by-word swapping dropped the "(".
    const lineEn = isMock
      ? 'A mock exam is in progress · ' + Core().mockAnsweredCount(slot) + ' / ' + slot.qs.length + ' answered · ' +
        (Core().mockTimeUp(slot, now) ? 'time is up' : Core().fmtCountdown(Core().mockRemaining(slot, now)) + ' left')
      : 'A sprint is in progress (' + Math.min(slot.idx + 1, slot.qs.length) + ' / ' + slot.qs.length + ')';
    const resume = isMock
      ? '<a class="btn btn--white btn--lg" href="#/mock/run">이어서</a>'
      : '<a class="btn btn--white btn--lg" href="#/sprint">스프린트 이어서</a>';
    return '<p class="hero__ask" data-ui-en="' + esc(lineEn) + '">' + line + '</p>' + resume +
      '<button type="button" class="btn btn--quiet" data-act="start">새로 시작</button>';
  }

  function chipHtml(n, unit) {
    return '<li class="hero-chip"><span class="hero-chip__n num">' + n + '</span>' +
      '<span class="hero-chip__label">' + unit + '</span></li>';
  }

  // Real numbers: the questions in this mock, its 70 minutes, and its maximum score
  // (each question's points from its group instruction, 2 each: 46 x 2 = 92).
  function introHtml(slot) {
    const qs = Core().mockQuestions(Util.data().lessons);
    const maxPts = qs.reduce((s, q) => s + window.Tiles.points(Util.lesson(q)), 0);
    const minutes = Math.round(window.PACE.EXAM_TOTAL_SEC / 60);
    return '<section class="hero mock-hero" aria-labelledby="mock-h1">' +
      '<p class="hero__fact">TOPIK II 읽기 · 102회</p>' +
      '<h1 class="hero__title" id="mock-h1">모의고사</h1>' +
      '<p class="hero__sub">시험 순서 · 멈춤 없음</p>' +
      '<ul class="hero__chips">' + chipHtml(qs.length, '문항') + chipHtml(minutes, '분') + chipHtml(maxPts, '점') + '</ul>' +
      '<div class="hero__actions" data-slot="mock-actions">' + existingHtml(slot) + '</div></section>';
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
    return '<p class="hero__ask" role="status">진행 중인 답은 기록되지 않고 사라집니다. 버리고 새로 시작할까요?</p>' +
      '<button type="button" class="btn btn--white" data-act="discard-yes">버리고 새로 시작</button>' +
      '<button type="button" class="btn btn--quiet" data-act="discard-no">취소</button>';
  }

  // 새로 시작 over a running sprint/mock needs a second click; a 70-minute run must not vanish on a slip.
  function onIntroClick(e) {
    const act = e.target.closest('[data-act]');
    if (!act || !view) return;
    const box = view.root.querySelector('[data-slot="mock-actions"]');
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

  // Test bar: 모의고사, n / 46 풀었음, the 70:00 countdown chip (amber in the last 5 minutes).
  function headHtml(slot) {
    const clock = '<p class="timer num" data-field="countdown" role="timer" aria-label="남은 시간">' +
      esc(Core().fmtCountdown(Core().mockRemaining(slot, Date.now()))) + '</p>';
    return R().runHead({ title: '모의고사', done: Core().mockAnsweredCount(slot), total: slot.qs.length, clockHtml: clock });
  }

  // The number palette: one tile per question, tinted once answered; a tile jumps there.
  function paletteHtml(slot) {
    const items = Core().mockPalette(slot).map(p => window.Tiles.tile({
      n: p.q, state: p.answered ? 'answered' : 'untried', tag: 'button',
      attrs: ' type="button" data-pos="' + p.pos + '"' + (p.current ? ' aria-current="step"' : '') +
        ' aria-label="' + p.q + '번' + (p.answered ? ', 답함' : '') + '"'
    }));
    return '<nav class="sheet palette" aria-label="문항 번호판">' +
      window.Tiles.list({ items, cls: 'palette__tiles' }) + '</nav>';
  }

  function footHtml(slot) {
    const last = slot.idx === slot.qs.length - 1;
    return '<div class="mock__foot">' +
      '<button type="button" class="btn" data-act="prev"' + (slot.idx === 0 ? ' disabled' : '') + '>이전</button>' +
      '<button type="button" class="btn" data-act="next"' + (last ? ' disabled' : '') + '>다음</button>' +
      '<span class="mock__spacer"></span>' +
      '<button type="button" class="btn btn--quiet" data-act="leave">나가기</button>' +
      '<button type="button" class="btn btn--primary" data-act="finish">끝내기</button></div>' +
      '<div data-slot="finish"></div>';
  }

  function finishTextHtml(slot) {
    const left = slot.qs.length - Core().mockAnsweredCount(slot);
    return (left ? '미응답 <span class="num">' + left + '</span>문항. ' : '') + '지금 끝내고 채점할까요?';
  }

  function finishBarHtml(slot) {
    return '<div class="pause-bar" role="group" aria-label="모의고사 끝내기">' +
      '<p class="pause-bar__text">' + finishTextHtml(slot) + '</p>' +
      '<button type="button" class="btn btn--primary" data-act="finish-yes">끝내고 채점</button>' +
      '<button type="button" class="btn" data-act="finish-no">계속 풀기</button></div>';
  }

  function runHtml(slot, lesson) {
    return '<article class="sprint sprint--mock" tabindex="-1" aria-label="모의고사 ' + slot.qs[slot.idx] + '번">' +
      headHtml(slot) + '<div data-slot="notice"></div>' + R().bodyHtml(lesson, { glossOn: R().glossOn() }) +
      footHtml(slot) + paletteHtml(slot) + '</article>';
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
    R().setTrack(view.root, slot.id, Core().mockAnsweredCount(slot) / slot.qs.length);
    const a = slot.answers[slot.idx];
    if (a) R().markChoices(view.root, a.chosen, false);
    window.scrollTo(0, 0);
    el('.sprint').focus({ preventScroll: true });
  }

  function refreshPalette() {
    const nav = el('.palette');
    if (nav) nav.outerHTML = paletteHtml(view.slot);
    R().setCount(view.root, view.slot.id, Core().mockAnsweredCount(view.slot), view.slot.qs.length);
  }

  // ── Run: flow ──

  function tick() {
    if (!view || view.phase !== 'run') return;
    const now = Date.now();
    if (Core().mockTimeUp(view.slot, now)) {
      if (view.readOnly) drawClock(now); else finish();   // only the active tab finishes the run
      return;
    }
    if (view.readOnly) { drawClock(now); return; }
    // The question's clock follows the tab, even if a visibility event was missed.
    const clocked = Core().mockVisibility(view.slot, !document.hidden, now);
    if (clocked !== view.slot) view = { ...view, slot: clocked };
    drawClock(now);
    if (now - view.savedAt >= SAVE_EVERY_MS) commit(Core().mockFold(view.slot, now));
  }

  function go(pos) {
    if (!view || view.phase !== 'run') return;
    clearTimeout(view.advanceTimer);
    if (!guard()) return;
    const next = Core().mockJump(view.slot, pos, Date.now());
    if (next === view.slot) return;
    if (!commit(next)) return;
    showQuestion();
  }

  function choose(n) {
    if (!view || view.phase !== 'run' || !R().isChoice(view.lesson, n)) return;
    const now = Date.now();
    if (Core().mockTimeUp(view.slot, now)) { if (!view.readOnly) finish(); return; }
    if (!guard()) return;
    const next = Core().mockAnswer(view.slot, n, view.lesson, now);
    if (next === view.slot) return;
    if (!commit(next)) return;
    R().markChoices(view.root, n, false);
    refreshPalette();
    clearTimeout(view.advanceTimer);
    // Changing an answer while the 끝내기 prompt is open must not carry the sheet to the next
    // question and take the prompt away: stay put, and keep the prompt's count current.
    if (view.finishing) { el('.pause-bar__text').innerHTML = finishTextHtml(view.slot); return; }
    const to = Core().mockNext(view.slot);
    if (to === null) { el('[data-act="finish"]').focus({ preventScroll: true }); return; }
    view = { ...view, advanceTimer: setTimeout(() => go(to), R().advanceDelay()) };
  }

  function openFinish() {
    if (!guard()) return;
    // A pick just made is still handing over to the next question: that would replace the
    // sheet and remove this prompt. Stay on this question until the prompt is answered.
    clearTimeout(view.advanceTimer);
    view = { ...view, finishing: true, advanceTimer: null };
    el('[data-slot="finish"]').innerHTML = finishBarHtml(view.slot);
    el('[data-act="finish-yes"]').focus();
  }

  function closeFinish() {
    view = { ...view, finishing: false };
    el('[data-slot="finish"]').innerHTML = '';
    el('[data-act="finish"]').focus({ preventScroll: true });
  }

  // Only the active tab finishes the run, and it finishes the STORED run (this tab's clock folded in).
  function finish() {
    if (!view || view.phase !== 'run' || !guard()) return;
    const now = Date.now();
    clock.stop();
    clearTimeout(view.advanceTimer);
    const slot = Core().mockFinalSlot(Store().getSprint(), Core().mockSuspend(view.slot, now));
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
    const claim = e.target.closest('[data-act="claim"]');
    if (claim) { claimHere(); return; }
    const choice = e.target.closest('button[data-choice]');
    if (choice) { choose(Number(choice.dataset.choice)); return; }
    const pal = e.target.closest('button[data-pos]');
    if (pal) { go(Number(pal.dataset.pos)); return; }
    const act = e.target.closest('[data-act]');
    if (act && ACTIONS[act.dataset.act]) ACTIONS[act.dataset.act]();
  }

  // The tab goes to the background (or the page is left): the active tab folds the open question's
  // time and saves it, so a reload keeps it. A read-only tab only keeps it in memory.
  function suspendClock() {
    const slot = Core().mockVisibility(view.slot, false, Date.now());
    if (view.readOnly) view = { ...view, slot }; else commit(slot);
  }

  // No pause: the 70-minute countdown is wall clock and keeps running while the tab is hidden.
  // The open question's own clock stops (hidden time is not charged to it) and starts again on return.
  // On return the tab claims the writer role: it re-reads the stored run and shows it if another tab
  // moved on, before anything on screen can be clicked.
  function onVisibility() {
    if (!view || view.phase !== 'run') return;
    if (document.hidden) { suspendClock(); return; }
    claimHere();
    if (!view || view.phase !== 'run' || view.readOnly) return;
    view = { ...view, slot: Core().mockVisibility(view.slot, true, Date.now()) };
    tick();
  }

  function onPageHide() {
    if (view && view.phase === 'run') suspendClock();
  }

  function onFocus() {
    if (view && view.phase === 'run') claimHere();
  }

  // Another tab wrote the active-tab key: if it is not this tab any more, go read-only.
  function onStorage(e) {
    if (!view || view.phase !== 'run') return;
    if (e.key === null || e.key === Store().ACTIVE_KEY) {
      if (!Store().isActiveTab()) enterReadOnly();
    }
  }

  function onGloss(e) {
    if (view && view.phase === 'run' && view.lesson) R().refreshPassage(view.root, view.lesson, e.detail.on);
  }

  function run(root, stored) {
    const now = Date.now();
    view = {
      root, phase: 'run', slot: clockedAt(stored, now), finishing: false, advanceTimer: null, savedAt: now,
      readOnly: false
    };
    clock = R().ticker(tick);
    detach = R().listen(root, {
      click: onClick, visibility: onVisibility, pagehide: onPageHide, focus: onFocus, storage: onStorage,
      gloss: onGloss
    });
    showQuestion();
    // Not the writer (another tab claimed since this page loaded): look, do not touch.
    if (!Store().isActiveTab()) enterReadOnly();
    else commit(view.slot);
    clock.start();    // the first tick also finishes a mock whose time ran out
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
    // Leaving: the active tab saves the clock; a refusal (another tab is the writer, or changed the
    // run) leaves the stored run alone, and nothing is redrawn.
    if (view.phase === 'run' && !view.readOnly) R().persist(Core().mockSuspend(view.slot, Date.now()));
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
