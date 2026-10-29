# TOPIK II 읽기 — 102회 study app

A study app for the **102nd TOPIK II Reading exam** (2025.10.19): all **50 questions**, with a daily 10-minute routine, a review deck, and a full timed mock exam. Plain HTML/CSS/JS. No install, no build step, no internet needed except for web fonts.

## How to open

- **Double-click `index.html`.** It runs straight from the folder (`file://`).
- Or serve the folder with any static server, e.g. `python -m http.server 8765`, then open `http://127.0.0.1:8765/`.

> [!note]
> Your progress is saved in the browser, per address. `file://…/index.html` and `http://127.0.0.1:8765/` keep **separate** records. Pick one way of opening and stick to it.

## The daily loop (~10 min, one 시작 button)

1. **덱 Deck (~2 min).** Up to 8 due review cards: words and grammar from questions you got wrong or marked 애매 (unsure). 알아요 = know it, 몰라요 = don't. Skipped when nothing is due.
2. **스프린트 Sprint (~6 min).** 5 questions, Korean on screen (English on demand in the first month, see 주석 below), each timed against exam pace. No feedback yet. After each answer, tap 확실 (sure) or 애매 (unsure). The mix is 2 short + 2 medium + 1 long question, at most 2 from one section, weighted toward questions you have not tried or got wrong.
3. **리뷰 Review (~4 min).** Each question's answer-card row with red-pen marks and its time, then each question with word glosses, red-pen marks, the explanation, the section's strategy card, and its vocab. Wrong and unsure questions go into the deck immediately (due the same day). 다시 풀기 reruns the wrong ones.

Today's card shows the whole set, e.g. `오늘의 세트 · 복습 3장 · 스프린트 5문제 · 약 8분`. Press **시작**: it runs the deck first (when cards are due), then the sprint on its own.

## Screens

| Screen | Route | What it does |
|---|---|---|
| 오늘 Today | `#/today` | Card panel: exam countdown as digit columns + today's set ovals with 시작; deck count, last result, weakest sections; the 50-question progress card |
| 지도 Map | `#/map` | The full answer card: 18 printed sections, one row of four ovals per question, marked from your last sprint/mock result |
| 공부 Study | `#/study/16` | One question, untimed: guess first, then explanation, vocab flashcards, grammar, practice quiz |
| 스프린트 Sprint | `#/sprint` | Today's 5 timed questions, Korean on screen (`#/sprint/retry` reruns the last review's wrong ones) |
| 리뷰 Review | `#/review/<id>` | Results of one sprint or mock; without an id, the latest session |
| 덱 Deck | `#/deck` | Due review cards (`#/deck/then-sprint` continues into the sprint) |
| 모의고사 Mock | `#/mock` | Full 70-minute mock: 46 questions in exam order, one countdown, question palette, score + per-section table |

## English on demand (주석)

English is never printed next to Korean. Every piece of Korean on every screen (passages, choices, 〈보기〉, instructions, and the app's own buttons, headings and notes) has it one gesture away:

| You want | Mouse | iPad (touch) | Keyboard |
|---|---|---|---|
| A word: romanization (when known) + English | hover the word | tap the word once | `Tab` to the sentence, `←` `→` to a word (the tooltip shows on focus) |
| A sentence or UI line: its full English right under it, Korean keyword in bold | right-click it | long-press it (hold about half a second, without moving) | `T` on a focused word |
| Hide a line | the same gesture again | the same gesture again | `T` again, or `Esc` (closes every open line) |
| Turn all of it off (exam-style) | **주석** button in the top bar | **주석** button | `G` |

- **Keyboard order:** one Tab stop per sentence (or per UI line), not per word, so the answer buttons stay close. Inside a sentence `←` and `→` move between its words (and stop at its ends); everywhere else they keep their screen job (previous/next question). `Tab` leaves the sentence.
- **Screen readers:** the word whose tooltip is open points at it with `aria-describedby`; an opened line translation is a polite `role="status"` region.
- **Words inside a button or link** show their tooltip on mouse hover only. A tap always presses the button, and those words are not extra Tab stops. Long-press works on buttons too: it shows the button's English and does **not** press it.
- **주석 off** hides both layers everywhere: no tooltips, no lines, no dotted underline, and words leave the Tab order. The choice is saved.
- **Sprint and Mock:** in the first month (the Learn phase, up to **2026-11-17**) the layer is available there too. From **2026-11-18** (the Drill phase) every sprint and mock starts with it **off**. Pressing 주석 during a run saves your choice for runs in that phase only. Editor's notes are never shown in a sprint or mock (some name the answer).
- **Notes** (chart accuracy, withheld passages, shared passages, how sentence insertion works) are no longer printed under the passage. They come with the first sentence's line translation, after a ※.
- **iPad text selection:** long-press would normally start Safari's text selection and callout menu. Sentences and translatable UI lines therefore have `-webkit-touch-callout: none` and `user-select: none` while 주석 is on, so you cannot select and copy that Korean text. Turn 주석 off (or select the English line, which stays selectable) when you need to copy.
- **Self-tests stay closed:** flashcard faces (Study vocab, the deck) and practice-quiz questions and options have no tooltips or lines, so the layer never gives the answer away.
- **Where the English comes from:** `data/sentences-102.js` (every passage sentence and most choices), `js/ui-strings.js` (the app's own copy, section labels and instructions, with a gloss per word), the word glosses in `lessons.js`, and the lessons' own English for choices, instructions and section labels. All of it is **AI translation (Claude, 2026-10-29), not human-checked.**

## The answer card (marks)

The app is drawn as the OMR answer card. Printed lines and resting ovals use `--omr-print`; your marks are ink; grading is red pen (`--pen`).

| Mark | Meaning |
|---|---|
| hollow oval | not answered yet (also a question only opened in Study) |
| ink fill + red ○ | right (also "recovered": wrong once, right later) |
| ink fill + red △ | right, but you marked it 애매 |
| ink fill + red /, red ○ on another oval | wrong; the ○ shows the right answer |
| ink fill only | your pick in a sprint or mock, not graded yet |

Layout: Study, Sprint and Mock keep one 760px reading column. From 1000px wide, Today, Map, Review and Deck use two columns.

## Keyboard shortcuts

| Where | Keys |
|---|---|
| Everywhere | `G` 주석 on/off · `T` line translation of the focused word · `Esc` closes open lines first |
| Study | `1`–`4` answer · `←` `→` previous / next question · `Esc` map |
| Sprint | `1`–`4` answer · `S` sure · `U` unsure (`Enter` / `Space` = sure) · `Esc` pause |
| Deck | `Space` / `Enter` flip · `J` or `←` 몰라요 · `K` or `→` 알아요 · `Esc` today |
| Mock | `1`–`4` answer (you can change it later) · `←` `→` previous / next · `Esc` closes the 끝내기 question |
| Review | `Esc` today |

`S` `U` `J` `K` `G` `T` also work with the Korean keyboard on. Holding a number or arrow key down does not repeat answers or page moves.

## Pace (seconds per question)

From `js/pace.js`. The whole exam at this pace is about 68 min, against 70 min allowed. In the sprint, a thin line under the header drains over this time and turns red when you go over. It never skips you ahead.

| Section | Questions | Type | Tier | Sec / Q |
|---|---|---|---|---|
| A | 1–2 | 빈칸에 알맞은 말 | short | 40 |
| B | 3–4 | 밑줄 친 부분과 의미가 비슷한 것 | short | 40 |
| C | 5–8 | 무엇에 대한 글인가? | short | 30 |
| D | 9–12 | 내용과 같은 것 | short | 60 |
| E | 13–15 | 순서에 맞게 배열한 것 | short | 60 |
| F | 16–18 | 빈칸에 알맞은 것 (문장) | medium | 70 |
| G | 19–20 | 접속 표현 · 중심 생각 | medium | 90 |
| H | 21–22 | 관용 표현 · 내용 일치 | medium | 90 |
| I | 23–24 | 인물의 심정 · 내용 일치 | medium | 80 |
| J | 25–27 | 신문 기사 제목 | medium | 60 |
| K | 28–31 | 빈칸에 알맞은 내용 | medium | 90 |
| L | 32–34 | 글의 내용과 같은 것 | long | 110 |
| M | 35–38 | 글의 주제 | long | 100 |
| N | 39–41 | 문장이 들어갈 곳 | long | 110 |
| O | 42–43 | 인물의 심정 (소설) | long | 110 |
| P | 44–45 | 빈칸 · 글의 주제 | long | 110 |
| Q | 46–47 | 필자의 태도 · 내용 일치 | long | 120 |
| R | 48–50 | 글의 목적 · 빈칸 · 내용 | long | 120 |

## The mock exam

- 46 questions in exam order. The 4 withheld-passage questions (23, 24, 42, 43) are left out.
- One **70:00** countdown on the wall clock. There is **no pause**: if you leave (나가기), your answers are saved, but the time keeps running. Back on the mock, you continue where you were. When the countdown reaches 0, the mock ends and is scored with what you answered.
- Korean on screen (주석 rules as in the sprint), no 확실/애매 step. Jump with the numbered palette and change any answer before you press **끝내기**.
- Result: score `38 / 46`, then a per-section table (questions · right · average time against pace, e.g. `1.2×` = 20 % slower). Below it, only the wrong or blank questions, with **모두 보기** to show all. Wrong answers go into the deck. Blank ones do not, since you never read them.
- Only one run can be open at a time (a sprint or a mock). Starting a mock while one is open asks first: 이어서 (continue) or 새로 시작 (start over).

## Data & storage

- **`lessons.js`** holds all content (`window.TOPIK2`: passages, choices, answers, explanations, vocab, grammar, quizzes). The app only reads it and never changes it.
- **`topik2.v2`** (localStorage): every attempt, finished sessions, settings (theme, romanization, `gloss` = 주석 on/off, `glossExam` = your 주석 choice for sprint/mock runs in the current phase), streak, the one open sprint or mock, and the retry list.
- **`topik2_srs`** (localStorage): the review deck. Leitner boxes 1–5, seen again after 1 / 2 / 4 / 8 / 16 days. 알아요 moves a card up a box; 몰라요 sends it back to box 1.
- **Old progress** (`topik2_progress`, from the earlier version of this app) is copied into `topik2.v2` once, as "seen" questions on the map. The old key is **left in place, not deleted**.
- **Safety copy:** if `topik2.v2` is unreadable or was written by a newer version, it is first copied to `topik2.v2.bak`, then reset. If that copy cannot be written, the app works from memory only and never overwrites the original.
- Every save re-reads storage first, so two open tabs do not wipe each other's records.

## Tests

```
node tests/run.js
```

Runs every `tests/*.test.js` with plain Node (no install) and prints PASS / FAIL per file:

- `deck` — review cards from deck keys, deck order, 8-card limit
- `gloss-text`: the English layer's pure parts: UI key normalizer, sentence splitter (Q1, Q9, Q39; `23.6` never splits), every passage sentence has English, Learn/Drill phase rule
- `ui-strings`: `js/ui-strings.js` has an entry for every piece of Korean UI copy in the code, and no entry nothing uses (it lists what is missing or stale)
- `pace` — time budgets and tiers
- `render` — passages, choices, escaping, routes
- `runner` — sprint and mock steps: Korean on screen, editor's notes never shown, double keys, resume, countdown, finish written once
- `session` — the daily 5-question pick
- `omr`: answer-card marks: the six question states onto the five marks, which oval gets which mark, card HTML
- `srs` — Leitner boxes
- `store` — saving, migration, backup, open runs, streak

## Content status

- **All 50 questions are loaded** (`meta.loaded = 50`).
- **Q23–Q24 and Q42–Q43:** the exam paper withholds these passages under an official copyright notice (저작권 관련 법령에 따라 … 공개하지 않습니다). Their stems, choices, answers, vocab and grammar are included. The passage is marked as not reproduced, and these four never appear in sprints or the mock.
- **Q22, Q45, Q47, Q49, Q50** share a passage with the question before them. Sprint, mock and review show that earlier full passage first.
- **Section labels were corrected on 2026-10-28** to match the real question types of the 102nd exam (e.g. M = main topic, N = sentence insertion).
- **Strategy cards (`js/strategies.js`) are AI-authored.** Check them against your own practice before you rely on them.
- Korean text was transcribed from exam screenshots. Spot-check Q9 (volunteer notice) and Q10 (chart percentages) against `raw/Topik 2/102nd-TOPIK-II-Reading-Test-Paper.pdf`.

## Answer key

`1①2①3④4④5①6③7②8①9②10④11②12①13①14②15①16②17③18①19①20④21③22③23①24④25②26②27③28④29③30②31④32①33③34④35③36③37④38④39③40②41④42②43③44②45①46③47②48④49④50③`

## File map

| File | Role |
|---|---|
| `index.html` | Page shell: top bar, `<main id="screen">`, script tags (classic scripts, so `file://` works) |
| `styles.css` | Colour/type tokens (light + dark, incl. `--omr-print`), base, top bar, page widths, buttons |
| `styles/omr.css` | The OMR answer card: ovals and red-pen marks, printed panels, timing ticks, digit columns, card grid, strips, legend |
| `styles/components.css` | Passage, oval choices, verdict, explanation folds, chips |
| `styles/translate.css` | The English layer: dotted word underline, tooltip, line translation, 주석 toggle |
| `styles/screens.css` | Screen headers, Study, Map (full answer card) |
| `styles/loop.css` | Today (card panel, rows, progress card), Sprint, Review |
| `styles/deck-mock.css` | Deck, Mock, mock review table |
| `lessons.js` | All exam content (`window.TOPIK2`), never edited by the app |
| `data/sentences-102.js` | English for every passage sentence (`window.TOPIK2_SENT`, AI-translated) |
| `js/ui-strings.js` | English for the app's own Korean copy, with per-word glosses (`window.UI_EN`, AI-translated) |
| `js/gloss-text.js` | Pure text helpers: UI key normalizer, sentence splitter, lookups (no DOM) |
| `js/translate.js` | The English layer: wraps UI words, line translations (right-click, long-press, `T`), the 주석 toggle and the Learn/Drill rule |
| `js/util.js` | Escaping, DOM lookup, lesson access, dates |
| `js/pace.js` | Seconds per question by section, tiers |
| `js/srs.js` | Leitner review boxes (`topik2_srs`) |
| `js/strategies.js` | 18 strategy cards, one per section (AI-authored) |
| `js/store.js` · `js/store-views.js` | Saved record (`topik2.v2`) and read-only views of it (status, accuracy, weakest sections) |
| `js/session.js` | Picks the daily 5 questions |
| `js/run-core.js` | Pure sprint/mock steps, countdown, finish (no DOM) |
| `js/deck-cards.js` | Turns deck keys into cards (no DOM) |
| `js/render/passage.js` · `choices.js` · `gloss.js` | Passage types (one `.sent` per sentence), oval choices with red-pen marks, word tooltip |
| `js/render/omr.js` | Answer-card marks (state to mark) and HTML builders: ovals, rows, digit columns, legend, strips (no DOM) |
| `js/screens/today.js` · `map.js` · `study.js` · `study-tabs.js` | Today, Map, Study (+ its vocab / grammar / quiz blocks) |
| `js/screens/runner.js` | Shared question view, clock, save and finish for Sprint and Mock |
| `js/screens/sprint.js` · `mock.js` · `deck.js` | Sprint, Mock, Deck screens |
| `js/screens/review.js` · `review-mock.js` | Review (sprint), plus the mock score and section table |
| `js/app.js` | Starts the app, hash router, theme switch, keys |
| `tests/` | Node tests (`node tests/run.js`); `tests/ui-copy.js` collects the UI copy for `ui-strings.test.js` |
| `legacy/` | The previous app (`index.html`, `styles.css`, `app.js`), kept for reference only |
| `lessons.js.bak-*` · `_source-notes-q21-q50.txt` | Content backups and transcription notes |

---

*AI-authored content (C) — generated by Claude Sonnet 4.6 for the korean-learning project wiki.*
*Rewritten 2026-10-28 for the redesigned app (Phase 3) by Claude Opus 5.5.*
*English-on-demand layer added 2026-10-29 by Claude Opus 5.5.*
*Exam source: 102nd 한국어능력시험 II 읽기 (2025.10.19), used for personal study.*
