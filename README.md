# TOPIK II 읽기 · 102회 study app

A study app for the **102nd TOPIK II Reading exam** (2025.10.19): all **50 questions**, with a daily 10-minute routine, a review deck, and a full timed mock exam. Plain HTML/CSS/JS. No install, no build step, no internet needed except for web fonts.

## How to open

- **Double-click `index.html`.** It runs straight from the folder (`file://`).
- Or serve the folder with any static server, e.g. `python -m http.server 8765`, then open `http://127.0.0.1:8765/`.

> [!note]
> Your progress is saved in the browser, per address. `file://…/index.html` and `http://127.0.0.1:8765/` keep **separate** records. Pick one way of opening and stick to it.

## The daily loop (~10 min, one 시작 button)

1. **덱 Deck (~2 min).** Up to 8 due review cards: words and grammar from questions you got wrong or marked 애매 (unsure). 알아요 = know it, 몰라요 = don't. Skipped when nothing is due. The two buttons wait about a third of a second after each answer, so a double-click cannot grade the next card unseen.
2. **스프린트 Sprint (~6 min).** 5 questions, Korean on screen (English on demand in the first month, see 주석 below), each timed against exam pace. No feedback yet. After each answer, tap 확실 (sure) or 애매 (unsure). The mix is 2 short + 2 medium + 1 long question, at most 2 from one section, weighted toward questions you have not tried or got wrong.
3. **리뷰 Review (~4 min).** The result sheet (점수, 정답률, 맞힌 문제) with one numbered tile per question and its time, then each question with word glosses, graded choice rows, the explanation, the section's strategy card, and its vocab. Wrong and unsure questions go into the deck immediately (due the same day). 다시 풀기 reruns the wrong ones.

Today's hero card shows the whole set, e.g. `오늘의 세트 · 복습 3장 · 스프린트 5문제 · 약 8분`. Press **시작**: it runs the deck first (when cards are due), then the sprint on its own.

## Screens

Every screen shows only its title, its data and its actions. How everything works is on one page, **사용법**.

| Screen | Route | What it does |
|---|---|---|
| 오늘 Today | `#/today` | Hero card: date and exam date, the countdown, today's set line and its questions as numbered tiles, chips (progress, accuracy, streak), 시작 / 덱만 보기. Beside it the deck, last session and weak sections; below, the 50-tile palette (a link to the map), then a quiet 기록 초기화 button (see Reset progress) |
| 지도 Map | `#/map` | One white sheet per section (18): letter, range, label, sprint accuracy, then one numbered tile per question in its state colour; a tile opens Study |
| 공부 Study | `#/study/16` | One question sheet, untimed: guess first, then graded rows, explanation, vocab flashcards, grammar, practice quiz; the section's tiles and 이전 / 지도 / 다음 |
| 스프린트 Sprint | `#/sprint` | Today's 5 timed questions with the test bar (`n / 5 풀었음`, timer chip) and progress track (`#/sprint/retry` reruns the last review's wrong ones) |
| 리뷰 Review | `#/review/<id>` | Results of one sprint or mock; without an id, the latest session |
| 덱 Deck | `#/deck` | Due review cards (`#/deck/then-sprint` continues into the sprint) |
| 모의고사 Mock | `#/mock` | Hero start screen (46 문항, 70분, 92점), then the full 70-minute mock: 46 questions in exam order, one countdown, number palette, result tiles + per-section table |
| 사용법 Guide | `#/guide` | The one help page: daily order, what each screen is for, tile colours, the English layer and the 한 / EN switch, every keyboard shortcut, where records are saved |

## The look ("IBT question sheet", DESIGN.md v2)

Every question is a white sheet on a cool blue-grey desk, laid out like the TOPIK IBT screen:

- **Sheet anatomy:** the ※ group instruction box (brand tint, 4px brand left edge), the question line (a 32px blue numbered square, the question type in bold, a `2점` chip), the passage box (tint, radius 14), then four full-width choice rows with a numbered circle.
- **The numbered square** is the one motif: the badge on every sheet, the tile on the Map and Today, today's five questions, the result strip and the run tiles.
- **Gradient** only on the numbered square, the one primary button of a screen and the hero card. **Shadow** only on sheets, the hero, the test bar and the tooltip. The header is the one glass element.
- **Type:** Lexend for titles, numbers and the timer; Plus Jakarta Sans for Latin UI text; Noto Sans KR for all Korean, passages included.
- **Light only**, like the reference mock test: a dark OS or iPad setting does not change the page. Every text colour pair passes WCAG AA (4.5:1).
- **Layout:** Study, Sprint, Mock and Review use one 884px column of sheets. From 1000px wide, Today, Map, Deck and 사용법 use two or three columns.

## Tile colours and graded rows

| Tile | Meaning |
|---|---|
| white, grey edge | not tried yet (also a question only opened in Study) |
| blue tint | answer picked in a sprint or mock, not graded yet |
| green tint | right (also "recovered": wrong once, right later) |
| red tint | wrong |
| amber tint | right, but you marked it 애매 |

The Map's colours follow your last sprint or mock result. A ring marks the question on screen. Graded choice rows: the right answer is a green row with `정답`, your wrong pick a red row with `오답`, and an amber `애매` chip when you got it right but marked it unsure. In the test bar the timer chip turns red when a sprint question goes over pace, and the mock countdown turns amber in its last 5 minutes.

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
- **Notes** (chart accuracy, withheld passages, shared passages, how sentence insertion works) are not printed under the passage. They come with the first sentence's line translation, after a ※.
- **iPad text selection:** long-press would normally start Safari's text selection and callout menu. Sentences and translatable UI lines therefore have `-webkit-touch-callout: none` and `user-select: none` while 주석 is on, so you cannot select and copy that Korean text. Turn 주석 off (or select the English line, which stays selectable) when you need to copy.
- **Self-tests stay closed:** flashcard faces (Study vocab, the deck) and practice-quiz questions and options have no tooltips or lines, so the layer never gives the answer away.
- **Where the English comes from:** `data/sentences-102.js` (every passage sentence and most choices), `js/ui-strings.js` (the app's own copy, section labels and instructions, with a gloss per word), the word glosses in `lessons.js`, and the lessons' own English for choices, instructions and section labels. All of it is **AI translation (Claude, 2026-10-29), not human-checked.**

## App language (한 / EN)

The **한 / EN** button in the top bar switches the app's own text between Korean and English: the nav, buttons, titles, labels, counts, empty states, the test bar, result tiles, deck controls and the whole 사용법 page. It never switches the TOPIK exam content (passages, the question line, the ※ group instruction, choices, 〈보기〉) or the study content (explanations, vocab, grammar, quizzes, flashcards, strategy cards). The word and line layer keeps working on all Korean that is left. Switching happens in place: the current question, your picked answer, an open run and its timer are kept. The choice is saved (`settings.uiLang` in `topik2.v2`) and applied before the first paint. The English is the same AI translation as the line layer.

## Keyboard shortcuts

| Where | Keys |
|---|---|
| Everywhere | `G` 주석 on/off · `T` line translation of the focused word · `Esc` closes open lines first |
| Study | `1`–`4` answer · `←` `→` previous / next question · `Esc` map |
| Sprint | `1`–`4` answer · `S` sure · `U` unsure (`Enter` / `Space` = sure) · `Esc` pause |
| Deck | `Space` / `Enter` flip · `J` or `←` 몰라요 · `K` or `→` 알아요 · `Esc` today |
| Mock | `1`–`4` answer (you can change it later) · `←` `→` previous / next · `Esc` closes the 끝내기 question |
| Review | `Esc` today |

`S` `U` `J` `K` `G` `T` also work with the Korean keyboard on. Holding a number or arrow key down does not repeat answers or page moves. The same list is on the 사용법 page.

## Pace (seconds per question)

From `js/pace.js`. The whole exam at this pace is about 68 min, against 70 min allowed. In the sprint, the timer chip shows the time on this question against its budget (e.g. `0:42 / 1:10`) and turns red when you go over. It never skips you ahead.

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
- The start screen is a hero card with real numbers: 46 문항, 70분, 92점 (46 questions x 2 points, each question's points read from its group instruction `(각 2점)`).
- One **70:00** countdown on the wall clock. There is **no pause**: if you leave (나가기), your answers are saved, but the time keeps running. Back on the mock, you continue where you were. When the countdown reaches 0, the mock ends and is scored with what you answered. The time per question (the pace table) counts only while the tab is visible; the countdown never stops.
- Korean on screen (주석 rules as in the sprint), no 확실/애매 step. Jump with the number palette (one tile per question, blue once answered) and change any answer before you press **끝내기**.
- Result: three tiles, 점수 in points (e.g. `76 / 92`), 정답률, 맞힌 문제 (`38 / 46`), then a per-section table (questions · right · average time against pace, e.g. `1.2×` = 20 % slower). Below it, only the wrong or blank questions, with **모두 보기** to show all; a tile in the result strip opens its question (showing all first if needed). Wrong answers go into the deck. Blank ones do not, since you never read them.
- Only one run can be open at a time (a sprint or a mock). Starting a mock while one is open asks first: 이어서 (continue) or 새로 시작 (start over).

## Reset progress (기록 초기화)

A quiet **기록 초기화** button sits at the bottom of the Today screen. It opens a dialog in two steps:

1. **Confirm:** "Delete all study progress?" with 취소 / 계속. It says what goes: answered questions, sprint and mock records, and the review deck. It cannot be undone.
2. **PIN:** a 6-digit password field (Enter submits). A wrong PIN shows an error, clears the field and deletes nothing. The right PIN deletes the progress, closes the dialog, redraws Today (0 / 50) and opens a centered done pop-up: a blue badge pops in and a white check draws itself, then 기록을 초기화했습니다 and 확인 (Escape also closes it; with reduced motion it appears without animation).

Cancel or Escape closes the dialog at any step and deletes nothing. A reset clears the attempts, the sessions, the streak, the open sprint or mock run, the retry list and the review deck. It keeps the settings (한 / EN, 주석, romanization). The `.bak` safety copies and the old `topik2_progress` key are left alone. Another open tab leaves its run on its next action, because the run is gone.

**The PIN is a guard against pressing reset by accident, not security.** It is a fixed value in `js/reset-flow.js` (one constant, in the open, in the page source) and is never shown on a screen, in the guide or here.

## Data & storage

- **`lessons.js`** holds all content (`window.TOPIK2`: passages, choices, answers, explanations, vocab, grammar, quizzes). The app only reads it and never changes it.
- **`topik2.v2`** (localStorage): every attempt, finished sessions, settings (romanization, an unused `theme` value kept from older versions, `gloss` = 주석 on/off, `glossExam` = your 주석 choice for sprint/mock runs in the current phase, `uiLang` = 한 / EN), streak, the one open sprint or mock, and the retry list.
- **`topik2_srs`** (localStorage): the review deck. Leitner boxes 1–5, seen again after 1 / 2 / 4 / 8 / 16 days. 알아요 moves a card up a box; 몰라요 sends it back to box 1.
- **Old progress** (`topik2_progress`, from the earlier version of this app) is copied into `topik2.v2` once, as "seen" questions on the map. The old key is **left in place, not deleted**.
- **Safety copy:** if `topik2.v2` is unreadable or was written by a newer version, it is first copied to `topik2.v2.bak`, then reset. If that copy cannot be written, the app works from memory only (everything you do stays until you reload) and never overwrites the original.
- **Deck check:** `topik2_srs` is validated when it is read. A root that is not an object, or a card that does not fit the record (box 1 to 5, valid due and added dates, counts), is skipped. The raw value is first copied to `topik2_srs.bak`, then the cleaned deck is written. If that copy cannot be written, the original is left alone. Once the corrupt value is gone and storage works again, the deck is written normally again. If a write fails, the deck stays in memory for the page session (grades and new cards still show; `SRS.isPersistent()` says false), until storage changes under it or a write goes through.
- Every save re-reads storage first, so two open tabs do not wipe each other's records. The open run (sprint or mock) also carries a revision that moves on whenever its answers or position change. A tab that holds an older copy of the run does not overwrite it: it shows the newer run instead (an answer clicked in the older tab at that moment is dropped).
- **One active tab writes the open run.** Each page load has a random id. The key `topik2.activeTab` (`{id, at}`) names the writer: the last tab that claimed the role. A tab claims it when it loads in the foreground, when it gets focus, when it becomes visible, when it starts a run and when you press 여기서 계속. All run saves are synchronous.
- **Claiming re-reads first.** The tab reads the stored run; if its revision differs from the tab's own, the tab shows the stored run (redrawn), so nothing the other tab did is lost.
- **A tab that is not the writer is read-only.** It sees the change through the `storage` event, or at its next click or key press. It stops its question clock, ignores answers and moves, and shows one line, `다른 탭에서 진행 중입니다` (EN: Open in another tab), with a button `여기서 계속` (Continue here) that claims, re-reads and redraws. If the run was finished or dropped in the other tab, the button opens that run's Review (or Today).
- **Pause and elapsed time are still saved on hide and on `pagehide` by the active tab**, so a single tab that goes to the background and is reloaded (Safari does this on iPad) keeps its question time. Saved study time only grows: with the same revision, the larger time per question is kept.
- **A run is finished only by the active tab, from the stored run** (a sprint only once every question is stored as answered), so a save that was refused can never end up in the record.
- **Time at a handoff:** when a tab takes over (even at the same revision) it first takes the larger clock totals from the stored run (sprint elapsed time, mock time per question), so the time before the handoff and the visible time after it both count.
- **A claim that cannot be written** (storage full) does not make a tab the writer: while the readable key names another tab, this tab stays read-only and cannot save or finish the run.
- Still open: if no tab is named (key removed or unreadable), every tab may write, as before. Two tabs that claim in the same instant are sorted out by the revision check: the later write is refused and that tab shows the stored run. The question time a tab spends between the other tab's takeover and its own next save is not kept. Starting or discarding a run and the Study screen's attempts are not gated by the writer role.
- A finished run is final: finishing the same sprint or mock again in another tab changes nothing.

## Tests

```
node tests/run.js
```

Runs every `tests/*.test.js` with plain Node (no install) and prints PASS / FAIL per file:

- `deck`: review cards from deck keys, deck order, 8-card limit, grading without a flip and the short grade lock
- `gloss-text`: the English layer's pure parts: UI key normalizer, sentence splitter (Q1, Q9, Q39; `23.6` never splits), every passage sentence has English, Learn/Drill phase rule
- `ui-strings`: `js/ui-strings.js` has an entry for every piece of Korean UI copy in the code (the 사용법 page included), and no entry nothing uses (it lists what is missing or stale)
- `ui-lang`: the 한 / EN switch: Korean by default, a saved `en` kept (old records read as Korean), UI text to English, and exam content never switched
- `pace`: time budgets and tiers
- `render`: passages, choices (exam rows and graded rows), escaping, routes (including `#/guide`)
- `runner`: sprint and mock steps: Korean on screen, editor's notes never shown, double keys, resume, countdown, finish written once (a finished session id is final), hidden-tab timing, the revision of the open run and the tab's copy after a save
- `session`: the daily 5-question pick
- `tiles`: the six question states onto the five tile states, attempts and picks, points per question, square/tile/question-line HTML, run tiles, Map and Today palette, and the 사용법 page (every screen, colour and shortcut)
- `srs`: Leitner boxes, corrupt-deck handling, its backup and recovery
- `store`: saving, migration, backup, open runs and their revision (stale tab never overwrites), time that never goes backwards, streak
- `reset-flow`: the PIN check accepts only the exact PIN, the reset clears progress and the deck and keeps settings, the dialog markup (native dialog, 6-digit password field, labels, buttons), and the PIN appears in no readable file
- `xtab`: two tabs on one run: only the active tab writes, claiming re-reads and adopts a newer run, a stale copy is still refused, single-tab hide then reload keeps the elapsed time, a re-pick after a remount is kept, a sprint cannot finish from a refused save, no storage or an unwritable claim leaves a tab working alone

## Content status

- **All 50 questions are loaded** (`meta.loaded = 50`).
- **Q23–Q24 and Q42–Q43:** the exam paper withholds these passages under an official copyright notice (저작권 관련 법령에 따라 … 공개하지 않습니다). Their stems, choices, answers, vocab and grammar are included. The passage is marked as not reproduced, and these four never appear in sprints or the mock.
- **Q22, Q45, Q47, Q49, Q50** share a passage with the question before them. Sprint, mock and review show that earlier full passage first.
- **Section labels were corrected on 2026-10-28** to match the real question types of the 102nd exam (e.g. M = main topic, N = sentence insertion). The question line on each sheet shows this label (the data holds no per-question stem).
- **Strategy cards (`js/strategies.js`) are AI-authored.** Check them against your own practice before you rely on them.
- Korean text was transcribed from exam screenshots. Spot-check Q9 (volunteer notice) and Q10 (chart percentages) against `raw/Topik 2/102nd-TOPIK-II-Reading-Test-Paper.pdf`.

## Answer key

`1①2①3④4④5①6③7②8①9②10④11②12①13①14②15①16②17③18①19①20④21③22③23①24④25②26②27③28④29③30②31④32①33③34④35③36③37④38④39③40②41④42②43③44②45①46③47②48④49④50③`

## File map

| File | Role |
|---|---|
| `index.html` | Page shell: top bar (nav, 주석, 한 / EN), `<main id="screen">`, script tags (classic scripts, so `file://` works), pre-paint language |
| `styles.css` | Colour and type tokens (light only), base, header, page widths, motion, print |
| `styles/controls.css` | Buttons, toggles, the numbered square, tiles, point and state chips, test bar, progress track |
| `styles/sheet.css` | Sheet, hero card, ※ instruction box, question line, passage box, 〈보기〉, choice rows, verdict, folds, explanation, vocab chips |
| `styles/translate.css` | The English layer: dotted word underline, tooltip, line translation |
| `styles/screens.css` | Screen headers, Study (pager, tiles, flashcards, grammar, quiz), Map, 사용법 |
| `styles/loop.css` | Today (hero, side sheet, palette), Sprint, Review (result sheet, tiles, blocks) |
| `styles/deck-mock.css` | Deck, Mock, mock review table |
| `lessons.js` | All exam content (`window.TOPIK2`), never edited by the app |
| `data/sentences-102.js` | English for every passage sentence (`window.TOPIK2_SENT`, AI-translated) |
| `js/ui-strings.js` | English for the app's own Korean copy, with per-word glosses (`window.UI_EN`, AI-translated) |
| `js/gloss-text.js` | Pure text helpers: UI key normalizer, sentence splitter, lookups (no DOM) |
| `js/translate.js` | The English layer: wraps UI words, line translations (right-click, long-press, `T`), the 주석 toggle and the Learn/Drill rule |
| `js/ui-lang.js` | The 한 / EN switch: UI text to English and back in place, exam and study content kept |
| `js/util.js` | Escaping, DOM lookup, lesson access, dates |
| `js/pace.js` | Seconds per question by section, tiers |
| `js/srs.js` | Leitner review boxes (`topik2_srs`), `SRS.reset()` for 기록 초기화 |
| `js/reset-flow.js` | 기록 초기화, pure part: the PIN check and `resetAll` (no DOM) |
| `js/strategies.js` | 18 strategy cards, one per section (AI-authored) |
| `js/store.js` · `js/store-views.js` | Saved record (`topik2.v2`) and read-only views of it (status, accuracy, weakest sections) |
| `js/session.js` | Picks the daily 5 questions |
| `js/run-core.js` | Pure sprint/mock steps, countdown, finish (no DOM) |
| `js/deck-cards.js` | Turns deck keys into cards (no DOM) |
| `js/render/passage.js` · `choices.js` · `gloss.js` | Passage types (one `.sent` per sentence), choice rows (exam and graded), word tooltip |
| `js/render/tiles.js` | Question state to tile state, points per question, and HTML builders: numbered square, tile, tile list, question line (no DOM) |
| `js/screens/today.js` · `map.js` · `study.js` · `study-tabs.js` | Today, Map, Study (+ its vocab / grammar / quiz blocks) |
| `js/screens/reset-dialog.js` | The 기록 초기화 control, its confirm + PIN `<dialog>` and the animated done pop-up on Today |
| `js/screens/runner.js` | Shared question sheet, test bar, progress track, run tiles, clock, save and finish for Sprint and Mock |
| `js/screens/sprint.js` · `mock.js` · `deck.js` | Sprint, Mock, Deck screens |
| `js/screens/review.js` · `review-mock.js` | Review (result sheet, blocks), plus the mock time line and section table |
| `js/screens/guide.js` | 사용법, the one help page |
| `js/app.js` | Starts the app, hash router, keys, header height for the sticky test bar |
| `tests/` | Node tests (`node tests/run.js`); `tests/ui-copy.js` collects the UI copy for `ui-strings.test.js` |
| `legacy/` | The previous app (`index.html`, `styles.css`, `app.js`), kept for reference only |
| `lessons.js.bak-*` · `_source-notes-q21-q50.txt` | Content backups and transcription notes |

---

*AI-authored content (C), generated by Claude Sonnet 4.6 for the korean-learning project wiki.*
*Rewritten 2026-10-28 for the redesigned app (Phase 3) by Claude Opus 5.5.*
*English-on-demand layer added 2026-10-29 by Claude Opus 5.5.*
*"IBT question sheet" restyle, the 사용법 page and the 한 / EN switch added 2026-10-29 by Claude Opus 5.5.*
*Exam source: 102nd 한국어능력시험 II 읽기 (2025.10.19), used for personal study.*
