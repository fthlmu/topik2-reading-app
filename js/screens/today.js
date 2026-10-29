// today.js: home (#/today), drawn as the answer card on the desk.
// Date line; a printed card panel with the exam countdown as digit columns
// and today's set (one oval per question: hollow to start, your marks once
// done, filled as you go while a sprint is open) with 시작 / 덱만 보기;
// rule-separated rows for the deck, the last session and weak sections;
// then the 50-question progress card (MapScreen.html({ compact: true })).
// context() gathers data; each *Part renders one block from it. The freshly
// picked set is kept in `pick` so 시작 starts exactly the questions the time
// estimate was made for. With cards due, 시작 runs the deck first
// (#/deck/then-sprint), which then opens the sprint.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, EXAM_DATE, daysUntil, formatDateKr, toISODate, section, splitSectionLabel } = Util;

  const SET_SIZE = 5;
  const CARD_SEC = 15;
  const TICKS = 10;
  const MAX_SET_OVALS = 10;

  let view = null; // { root, pick: number[] }

  const Omr = () => window.Omr;

  function countdownText(days) {
    if (days > 0) return '시험까지 ' + days + '일';
    if (days === 0) return '오늘 시험';
    return '시험 끝';
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

  // ── Date line ──

  // The date's line translation ("Thursday, October 29, 2026"), built here, never printed.
  function dateEn(now) {
    try {
      return now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (err) {
      return toISODate(now);
    }
  }

  function datePart(ctx) {
    const streak = ctx.streak
      ? ' · <span class="today__streak"><span class="num">' + ctx.streak + '</span>일 연속</span>'
      : '';
    return '<h1 class="sr-only">' + esc(countdownText(ctx.days)) + '</h1>' +
      '<p class="today__date"><span data-line-en="' + esc(dateEn(ctx.now)) + '">' + esc(formatDateKr(ctx.now)) +
      '</span> · TOPIK II 읽기 · 시험일 <span class="num">' +
      esc(EXAM_DATE) + '</span>' + streak + '</p>';
  }

  // ── Card panel: countdown cell + set cell ──

  function countCell(ctx) {
    const body = ctx.days > 0
      ? '<p class="plabel">시험까지</p><div class="today-card__count-row">' + Omr().digitColumns(ctx.days, 2) +
        '<span class="today-card__unit" aria-hidden="true">일</span></div>'
      : '<p class="today-card__over">' + esc(countdownText(ctx.days)) + '</p>';
    return '<div class="today-card__cell today-card__count">' + body + '</div>';
  }

  function setOvals(states) {
    if (!states.length || states.length > MAX_SET_OVALS) return '';
    return '<div class="today-set__ovals" aria-hidden="true">' +
      states.map((st, i) => Omr().oval(i + 1, st, 'md')).join('') + '</div>';
  }

  function setLine(ctx, lead) {
    const deck = ctx.due ? ' · 복습 <span class="num">' + ctx.due + '</span>장' : '';
    return '<p class="plabel">' + lead + deck + ' · 스프린트 <span class="num">' + ctx.pick.length +
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

  // Open sprint: answered (or picked, waiting for 확실/애매) questions are filled.
  function resumeStates(slot) {
    if (slot.mode === 'mock') return [];
    return slot.qs.map((_, i) => (i < slot.answers.length || (i === slot.idx && slot.pending) ? 'fill' : ''));
  }

  function resumeCell(slot) {
    const isMock = slot.mode === 'mock';
    const at = isMock ? window.RunCore.mockAnsweredCount(slot) : Math.min(slot.idx + 1, slot.qs.length);
    return '<div class="today-set__top"><p class="plabel">' + resumeLine(slot) + '</p>' +
      setOvals(resumeStates(slot)) + '</div>' +
      '<div class="set-card__actions" data-slot="resume-actions"><a class="btn btn--primary btn--lg" href="' +
      (isMock ? '#/mock/run' : '#/sprint') + '">이어서 하기 ' +
      '<span class="num">(' + (isMock ? '답 ' : '') + at + ' / ' + slot.qs.length + ')</span></a>' +
      '<button type="button" class="btn btn--quiet" data-act="discard">버리고 새 세트</button></div>';
  }

  // Second step of 버리고 새 세트: an inline yes/no, never window.confirm.
  function discardAskHtml() {
    return '<p class="set-card__ask" role="status">진행 중인 답은 기록되지 않고 사라집니다. 버릴까요?</p>' +
      '<button type="button" class="btn" data-act="discard-yes">버리기</button>' +
      '<button type="button" class="btn btn--quiet" data-act="discard-no">취소</button>';
  }

  function deckLink() {
    return '<a class="btn" href="#/deck">덱만 보기</a>';
  }

  function doneCell(ctx) {
    const d = ctx.done;
    const head = d.mode === 'mock' ? '오늘 모의고사 완료' : '오늘 세트 완료';
    return '<div class="today-set__top"><p class="plabel">' + head + ' · 정답 <span class="num">' + d.right +
      ' / ' + d.total + '</span></p>' + setOvals(d.states) + setLine(ctx, '한 세트 더') + '</div>' +
      '<div class="set-card__actions"><button type="button" class="btn btn--lg" data-act="start">한 세트 더</button>' +
      deckLink() + '</div>';
  }

  function setCell(ctx) {
    let body;
    if (ctx.sprint) body = resumeCell(ctx.sprint);
    else if (!ctx.pick.length) body = '<p class="plabel">풀 수 있는 문제가 없습니다.</p>';
    else if (ctx.done) body = doneCell(ctx);
    else {
      body = '<div class="today-set__top">' + setLine(ctx, '오늘의 세트') + setOvals(ctx.pick.map(() => '')) + '</div>' +
        '<div class="set-card__actions"><button type="button" class="btn btn--primary btn--lg" data-act="start">시작</button>' +
        deckLink() + '</div>';
    }
    return '<div class="today-card__cell today-set">' + body + '</div>';
  }

  function cardPart(ctx) {
    return '<section class="omr-panel omr-panel--ticks today-card" aria-label="오늘의 세트">' +
      Omr().ticks(TICKS) + '<div class="today-card__cells">' + countCell(ctx) + setCell(ctx) + '</div></section>';
  }

  // ── Rows: deck, last session, weak sections ──

  function rowHtml(label, body) {
    return '<div class="today-row"><h2 class="today-row__label">' + label + '</h2>' + body + '</div>';
  }

  function deckRow(ctx) {
    const text = ctx.deckTotal
      ? '<p class="today-row__text">복습 <span class="num">' + ctx.due + '</span>장 · 덱 전체 <span class="num">' +
        ctx.deckTotal + '</span>장</p>'
      : '<p class="today-row__text today-row__text--muted">비어 있습니다 · 틀리거나 애매했던 문제의 어휘가 쌓입니다</p>';
    return rowHtml('복습 덱', text);
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
    if (!ctx.weak.length) {
      return rowHtml('약한 유형', '<p class="today-row__text today-row__text--muted">' +
        '한 유형을 2번 이상 풀면 정답률이 낮은 유형이 여기에 나옵니다.</p>');
    }
    const items = ctx.weak.map(w =>
      '<li><a class="weak-list__link" href="#/map"><span class="weak-list__id">' + esc(w.id) + '</span>' +
      '<span class="weak-list__label" lang="ko">' + esc(sectionText(w.id)) + '</span>' +
      '<span class="weak-list__acc num">' + Math.round(w.accuracy * 100) + '%</span>' +
      '<span class="weak-list__n"><span class="num">' + w.n + '</span>회</span></a></li>').join('');
    return rowHtml('약한 유형', '<ol class="weak-list">' + items + '</ol>');
  }

  function listsPart(ctx) {
    return '<section class="today-lists" aria-label="기록">' + deckRow(ctx) + lastRow(ctx) + weakRow(ctx) + '</section>';
  }

  function mapPart() {
    return '<section class="today-map" aria-labelledby="today-map-h"><div class="today-map__head">' +
      '<h2 class="section-title" id="today-map-h">진도 · 1번 ~ 50번</h2>' + Omr().legend() + '</div>' +
      window.MapScreen.html({ compact: true }) + '</section>';
  }

  const PARTS = [datePart, cardPart, listsPart, mapPart];

  // Today's last finished session, with one mark per question (null if none today).
  function doneToday(state, today) {
    const s = state.sessions.filter(x => toISODate(new Date(x.at)) === today).pop();
    if (!s) return null;
    const mine = state.attempts.filter(a => a.sessionId === s.id);
    const states = s.qs.map(q => {
      const list = mine.filter(a => a.q === q);
      return Omr().single(Omr().markOfAttempt(list[list.length - 1]));
    });
    return { mode: s.mode, right: s.right, total: s.total, states };
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
      weak: window.Store.weakestSections(3, 2)
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
    window.Store.clearSprint();
    draw();
    focusAct('start');
  }

  const ACTIONS = {
    start,
    discard: askDiscard,
    'discard-yes': discard,
    'discard-no': () => { draw(); focusAct('discard'); }
  };

  function onClick(e) {
    const act = e.target.closest('[data-act]');
    if (act && ACTIONS[act.dataset.act]) ACTIONS[act.dataset.act]();
  }

  function mount(root) {
    view = { root, pick: [] };
    draw();
    root.addEventListener('click', onClick);
  }

  function unmount() {
    view = null;
  }

  const TodayScreen = {
    title: '오늘', mount, unmount,
    parts: { datePart, cardPart, listsPart, mapPart }
  };

  if (typeof window !== 'undefined') window.TodayScreen = TodayScreen;
  if (typeof module !== 'undefined') module.exports = TodayScreen;
})();
