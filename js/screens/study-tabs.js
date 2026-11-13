// study-tabs.js: the Study screen's fold-out blocks. Flashcard faces and quiz questions
// carry data-no-gloss, so the English layer never gives away a self-test answer:
//   vocab flashcards (legacy app.js L520–584), grammar (L586–609),
//   practice quiz engine (L611–753). Each widget owns its element and
//   handles its own clicks; listeners die with the element on navigation.
(function () {
  'use strict';

  const Util = (typeof window !== 'undefined' && window.Util) || require('../util.js');
  const { esc, circled } = Util;

  // ── Vocab flashcards ──────────────────────────────────

  function shuffled(list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function cardFace(item, flipped) {
    if (!flipped) {
      return '<span class="flash__kr" lang="ko">' + esc(item.kr) + '</span>';
    }
    return '<span class="flash__kr flash__kr--small" lang="ko">' + esc(item.kr) + '</span>' +
      (item.roman ? '<span class="flash__roman">' + esc(item.roman) + '</span>' : '') +
      '<span class="flash__en" lang="en">' + esc(item.en) + '</span>' +
      (item.note ? '<span class="flash__note" lang="en">' + esc(item.note) + '</span>' : '');
  }

  function vocab(el, lesson) {
    const items = lesson.vocab || [];
    if (!items.length) { el.innerHTML = '<p class="empty">어휘 목록 없음</p>'; return; }
    let state = { order: items.map((_, i) => i), idx: 0, flipped: false };

    function draw() {
      const item = items[state.order[state.idx]];
      el.innerHTML =
        '<div class="flash">' +
        '<button type="button" class="flash__card' + (state.flipped ? ' is-flipped' : '') + '" ' +
        'data-act="flip" data-no-gloss aria-pressed="' + state.flipped + '">' + cardFace(item, state.flipped) + '</button>' +
        '<div class="flash__bar">' +
        '<button type="button" class="btn btn--quiet" data-act="prev" aria-label="이전 카드">이전</button>' +
        '<span class="flash__count num" aria-live="polite">' + (state.idx + 1) + ' / ' + items.length + '</span>' +
        '<button type="button" class="btn btn--quiet" data-act="next" aria-label="다음 카드">다음</button>' +
        '<button type="button" class="btn btn--quiet flash__shuffle" data-act="shuffle">섞기</button>' +
        '</div></div>';
    }

    function refocus(act) {
      const target = el.querySelector('[data-act="' + act + '"]');
      if (target) target.focus({ preventScroll: true });
    }

    el.addEventListener('click', e => {
      const btn = e.target.closest('[data-act]');
      if (!btn || !el.contains(btn)) return;
      const n = items.length;
      const act = btn.dataset.act;
      if (act === 'flip') state = { ...state, flipped: !state.flipped };
      else if (act === 'prev') state = { ...state, idx: (state.idx - 1 + n) % n, flipped: false };
      else if (act === 'next') state = { ...state, idx: (state.idx + 1) % n, flipped: false };
      else if (act === 'shuffle') state = { order: shuffled(state.order), idx: 0, flipped: false };
      else return;
      draw();
      refocus(act);
    });
    draw();
  }

  // ── Grammar ───────────────────────────────────────────

  function grammarHtml(lesson) {
    const points = lesson.grammar || [];
    if (!points.length) return '<p class="empty">이 문항의 문법 설명은 없습니다.</p>';
    return points.map(gp =>
      '<section class="grammar">' +
      '<h3 class="grammar__pattern" lang="ko">' + esc(gp.pattern) + '</h3>' +
      '<p class="grammar__plain" lang="en">' + esc(gp.plainEnglish) + '</p>' +
      '<ul class="grammar__examples">' + (gp.examples || []).map(ex =>
        '<li><span class="grammar__kr" lang="ko">' + esc(ex.kr) + '</span>' +
        (ex.roman ? '<span class="grammar__roman">' + esc(ex.roman) + '</span>' : '') +
        '<span class="grammar__en" lang="en">' + esc(ex.en) + '</span></li>').join('') +
      '</ul>' +
      (gp.commonMistake
        ? '<p class="grammar__mistake"><span class="grammar__mistake-label">흔한 실수</span>' +
          '<span lang="en">' + esc(gp.commonMistake) + '</span></p>'
        : '') +
      '</section>').join('');
  }

  // ── Practice quiz ─────────────────────────────────────
  // q = { el, items, selfGraded, state: { idx, score, answered, picked } }. Multiple-choice
  // items: a pick can change until 확인, which grades it; fill/translate items show the model
  // answer and the learner self-grades with 맞았어요 / 틀렸어요 (each also moves on).

  const QUIZ_FIRST = '.quiz__choice, .quiz__input, [data-act="restart"]';
  const QUIZ_NEXT = '[data-act="next"], [data-act="self"]';

  function scoreMsg(score, totalItems) {
    const pct = score / totalItems;
    if (pct === 1) return '완벽해요.';
    if (pct >= 0.8) return '훌륭해요.';
    if (pct >= 0.6) return '잘 했어요.';
    return '다시 한 번 해 봐요.';
  }

  function itemHtml(item, i, n) {
    const head = '<p class="quiz__count num">문제 ' + (i + 1) + ' / ' + n + '</p>' +
      '<p class="quiz__q" data-no-gloss>' + esc(item.q) + '</p>';
    if (item.kind === 'mcq') {
      return head + '<ol class="quiz__choices" data-no-gloss>' + (item.choices || []).map((c, ci) =>
        '<li><button type="button" class="quiz__choice" data-act="pick" data-idx="' + ci + '" aria-pressed="false">' +
        '<span class="choice__num" aria-hidden="true">' + esc(circled(ci + 1)) + '</span>' +
        '<span>' + esc(c) + '</span></button></li>').join('') + '</ol>' +
        '<div class="quiz__confirm"><button type="button" class="btn" data-act="confirm" disabled>확인</button></div>';
    }
    return head + '<div class="quiz__fill">' +
      '<input class="quiz__input" type="text" autocomplete="off" aria-label="답 입력" placeholder="답을 입력하세요">' +
      '<button type="button" class="btn" data-act="submit">확인</button></div>';
  }

  function nextLabel(isLast) {
    return isLast ? '결과 보기' : '다음 문제';
  }

  function selfGradeHtml(isLast) {
    return '<p class="quiz__self-q">내 답이 맞았나요?</p>' +
      '<div class="quiz__self">' +
      '<button type="button" class="btn" data-act="self" data-ok="1">맞았어요 · ' + nextLabel(isLast) + '</button>' +
      '<button type="button" class="btn btn--quiet" data-act="self" data-ok="0">틀렸어요 · ' + nextLabel(isLast) + '</button>' +
      '</div>';
  }

  function feedbackHtml(item, verdict, typed, isLast) {
    let head;
    if (verdict === null) {
      head = '<p class="quiz__verdict">모범 답안</p><p class="quiz__answer">' + esc(item.answer) + '</p>' +
        (typed ? '<p class="quiz__typed"><span class="quiz__typed-label">내 답:</span> ' + esc(typed) + '</p>' : '');
    } else if (verdict) {
      head = '<p class="quiz__verdict is-right">정답</p>';
    } else {
      // The Korean answer sits in its own .quiz__answer span (kept by the 한 / EN switch), apart
      // from the "오답 · 정답:" label, which switches: one text node would translate the answer too.
      const right = item.choices ? item.choices[item.answer] : item.answer;
      head = '<p class="quiz__verdict is-wrong">오답 · 정답: <span class="quiz__answer">' + esc(right) + '</span></p>';
    }
    const next = verdict === null
      ? selfGradeHtml(isLast)
      : '<button type="button" class="btn" data-act="next">' + nextLabel(isLast) + '</button>';
    return '<div class="quiz__feedback" role="status">' + head +
      '<p class="quiz__explain" lang="en">' + esc(item.explain) + '</p>' + next + '</div>';
  }

  function scoreHtml(q) {
    const { score } = q.state;
    const n = q.items.length;
    return '<div class="quiz__score"><p class="quiz__big num">' + score + ' / ' + n + '</p>' +
      (q.selfGraded ? '<p class="quiz__note">자기 채점 포함</p>' : '') +
      '<p>퀴즈 완료. <span>' + scoreMsg(score, n) + '</span></p>' +
      '<button type="button" class="btn" data-act="restart">다시 풀기</button></div>';
  }

  function quizFocus(q, selector) {
    const target = q.el.querySelector(selector);
    if (target) target.focus({ preventScroll: true });
  }

  function quizDraw(q) {
    const { idx } = q.state;
    q.el.innerHTML = idx >= q.items.length
      ? scoreHtml(q)
      : '<div class="quiz">' + itemHtml(q.items[idx], idx, q.items.length) + '<div class="quiz__slot"></div></div>';
  }

  // Show feedback for the current item; focus moves to its 다음 (or self-grade) button.
  function quizAnswer(q, verdict, typed) {
    const { idx, score } = q.state;
    q.state = { ...q.state, answered: true, score: score + (verdict === true ? 1 : 0) };
    q.el.querySelector('.quiz__slot').innerHTML =
      feedbackHtml(q.items[idx], verdict, typed, idx + 1 >= q.items.length);
    quizFocus(q, QUIZ_NEXT);
  }

  // A pick only marks the row; it can change until 확인.
  function quizMark(q, choiceIdx) {
    q.state = { ...q.state, picked: choiceIdx };
    q.el.querySelectorAll('.quiz__choice').forEach((b, i) => {
      b.classList.toggle('is-picked', i === choiceIdx);
      b.setAttribute('aria-pressed', String(i === choiceIdx));
    });
    const ok = q.el.querySelector('[data-act="confirm"]');
    if (ok) ok.disabled = false;
  }

  // 확인: grade the pick, lock the rows, and drop the 확인 row.
  function quizPick(q, choiceIdx) {
    const item = q.items[q.state.idx];
    q.el.querySelectorAll('.quiz__choice').forEach((b, i) => {
      b.disabled = true;
      b.classList.remove('is-picked');
      if (i === item.answer) b.classList.add('is-correct');
      else if (i === choiceIdx) b.classList.add('is-wrong');
    });
    const row = q.el.querySelector('.quiz__confirm');
    if (row) row.remove();
    quizAnswer(q, choiceIdx === item.answer, null);
  }

  function quizSubmit(q) {
    const input = q.el.querySelector('.quiz__input');
    if (input) input.disabled = true;
    quizAnswer(q, null, input ? input.value.trim() : '');
  }

  function quizAdvance(q, bonus) {
    q.state = { idx: q.state.idx + 1, score: q.state.score + bonus, answered: false, picked: null };
    quizDraw(q);
    quizFocus(q, QUIZ_FIRST);
  }

  function quizOnClick(q, e) {
    const btn = e.target.closest('[data-act]');
    if (!btn || !q.el.contains(btn)) return;
    const act = btn.dataset.act;
    if (act === 'pick' && !q.state.answered) quizMark(q, Number(btn.dataset.idx));
    else if (act === 'confirm' && !q.state.answered && Number.isInteger(q.state.picked)) quizPick(q, q.state.picked);
    else if (act === 'submit' && !q.state.answered) quizSubmit(q);
    else if (act === 'next') quizAdvance(q, 0);
    else if (act === 'self') quizAdvance(q, btn.dataset.ok === '1' ? 1 : 0);
    else if (act === 'restart') {
      q.state = { idx: 0, score: 0, answered: false, picked: null };
      quizDraw(q);
      quizFocus(q, QUIZ_FIRST);
    }
  }

  function quizOnKey(q, e) {
    // keyCode 229 = an IME (Korean input) is still composing this keystroke.
    if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229 &&
        e.target.classList.contains('quiz__input') && !q.state.answered) {
      e.preventDefault();
      quizSubmit(q);
    }
  }

  function quiz(el, lesson) {
    const items = lesson.quiz || [];
    if (!items.length) { el.innerHTML = '<p class="empty">이 문항의 연습 퀴즈는 없습니다.</p>'; return; }
    const q = {
      el, items,
      selfGraded: items.some(it => it.kind !== 'mcq'),
      state: { idx: 0, score: 0, answered: false, picked: null }
    };
    el.addEventListener('click', e => quizOnClick(q, e));
    el.addEventListener('keydown', e => quizOnKey(q, e));
    quizDraw(q);
  }

  const StudyTabs = { vocab, grammarHtml, quiz };

  if (typeof window !== 'undefined') window.StudyTabs = StudyTabs;
  if (typeof module !== 'undefined') module.exports = StudyTabs;
})();
