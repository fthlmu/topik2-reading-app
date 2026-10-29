// TOPIK II 읽기 — Interactive Lesson App
// Requires lessons.js (sets window.TOPIK2)

(function () {
  'use strict';

  // ── STATE ──────────────────────────────────────────────
  const state = {
    currentQ: null,
    quizIdx: 0,
    quizScore: 0,
    quizAnswered: false,
    fcIdx: 0,
    fcFlipped: false,
    fcOrder: [],
    completed: loadProgress()
  };

  // ── DOM REFS ───────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const dom = {
    nav:         $('lesson-nav'),
    progressFill: $('progress-fill'),
    progressText: $('progress-text'),
    welcome:     $('welcome-screen'),
    content:     $('lesson-content'),
    startBtn:    $('start-btn'),
    prevBtn:     $('prev-btn'),
    nextBtn:     $('next-btn'),
    numBadge:    $('lesson-num-badge'),
    typeBadge:   $('lesson-type-badge'),
    sectionBadge: $('lesson-section-badge'),
    groupInstrKr: $('group-instr-kr'),
    groupInstrEn: $('group-instr-en'),
    passageContent: $('passage-content'),
    passageNote:  $('passage-note'),
    choicesList:  $('choices-list'),
    choicesHint:  $('choices-hint'),
    answerReveal: $('answer-reveal'),
    revealVerdict: $('reveal-verdict'),
    revealAnswer:  $('reveal-answer'),
    revealWhyRight: $('reveal-why-right'),
    revealWhyWrong: $('reveal-why-wrong'),
    resetChoicesBtn: $('reset-choices-btn'),
    completeBadge: $('complete-badge'),
    tooltip:     $('gloss-tooltip'),
    ttRoman:     $('tt-roman'),
    ttEn:        $('tt-en'),
    // Tabs
    tabBtns:     document.querySelectorAll('.tab-btn'),
    tabVocab:    $('tab-vocab'),
    tabGrammar:  $('tab-grammar'),
    tabQuiz:     $('tab-quiz'),
    // Flashcard
    flashcard:   $('flashcard'),
    fcFront:     $('fc-front'),
    fcBack:      $('fc-back'),
    fcCounter:   $('fc-counter'),
    fcPrev:      $('fc-prev'),
    fcNext:      $('fc-next'),
    fcShuffle:   $('fc-shuffle'),
    // Grammar
    grammarContent: $('grammar-content'),
    // Quiz
    quizProgress: $('quiz-progress'),
    quizQArea:   $('quiz-question-area'),
    quizFeedback: $('quiz-feedback'),
    quizScore:   $('quiz-score')
  };

  // ── INIT ──────────────────────────────────────────────
  function init() {
    buildSidebar();
    updateProgress();

    dom.startBtn.addEventListener('click', () => loadLesson(1));

    dom.prevBtn.addEventListener('click', () => {
      if (state.currentQ > 1) loadLesson(state.currentQ - 1);
    });
    dom.nextBtn.addEventListener('click', () => {
      if (state.currentQ < TOPIK2.meta.total) loadLesson(state.currentQ + 1);
    });

    dom.resetChoicesBtn.addEventListener('click', resetChoices);

    // Tabs
    dom.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Flashcard
    dom.flashcard.addEventListener('click', flipCard);
    dom.fcPrev.addEventListener('click', () => moveCard(-1));
    dom.fcNext.addEventListener('click', () => moveCard(1));
    dom.fcShuffle.addEventListener('click', shuffleCards);

    // Tooltip
    document.addEventListener('mouseover', handleGlossHover);
    document.addEventListener('mouseout', hideTooltip);
    document.addEventListener('scroll', hideTooltip, true);

    // Batch info link
    const batchLink = $('batch-info-link');
    if (batchLink) {
      batchLink.addEventListener('click', e => {
        e.preventDefault();
        alert('All 50 questions (Q1–Q50) of the 102nd TOPIK II Reading exam are loaded. Use the sidebar to navigate. Note: the reading passages for Q23–24 and Q42–43 are withheld in the official exam by a copyright notice, so those show the question, choices, answer, and vocabulary, but not the original passage.');
      });
    }
  }

  // ── SIDEBAR ───────────────────────────────────────────
  function buildSidebar() {
    const { sections, lessons, meta } = TOPIK2;
    let html = '';

    sections.forEach(sec => {
      html += `<div class="nav-section-header">${sec.label}</div>`;
      for (let q = sec.range[0]; q <= sec.range[1]; q++) {
        const lesson = lessons['Q' + q];
        const available = !!lesson;
        const completed = state.completed.has(q);
        const cls = [
          'nav-item',
          !available ? 'locked' : '',
          completed ? 'completed' : ''
        ].filter(Boolean).join(' ');

        const label = available
          ? shortLabel(lesson)
          : `Q${q} — 준비 중`;

        html += `<div class="${cls}" data-q="${q}">
          <span class="nav-qnum">Q${q}</span>
          <span class="nav-label">${label}</span>
          <span class="nav-check">✓</span>
        </div>`;
      }
    });

    dom.nav.innerHTML = html;

    dom.nav.querySelectorAll('.nav-item:not(.locked)').forEach(item => {
      item.addEventListener('click', () => loadLesson(parseInt(item.dataset.q)));
    });
  }

  function shortLabel(lesson) {
    const typeMap = {
      'blank-grammar':      '빈칸',
      'similar-meaning':    '유사 의미',
      'topic-id':           '주제',
      'content-match':      '내용 일치',
      'content-match-long': '내용 일치',
      'sentence-order':     '순서',
      'passage-blank':      '빈칸 (지문)',
      'connector-fill':     '연결어',
      'main-topic':         '주제',
      'main-claim':         '주장',
      'idiom-fill':         '관용어',
      'blank-idiom':        '빈칸 (관용어)',
      'argument-blank':     '빈칸 (논설문)',
      'academic-match':     '내용 일치',
      'sentence-insertion': '문장 삽입',
      'feeling-id':         '심정',
      'attitude':           '필자의 태도',
      'purpose':            '글의 목적',
      'headline':           '제목',
      'inference':          '추론'
    };
    return typeMap[lesson.type] || '문항';
  }

  function setActiveNav(q) {
    dom.nav.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const active = dom.nav.querySelector(`.nav-item[data-q="${q}"]`);
    if (active) {
      active.classList.add('active');
      active.scrollIntoView({ block: 'nearest' });
    }
  }

  // ── PROGRESS ──────────────────────────────────────────
  function updateProgress() {
    const done = state.completed.size;
    const total = TOPIK2.meta.total;
    const pct = (done / total) * 100;
    dom.progressFill.style.width = pct + '%';
    dom.progressText.textContent = `${done} / ${total} 완료`;
  }

  function markCompleted(q) {
    state.completed.add(q);
    saveProgress();
    updateProgress();
    const navItem = dom.nav.querySelector(`.nav-item[data-q="${q}"]`);
    if (navItem) navItem.classList.add('completed');
    dom.completeBadge.classList.remove('hidden');
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem('topik2_progress');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  }

  function saveProgress() {
    try {
      localStorage.setItem('topik2_progress', JSON.stringify([...state.completed]));
    } catch {}
  }

  // ── LOAD LESSON ───────────────────────────────────────
  function loadLesson(q) {
    const lesson = TOPIK2.lessons['Q' + q];
    if (!lesson) return;

    state.currentQ = q;
    state.quizIdx = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    state.fcFlipped = false;

    // Show lesson panel, hide welcome
    dom.welcome.classList.add('hidden');
    dom.content.classList.remove('hidden');
    dom.completeBadge.classList.add('hidden');

    setActiveNav(q);
    renderHeader(lesson);
    renderInstruction(lesson);
    renderPassage(lesson);
    renderChoices(lesson);
    resetChoices(true);

    // Tabs: reset to vocab
    switchTab('vocab');
    renderFlashcards(lesson);
    renderGrammar(lesson);
    renderQuiz(lesson);

    // Nav arrows
    dom.prevBtn.disabled = q <= 1;
    dom.nextBtn.disabled = q >= TOPIK2.meta.total;

    // Scroll to top
    document.getElementById('main-panel').scrollTo(0, 0);
  }

  // ── HEADER ────────────────────────────────────────────
  function renderHeader(lesson) {
    dom.numBadge.textContent = `Q${lesson.num}`;
    dom.numBadge.className = 'badge';
    dom.numBadge.id = 'lesson-num-badge';
    dom.numBadge.style.background = '#2563eb';
    dom.numBadge.style.color = '#fff';

    const typeLabels = {
      'blank-grammar':      '빈칸에 알맞은 말',
      'similar-meaning':    '의미가 비슷한 것',
      'topic-id':           '무엇에 대한 글인가',
      'content-match':      '내용과 같은 것',
      'content-match-long': '내용과 같은 것',
      'sentence-order':     '순서대로 배열',
      'passage-blank':      '빈칸에 알맞은 것',
      'connector-fill':     '알맞은 연결어',
      'main-topic':         '글의 주제',
      'main-claim':         '글의 주장',
      'idiom-fill':         '알맞은 관용어',
      'blank-idiom':        '빈칸 (관용 표현)',
      'argument-blank':     '빈칸에 알맞은 것 (논설문)',
      'academic-match':     '내용과 같은 것',
      'sentence-insertion': '문장이 들어갈 곳',
      'feeling-id':         '인물의 심정',
      'attitude':           '필자의 태도',
      'purpose':            '글의 목적',
      'headline':           '신문 기사 제목',
      'inference':          '글에서 알 수 있는 것'
    };
    dom.typeBadge.textContent = typeLabels[lesson.type] || '문항';
    dom.sectionBadge.textContent = `${lesson.section} 묶음`;
  }

  // ── INSTRUCTION ───────────────────────────────────────
  function renderInstruction(lesson) {
    const gi = lesson.groupInstruction;
    dom.groupInstrKr.textContent = gi.kr;
    dom.groupInstrEn.textContent = gi.en;
  }

  // ── PASSAGE ───────────────────────────────────────────
  function renderPassage(lesson) {
    dom.passageNote.classList.add('hidden');
    dom.passageNote.textContent = '';

    switch (lesson.passageType) {
      case 'sentence':
        dom.passageContent.innerHTML = renderSentencePassage(lesson);
        break;
      case 'ad':
        dom.passageContent.innerHTML = renderAdPassage(lesson);
        break;
      case 'numbered-steps':
        dom.passageContent.innerHTML = renderStepsPassage(lesson);
        break;
      case 'notice':
        dom.passageContent.innerHTML = renderNoticePassage(lesson);
        if (lesson.notice.note) {
          dom.passageNote.textContent = lesson.notice.note;
          dom.passageNote.classList.remove('hidden');
        }
        break;
      case 'chart':
        dom.passageContent.innerHTML = renderChartPassage(lesson);
        if (lesson.chart.note) {
          dom.passageNote.textContent = lesson.chart.note;
          dom.passageNote.classList.remove('hidden');
        }
        break;
      case 'multi-para':
        dom.passageContent.innerHTML = renderMultiParaPassage(lesson);
        if (lesson.passageNote) {
          dom.passageNote.textContent = lesson.passageNote;
          dom.passageNote.classList.remove('hidden');
        }
        break;
      case 'ordering':
        dom.passageContent.innerHTML = renderOrderingPassage(lesson);
        break;
      default:
        dom.passageContent.textContent = '(passage)';
    }
  }

  function renderSentencePassage(lesson) {
    const tokens = lesson.passageTokens || [];
    const words = tokens.map(t => {
      if (t.isBlank) {
        return `<span class="blank-token">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>`;
      }
      if (t.isUnderline) {
        return `<span class="underline-token gloss-word" data-roman="${esc(t.roman)}" data-en="${esc(t.en)}">${esc(t.kr)}</span>`;
      }
      return `<span class="gloss-word" data-roman="${esc(t.roman)}" data-en="${esc(t.en)}">${esc(t.kr)}</span>`;
    });
    return `<div class="passage-sentence">${words.join(' ')}</div>`;
  }

  function renderAdPassage(lesson) {
    const lines = (lesson.passageLines || []).map(l =>
      `<div class="ad-line">
         <span class="gloss-word" data-roman="${esc(l.roman)}" data-en="${esc(l.en)}">${esc(l.kr)}</span>
       </div>`
    ).join('');
    return `<div class="passage-ad">${lines}</div>`;
  }

  function renderStepsPassage(lesson) {
    const lines = (lesson.passageLines || []).map(l =>
      `<div class="step-line">
         <div>
           <div class="step-kr">${esc(l.kr)}</div>
           <div class="step-en">${esc(l.en)}</div>
         </div>
       </div>`
    ).join('');
    return `<div class="passage-steps">${lines}</div>`;
  }

  function renderNoticePassage(lesson) {
    const n = lesson.notice;
    const items = (n.items || []).map(it =>
      `<div class="notice-item">
         <span class="notice-label">${esc(it.label)}<span style="font-size:10px;color:#94a3b8;margin-left:4px">${esc(it.labelEn)}</span></span>
         <div>
           <div class="notice-val-kr">${esc(it.kr)}</div>
           <div class="notice-val-en">${esc(it.en)}</div>
         </div>
       </div>`
    ).join('');
    return `<div class="passage-notice">
      <div class="notice-header">${esc(n.category)} · ${esc(n.categoryEn)}</div>
      <div class="notice-headline">
        <div class="notice-headline-kr">${esc(n.headline)}</div>
        <div class="notice-headline-roman">${esc(n.headlineRoman)}</div>
        <div class="notice-headline-en">${esc(n.headlineEn)}</div>
        ${n.activity ? `<div class="notice-activity-tag">📚 ${esc(n.activity)} · ${esc(n.activityEn)}</div>` : ''}
      </div>
      <div class="notice-items">${items}</div>
    </div>`;
  }

  function renderChartPassage(lesson) {
    const c = lesson.chart;
    const maxPct = Math.max(...c.data.map(d => d.pct));
    const bars = c.data.map(d =>
      `<div class="chart-bar-row">
         <div class="bar-label">${esc(d.label)}<br><span style="font-size:10px;color:#9ca3af">${esc(d.labelEn)}</span></div>
         <div class="bar-track">
           <div class="bar-fill rank-${d.rank}" style="width:${(d.pct / maxPct * 100).toFixed(1)}%"></div>
         </div>
         <div class="bar-pct">${d.pct}%</div>
       </div>`
    ).join('');
    return `<div class="passage-chart">
      <div class="chart-title-kr">${esc(c.title)}</div>
      <div class="chart-title-en">${esc(c.titleEn)} ${esc(c.subtitleEn)}</div>
      <div class="chart-bars">${bars}</div>
    </div>`;
  }

  function renderMultiParaPassage(lesson) {
    const paras = lesson.passageParas || [];
    return '<div class="passage-multi-para">' +
      paras.map(para => {
        const words = (para.tokens || []).map(t => {
          if (t.isBlank) return '<span class="blank-token">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
          if (t.isUnderline) return `<span class="underline-token gloss-word" data-roman="${esc(t.roman)}" data-en="${esc(t.en)}">${esc(t.kr)}</span>`;
          return `<span class="gloss-word" data-roman="${esc(t.roman)}" data-en="${esc(t.en)}">${esc(t.kr)}</span>`;
        }).join(' ');
        return `<p class="passage-para">${words}</p>`;
      }).join('') +
    '</div>';
  }

  function renderOrderingPassage(lesson) {
    const items = lesson.orderingItems || [];
    return '<div class="passage-ordering">' +
      items.map(item => {
        const words = (item.tokens || []).map(t => {
          if (t.isBlank) return '<span class="blank-token">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
          return `<span class="gloss-word" data-roman="${esc(t.roman)}" data-en="${esc(t.en)}">${esc(t.kr)}</span>`;
        }).join(' ');
        return `<div class="ordering-item">
          <span class="ordering-label">${esc(item.label)}</span>
          <div class="ordering-text">${words}</div>
        </div>`;
      }).join('') +
    '</div>';
  }

  // ── CHOICES ───────────────────────────────────────────
  const CIRCLE = ['', '①', '②', '③', '④'];

  function renderChoices(lesson) {
    dom.choicesList.innerHTML = lesson.choices.map(ch =>
      `<button class="choice-btn" data-num="${ch.num}">
         <span class="choice-num">${CIRCLE[ch.num]}</span>
         <div class="choice-body">
           <div class="choice-kr">${esc(ch.kr)}</div>
           <div class="choice-roman">${esc(ch.roman)}</div>
           <div class="choice-en">${esc(ch.en)}</div>
         </div>
       </button>`
    ).join('');

    dom.choicesList.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => handleChoiceClick(parseInt(btn.dataset.num)));
    });
  }

  function handleChoiceClick(num) {
    const lesson = TOPIK2.lessons['Q' + state.currentQ];
    if (!lesson) return;

    // Disable all choices
    dom.choicesList.querySelectorAll('.choice-btn').forEach(btn => {
      btn.classList.add('revealed');
    });

    const correct = lesson.answer;
    const isRight = num === correct;

    // Highlight chosen & correct
    dom.choicesList.querySelectorAll('.choice-btn').forEach(btn => {
      const n = parseInt(btn.dataset.num);
      if (n === correct) btn.classList.add('correct');
      if (n === num && !isRight) btn.classList.add('wrong-selected');
    });

    // Show reveal panel
    dom.answerReveal.classList.remove('hidden');
    dom.choicesHint.textContent = '';

    dom.revealVerdict.textContent = isRight ? '✅ 정답!' : '❌ 틀렸습니다';
    dom.revealVerdict.className = isRight ? 'correct' : 'wrong';
    dom.revealAnswer.textContent = `정답: ${CIRCLE[correct]}`;

    dom.revealWhyRight.innerHTML = lesson.whyRight || '';

    // Why wrong explanations
    if (!isRight && lesson.whyWrong) {
      const wrongItems = Object.entries(lesson.whyWrong).map(([k, v]) =>
        `<div class="why-wrong-item"><span class="why-wrong-label">${CIRCLE[parseInt(k)]} 오답:</span>${v}</div>`
      ).join('');
      dom.revealWhyWrong.innerHTML = `<div style="margin-top:12px"><strong style="color:#374151;font-size:13px">오답 해설:</strong><div style="margin-top:8px">${wrongItems}</div></div>`;
      dom.revealWhyWrong.classList.remove('hidden');
    } else {
      dom.revealWhyWrong.classList.add('hidden');
    }

    // Mark complete if not already
    if (!state.completed.has(state.currentQ)) {
      markCompleted(state.currentQ);
    }
  }

  function resetChoices(silent) {
    dom.choicesList.querySelectorAll('.choice-btn').forEach(btn => {
      btn.classList.remove('revealed', 'correct', 'wrong-selected');
    });
    dom.answerReveal.classList.add('hidden');
    dom.revealWhyWrong.classList.add('hidden');
    dom.choicesHint.textContent = '(선택해서 정답을 확인하세요)';
    if (!silent) dom.completeBadge.classList.add('hidden');
  }

  // ── FLASHCARDS ────────────────────────────────────────
  function renderFlashcards(lesson) {
    const vocab = lesson.vocab || [];
    if (!vocab.length) {
      dom.flashcard.innerHTML = '<div style="color:#9ca3af;font-size:14px;font-family:sans-serif">어휘 목록 없음</div>';
      dom.fcCounter.textContent = '';
      return;
    }
    state.fcOrder = vocab.map((_, i) => i);
    state.fcIdx = 0;
    state.fcFlipped = false;
    showCard(lesson);
  }

  function showCard(lesson) {
    const vocab = lesson.vocab || [];
    if (!vocab.length) return;
    const item = vocab[state.fcOrder[state.fcIdx]];
    state.fcFlipped = false;

    dom.flashcard.classList.remove('flipped');
    dom.fcFront.classList.remove('hidden');
    dom.fcBack.classList.add('hidden');

    dom.fcFront.textContent = item.kr;
    dom.fcBack.innerHTML = `
      <div class="fc-roman">${esc(item.roman)}</div>
      <div class="fc-en">${esc(item.en)}</div>
      ${item.note ? `<div class="fc-note">${esc(item.note)}</div>` : ''}
    `;
    dom.fcCounter.textContent = `${state.fcIdx + 1} / ${vocab.length}`;
  }

  function flipCard() {
    const lesson = TOPIK2.lessons['Q' + state.currentQ];
    state.fcFlipped = !state.fcFlipped;
    if (state.fcFlipped) {
      dom.flashcard.classList.add('flipped');
      dom.fcFront.classList.add('hidden');
      dom.fcBack.classList.remove('hidden');
    } else {
      dom.flashcard.classList.remove('flipped');
      dom.fcFront.classList.remove('hidden');
      dom.fcBack.classList.add('hidden');
    }
  }

  function moveCard(dir) {
    const lesson = TOPIK2.lessons['Q' + state.currentQ];
    if (!lesson) return;
    const n = lesson.vocab.length;
    state.fcIdx = (state.fcIdx + dir + n) % n;
    showCard(lesson);
  }

  function shuffleCards() {
    const lesson = TOPIK2.lessons['Q' + state.currentQ];
    if (!lesson) return;
    for (let i = state.fcOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.fcOrder[i], state.fcOrder[j]] = [state.fcOrder[j], state.fcOrder[i]];
    }
    state.fcIdx = 0;
    showCard(lesson);
  }

  // ── GRAMMAR ───────────────────────────────────────────
  function renderGrammar(lesson) {
    const points = lesson.grammar || [];
    if (!points.length) {
      dom.grammarContent.innerHTML = '<p style="color:#9ca3af;font-size:14px">No grammar notes for this question.</p>';
      return;
    }
    dom.grammarContent.innerHTML = points.map(gp => `
      <div class="grammar-point">
        <div class="grammar-pattern">${esc(gp.pattern)}</div>
        <div class="grammar-plain">${esc(gp.plainEnglish)}</div>
        <div class="grammar-examples">
          ${(gp.examples || []).map(ex => `
            <div class="grammar-ex">
              <div class="ex-kr">${esc(ex.kr)}</div>
              <div class="ex-roman">${esc(ex.roman)}</div>
              <div class="ex-en">${esc(ex.en)}</div>
            </div>
          `).join('')}
        </div>
        ${gp.commonMistake ? `<div class="grammar-mistake">${esc(gp.commonMistake)}</div>` : ''}
      </div>
    `).join('');
  }

  // ── QUIZ ──────────────────────────────────────────────
  function renderQuiz(lesson) {
    const quiz = lesson.quiz || [];
    state.quizIdx = 0;
    state.quizScore = 0;
    state.quizAnswered = false;
    dom.quizScore.classList.add('hidden');
    dom.quizFeedback.classList.add('hidden');

    if (!quiz.length) {
      dom.quizQArea.innerHTML = '<p style="color:#9ca3af;font-size:14px">No quiz for this question.</p>';
      dom.quizProgress.textContent = '';
      return;
    }
    showQuizItem(lesson);
  }

  function showQuizItem(lesson) {
    const quiz = lesson.quiz;
    if (state.quizIdx >= quiz.length) {
      showQuizScore(lesson);
      return;
    }
    const item = quiz[state.quizIdx];
    dom.quizProgress.textContent = `문제 ${state.quizIdx + 1} / ${quiz.length}`;
    dom.quizFeedback.classList.add('hidden');
    state.quizAnswered = false;

    if (item.kind === 'mcq') {
      dom.quizQArea.innerHTML = `
        <div class="quiz-q-text">${esc(item.q)}</div>
        <div class="quiz-choices">
          ${item.choices.map((c, i) => `
            <button class="quiz-choice-btn" data-idx="${i}">${esc(c)}</button>
          `).join('')}
        </div>
      `;
      dom.quizQArea.querySelectorAll('.quiz-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => handleQuizMCQ(parseInt(btn.dataset.idx), item, lesson));
      });

    } else if (item.kind === 'fill' || item.kind === 'translate') {
      dom.quizQArea.innerHTML = `
        <div class="quiz-q-text">${esc(item.q)}</div>
        <input class="quiz-fill-input" type="text" placeholder="답을 입력하세요..." autocomplete="off">
        <br>
        <button class="quiz-submit-btn">확인</button>
      `;
      const input = dom.quizQArea.querySelector('.quiz-fill-input');
      const btn = dom.quizQArea.querySelector('.quiz-submit-btn');
      btn.addEventListener('click', () => handleQuizFill(input.value, item, lesson));
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') handleQuizFill(input.value, item, lesson);
      });
    }
  }

  function handleQuizMCQ(idx, item, lesson) {
    if (state.quizAnswered) return;
    state.quizAnswered = true;

    const correct = item.answer;
    const isRight = idx === correct;
    if (isRight) state.quizScore++;

    dom.quizQArea.querySelectorAll('.quiz-choice-btn').forEach((btn, i) => {
      btn.classList.add('quiz-revealed');
      if (i === correct) btn.classList.add('quiz-correct');
      else if (i === idx && !isRight) btn.classList.add('quiz-wrong');
    });

    showQuizFeedback(isRight, item, lesson);
  }

  function handleQuizFill(val, item, lesson) {
    if (state.quizAnswered) return;
    state.quizAnswered = true;

    // For fill/translate: always show the answer and explanation (open-ended)
    showQuizFeedback(null, item, lesson);
  }

  function showQuizFeedback(isRight, item, lesson) {
    dom.quizFeedback.classList.remove('hidden', 'fb-correct', 'fb-wrong');

    let verdictHtml = '';
    if (isRight === null) {
      // Open-ended: show answer
      verdictHtml = `<div class="fb-verdict correct">모범 답안 / Sample Answer:</div>
        <div style="margin:4px 0 8px;font-family:'Noto Sans KR',sans-serif;font-size:14px;color:#374151">${esc(item.answer)}</div>`;
      dom.quizFeedback.classList.add('fb-correct');
    } else if (isRight) {
      verdictHtml = `<div class="fb-verdict correct">✅ 정답!</div>`;
      dom.quizFeedback.classList.add('fb-correct');
    } else {
      verdictHtml = `<div class="fb-verdict wrong">❌ 오답. 정답: ${esc(item.choices ? item.choices[item.answer] : item.answer)}</div>`;
      dom.quizFeedback.classList.add('fb-wrong');
    }

    dom.quizFeedback.innerHTML = `
      ${verdictHtml}
      <div style="font-size:13px;color:#374151;line-height:1.6;font-family:sans-serif">${esc(item.explain)}</div>
      <button id="quiz-next-btn" style="margin-top:12px;padding:8px 20px;background:transparent;border:1.5px solid #d1d5db;border-radius:8px;font-size:13px;cursor:pointer;font-family:'Noto Sans KR',sans-serif">
        ${state.quizIdx + 1 < lesson.quiz.length ? '다음 문제 →' : '결과 보기 →'}
      </button>
    `;

    const nextBtn = $('quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        state.quizIdx++;
        showQuizItem(lesson);
      });
    }
  }

  function showQuizScore(lesson) {
    dom.quizQArea.innerHTML = '';
    dom.quizFeedback.classList.add('hidden');
    dom.quizScore.classList.remove('hidden');
    dom.quizScore.innerHTML = `
      <div class="score-big">${state.quizScore} / ${lesson.quiz.length}</div>
      <div class="score-label">퀴즈 완료! ${scoreMsg(state.quizScore, lesson.quiz.length)}</div>
      <button id="quiz-restart-btn" style="margin-top:14px;padding:9px 22px;background:#2563eb;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer;font-family:'Noto Sans KR',sans-serif">
        다시 풀기
      </button>
    `;
    const restartBtn = $('quiz-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        dom.quizScore.classList.add('hidden');
        renderQuiz(lesson);
      });
    }
  }

  function scoreMsg(score, total) {
    const pct = score / total;
    if (pct === 1) return '완벽해요! 🎉';
    if (pct >= 0.8) return '훌륭해요! 👏';
    if (pct >= 0.6) return '잘 했어요! 😊';
    return '다시 한 번 해봐요! 💪';
  }

  // ── TABS ──────────────────────────────────────────────
  function switchTab(tabId) {
    dom.tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    [dom.tabVocab, dom.tabGrammar, dom.tabQuiz].forEach(pane => {
      pane.classList.add('hidden');
    });
    const paneMap = { vocab: dom.tabVocab, grammar: dom.tabGrammar, quiz: dom.tabQuiz };
    if (paneMap[tabId]) paneMap[tabId].classList.remove('hidden');
  }

  // ── GLOSS TOOLTIP ─────────────────────────────────────
  let tooltipTimer = null;

  function handleGlossHover(e) {
    const el = e.target.closest('.gloss-word');
    if (!el) return;

    clearTimeout(tooltipTimer);
    const roman = el.dataset.roman;
    const en = el.dataset.en;
    if (!roman && !en) return;

    dom.ttRoman.textContent = roman || '';
    dom.ttEn.textContent = en || '';
    dom.tooltip.classList.remove('hidden');
    positionTooltip(el);
  }

  function positionTooltip(el) {
    const rect = el.getBoundingClientRect();
    const tt = dom.tooltip;
    tt.style.left = (rect.left + rect.width / 2) + 'px';
    tt.style.top = (rect.top - 60) + 'px'; // fixed pos: viewport-relative, no scrollY

    // Keep inside viewport
    const ttRect = tt.getBoundingClientRect();
    if (ttRect.right > window.innerWidth - 8) {
      tt.style.left = (window.innerWidth - ttRect.width / 2 - 8) + 'px';
    }
    if (ttRect.top < 8) {
      tt.style.top = (rect.bottom + 8) + 'px';
    }
  }

  function hideTooltip(e) {
    if (e && e.target && e.target.closest('.gloss-word')) return;
    tooltipTimer = setTimeout(() => {
      dom.tooltip.classList.add('hidden');
    }, 80);
  }

  // ── UTILS ─────────────────────────────────────────────
  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── START ─────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

})();
