// today.js: home (#/today). The hero card is the focal point: the date and exam date,
// the exam countdown as the H1, today's set line, today's questions as numbered tiles
// (untried to start, tinted as you go while a sprint is open, graded once done), meta
// chips with real numbers (progress, accuracy, streak), then 시작 / 덱만 보기. Beside it a
// white sheet with the deck, the last session and weak sections; below, the 50-question
// palette (MapScreen.html({ compact: true })). At the very bottom, a quiet 기록 초기화 control opens a
// confirm + PIN dialog (js/screens/reset-dialog.js) that deletes all progress.
// context() gathers data; each *Part renders one block from it. The freshly
// picked set is kept in `pick` so 시작 starts exactly the questions the time
// estimate was made for. With cards due, 시작 runs the deck first
// (#/deck/then-sprint), which then opens the sprint.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, EXAM_DATE, daysUntil, formatDateKr, toISODate, section, splitSectionLabel, total } = Util;

  const SET_SIZE = 5;
  const CARD_SEC = 15;
  const MAX_SET_TILES = 10;

  let view = null; // { root, pick: number[] }

  const T = () => window.Tiles;

  // The H1 (Korean) and its English for the line layer and the EN switch.
  function countdownHtml(days) {
    if (days > 0) {
      const en = days + (days === 1 ? ' day' : ' days') + ' until the exam';
      return '<h1 class="hero__title" id="today-h1" data-ui-en="' + en + '" data-line-en="' + en + '">' +
        '시험까지 <span class="num">' + days + '</span>일</h1>';
    }
    return '<h1 class="hero__title" id="today-h1">' + (days === 0 ? '오늘 시험' : '시험 끝') + '</h1>';
  }

  // A streak counts only while its last day is today or yesterday.
  function activeStreak(streak, now) {
    if (!streak || !streak.last) return 0;
    const gap = -daysUntil(streak.last, now);
    return gap === 0 || gap === 1 ? streak.count : 0;
  }

  function dayLabel(iso, now) {
    const gap = -daysUntil(toISODate(new Date(iso)), now);
    if (gap <= 0) return '오늘';
    if (gap === 1) return '어제';
    return gap + '일 전';
  }

  function sectionText(id) {
    const sec = section(id);
    return sec ? splitSectionLabel(sec.label).text : '';
  }

  // The date's English ("Thursday, October 29, 2026"), built here, never printed in Korean mode.
  function dateEn(now) {
    try {
      return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (err) {
      return toISODate(now);
    }
  }

  // ── Hero ──

  function factLine(ctx) {
    const en = esc(dateEn(ctx.now));
    return '<p class="hero__fact"><span data-line-en="' + en + '" data-ui-en="' + en + '">' +
      esc(formatDateKr(ctx.now)) + '</span> · 시험일 <span class="num">' + esc(EXAM_DATE) + '</span></p>';
  }

  // Labelled so the numbers read as question numbers (Fathul asked, 2026-10-29).
  function setTiles(qs, states) {
    if (!qs.length || qs.length > MAX_SET_TILES) return '';
    return '<p class="hero__label">오늘의 문제</p>' +
      T().list({ items: qs.map((q, i) => T().tile({ n: q, state: states[i] })), cls: 'hero__set', attrs: ' aria-hidden="true"' });
  }

  function setLine(ctx, lead) {
    const deck = ctx.due ? ' · 복습 <span class="num">' + ctx.due + '</span>장' : '';
    return '<p class="hero__sub">' + lead + deck + ' · 스프린트 <span class="num">' + ctx.pick.length +
      '</span>문제 · 약 <span class="num">' + ctx.minutes + '</span>분</p>';
  }

  function resumeLine(slot) {
    if (slot.mode !== 'mock') return '진행 중인 스프린트가 있습니다.';
    const C = window.RunCore;
    const now = Date.now();
    const time = C.mockTimeUp(slot, now)
      ? '시간 종료 · 채점만 남았습니다'
      : '남은 시간 <span class="num">' + esc(C.fmtCountdown(C.mockRemaining(slot, now))) + '</span>';
    return '진행 중인 모의고사가 있습니다 · ' + time + '.';
  }

  // Open sprint: answered (or picked, waiting for 확실/애매) questions are tinted.
  function resumeStates(slot) {
    return slot.qs.map((_, i) => (i < slot.answers.length || (i === slot.idx && slot.pending) ? 'answered' : 'untried'));
  }

  // Each block: its lines and tiles, then the meta chips, then its actions.
  function resumeBlock(slot, chips) {
    const isMock = slot.mode === 'mock';
    const at = isMock ? window.RunCore.mockAnsweredCount(slot) : Math.min(slot.idx + 1, slot.qs.length);
    return '<p class="hero__sub">' + resumeLine(slot) + '</p>' +
      (isMock ? '' : setTiles(slot.qs, resumeStates(slot))) + chips +
      '<div class="hero__actions" data-slot="resume-actions"><a class="btn btn--white btn--lg" href="' +
      (isMock ? '#/mock/run' : '#/sprint') + '">이어서 하기 ' +
      '<span class="num">(' + (isMock ? '답 ' : '') + at + ' / ' + slot.qs.length + ')</span></a>' +
      '<button type="button" class="btn btn--quiet" data-act="discard">버리고 새 세트</button></div>';
  }

  // Second step of 버리고 새 세트: an inline yes/no, never window.confirm.
  function discardAskHtml() {
    return '<p class="hero__ask" role="status">진행 중인 답은 기록되지 않고 사라집니다. 버릴까요?</p>' +
      '<button type="button" class="btn btn--white" data-act="discard-yes">버리기</button>' +
      '<button type="button" class="btn btn--quiet" data-act="discard-no">취소</button>';
  }

  function deckLink() {
    return '<a class="btn btn--quiet" href="#/deck">덱만 보기</a>';
  }

  function doneBlock(ctx, chips) {
    const d = ctx.done;
    const head = d.mode === 'mock' ? '오늘 모의고사 완료' : '오늘 세트 완료';
    return '<p class="hero__sub">' + head + ' · 정답 <span class="num">' + d.right + ' / ' + d.total + '</span></p>' +
      setTiles(d.qs, d.states) + setLine(ctx, '한 세트 더') + chips +
      '<div class="hero__actions"><button type="button" class="btn btn--white btn--lg" data-act="start">한 세트 더</button>' +
      deckLink() + '</div>';
  }

  function setBlock(ctx, chips) {
    if (ctx.sprint) return resumeBlock(ctx.sprint, chips);
    if (!ctx.pick.length) return '<p class="hero__sub">풀 수 있는 문제가 없습니다.</p>' + chips;
    if (ctx.done) return doneBlock(ctx, chips);
    return setLine(ctx, '오늘의 세트') + setTiles(ctx.pick, ctx.pick.map(() => 'untried')) + chips +
      '<div class="hero__actions"><button type="button" class="btn btn--white btn--lg" data-act="start">시작</button>' +
      deckLink() + '</div>';
  }

  function chip(value, label) {
    return '<li class="hero-chip"><span class="hero-chip__n num">' + value + '</span>' +
      '<span class="hero-chip__label">' + label + '</span></li>';
  }

  // Real numbers only: questions seen, right among graded, the streak (each shown only when it exists).
  function chipsHtml(ctx) {
    const items = [chip(ctx.seen + ' / ' + total(), '진도')];
    if (ctx.graded) items.push(chip(ctx.right + ' / ' + ctx.graded, '정답'));
    if (ctx.streak) items.push(chip(ctx.streak + '일', '연속'));
    return '<ul class="hero__chips">' + items.join('') + '</ul>';
  }

  function heroPart(ctx) {
    return '<section class="hero today-hero" aria-labelledby="today-h1">' + factLine(ctx) +
      countdownHtml(ctx.days) + setBlock(ctx, chipsHtml(ctx)) + '</section>';
  }

  // ── Side sheet: deck, last session, weak sections ──

  function rowHtml(label, body) {
    return '<div class="today-row"><h2 class="today-row__label">' + label + '</h2>' + body + '</div>';
  }

  function deckRow(ctx) {
    return rowHtml('복습 덱', '<p class="today-row__text">복습 <span class="num">' + ctx.due + '</span>장 · 덱 전체 <span class="num">' +
      ctx.deckTotal + '</span>장</p>');
  }

  // Weakest section inside one session: lowest accuracy among its attempts.
  function sessionWeak(sessionId) {
    const rows = window.Store.get().attempts.filter(a => a.sessionId === sessionId && typeof a.correct === 'boolean');
    const by = {};
    rows.forEach(a => {
      const l = Util.lesson(a.q);
      if (!l) return;
      const r = by[l.section] || { right: 0, n: 0 };
      by[l.section] = { right: r.right + (a.correct ? 1 : 0), n: r.n + 1 };
    });
    const ids = Object.keys(by).filter(id => by[id].right < by[id].n)
      .sort((a, b) => by[a].right / by[a].n - by[b].right / by[b].n);
    return ids[0] || null;
  }

  function lastRow(ctx) {
    const s = ctx.last;
    if (!s) return rowHtml('스프린트 기록', '<p class="today-row__text">아직 스프린트 기록이 없습니다.</p>');
    const ratio = window.Store.avgPaceRatio(s.id);
    const weak = sessionWeak(s.id);
    const bits = [esc(dayLabel(s.at, ctx.now)) + (s.mode === 'mock' ? ' 모의고사' : ''),
      '<span class="num">' + s.right + '/' + s.total + '</span>'];
    if (ratio !== null) bits.push('평균 속도 <span class="num">' + ratio.toFixed(1) + '×</span>');
    if (weak) bits.push('약한 유형 ' + esc(weak));
    return rowHtml('스프린트 기록', '<p class="today-row__text">지난 세트: <a class="today-row__link" href="#/review/' +
      encodeURIComponent(s.id) + '">' + bits.join(' · ') + '</a></p>');
  }

  function weakRow(ctx) {
    if (!ctx.weak.length) return '';
    const items = ctx.weak.map(w =>
      '<li><a class="weak-list__link" href="#/map"><span class="weak-list__id">' + esc(w.id) + '</span>' +
      '<span class="weak-list__label" lang="ko">' + esc(sectionText(w.id)) + '</span>' +
      '<span class="weak-list__acc num">' + Math.round(w.accuracy * 100) + '%</span>' +
      '<span class="weak-list__n"><span class="num">' + w.n + '</span>회</span></a></li>').join('');
    return rowHtml('약한 유형', '<ol class="weak-list">' + items + '</ol>');
  }

  function sidePart(ctx) {
    return '<section class="sheet today-side" aria-label="기록">' + deckRow(ctx) + lastRow(ctx) + weakRow(ctx) + '</section>';
  }

  function mapPart() {
    return '<section class="sheet today-map" aria-labelledby="today-map-h">' +
      '<h2 class="sheet-title" id="today-map-h">진도</h2>' + window.MapScreen.html({ compact: true }) + '</section>';
  }

  // The quiet 기록 초기화 control at the bottom, and its (closed) dialog: js/screens/reset-dialog.js.
  function resetPart() {
    return window.ResetDialog.html();
  }

  const PARTS = [heroPart, sidePart, mapPart, resetPart];

  // Today's last finished session, with one tile state per question (null if none today).
  function doneToday(state, today) {
    const s = state.sessions.filter(x => toISODate(new Date(x.at)) === today).pop();
    if (!s) return null;
    const mine = state.attempts.filter(a => a.sessionId === s.id);
    const states = s.qs.map(q => {
      const list = mine.filter(a => a.q === q);
      return T().stateOfAttempt(list[list.length - 1]);
    });
    return { mode: s.mode, right: s.right, total: s.total, qs: s.qs, states };
  }

  function cardCounts() {
    const values = Object.values(window.Store.cardMap()).map(e => e.status);
    const graded = values.filter(s => s !== 'untried' && s !== 'seen');
    return {
      seen: values.filter(s => s !== 'untried').length,
      graded: graded.length,
      right: graded.filter(s => s !== 'wrong').length
    };
  }

  function context() {
    const now = new Date();
    const today = toISODate(now);
    const state = window.Store.get();
    const sprint = window.Store.getSprint();
    const data = Util.data();
    const pick = sprint ? [] : window.Session.pick(SET_SIZE, window.Session.contextOf(state, data, today));
    const due = window.DeckCards.dueCards(data.lessons, state.settings).length;
    return {
      now,
      days: daysUntil(EXAM_DATE, now),
      streak: activeStreak(state.streak, now),
      sprint,
      pick,
      due,
      deckTotal: window.SRS.stats().total,
      minutes: Math.ceil((window.Session.estimateSec(pick, data.lessons) + due * CARD_SEC) / 60),
      done: doneToday(state, today),
      last: window.Store.lastSession(),
      weak: window.Store.weakestSections(3, 2),
      ...cardCounts()
    };
  }

  function draw() {
    const ctx = context();
    view = { ...view, pick: ctx.pick };
    view.root.innerHTML = '<div class="today">' + PARTS.map(part => part(ctx)).join('') + '</div>';
  }

  // A run started in another tab since this page was drawn wins: show it instead.
  function start() {
    if (!view || !view.pick.length) return;
    if (window.Store.getSprint()) { draw(); return; }
    window.Store.setSprint(window.Session.createSlot(view.pick, Date.now()));
    const due = window.DeckCards.dueCards(Util.data().lessons, window.Store.get().settings).length;
    location.hash = due ? '#/deck/then-sprint' : '#/sprint';
  }

  function focusAct(name) {
    const btn = view.root.querySelector('[data-act="' + name + '"]');
    if (btn) btn.focus();
  }

  function askDiscard() {
    const box = view.root.querySelector('[data-slot="resume-actions"]');
    if (!box) return;
    box.innerHTML = discardAskHtml();
    focusAct('discard-no');
  }

  function discard() {
    window.Store.claimTab();   // dropping the run is this tab's call: it is the writer from here
    window.Store.clearSprint();
    draw();
    focusAct('start');
  }

  // After the right PIN: the record is deleted, so draw Today again (0 / 50), focus the new control,
  // then open the centered done pop-up (it returns focus to that control when it closes).
  function resetDone() {
    draw();
    focusAct('reset-open');
    window.ResetDialog.showDone(view.root);
  }

  const ACTIONS = {
    start,
    discard: askDiscard,
    'discard-yes': discard,
    'discard-no': () => { draw(); focusAct('discard'); },
    'reset-open': () => window.ResetDialog.open(view.root),
    'reset-cancel': () => window.ResetDialog.cancel(view.root),
    'reset-next': () => window.ResetDialog.next(view.root),
    'reset-done-close': () => window.ResetDialog.closeDone(view.root)
  };

  function onClick(e) {
    const act = e.target.closest('[data-act]');
    if (act && ACTIONS[act.dataset.act]) ACTIONS[act.dataset.act]();
  }

  // The PIN step is a form: Enter and the 초기화 button both arrive here.
  function onSubmit(e) {
    if (!view || !e.target.closest('[data-reset-form]')) return;
    e.preventDefault();
    if (window.ResetDialog.submit(view.root, { Store: window.Store, SRS: window.SRS })) resetDone();
  }

  // 'close' does not bubble: listen in the capture phase.
  function onClose(e) {
    if (view && e.target.matches && e.target.matches('[data-reset-dialog]')) window.ResetDialog.onClose(view.root);
  }

  function mount(root) {
    view = { root, pick: [] };
    draw();
    root.addEventListener('click', onClick);
    root.addEventListener('submit', onSubmit);
    root.addEventListener('close', onClose, true);
  }

  function unmount() {
    view = null;
  }

  const TodayScreen = {
    title: '오늘', mount, unmount,
    parts: { heroPart, sidePart, mapPart }
  };

  if (typeof window !== 'undefined') window.TodayScreen = TodayScreen;
  if (typeof module !== 'undefined') module.exports = TodayScreen;
})();
