// guide.js: 사용법 (#/guide), the one page that explains the app (DESIGN.md section 6b).
// Every other screen shows only its title, data and actions; how it all works lives here:
// the daily order, what each screen is for, what each tile colour means, the English layer
// and the 한 / EN switch, every keyboard shortcut, and where records are kept.
// Each line is Korean UI copy with its English in js/ui-strings.js, so the line layer and
// the 한 / EN switch (js/ui-lang.js) work here as on every screen. Facts come from the code:
// keys from each screen's onKey, deck boxes from js/srs.js, the Drill date from
// js/translate.js (LEARN_END), the mock from js/run-core.js and js/pace.js.
(function () {
  'use strict';

  const root = typeof window !== 'undefined' ? window : globalThis;
  const Util = root.Util || require('../util.js');
  const { esc } = Util;

  const ORDER = [
    '오늘 화면에서 시작을 누릅니다.',
    '복습할 카드가 있으면 덱이 먼저 나옵니다.',
    '덱이 끝나면 스프린트 5문제가 이어집니다.',
    '스프린트가 끝나면 리뷰에서 해설을 봅니다.',
    '틀리거나 애매한 문제의 어휘와 문법은 덱에 들어갑니다.'
  ];

  const SCREENS = [
    ['오늘', ['오늘의 세트, 시험까지 남은 날, 진도를 봅니다.']],
    ['지도', ['50문제를 유형별로 봅니다.', '번호를 누르면 그 문제를 공부합니다.']],
    ['공부', ['한 문제를 시간 없이 풉니다.', '답한 뒤 해설, 어휘, 문법, 연습 퀴즈를 봅니다.']],
    ['스프린트', ['5문제를 문제마다 기준 시간 안에 풉니다.', '답한 뒤 확실해요 또는 애매해요를 고릅니다.', '확실해요나 애매해요를 누르기 전까지는 답을 바꿀 수 있습니다.',
      '채점은 끝난 뒤 리뷰에서 합니다.']],
    ['리뷰', ['점수, 문제별 해설, 유형별 전략을 봅니다.', '다시 풀기는 틀린 문제만 다시 풉니다.',
      '속도 1.0×는 기준 시간입니다. 클수록 느립니다.']],
    ['덱', ['카드를 뒤집어 뜻을 보고 알아요 또는 몰라요를 누릅니다.',
      '알아요는 상자를 하나 올리고, 몰라요는 상자 1로 보냅니다.',
      '상자 1~5의 카드는 1·2·4·8·16일 뒤에 다시 나옵니다.']],
    ['모의고사', ['46문제, 70분, 멈춤 없음. 나가도 시간은 계속 갑니다.',
      '끝내기 전까지 답을 바꿀 수 있고, 시간이 끝나면 자동으로 채점합니다.',
      '23·24·42·43번은 원문 비공개로 제외합니다.']]
  ];

  const COLOURS = [
    ['untried', '아직 안 푼 문제'],
    ['answered', '답을 골랐고 아직 채점 전'],
    ['correct', '정답'],
    ['wrong', '오답'],
    ['unsure', '맞혔지만 애매하다고 표시한 문제']
  ];
  const COLOUR_NOTES = [
    '지도의 색은 마지막 스프린트나 모의고사 결과를 따릅니다.',
    '시간이 빨간색이면 기준 시간을 넘은 것입니다.',
    '모의고사 시간은 마지막 5분에 노란색이 됩니다.'
  ];

  const ENGLISH = [
    '단어에 마우스를 올리거나 한 번 누르면 뜻이 나옵니다.',
    '문장을 오른쪽 클릭하거나 길게 누르면 영어 번역이 나옵니다. 같은 동작으로 닫습니다.',
    '주석 버튼이나 G 키로 영어 도움을 모두 끄고 켭니다.',
    '11월 18일부터 스프린트와 모의고사는 주석이 꺼진 채로 시작합니다.',
    '카드와 퀴즈에는 번역이 없습니다.',
    '주석이 켜져 있으면 한국어 문장을 복사할 수 없습니다.',
    '한 / EN 버튼은 앱의 글자만 영어로 바꿉니다. 시험 문제는 바뀌지 않습니다.'
  ];

  // [area, [[keys, what]]]; keys are kbd labels, read from each screen's onKey.
  const KEYS = [
    ['어디서나', [[['G'], '주석'], [['Esc'], '번역 닫기']]],
    ['문장 안', [[['Tab'], '문장'], [['←', '→'], '단어'], [['T'], '번역']]],
    ['공부', [[['1', '2', '3', '4'], '선택'], [['←', '→'], '이전 · 다음 문제'], [['Esc'], '지도']]],
    ['스프린트', [[['1', '2', '3', '4'], '선택'], [['S', 'Enter', 'Space'], '확실해요'], [['U'], '애매해요'], [['Esc'], '멈춤']]],
    ['덱', [[['Space', 'Enter'], '뒤집기'], [['J', '←'], '몰라요'], [['K', '→'], '알아요'], [['Esc'], '오늘']]],
    ['모의고사', [[['1', '2', '3', '4'], '선택'], [['←', '→'], '이전 · 다음 문제'], [['Esc'], '끝내기 질문 닫기']]],
    ['리뷰', [[['Esc'], '오늘']]]
  ];

  const RECORDS = [
    '기록은 이 브라우저에만 저장됩니다.',
    '주소가 다르면 기록도 따로 저장됩니다.',
    '저장소가 막힌 브라우저에서는 기록이 저장되지 않습니다.',
    '오늘 화면의 기록 초기화로 모든 기록을 지울 수 있습니다 (PIN 필요).'
  ];

  function lines(list) {
    return '<ul class="guide__lines">' + list.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>';
  }

  function sheet(id, title, body) {
    return '<section class="sheet guide__sheet" aria-labelledby="guide-' + id + '">' +
      '<h2 class="sheet-title" id="guide-' + id + '">' + title + '</h2>' + body + '</section>';
  }

  function orderHtml() {
    const T = root.Tiles;
    return '<ol class="guide__steps">' + ORDER.map((t, i) =>
      '<li>' + T.square(i + 1) + '<span>' + esc(t) + '</span></li>').join('') + '</ol>';
  }

  function screensHtml() {
    return '<dl class="guide__defs">' + SCREENS.map(([name, list]) =>
      '<div class="guide__def"><dt>' + esc(name) + '</dt><dd>' + lines(list) + '</dd></div>').join('') + '</dl>';
  }

  function coloursHtml() {
    const T = root.Tiles;
    return '<ul class="guide__colours">' + COLOURS.map(([state, text]) =>
      '<li>' + T.tile({ n: 16, state, attrs: ' aria-hidden="true"' }) + '<span>' + esc(text) + '</span></li>').join('') +
      '</ul>' + lines(COLOUR_NOTES);
  }

  function keysHtml() {
    return KEYS.map(([area, rows]) =>
      '<h3 class="guide__area">' + esc(area) + '</h3><dl class="guide__keys">' + rows.map(([keys, what]) =>
        '<div class="guide__key"><dt>' + keys.map(k => '<kbd>' + esc(k) + '</kbd>').join(' ') + '</dt>' +
        '<dd>' + esc(what) + '</dd></div>').join('') + '</dl>').join('');
  }

  function html() {
    return '<header class="screen-head"><h1 class="screen-title">사용법</h1></header>' +
      '<div class="guide">' +
      sheet('order', '하루 순서', orderHtml()) +
      sheet('screens', '화면', screensHtml()) +
      sheet('colours', '번호 색', coloursHtml()) +
      sheet('english', '영어 도움', lines(ENGLISH)) +
      sheet('keys', '단축키', keysHtml()) +
      sheet('records', '기록', lines(RECORDS)) +
      '</div>';
  }

  function mount(rootEl) {
    rootEl.innerHTML = html();
  }

  const GuideScreen = { title: '사용법', mount, html, KEYS };

  if (typeof window !== 'undefined') window.GuideScreen = GuideScreen;
  if (typeof module !== 'undefined') module.exports = GuideScreen;
})();
