// TOPIK II 읽기 — 102nd Exam (2025.10.19) — Interactive Lesson Content
// Q1–Q20 of 50. Remaining questions added in subsequent batches.
// Answer key: 1①2①3④4④5①6③7②8①9②10④ ...50③

window.TOPIK2 = {
  meta: {
    exam: "102nd TOPIK II Reading (2025.10.19)",
    total: 50,
    loaded: 50,
    answerKey: {
      1:1, 2:1, 3:4, 4:4, 5:1, 6:3, 7:2, 8:1, 9:2, 10:4,
      11:2, 12:1, 13:1, 14:2, 15:1, 16:2, 17:3, 18:1, 19:1, 20:4,
      21:3, 22:3, 23:1, 24:4, 25:2, 26:2, 27:3, 28:4, 29:3, 30:2,
      31:4, 32:1, 33:3, 34:4, 35:3, 36:3, 37:4, 38:4, 39:3, 40:2,
      41:4, 42:2, 43:3, 44:2, 45:1, 46:3, 47:2, 48:4, 49:4, 50:3
    }
  },

  sections: [
    { id:"A", label:"[1–2] 빈칸에 알맞은 말", sublabel:"Fill in the blank", type:"blank-grammar", range:[1,2] },
    { id:"B", label:"[3–4] 밑줄 친 부분과 의미가 비슷한 것", sublabel:"Similar meaning to underlined", type:"similar-meaning", range:[3,4] },
    { id:"C", label:"[5–8] 무엇에 대한 글인가?", sublabel:"What is this text about?", type:"topic-id", range:[5,8] },
    { id:"D", label:"[9–12] 내용과 같은 것", sublabel:"What matches the text/graph?", type:"content-match", range:[9,12] },
    { id:"E", label:"[13–15] 순서에 맞게 배열한 것", sublabel:"Put sentences in order", type:"sentence-order", range:[13,15] },
    { id:"F", label:"[16–18] 빈칸에 알맞은 것 (문장)", sublabel:"Fill in blank (longer passage)", type:"passage-blank", range:[16,18] },
    { id:"G", label:"[19–20] 접속 표현 · 중심 생각", sublabel:"Linking word + main idea", type:"connector-claim", range:[19,20] },
    { id:"H", label:"[21–22] 관용 표현 · 내용 일치", sublabel:"Idiom blank + matching fact", type:"idiom-match", range:[21,22] },
    { id:"I", label:"[23–24] 인물의 심정 · 내용 일치", sublabel:"Narrator feeling + story facts", type:"feeling-match", range:[23,24] },
    { id:"J", label:"[25–27] 신문 기사 제목", sublabel:"Explain the newspaper headline", type:"headline", range:[25,27] },
    { id:"K", label:"[28–31] 빈칸에 알맞은 내용", sublabel:"Fill the blank (explanation text)", type:"argument-blank", range:[28,31] },
    { id:"L", label:"[32–34] 글의 내용과 같은 것", sublabel:"Match the facts (longer text)", type:"academic-match", range:[32,34] },
    { id:"M", label:"[35–38] 글의 주제", sublabel:"Main topic (opinion text)", type:"main-topic", range:[35,38] },
    { id:"N", label:"[39–41] 문장이 들어갈 곳", sublabel:"Insert the given sentence", type:"sentence-insertion", range:[39,41] },
    { id:"O", label:"[42–43] 인물의 심정 (소설)", sublabel:"Character feeling + story facts (novel)", type:"feeling-match", range:[42,43] },
    { id:"P", label:"[44–45] 빈칸 · 글의 주제", sublabel:"Blank + main idea", type:"blank-topic", range:[44,45] },
    { id:"Q", label:"[46–47] 필자의 태도 · 내용 일치", sublabel:"Writer attitude + matching fact", type:"attitude-match", range:[46,47] },
    { id:"R", label:"[48–50] 글의 목적 · 빈칸 · 내용", sublabel:"Purpose + blank + fact (long text)", type:"purpose-blank-match", range:[48,50] }
  ],

  lessons: {

    // ─────────────────────────────────────────────
    // Q1 · Fill in the Blank · -(으)ㄴ 지
    // ─────────────────────────────────────────────
    Q1: {
      num: 1,
      type: "blank-grammar",
      section: "A",
      passageType: "sentence",
      groupInstruction: {
        kr: "[1~2] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate word/phrase to fill in the blank. (2 points each)"
      },
      passageTokens: [
        { kr:"이", roman:"i", en:"this" },
        { kr:"동네로", roman:"dong-ne-ro", en:"to this neighborhood" },
        { kr:"이사를", roman:"i-sa-reul", en:"moving house [object]" },
        { kr:"(　　)", roman:"(blank)", en:"[BLANK]", isBlank:true },
        { kr:"일", roman:"il", en:"one" },
        { kr:"년이", roman:"nyeon-i", en:"year [subject]" },
        { kr:"됐다", roman:"dwaessda", en:"has become / has passed" }
      ],
      choices: [
        { num:1, kr:"온 지", roman:"on ji", en:"since (I) came", correct:true },
        { num:2, kr:"올 때", roman:"ol ttae", en:"when (I) come / at the time of coming", correct:false },
        { num:3, kr:"오거나", roman:"o-geo-na", en:"come or (do something else)", correct:false },
        { num:4, kr:"오다가", roman:"o-da-ga", en:"while coming (but stopped partway)", correct:false }
      ],
      answer: 1,
      whyRight: `The pattern <b>-(으)ㄴ 지 + time + 되다/지나다</b> means "it has been [time] since [action]." Here: <em>이사를 온 지 일 년이 됐다</em> = "It has been one year since I moved here." The key signal is <em>일 년이 됐다</em> (one year has passed), which demands an elapsed-time connector — only 온 지 provides this.`,
      whyWrong: {
        "2": `<b>-(으)ㄹ 때</b> means "when/at the moment of doing." It marks a specific point in time, not elapsed time. ✗ 이사를 올 때 일 년이 됐다 doesn't make sense.`,
        "3": `<b>-거나</b> means "or" — it connects alternatives (e.g., 가거나 오거나 = "go or come"). It doesn't connect to a time result.`,
        "4": `<b>-다가</b> means "while doing something and then stopping midway." It implies interruption, e.g., 밥을 먹다가 잠들었다 (fell asleep while eating). Moving is already complete, so -다가 doesn't fit.`
      },
      vocab: [
        { kr:"동네", roman:"dong-ne", en:"neighborhood, local area", note:"Used for smaller residential areas, like a block or district" },
        { kr:"이사", roman:"i-sa", en:"moving (to a new home)" },
        { kr:"이사하다", roman:"i-sa-ha-da", en:"to move (homes)" },
        { kr:"년", roman:"nyeon", en:"year (counter for years)" },
        { kr:"되다", roman:"doe-da", en:"to become; (with time) to pass/elapse" }
      ],
      grammar: [
        {
          pattern: "-(으)ㄴ 지 + 시간 표현 + 되다/지나다",
          plainEnglish: `Expresses how much time has passed since a completed action. Structure: [verb past modifier] 지 [time] 됐다/지났다. Think of 지 as "since." The action before 지 happened in the past; you're measuring how long ago.`,
          examples: [
            { kr:"결혼한 지 3년이 됐어요.", roman:"Gyeolhon-han ji sam-nyeon-i dwaesseoyo.", en:"It has been 3 years since I got married." },
            { kr:"한국에 온 지 6개월이 지났어요.", roman:"Hanguk-e on ji yuk-gae-wol-i jinaesseoyo.", en:"6 months have passed since I came to Korea." },
            { kr:"밥을 먹은 지 2시간 됐어요.", roman:"Bab-eul meo-geun ji du-si-gan dwaesseoyo.", en:"It has been 2 hours since I ate." }
          ],
          commonMistake: `Don't confuse with -을 때 (when doing): '먹은 지 2시간' = 2 hours have passed since eating. '먹을 때' = at the moment I eat. Also, don't confuse 지 here with the sentence-ending particle 지 (= isn't it? / right?).`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does the pattern '-(으)ㄴ 지 + time + 됐다' express?`,
          choices: ["Elapsed time since a past action", "The exact moment an action happens", "Duration while an action is ongoing", "A condition before an action starts"],
          answer: 0,
          explain: `-(으)ㄴ 지 + time + 되다/지나다 measures how much time has passed since a completed action. '공부한 지 1시간 됐다' = it has been 1 hour since I started studying.`
        },
        {
          kind: "mcq",
          q: `Which sentence correctly uses -(으)ㄴ 지?`,
          choices: ["서울에 온 지 3년이 됐어요.", "서울에 올 때 3년이 됐어요.", "서울에 오거나 3년이 됐어요.", "서울에 오다가 3년이 됐어요."],
          answer: 0,
          explain: `Only '온 지 3년이 됐어요' fits — '온' (came, past modifier) + '지' (since) + '3년이 됐어요' (3 years have passed).`
        },
        {
          kind: "translate",
          q: `Translate: '이 회사에서 일한 지 5년이 됐다.'`,
          answer: `It has been 5 years since I started working at this company.`,
          explain: `일한 (worked, past modifier) + 지 (since) + 5년이 됐다 (5 years have passed).`
        },
        {
          kind: "mcq",
          q: `Choose the correct form to fill in: 대학교를 졸업한 ( ) 2년이 지났어요.`,
          choices: ["지", "때", "거나", "다가"],
          answer: 0,
          explain: `'지' is needed here: 졸업한 지 2년이 지났어요 = 2 years have passed since graduation.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q2 · Fill in the Blank · -아/어 가다
    // ─────────────────────────────────────────────
    Q2: {
      num: 2,
      type: "blank-grammar",
      section: "A",
      passageType: "sentence",
      groupInstruction: {
        kr: "[1~2] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate word/phrase to fill in the blank. (2 points each)"
      },
      passageTokens: [
        { kr:"가을이", roman:"ga-eu-ri", en:"autumn [subject]" },
        { kr:"되면서", roman:"doe-myeon-seo", en:"as it becomes / while becoming" },
        { kr:"나뭇잎", roman:"na-mun-nip", en:"tree leaves, foliage" },
        { kr:"색이", roman:"saek-i", en:"color [subject]" },
        { kr:"점점", roman:"jeom-jeom", en:"gradually, more and more" },
        { kr:"붉게", roman:"bulg-e", en:"redly, turning red" },
        { kr:"(　　)", roman:"(blank)", en:"[BLANK]", isBlank:true }
      ],
      choices: [
        { num:1, kr:"변해 간다", roman:"byeon-hae gan-da", en:"is gradually changing (toward red)", correct:true },
        { num:2, kr:"변할 뻔했다", roman:"byeon-hal ppeon-haess-da", en:"almost changed (but didn't)", correct:false },
        { num:3, kr:"변한 척했다", roman:"byeon-han cheok-haess-da", en:"pretended to have changed", correct:false },
        { num:4, kr:"변하면 된다", roman:"byeon-ha-myeon doen-da", en:"it's fine/okay to change", correct:false }
      ],
      answer: 1,
      whyRight: `The clue is <b>점점</b> (gradually, more and more) — the sentence is describing a progressive, ongoing change. The pattern <b>-아/어 가다</b> expresses a state that is gradually changing or an action that is progressing toward a result. <em>점점 붉게 변해 간다</em> = "is gradually turning more and more red." This is the only choice that matches the ongoing-process meaning.`,
      whyWrong: {
        "2": `<b>-을 뻔하다</b> means "almost did (but didn't actually happen)." This implies the change was narrowly avoided — but the sentence with 점점 (gradually) is describing something actually happening, not a near-miss.`,
        "3": `<b>-은 척하다</b> means "to pretend to." Tree leaves cannot have intentions or pretend. The subject (나뭇잎 색이) is inanimate — this form is only for things that can act intentionally.`,
        "4": `<b>-으면 된다</b> means "it's okay/acceptable to do X" or "all you need to do is X." It expresses permission or a minimal requirement — not an ongoing natural process.`
      },
      vocab: [
        { kr:"가을", roman:"ga-eul", en:"autumn, fall" },
        { kr:"나뭇잎", roman:"na-mun-nip", en:"tree leaf/leaves" },
        { kr:"색", roman:"saek", en:"color" },
        { kr:"점점", roman:"jeom-jeom", en:"gradually, more and more, increasingly" },
        { kr:"붉다", roman:"bulg-da", en:"to be red (especially deep/rusty red)" },
        { kr:"변하다", roman:"byeon-ha-da", en:"to change, to transform" }
      ],
      grammar: [
        {
          pattern: "-아/어 가다",
          plainEnglish: `Attached to a verb stem, -아/어 가다 expresses a gradual change or progression moving toward a result. Think of it as 'is in the process of V-ing (toward a new state).' Often paired with 점점 (gradually) or 계속 (continuously).`,
          examples: [
            { kr:"날씨가 점점 따뜻해 가요.", roman:"Nalssi-ga jeom-jeom tta-tteu-tae ga-yo.", en:"The weather is gradually getting warmer." },
            { kr:"아이가 빠르게 자라 가고 있어요.", roman:"A-i-ga bba-reu-ge ja-ra ga-go i-sseo-yo.", en:"The child is growing up quickly." },
            { kr:"일이 잘 풀려 가고 있어요.", roman:"I-ri jal pul-lyeo ga-go i-sseo-yo.", en:"Things are going well / working out nicely." }
          ],
          commonMistake: `Don't confuse with -아/어 오다 (change coming toward now, from past to present): '날씨가 따뜻해 왔다' = it has been getting warmer (looking back). -아/어 가다 looks forward (progressing toward a future state).`
        },
        {
          pattern: "-을 뻔하다",
          plainEnglish: `Expresses that something almost happened but didn't. Always describes a near-miss.`,
          examples: [
            { kr:"계단에서 넘어질 뻔했어요.", roman:"Gye-dan-e-seo neo-meo-jil ppeon-haess-eo-yo.", en:"I almost fell on the stairs (but didn't)." }
          ],
          commonMistake: `The action described did NOT actually happen. '죽을 뻔했다' = almost died (but survived).`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does -아/어 가다 express?`,
          choices: ["A gradual, ongoing change toward a result", "An action that almost happened", "Pretending to do something", "Permission to do something"],
          answer: 0,
          explain: `-아/어 가다 = gradual progression/change toward a new state. Key signal: often paired with 점점 (gradually).`
        },
        {
          kind: "mcq",
          q: `Which sentence uses -아/어 가다 correctly?`,
          choices: ["겨울이 되면서 날씨가 추워 간다.", "겨울이 되면서 날씨가 추울 뻔했다.", "겨울이 되면서 날씨가 추운 척했다.", "겨울이 되면서 날씨가 추우면 된다."],
          answer: 0,
          explain: `'추워 간다' = is gradually getting cold → the natural/correct choice to describe seasonal temperature change.`
        },
        {
          kind: "mcq",
          q: `'시험에 떨어질 뻔했어요' means:`,
          choices: ["I almost failed the exam (but didn't)", "I am gradually failing", "I pretended to fail", "It's okay if I fail"],
          answer: 0,
          explain: `-을 뻔하다 = almost did X (but ultimately didn't). So '떨어질 뻔했다' = almost failed, but passed.`
        },
        {
          kind: "translate",
          q: `Translate: '한국어 실력이 점점 늘어 가고 있어요.'`,
          answer: `My Korean skills are gradually improving.`,
          explain: `늘어 가다 = gradually increasing. 점점 = gradually. 실력 = skill/ability.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q3 · Similar Meaning · -을지도 모르다 ≈ -을 수도 있다
    // ─────────────────────────────────────────────
    Q3: {
      num: 3,
      type: "similar-meaning",
      section: "B",
      passageType: "sentence",
      groupInstruction: {
        kr: "[3~4] 밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오. (각 2점)",
        en: "Choose the phrase most similar in meaning to the underlined part. (2 points each)"
      },
      passageTokens: [
        { kr:"지금", roman:"ji-geum", en:"now, right now" },
        { kr:"출발하지", roman:"chul-bal-ha-ji", en:"depart [negation connector]" },
        { kr:"않으면", roman:"an-eu-myeon", en:"if (we) don't" },
        { kr:"약속", roman:"yak-ssok", en:"appointment, promise, plan" },
        { kr:"시간에", roman:"si-gan-e", en:"to the time, by the scheduled time" },
        { kr:"늦을지도 모른다", roman:"neu-jeul-ji-do mo-reu-n-da", en:"might be late", isUnderline:true }
      ],
      underlineText: "늦을지도 모른다",
      choices: [
        { num:1, kr:"늦는 셈이다", roman:"neun-neun sem-i-da", en:"it amounts to being late / practically late already", correct:false },
        { num:2, kr:"늦어도 된다", roman:"neu-jeo-do doen-da", en:"it's okay to be late / being late is fine", correct:false },
        { num:3, kr:"늦을 리가 없다", roman:"neu-jeul ri-ga eop-da", en:"there's no way (we'll) be late / impossible to be late", correct:false },
        { num:4, kr:"늦을 수도 있다", roman:"neu-jeul su-do it-da", en:"might possibly be late / there's a chance of being late", correct:true }
      ],
      answer: 4,
      whyRight: `<b>-을지도 모르다</b> = "might, may perhaps" — expresses uncertainty about a possible future outcome. <b>-을 수도 있다</b> = "might, there's also a possibility that" — also expresses possibility/uncertainty. Both convey: "there is a chance this will happen, but I'm not sure." These are near-synonyms for expressing possibility.`,
      whyWrong: {
        "1": `<b>-는 셈이다</b> means "it is practically X / it amounts to X." It describes the current situation as equivalent to something — e.g., "you practically already know it." This describes an equivalence, NOT future uncertainty.`,
        "2": `<b>-아/어도 된다</b> means "it's okay/permitted to do X." This expresses permission — the complete OPPOSITE of the original meaning (which is a warning about being late).`,
        "3": `<b>-을 리가 없다</b> means "there's no way / impossible." This also expresses the OPPOSITE of possibility — it denies any chance of being late.`
      },
      vocab: [
        { kr:"출발하다", roman:"chul-bal-ha-da", en:"to depart, to set out, to leave" },
        { kr:"약속", roman:"yak-ssok", en:"appointment, promise, plan, commitment" },
        { kr:"시간", roman:"si-gan", en:"time; hour" },
        { kr:"늦다", roman:"neut-da", en:"to be late; to be slow" }
      ],
      grammar: [
        {
          pattern: "-을지도 모르다",
          plainEnglish: `Expresses uncertainty about a possible outcome — 'might, may, perhaps.' The speaker isn't sure whether the action/state will happen. Often implies a slight concern or warning.`,
          examples: [
            { kr:"비가 올지도 몰라요.", roman:"Bi-ga ol-ji-do mol-la-yo.", en:"It might rain." },
            { kr:"그 사람은 이미 갔을지도 몰라요.", roman:"Geu sa-ram-eun i-mi ga-sseul-ji-do mol-la-yo.", en:"That person might have already left." }
          ],
          commonMistake: `This expresses POSSIBILITY (something might happen). Don't confuse with -을 리가 없다 (impossibility: no way it will happen).`
        },
        {
          pattern: "-을 수도 있다",
          plainEnglish: `Also expresses possibility — 'might, could also be the case that.' Very similar in meaning to -을지도 모르다, but slightly more neutral (less of a worried/warning tone).`,
          examples: [
            { kr:"그게 사실일 수도 있어요.", roman:"Geu-ge sa-sil-il su-do i-sseo-yo.", en:"That might also be true." },
            { kr:"제가 틀렸을 수도 있어요.", roman:"Je-ga teul-lyeo-sseul su-do i-sseo-yo.", en:"I might have been wrong." }
          ],
          commonMistake: `Compare to -을 수 있다 (can / is possible) vs -을 수도 있다 (might also / there's also a chance). The 도 adds 'also' nuance.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Which phrase has the SAME meaning as '-을지도 모른다'?`,
          choices: ["-을 수도 있다", "-을 리가 없다", "-는 셈이다", "-아도 된다"],
          answer: 0,
          explain: `Both -을지도 모르다 and -을 수도 있다 express possibility/uncertainty: 'might happen.' The others express impossibility, equivalence, and permission respectively.`
        },
        {
          kind: "mcq",
          q: `'그 식당은 오늘 문을 닫았을지도 몰라요.' means:`,
          choices: ["That restaurant might be closed today.", "That restaurant is definitely closed today.", "It's okay if that restaurant is closed.", "That restaurant cannot be closed today."],
          answer: 0,
          explain: `-을지도 모르다 = might. '닫았을지도 몰라요' = might have closed = might be closed.`
        },
        {
          kind: "mcq",
          q: `Which sentence expresses IMPOSSIBILITY (the opposite of -을지도 모르다)?`,
          choices: ["늦을 리가 없다", "늦을 수도 있다", "늦을지도 모른다", "늦어도 된다"],
          answer: 0,
          explain: `-을 리가 없다 = 'no way / impossible.' It denies any possibility, which is the opposite of -을지도 모르다.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q4 · Similar Meaning · -은/는 대로 ≈ -은 것과 같이
    // ─────────────────────────────────────────────
    Q4: {
      num: 4,
      type: "similar-meaning",
      section: "B",
      passageType: "sentence",
      groupInstruction: {
        kr: "[3~4] 밑줄 친 부분과 의미가 가장 비슷한 것을 고르십시오. (각 2점)",
        en: "Choose the phrase most similar in meaning to the underlined part. (2 points each)"
      },
      passageTokens: [
        { kr:"전문가들이", roman:"jeon-mun-ga-deu-ri", en:"experts [subject]" },
        { kr:"예상한 대로", roman:"ye-sang-han dae-ro", en:"as (they) predicted / just as predicted", isUnderline:true },
        { kr:"농산물", roman:"nong-san-mul", en:"agricultural products, farm produce" },
        { kr:"가격이", roman:"ga-gyeok-i", en:"price [subject]" },
        { kr:"떨어지고", roman:"tteo-reo-ji-go", en:"falling (and...)" },
        { kr:"있다", roman:"it-da", en:"is/are [progressive]" }
      ],
      underlineText: "예상한 대로",
      choices: [
        { num:1, kr:"예상한 탓에", roman:"ye-sang-han tat-e", en:"because of the prediction / due to having predicted", correct:false },
        { num:2, kr:"예상하는 동안에", roman:"ye-sang-ha-neun dong-an-e", en:"while in the process of predicting", correct:false },
        { num:3, kr:"예상하기만 하면", roman:"ye-sang-ha-gi-man ha-myeon", en:"as long as / if only (they) predict", correct:false },
        { num:4, kr:"예상한 것과 같이", roman:"ye-sang-han geot-gwa ga-chi", en:"just like what (they) predicted / same as (their) prediction", correct:true }
      ],
      answer: 4,
      whyRight: `<b>-은/는 대로</b> = "as / just as / in the same way as [verb]." It means reality matches a description exactly. <b>-은 것과 같이</b> = "just like / in the same way as" — also expresses that the outcome matches a reference. Both mean: the agricultural prices are falling exactly as the experts said they would.`,
      whyWrong: {
        "1": `<b>-은 탓에</b> expresses CAUSE with a negative nuance — 'because of X (and it caused a bad result).' The original doesn't express causation; it expresses correspondence/matching.`,
        "2": `<b>-는 동안에</b> = 'while / during the time of.' This expresses a time period (simultaneous actions), not a match between prediction and reality.`,
        "3": `<b>-기만 하면</b> = 'as long as / if only.' This is a conditional expression — 'if they only predict, then...' It doesn't express correspondence.`
      },
      vocab: [
        { kr:"전문가", roman:"jeon-mun-ga", en:"expert, specialist, professional" },
        { kr:"예상하다", roman:"ye-sang-ha-da", en:"to predict, to expect, to anticipate" },
        { kr:"농산물", roman:"nong-san-mul", en:"agricultural products, farm produce" },
        { kr:"가격", roman:"ga-gyeok", en:"price, cost" },
        { kr:"떨어지다", roman:"tteo-reo-ji-da", en:"to fall, to drop, to decrease" }
      ],
      grammar: [
        {
          pattern: "-(으)ㄴ/는 대로",
          plainEnglish: `Means 'as / just as / exactly like.' Expresses that an action or state matches the description before 대로 precisely. Can also mean 'as soon as' (after verbs of action) — context determines which.`,
          examples: [
            { kr:"선생님이 말씀하신 대로 하세요.", roman:"Seon-saeng-nim-i mal-sseum-ha-sin dae-ro ha-se-yo.", en:"Please do it as the teacher said." },
            { kr:"계획한 대로 진행이 됐어요.", roman:"Gye-hoek-han dae-ro jin-haeng-i dwaess-eo-yo.", en:"It went just as planned." },
            { kr:"집에 도착하는 대로 연락해요.", roman:"Jib-e do-chak-ha-neun dae-ro yeol-lak-hae-yo.", en:"Contact me as soon as you arrive home." }
          ],
          commonMistake: `-(으)ㄴ 대로 (past modifier + 대로) = 'just as [completed action].' -는 대로 (present modifier + 대로) = 'as soon as [action happens].' The modifier form changes the meaning!`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does '예상한 대로' mean in this sentence?`,
          choices: ["Just as predicted / exactly as they expected", "Because of the prediction", "While predicting", "If they predict"],
          answer: 0,
          explain: `대로 = 'as / just as.' 예상한 대로 = just as (they) predicted.`
        },
        {
          kind: "mcq",
          q: `Choose the sentence where 대로 means 'as soon as' (not 'just as'):`,
          choices: ["집에 오는 대로 전화해요.", "계획한 대로 일이 됐어요.", "예상한 대로 결과가 나왔어요.", "말한 대로 해 주세요."],
          answer: 0,
          explain: `'오는 대로' (present modifier 는 + 대로) = 'as soon as (you) come.' The others use past modifier -(으)ㄴ + 대로 = 'just as.'`
        },
        {
          kind: "mcq",
          q: `Which has the SAME meaning as '-은 대로'?`,
          choices: ["-은 것과 같이", "-은 탓에", "-는 동안에", "-기만 하면"],
          answer: 0,
          explain: `'-은 것과 같이' = just like / same as → same meaning as '-은 대로.' The others express cause, duration, and condition respectively.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q5 · Topic Identification · Shoes Advertisement
    // ─────────────────────────────────────────────
    Q5: {
      num: 5,
      type: "topic-id",
      section: "C",
      passageType: "ad",
      groupInstruction: {
        kr: "[5~8] 다음은 무엇에 대한 글인지 고르십시오. (각 2점)",
        en: "Choose what the following text is about. (2 points each)"
      },
      passageLines: [
        { kr:"걸을 때 발이 편하게~", roman:"Geo-reul ttae ba-ri pyeon-ha-ge~", en:"Comfortable for your feet when walking~" },
        { kr:"가볍고 디자인도 예뻐요.", roman:"Ga-byeop-go di-ja-in-do ye-ppeo-yo.", en:"Light weight, and the design is pretty too." }
      ],
      choices: [
        { num:1, kr:"구두", roman:"gu-du", en:"dress shoes / formal footwear", correct:true },
        { num:2, kr:"우산", roman:"u-san", en:"umbrella", correct:false },
        { num:3, kr:"지갑", roman:"ji-gap", en:"wallet / purse", correct:false },
        { num:4, kr:"선풍기", roman:"seon-pung-gi", en:"electric fan", correct:false }
      ],
      answer: 1,
      whyRight: `Two strong clues: (1) <b>발이 편하다</b> (comfortable for feet) — only footwear can be comfortable for your feet. (2) <b>가볍다</b> (light weight) + <b>디자인이 예쁘다</b> (pretty design) — typical selling points for dress shoes/fashion shoes. The text is a shoe advertisement.`,
      whyWrong: {
        "2": `우산 (umbrella) protects from rain — not related to foot comfort. 'Comfortable for feet when walking' and 'pretty design' don't describe umbrellas.`,
        "3": `지갑 (wallet) holds money — not related to feet or walking comfort. A wallet has a design but it's not described as 'light for walking.'`,
        "4": `선풍기 (electric fan) makes air — not related to feet or walking at all.`
      },
      vocab: [
        { kr:"걷다", roman:"geot-da", en:"to walk" },
        { kr:"발", roman:"bal", en:"foot, feet" },
        { kr:"편하다", roman:"pyeon-ha-da", en:"to be comfortable, convenient, relaxed" },
        { kr:"가볍다", roman:"ga-byeop-da", en:"to be light (in weight)" },
        { kr:"디자인", roman:"di-ja-in", en:"design, style" },
        { kr:"예쁘다", roman:"ye-ppeu-da", en:"to be pretty, beautiful" },
        { kr:"구두", roman:"gu-du", en:"dress shoes, formal shoes" }
      ],
      grammar: [
        {
          pattern: "-(으)ㄹ 때",
          plainEnglish: `Means 'when doing / at the time of doing.' Used to describe the timing of one action relative to another.`,
          examples: [
            { kr:"걸을 때 발이 편해요.", roman:"Geo-reul ttae ba-ri pyeon-hae-yo.", en:"My feet are comfortable when walking." },
            { kr:"공부할 때 음악을 들어요.", roman:"Gong-bu-hal ttae eum-ak-eul deu-reo-yo.", en:"I listen to music when studying." }
          ],
          commonMistake: `Don't confuse with -(으)ㄴ 지 (elapsed time since). '걸을 때' = at the moment of walking. '걸은 지' = since I walked.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `The text says '발이 편하게~'. What does this tell you about the product?`,
          choices: ["It's related to footwear", "It protects from rain", "It holds money", "It creates wind"],
          answer: 0,
          explain: `발 = feet. 편하게 = comfortably. 'Comfortable for your feet' → the product involves feet → footwear (구두).`
        },
        {
          kind: "mcq",
          q: `What does '가볍고' mean in the context of a product advertisement?`,
          choices: ["It's lightweight (a selling point)", "It's expensive", "It's colorful", "It's large"],
          answer: 0,
          explain: `가볍다 = to be light/lightweight. 가볍고 = 'is light and...' — 가볍고 디자인도 예뻐요 = 'It's lightweight and the design is pretty too.'`
        },
        {
          kind: "translate",
          q: `What does '디자인도 예뻐요' mean?`,
          answer: `The design is pretty too. / The design is beautiful too.`,
          explain: `디자인 = design. 도 = also/too. 예뻐요 = is pretty. The 도 (also) implies other good qualities were already mentioned.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q6 · Topic Identification · Laundry Service
    // ─────────────────────────────────────────────
    Q6: {
      num: 6,
      type: "topic-id",
      section: "C",
      passageType: "ad",
      groupInstruction: {
        kr: "[5~8] 다음은 무엇에 대한 글인지 고르십시오. (각 2점)",
        en: "Choose what the following text is about. (2 points each)"
      },
      passageLines: [
        { kr:"더러워진 옷을 새 옷처럼!", roman:"Deo-reo-wo-jin os-eul sae os-cheo-reom!", en:"Dirty clothes made like new!" },
        { kr:"두꺼운 이불도 맡겨 주세요.", roman:"Du-kkeo-un i-bul-do mat-gyeo ju-se-yo.", en:"Feel free to leave even thick blankets with us." }
      ],
      choices: [
        { num:1, kr:"은행", roman:"eun-haeng", en:"bank", correct:false },
        { num:2, kr:"시장", roman:"si-jang", en:"market / marketplace", correct:false },
        { num:3, kr:"세탁소", roman:"se-tak-so", en:"laundry / dry cleaner", correct:true },
        { num:4, kr:"가구점", roman:"ga-gu-jeom", en:"furniture store", correct:false }
      ],
      answer: 3,
      whyRight: `Two clues: (1) <b>더러워진 옷을 새 옷처럼</b> — making dirty clothes like new is exactly what a laundry/dry cleaner does. (2) <b>이불도 맡겨 주세요</b> — 'please leave your blankets with us' = accepting items for cleaning. This is a laundry service advertisement (세탁소).`,
      whyWrong: {
        "1": `은행 (bank) deals with money and financial services — not clothing or blankets.`,
        "2": `시장 (market) is a marketplace where you buy goods — you don't leave dirty clothes there.`,
        "4": `가구점 (furniture store) sells furniture — not related to cleaning clothes or blankets.`
      },
      vocab: [
        { kr:"더럽다", roman:"deo-reop-da", en:"to be dirty, to be filthy" },
        { kr:"더러워지다", roman:"deo-reo-wo-ji-da", en:"to become dirty, to get dirty" },
        { kr:"옷", roman:"ot", en:"clothes, clothing, garment" },
        { kr:"새", roman:"sae", en:"new (as adjective before nouns)" },
        { kr:"처럼", roman:"cheo-reom", en:"like, similar to, as if (comparison)" },
        { kr:"두꺼운", roman:"du-kkeo-un", en:"thick (adj.)" },
        { kr:"이불", roman:"i-bul", en:"blanket, comforter, duvet" },
        { kr:"맡기다", roman:"mat-gi-da", en:"to entrust, to leave (something with someone), to drop off" },
        { kr:"세탁소", roman:"se-tak-so", en:"laundry service, dry cleaner" }
      ],
      grammar: [
        {
          pattern: "-처럼 / -같이",
          plainEnglish: `Both mean 'like / as / similar to' — used for comparisons. Attached to nouns.`,
          examples: [
            { kr:"새 옷처럼 깨끗해요.", roman:"Sae os-cheo-reom kkae-kkeu-tae-yo.", en:"It's clean like new clothes." },
            { kr:"선생님같이 설명해요.", roman:"Seon-saeng-nim-ga-chi seol-myeong-hae-yo.", en:"(They) explain like a teacher." }
          ],
          commonMistake: `-처럼 and -같이 are nearly interchangeable for comparisons. -처럼 is more common in writing; -같이 is more common in speech.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `'더러워진 옷을 새 옷처럼!' — what service does this describe?`,
          choices: ["Laundry / dry cleaning", "Selling new clothes", "A clothing market", "Furniture cleaning"],
          answer: 0,
          explain: `Making dirty clothes (더러워진 옷) like new (새 옷처럼) is the core job of a laundry/dry cleaning service (세탁소).`
        },
        {
          kind: "mcq",
          q: `What does '맡겨 주세요' mean?`,
          choices: ["Please leave (it) with us / Please entrust (it) to us", "Please buy (it) here", "Please pick it up", "Please clean it yourself"],
          answer: 0,
          explain: `맡기다 = to entrust/leave with someone. 맡겨 주세요 = 'please leave it with us' — the laundry is asking customers to drop off their items.`
        },
        {
          kind: "translate",
          q: `Translate: '이불도 맡겨 주세요.'`,
          answer: `Please leave your blankets with us too. / Feel free to drop off blankets as well.`,
          explain: `이불 = blanket/duvet. 도 = also/too. 맡겨 주세요 = please leave (it) with us.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q7 · Topic Identification · Health Promotion
    // ─────────────────────────────────────────────
    Q7: {
      num: 7,
      type: "topic-id",
      section: "C",
      passageType: "ad",
      groupInstruction: {
        kr: "[5~8] 다음은 무엇에 대한 글인지 고르십시오. (각 2점)",
        en: "Choose what the following text is about. (2 points each)"
      },
      passageLines: [
        { kr:"달리기, 지금 바로 시작하세요.", roman:"Dal-li-gi, ji-geum ba-ro si-jak-ha-se-yo.", en:"Running — start right now." },
        { kr:"활기찬 내일이 기다립니다.", roman:"Hwal-gi-chan nae-il-i gi-da-rim-ni-da.", en:"A lively tomorrow awaits you." }
      ],
      choices: [
        { num:1, kr:"전기 절약", roman:"jeon-gi jeo-ryak", en:"electricity saving / energy conservation", correct:false },
        { num:2, kr:"건강 관리", roman:"geon-gang gwal-li", en:"health management / taking care of your health", correct:true },
        { num:3, kr:"생활 예절", roman:"saeng-hwal ye-jeol", en:"everyday manners / life etiquette", correct:false },
        { num:4, kr:"환경 보호", roman:"hwan-gyeong bo-ho", en:"environmental protection", correct:false }
      ],
      answer: 2,
      whyRight: `Two clues: (1) <b>달리기</b> (running) is a physical exercise — directly related to health. (2) <b>활기찬 내일</b> (lively tomorrow) is the benefit of exercise. Running for health = 건강 관리 (health management). This is a public health promotion message.`,
      whyWrong: {
        "1": `전기 절약 (electricity saving) is about reducing energy use — running has no connection to electricity.`,
        "3": `생활 예절 (life etiquette) is about manners and social behavior — not about running or physical health.`,
        "4": `환경 보호 (environmental protection) is about protecting nature — running is not explicitly about the environment here.`
      },
      vocab: [
        { kr:"달리기", roman:"dal-li-gi", en:"running (as a noun/activity)" },
        { kr:"지금", roman:"ji-geum", en:"now, right now" },
        { kr:"바로", roman:"ba-ro", en:"right, directly, immediately" },
        { kr:"시작하다", roman:"si-jak-ha-da", en:"to start, to begin" },
        { kr:"활기차다", roman:"hwal-gi-cha-da", en:"to be lively, energetic, vibrant" },
        { kr:"내일", roman:"nae-il", en:"tomorrow" },
        { kr:"기다리다", roman:"gi-da-ri-da", en:"to wait, to await" },
        { kr:"건강", roman:"geon-gang", en:"health" },
        { kr:"관리", roman:"gwal-li", en:"management, care, maintenance" }
      ],
      grammar: [
        {
          pattern: "-세요 (imperative, polite)",
          plainEnglish: `Polite command/request form. Used in advertisements, instructions, and invitations to do something. Softer than -어라.`,
          examples: [
            { kr:"지금 바로 시작하세요.", roman:"Ji-geum ba-ro si-jak-ha-se-yo.", en:"Start right now." },
            { kr:"이쪽으로 오세요.", roman:"I-jjok-eu-ro o-se-yo.", en:"Please come this way." }
          ],
          commonMistake: `-세요 is polite (used for strangers, formal situations, ads). -해 is casual (close friends/family).`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What activity does the text promote?`,
          choices: ["Running for better health", "Saving electricity", "Being polite to others", "Protecting the environment"],
          answer: 0,
          explain: `'달리기' = running. 'Start running right now → a lively tomorrow awaits' is a health promotion message encouraging exercise.`
        },
        {
          kind: "mcq",
          q: `What does '활기찬 내일이 기다립니다' imply?`,
          choices: ["A healthier, more energetic life will follow if you run", "Tomorrow's weather will be nice", "The environment will be protected tomorrow", "You will save money tomorrow"],
          answer: 0,
          explain: `활기찬 = lively/energetic. 내일 = tomorrow. 기다리다 = to wait/await. 'A lively tomorrow awaits' = the reward of running is a more energetic life.`
        },
        {
          kind: "translate",
          q: `Translate: '건강을 위해 달리기를 시작하세요.'`,
          answer: `Start running for your health.`,
          explain: `건강을 위해 = for health. 달리기를 시작하세요 = please start running.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q8 · Topic Identification · Ticket Reservation Steps
    // ─────────────────────────────────────────────
    Q8: {
      num: 8,
      type: "topic-id",
      section: "C",
      passageType: "numbered-steps",
      groupInstruction: {
        kr: "[5~8] 다음은 무엇에 대한 글인지 고르십시오. (각 2점)",
        en: "Choose what the following text is about. (2 points each)"
      },
      passageLines: [
        { kr:"1. 공연 날짜, 인원을 선택하고 [결제] 버튼을 누르세요.", roman:"1. Gong-yeon nal-jja, i-nwon-eul seon-taek-ha-go [gyeol-je] beo-teun-eul nu-reu-se-yo.", en:"1. Select the performance date and number of people, then press the [Pay] button." },
        { kr:"2. 원하는 좌석을 선택한 후 결제하세요.", roman:"2. Won-ha-neun jwa-seok-eul seon-taek-han hu gyeol-je-ha-se-yo.", en:"2. Choose your desired seat(s), then complete the payment." }
      ],
      choices: [
        { num:1, kr:"예매 방법", roman:"ye-mae bang-beop", en:"reservation / booking method", correct:true },
        { num:2, kr:"행사 소개", roman:"haeng-sa so-gae", en:"event introduction", correct:false },
        { num:3, kr:"등록 문의", roman:"deung-rok mu-nui", en:"registration inquiry", correct:false },
        { num:4, kr:"교환 순서", roman:"gyo-hwan sun-seo", en:"exchange procedure", correct:false }
      ],
      answer: 1,
      whyRight: `The text gives numbered steps for booking a performance ticket: (1) select date and number of people → press pay, (2) select seats → pay. This is a step-by-step guide explaining <b>how to make a reservation</b> (예매 방법). Key words: 결제 (payment), 좌석 선택 (seat selection).`,
      whyWrong: {
        "2": `행사 소개 (event introduction) would describe what an event is about — not step-by-step instructions on how to buy a ticket.`,
        "3": `등록 문의 (registration inquiry) would be about asking how to register — not a two-step ticket booking process.`,
        "4": `교환 순서 (exchange procedure) would be about exchanging/returning something — not the initial booking process.`
      },
      vocab: [
        { kr:"공연", roman:"gong-yeon", en:"performance, show, concert" },
        { kr:"날짜", roman:"nal-jja", en:"date" },
        { kr:"인원", roman:"i-nwon", en:"number of people, headcount" },
        { kr:"선택하다", roman:"seon-taek-ha-da", en:"to select, to choose" },
        { kr:"결제", roman:"gyeol-je", en:"payment, checkout" },
        { kr:"버튼", roman:"beo-teun", en:"button" },
        { kr:"누르다", roman:"nu-reu-da", en:"to press, to push (a button)" },
        { kr:"좌석", roman:"jwa-seok", en:"seat" },
        { kr:"예매", roman:"ye-mae", en:"advance booking/reservation (esp. for tickets)" }
      ],
      grammar: [
        {
          pattern: "-(으)ㄴ 후 / -고 나서",
          plainEnglish: `Both mean 'after doing [action].' Used to describe sequential steps where one action must be completed before the next.`,
          examples: [
            { kr:"좌석을 선택한 후 결제하세요.", roman:"Jwa-seok-eul seon-taek-han hu gyeol-je-ha-se-yo.", en:"After selecting your seat, please pay." },
            { kr:"밥을 먹고 나서 운동해요.", roman:"Bab-eul meok-go na-seo un-dong-hae-yo.", en:"I exercise after eating." }
          ],
          commonMistake: `-(으)ㄴ 후 uses the PAST modifier form. -고 나서 is more colloquial. Both express 'after.'`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What do the numbered steps describe?`,
          choices: ["How to book performance tickets", "What the performance is about", "How to ask about registration", "How to exchange a ticket"],
          answer: 0,
          explain: `The steps — select date/people → press pay → select seat → pay — describe the ticket reservation process (예매 방법).`
        },
        {
          kind: "mcq",
          q: `What does '예매' mean?`,
          choices: ["Advance booking (of tickets)", "Exchange", "Introduction", "Payment only"],
          answer: 0,
          explain: `예매 = advance reservation/booking, typically for performances, movies, transport. Includes both booking AND payment.`
        },
        {
          kind: "translate",
          q: `Translate step 2: '원하는 좌석을 선택한 후 결제하세요.'`,
          answer: `After selecting your desired seat, please complete the payment.`,
          explain: `원하는 = desired/wanted. 좌석 = seat. 선택한 후 = after selecting. 결제하세요 = please pay.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q9 · Content Match · Volunteer Recruitment Notice
    // ─────────────────────────────────────────────
    Q9: {
      num: 9,
      type: "content-match",
      section: "D",
      passageType: "notice",
      groupInstruction: {
        kr: "[9~12] 다음 글 또는 그래프의 내용과 같은 것을 고르십시오. (각 2점)",
        en: "Choose the statement that matches the content of the following text or graph. (2 points each)"
      },
      notice: {
        category: "자원봉사자 모집",
        categoryEn: "Volunteer Recruitment",
        headline: "어린이들에게 꿈과 희망을 선물하세요.",
        headlineRoman: "Eo-rin-i-deu-re-ge kkum-gwa hi-mang-eul seon-mul-ha-se-yo.",
        headlineEn: "Give children dreams and hope.",
        activity: "책 읽어주기 봉사",
        activityEn: "Reading books to children (volunteer activity)",
        items: [
          { label:"자격", labelEn:"Qualification", kr:"고등학생 이상 (외국어 능력자 우대)", roman:"go-deung-hak-saeng i-sang (oe-guk-eo neung-nyeok-ja u-dae)", en:"High school students or above (preference for those with foreign language skills)" },
          { label:"모집 기간", labelEn:"Recruitment period", kr:"11월 10일(월) ~ 11월 21일(금)", roman:"", en:"November 10 (Mon) ~ November 21 (Fri)" },
          { label:"지원 방법", labelEn:"How to apply", kr:"홈페이지(www.mailex.or.kr)에서 신청", roman:"", en:"Apply via the homepage (www.mailex.or.kr)" },
          { label:"활동 기간", labelEn:"Activity period", kr:"2020년 1월 19일(일) ~ 2020년 2월 28일(토)", roman:"", en:"January 19 (Sun) ~ February 28 (Sat), 2020" }
        ],
        note: "⚠️ Verify exact notice wording against the original PDF page 3. Activity period and qualification text transcribed from screenshot."
      },
      choices: [
        { num:1, kr:"봉사 활동은 두 달 동안 하게 됩니다.", roman:"bon-sa hwal-dong-eun du dal dong-an ha-ge dwem-ni-da", en:"The volunteer activity lasts for two months.", correct:false },
        { num:2, kr:"아이들에게 책을 읽어 줄 봉사자를 찾고 있다.", roman:"a-i-deu-re-ge chaeg-eul ilg-eo jul bon-sa-ja-reul chat-go it-da", en:"(They) are looking for volunteers to read books to children.", correct:true },
        { num:3, kr:"봉사자 신청은 도서관에서 직접 해야 합니다.", roman:"bon-sa-ja sin-cheong-eun do-seo-gwan-e-seo jik-jeop hae-ya ham-ni-da", en:"Volunteer applications must be made in person at the library.", correct:false },
        { num:4, kr:"학생이 아닌 사람들도 이 봉사에 참여할 수 없다.", roman:"hak-saeng-i a-nin sa-ram-deu-do i bon-sa-e cham-yeo-hal su eop-da", en:"Even non-students cannot participate in this volunteer activity.", correct:false }
      ],
      answer: 2,
      whyRight: `The notice describes a <b>책 읽어주기</b> (reading books aloud to children) volunteer program. The activity is specifically about volunteers reading to children — which matches ②: 아이들에게 책을 읽어 줄 봉사자를 찾고 있다.`,
      whyWrong: {
        "1": `The activity period is January 19 ~ February 28 = approximately <b>40 days (~5–6 weeks)</b>, NOT 두 달 (two months ≈ 60 days). ① overstates the duration.`,
        "3": `The notice says to apply via the <b>홈페이지</b> (website/homepage) — NOT in person (직접) at a library (도서관). ③ reverses both the method and the place.`,
        "4": `The qualification says '고등학생 이상' (high school students and above) — this is broader than just current students. Non-students who are adults (졸업자 등) can also apply. ④ incorrectly excludes non-students.`
      },
      vocab: [
        { kr:"자원봉사", roman:"ja-won-bon-sa", en:"volunteering, voluntary service" },
        { kr:"봉사자", roman:"bon-sa-ja", en:"volunteer (person)" },
        { kr:"모집", roman:"mo-jip", en:"recruitment, recruiting" },
        { kr:"어린이", roman:"eo-rin-i", en:"child, children" },
        { kr:"꿈", roman:"kkum", en:"dream" },
        { kr:"희망", roman:"hi-mang", en:"hope" },
        { kr:"자격", roman:"ja-gyeok", en:"qualification, eligibility" },
        { kr:"이상", roman:"i-sang", en:"or above, or more, or higher" },
        { kr:"지원하다", roman:"ji-won-ha-da", en:"to apply (for a position or program)" },
        { kr:"활동", roman:"hwal-dong", en:"activity, activities" },
        { kr:"기간", roman:"gi-gan", en:"period, duration, term" }
      ],
      grammar: [
        {
          pattern: "이상 / 이하 / 미만 / 초과",
          plainEnglish: `These four words define ranges: 이상 = or above/more (includes the number), 이하 = or below/less (includes the number), 미만 = less than (does NOT include the number), 초과 = more than/exceeds (does NOT include the number).`,
          examples: [
            { kr:"고등학생 이상이면 지원할 수 있어요.", roman:"Go-deung-hak-saeng i-sang-i-myeon ji-won-hal su i-sseo-yo.", en:"If you're a high school student or above, you can apply." },
            { kr:"18세 미만은 입장할 수 없어요.", roman:"Si-p-pal-se mi-man-eun ip-jang-hal su eop-sseo-yo.", en:"Those under 18 cannot enter." }
          ],
          commonMistake: `이상 INCLUDES the boundary: '18세 이상' means 18 and older. 미만 EXCLUDES: '18세 미만' means up to 17.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the volunteer activity about?`,
          choices: ["Reading books to children", "Teaching English to adults", "Cleaning local parks", "Fundraising for schools"],
          answer: 0,
          explain: `The notice is for a 책 읽어주기 (reading books aloud to children) volunteer program. The slogan '어린이들에게 꿈과 희망을 선물하세요' means 'give children dreams and hope.'`
        },
        {
          kind: "mcq",
          q: `How long is the volunteer activity period?`,
          choices: ["About 5–6 weeks (Jan 19 – Feb 28)", "Exactly two months", "One year", "One week"],
          answer: 0,
          explain: `Jan 19 to Feb 28 = 40 days = approximately 5–6 weeks. NOT 두 달 (two months ≈ 60 days), so choice ① is wrong.`
        },
        {
          kind: "mcq",
          q: `How should volunteers apply?`,
          choices: ["Via the website (홈페이지)", "In person at a library", "By phone", "By email only"],
          answer: 0,
          explain: `지원 방법: 홈페이지에서 신청 = apply via the homepage/website. NOT at a library in person — that's choice ③ which is wrong.`
        },
        {
          kind: "mcq",
          q: `Who is eligible to apply?`,
          choices: ["High school students and above (고등학생 이상)", "University students only", "Adults over 30 only", "Children"],
          answer: 0,
          explain: `자격: 고등학생 이상 = high school students and above. This includes high schoolers, university students, and adults — so non-enrolled adults can also apply.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q10 · Content Match · Travel Priority Pie Chart
    // ─────────────────────────────────────────────
    Q10: {
      num: 10,
      type: "content-match",
      section: "D",
      passageType: "chart",
      groupInstruction: {
        kr: "[9~12] 다음 글 또는 그래프의 내용과 같은 것을 고르십시오. (각 2점)",
        en: "Choose the statement that matches the content of the following text or graph. (2 points each)"
      },
      chart: {
        title: "여행지를 선택할 때 중요하게 생각하는 것",
        titleEn: "What people consider most important when choosing a travel destination",
        subtitle: "(응답자 수: 1,000명)",
        subtitleEn: "(Respondents: 1,000 people)",
        type: "pie",
        note: "⚠️ Approximate percentages — verify exact values against original PDF page 3. The relative ranking (가격 1st, 여행 상품의 다양함 3rd) is confirmed by the answer key.",
        data: [
          { label:"가격", labelEn:"Price", pct:45, rank:1 },
          { label:"숙박 시설의 질", labelEn:"Quality of accommodation", pct:27, rank:2 },
          { label:"여행 상품의 다양함", labelEn:"Variety of travel packages", pct:19, rank:3 },
          { label:"회사의 규모", labelEn:"Company size", pct:6, rank:4 },
          { label:"이동 후기", labelEn:"Travel reviews", pct:3, rank:5 }
        ]
      },
      choices: [
        { num:1, kr:"회사의 규모가 중요하다고 응답한 비율이 가장 낮다.", roman:"hoe-sa-eui gyu-mo-ga jung-yo-ha-da-go eung-dab-han bi-yul-i ga-jang nat-da", en:"The proportion saying company size is important is the lowest.", correct:false },
        { num:2, kr:"가격을 중요하게 생각하는 사람이 절반이 넘는다.", roman:"ga-gyeok-eul jung-yo-ha-ge saeng-gak-ha-neun sa-ram-i jeol-ban-i neom-neun-da", en:"People who consider price most important exceed half (more than 50%).", correct:false },
        { num:3, kr:"이동 후기와 여행 상품의 다양함을 더한 비율이 가장 크다.", roman:"i-dong hu-gi-wa yeo-haeng sang-pum-eui da-yang-ham-eul deo-han bi-yul-i ga-jang keu-da", en:"The combined proportion of travel reviews and variety of packages is the largest.", correct:false },
        { num:4, kr:"여행 상품의 다양함을 중요하게 생각하는 사람이 세 번째로 많다.", roman:"yeo-haeng sang-pum-eui da-yang-ham-eul jung-yo-ha-ge saeng-gak-ha-neun sa-ram-i se beon-jjae-ro man-ta", en:"People who consider variety of travel packages important is the third highest.", correct:true }
      ],
      answer: 4,
      whyRight: `Looking at the chart rankings: 1st 가격(45%) → 2nd 숙박 시설의 질(27%) → 3rd <b>여행 상품의 다양함(19%)</b> → 4th 회사의 규모(6%) → 5th 이동 후기(3%). ④ correctly states that 여행 상품의 다양함 is the <b>third</b> most common priority. ✓`,
      whyWrong: {
        "1": `회사의 규모 is at 6%, but 이동 후기 is at 3% — which is <b>even lower</b>. So 회사의 규모 is NOT the lowest; 이동 후기 is. ① is factually wrong.`,
        "2": `가격 is 45%, which is close to half but does <b>NOT exceed</b> half (절반이 넘다 = more than 50%). 45% < 50%, so ② is wrong.`,
        "3": `이동 후기(3%) + 여행 상품의 다양함(19%) = 22% combined — this is NOT the largest category; 가격 alone is 45% which is much larger. ③ is wrong.`
      },
      vocab: [
        { kr:"여행지", roman:"yeo-haeng-ji", en:"travel destination" },
        { kr:"선택하다", roman:"seon-taek-ha-da", en:"to select, to choose" },
        { kr:"중요하다", roman:"jung-yo-ha-da", en:"to be important" },
        { kr:"응답", roman:"eung-dap", en:"response, answer (to a survey)" },
        { kr:"비율", roman:"bi-yul", en:"proportion, percentage, ratio" },
        { kr:"가격", roman:"ga-gyeok", en:"price" },
        { kr:"숙박", roman:"suk-bak", en:"accommodation, lodging" },
        { kr:"시설", roman:"si-seol", en:"facility, facilities" },
        { kr:"다양하다", roman:"da-yang-ha-da", en:"to be diverse, various, varied" },
        { kr:"회사", roman:"hoe-sa", en:"company" },
        { kr:"규모", roman:"gyu-mo", en:"size, scale" },
        { kr:"이동", roman:"i-dong", en:"movement, travel, commute" },
        { kr:"후기", roman:"hu-gi", en:"review, feedback, testimonial" },
        { kr:"절반", roman:"jeol-ban", en:"half" },
        { kr:"넘다", roman:"neom-da", en:"to exceed, to go over" }
      ],
      grammar: [
        {
          pattern: "이/가 가장 + adjective",
          plainEnglish: `Expresses the superlative 'the most / the -est.' 가장 = most. Used to identify which item ranks highest or lowest on some quality.`,
          examples: [
            { kr:"가격이 가장 중요해요.", roman:"Ga-gyeok-i ga-jang jung-yo-hae-yo.", en:"Price is the most important." },
            { kr:"이동 후기를 선택한 비율이 가장 낮아요.", roman:"I-dong hu-gi-reul seon-taek-han bi-yul-i ga-jang na-ja-yo.", en:"The proportion who chose travel reviews is the lowest." }
          ],
          commonMistake: `In reading chart questions, watch for 가장 낮다 (lowest) vs 가장 높다 (highest). TOPIK exams often switch these to create wrong-answer traps.`
        },
        {
          pattern: "N번째로 많다/적다",
          plainEnglish: `Expresses rank order. N번째 = Nth place. 많다 = many/large. 적다 = few/small. '세 번째로 많다' = third most.`,
          examples: [
            { kr:"가격이 첫 번째로 많아요.", roman:"Ga-gyeok-i cheot beon-jjae-ro ma-na-yo.", en:"Price is the most common (1st place)." },
            { kr:"여행 상품의 다양함이 세 번째로 많아요.", roman:"Yeo-haeng sang-pum-eui da-yang-ham-i se beon-jjae-ro ma-na-yo.", en:"Variety of packages ranks 3rd." }
          ],
          commonMistake: `첫 번째 = 1st, 두 번째 = 2nd, 세 번째 = 3rd, 네 번째 = 4th, 다섯 번째 = 5th. These ordinal numbers are very common in TOPIK reading chart questions.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the MOST important factor for travelers choosing a destination?`,
          choices: ["가격 (price)", "여행 상품의 다양함 (variety of packages)", "이동 후기 (travel reviews)", "회사의 규모 (company size)"],
          answer: 0,
          explain: `가격 (price) ranks 1st at 45% — the most commonly cited important factor.`
        },
        {
          kind: "mcq",
          q: `Which category has the LOWEST proportion?`,
          choices: ["이동 후기 (travel reviews) at 3%", "회사의 규모 (company size) at 6%", "여행 상품의 다양함 at 19%", "숙박 시설의 질 at 27%"],
          answer: 0,
          explain: `이동 후기 = 3%, which is lower than 회사의 규모 (6%). This is why choice ① in the original question is WRONG — it says '회사의 규모 is the lowest' but 이동 후기 is lower.`
        },
        {
          kind: "mcq",
          q: `Does 가격 (45%) 'exceed half' (절반이 넘다)?`,
          choices: ["No — 45% is close to half but does not exceed 50%", "Yes — 45% exceeds half", "Yes — anything above 40% exceeds half", "No — only 60% or more counts as exceeding half"],
          answer: 0,
          explain: `절반 = 50%. 절반이 넘다 = more than 50%. 45% < 50%, so 가격 does NOT exceed half. Choice ② in the original question is therefore WRONG.`
        },
        {
          kind: "mcq",
          q: `What is the COMBINED percentage of 이동 후기 (3%) and 여행 상품의 다양함 (19%)?`,
          choices: ["22%", "48%", "52%", "35%"],
          answer: 0,
          explain: `3% + 19% = 22%. This is NOT the largest category (가격 alone is 45%), so choice ③ saying it's 'the largest' is wrong.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q11 · Content Match · 우표박물관
    // ─────────────────────────────────────────────
    Q11: {
      num: 11,
      type: "content-match",
      section: "D",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[11~12] 다음을 읽고 내용과 같은 것을 고르십시오. (각 2점)",
        en: "Read the passage and choose the statement that matches the content. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"인주시", roman:"in-ju-si", en:"Inju City" },
          { kr:"우표박물관이", roman:"u-pyo-bang-mul-gwan-i", en:"Stamp Museum [subj.]" },
          { kr:"지난달", roman:"ji-nan-dal", en:"last month" },
          { kr:"개관하였습니다.", roman:"gae-gwan-ha-yeot-seum-ni-da.", en:"opened." }
        ]},
        { tokens: [
          { kr:"자료실에서는", roman:"ja-ryo-sil-e-seo-neun", en:"In the materials room" },
          { kr:"방문객들이", roman:"bang-mun-gaek-deul-i", en:"visitors [subj.]" },
          { kr:"다양한", roman:"da-yang-han", en:"various" },
          { kr:"종류의", roman:"jong-nyu-ui", en:"kinds of" },
          { kr:"우표를", roman:"u-pyo-reul", en:"stamps [obj.]" },
          { kr:"직접", roman:"jik-jeop", en:"directly, in person" },
          { kr:"만져볼", roman:"man-jeo-bol", en:"touch [can touch]" },
          { kr:"수", roman:"su", en:"(ability marker)" },
          { kr:"있습니다.", roman:"it-seum-ni-da.", en:"There is / can." }
        ]},
        { tokens: [
          { kr:"또한", roman:"tto-han", en:"also, in addition" },
          { kr:"자신의", roman:"ja-sin-ui", en:"one's own" },
          { kr:"사진으로", roman:"sa-ji-neu-ro", en:"with one's photo" },
          { kr:"나만의", roman:"na-man-ui", en:"my own (exclusive)" },
          { kr:"우표를", roman:"u-pyo-reul", en:"stamp [obj.]" },
          { kr:"만들 수", roman:"man-deul su", en:"can make" },
          { kr:"있는", roman:"it-neun", en:"(can-make modifying)" },
          { kr:"프로그램도", roman:"peu-ro-geu-raem-do", en:"program also" },
          { kr:"운영되고", roman:"un-yeong-doe-go", en:"is being operated" },
          { kr:"있으며,", roman:"it-seu-myeo,", en:"and;" },
          { kr:"'1년", roman:"'il-lyeon", en:"'1-year" },
          { kr:"후의", roman:"hu-ui", en:"later's" },
          { kr:"자신에게", roman:"ja-si-ne-ge", en:"to oneself" },
          { kr:"보내는", roman:"bo-nae-neun", en:"sending" },
          { kr:"편지'", roman:"pyeon-ji'", en:"letter'" },
          { kr:"프로그램이", roman:"peu-ro-geu-raem-i", en:"program [subj.]" },
          { kr:"인기를", roman:"in-gi-reul", en:"popularity [obj.]" },
          { kr:"끌고", roman:"kkeul-go", en:"draws" },
          { kr:"있습니다.", roman:"it-seum-ni-da.", en:"is drawing." }
        ]},
        { tokens: [
          { kr:"단체", roman:"dan-che", en:"group" },
          { kr:"관람의", roman:"gwal-lam-ui", en:"visit (of)" },
          { kr:"경우", roman:"gyeong-u", en:"case" },
          { kr:"사전에", roman:"sa-jeo-ne", en:"in advance" },
          { kr:"예약이", roman:"ye-yak-i", en:"reservation [subj.]" },
          { kr:"필요합니다.", roman:"pil-yo-ham-ni-da.", en:"is necessary." }
        ]}
      ],
      choices: [
        { num:1, kr:"이 박물관은 일 년 전부터 운영을 시작했다.", roman:"i bang-mul-gwan-eun il nyeon jeon-bu-teo un-yeong-eul si-jak-haet-da.", en:"This museum started operating one year ago.", correct:false },
        { num:2, kr:"이 박물관에서는 직접 우표를 만져볼 수 있다.", roman:"i bang-mul-gwan-e-seo-neun jik-jeop u-pyo-reul man-jeo-bol su it-da.", en:"In this museum you can touch stamps in person.", correct:true },
        { num:3, kr:"이 박물관의 자료실에 있는 우표는 한 종류이다.", roman:"i bang-mul-gwan-ui ja-ryo-sil-e it-neun u-pyo-neun han jong-nyu-i-da.", en:"The stamps in this museum's materials room are all one type.", correct:false },
        { num:4, kr:"이 박물관의 단체 관람은 예약을 하지 않아도 된다.", roman:"i bang-mul-gwan-ui dan-che gwal-lam-eun ye-yak-eul ha-ji a-na-do doen-da.", en:"Group visits to this museum do not require a reservation.", correct:false }
      ],
      answer: 2,
      whyRight: `The passage says <em>자료실에서는 방문객들이 다양한 종류의 우표를 직접 만져볼 수 있습니다</em> — in the materials room, visitors <strong>can touch stamps directly</strong>. Choice ② restates this exactly.`,
      whyWrong: {
        1: `The passage says <em>지난달 개관</em> (opened <strong>last month</strong>), not one year ago. ① is wrong.`,
        3: `The passage says <em>다양한 종류의 우표</em> — <strong>various kinds</strong> of stamps. ③ says only one type, which is the opposite.`,
        4: `The passage says <em>사전에 예약이 필요합니다</em> — advance reservation <strong>is necessary</strong>. ④ says no reservation is needed, which is wrong.`
      },
      vocab: [
        { kr:"우표", roman:"u-pyo", en:"postage stamp" },
        { kr:"박물관", roman:"bang-mul-gwan", en:"museum" },
        { kr:"개관하다", roman:"gae-gwan-ha-da", en:"to open (an institution)" },
        { kr:"자료실", roman:"ja-ryo-sil", en:"materials room, archive" },
        { kr:"방문객", roman:"bang-mun-gaek", en:"visitor" },
        { kr:"만지다", roman:"man-ji-da", en:"to touch" },
        { kr:"나만의", roman:"na-man-ui", en:"exclusively my own" },
        { kr:"프로그램", roman:"peu-ro-geu-raem", en:"program" },
        { kr:"운영되다", roman:"un-yeong-doe-da", en:"to be operated, run" },
        { kr:"인기를 끌다", roman:"in-gi-reul kkeul-da", en:"to gain popularity, be popular" },
        { kr:"단체", roman:"dan-che", en:"group" },
        { kr:"관람", roman:"gwal-lam", en:"viewing, visit (to a museum/show)" },
        { kr:"사전에", roman:"sa-jeo-ne", en:"in advance, beforehand" },
        { kr:"예약", roman:"ye-yak", en:"reservation, booking" }
      ],
      grammar: [
        {
          pattern: "-(으)ㄹ 수 있다",
          plainEnglish: `Expresses ability or possibility: 'can do / it is possible to do.' Attaches to verb stem. If stem ends in vowel or ㄹ, use -ㄹ 수 있다; otherwise -을 수 있다.`,
          examples: [
            { kr:"우표를 만져볼 수 있습니다.", roman:"U-pyo-reul man-jeo-bol su it-seum-ni-da.", en:"You can touch the stamps." },
            { kr:"여기서 한국어를 공부할 수 있어요.", roman:"Yeo-gi-seo han-gu-geo-reul gong-bu-hal su i-sseo-yo.", en:"You can study Korean here." }
          ],
          commonMistake: `Don't confuse with -(으)ㄹ 수 없다 (cannot). In TOPIK content-match questions, choices often flip 있다 → 없다 or 없다 → 있다 as traps.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `When did the Stamp Museum open?`,
          choices: ["One year ago", "Last month", "Last week", "This year"],
          answer: 1,
          explain: `지난달 개관 = opened last month. ① is a trap — ① in the question says 일 년 전 (one year ago) which is wrong.`
        },
        {
          kind: "mcq",
          q: `Which activity is NOT mentioned in the passage?`,
          choices: ["Touching stamps", "Making a stamp with your photo", "Sending a letter to yourself for 1 year later", "Buying rare stamps"],
          answer: 3,
          explain: `Buying rare stamps is not mentioned. The passage mentions touching stamps, making your own stamp, and the 1-year letter program.`
        },
        {
          kind: "mcq",
          q: `단체 관람 requires…`,
          choices: ["사전 예약 (advance reservation)", "별도 요금 (extra fee)", "가이드 신청 (guide request)", "단체 할인 카드 (group discount card)"],
          answer: 0,
          explain: `단체 관람의 경우 사전에 예약이 필요합니다 = for group visits, advance reservation is necessary.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q12 · Content Match · 경찰관 산 구조
    // ─────────────────────────────────────────────
    Q12: {
      num: 12,
      type: "content-match",
      section: "D",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[11~12] 다음을 읽고 내용과 같은 것을 고르십시오. (각 2점)",
        en: "Read the passage and choose the statement that matches the content. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"지난", roman:"ji-nan", en:"past, last" },
          { kr:"1일,", roman:"il-il,", en:"1st (of the month)," },
          { kr:"경찰관", roman:"gyeong-chal-gwan", en:"police officer" },
          { kr:"김민수", roman:"gim-min-su", en:"Kim Min-su" },
          { kr:"경위는", roman:"gyeong-wi-neun", en:"Inspector [topic]" },
          { kr:"등산", roman:"deung-san", en:"mountain hiking" },
          { kr:"중", roman:"jung", en:"while, in the middle of" },
          { kr:"인주산", roman:"in-ju-san", en:"Inju Mountain" },
          { kr:"정상에서", roman:"jeong-sang-e-seo", en:"at the summit" },
          { kr:"쓰러진", roman:"sseu-reo-jin", en:"collapsed, fallen" },
          { kr:"여성을", roman:"yeo-seong-eul", en:"woman [obj.]" },
          { kr:"발견하였습니다.", roman:"pal-gyeon-ha-yeot-seum-ni-da.", en:"discovered." }
        ]},
        { tokens: [
          { kr:"김", roman:"gim", en:"Kim" },
          { kr:"경위는", roman:"gyeong-wi-neun", en:"Inspector [topic]" },
          { kr:"즉시", roman:"jeuk-si", en:"immediately" },
          { kr:"119에", roman:"il-il-gu-e", en:"to 119 (emergency)" },
          { kr:"신고한", roman:"sin-go-han", en:"reported / called" },
          { kr:"후", roman:"hu", en:"after" },
          { kr:"여성을", roman:"yeo-seong-eul", en:"the woman [obj.]" },
          { kr:"등에", roman:"deung-e", en:"on his back" },
          { kr:"업고", roman:"eob-go", en:"carrying (on back)" },
          { kr:"산장까지", roman:"san-jang-kka-ji", en:"to the mountain lodge" },
          { kr:"이동하였습니다.", roman:"i-dong-ha-yeot-seum-ni-da.", en:"moved / transported." }
        ]},
        { tokens: [
          { kr:"이후", roman:"i-hu", en:"after that" },
          { kr:"구조대원이", roman:"gu-jo-dae-won-i", en:"rescue team member [subj.]" },
          { kr:"도착해", roman:"do-chak-hae", en:"arrived and" },
          { kr:"여성을", roman:"yeo-seong-eul", en:"the woman [obj.]" },
          { kr:"안전하게", roman:"an-jeon-ha-ge", en:"safely" },
          { kr:"병원으로", roman:"byeong-won-eu-ro", en:"to the hospital" },
          { kr:"이송하였습니다.", roman:"i-song-ha-yeot-seum-ni-da.", en:"transported." }
        ]}
      ],
      choices: [
        { num:1, kr:"한 남성이 쓰러진 여성을 산장까지 업어 옮겼다.", roman:"han nam-seong-i sseu-reo-jin yeo-seong-eul san-jang-kka-ji eo-beo om-gyeot-da.", en:"A man carried the collapsed woman on his back to the mountain lodge.", correct:true },
        { num:2, kr:"경찰관이 도움을 받아 산에서 내려왔다.", roman:"gyeong-chal-gwan-i do-um-eul ba-da san-e-seo nae-ryeo-wat-da.", en:"The police officer received help and came down from the mountain.", correct:false },
        { num:3, kr:"구조대가 직접 산 정상으로 올라가 여성을 발견했다.", roman:"gu-jo-dae-ga jik-jeop san jeong-sang-eu-ro ol-la-ga yeo-seong-eul pal-gyeon-haet-da.", en:"The rescue team went up to the summit themselves and found the woman.", correct:false },
        { num:4, kr:"여성이 119에 연락하여 구조를 요청했다.", roman:"yeo-seong-i il-il-gu-e yeol-lak-ha-yeo gu-jo-reul yo-cheong-haet-da.", en:"The woman called 119 to request rescue.", correct:false }
      ],
      answer: 1,
      whyRight: `The passage says the officer <em>여성을 등에 업고 산장까지 이동하였습니다</em> — carried the woman on his back to the mountain lodge. Choice ① matches exactly (업어 옮기다 = carry on back to move).`,
      whyWrong: {
        2: `The officer did not receive help. He called 119 and then carried her himself. ② misrepresents the order of events.`,
        3: `The rescue team arrived after — it was the officer who found the woman at the summit. ③ reverses who found her.`,
        4: `The officer called 119, not the woman. ④ has the wrong subject.`
      },
      vocab: [
        { kr:"경찰관", roman:"gyeong-chal-gwan", en:"police officer" },
        { kr:"경위", roman:"gyeong-wi", en:"police inspector (rank)" },
        { kr:"등산", roman:"deung-san", en:"mountain hiking" },
        { kr:"정상", roman:"jeong-sang", en:"summit, peak" },
        { kr:"쓰러지다", roman:"sseu-reo-ji-da", en:"to collapse, fall down" },
        { kr:"발견하다", roman:"pal-gyeon-ha-da", en:"to discover, find" },
        { kr:"즉시", roman:"jeuk-si", en:"immediately" },
        { kr:"신고하다", roman:"sin-go-ha-da", en:"to report (to authorities/emergency)" },
        { kr:"업다", roman:"eob-da", en:"to carry on one's back" },
        { kr:"산장", roman:"san-jang", en:"mountain lodge" },
        { kr:"이동하다", roman:"i-dong-ha-da", en:"to move, travel, transport" },
        { kr:"구조대원", roman:"gu-jo-dae-won", en:"rescue team member" },
        { kr:"이송하다", roman:"i-song-ha-da", en:"to transfer, transport (to hospital)" }
      ],
      grammar: [
        {
          pattern: "V-고 (sequential action)",
          plainEnglish: `Connects two actions in sequence: 'V1 and then V2.' Both verbs share the same subject. The -고 action happens first.`,
          examples: [
            { kr:"119에 신고한 후 여성을 업고 이동하였습니다.", roman:"Il-il-gu-e sin-go-han hu yeo-seong-eul eob-go i-dong-ha-yeot-seum-ni-da.", en:"He reported to 119 and then carried the woman and moved." },
            { kr:"밥을 먹고 공부했어요.", roman:"bab-eul meok-go gong-bu-haet-sseo-yo.", en:"I ate and then studied." }
          ],
          commonMistake: `업고 means 'carrying on the back while doing the next action' — both happen together. Don't confuse the sequence: call 119 FIRST, then carry.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Where did the officer find the collapsed woman?`,
          choices: ["산 입구 (mountain entrance)", "산장 (mountain lodge)", "인주산 정상 (Inju Mountain summit)", "병원 (hospital)"],
          answer: 2,
          explain: `인주산 정상에서 쓰러진 여성을 발견 = found the collapsed woman at Inju Mountain summit.`
        },
        {
          kind: "mcq",
          q: `What did the officer do immediately after calling 119?`,
          choices: ["Waited for the rescue team", "Carried the woman to the mountain lodge", "Went down the mountain for help", "Took her to the hospital himself"],
          answer: 1,
          explain: `119에 신고한 후 여성을 등에 업고 산장까지 이동 = after calling 119, carried the woman on his back to the mountain lodge.`
        },
        {
          kind: "fill",
          q: `Translate: 쓰러지다`,
          answer: `to collapse / to fall down`,
          explain: `쓰러지다 describes someone falling/collapsing suddenly — very common in TOPIK news-style passages.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q13 · Sentence Order · 신비 복숭아
    // ─────────────────────────────────────────────
    Q13: {
      num: 13,
      type: "sentence-order",
      section: "E",
      passageType: "ordering",
      groupInstruction: {
        kr: "[13~15] 다음을 순서에 맞게 배열한 것을 고르십시오. (각 2점)",
        en: "Choose the option that arranges the following sentences in the correct order. (2 points each)"
      },
      orderingItems: [
        { label:"(가)", tokens: [
          { kr:"당도가", roman:"dang-do-ga", en:"sugar content [subj.]" },
          { kr:"높고", roman:"nop-go", en:"is high and" },
          { kr:"향이", roman:"hyang-i", en:"fragrance [subj.]" },
          { kr:"진해", roman:"jin-hae", en:"is strong/deep," },
          { kr:"출시", roman:"chul-si", en:"launch, release" },
          { kr:"직후부터", roman:"jik-hu-bu-teo", en:"from right after" },
          { kr:"소비자들에게", roman:"so-bi-ja-deul-e-ge", en:"to consumers" },
          { kr:"큰", roman:"keun", en:"great, big" },
          { kr:"인기를", roman:"in-gi-reul", en:"popularity [obj.]" },
          { kr:"얻었다.", roman:"eo-deot-da.", en:"gained." }
        ]},
        { label:"(나)", tokens: [
          { kr:"신비", roman:"sin-bi", en:"Shinbi (lit. 'mysterious')" },
          { kr:"복숭아는", roman:"bok-sung-a-neun", en:"peach [topic]" },
          { kr:"2017년에", roman:"i-cheon-sip-chil-lyeon-e", en:"in 2017" },
          { kr:"한국에", roman:"han-gu-ge", en:"to Korea" },
          { kr:"처음", roman:"cheo-eum", en:"for the first time" },
          { kr:"소개된", roman:"so-gae-doen", en:"introduced (past mod.)" },
          { kr:"여름", roman:"yeo-reum", en:"summer" },
          { kr:"과일이다.", roman:"gwa-il-i-da.", en:"fruit." }
        ]},
        { label:"(다)", tokens: [
          { kr:"현재는", roman:"hyeon-jae-neun", en:"currently" },
          { kr:"대형", roman:"dae-hyeong", en:"large-scale" },
          { kr:"마트에서도", roman:"ma-teu-e-seo-do", en:"at supermarkets too" },
          { kr:"쉽게", roman:"swip-ge", en:"easily" },
          { kr:"구할", roman:"gu-hal", en:"can obtain" },
          { kr:"수", roman:"su", en:"(ability marker)" },
          { kr:"있을", roman:"it-seul", en:"can be (mod.)" },
          { kr:"정도로", roman:"jeong-do-ro", en:"to the extent that" },
          { kr:"대중화되었다.", roman:"dae-jung-hwa-doe-eot-da.", en:"has become mainstream." }
        ]},
        { label:"(라)", tokens: [
          { kr:"껍질이", roman:"kkeop-jil-i", en:"skin/peel [subj.]" },
          { kr:"얇은", roman:"yal-beun", en:"thin" },
          { kr:"복숭아와", roman:"bok-sung-a-wa", en:"peach and" },
          { kr:"속살이", roman:"sok-sal-i", en:"flesh/pulp [subj.]" },
          { kr:"부드러운", roman:"bu-deu-reo-un", en:"soft, tender" },
          { kr:"복숭아의", roman:"bok-sung-a-ui", en:"peach's" },
          { kr:"장점을", roman:"jang-jeom-eul", en:"advantages [obj.]" },
          { kr:"결합하여", roman:"gyeol-lap-ha-yeo", en:"combining" },
          { kr:"만든", roman:"man-deun", en:"made (mod.)" },
          { kr:"것이다.", roman:"geo-si-da.", en:"thing. (It is the thing that...)" }
        ]}
      ],
      choices: [
        { num:1, kr:"(나)-(라)-(가)-(다)", roman:"(na)-(ra)-(ga)-(da)", en:"na → ra → ga → da", correct:true },
        { num:2, kr:"(나)-(가)-(라)-(다)", roman:"(na)-(ga)-(ra)-(da)", en:"na → ga → ra → da", correct:false },
        { num:3, kr:"(다)-(나)-(라)-(가)", roman:"(da)-(na)-(ra)-(ga)", en:"da → na → ra → ga", correct:false },
        { num:4, kr:"(다)-(라)-(나)-(가)", roman:"(da)-(ra)-(na)-(ga)", en:"da → ra → na → ga", correct:false }
      ],
      answer: 1,
      whyRight: `<strong>(나)</strong> introduces the topic (신비 복숭아, a summer fruit first introduced in 2017). <strong>(라)</strong> explains what it is (combination of two types of peach). <strong>(가)</strong> gives the result (became popular immediately). <strong>(다)</strong> describes the current state (now widely available). This is the classic <em>Introduction → Definition → Result → Status</em> pattern.`,
      whyWrong: {
        2: `(나)-(가)-(라)-(다) puts the popularity result before the definition — but you can't say it became popular (가) before explaining what it is (라).`,
        3: `(다) mentions the current mainstream status, which only makes sense at the end after the popularity was established. Starting with (다) breaks the time order.`,
        4: `Same problem as ③ — (다) belongs at the end, not the beginning.`
      },
      vocab: [
        { kr:"신비", roman:"sin-bi", en:"mysterious, mystical" },
        { kr:"복숭아", roman:"bok-sung-a", en:"peach" },
        { kr:"소개되다", roman:"so-gae-doe-da", en:"to be introduced" },
        { kr:"껍질", roman:"kkeop-jil", en:"skin, peel (of fruit)" },
        { kr:"속살", roman:"sok-sal", en:"flesh, pulp (inside of fruit)" },
        { kr:"부드럽다", roman:"bu-deu-reop-da", en:"to be soft, tender" },
        { kr:"장점", roman:"jang-jeom", en:"advantage, strength" },
        { kr:"결합하다", roman:"gyeol-lap-ha-da", en:"to combine, join" },
        { kr:"당도", roman:"dang-do", en:"sugar content, sweetness level" },
        { kr:"향", roman:"hyang", en:"fragrance, scent" },
        { kr:"출시", roman:"chul-si", en:"product launch, release" },
        { kr:"대중화되다", roman:"dae-jung-hwa-doe-da", en:"to become mainstream/popular" }
      ],
      grammar: [
        {
          pattern: "-은/는 N이다 (topic introduction pattern)",
          plainEnglish: `The sentence pattern [Topic]-은/는 [definition]-이다 is the standard way to introduce a topic in Korean. In ordering questions, look for this pattern to identify the FIRST sentence.`,
          examples: [
            { kr:"신비 복숭아는 … 여름 과일이다.", roman:"Sin-bi bok-sung-a-neun … yeo-reum gwa-il-i-da.", en:"Shinbi peach is … a summer fruit." },
            { kr:"한국어는 교착어이다.", roman:"Han-gu-geo-neun gyo-chak-eo-i-da.", en:"Korean is an agglutinative language." }
          ],
          commonMistake: `In TOPIK ordering questions, the sentence that introduces the topic with -은/는 N이다 is almost always the FIRST sentence. Always find this sentence first.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Which sentence introduces the topic and should come FIRST?`,
          choices: ["(가) — sugar content is high", "(나) — first introduced in 2017", "(다) — now available at supermarkets", "(라) — combination of two peach types"],
          answer: 1,
          explain: `(나) uses the topic-introduction pattern: 신비 복숭아는 … 여름 과일이다. This pattern marks the starting sentence.`
        },
        {
          kind: "mcq",
          q: `What does 껍질이 얇다 mean?`,
          choices: ["The peach is very sweet", "The skin/peel is thin", "The fragrance is strong", "The flesh is soft"],
          answer: 1,
          explain: `껍질 = skin/peel. 얇다 = thin. So 껍질이 얇다 = the peel is thin.`
        },
        {
          kind: "fill",
          q: `Translate: 당도가 높고 향이 진하다`,
          answer: `The sugar content is high and the fragrance is strong/deep`,
          explain: `당도 = sugar content, 높다 = high, 향 = fragrance/scent, 진하다 = deep/strong (for flavor/scent).`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q14 · Sentence Order · 조선시대 사대부 책
    // ─────────────────────────────────────────────
    Q14: {
      num: 14,
      type: "sentence-order",
      section: "E",
      passageType: "ordering",
      groupInstruction: {
        kr: "[13~15] 다음을 순서에 맞게 배열한 것을 고르십시오. (각 2점)",
        en: "Choose the option that arranges the following sentences in the correct order. (2 points each)"
      },
      orderingItems: [
        { label:"(가)", tokens: [
          { kr:"최근", roman:"choe-geun", en:"recently" },
          { kr:"조선", roman:"jo-seon", en:"Joseon (dynasty)" },
          { kr:"시대", roman:"si-dae", en:"era, period" },
          { kr:"사대부의", roman:"sa-dae-bu-ui", en:"Joseon scholars'" },
          { kr:"일상을", roman:"il-sang-eul", en:"everyday life [obj.]" },
          { kr:"새로운", roman:"sae-ro-un", en:"new" },
          { kr:"시각으로", roman:"si-ga-geu-ro", en:"from a perspective" },
          { kr:"분석한", roman:"bun-seok-han", en:"analyzed (mod.)" },
          { kr:"책이", roman:"chaek-i", en:"book [subj.]" },
          { kr:"출판되었다.", roman:"chul-pan-doe-eot-da.", en:"was published." }
        ]},
        { label:"(나)", tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"책은", roman:"chaek-eun", en:"book [topic]" },
          { kr:"사대부가", roman:"sa-dae-bu-ga", en:"Joseon scholars [subj.]" },
          { kr:"청렴하고", roman:"cheong-nyeom-ha-go", en:"were upright and" },
          { kr:"엄격한", roman:"eom-gyeok-han", en:"strict" },
          { kr:"삶을", roman:"sal-meul", en:"life [obj.]" },
          { kr:"살았다는", roman:"sa-rat-da-neun", en:"that they lived (reported)" },
          { kr:"기존의", roman:"gi-jon-ui", en:"existing, conventional" },
          { kr:"통념과", roman:"tong-nyeom-gwa", en:"notion and" },
          { kr:"달리", roman:"dal-li", en:"differently from" },
          { kr:"그들의", roman:"geu-deul-ui", en:"their" },
          { kr:"인간적인", roman:"in-gan-jeok-in", en:"human, humanistic" },
          { kr:"면을", roman:"myeon-eul", en:"side [obj.]" },
          { kr:"보여", roman:"bo-yeo", en:"shows" },
          { kr:"준다.", roman:"jun-da.", en:"(gives showing)" }
        ]},
        { label:"(다)", tokens: [
          { kr:"저자는", roman:"jeo-ja-neun", en:"the author [topic]" },
          { kr:"다양한", roman:"da-yang-han", en:"various" },
          { kr:"사료를", roman:"sa-ryo-reul", en:"historical documents [obj.]" },
          { kr:"통해", roman:"tong-hae", en:"through" },
          { kr:"사대부의", roman:"sa-dae-bu-ui", en:"the scholars'" },
          { kr:"실제", roman:"sil-jje", en:"actual, real" },
          { kr:"생활을", roman:"saeng-hwal-eul", en:"life [obj.]" },
          { kr:"생생하게", roman:"saeng-saeng-ha-ge", en:"vividly" },
          { kr:"묘사하였다.", roman:"myo-sa-ha-yeot-da.", en:"depicted." }
        ]},
        { label:"(라)", tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"책은", roman:"chaek-eun", en:"book [topic]" },
          { kr:"역사에", roman:"yeok-sa-e", en:"to history" },
          { kr:"관심", roman:"gwan-sim", en:"interest" },
          { kr:"있는", roman:"it-neun", en:"interested (mod.)" },
          { kr:"사람들은", roman:"sa-ram-deul-eun", en:"people [topic]" },
          { kr:"물론", roman:"mul-lon", en:"of course" },
          { kr:"일반", roman:"il-ban", en:"general" },
          { kr:"독자들에게도", roman:"dok-ja-deul-e-ge-do", en:"to general readers too" },
          { kr:"호평을", roman:"ho-pyeong-eul", en:"praise [obj.]" },
          { kr:"받고", roman:"bat-go", en:"receives and" },
          { kr:"있다.", roman:"it-da.", en:"is receiving." }
        ]}
      ],
      choices: [
        { num:1, kr:"(가)-(다)-(나)-(라)", roman:"(ga)-(da)-(na)-(ra)", en:"ga → da → na → ra", correct:false },
        { num:2, kr:"(가)-(나)-(다)-(라)", roman:"(ga)-(na)-(da)-(ra)", en:"ga → na → da → ra", correct:true },
        { num:3, kr:"(라)-(가)-(나)-(다)", roman:"(ra)-(ga)-(na)-(da)", en:"ra → ga → na → da", correct:false },
        { num:4, kr:"(라)-(나)-(가)-(다)", roman:"(ra)-(na)-(ga)-(da)", en:"ra → na → ga → da", correct:false }
      ],
      answer: 2,
      whyRight: `<strong>(가)</strong> introduces the book (recently published, analyzes Joseon scholars). <strong>(나)</strong> explains its key claim (challenges conventional view of scholars). <strong>(다)</strong> explains how (author used historical documents to depict real life). <strong>(라)</strong> gives the outcome (praised by both history enthusiasts and general readers). Pattern: Publication → Argument → Evidence → Reception.`,
      whyWrong: {
        1: `(가)-(다)-(나)-(라) puts the method (다) before the key argument (나) — but you need to state the claim before explaining how the author supported it.`,
        3: `(라) describes reception — it belongs at the end, not the beginning.`,
        4: `Same problem — (라) at the start breaks the logical flow.`
      },
      vocab: [
        { kr:"사대부", roman:"sa-dae-bu", en:"Joseon-era scholar-official class" },
        { kr:"일상", roman:"il-sang", en:"everyday life" },
        { kr:"시각", roman:"si-gak", en:"perspective, viewpoint" },
        { kr:"분석하다", roman:"bun-seok-ha-da", en:"to analyze" },
        { kr:"출판되다", roman:"chul-pan-doe-da", en:"to be published" },
        { kr:"청렴하다", roman:"cheong-nyeom-ha-da", en:"to be upright, honest, incorruptible" },
        { kr:"통념", roman:"tong-nyeom", en:"conventional wisdom, common notion" },
        { kr:"인간적이다", roman:"in-gan-jeok-i-da", en:"to be human, humanistic" },
        { kr:"사료", roman:"sa-ryo", en:"historical documents/records" },
        { kr:"생생하다", roman:"saeng-saeng-ha-da", en:"to be vivid, lifelike" },
        { kr:"묘사하다", roman:"myo-sa-ha-da", en:"to depict, describe" },
        { kr:"호평", roman:"ho-pyeong", en:"favorable review, praise" }
      ],
      grammar: [
        {
          pattern: "최근 (recently) — key ordering signal",
          plainEnglish: `최근 (recently) and similar time words (지난달, 며칠 전, 올해) at the START of a sentence signal that it introduces something new. In ordering questions, sentences starting with 최근 almost always come FIRST.`,
          examples: [
            { kr:"최근 … 책이 출판되었다.", roman:"choe-geun … chaek-i chul-pan-doe-eot-da.", en:"Recently, a book was published…" },
            { kr:"최근 한국어를 배우는 외국인이 늘고 있다.", roman:"choe-geun han-gu-geo-reul bae-u-neun oe-gu-gin-i neul-go it-da.", en:"Recently, the number of foreigners learning Korean has been increasing." }
          ],
          commonMistake: `In [13-15] sentence-ordering questions, scanning for 최근 / 지난 / 최초 at the start of a sentence is one of the fastest ways to identify the first sentence.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Which clue helps identify (가) as the FIRST sentence?`,
          choices: ["It ends with -이다", "It starts with 최근", "It contains 이 책은", "It mentions 호평"],
          answer: 1,
          explain: `최근 (recently) at the start signals this sentence introduces something new — almost always the first sentence in ordering questions.`
        },
        {
          kind: "mcq",
          q: `What does 통념 mean?`,
          choices: ["A new idea", "Conventional wisdom / common belief", "A historical document", "An academic theory"],
          answer: 1,
          explain: `통념 = conventional wisdom / common belief. This book challenges (통념과 달리 = differently from the conventional notion) the usual view of Joseon scholars.`
        },
        {
          kind: "fill",
          q: `Translate: 사료를 통해 생생하게 묘사하다`,
          answer: `to vividly depict / describe through historical documents`,
          explain: `사료 = historical records, 통해 = through/via, 생생하게 = vividly, 묘사하다 = to depict/describe.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q15 · Sentence Order · 아기 울음 / 이웃
    // ─────────────────────────────────────────────
    Q15: {
      num: 15,
      type: "sentence-order",
      section: "E",
      passageType: "ordering",
      groupInstruction: {
        kr: "[13~15] 다음을 순서에 맞게 배열한 것을 고르십시오. (각 2점)",
        en: "Choose the option that arranges the following sentences in the correct order. (2 points each)"
      },
      orderingItems: [
        { label:"(가)", tokens: [
          { kr:"최근", roman:"choe-geun", en:"recently" },
          { kr:"아이를", roman:"a-i-reul", en:"a child [obj.]" },
          { kr:"낳은", roman:"na-eun", en:"gave birth to (mod.)" },
          { kr:"한", roman:"han", en:"a (certain)" },
          { kr:"어머니는", roman:"eo-meo-ni-neun", en:"mother [topic]" },
          { kr:"밤마다", roman:"bam-ma-da", en:"every night" },
          { kr:"우는", roman:"u-neun", en:"crying (mod.)" },
          { kr:"아기", roman:"a-gi", en:"baby" },
          { kr:"때문에", roman:"ttae-mu-ne", en:"because of" },
          { kr:"이웃에게", roman:"i-u-se-ge", en:"to the neighbors" },
          { kr:"피해를", roman:"pi-hae-reul", en:"trouble/harm [obj.]" },
          { kr:"줄까", roman:"jul-kka", en:"might give" },
          { kr:"봐", roman:"bwa", en:"worrying that" },
          { kr:"걱정하였다.", roman:"geok-jeong-ha-yeot-da.", en:"was worried." }
        ]},
        { label:"(나)", tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"어머니는", roman:"eo-meo-ni-neun", en:"mother [topic]" },
          { kr:"이웃에게", roman:"i-u-se-ge", en:"to the neighbors" },
          { kr:"미리", roman:"mi-ri", en:"in advance" },
          { kr:"양해를", roman:"yang-hae-reul", en:"understanding [obj.]" },
          { kr:"구하는", roman:"gu-ha-neun", en:"seeking (mod.)" },
          { kr:"쪽지를", roman:"jjok-ji-reul", en:"note [obj.]" },
          { kr:"문", roman:"mun", en:"door" },
          { kr:"앞에", roman:"a-pe", en:"in front of" },
          { kr:"붙여", roman:"bu-chyeo", en:"attached" },
          { kr:"두었다.", roman:"du-eot-da.", en:"left (prepared in advance)." }
        ]},
        { label:"(다)", tokens: [
          { kr:"그런데", roman:"geu-reon-de", en:"but, however" },
          { kr:"다음", roman:"da-eum", en:"next" },
          { kr:"날", roman:"nal", en:"day" },
          { kr:"아침", roman:"a-chim", en:"morning" },
          { kr:"이웃집", roman:"i-ut-jip", en:"neighbor's house" },
          { kr:"사람이", roman:"sa-ram-i", en:"person [subj.]" },
          { kr:"찾아와", roman:"cha-ja-wa", en:"came to visit" },
          { kr:"아기", roman:"a-gi", en:"baby" },
          { kr:"건강이", roman:"geon-gang-i", en:"health [subj.]" },
          { kr:"걱정된다며", roman:"geok-jeong-doen-da-myeo", en:"saying they were worried about" },
          { kr:"안부를", roman:"an-bu-reul", en:"how-are-you [obj.]" },
          { kr:"물었다.", roman:"mu-reot-da.", en:"asked." }
        ]},
        { label:"(라)", tokens: [
          { kr:"그", roman:"geu", en:"that" },
          { kr:"순간", roman:"sun-gan", en:"moment" },
          { kr:"어머니는", roman:"eo-meo-ni-neun", en:"mother [topic]" },
          { kr:"따뜻한", roman:"tta-tteu-tan", en:"warm" },
          { kr:"이웃의", roman:"i-ut-ui", en:"neighbor's" },
          { kr:"배려에", roman:"bae-ryeo-e", en:"thoughtfulness [to]" },
          { kr:"마음이", roman:"ma-eum-i", en:"heart [subj.]" },
          { kr:"뭉클해졌다.", roman:"mung-keul-hae-jeot-da.", en:"became moved/touched." }
        ]}
      ],
      choices: [
        { num:1, kr:"(가)-(나)-(다)-(라)", roman:"(ga)-(na)-(da)-(ra)", en:"ga → na → da → ra", correct:true },
        { num:2, kr:"(가)-(다)-(나)-(라)", roman:"(ga)-(da)-(na)-(ra)", en:"ga → da → na → ra", correct:false },
        { num:3, kr:"(라)-(가)-(나)-(다)", roman:"(ra)-(ga)-(na)-(da)", en:"ra → ga → na → da", correct:false },
        { num:4, kr:"(라)-(나)-(가)-(다)", roman:"(ra)-(na)-(ga)-(da)", en:"ra → na → ga → da", correct:false }
      ],
      answer: 1,
      whyRight: `<strong>(가)</strong> sets up the situation: a new mother is worried her baby's crying will trouble the neighbors. <strong>(나)</strong> shows her response: she leaves an apology note. <strong>(다)</strong> gives the unexpected turn: the neighbor visits the next morning — not to complain, but to ask about the baby's health. <strong>(라)</strong> gives the emotional resolution: the mother is touched by the neighbor's kindness.`,
      whyWrong: {
        2: `(가)-(다)-(나)-(라) puts the neighbor's visit before the note — but the mother leaves the note first, then the neighbor visits the next morning.`,
        3: `(라) is the emotional conclusion — it cannot come first.`,
        4: `Same issue — (라) belongs at the end.`
      },
      vocab: [
        { kr:"낳다", roman:"na-ta", en:"to give birth" },
        { kr:"밤마다", roman:"bam-ma-da", en:"every night" },
        { kr:"피해", roman:"pi-hae", en:"harm, trouble, nuisance" },
        { kr:"-ㄹ까 봐", roman:"-l-kka bwa", en:"worried that ~ might happen" },
        { kr:"걱정하다", roman:"geok-jeong-ha-da", en:"to worry" },
        { kr:"양해", roman:"yang-hae", en:"understanding, forgiveness" },
        { kr:"구하다", roman:"gu-ha-da", en:"to seek, ask for" },
        { kr:"쪽지", roman:"jjok-ji", en:"short note, slip of paper" },
        { kr:"붙이다", roman:"bu-chi-da", en:"to attach, stick" },
        { kr:"안부", roman:"an-bu", en:"how-are-you, regards, inquiring about someone's wellbeing" },
        { kr:"배려", roman:"bae-ryeo", en:"consideration, thoughtfulness" },
        { kr:"뭉클하다", roman:"mung-keul-ha-da", en:"to feel touched/moved (emotionally)" }
      ],
      grammar: [
        {
          pattern: "-(으)ㄹ까 봐 (worried that…)",
          plainEnglish: `Expresses worry or concern that something unwanted might happen. Structure: [Verb stem]-ㄹ까 봐. Translation: 'worried/afraid that [V] might happen.'`,
          examples: [
            { kr:"이웃에게 피해를 줄까 봐 걱정하였다.", roman:"i-u-se-ge pi-hae-reul jul-kka bwa geok-jeong-ha-yeot-da.", en:"Was worried that she might trouble the neighbors." },
            { kr:"시험에 떨어질까 봐 불안해요.", roman:"si-heom-e tteol-eo-jil-kka bwa bul-an-hae-yo.", en:"I'm anxious that I might fail the exam." }
          ],
          commonMistake: `The subject of -(으)ㄹ까 봐 is the speaker or someone close to them who is WORRIED. What comes after 봐 is the feeling of worry. Don't confuse with -(으)ㄹ까요 (let's / shall we?).`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Why was the mother worried?`,
          choices: ["Her baby was sick", "Her baby's crying might trouble the neighbors", "Her neighbor complained about noise", "She couldn't find a doctor at night"],
          answer: 1,
          explain: `밤마다 우는 아기 때문에 이웃에게 피해를 줄까 봐 걱정 = worried that the nightly crying baby might cause trouble for the neighbors.`
        },
        {
          kind: "mcq",
          q: `What did the mother do to address the situation?`,
          choices: ["She went to apologize to the neighbors", "She left an understanding-seeking note at the neighbor's door", "She moved to another house", "She called the neighbor to explain"],
          answer: 1,
          explain: `이웃에게 양해를 구하는 쪽지를 문 앞에 붙여 두었다 = left a note seeking the neighbors' understanding at the door.`
        },
        {
          kind: "fill",
          q: `Translate: 마음이 뭉클해지다`,
          answer: `to feel emotionally moved / to feel touched (in one's heart)`,
          explain: `뭉클하다 = to feel a strong emotional surge, to be moved. Often used for heartwarming or touching moments.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q16 · Passage Blank · 북극여우 털 색깔
    // ─────────────────────────────────────────────
    Q16: {
      num: 16,
      type: "passage-blank",
      section: "F",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[16~18] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate phrase for the blank. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"북극여우는", roman:"buk-geuk-yeo-u-neun", en:"The Arctic fox [topic]" },
          { kr:"계절에", roman:"gye-jeol-e", en:"by season" },
          { kr:"따라", roman:"tta-ra", en:"following, according to" },
          { kr:"털", roman:"teol", en:"fur" },
          { kr:"색깔이", roman:"saek-kkal-i", en:"color [subj.]" },
          { kr:"바뀌는", roman:"ba-kkwi-neun", en:"changes (mod.)" },
          { kr:"동물이다.", roman:"dong-mul-i-da.", en:"animal." }
        ]},
        { tokens: [
          { kr:"여름에는", roman:"yeo-reum-e-neun", en:"in summer" },
          { kr:"갈색이나", roman:"gal-saek-i-na", en:"brown or" },
          { kr:"회색", roman:"hoe-saek", en:"gray" },
          { kr:"털을", roman:"teol-eul", en:"fur [obj.]" },
          { kr:"가지고", roman:"ga-ji-go", en:"having" },
          { kr:"있지만", roman:"it-ji-man", en:"but" },
          { kr:"겨울이", roman:"gyeo-ul-i", en:"winter [subj.]" },
          { kr:"되면", roman:"doe-myeon", en:"when it becomes" },
          { kr:"눈처럼", roman:"nun-cheo-reom", en:"like snow" },
          { kr:"하얀", roman:"ha-yan", en:"white" },
          { kr:"털로", roman:"teol-lo", en:"to fur" },
          { kr:"바뀐다.", roman:"ba-kkwin-da.", en:"changes." }
        ]},
        { tokens: [
          { kr:"이러한", roman:"i-reo-han", en:"this kind of, such" },
          { kr:"색깔의", roman:"saek-kkal-ui", en:"color's" },
          { kr:"변화로", roman:"byeon-hwa-ro", en:"with/through change" },
          { kr:"북극여우는", roman:"buk-geuk-yeo-u-neun", en:"Arctic fox [topic]" },
          { kr:"사냥을", roman:"sa-nyang-eul", en:"hunting [obj.]" },
          { kr:"할", roman:"hal", en:"do (mod.)" },
          { kr:"때", roman:"ttae", en:"when" },
          { isBlank:true },
          { kr:".", roman:".", en:"." }
        ]}
      ],
      choices: [
        { num:1, kr:"빠르게 달려 먹이를 잡을 수 있다", roman:"ppa-reu-ge dal-lyeo meo-gi-reul jab-eul su it-da", en:"can run fast and catch food", correct:false },
        { num:2, kr:"먹잇감에게 들키지 않고 다가갈 수 있다", roman:"meo-gin-gam-e-ge deul-ki-ji an-ko da-ga-gal su it-da", en:"can approach prey without being detected", correct:true },
        { num:3, kr:"천적으로부터 스스로를 보호할 수 있다", roman:"cheon-jeok-eu-ro-bu-teo seu-seu-ro-reul bo-ho-hal su it-da", en:"can protect itself from natural enemies", correct:false },
        { num:4, kr:"사계절 내내 건강하게 살 수 있다", roman:"sa-gye-jeol nae-nae geon-gang-ha-ge sal su it-da", en:"can live healthily throughout all four seasons", correct:false }
      ],
      answer: 2,
      whyRight: `The passage's logic: fur changes color → camouflage → hunting advantage. The blank follows '사냥을 할 때' (when hunting), so the answer must be about a <strong>hunting advantage</strong>. Choice ② — being able to approach prey without being detected — is the natural conclusion. Key word: <em>사냥하다</em> (to hunt) → needs to approach prey (먹잇감) without being noticed (들키지 않고).`,
      whyWrong: {
        1: `Speed (빠르게 달리다) has nothing to do with changing fur color. The passage is about camouflage, not speed.`,
        3: `Protecting from predators (천적으로부터 보호) is a possible use of camouflage, but the passage specifically says '사냥을 할 때' — while hunting. The fox is the predator here, not the prey.`,
        4: `Living healthily in all seasons is unrelated to fur color changing.`
      },
      vocab: [
        { kr:"북극여우", roman:"buk-geuk-yeo-u", en:"Arctic fox" },
        { kr:"계절", roman:"gye-jeol", en:"season" },
        { kr:"털", roman:"teol", en:"fur, hair (animal)" },
        { kr:"색깔", roman:"saek-kkal", en:"color" },
        { kr:"바뀌다", roman:"ba-kkwi-da", en:"to change, be changed" },
        { kr:"갈색", roman:"gal-saek", en:"brown (color)" },
        { kr:"회색", roman:"hoe-saek", en:"gray (color)" },
        { kr:"이러한", roman:"i-reo-han", en:"this kind of, such (demonstrative)" },
        { kr:"변화", roman:"byeon-hwa", en:"change" },
        { kr:"사냥", roman:"sa-nyang", en:"hunting" },
        { kr:"먹잇감", roman:"meo-gin-gam", en:"prey" },
        { kr:"들키다", roman:"deul-ki-da", en:"to be caught/detected/noticed" },
        { kr:"다가가다", roman:"da-ga-ga-da", en:"to approach, get close to" },
        { kr:"천적", roman:"cheon-jeok", en:"natural enemy, predator" }
      ],
      grammar: [
        {
          pattern: "이러한 (this kind of) — anaphoric demonstrative",
          plainEnglish: `'이러한' refers back to something just mentioned. When you see 이러한 at the start of a sentence, it refers to the content of the previous sentence. This is a very common passage cohesion device in TOPIK.`,
          examples: [
            { kr:"이러한 색깔의 변화로 북극여우는 사냥할 때…", roman:"i-reo-han saek-kkal-ui byeon-hwa-ro…", en:"With this kind of color change, the Arctic fox when hunting…" },
            { kr:"이러한 이유로 한국어를 배우는 사람이 늘고 있다.", roman:"i-reo-han i-yu-ro han-gu-geo-reul bae-u-neun sa-ram-i neul-go it-da.", en:"For this reason, the number of people learning Korean is increasing." }
          ],
          commonMistake: `이러한 always points BACKWARD. If a passage-blank sentence starts with 이러한, the answer must logically follow from what was described in the preceding sentences.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does the Arctic fox's fur look like in summer?`,
          choices: ["White like snow", "Brown or gray", "Black", "White and gray"],
          answer: 1,
          explain: `여름에는 갈색이나 회색 털 = in summer, brown or gray fur.`
        },
        {
          kind: "mcq",
          q: `What does 먹잇감에게 들키다 mean?`,
          choices: ["To catch prey", "To be detected by prey", "To chase prey fast", "To protect from prey"],
          answer: 1,
          explain: `먹잇감 = prey, 들키다 = to be detected/caught. So 먹잇감에게 들키다 = to be detected by prey (the prey notices you coming).`
        },
        {
          kind: "fill",
          q: `What pattern does 이러한 follow? (What does it refer to?)`,
          answer: `it refers back to the previous sentence (the color change described before)`,
          explain: `이러한 is an anaphoric demonstrative — it always points backward to something already mentioned. In this passage it refers to '색깔의 변화 (color change)' mentioned before.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q17 · Passage Blank · 봉사 활동
    // ─────────────────────────────────────────────
    Q17: {
      num: 17,
      type: "passage-blank",
      section: "F",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[16~18] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate phrase for the blank. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"봉사", roman:"bong-sa", en:"volunteer service" },
          { kr:"활동은", roman:"hwal-dong-eun", en:"activities [topic]" },
          { kr:"개인의", roman:"gae-in-ui", en:"individual's" },
          { kr:"시간과", roman:"si-gan-gwa", en:"time and" },
          { kr:"능력을", roman:"neung-nyeok-eul", en:"ability [obj.]" },
          { kr:"사회를", roman:"sa-hoe-reul", en:"society [obj.]" },
          { kr:"위해", roman:"wi-hae", en:"for (the sake of)" },
          { kr:"자발적으로", roman:"ja-bal-jeok-eu-ro", en:"voluntarily" },
          { kr:"사용하는", roman:"sa-yong-ha-neun", en:"uses (mod.)" },
          { kr:"행위이다.", roman:"haeng-wi-i-da.", en:"act." }
        ]},
        { tokens: [
          { kr:"최근에는", roman:"choe-geun-e-neun", en:"recently" },
          { kr:"다양한", roman:"da-yang-han", en:"various" },
          { kr:"분야에서", roman:"bun-ya-e-seo", en:"in fields" },
          { kr:"봉사", roman:"bong-sa", en:"volunteer" },
          { kr:"활동이", roman:"hwal-dong-i", en:"activities [subj.]" },
          { kr:"이루어지고", roman:"i-ru-eo-ji-go", en:"are taking place and" },
          { kr:"있으며,", roman:"it-seu-myeo,", en:"and" },
          { kr:"참여하는", roman:"cham-yeo-ha-neun", en:"participating (mod.)" },
          { kr:"사람도", roman:"sa-ram-do", en:"people also" },
          { kr:"늘어나고", roman:"neul-eo-na-go", en:"are increasing and" },
          { kr:"있다.", roman:"it-da.", en:"are." }
        ]},
        { tokens: [
          { kr:"봉사", roman:"bong-sa", en:"volunteer" },
          { kr:"활동을", roman:"hwal-dong-eul", en:"activities [obj.]" },
          { kr:"꾸준히", roman:"kku-jun-hi", en:"consistently, steadily" },
          { kr:"하면", roman:"ha-myeon", en:"if one does" },
          { isBlank:true },
          { kr:".", roman:".", en:"." }
        ]}
      ],
      choices: [
        { num:1, kr:"경력 개발에 직접적인 도움이 된다", roman:"gyeong-nyeok gae-bal-e jik-jeop-jeok-in do-um-i doen-da", en:"directly helps career development", correct:false },
        { num:2, kr:"전문적인 기술을 익히는 데 효과적이다", roman:"jeon-mun-jeok-in gi-sul-eul ik-hi-neun de hyo-gwa-jeok-i-da", en:"effective for acquiring professional skills", correct:false },
        { num:3, kr:"개인의 삶이 더욱 풍요로워지고 사회 발전에도 도움이 된다", roman:"gae-in-ui sal-mi deo-uk pung-yo-ro-wo-ji-go sa-hoe bal-jeon-e-do do-um-i doen-da", en:"one's personal life becomes richer and it helps social development too", correct:true },
        { num:4, kr:"사회적 지위를 높이는 최선의 방법이 된다", roman:"sa-hoe-jeok ji-wi-reul no-pi-neun choe-seon-ui bang-beob-i doen-da", en:"becomes the best way to raise one's social status", correct:false }
      ],
      answer: 3,
      whyRight: `The passage defines volunteer work as using one's time and ability <em>for society</em> (사회를 위해). The logical conclusion is that this benefits both the individual (개인의 삶이 풍요로워지다) <em>and</em> society (사회 발전). Choice ③ is the only answer that reflects both dimensions mentioned in the passage.`,
      whyWrong: {
        1: `Career development (경력 개발) is too narrow and instrumental — the passage emphasizes voluntary service for society, not personal advancement.`,
        2: `Acquiring professional skills is not mentioned and contradicts the passage's focus on benefiting society.`,
        4: `Social status (사회적 지위) is self-serving, not aligned with the selfless nature of volunteer work described.`
      },
      vocab: [
        { kr:"봉사", roman:"bong-sa", en:"volunteer service, public service" },
        { kr:"활동", roman:"hwal-dong", en:"activity, activities" },
        { kr:"개인", roman:"gae-in", en:"individual, personal" },
        { kr:"능력", roman:"neung-nyeok", en:"ability, capability" },
        { kr:"자발적으로", roman:"ja-bal-jeok-eu-ro", en:"voluntarily, of one's own accord" },
        { kr:"행위", roman:"haeng-wi", en:"act, action, deed" },
        { kr:"분야", roman:"bun-ya", en:"field, area, sector" },
        { kr:"이루어지다", roman:"i-ru-eo-ji-da", en:"to take place, be carried out" },
        { kr:"참여하다", roman:"cham-yeo-ha-da", en:"to participate" },
        { kr:"꾸준히", roman:"kku-jun-hi", en:"consistently, steadily" },
        { kr:"풍요롭다", roman:"pung-yo-rop-da", en:"to be rich, abundant, fulfilling" },
        { kr:"발전", roman:"bal-jeon", en:"development, advancement" }
      ],
      grammar: [
        {
          pattern: "V-으면/면 (conditional): 'if / when'",
          plainEnglish: `A conditional clause. 'If you do V, then [result].' The blank fills in the RESULT. In passage-blank questions, identify what the passage is building toward — that's what the blank completes.`,
          examples: [
            { kr:"꾸준히 하면 (　　).", roman:"kku-jun-hi ha-myeon (　　).", en:"If you do it consistently, (result)." },
            { kr:"열심히 공부하면 좋은 결과가 있을 거예요.", roman:"yeol-sim-hi gong-bu-ha-myeon jo-eun gyeol-gwa-ga it-seul geo-ye-yo.", en:"If you study hard, there will be good results." }
          ],
          commonMistake: `In passage-blank questions, read the whole passage for the theme (봉사 = service to society), then check that the blank answer is consistent with that theme.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `According to the passage, volunteer activities use your time and ability for what purpose?`,
          choices: ["For personal success", "For society (사회를 위해)", "For career advancement", "For learning skills"],
          answer: 1,
          explain: `사회를 위해 자발적으로 사용 = used voluntarily for society. This is the key definition in the passage.`
        },
        {
          kind: "mcq",
          q: `What does 꾸준히 mean?`,
          choices: ["Occasionally", "Once only", "Consistently / steadily", "Very quickly"],
          answer: 2,
          explain: `꾸준히 = consistently, steadily, without giving up. Very common adverb in Korean that describes persistent effort.`
        },
        {
          kind: "fill",
          q: `Translate: 자발적으로 참여하다`,
          answer: `to participate voluntarily / of one's own accord`,
          explain: `자발적으로 = voluntarily (자발 = self-initiated). 참여하다 = to participate.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q18 · Passage Blank · 고인돌
    // ─────────────────────────────────────────────
    Q18: {
      num: 18,
      type: "passage-blank",
      section: "F",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[16~18] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate phrase for the blank. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"고인돌은", roman:"go-in-dol-eun", en:"Dolmen [topic]" },
          { kr:"큰", roman:"keun", en:"large, big" },
          { kr:"돌로", roman:"dol-lo", en:"with stones" },
          { kr:"만든", roman:"man-deun", en:"made (mod.)" },
          { kr:"선사", roman:"seon-sa", en:"prehistoric" },
          { kr:"시대의", roman:"si-dae-ui", en:"era's" },
          { kr:"무덤으로,", roman:"mu-deom-eu-ro,", en:"tomb," },
          { kr:"주로", roman:"ju-ro", en:"mainly" },
          { kr:"한국,", roman:"han-guk,", en:"Korea," },
          { kr:"중국,", roman:"jung-guk,", en:"China," },
          { kr:"일본", roman:"il-bon", en:"Japan" },
          { kr:"등", roman:"deung", en:"etc." },
          { kr:"동북아시아", roman:"dong-buk-a-si-a", en:"Northeast Asia" },
          { kr:"지역에", roman:"ji-yeok-e", en:"in the region" },
          { kr:"분포하고", roman:"bun-po-ha-go", en:"are distributed" },
          { kr:"있다.", roman:"it-da.", en:"are." }
        ]},
        { tokens: [
          { kr:"고인돌을", roman:"go-in-dol-eul", en:"Dolmens [obj.]" },
          { kr:"만들기", roman:"man-deul-gi", en:"making" },
          { kr:"위해서는", roman:"wi-hae-seo-neun", en:"in order to" },
          { kr:"수십", roman:"su-sip", en:"tens (of)" },
          { kr:"명에서", roman:"myeong-e-seo", en:"people from" },
          { kr:"수백", roman:"su-baek", en:"hundreds (of)" },
          { kr:"명의", roman:"myeong-ui", en:"people's" },
          { kr:"사람들이", roman:"sa-ram-deul-i", en:"people [subj.]" },
          { kr:"필요했을", roman:"pil-yo-haet-seul", en:"would have been needed" },
          { kr:"것으로", roman:"geo-seu-ro", en:"as (being)" },
          { kr:"추정된다.", roman:"chu-jeong-doen-da.", en:"is estimated." }
        ]},
        { tokens: [
          { kr:"그래서", roman:"geu-rae-seo", en:"therefore, so" },
          { kr:"고인돌은", roman:"go-in-dol-eun", en:"dolmen [topic]" },
          { kr:"이", roman:"i", en:"this" },
          { kr:"정도의", roman:"jeong-do-ui", en:"level of" },
          { kr:"인력을", roman:"in-nyeok-eul", en:"manpower [obj.]" },
          { kr:"동원할", roman:"dong-won-hal", en:"can mobilize (mod.)" },
          { kr:"수", roman:"su", en:"(ability marker)" },
          { kr:"있을", roman:"it-seul", en:"can (mod.)" },
          { kr:"정도로", roman:"jeong-do-ro", en:"to the extent that" },
          { isBlank:true },
          { kr:"사람의", roman:"sa-ram-ui", en:"person's" },
          { kr:"무덤이었다고", roman:"mu-deom-i-eot-da-go", en:"was a tomb (reported)" },
          { kr:"볼", roman:"bol", en:"can view" },
          { kr:"수", roman:"su", en:"(ability marker)" },
          { kr:"있다.", roman:"it-da.", en:"is." }
        ]}
      ],
      choices: [
        { num:1, kr:"절대적인 권력을 가진", roman:"jeol-dae-jeok-in gwon-nyeok-eul ga-jin", en:"possessing absolute power", correct:true },
        { num:2, kr:"뛰어난 기술을 지닌", roman:"ttwi-eo-nan gi-sul-eul ji-nin", en:"possessing outstanding skill", correct:false },
        { num:3, kr:"많은 재산을 쌓은", roman:"ma-neun jae-san-eul ssa-eun", en:"having accumulated great wealth", correct:false },
        { num:4, kr:"지혜가 뛰어난", roman:"ji-hye-ga ttwi-eo-nan", en:"possessing outstanding wisdom", correct:false }
      ],
      answer: 1,
      whyRight: `The logic: dolmens required hundreds of people → therefore only someone who could <strong>mobilize that many people</strong> could have one. The ability to command hundreds of people = <strong>absolute power</strong> (절대적인 권력). Key grammar: '동원할 수 있을 정도로 (　　) 사람' = 'a person [BLANK] enough to be able to mobilize that many people.' Answer ① = a person with absolute power.`,
      whyWrong: {
        2: `Skill (기술) wouldn't explain the ability to command hundreds of workers — power does.`,
        3: `Wealth (재산) might let you pay workers, but the passage emphasizes mobilizing people (동원), which is more about authority/power than money.`,
        4: `Wisdom (지혜) doesn't explain organizing hundreds of laborers.`
      },
      vocab: [
        { kr:"고인돌", roman:"go-in-dol", en:"dolmen (prehistoric stone tomb)" },
        { kr:"선사 시대", roman:"seon-sa si-dae", en:"prehistoric era" },
        { kr:"무덤", roman:"mu-deom", en:"tomb, grave" },
        { kr:"분포하다", roman:"bun-po-ha-da", en:"to be distributed, spread across" },
        { kr:"추정되다", roman:"chu-jeong-doe-da", en:"to be estimated, presumed" },
        { kr:"인력", roman:"in-nyeok", en:"manpower, labor force" },
        { kr:"동원하다", roman:"dong-won-ha-da", en:"to mobilize, call up" },
        { kr:"절대적이다", roman:"jeol-dae-jeok-i-da", en:"to be absolute" },
        { kr:"권력", roman:"gwon-nyeok", en:"power, authority" }
      ],
      grammar: [
        {
          pattern: "V-ㄹ/을 수 있을 정도로 (to the extent that one can V)",
          plainEnglish: `'정도로' means 'to the degree/extent of.' Combined with -ㄹ 수 있다, the pattern means 'to such an extent that [subject] can [V].' It describes the degree of someone's capability or power.`,
          examples: [
            { kr:"동원할 수 있을 정도로 절대적인 권력을 가진 사람", roman:"dong-won-hal su it-seul jeong-do-ro jeol-dae-jeok-in gwon-nyeok-eul ga-jin sa-ram", en:"a person with absolute power to the extent of being able to mobilize (workers)" },
            { kr:"이해할 수 없을 정도로 복잡하다.", roman:"i-hae-hal su eop-seul jeong-do-ro bok-jap-ha-da.", en:"It's complicated to the extent that one cannot understand." }
          ],
          commonMistake: `그래서 (therefore) at the start of the final sentence signals a CONCLUSION. The blank is the conclusion of the passage's argument. When you see 그래서, look for what the preceding sentences build toward.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `How many people were estimated to be needed to build a dolmen?`,
          choices: ["5–10 people", "Tens to hundreds of people", "Over 1,000 people", "Exactly 50 people"],
          answer: 1,
          explain: `수십 명에서 수백 명 = tens to hundreds of people.`
        },
        {
          kind: "mcq",
          q: `그래서 at the start of the last sentence signals…`,
          choices: ["A contrast with the previous idea", "A conclusion or result of what was previously said", "A new, unrelated topic", "An example"],
          answer: 1,
          explain: `그래서 = therefore / so — always introduces a conclusion or result. In passage-blank questions, blank sentences starting with 그래서 contain the CONCLUSION of the whole passage.`
        },
        {
          kind: "fill",
          q: `Translate: 인력을 동원하다`,
          answer: `to mobilize manpower / to call up labor`,
          explain: `인력 = manpower/labor force, 동원하다 = to mobilize/call up.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q19 · Connector Fill · 투수 포장 (shared passage with Q20)
    // ─────────────────────────────────────────────
    Q19: {
      num: 19,
      type: "connector-fill",
      section: "G",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[19~20] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"도시의", roman:"do-si-ui", en:"city's" },
          { kr:"도로는", roman:"do-ro-neun", en:"roads [topic]" },
          { kr:"대부분", roman:"dae-bu-bun", en:"mostly, for the most part" },
          { kr:"아스팔트로", roman:"a-seu-pal-teu-ro", en:"with asphalt" },
          { kr:"포장되어", roman:"po-jang-doe-eo", en:"are paved and" },
          { kr:"있어", roman:"it-eo", en:"being (so)" },
          { kr:"빗물이", roman:"bit-mul-i", en:"rainwater [subj.]" },
          { kr:"땅속으로", roman:"ttang-sok-eu-ro", en:"into the ground" },
          { kr:"스며들지", roman:"seu-myeo-deul-ji", en:"seep in" },
          { kr:"못한다.", roman:"mot-han-da.", en:"cannot." }
        ]},
        { tokens: [
          { kr:"이로", roman:"i-ro", en:"because of this" },
          { kr:"인해", roman:"in-hae", en:"due to, caused by" },
          { kr:"지하수가", roman:"ji-ha-su-ga", en:"groundwater [subj.]" },
          { kr:"부족해지거나", roman:"bu-jok-hae-ji-geo-na", en:"becomes insufficient or" },
          { kr:"장마철에", roman:"jang-ma-cheo-le", en:"during the rainy season" },
          { kr:"도로가", roman:"do-ro-ga", en:"roads [subj.]" },
          { kr:"침수되는", roman:"chim-su-doe-neun", en:"flooded (mod.)" },
          { kr:"문제가", roman:"mun-je-ga", en:"problem [subj.]" },
          { kr:"자주", roman:"ja-ju", en:"frequently, often" },
          { kr:"발생한다.", roman:"bal-saeng-han-da.", en:"occurs." }
        ]},
        { tokens: [
          { kr:"최근에는", roman:"choe-geun-e-neun", en:"recently" },
          { kr:"이러한", roman:"i-reo-han", en:"such, this kind of" },
          { kr:"문제를", roman:"mun-je-reul", en:"problems [obj.]" },
          { kr:"해결하기", roman:"hae-gyeol-ha-gi", en:"solving" },
          { kr:"위해", roman:"wi-hae", en:"in order to" },
          { kr:"빗물이", roman:"bit-mul-i", en:"rainwater [subj.]" },
          { kr:"통과할", roman:"tong-gwa-hal", en:"pass through (mod.)" },
          { kr:"수", roman:"su", en:"(ability marker)" },
          { kr:"있는", roman:"it-neun", en:"can (mod.)" },
          { kr:"새로운", roman:"sae-ro-un", en:"new" },
          { kr:"포장재가", roman:"po-jang-jae-ga", en:"paving material [subj.]" },
          { kr:"개발되었다.", roman:"gae-bal-doe-eot-da.", en:"was developed." }
        ]},
        { tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"포장재를", roman:"po-jang-jae-reul", en:"paving material [obj.]" },
          { kr:"사용하면", roman:"sa-yong-ha-myeon", en:"if used" },
          { kr:"빗물이", roman:"bit-mul-i", en:"rainwater [subj.]" },
          { kr:"쉽게", roman:"swip-ge", en:"easily" },
          { kr:"통과하여", roman:"tong-gwa-ha-yeo", en:"passes through and" },
          { kr:"지하수", roman:"ji-ha-su", en:"groundwater" },
          { kr:"자원이", roman:"ja-won-i", en:"resources [subj.]" },
          { kr:"보충된다.", roman:"bo-chung-doen-da.", en:"are replenished." }
        ]},
        { tokens: [
          { isBlank:true },
          { kr:"하수구에", roman:"ha-su-gu-e", en:"into the drain" },
          { kr:"모이는", roman:"mo-i-neun", en:"collected (mod.)" },
          { kr:"빗물의", roman:"bit-mul-ui", en:"rainwater's" },
          { kr:"양이", roman:"yang-i", en:"amount [subj.]" },
          { kr:"줄어들어", roman:"jul-eo-deul-eo", en:"decreases and" },
          { kr:"도로", roman:"do-ro", en:"road" },
          { kr:"침수", roman:"chim-su", en:"flooding" },
          { kr:"위험도", roman:"wi-heom-do", en:"risk also" },
          { kr:"줄어들게", roman:"jul-eo-deul-ge", en:"will decrease" },
          { kr:"된다.", roman:"doen-da.", en:"(will become)." }
        ]}
      ],
      choices: [
        { num:1, kr:"또한", roman:"tto-han", en:"also, furthermore, in addition", correct:true },
        { num:2, kr:"과연", roman:"gwa-yeon", en:"indeed, as expected", correct:false },
        { num:3, kr:"비록", roman:"bi-rok", en:"although, even though", correct:false },
        { num:4, kr:"반면", roman:"ban-myeon", en:"on the other hand, whereas", correct:false }
      ],
      answer: 1,
      whyRight: `The blank connects two BENEFITS of the new paving: ④ groundwater replenishment → ⑤ reduced road flooding. Both are positive outcomes — they are being <strong>added together</strong>. '또한' (also/furthermore) is the additive connector that lists additional benefits.`,
      whyWrong: {
        2: `과연 = 'indeed / as expected' — used to confirm something already anticipated. It doesn't connect two parallel benefits.`,
        3: `비록 = 'although / even though' — concessive connector. You'd use this when the second clause CONTRASTS with the first. But both clauses here are positive benefits.`,
        4: `반면 = 'on the other hand / whereas' — contrastive connector. Wrong here because both effects are the same direction (positive outcomes of the paving).`
      },
      vocab: [
        { kr:"아스팔트", roman:"a-seu-pal-teu", en:"asphalt" },
        { kr:"포장", roman:"po-jang", en:"pavement, paving" },
        { kr:"빗물", roman:"bit-mul", en:"rainwater" },
        { kr:"스며들다", roman:"seu-myeo-deul-da", en:"to seep in, permeate" },
        { kr:"지하수", roman:"ji-ha-su", en:"groundwater" },
        { kr:"부족하다", roman:"bu-jok-ha-da", en:"to be insufficient, lacking" },
        { kr:"장마철", roman:"jang-ma-cheol", en:"rainy season" },
        { kr:"침수되다", roman:"chim-su-doe-da", en:"to be flooded" },
        { kr:"발생하다", roman:"bal-saeng-ha-da", en:"to occur, arise" },
        { kr:"해결하다", roman:"hae-gyeol-ha-da", en:"to solve, resolve" },
        { kr:"포장재", roman:"po-jang-jae", en:"paving material" },
        { kr:"개발되다", roman:"gae-bal-doe-da", en:"to be developed" },
        { kr:"보충되다", roman:"bo-chung-doe-da", en:"to be replenished, supplemented" },
        { kr:"하수구", roman:"ha-su-gu", en:"drain, sewer" }
      ],
      grammar: [
        {
          pattern: "Connectors: 또한 / 그러나 / 비록 / 반면 (additive vs. contrastive)",
          plainEnglish: `Korean connectors signal the RELATIONSHIP between two clauses. For TOPIK Section G connector questions, four patterns appear: 또한 (adds similar info), 그러나/반면 (contrasts), 비록 (concedes), 따라서 (concludes).`,
          examples: [
            { kr:"지하수가 보충된다. 또한 침수 위험이 줄어든다.", roman:"ji-ha-su-ga bo-chung-doen-da. Tto-han chim-su wi-heom-i jul-eo-deun-da.", en:"Groundwater is replenished. Furthermore, flooding risk decreases." },
            { kr:"비가 많이 왔다. 반면 기온은 낮았다.", roman:"bi-ga ma-ni wat-da. ban-myeon gi-on-eun na-jat-da.", en:"It rained a lot. On the other hand, temperatures were low." }
          ],
          commonMistake: `To choose the right connector: first identify the DIRECTION of each clause (positive? negative? same direction?). If both clauses go in the same direction (both good OR both bad), use 또한. If they go opposite directions, use 반면 or 그러나.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What problem does asphalt pavement cause? (Choose ALL that apply — pick the best answer)`,
          choices: ["Groundwater shortage + road flooding", "Air pollution + noise", "Tree destruction + groundwater shortage", "Road cracks + flooding"],
          answer: 0,
          explain: `지하수가 부족해지거나 도로가 침수되는 문제 = groundwater shortage OR road flooding — exactly as stated in the passage.`
        },
        {
          kind: "mcq",
          q: `Which connector would you use to say 'On the other hand, the old road flooded easily'?`,
          choices: ["또한", "반면", "비록", "따라서"],
          answer: 1,
          explain: `반면 = on the other hand / whereas — used to contrast two opposite ideas.`
        },
        {
          kind: "mcq",
          q: `What does the new paving material do that asphalt cannot?`,
          choices: ["Reflects heat", "Allows rainwater to pass through", "Absorbs noise", "Changes color in winter"],
          answer: 1,
          explain: `빗물이 통과할 수 있는 새로운 포장재 = new paving material that rainwater can pass through (permeable paving). Asphalt doesn't allow this.`
        }
      ]
    },

    // ─────────────────────────────────────────────
    // Q20 · Main Claim · 투수 포장 (shared passage with Q19)
    // ─────────────────────────────────────────────
    Q20: {
      num: 20,
      type: "main-claim",
      section: "G",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[19~20] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"도시의", roman:"do-si-ui", en:"city's" },
          { kr:"도로는", roman:"do-ro-neun", en:"roads [topic]" },
          { kr:"대부분", roman:"dae-bu-bun", en:"mostly" },
          { kr:"아스팔트로", roman:"a-seu-pal-teu-ro", en:"with asphalt" },
          { kr:"포장되어", roman:"po-jang-doe-eo", en:"are paved and" },
          { kr:"있어", roman:"it-eo", en:"being (so)" },
          { kr:"빗물이", roman:"bit-mul-i", en:"rainwater [subj.]" },
          { kr:"땅속으로", roman:"ttang-sok-eu-ro", en:"into the ground" },
          { kr:"스며들지", roman:"seu-myeo-deul-ji", en:"seep in" },
          { kr:"못한다.", roman:"mot-han-da.", en:"cannot." }
        ]},
        { tokens: [
          { kr:"이로", roman:"i-ro", en:"because of this" },
          { kr:"인해", roman:"in-hae", en:"due to" },
          { kr:"지하수가", roman:"ji-ha-su-ga", en:"groundwater [subj.]" },
          { kr:"부족해지거나", roman:"bu-jok-hae-ji-geo-na", en:"becomes insufficient or" },
          { kr:"장마철에", roman:"jang-ma-cheo-le", en:"during the rainy season" },
          { kr:"도로가", roman:"do-ro-ga", en:"roads [subj.]" },
          { kr:"침수되는", roman:"chim-su-doe-neun", en:"flooded (mod.)" },
          { kr:"문제가", roman:"mun-je-ga", en:"problem [subj.]" },
          { kr:"자주", roman:"ja-ju", en:"often" },
          { kr:"발생한다.", roman:"bal-saeng-han-da.", en:"occurs." }
        ]},
        { tokens: [
          { kr:"최근에는", roman:"choe-geun-e-neun", en:"recently" },
          { kr:"이러한", roman:"i-reo-han", en:"such" },
          { kr:"문제를", roman:"mun-je-reul", en:"problems [obj.]" },
          { kr:"해결하기", roman:"hae-gyeol-ha-gi", en:"solving" },
          { kr:"위해", roman:"wi-hae", en:"in order to" },
          { kr:"빗물이", roman:"bit-mul-i", en:"rainwater [subj.]" },
          { kr:"통과할", roman:"tong-gwa-hal", en:"pass through (mod.)" },
          { kr:"수", roman:"su", en:"(ability marker)" },
          { kr:"있는", roman:"it-neun", en:"can (mod.)" },
          { kr:"새로운", roman:"sae-ro-un", en:"new" },
          { kr:"포장재가", roman:"po-jang-jae-ga", en:"paving material [subj.]" },
          { kr:"개발되었다.", roman:"gae-bal-doe-eot-da.", en:"was developed." }
        ]},
        { tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"포장재를", roman:"po-jang-jae-reul", en:"paving material [obj.]" },
          { kr:"사용하면", roman:"sa-yong-ha-myeon", en:"if used" },
          { kr:"빗물이", roman:"bit-mul-i", en:"rainwater [subj.]" },
          { kr:"쉽게", roman:"swip-ge", en:"easily" },
          { kr:"통과하여", roman:"tong-gwa-ha-yeo", en:"passes through and" },
          { kr:"지하수", roman:"ji-ha-su", en:"groundwater" },
          { kr:"자원이", roman:"ja-won-i", en:"resources [subj.]" },
          { kr:"보충된다.", roman:"bo-chung-doen-da.", en:"are replenished." }
        ]},
        { tokens: [
          { kr:"또한", roman:"tto-han", en:"also, furthermore" },
          { kr:"하수구에", roman:"ha-su-gu-e", en:"into the drain" },
          { kr:"모이는", roman:"mo-i-neun", en:"collected (mod.)" },
          { kr:"빗물의", roman:"bit-mul-ui", en:"rainwater's" },
          { kr:"양이", roman:"yang-i", en:"amount [subj.]" },
          { kr:"줄어들어", roman:"jul-eo-deul-eo", en:"decreases and" },
          { kr:"도로", roman:"do-ro", en:"road" },
          { kr:"침수", roman:"chim-su", en:"flooding" },
          { kr:"위험도", roman:"wi-heom-do", en:"risk also" },
          { kr:"줄어들게", roman:"jul-eo-deul-ge", en:"will decrease" },
          { kr:"된다.", roman:"doen-da.", en:"(will become)." }
        ]}
      ],
      choices: [
        { num:1, kr:"아스팔트 포장은 도시 미관을 해친다.", roman:"a-seu-pal-teu po-jang-eun do-si mi-gwan-eul hae-chin-da.", en:"Asphalt paving harms the urban aesthetic.", correct:false },
        { num:2, kr:"지하수 부족은 장마철에 더욱 심각해진다.", roman:"ji-ha-su bu-jok-eun jang-ma-cheo-le deo-uk sim-gak-hae-jin-da.", en:"Groundwater shortage becomes more serious during the rainy season.", correct:false },
        { num:3, kr:"도로 침수를 막으려면 하수구를 늘려야 한다.", roman:"do-ro chim-su-reul ma-geu-ryeo-myeon ha-su-gu-reul neul-lyeo-ya han-da.", en:"To prevent road flooding, the number of drains must be increased.", correct:false },
        { num:4, kr:"새 포장재가 지하수 부족과 도로 침수 문제 해결에 도움이 될 것이다.", roman:"sae po-jang-jae-ga ji-ha-su bu-jok-gwa do-ro chim-su mun-je hae-gyeol-e do-um-i doel geo-si-da.", en:"The new paving material will help solve the problems of groundwater shortage and road flooding.", correct:true }
      ],
      answer: 4,
      whyRight: `The passage: sets up two problems (groundwater shortage + road flooding from asphalt) → introduces new permeable paving as a solution → shows it addresses BOTH problems. Choice ④ is the only answer that captures the <strong>full claim</strong> of the passage: the new material solves both problems.`,
      whyWrong: {
        1: `Urban aesthetics (도시 미관) are never mentioned. ① is a distractor about something unrelated.`,
        2: `The passage mentions groundwater shortage as a PROBLEM, not a finding about rainy seasons. ② states something that isn't in the passage.`,
        3: `Increasing drains (하수구를 늘리다) is not the solution proposed. The passage proposes new permeable paving, not more drains.`
      },
      vocab: [
        { kr:"도시", roman:"do-si", en:"city, urban" },
        { kr:"침수", roman:"chim-su", en:"flooding, inundation" },
        { kr:"위험", roman:"wi-heom", en:"risk, danger" },
        { kr:"해결", roman:"hae-gyeol", en:"solution, resolution" },
        { kr:"보충", roman:"bo-chung", en:"replenishment, supplementation" },
        { kr:"줄어들다", roman:"jul-eo-deul-da", en:"to decrease, diminish" },
        { kr:"자원", roman:"ja-won", en:"resource(s)" }
      ],
      grammar: [
        {
          pattern: "Reading for main claim — problem → solution structure",
          plainEnglish: `Many TOPIK passages follow a problem → solution structure. The main claim is always the SOLUTION, not just the problem. When choosing the main claim, look for the sentence that synthesizes BOTH the problem AND the proposed solution.`,
          examples: [
            { kr:"아스팔트 → 문제 발생 → 새 포장재 개발 → 두 가지 문제 해결.", roman:"a-seu-pal-teu → mun-je → sae po-jang-jae → hae-gyeol.", en:"Asphalt → Problems → New paving developed → Solves both problems." },
            { kr:"이 글의 중심 내용 = 새 포장재가 두 가지 문제를 해결한다.", roman:"", en:"The main claim = new paving solves both problems." }
          ],
          commonMistake: `Wrong answers for main-claim questions often: (a) pick only the problem without the solution, (b) pick a detail rather than the overall claim, or (c) introduce a solution not mentioned (like ③ 'add more drains').`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the MAIN PURPOSE of the passage?`,
          choices: ["To explain why asphalt was invented", "To propose a new paving material as a solution to two urban problems", "To compare rainwater drainage systems", "To warn about rainy season dangers"],
          answer: 1,
          explain: `The passage: identifies problems with asphalt → introduces new permeable paving → shows it solves both groundwater and flooding issues. That's the main claim.`
        },
        {
          kind: "mcq",
          q: `What are the TWO problems the new paving material helps with?`,
          choices: ["Noise + heat", "Groundwater shortage + road flooding", "Traffic + pollution", "Cracks + aesthetics"],
          answer: 1,
          explain: `지하수 부족 (groundwater shortage) and 도로 침수 (road flooding) are both mentioned as problems caused by asphalt, and both addressed by the new paving.`
        },
        {
          kind: "fill",
          q: `Translate: 빗물이 땅속으로 스며들다`,
          answer: `rainwater seeps into the ground`,
          explain: `빗물 = rainwater, 땅속 = underground/into the ground, 스며들다 = to seep/permeate in.`
        }
      ]
    },
    // ── Q21 · Content Match (long) · Inju food-alley photo problem ──
    Q21: {
      num: 21,
      type: "blank-idiom",
      section: "H",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[21~22] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"인주시의", roman:"in-ju-si-ui", en:"Inju City's" },
          { kr:"한", roman:"han", en:"a, one" },
          { kr:"거리가", roman:"geo-ri-ga", en:"street [subj.]" },
          { kr:"식당과", roman:"sik-dang-gwa", en:"restaurants and" },
          { kr:"카페가", roman:"ka-pe-ga", en:"cafés [subj.]" },
          { kr:"모인", roman:"mo-in", en:"gathered" },
          { kr:"먹거리", roman:"meok-geo-ri", en:"food" },
          { kr:"골목으로", roman:"gol-mok-eu-ro", en:"as an alley" },
          { kr:"특화되면서", roman:"teuk-hwa-doe-myeon-seo", en:"as it specialized" },
          { kr:"최근", roman:"choe-geun", en:"recently" },
          { kr:"이곳을", roman:"i-got-eul", en:"this place [obj.]" },
          { kr:"찾는", roman:"chat-neun", en:"visiting" },
          { kr:"사람들이", roman:"sa-ram-deul-i", en:"people [subj.]" },
          { kr:"늘고", roman:"neul-go", en:"increasing and" },
          { kr:"있다.", roman:"it-da.", en:"are." }
        ]},
        { tokens: [
          { kr:"그런데", roman:"geu-reon-de", en:"however" },
          { kr:"차량", roman:"cha-ryang", en:"vehicle" },
          { kr:"통행을", roman:"tong-haeng-eul", en:"traffic [obj.]" },
          { kr:"막고", roman:"mak-go", en:"blocking and" },
          { kr:"길", roman:"gil", en:"road" },
          { kr:"한가운데에서", roman:"han-ga-un-de-e-seo", en:"in the middle of" },
          { kr:"사진을", roman:"sa-jin-eul", en:"photos [obj.]" },
          { kr:"찍거나", roman:"jjik-geo-na", en:"take or" },
          { kr:"횡단보도", roman:"hoeng-dan-bo-do", en:"crosswalk" },
          { kr:"위에서", roman:"wi-e-seo", en:"on top of" },
          { kr:"삼각대를", roman:"sam-gak-dae-reul", en:"a tripod [obj.]" },
          { kr:"세우고", roman:"se-u-go", en:"set up and" },
          { kr:"촬영하는", roman:"chwa-ryeong-ha-neun", en:"filming" },
          { kr:"등", roman:"deung", en:"etc." },
          { kr:"일부", roman:"il-bu", en:"some" },
          { kr:"방문객의", roman:"bang-mun-gaek-ui", en:"visitors'" },
          { kr:"행동이", roman:"haeng-dong-i", en:"behavior [subj.]" },
          { kr:"( )", roman:"(blank)", en:"[BLANK]", isBlank:true },
          { kr:"한다.", roman:"han-da.", en:"(makes/does)." }
        ]},
        { tokens: [
          { kr:"차량이", roman:"cha-ryang-i", en:"vehicles [subj.]" },
          { kr:"오는", roman:"o-neun", en:"coming" },
          { kr:"것을", roman:"geot-eul", en:"(that) [obj.]" },
          { kr:"보지", roman:"bo-ji", en:"see" },
          { kr:"못하고", roman:"mot-ha-go", en:"unable to, and" },
          { kr:"촬영을", roman:"chwa-ryeong-eul", en:"filming [obj.]" },
          { kr:"하다", roman:"ha-da", en:"while doing" },
          { kr:"사고가", roman:"sa-go-ga", en:"accident [subj.]" },
          { kr:"날", roman:"nal", en:"to happen" },
          { kr:"뻔한", roman:"ppeon-han", en:"nearly (did)" },
          { kr:"위험한", roman:"wi-heom-han", en:"dangerous" },
          { kr:"상황이", roman:"sang-hwang-i", en:"situations [subj.]" },
          { kr:"자주", roman:"ja-ju", en:"frequently" },
          { kr:"발생하면서", roman:"bal-saeng-ha-myeon-seo", en:"occurring, and" },
          { kr:"운전자와", roman:"un-jeon-ja-wa", en:"drivers and" },
          { kr:"방문객", roman:"bang-mun-gaek", en:"visitors" },
          { kr:"간에", roman:"gan-e", en:"between" },
          { kr:"다투는", roman:"da-tu-neun", en:"arguing" },
          { kr:"일도", roman:"il-do", en:"incidents too" },
          { kr:"잦아지고", roman:"ja-ja-ji-go", en:"becoming frequent and" },
          { kr:"있다.", roman:"it-da.", en:"are." }
        ]}
      ],
      choices: [
        { num:1, kr:"목이 빠지게", roman:"mok-i ppa-ji-ge", en:"(so as) to wait anxiously (idiom)", correct:false },
        { num:2, kr:"한숨을 돌리게", roman:"han-sum-eul dol-li-ge", en:"(so as) to catch one's breath / feel relieved", correct:false },
        { num:3, kr:"눈살을 찌푸리게", roman:"nun-sal-eul jji-pu-ri-ge", en:"(so as) to make (people) frown in displeasure", correct:true },
        { num:4, kr:"코가 납작해지게", roman:"ko-ga nap-jak-hae-ji-ge", en:"(so as) to be humbled / put to shame", correct:false }
      ],
      answer: 3,
      whyRight: `The visitors' behavior (blocking traffic, filming on the crosswalk) is improper and bothers others, so it <b>makes people frown</b> — 눈살을 찌푸리다 is the set idiom for causing displeasure/disapproval. ③ fits the disapproving tone of the passage.`,
      whyWrong: {
        "1": `목이 빠지다 (lit. "the neck falls out") means to wait for something very eagerly — it has nothing to do with disapproval.`,
        "2": `한숨을 돌리다 means to catch your breath / feel relief after a hard moment — the opposite of the irritation described here.`,
        "4": `코가 납작해지다 means to be humbled or have one's pride deflated — it describes a person being put in their place, not behavior that annoys others.`
      },
      vocab: [
        { kr:"거리", roman:"geo-ri", en:"street" },
        { kr:"먹거리", roman:"meok-geo-ri", en:"food, things to eat" },
        { kr:"골목", roman:"gol-mok", en:"alley, lane" },
        { kr:"특화되다", roman:"teuk-hwa-doe-da", en:"to be specialized" },
        { kr:"통행", roman:"tong-haeng", en:"passage, (vehicle/foot) traffic" },
        { kr:"횡단보도", roman:"hoeng-dan-bo-do", en:"pedestrian crosswalk" },
        { kr:"삼각대", roman:"sam-gak-dae", en:"tripod" },
        { kr:"촬영하다", roman:"chwa-ryeong-ha-da", en:"to film, to shoot (photo/video)" },
        { kr:"방문객", roman:"bang-mun-gaek", en:"visitor" },
        { kr:"위험하다", roman:"wi-heom-ha-da", en:"to be dangerous" },
        { kr:"다투다", roman:"da-tu-da", en:"to quarrel, to argue" },
        { kr:"잦아지다", roman:"ja-ja-ji-da", en:"to become frequent" }
      ],
      grammar: [
        {
          pattern: "눈살을 찌푸리게 하다 (idiom + -게 하다)",
          plainEnglish: `-게 하다 means "to make/cause (something) to happen." Attached to the idiom 눈살을 찌푸리다 (to frown in displeasure), 눈살을 찌푸리게 하다 = "to make (someone) frown," i.e. to cause disapproval. Korean uses lots of body-part idioms like this.`,
          examples: [
            { kr:"그 행동이 사람들의 눈살을 찌푸리게 했다.", roman:"Geu haeng-dong-i sa-ram-deul-ui nun-sal-eul jji-pu-ri-ge haet-da.", en:"That behavior made people frown (in disapproval)." },
            { kr:"소음이 이웃을 불편하게 한다.", roman:"So-eum-i i-ut-eul bul-pyeon-ha-ge han-da.", en:"The noise makes the neighbors uncomfortable." }
          ],
          commonMistake: `Don't read these body-part idioms literally. 눈살을 찌푸리다 is not "to wrinkle the eye-skin" in meaning — it is the fixed expression for showing displeasure.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does 눈살을 찌푸리다 mean?`,
          choices: ["To frown in displeasure", "To wait eagerly", "To feel relieved", "To be humbled"],
          answer: 0,
          explain: `눈살을 찌푸리다 is the set idiom for frowning out of disapproval or irritation.`
        },
        {
          kind: "mcq",
          q: `Why is the visitors' behavior a problem in the passage?`,
          choices: ["It blocks traffic and causes near-accidents and disputes", "It makes the food taste worse", "It increases parking fees", "It reduces the number of cafés"],
          answer: 0,
          explain: `Filming in the road and on the crosswalk causes near-accidents and quarrels between drivers and visitors.`
        },
        {
          kind: "mcq",
          q: `What does -게 하다 add to a verb?`,
          choices: ["A causative 'make/cause to' meaning", "A past tense", "A question", "A polite request"],
          answer: 0,
          explain: `-게 하다 is the causative: 찌푸리다 (frown) → 찌푸리게 하다 (make someone frown).`
        }
      ]
    },
    // ── Q22 · Content Match (long) · same Inju passage ──
    Q22: {
      num: 22,
      type: "content-match-long",
      section: "H",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[21~22] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"인주시의", roman:"in-ju-si-ui", en:"Inju City's" },
          { kr:"먹거리", roman:"meok-geo-ri", en:"food" },
          { kr:"골목에", roman:"gol-mok-e", en:"alley [loc.]" },
          { kr:"방문객이", roman:"bang-mun-gaek-i", en:"visitors [subj.]" },
          { kr:"늘면서", roman:"neul-myeon-seo", en:"as they increased" },
          { kr:"길에서의", roman:"gil-e-seo-ui", en:"on-the-road" },
          { kr:"촬영으로", roman:"chwa-ryeong-eu-ro", en:"due to filming" },
          { kr:"운전자와", roman:"un-jeon-ja-wa", en:"with drivers" },
          { kr:"갈등이", roman:"gal-deung-i", en:"conflict [subj.]" },
          { kr:"늘고", roman:"neul-go", en:"increasing and" },
          { kr:"있다.", roman:"it-da.", en:"is." }
        ]}
      ],
      passageNote: "⚠️ This question reuses the [21~22] passage shown in Q21. The paragraph here is a condensed recap; the full passage is on Q21.",
      choices: [
        { num:1, kr:"이 거리에서 사진을 찍는 방문객이 줄어들었다.", roman:"i geo-ri-e-seo sa-jin-eul jjik-neun bang-mun-gaek-i jul-eo-deul-eot-da", en:"Visitors taking photos on this street have decreased.", correct:false },
        { num:2, kr:"인주시가 최근 이 거리의 차량 통행을 금지했다.", roman:"in-ju-si-ga choe-geun i geo-ri-ui cha-ryang tong-haeng-eul geum-ji-haet-da", en:"Inju City recently banned vehicle traffic on this street.", correct:false },
        { num:3, kr:"이 거리의 방문객과 운전자 사이에 갈등이 늘고 있다.", roman:"i geo-ri-ui bang-mun-gaek-gwa un-jeon-ja sa-i-e gal-deung-i neul-go it-da", en:"Conflict between visitors and drivers on this street is increasing.", correct:true },
        { num:4, kr:"이 거리에는 식당이 없어 방문객들이 불편을 겪고 있다.", roman:"i geo-ri-e-neun sik-dang-i eop-seo bang-mun-gaek-deul-i bul-pyeon-eul gyeok-go it-da", en:"This street has no restaurants, so visitors are inconvenienced.", correct:false }
      ],
      answer: 3,
      whyRight: `The passage says near-accidents from filming happen often and "운전자와 방문객 간에 다투는 일도 잦아지고 있다" — disputes between drivers and visitors are becoming more frequent. ③ states exactly this: conflict is increasing.`,
      whyWrong: {
        "1": `Visitors are <b>increasing</b> (늘고 있다), not decreasing — and they are still taking photos, which is the source of the problem.`,
        "2": `The city has <b>not</b> banned traffic; the problem is precisely that cars still pass through while people film in the road.`,
        "4": `The street is a specialized <b>food alley full of restaurants and cafés</b> (식당과 카페가 모인 먹거리 골목) — the opposite of having no restaurants.`
      },
      vocab: [
        { kr:"갈등", roman:"gal-deung", en:"conflict, friction" },
        { kr:"줄어들다", roman:"jul-eo-deul-da", en:"to decrease, to dwindle" },
        { kr:"금지하다", roman:"geum-ji-ha-da", en:"to prohibit, to ban" },
        { kr:"사이", roman:"sa-i", en:"between, relationship" },
        { kr:"불편", roman:"bul-pyeon", en:"discomfort, inconvenience" },
        { kr:"겪다", roman:"gyeok-da", en:"to experience, to undergo" },
        { kr:"늘다", roman:"neul-da", en:"to increase, to grow" },
        { kr:"방문객", roman:"bang-mun-gaek", en:"visitor" }
      ],
      grammar: [
        {
          pattern: "N 간에 / N 사이에",
          plainEnglish: `Both mean "between (two or more parties)." N 간에 is a bit more formal/written (운전자와 방문객 간에 = between drivers and visitors); N 사이에 is the everyday equivalent. They mark the relationship or space between people or things.`,
          examples: [
            { kr:"두 나라 간에 갈등이 있다.", roman:"Du na-ra gan-e gal-deung-i it-da.", en:"There is conflict between the two countries." },
            { kr:"친구 사이에 비밀이 없다.", roman:"Chin-gu sa-i-e bi-mil-i eop-da.", en:"There are no secrets between friends." }
          ],
          commonMistake: `For "content-match" questions, always confirm the choice against the text. Wrong options here reverse facts (increase ↔ decrease) or add things the passage never says (a traffic ban).`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `According to the passage, what is increasing?`,
          choices: ["Conflict between visitors and drivers", "The number of restaurants closing", "Parking fines", "Police patrols"],
          answer: 0,
          explain: `The text says disputes between drivers and visitors are becoming more frequent (다투는 일도 잦아지고 있다).`
        },
        {
          kind: "mcq",
          q: `Has Inju City banned cars on this street?`,
          choices: ["No — cars still pass, which is the problem", "Yes — traffic is fully banned", "Yes — only on weekends", "The text does not mention cars"],
          answer: 0,
          explain: `Cars still drive through while people film in the road; there is no ban. That is why near-accidents occur.`
        },
        {
          kind: "mcq",
          q: `What does 갈등 mean?`,
          choices: ["Conflict / friction", "Festival", "Discount", "Traffic light"],
          answer: 0,
          explain: `갈등 = conflict or friction between parties.`
        }
      ]
    },
    // ── Q23 · Main Topic / Feeling · taekwondo (passage withheld) ──
    Q23: {
      num: 23,
      type: "feeling-id",
      section: "I",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[23~24] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"《안내》", roman:"an-nae", en:"《Notice》" },
          { kr:"저작권", roman:"jeo-jak-gwon", en:"copyright" },
          { kr:"관련", roman:"gwan-ryeon", en:"related" },
          { kr:"법령에", roman:"beom-nyeong-e", en:"by law/regulation" },
          { kr:"따라", roman:"tta-ra", en:"according to" },
          { kr:"본", roman:"bon", en:"this" },
          { kr:"문항의", roman:"mun-hang-ui", en:"question's" },
          { kr:"지문은", roman:"ji-mun-eun", en:"passage [topic]" },
          { kr:"공개하지", roman:"gong-gae-ha-ji", en:"disclose" },
          { kr:"않습니다.", roman:"an-seum-ni-da.", en:"is not." }
        ]}
      ],
      passageNote: "⚠️ Passage withheld in the source exam (official copyright notice). The reading text about 태권도 (taekwondo) is not reproduced. The question stem, choices, and answer key are transcribed from the exam; explanations below are based on the choices and the known answer, not on a reproduced passage.",
      choices: [
        { num:1, kr:"설레다", roman:"seol-le-da", en:"to be excited / flutter with anticipation", correct:true },
        { num:2, kr:"샘나다", roman:"saem-na-da", en:"to feel jealous / envious", correct:false },
        { num:3, kr:"아쉽다", roman:"a-swip-da", en:"to feel regretful / that something is lacking", correct:false },
        { num:4, kr:"그립다", roman:"geu-rip-da", en:"to miss / long for", correct:false }
      ],
      answer: 1,
      whyRight: `The official answer key marks ① 설레다 (to feel excited/fluttery with anticipation) as correct. The narrator's underlined feeling about taekwondo is one of happy anticipation. (The passage itself is withheld in the source exam.)`,
      whyWrong: {
        "2": `샘나다 = to feel jealous of someone else — a different emotion from excited anticipation.`,
        "3": `아쉽다 = to feel a tinge of regret or that something is missing — more negative/wistful than 설레다.`,
        "4": `그립다 = to miss or long for something past — nostalgia, not forward-looking excitement.`
      },
      vocab: [
        { kr:"설레다", roman:"seol-le-da", en:"to be excited, to flutter (with anticipation)" },
        { kr:"샘나다", roman:"saem-na-da", en:"to feel jealous/envious" },
        { kr:"아쉽다", roman:"a-swip-da", en:"to feel regretful, to find lacking" },
        { kr:"그립다", roman:"geu-rip-da", en:"to miss, to long for" },
        { kr:"심정", roman:"sim-jeong", en:"feeling, state of mind" },
        { kr:"태권도", roman:"tae-gwon-do", en:"taekwondo" },
        { kr:"밑줄", roman:"mit-jul", en:"underline" }
      ],
      grammar: [
        {
          pattern: "Emotion adjectives for '심정' questions",
          plainEnglish: `TOPIK often asks for the narrator's 심정 (feeling). You match an emotion word to the situation. Useful set: 설레다 (excited), 샘나다 (jealous), 아쉽다 (regretful/lacking), 그립다 (longing), 뿌듯하다 (proud), 막막하다 (at a loss).`,
          examples: [
            { kr:"내일 여행을 생각하니 설렌다.", roman:"Nae-il yeo-haeng-eul saeng-gak-ha-ni seol-len-da.", en:"Thinking about tomorrow's trip, I feel excited." },
            { kr:"고향이 그립다.", roman:"Go-hyang-i geu-rip-da.", en:"I miss my hometown." }
          ],
          commonMistake: `Don't pick a word just because it is positive/negative — match the exact shade. 설레다 is forward-looking excitement; 그립다 is backward-looking longing.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does 설레다 mean?`,
          choices: ["To feel excited/fluttery with anticipation", "To feel jealous", "To miss someone", "To be bored"],
          answer: 0,
          explain: `설레다 describes the fluttery excitement of looking forward to something.`
        },
        {
          kind: "mcq",
          q: `Which word means 'to long for / miss'?`,
          choices: ["그립다", "설레다", "샘나다", "아쉽다"],
          answer: 0,
          explain: `그립다 = to miss or long for something or someone.`
        }
      ]
    },
    // ── Q24 · Content Match · taekwondo (passage withheld) ──
    Q24: {
      num: 24,
      type: "content-match",
      section: "I",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[23~24] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"《안내》", roman:"an-nae", en:"《Notice》" },
          { kr:"저작권", roman:"jeo-jak-gwon", en:"copyright" },
          { kr:"법령에", roman:"beom-nyeong-e", en:"by law" },
          { kr:"따라", roman:"tta-ra", en:"according to" },
          { kr:"지문은", roman:"ji-mun-eun", en:"the passage [topic]" },
          { kr:"공개하지", roman:"gong-gae-ha-ji", en:"disclose" },
          { kr:"않습니다.", roman:"an-seum-ni-da.", en:"is not." }
        ]}
      ],
      passageNote: "⚠️ Passage withheld in the source exam (copyright notice). The narrative about taekwondo is not reproduced. Stem, choices, and answer key are transcribed from the exam.",
      choices: [
        { num:1, kr:"나는 태권도 승급 시험에서 떨어졌다.", roman:"na-neun tae-gwon-do seung-geup si-heom-e-seo tteol-eo-jeot-da", en:"I failed the taekwondo promotion test.", correct:false },
        { num:2, kr:"나는 어릴 때부터 태권도를 즐겨 했다.", roman:"na-neun eo-ril ttae-bu-teo tae-gwon-do-reul jeul-gyeo haet-da", en:"I have enjoyed taekwondo since childhood.", correct:false },
        { num:3, kr:"나는 바로 태권도 성인 반에 등록했다.", roman:"na-neun ba-ro tae-gwon-do seong-in ban-e deung-nok-haet-da", en:"I immediately registered for the adult taekwondo class.", correct:false },
        { num:4, kr:"나는 태권도 수업에 한 번도 빠지지 않았다.", roman:"na-neun tae-gwon-do su-eop-e han beon-do ppa-ji-ji an-at-da", en:"I never missed a single taekwondo class.", correct:true }
      ],
      answer: 4,
      whyRight: `The official answer key marks ④ as correct: the narrator never missed a single taekwondo class (한 번도 빠지지 않았다). (The passage is withheld in the source exam.)`,
      whyWrong: {
        "1": `승급 시험에서 떨어지다 = to fail the promotion test — not what the key supports.`,
        "2": `Enjoying taekwondo "since childhood" (어릴 때부터) is not the matched statement per the key.`,
        "3": `Registering "immediately for the adult class" (바로 성인 반에 등록) is not the matched statement.`
      },
      vocab: [
        { kr:"승급", roman:"seung-geup", en:"promotion (in rank/grade)" },
        { kr:"시험", roman:"si-heom", en:"test, exam" },
        { kr:"떨어지다", roman:"tteol-eo-ji-da", en:"to fall; to fail (a test)" },
        { kr:"즐겨 하다", roman:"jeul-gyeo ha-da", en:"to enjoy doing, to do habitually for fun" },
        { kr:"등록하다", roman:"deung-nok-ha-da", en:"to register, to enroll" },
        { kr:"빠지다", roman:"ppa-ji-da", en:"to miss (a class), to be absent; to fall into" },
        { kr:"한 번도", roman:"han beon-do", en:"not even once (with negative)" }
      ],
      grammar: [
        {
          pattern: "한 번도 + 안/못 + V (not even once)",
          plainEnglish: `한 번도 means "not even once" and always pairs with a negative verb. 한 번도 빠지지 않았다 = "didn't miss even once." The 도 here means "even," reinforcing the total negation.`,
          examples: [
            { kr:"수업에 한 번도 빠지지 않았어요.", roman:"Su-eop-e han beon-do ppa-ji-ji an-a-sseo-yo.", en:"I didn't miss class even once." },
            { kr:"그 영화를 한 번도 못 봤어요.", roman:"Geu yeong-hwa-reul han beon-do mot bwa-sseo-yo.", en:"I haven't seen that movie even once." }
          ],
          commonMistake: `한 번도 must be followed by a negative (안/못/-지 않다). Using it with a positive verb is ungrammatical.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does 빠지다 mean in '수업에 빠지다'?`,
          choices: ["To miss / be absent from class", "To pass an exam", "To register", "To teach"],
          answer: 0,
          explain: `수업에 빠지다 = to miss / skip a class.`
        },
        {
          kind: "mcq",
          q: `한 번도 must be followed by what?`,
          choices: ["A negative verb (안/못/-지 않다)", "A past-tense positive verb", "A question word", "A polite ending"],
          answer: 0,
          explain: `한 번도 ("not even once") always pairs with a negative verb.`
        }
      ]
    },
    // ── Q25 · Newspaper Headline · Inju tourism via TV ──
    Q25: {
      num: 25,
      type: "headline",
      section: "J",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[25~27] 다음 신문 기사의 제목을 가장 잘 설명한 것을 고르십시오. (각 2점)",
        en: "Choose the option that best explains the headline of the following newspaper article. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"[신문 기사 제목]", roman:"sin-mun gi-sa je-mok", en:"[Newspaper headline]" }
        ]},
        { tokens: [
          { kr:"TV", roman:"TV", en:"TV" },
          { kr:"프로그램", roman:"peu-ro-geu-raem", en:"program" },
          { kr:"방영", roman:"bang-yeong", en:"broadcast/airing" },
          { kr:"효과", roman:"hyo-gwa", en:"effect" },
          { kr:"'톡톡',", roman:"tok-tok", en:"'noticeable/lively' (mimetic)" },
          { kr:"인주시는", roman:"in-ju-si-neun", en:"Inju City [topic]" },
          { kr:"관광객", roman:"gwan-gwang-gaek", en:"tourists" },
          { kr:"물결", roman:"mul-gyeol", en:"wave (surge)" }
        ]}
      ],
      choices: [
        { num:1, kr:"TV 프로그램 제작자들이 관광객을 촬영하러 인주시로 모여들었다.", roman:"TV peu-ro-geu-raem je-jak-ja-deul-i gwan-gwang-gaek-eul chwa-ryeong-ha-reo in-ju-si-ro mo-yeo-deul-eot-da", en:"TV program producers flocked to Inju City to film tourists.", correct:false },
        { num:2, kr:"인주시가 TV 프로그램에 나온 덕분에 많은 관광객이 방문하고 있다.", roman:"in-ju-si-ga TV peu-ro-geu-raem-e na-on deok-bun-e man-eun gwan-gwang-gaek-i bang-mun-ha-go it-da", en:"Thanks to appearing on a TV program, many tourists are visiting Inju City.", correct:true },
        { num:3, kr:"인주시가 관광객 유치를 위해 TV 프로그램 홍보 방송을 준비하고 있다.", roman:"in-ju-si-ga gwan-gwang-gaek yu-chi-reul wi-hae TV peu-ro-geu-raem hong-bo bang-song-eul jun-bi-ha-go it-da", en:"Inju City is preparing a TV promo broadcast to attract tourists.", correct:false },
        { num:4, kr:"TV 프로그램 방송 후에 관광객이 증가해 인주시에 여러 문제가 발생했다.", roman:"TV peu-ro-geu-raem bang-song hu-e gwan-gwang-gaek-i jeung-ga-hae in-ju-si-e yeo-reo mun-je-ga bal-saeng-haet-da", en:"After the TV broadcast, tourists increased and various problems arose in Inju City.", correct:false }
      ],
      answer: 2,
      whyRight: `The headline says the TV broadcast had a strong effect (효과 '톡톡') and Inju City now sees a "wave of tourists" (관광객 물결). ② captures both: because the city appeared on TV, many tourists are now visiting.`,
      whyWrong: {
        "1": `The headline is about tourists coming to the city, not producers coming to film tourists. ① reverses who is arriving and why.`,
        "3": `The TV effect already happened (방영 효과) — the city is not still "preparing" a promotional broadcast. ③ puts it in the wrong tense/stage.`,
        "4": `The headline is positive (a welcome surge of tourists). It says nothing about "various problems" arising. ④ adds a negative outcome not in the title.`
      },
      vocab: [
        { kr:"방영", roman:"bang-yeong", en:"broadcasting, airing (of a program)" },
        { kr:"효과", roman:"hyo-gwa", en:"effect, impact" },
        { kr:"관광객", roman:"gwan-gwang-gaek", en:"tourist" },
        { kr:"물결", roman:"mul-gyeol", en:"wave; (figurative) surge" },
        { kr:"덕분에", roman:"deok-bun-e", en:"thanks to, owing to" },
        { kr:"유치", roman:"yu-chi", en:"attraction, drawing in (e.g., investment/tourists)" },
        { kr:"홍보", roman:"hong-bo", en:"publicity, promotion" },
        { kr:"증가하다", roman:"jeung-ga-ha-da", en:"to increase" }
      ],
      grammar: [
        {
          pattern: "N 덕분에 (thanks to N)",
          plainEnglish: `N 덕분에 means "thanks to / owing to N" and is used for positive results. Headlines compress cause→effect; here the cause is appearing on TV and the positive effect is a surge of tourists.`,
          examples: [
            { kr:"방송에 나온 덕분에 손님이 늘었어요.", roman:"Bang-song-e na-on deok-bun-e son-nim-i neul-eo-sseo-yo.", en:"Thanks to appearing on the broadcast, customers increased." },
            { kr:"친구 덕분에 길을 찾았어요.", roman:"Chin-gu deok-bun-e gil-eul cha-ja-sseo-yo.", en:"Thanks to my friend, I found the way." }
          ],
          commonMistake: `덕분에 is for good outcomes; for bad outcomes use 때문에 (because of). A headline's tone (positive vs. negative) tells you which interpretation fits.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the headline mainly reporting?`,
          choices: ["A TV appearance brought a surge of tourists to Inju City", "Tourists caused problems in Inju City", "The city is planning a new TV ad", "Producers came to film tourists"],
          answer: 0,
          explain: `방영 효과 톡톡 + 관광객 물결 = the TV exposure caused a wave of visitors.`
        },
        {
          kind: "mcq",
          q: `덕분에 is used for what kind of result?`,
          choices: ["A positive result (thanks to)", "A negative result (because of)", "A neutral time marker", "A question"],
          answer: 0,
          explain: `덕분에 = "thanks to," used for favorable outcomes; 때문에 covers negative causes.`
        }
      ]
    },
    // ── Q26 · Newspaper Headline · fencing medal drought ends ──
    Q26: {
      num: 26,
      type: "headline",
      section: "J",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[25~27] 다음 신문 기사의 제목을 가장 잘 설명한 것을 고르십시오. (각 2점)",
        en: "Choose the option that best explains the headline of the following newspaper article. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"[신문 기사 제목]", roman:"sin-mun gi-sa je-mok", en:"[Newspaper headline]" }
        ]},
        { tokens: [
          { kr:"김수미", roman:"kim-su-mi", en:"Kim Su-mi (athlete name)" },
          { kr:"선수", roman:"seon-su", en:"athlete/player" },
          { kr:"시상대에", roman:"si-sang-dae-e", en:"on the podium" },
          { kr:"올라,", roman:"ol-la", en:"steps up," },
          { kr:"펜싱", roman:"pen-sing", en:"fencing" },
          { kr:"종목", roman:"jong-mok", en:"event/discipline" },
          { kr:"메달", roman:"me-dal", en:"medal" },
          { kr:"가뭄", roman:"ga-mum", en:"drought" },
          { kr:"끝", roman:"kkeut", en:"end" }
        ]}
      ],
      choices: [
        { num:1, kr:"김 선수가 펜싱 대표팀에서 메달을 목표로 열심히 훈련했다.", roman:"kim seon-su-ga pen-sing dae-pyo-tim-e-seo me-dal-eul mok-pyo-ro yeol-sim-hi hun-ryeon-haet-da", en:"Athlete Kim trained hard aiming for a medal on the fencing team.", correct:false },
        { num:2, kr:"김 선수가 메달을 따면서 오랜만에 펜싱 종목에서 메달이 나왔다.", roman:"kim seon-su-ga me-dal-eul tta-myeon-seo o-raen-man-e pen-sing jong-mok-e-seo me-dal-i na-wat-da", en:"With Kim winning a medal, fencing produced a medal for the first time in a long while.", correct:true },
        { num:3, kr:"김 선수가 가장 많은 메달을 따며 펜싱 종목에서 신기록을 세웠다.", roman:"kim seon-su-ga ga-jang man-eun me-dal-eul tta-myeo pen-sing jong-mok-e-seo sin-gi-rok-eul se-wot-da", en:"Kim won the most medals and set a new record in fencing.", correct:false },
        { num:4, kr:"김 선수가 펜싱 종목에서 좋은 경기를 펼쳤지만 아쉽게 메달을 놓쳤다.", roman:"kim seon-su-ga pen-sing jong-mok-e-seo jo-eun gyeong-gi-reul pyeol-chyeot-ji-man a-swip-ge me-dal-eul no-chyeot-da", en:"Kim played well in fencing but regrettably missed the medal.", correct:false }
      ],
      answer: 2,
      whyRight: `"시상대에 올라" = stepped onto the podium (won a medal); "메달 가뭄 끝" = the medal "drought" is over. ② captures both: Kim won, ending a long medal drought in fencing.`,
      whyWrong: {
        "1": `Training hard "aiming for a medal" describes effort before a result. The headline reports an achieved result (she made the podium). ① misses that she actually won.`,
        "3": `The headline does not say "the most medals" or "a new record" (신기록). It says the drought ended — i.e., a medal finally came, not a record haul. ③ overstates it.`,
        "4": `시상대에 올라 means she got on the podium (won). ④ says she "missed the medal," the opposite of the headline.`
      },
      vocab: [
        { kr:"선수", roman:"seon-su", en:"athlete, player" },
        { kr:"시상대", roman:"si-sang-dae", en:"awards podium" },
        { kr:"펜싱", roman:"pen-sing", en:"fencing" },
        { kr:"종목", roman:"jong-mok", en:"(sporting) event, discipline" },
        { kr:"가뭄", roman:"ga-mum", en:"drought (also figurative 'long absence')" },
        { kr:"오랜만에", roman:"o-raen-man-e", en:"after a long time, for the first time in a while" },
        { kr:"신기록", roman:"sin-gi-rok", en:"new record" },
        { kr:"놓치다", roman:"no-chi-da", en:"to miss, to let slip" }
      ],
      grammar: [
        {
          pattern: "Figurative '가뭄' (drought) in headlines",
          plainEnglish: `Korean headlines reuse 가뭄 (drought) figuratively to mean a long dry spell with no success. 메달 가뭄 = a long medal drought. 가뭄 끝 = "drought over," i.e. the long wait finally ended.`,
          examples: [
            { kr:"오랜 골 가뭄을 끝냈다.", roman:"O-raen gol ga-mum-eul kkeun-naet-da.", en:"He ended a long goal drought." },
            { kr:"오랜만에 우승했다.", roman:"O-raen-man-e u-seung-haet-da.", en:"They won for the first time in a long while." }
          ],
          commonMistake: `Headlines drop verbs and particles. "시상대에 올라" (ending in 올라) implies "올랐다" (stepped up = won). Read the implied verb to get the meaning.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does 메달 가뭄 끝 mean here?`,
          choices: ["A long medal drought has ended", "A record number of medals", "She missed the medal", "Medals were canceled"],
          answer: 0,
          explain: `가뭄 = drought (figurative); 끝 = end. A long spell with no medals is over.`
        },
        {
          kind: "mcq",
          q: `시상대에 오르다 means…`,
          choices: ["To step onto the podium (win a medal)", "To miss the final", "To retire", "To train hard"],
          answer: 0,
          explain: `시상대 = awards podium; 오르다 = to step up. Getting on the podium means winning a medal.`
        }
      ]
    },
    // ── Q27 · Newspaper Headline · malicious comments, weak punishment ──
    Q27: {
      num: 27,
      type: "headline",
      section: "J",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[25~27] 다음 신문 기사의 제목을 가장 잘 설명한 것을 고르십시오. (각 2점)",
        en: "Choose the option that best explains the headline of the following newspaper article. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"[신문 기사 제목]", roman:"sin-mun gi-sa je-mok", en:"[Newspaper headline]" }
        ]},
        { tokens: [
          { kr:"선", roman:"seon", en:"line" },
          { kr:"넘은", roman:"neom-eun", en:"crossed (over)" },
          { kr:"악성", roman:"ak-seong", en:"malicious" },
          { kr:"댓글,", roman:"daet-geul", en:"(online) comments," },
          { kr:"처벌은", roman:"cheo-beol-eun", en:"punishment [topic]" },
          { kr:"여전히", roman:"yeo-jeon-hi", en:"still" },
          { kr:"솜방망이", roman:"som-bang-mang-i", en:"'cotton club' = a slap on the wrist" }
        ]}
      ],
      choices: [
        { num:1, kr:"악의적인 댓글이 줄어든 만큼 처벌 수위를 낮추자는 의견이 제기됐다.", roman:"ak-ui-jeok-in daet-geul-i jul-eo-deun man-keum cheo-beol su-wi-reul nat-chu-ja-neun ui-gyeon-i je-gi-dwaet-da", en:"As malicious comments dropped, a view was raised to lower the punishment level.", correct:false },
        { num:2, kr:"악의적인 댓글에 대한 처벌을 강화했으나 피해는 감소하지 않고 있다.", roman:"ak-ui-jeok-in daet-geul-e dae-han cheo-beol-eul gang-hwa-haet-eu-na pi-hae-neun gam-so-ha-ji an-go it-da", en:"Punishment for malicious comments was strengthened, but harm is not decreasing.", correct:false },
        { num:3, kr:"악의적인 댓글이 지나치게 심각해졌음에도 처벌 수위는 아직도 너무 낮다.", roman:"ak-ui-jeok-in daet-geul-i ji-na-chi-ge sim-gak-hae-jyeot-eum-e-do cheo-beol su-wi-neun a-jik-do neo-mu nat-da", en:"Even though malicious comments have become excessively serious, the punishment level is still too low.", correct:true },
        { num:4, kr:"악의적인 댓글이 계속 이어지자 피해자들이 무거운 처벌을 요구하고 나섰다.", roman:"ak-ui-jeok-in daet-geul-i gye-sok i-eo-ji-ja pi-hae-ja-deul-i mu-geo-un cheo-beol-eul yo-gu-ha-go na-seot-da", en:"As malicious comments continued, victims came forward demanding heavy punishment.", correct:false }
      ],
      answer: 3,
      whyRight: `"선 넘은 악성 댓글" = malicious comments that have crossed the line (gotten too serious); "처벌은 여전히 솜방망이" = punishment is still a "cotton club" (way too soft). ③ states exactly this: the comments are extreme, yet punishment remains too low.`,
      whyWrong: {
        "1": `The headline says the comments crossed the line (worse, not fewer). ① claims they "dropped" and proposes lowering punishment — opposite on both counts.`,
        "2": `솜방망이 means punishment is still weak — it was NOT "strengthened." ② contradicts the headline's point.`,
        "4": `The headline comments on weak punishment, not on victims "demanding heavy punishment." ④ adds an action not in the title.`
      },
      vocab: [
        { kr:"선을 넘다", roman:"seon-eul neom-da", en:"to cross the line, to go too far" },
        { kr:"악성", roman:"ak-seong", en:"malicious, malignant" },
        { kr:"댓글", roman:"daet-geul", en:"online comment, reply" },
        { kr:"처벌", roman:"cheo-beol", en:"punishment, penalty" },
        { kr:"여전히", roman:"yeo-jeon-hi", en:"still, as before" },
        { kr:"솜방망이", roman:"som-bang-mang-i", en:"a token/lenient punishment ('cotton club')" },
        { kr:"수위", roman:"su-wi", en:"level, degree (lit. water level)" },
        { kr:"강화하다", roman:"gang-hwa-ha-da", en:"to strengthen, to reinforce" },
        { kr:"피해", roman:"pi-hae", en:"harm, damage" }
      ],
      grammar: [
        {
          pattern: "-(았/었)음에도 (불구하고)",
          plainEnglish: `-음에도 (불구하고) means "even though / despite the fact that." 심각해졌음에도 = "even though it has become serious." It sets up a contrast: bad situation, yet inadequate response.`,
          examples: [
            { kr:"문제가 심각해졌음에도 대책이 없다.", roman:"Mun-je-ga sim-gak-hae-jyeot-eum-e-do dae-chaek-i eop-da.", en:"Even though the problem has gotten serious, there is no countermeasure." },
            { kr:"노력했음에도 결과가 나빴다.", roman:"No-ryeok-haet-eum-e-do gyeol-gwa-ga na-ppat-da.", en:"Despite trying, the result was bad." }
          ],
          commonMistake: `솜방망이 (처벌) is an idiom: a "cotton club" can't hurt, so it means a punishment too weak to deter. Don't read it literally.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does 솜방망이 처벌 mean?`,
          choices: ["Punishment that is far too lenient", "Extremely harsh punishment", "A fair punishment", "No punishment at all"],
          answer: 0,
          explain: `솜방망이 ("cotton club") = a punishment too soft to deter wrongdoing.`
        },
        {
          kind: "mcq",
          q: `선을 넘다 means…`,
          choices: ["To cross the line / go too far", "To stand in line", "To draw a line", "To wait patiently"],
          answer: 0,
          explain: `선을 넘다 = to cross the line, to exceed acceptable limits.`
        }
      ]
    },
    // ── Q28 · Argument Blank · Hogarth serialized prints ──
    Q28: {
      num: 28,
      type: "argument-blank",
      section: "K",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[28~31] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate words to fill in the blank ( ). (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"오늘날의", roman:"o-neul-nal-ui", en:"today's" },
          { kr:"연재", roman:"yeon-jae", en:"serialized" },
          { kr:"만화처럼", roman:"man-hwa-cheo-reom", en:"like comics" },
          { kr:"이야기가", roman:"i-ya-gi-ga", en:"the story [subj.]" },
          { kr:"회차별로", roman:"hoe-cha-byeol-lo", en:"by episode" },
          { kr:"이어지는", roman:"i-eo-ji-neun", en:"that continues" },
          { kr:"작품의", roman:"jak-pum-ui", en:"work's" },
          { kr:"형식은", roman:"hyeong-sik-eun", en:"format [topic]" },
          { kr:"이미", roman:"i-mi", en:"already" },
          { kr:"18세기에도", roman:"sip-pal-se-gi-e-do", en:"even in the 18th century" },
          { kr:"존재했다.", roman:"jon-jae-haet-da.", en:"existed." }
        ]},
        { tokens: [
          { kr:"영국의", roman:"yeong-guk-ui", en:"Britain's" },
          { kr:"화가", roman:"hwa-ga", en:"painter" },
          { kr:"윌리엄", roman:"wil-li-eom", en:"William" },
          { kr:"호가스는", roman:"ho-ga-seu-neun", en:"Hogarth [topic]" },
          { kr:"드라마", roman:"deu-ra-ma", en:"drama" },
          { kr:"못지않게", roman:"mot-ji-an-ke", en:"no less than" },
          { kr:"흥미진진한", roman:"heung-mi-jin-jin-han", en:"thrilling" },
          { kr:"이야기를", roman:"i-ya-gi-reul", en:"stories [obj.]" },
          { kr:"여러", roman:"yeo-reo", en:"several" },
          { kr:"장의", roman:"jang-ui", en:"sheets of" },
          { kr:"그림으로", roman:"geu-rim-eu-ro", en:"into pictures" },
          { kr:"나누어", roman:"na-nu-eo", en:"dividing" },
          { kr:"구성했다.", roman:"gu-seong-haet-da.", en:"composed." }
        ]},
        { tokens: [
          { kr:"그리고", roman:"geu-ri-go", en:"and" },
          { kr:"이를", roman:"i-reul", en:"these [obj.]" },
          { kr:"판화에", roman:"pan-hwa-e", en:"onto prints" },
          { kr:"새긴", roman:"sae-gin", en:"engraved" },
          { kr:"후", roman:"hu", en:"after" },
          { kr:"( )", roman:"(blank)", en:"[BLANK]", isBlank:true },
          { kr:"순서대로", roman:"sun-seo-dae-ro", en:"in order" },
          { kr:"인쇄해", roman:"in-swae-hae", en:"printing" },
          { kr:"판매했다.", roman:"pan-mae-haet-da.", en:"sold." }
        ]},
        { tokens: [
          { kr:"독자들은", roman:"dok-ja-deul-eun", en:"readers [topic]" },
          { kr:"다음", roman:"da-eum", en:"next" },
          { kr:"회를", roman:"hoe-reul", en:"episode [obj.]" },
          { kr:"손꼽아", roman:"son-kkop-a", en:"counting (on fingers)" },
          { kr:"기다렸고", roman:"gi-da-ryeot-go", en:"waited, and" },
          { kr:"그의", roman:"geu-ui", en:"his" },
          { kr:"그림을", roman:"geu-rim-eul", en:"pictures [obj.]" },
          { kr:"보기", roman:"bo-gi", en:"to see" },
          { kr:"위해", roman:"wi-hae", en:"in order to" },
          { kr:"기꺼이", roman:"gi-kkeo-i", en:"willingly" },
          { kr:"돈을", roman:"don-eul", en:"money [obj.]" },
          { kr:"지불했다.", roman:"ji-bul-haet-da.", en:"paid." }
        ]}
      ],
      choices: [
        { num:1, kr:"만화가가 되려고", roman:"man-hwa-ga-ga doe-ryeo-go", en:"in order to become a cartoonist", correct:false },
        { num:2, kr:"주문을 받지 않고", roman:"ju-mun-eul bat-ji an-go", en:"without taking orders", correct:false },
        { num:3, kr:"작가를 밝히지 않고", roman:"jak-ga-reul bal-hi-ji an-go", en:"without revealing the author", correct:false },
        { num:4, kr:"일정한 기간을 두고", roman:"il-jeong-han gi-gan-eul du-go", en:"at regular intervals (leaving a set period)", correct:true }
      ],
      answer: 4,
      whyRight: `The passage compares Hogarth's prints to today's <b>serialized comics</b> (연재 만화) released "회차별로" (episode by episode), with readers eagerly awaiting "다음 회" (the next installment). Selling "in order" with waiting between episodes means releasing them <b>at regular intervals</b> — ④.`,
      whyWrong: {
        "1": `His goal wasn't "to become a cartoonist" — he was already a painter producing the works. ① doesn't fit the blank's logic of how they were released.`,
        "2": `Whether or not he "took orders" is never discussed and doesn't connect to selling them "in order" over time. ② is irrelevant.`,
        "3": `Hiding the author contradicts the point — readers paid to see <b>his</b> pictures, so authorship mattered. ③ is the opposite of the context.`
      },
      vocab: [
        { kr:"연재", roman:"yeon-jae", en:"serialization (in installments)" },
        { kr:"만화", roman:"man-hwa", en:"comic, cartoon" },
        { kr:"회차", roman:"hoe-cha", en:"episode/installment number" },
        { kr:"이어지다", roman:"i-eo-ji-da", en:"to continue, to be connected" },
        { kr:"화가", roman:"hwa-ga", en:"painter" },
        { kr:"판화", roman:"pan-hwa", en:"printmaking, a print/engraving" },
        { kr:"새기다", roman:"sae-gi-da", en:"to engrave, to carve" },
        { kr:"인쇄하다", roman:"in-swae-ha-da", en:"to print" },
        { kr:"기꺼이", roman:"gi-kkeo-i", en:"willingly, gladly" },
        { kr:"일정하다", roman:"il-jeong-ha-da", en:"to be fixed/regular/constant" }
      ],
      grammar: [
        {
          pattern: "기간을 두고 (leaving an interval)",
          plainEnglish: `두고 (from 두다, to place/leave) with a time word means "leaving (a gap of) ~." 일정한 기간을 두고 = "at regular intervals / leaving a set period between." Common for things released or done periodically.`,
          examples: [
            { kr:"일주일 간격을 두고 발표했다.", roman:"Il-ju-il gan-gyeok-eul du-go bal-pyo-haet-da.", en:"They released it at one-week intervals." },
            { kr:"시간을 두고 천천히 생각하세요.", roman:"Si-gan-eul du-go cheon-cheon-hi saeng-gak-ha-se-yo.", en:"Take your time and think slowly." }
          ],
          commonMistake: `For blank-fill questions, use the surrounding clues (연재, 회차별로, 다음 회를 기다렸다) — they all point to periodic release, which is what the blank must express.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What modern format does the passage compare Hogarth's prints to?`,
          choices: ["Serialized comics released episode by episode", "Oil paintings in a museum", "Newspaper advertisements", "Sculpture exhibits"],
          answer: 0,
          explain: `It likens them to 연재 만화 (serialized comics) released 회차별로 (by episode), with readers awaiting the next installment.`
        },
        {
          kind: "mcq",
          q: `일정한 기간을 두고 means…`,
          choices: ["At regular intervals", "Without any delay", "All at once", "In a random order"],
          answer: 0,
          explain: `기간을 두고 = leaving a period between; 일정한 = regular → "at regular intervals."`
        }
      ]
    },
    // ── Q29 · Argument Blank · brushing after sour food ──
    Q29: {
      num: 29,
      type: "argument-blank",
      section: "K",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[28~31] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate words to fill in the blank ( ). (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"사람들은", roman:"sa-ram-deul-eun", en:"people [topic]" },
          { kr:"보통", roman:"bo-tong", en:"usually" },
          { kr:"식후에", roman:"sik-hu-e", en:"after eating" },
          { kr:"바로", roman:"ba-ro", en:"right away" },
          { kr:"이를", roman:"i-reul", en:"teeth [obj.]" },
          { kr:"닦는다.", roman:"dak-neun-da.", en:"brush." }
        ]},
        { tokens: [
          { kr:"하지만", roman:"ha-ji-man", en:"but" },
          { kr:"레몬", roman:"re-mon", en:"lemon" },
          { kr:"등", roman:"deung", en:"etc." },
          { kr:"신맛이", roman:"sin-mat-i", en:"sour taste [subj.]" },
          { kr:"강한", roman:"gang-han", en:"strong" },
          { kr:"음식을", roman:"eum-sik-eul", en:"food [obj.]" },
          { kr:"먹은", roman:"meok-eun", en:"eaten" },
          { kr:"후에", roman:"hu-e", en:"after" },
          { kr:"바로", roman:"ba-ro", en:"right away" },
          { kr:"양치질을", roman:"yang-chi-jil-eul", en:"tooth-brushing [obj.]" },
          { kr:"하는", roman:"ha-neun", en:"doing" },
          { kr:"것은", roman:"geot-eun", en:"(thing) [topic]" },
          { kr:"좋지", roman:"jo-chi", en:"good" },
          { kr:"않다.", roman:"an-ta.", en:"is not." }
        ]},
        { tokens: [
          { kr:"신", roman:"sin", en:"sour" },
          { kr:"음식에", roman:"eum-sik-e", en:"in food" },
          { kr:"있는", roman:"it-neun", en:"that is in" },
          { kr:"산성이", roman:"san-seong-i", en:"acidity [subj.]" },
          { kr:"치아", roman:"chi-a", en:"tooth" },
          { kr:"보호막을", roman:"bo-ho-mak-eul", en:"protective layer [obj.]" },
          { kr:"( )", roman:"(blank)", en:"[BLANK]", isBlank:true },
          { kr:"때문에", roman:"ttae-mun-e", en:"because" },
          { kr:"바로", roman:"ba-ro", en:"immediately" },
          { kr:"칫솔질로", roman:"chit-sol-jil-lo", en:"with brushing" },
          { kr:"자극하면", roman:"ja-geuk-ha-myeon", en:"if (you) stimulate" },
          { kr:"치아가", roman:"chi-a-ga", en:"teeth [subj.]" },
          { kr:"더", roman:"deo", en:"more" },
          { kr:"손상된다.", roman:"son-sang-doen-da.", en:"get damaged." }
        ]},
        { tokens: [
          { kr:"치아", roman:"chi-a", en:"tooth" },
          { kr:"보호막이", roman:"bo-ho-mak-i", en:"protective layer [subj.]" },
          { kr:"원래", roman:"wol-lae", en:"original" },
          { kr:"강도로", roman:"gang-do-ro", en:"to (its) strength" },
          { kr:"돌아오려면", roman:"dol-a-o-ryeo-myeon", en:"to return, you need" },
          { kr:"침으로", roman:"chim-eu-ro", en:"by saliva" },
          { kr:"산성이", roman:"san-seong-i", en:"acidity [subj.]" },
          { kr:"중화되어야", roman:"jung-hwa-doe-eo-ya", en:"must be neutralized" },
          { kr:"하는데", roman:"ha-neun-de", en:"and" },
          { kr:"여기에", roman:"yeo-gi-e", en:"for this" },
          { kr:"30분", roman:"sam-sip-bun", en:"30 minutes" },
          { kr:"정도가", roman:"jeong-do-ga", en:"about [subj.]" },
          { kr:"소요된다.", roman:"so-yo-doen-da.", en:"is required." }
        ]}
      ],
      choices: [
        { num:1, kr:"누렇게 바꾸기", roman:"nu-reo-ke ba-kku-gi", en:"turning it yellow", correct:false },
        { num:2, kr:"여러 겹으로 만들기", roman:"yeo-reo gyeop-eu-ro man-deul-gi", en:"making it into many layers", correct:false },
        { num:3, kr:"일시적으로 약화시키기", roman:"il-si-jeok-eu-ro yak-hwa-si-ki-gi", en:"temporarily weakening it", correct:true },
        { num:4, kr:"음식물로부터 보호하기", roman:"eum-sik-mul-lo-bu-teo bo-ho-ha-gi", en:"protecting it from food", correct:false }
      ],
      answer: 3,
      whyRight: `The next sentence says the protective layer needs ~30 minutes for the acid to be <b>neutralized</b> and to "return to its original strength" (원래 강도로 돌아오려면). That only makes sense if the acid first <b>temporarily weakens</b> the layer — ③. That's why brushing right away causes more damage.`,
      whyWrong: {
        "1": `"Turning it yellow" is about color, but the passage is about <b>strength/damage</b>, not staining. ① doesn't explain why brushing harms the teeth.`,
        "2": `"Making it into many layers" would strengthen, not harm — contradicting "치아가 더 손상된다" (teeth get more damaged). ② is the opposite.`,
        "4": `If acid "protected" the layer, brushing wouldn't cause extra damage. ④ contradicts the cause-effect of the sentence.`
      },
      vocab: [
        { kr:"식후", roman:"sik-hu", en:"after a meal" },
        { kr:"양치질", roman:"yang-chi-jil", en:"tooth brushing" },
        { kr:"신맛", roman:"sin-mat", en:"sour taste" },
        { kr:"산성", roman:"san-seong", en:"acidity, acidic" },
        { kr:"치아", roman:"chi-a", en:"tooth (formal)" },
        { kr:"보호막", roman:"bo-ho-mak", en:"protective layer/film" },
        { kr:"자극하다", roman:"ja-geuk-ha-da", en:"to stimulate, to irritate" },
        { kr:"손상되다", roman:"son-sang-doe-da", en:"to be damaged" },
        { kr:"중화되다", roman:"jung-hwa-doe-da", en:"to be neutralized" },
        { kr:"일시적", roman:"il-si-jeok", en:"temporary" },
        { kr:"약화시키다", roman:"yak-hwa-si-ki-da", en:"to weaken (something)" }
      ],
      grammar: [
        {
          pattern: "-기 때문에 (because of -ing)",
          plainEnglish: `Verb + -기 turns the verb into a noun ("the -ing"), and 때문에 means "because of." 약화시키기 때문에 = "because (it) weakens (the layer)." The blank is a noun-phrase reason that must fit "because ___, brushing damages teeth."`,
          examples: [
            { kr:"비가 오기 때문에 못 가요.", roman:"Bi-ga o-gi ttae-mun-e mot ga-yo.", en:"Because it's raining, I can't go." },
            { kr:"산성이 보호막을 약화시키기 때문에 바로 닦으면 안 돼요.", roman:"San-seong-i bo-ho-mak-eul yak-hwa-si-ki-gi ttae-mun-e ba-ro dak-eu-myeon an dwae-yo.", en:"Because the acid weakens the protective layer, you shouldn't brush right away." }
          ],
          commonMistake: `Read the sentence AFTER the blank too — "needs 30 min to return to original strength" proves the layer was weakened, so ③ is the only logical fit.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Why is brushing right after sour food bad?`,
          choices: ["Acid temporarily weakens the protective layer, so brushing damages teeth more", "Sour food makes teeth yellow permanently", "Brushing adds extra protective layers", "Saliva removes the enamel"],
          answer: 0,
          explain: `Acidity weakens the layer; it takes ~30 min for saliva to neutralize it, so immediate brushing harms teeth.`
        },
        {
          kind: "mcq",
          q: `How long should you wait to brush after strongly sour food?`,
          choices: ["At least 30 minutes", "Exactly 5 minutes", "Two hours", "No need to wait"],
          answer: 0,
          explain: `The passage says it takes about 30 minutes for the acid to be neutralized.`
        }
      ]
    },
    // ── Q30 · Argument Blank · crocodile tears ──
    Q30: {
      num: 30,
      type: "argument-blank",
      section: "K",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[28~31] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate words to fill in the blank ( ). (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"누군가에게", roman:"nu-gun-ga-e-ge", en:"to someone" },
          { kr:"해를", roman:"hae-reul", en:"harm [obj.]" },
          { kr:"입히고", roman:"i-pi-go", en:"having caused, and" },
          { kr:"미안한", roman:"mi-an-han", en:"sorry" },
          { kr:"척", roman:"cheok", en:"pretending" },
          { kr:"거짓으로", roman:"geo-jit-eu-ro", en:"falsely" },
          { kr:"흘리는", roman:"heul-li-neun", en:"shedding" },
          { kr:"눈물을", roman:"nun-mul-eul", en:"tears [obj.]" },
          { kr:"'악어의", roman:"ag-eo-ui", en:"'crocodile's" },
          { kr:"눈물'에", roman:"nun-mul-e", en:"tears' to" },
          { kr:"비유한다.", roman:"bi-yu-han-da.", en:"is likened." }
        ]},
        { tokens: [
          { kr:"실제로", roman:"sil-je-ro", en:"in fact" },
          { kr:"악어는", roman:"ag-eo-neun", en:"crocodiles [topic]" },
          { kr:"먹잇감을", roman:"meo-git-gam-eul", en:"prey [obj.]" },
          { kr:"잡아먹으면서", roman:"jab-a-meok-eu-myeon-seo", en:"while catching and eating" },
          { kr:"눈물을", roman:"nun-mul-eul", en:"tears [obj.]" },
          { kr:"흘린다.", roman:"heul-lin-da.", en:"shed." }
        ]},
        { tokens: [
          { kr:"눈물샘을", roman:"nun-mul-saem-eul", en:"tear gland [obj.]" },
          { kr:"담당하는", roman:"dam-dang-ha-neun", en:"in charge of" },
          { kr:"신경과", roman:"sin-gyeong-gwa", en:"nerve and" },
          { kr:"턱을", roman:"teok-eul", en:"jaw [obj.]" },
          { kr:"움직이는", roman:"um-jik-i-neun", en:"that moves" },
          { kr:"신경이", roman:"sin-gyeong-i", en:"nerve [subj.]" },
          { kr:"연결되어", roman:"yeon-gyeol-doe-eo", en:"connected, and" },
          { kr:"있기", roman:"it-gi", en:"being" },
          { kr:"때문에", roman:"ttae-mun-e", en:"because" },
          { kr:"음식을", roman:"eum-sik-eul", en:"food [obj.]" },
          { kr:"씹을", roman:"ssip-eul", en:"to chew" },
          { kr:"때면", roman:"ttae-myeon", en:"when" },
          { kr:"눈물이", roman:"nun-mul-i", en:"tears [subj.]" },
          { kr:"나오는", roman:"na-o-neun", en:"come out" },
          { kr:"것이다.", roman:"geot-i-da.", en:"(it) is." }
        ]},
        { tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"눈물", roman:"nun-mul", en:"tears" },
          { kr:"때문에", roman:"ttae-mun-e", en:"because of" },
          { kr:"악어는", roman:"ag-eo-neun", en:"the crocodile [topic]" },
          { kr:"마치", roman:"ma-chi", en:"as if" },
          { kr:"다른", roman:"da-reun", en:"other" },
          { kr:"동물을", roman:"dong-mul-eul", en:"animals [obj.]" },
          { kr:"잡아먹으면서", roman:"jab-a-meok-eu-myeon-seo", en:"while eating" },
          { kr:"( )", roman:"(blank)", en:"[BLANK]", isBlank:true },
          { kr:"것처럼", roman:"geot-cheo-reom", en:"as if (doing)" },
          { kr:"보인다.", roman:"bo-in-da.", en:"appears." }
        ]},
        { tokens: [
          { kr:"'악어의", roman:"ag-eo-ui", en:"'crocodile's" },
          { kr:"눈물'이라는", roman:"nun-mul-i-ra-neun", en:"tears' called" },
          { kr:"표현은", roman:"pyo-hyeon-eun", en:"expression [topic]" },
          { kr:"인간의", roman:"in-gan-ui", en:"human" },
          { kr:"가식적인", roman:"ga-sik-jeok-in", en:"hypocritical, fake" },
          { kr:"행위를", roman:"haeng-wi-reul", en:"behavior [obj.]" },
          { kr:"악어의", roman:"ag-eo-ui", en:"crocodile's" },
          { kr:"생리적", roman:"saeng-ni-jeok", en:"physiological" },
          { kr:"현상에", roman:"hyeon-sang-e", en:"phenomenon to" },
          { kr:"비유한", roman:"bi-yu-han", en:"likened" },
          { kr:"것이다.", roman:"geot-i-da.", en:"(it) is." }
        ]}
      ],
      choices: [
        { num:1, kr:"두려움에 떠는", roman:"du-ryeo-um-e tteo-neun", en:"trembling with fear", correct:false },
        { num:2, kr:"죄책감을 느끼는", roman:"joe-chaek-gam-eul neu-kki-neun", en:"feeling guilt", correct:true },
        { num:3, kr:"갈증을 해소하는", roman:"gal-jeung-eul hae-so-ha-neun", en:"quenching its thirst", correct:false },
        { num:4, kr:"배부름에 만족하는", roman:"bae-bu-reum-e man-jok-ha-neun", en:"satisfied with being full", correct:false }
      ],
      answer: 2,
      whyRight: `The expression "crocodile tears" stands for <b>fake remorse</b> — pretending to be sorry (미안한 척) after harming someone. So the tears make the crocodile <b>look as if it feels guilt</b> while eating its prey — ②. The final sentence confirms it likens hypocritical human behavior to the crocodile's physiology.`,
      whyWrong: {
        "1": `"Trembling with fear" doesn't match the idiom of false remorse — the crocodile is the predator, not the frightened one. ① misreads the metaphor.`,
        "3": `"Quenching its thirst" is a literal/physical action unrelated to the emotional pretense the idiom describes. ③ ignores the metaphor.`,
        "4": `"Satisfied with being full" is about contentment, not the fake guilt/remorse the phrase 악어의 눈물 conveys. ④ doesn't fit.`
      },
      vocab: [
        { kr:"해를 입히다", roman:"hae-reul i-pi-da", en:"to cause harm/damage" },
        { kr:"-(으)ㄴ 척하다", roman:"-(eu)n cheok-ha-da", en:"to pretend to be ~" },
        { kr:"거짓", roman:"geo-jit", en:"lie, falsehood" },
        { kr:"눈물을 흘리다", roman:"nun-mul-eul heul-li-da", en:"to shed tears" },
        { kr:"비유하다", roman:"bi-yu-ha-da", en:"to liken, to use as a metaphor" },
        { kr:"먹잇감", roman:"meo-git-gam", en:"prey" },
        { kr:"신경", roman:"sin-gyeong", en:"nerve" },
        { kr:"연결되다", roman:"yeon-gyeol-doe-da", en:"to be connected" },
        { kr:"죄책감", roman:"joe-chaek-gam", en:"feeling of guilt" },
        { kr:"가식적", roman:"ga-sik-jeok", en:"hypocritical, affected, fake" },
        { kr:"현상", roman:"hyeon-sang", en:"phenomenon" }
      ],
      grammar: [
        {
          pattern: "마치 ~ 것처럼 (just as if ~)",
          plainEnglish: `마치 pairs with -(으)ㄴ/는 것처럼 to mean "just as if ~." 마치 죄책감을 느끼는 것처럼 보인다 = "appears just as if it feels guilt." Use it for an appearance that isn't the reality — perfect for the "crocodile tears" idea.`,
          examples: [
            { kr:"그는 마치 모르는 것처럼 행동했다.", roman:"Geu-neun ma-chi mo-reu-neun geot-cheo-reom haeng-dong-haet-da.", en:"He acted just as if he didn't know." },
            { kr:"마치 우는 것처럼 보였다.", roman:"Ma-chi u-neun geot-cheo-reom bo-yeot-da.", en:"It looked just as if (it) were crying." }
          ],
          commonMistake: `마치 ~ 것처럼 signals appearance vs. reality. The crocodile only "appears" guilty; it isn't. Match the blank to the idiom's meaning of fake remorse → ② feeling guilt.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does the idiom 악어의 눈물 (crocodile tears) mean?`,
          choices: ["Fake remorse / pretended sorrow", "Genuine deep sadness", "Tears of joy", "Fear of predators"],
          answer: 0,
          explain: `It refers to hypocritical, pretended sorrow — being sorry only on the surface.`
        },
        {
          kind: "mcq",
          q: `마치 ~ 것처럼 expresses…`,
          choices: ["An appearance that may not match reality ('just as if')", "A certain fact", "A future plan", "A polite command"],
          answer: 0,
          explain: `마치 ~ 것처럼 = "just as if," used for how something appears, not necessarily what is true.`
        }
      ]
    },
    // ── Q31 · Argument Blank · why containers are cylindrical ──
    Q31: {
      num: 31,
      type: "argument-blank",
      section: "K",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[28~31] ( )에 들어갈 말로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate words to fill in the blank ( ). (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"음료수", roman:"eum-nyo-su", en:"beverage" },
          { kr:"병과", roman:"byeong-gwa", en:"bottle and" },
          { kr:"같이", roman:"ga-chi", en:"like" },
          { kr:"액체를", roman:"aek-che-reul", en:"liquid [obj.]" },
          { kr:"담는", roman:"dam-neun", en:"that hold" },
          { kr:"용기들은", roman:"yong-gi-deul-eun", en:"containers [topic]" },
          { kr:"대부분", roman:"dae-bu-bun", en:"mostly" },
          { kr:"원기둥", roman:"won-gi-dung", en:"cylinder" },
          { kr:"모양이다.", roman:"mo-yang-i-da.", en:"are shaped." }
        ]},
        { tokens: [
          { kr:"원기둥을", roman:"won-gi-dung-eul", en:"a cylinder [obj.]" },
          { kr:"선택하는", roman:"seon-taek-ha-neun", en:"choosing" },
          { kr:"가장", roman:"ga-jang", en:"the most" },
          { kr:"큰", roman:"keun", en:"big" },
          { kr:"이유는", roman:"i-yu-neun", en:"reason [topic]" },
          { kr:"( )", roman:"(blank)", en:"[BLANK]", isBlank:true },
          { kr:"위해서이다.", roman:"wi-hae-seo-i-da.", en:"is in order to." }
        ]},
        { tokens: [
          { kr:"예를", roman:"ye-reul", en:"example [obj.]" },
          { kr:"들어", roman:"deul-eo", en:"for" },
          { kr:"밑면의", roman:"mit-myeon-ui", en:"of the base" },
          { kr:"넓이가", roman:"neolb-i-ga", en:"area [subj.]" },
          { kr:"똑같이", roman:"ttok-ga-chi", en:"equally" },
          { kr:"100cm²일", roman:"baek-je-gop-bang-sen-ti-mi-teo-il", en:"100cm² being" },
          { kr:"때", roman:"ttae", en:"when" },
          { kr:"둘레는", roman:"dul-le-neun", en:"perimeter [topic]" },
          { kr:"원의", roman:"won-ui", en:"the circle's" },
          { kr:"둘레가", roman:"dul-le-ga", en:"perimeter [subj.]" },
          { kr:"가장", roman:"ga-jang", en:"the most" },
          { kr:"짧다.", roman:"jjalb-da.", en:"is short." }
        ]},
        { tokens: [
          { kr:"따라서", roman:"tta-ra-seo", en:"therefore" },
          { kr:"둘레를", roman:"dul-le-reul", en:"the perimeter [obj.]" },
          { kr:"감싸는", roman:"gam-ssa-neun", en:"that wraps" },
          { kr:"재료가", roman:"jae-ryo-ga", en:"material [subj.]" },
          { kr:"가장", roman:"ga-jang", en:"the least/most" },
          { kr:"적게", roman:"jeok-ge", en:"little" },
          { kr:"드는", roman:"deu-neun", en:"that takes" },
          { kr:"원기둥으로", roman:"won-gi-dung-eu-ro", en:"as a cylinder" },
          { kr:"만들어", roman:"man-deul-eo", en:"making" },
          { kr:"생산비를", roman:"saeng-san-bi-reul", en:"production cost [obj.]" },
          { kr:"낮추고자", roman:"nat-chu-go-ja", en:"to lower" },
          { kr:"하는", roman:"ha-neun", en:"intending" },
          { kr:"것이다.", roman:"geot-i-da.", en:"(it) is." }
        ]}
      ],
      choices: [
        { num:1, kr:"보기 좋게 만들기", roman:"bo-gi jo-ke man-deul-gi", en:"to make it look good", correct:false },
        { num:2, kr:"보관을 편리하게 하기", roman:"bo-gwan-eul pyeon-ri-ha-ge ha-gi", en:"to make storage convenient", correct:false },
        { num:3, kr:"손으로 잡기 편하게 하기", roman:"son-eu-ro jap-gi pyeon-ha-ge ha-gi", en:"to make it easy to grip by hand", correct:false },
        { num:4, kr:"용기의 제작 비용을 줄이기", roman:"yong-gi-ui je-jak bi-yong-eul jul-i-gi", en:"to reduce the container's production cost", correct:true }
      ],
      answer: 4,
      whyRight: `The passage proves that for the same base area, a circle has the <b>shortest perimeter</b>, so a cylinder needs the <b>least wrapping material</b>, which "생산비를 낮추고자 하는 것" (aims to lower production cost). The blank's reason must be ④ — to reduce the container's manufacturing cost.`,
      whyWrong: {
        "1": `"To look good" (aesthetics) is never the argument — the whole passage is about material and cost math. ① ignores the reasoning.`,
        "2": `Storage convenience isn't discussed; the comparison is purely perimeter vs. material. ② adds an unstated reason.`,
        "3": `Grip comfort isn't mentioned either. The conclusion is explicitly about 생산비 (production cost). ③ doesn't match the text.`
      },
      vocab: [
        { kr:"액체", roman:"aek-che", en:"liquid" },
        { kr:"담다", roman:"dam-da", en:"to hold/contain, to put in" },
        { kr:"용기", roman:"yong-gi", en:"container, vessel" },
        { kr:"원기둥", roman:"won-gi-dung", en:"cylinder" },
        { kr:"밑면", roman:"mit-myeon", en:"base (bottom face)" },
        { kr:"넓이", roman:"neolb-i", en:"area" },
        { kr:"둘레", roman:"dul-le", en:"perimeter, circumference" },
        { kr:"감싸다", roman:"gam-ssa-da", en:"to wrap, to surround" },
        { kr:"재료", roman:"jae-ryo", en:"material" },
        { kr:"생산비", roman:"saeng-san-bi", en:"production cost" },
        { kr:"낮추다", roman:"nat-chu-da", en:"to lower, to reduce" }
      ],
      grammar: [
        {
          pattern: "-고자 하다 (intending to / so as to)",
          plainEnglish: `-고자 하다 is a formal/written way to say "intend to / aim to / so as to." 생산비를 낮추고자 하는 것이다 = "(it) is intended to lower the production cost." It marks purpose, similar to -(으)려고 하다 but more formal.`,
          examples: [
            { kr:"비용을 줄이고자 합니다.", roman:"Bi-yong-eul jul-i-go-ja ham-ni-da.", en:"We intend to reduce the cost." },
            { kr:"문제를 해결하고자 노력했다.", roman:"Mun-je-reul hae-gyeol-ha-go-ja no-ryeok-haet-da.", en:"They strove to solve the problem." }
          ],
          commonMistake: `In "reason for the blank" questions, the conclusion sentence (따라서 ...) usually restates the answer. Here 생산비를 낮추고자 = reduce production cost = choice ④.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Why are liquid containers usually cylindrical, per the passage?`,
          choices: ["A circle's short perimeter uses the least material, lowering cost", "Cylinders look the prettiest", "They are easiest to stack", "They are easiest to grip"],
          answer: 0,
          explain: `Same base area → circle has the shortest perimeter → least wrapping material → lower production cost.`
        },
        {
          kind: "mcq",
          q: `-고자 하다 expresses…`,
          choices: ["Intention/purpose ('so as to / intend to')", "A past habit", "An order", "Surprise"],
          answer: 0,
          explain: `-고자 하다 is a formal way to mark intention or purpose.`
        }
      ]
    },
    // ── Q32 · Academic Content Match · sea squirt (멍게) ──
    Q32: {
      num: 32,
      type: "academic-match",
      section: "L",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[32~34] 다음을 읽고 글의 내용과 같은 것을 고르십시오. (각 2점)",
        en: "Read the following and choose the option that matches the content. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"멍게는", roman:"meong-ge-neun", en:"the sea squirt [topic]" },
          { kr:"바다에", roman:"ba-da-e", en:"in the sea" },
          { kr:"서식하는", roman:"seo-sik-ha-neun", en:"that lives" },
          { kr:"해양", roman:"hae-yang", en:"marine" },
          { kr:"생물로", roman:"saeng-mul-lo", en:"as a creature" },
          { kr:"성장", roman:"seong-jang", en:"growth" },
          { kr:"과정에서", roman:"gwa-jeong-e-seo", en:"in the process of" },
          { kr:"흥미로운", roman:"heung-mi-ro-un", en:"interesting" },
          { kr:"변화를", roman:"byeon-hwa-reul", en:"changes [obj.]" },
          { kr:"겪는다.", roman:"gyeok-neun-da.", en:"undergoes." }
        ]},
        { tokens: [
          { kr:"어린", roman:"eo-rin", en:"young" },
          { kr:"멍게는", roman:"meong-ge-neun", en:"sea squirt [topic]" },
          { kr:"올챙이와", roman:"ol-chaeng-i-wa", en:"a tadpole, and" },
          { kr:"같이", roman:"ga-chi", en:"like" },
          { kr:"자유롭게", roman:"ja-yu-rop-ge", en:"freely" },
          { kr:"헤엄쳐", roman:"he-eom-chyeo", en:"swimming" },
          { kr:"더", roman:"deo", en:"more" },
          { kr:"나은", roman:"na-eun", en:"better" },
          { kr:"서식지를", roman:"seo-sik-ji-reul", en:"habitat [obj.]" },
          { kr:"찾아", roman:"cha-ja", en:"seeking" },
          { kr:"이동한다.", roman:"i-dong-han-da.", en:"moves about." }
        ]},
        { tokens: [
          { kr:"바위", roman:"ba-wi", en:"rock" },
          { kr:"등", roman:"deung", en:"etc." },
          { kr:"적절한", roman:"jeok-jeol-han", en:"suitable" },
          { kr:"장소를", roman:"jang-so-reul", en:"place [obj.]" },
          { kr:"발견하면", roman:"bal-gyeon-ha-myeon", en:"if it finds" },
          { kr:"멍게는", roman:"meong-ge-neun", en:"the sea squirt [topic]" },
          { kr:"거기에", roman:"geo-gi-e", en:"there" },
          { kr:"딱", roman:"ttak", en:"firmly" },
          { kr:"붙어서", roman:"but-eo-seo", en:"attaching, and" },
          { kr:"생활하게", roman:"saeng-hwal-ha-ge", en:"to live" },
          { kr:"되어", roman:"doe-eo", en:"comes to, and" },
          { kr:"더", roman:"deo", en:"any" },
          { kr:"이상", roman:"i-sang", en:"more" },
          { kr:"이동할", roman:"i-dong-hal", en:"to move" },
          { kr:"필요가", roman:"pil-yo-ga", en:"need [subj.]" },
          { kr:"없어진다.", roman:"eop-seo-jin-da.", en:"disappears." }
        ]},
        { tokens: [
          { kr:"이렇게", roman:"i-reo-ke", en:"in this way" },
          { kr:"자리를", roman:"ja-ri-reul", en:"a spot [obj.]" },
          { kr:"잡은", roman:"jab-eun", en:"having settled" },
          { kr:"멍게는", roman:"meong-ge-neun", en:"sea squirt [topic]" },
          { kr:"스스로", roman:"seu-seu-ro", en:"by itself" },
          { kr:"이동에", roman:"i-dong-e", en:"for movement" },
          { kr:"필요한", roman:"pil-yo-han", en:"needed" },
          { kr:"신체", roman:"sin-che", en:"body" },
          { kr:"기관들을", roman:"gi-gwan-deul-eul", en:"organs [obj.]" },
          { kr:"없애고", roman:"eop-sae-go", en:"eliminates, and" },
          { kr:"식물처럼", roman:"sik-mul-cheo-reom", en:"like a plant" },
          { kr:"한곳에", roman:"han-got-e", en:"in one place" },
          { kr:"정착해서", roman:"jeong-chak-hae-seo", en:"settling, and" },
          { kr:"살아간다.", roman:"sal-a-gan-da.", en:"lives on." }
        ]}
      ],
      choices: [
        { num:1, kr:"멍게는 한곳에 자리를 잡으면 서식지를 바꾸지 않는다.", roman:"meong-ge-neun han-got-e ja-ri-reul jab-eu-myeon seo-sik-ji-reul ba-kku-ji an-neun-da", en:"Once a sea squirt settles in one place, it doesn't change its habitat.", correct:true },
        { num:2, kr:"멍게는 평생 동안 바닷속을 헤엄쳐 먹이를 찾아다닌다.", roman:"meong-ge-neun pyeong-saeng dong-an ba-dat-sok-eul he-eom-chyeo meok-i-reul cha-ja-da-nin-da", en:"A sea squirt swims through the sea seeking food its whole life.", correct:false },
        { num:3, kr:"멍게는 성장 과정에서 신체의 변화가 일어나지 않는다.", roman:"meong-ge-neun seong-jang gwa-jeong-e-seo sin-che-ui byeon-hwa-ga il-eo-na-ji an-neun-da", en:"A sea squirt undergoes no bodily change during growth.", correct:false },
        { num:4, kr:"멍게는 정착 후에도 이동에 필요한 기관을 계속 유지한다.", roman:"meong-ge-neun jeong-chak hu-e-do i-dong-e pil-yo-han gi-gwan-eul gye-sok yu-ji-han-da", en:"A sea squirt keeps its movement organs even after settling.", correct:false }
      ],
      answer: 1,
      whyRight: `Once the sea squirt finds a rock and attaches, it "더 이상 이동할 필요가 없어진다" (no longer needs to move) and lives fixed in one place like a plant. So after settling it doesn't change habitat — ①.`,
      whyWrong: {
        "2": `It swims freely only when <b>young</b>; after settling it stops moving. ② says "its whole life," contradicting the text.`,
        "3": `The opening says it "흥미로운 변화를 겪는다" (undergoes interesting changes). ③ claims no change — the opposite.`,
        "4": `After settling it "이동에 필요한 신체 기관들을 없애고" (eliminates the organs needed for movement). ④ says it keeps them — wrong.`
      },
      vocab: [
        { kr:"서식하다", roman:"seo-sik-ha-da", en:"to inhabit, to live (of organisms)" },
        { kr:"해양 생물", roman:"hae-yang saeng-mul", en:"marine creature" },
        { kr:"성장", roman:"seong-jang", en:"growth" },
        { kr:"과정", roman:"gwa-jeong", en:"process" },
        { kr:"겪다", roman:"gyeok-da", en:"to undergo, to experience" },
        { kr:"올챙이", roman:"ol-chaeng-i", en:"tadpole" },
        { kr:"서식지", roman:"seo-sik-ji", en:"habitat" },
        { kr:"정착하다", roman:"jeong-chak-ha-da", en:"to settle down" },
        { kr:"신체 기관", roman:"sin-che gi-gwan", en:"bodily organ" },
        { kr:"없애다", roman:"eop-sae-da", en:"to eliminate, to get rid of" },
        { kr:"유지하다", roman:"yu-ji-ha-da", en:"to maintain, to keep" }
      ],
      grammar: [
        {
          pattern: "더 이상 ~ 지 않다/없다 (no longer ~)",
          plainEnglish: `더 이상 + negative = "no longer / not anymore." 더 이상 이동할 필요가 없어진다 = "the need to move no longer exists." Watch for this when checking content-match options.`,
          examples: [
            { kr:"더 이상 기다릴 필요가 없어요.", roman:"Deo i-sang gi-da-ril pil-yo-ga eop-seo-yo.", en:"There's no longer any need to wait." },
            { kr:"그는 더 이상 회사에 다니지 않는다.", roman:"Geu-neun deo i-sang hoe-sa-e da-ni-ji an-neun-da.", en:"He no longer works at the company." }
          ],
          commonMistake: `Content-match traps often flip a time scope: the squirt swims "when young," not "its whole life." Always check WHEN a statement is true.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does the sea squirt do after it settles on a rock?`,
          choices: ["Eliminates its movement organs and stays put like a plant", "Keeps swimming to find food", "Grows new fins", "Returns to open water each night"],
          answer: 0,
          explain: `After settling it removes the organs needed for movement and lives fixed in one place.`
        },
        {
          kind: "mcq",
          q: `더 이상 ~ 않다 means…`,
          choices: ["No longer / not anymore", "Even more", "As much as possible", "From now on"],
          answer: 0,
          explain: `더 이상 with a negative = "no longer."`
        }
      ]
    },
    // ── Q33 · Academic Content Match · Wolhajeongin painting ──
    Q33: {
      num: 33,
      type: "academic-match",
      section: "L",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[32~34] 다음을 읽고 글의 내용과 같은 것을 고르십시오. (각 2점)",
        en: "Read the following and choose the option that matches the content. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"조선", roman:"jo-seon", en:"Joseon" },
          { kr:"시대", roman:"si-dae", en:"era" },
          { kr:"화가", roman:"hwa-ga", en:"painter" },
          { kr:"신윤복의", roman:"sin-yun-bok-ui", en:"Shin Yun-bok's" },
          { kr:"'월하정인'은", roman:"wol-ha-jeong-in-eun", en:"'Wolhajeongin' [topic]" },
          { kr:"은은한", roman:"eun-eun-han", en:"soft, mellow" },
          { kr:"달빛", roman:"dal-bit", en:"moonlight" },
          { kr:"아래", roman:"a-rae", en:"under" },
          { kr:"다정히", roman:"da-jeong-hi", en:"affectionately" },
          { kr:"서", roman:"seo", en:"standing" },
          { kr:"있는", roman:"it-neun", en:"who are" },
          { kr:"연인을", roman:"yeon-in-eul", en:"lovers [obj.]" },
          { kr:"그린", roman:"geu-rin", en:"depicting" },
          { kr:"풍속화이다.", roman:"pung-sok-hwa-i-da.", en:"is a genre painting." }
        ]},
        { tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"그림의", roman:"geu-rim-ui", en:"painting's" },
          { kr:"제작", roman:"je-jak", en:"creation" },
          { kr:"연도는", roman:"yeon-do-neun", en:"year [topic]" },
          { kr:"밝혀지지", roman:"bal-hyeo-ji-ji", en:"identified" },
          { kr:"않았지만", roman:"an-at-ji-man", en:"isn't, but" },
          { kr:"천문학자들은", roman:"cheon-mun-hak-ja-deul-eun", en:"astronomers [topic]" },
          { kr:"그림", roman:"geu-rim", en:"painting" },
          { kr:"속", roman:"sok", en:"inside" },
          { kr:"달의", roman:"dal-ui", en:"moon's" },
          { kr:"모양,", roman:"mo-yang", en:"shape," },
          { kr:"글을", roman:"geul-eul", en:"text [obj.]" },
          { kr:"분석해", roman:"bun-seok-hae", en:"analyzing" },
          { kr:"1793년", roman:"cheon-chil-baek-gu-sip-sam-nyeon", en:"the year 1793" },
          { kr:"8월", roman:"pal-wol", en:"August" },
          { kr:"21일", roman:"i-sip-il-il", en:"the 21st" },
          { kr:"밤이", roman:"bam-i", en:"night [subj.]" },
          { kr:"배경이", roman:"bae-gyeong-i", en:"the setting [subj.]" },
          { kr:"되었다고", roman:"doe-eot-da-go", en:"became, that" },
          { kr:"추정한다.", roman:"chu-jeong-han-da.", en:"estimate." }
        ]},
        { tokens: [
          { kr:"'월하정인'에", roman:"wol-ha-jeong-in-e", en:"in 'Wolhajeongin'" },
          { kr:"나오는", roman:"na-o-neun", en:"that appears" },
          { kr:"위가", roman:"wi-ga", en:"the top [subj.]" },
          { kr:"볼록한", roman:"bol-lok-han", en:"bulging" },
          { kr:"초승달은", roman:"cho-seung-dal-eun", en:"crescent moon [topic]" },
          { kr:"보기", roman:"bo-gi", en:"to see" },
          { kr:"드문", roman:"deu-mun", en:"rare" },
          { kr:"형태로", roman:"hyeong-tae-ro", en:"a form, and" },
          { kr:"부분", roman:"bu-bun", en:"partial" },
          { kr:"월식", roman:"wol-sik", en:"lunar eclipse" },
          { kr:"때만", roman:"ttae-man", en:"only when" },
          { kr:"나타난다.", roman:"na-ta-nan-da.", en:"appears." }
        ]},
        { tokens: [
          { kr:"실제로", roman:"sil-je-ro", en:"in fact" },
          { kr:"왕실의", roman:"wang-sil-ui", en:"the royal court's" },
          { kr:"기록에도", roman:"gi-rok-e-do", en:"records also" },
          { kr:"그날", roman:"geu-nal", en:"that night" },
          { kr:"밤", roman:"bam", en:"night" },
          { kr:"월식이", roman:"wol-sik-i", en:"a lunar eclipse [subj.]" },
          { kr:"있었다는", roman:"it-eot-da-neun", en:"that there was" },
          { kr:"내용이", roman:"nae-yong-i", en:"content [subj.]" },
          { kr:"있어", roman:"it-eo", en:"exists, and" },
          { kr:"이", roman:"i", en:"this" },
          { kr:"추정을", roman:"chu-jeong-eul", en:"estimate [obj.]" },
          { kr:"뒷받침한다.", roman:"dwit-bat-chim-han-da.", en:"supports." }
        ]}
      ],
      choices: [
        { num:1, kr:"월하정인은 작가를 알 수 없는 그림이다.", roman:"wol-ha-jeong-in-eun jak-ga-reul al su eop-neun geu-rim-i-da", en:"Wolhajeongin is a painting whose artist is unknown.", correct:false },
        { num:2, kr:"월하정인의 제작 연도가 작품에 기록되어 있다.", roman:"wol-ha-jeong-in-ui je-jak yeon-do-ga jak-pum-e gi-rok-doe-eo it-da", en:"Wolhajeongin's creation year is recorded on the work.", correct:false },
        { num:3, kr:"월하정인의 배경은 부분 월식이 있었던 밤으로 추정된다.", roman:"wol-ha-jeong-in-ui bae-gyeong-eun bu-bun wol-sik-i it-eot-deon bam-eu-ro chu-jeong-doen-da", en:"Wolhajeongin's setting is estimated to be a night with a partial lunar eclipse.", correct:true },
        { num:4, kr:"천문학자들은 그림 속 현상이 천문학적으로 불가능하다고 본다.", roman:"cheon-mun-hak-ja-deul-eun geu-rim sok hyeon-sang-i cheon-mun-hak-jeok-eu-ro bul-ga-neung-ha-da-go bon-da", en:"Astronomers think the phenomenon in the painting is astronomically impossible.", correct:false }
      ],
      answer: 3,
      whyRight: `The top-bulging crescent appears only during a <b>partial lunar eclipse</b>, and royal records confirm an eclipse that night — supporting the estimate that the painting's setting is the night of Aug 21, 1793. ③ matches exactly.`,
      whyWrong: {
        "1": `The artist is named: 신윤복 (Shin Yun-bok). ① says the artist is unknown — wrong.`,
        "2": `The text says "제작 연도는 밝혀지지 않았지만" — the year is NOT recorded; astronomers had to estimate it. ② contradicts this.`,
        "4": `Astronomers use the moon shape as evidence and royal records support it — they find it <b>possible</b>, not impossible. ④ reverses their view.`
      },
      vocab: [
        { kr:"화가", roman:"hwa-ga", en:"painter" },
        { kr:"풍속화", roman:"pung-sok-hwa", en:"genre painting (scenes of daily life)" },
        { kr:"제작 연도", roman:"je-jak yeon-do", en:"year of production" },
        { kr:"밝혀지다", roman:"bal-hyeo-ji-da", en:"to be revealed/identified" },
        { kr:"천문학자", roman:"cheon-mun-hak-ja", en:"astronomer" },
        { kr:"분석하다", roman:"bun-seok-ha-da", en:"to analyze" },
        { kr:"추정하다", roman:"chu-jeong-ha-da", en:"to estimate, to presume" },
        { kr:"초승달", roman:"cho-seung-dal", en:"crescent moon" },
        { kr:"월식", roman:"wol-sik", en:"lunar eclipse" },
        { kr:"기록", roman:"gi-rok", en:"record" },
        { kr:"뒷받침하다", roman:"dwit-bat-chim-ha-da", en:"to support, to back up" }
      ],
      grammar: [
        {
          pattern: "-다고 추정하다 / -(으)로 추정되다",
          plainEnglish: `추정하다 = to estimate/presume. With quoted content: ~되었다고 추정한다 = "estimate that (it) became ~." Passive: ~(으)로 추정된다 = "is estimated to be ~." Common in academic/explanatory texts.`,
          examples: [
            { kr:"그날이 배경이라고 추정한다.", roman:"Geu-nal-i bae-gyeong-i-ra-go chu-jeong-han-da.", en:"They estimate that day is the setting." },
            { kr:"그 시기로 추정된다.", roman:"Geu si-gi-ro chu-jeong-doen-da.", en:"It is estimated to be that period." }
          ],
          commonMistake: `Note 추정 (estimate) vs. 기록 (record). The year is estimated, not recorded — that distinction is exactly what choice ② gets wrong.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `How did astronomers date the painting?`,
          choices: ["By analyzing the moon's shape and the text, matching a partial eclipse", "By reading the year written on the canvas", "By carbon-dating the paint", "By asking the artist's family"],
          answer: 0,
          explain: `The rare top-bulging crescent appears only in a partial eclipse; royal records of an eclipse that night support the estimate.`
        },
        {
          kind: "mcq",
          q: `Is the artist of Wolhajeongin known?`,
          choices: ["Yes — Shin Yun-bok", "No — it is anonymous", "Only the family name is known", "It was a foreign painter"],
          answer: 0,
          explain: `The painter is named in the first sentence: 신윤복 (Shin Yun-bok).`
        }
      ]
    },
    // ── Q34 · Academic Content Match · wax-moth larvae plastic enzyme ──
    Q34: {
      num: 34,
      type: "academic-match",
      section: "L",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[32~34] 다음을 읽고 글의 내용과 같은 것을 고르십시오. (각 2점)",
        en: "Read the following and choose the option that matches the content. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"국내", roman:"guk-nae", en:"domestic" },
          { kr:"연구진이", roman:"yeon-gu-jin-i", en:"research team [subj.]" },
          { kr:"벌집나방", roman:"beol-jip-na-bang", en:"wax moth" },
          { kr:"애벌레에서", roman:"ae-beol-le-e-seo", en:"in the larvae" },
          { kr:"플라스틱을", roman:"peul-la-seu-tik-eul", en:"plastic [obj.]" },
          { kr:"분해하는", roman:"bun-hae-ha-neun", en:"that decomposes" },
          { kr:"효소를", roman:"hyo-so-reul", en:"enzyme [obj.]" },
          { kr:"발견했다.", roman:"bal-gyeon-haet-da.", en:"discovered." }
        ]},
        { tokens: [
          { kr:"이", roman:"i", en:"these" },
          { kr:"애벌레는", roman:"ae-beol-le-neun", en:"larvae [topic]" },
          { kr:"벌집을", roman:"beol-jip-eul", en:"honeycomb [obj.]" },
          { kr:"먹이로", roman:"meok-i-ro", en:"as food" },
          { kr:"삼는데", roman:"sam-neun-de", en:"take, and" },
          { kr:"연구진은", roman:"yeon-gu-jin-eun", en:"the team [topic]" },
          { kr:"벌집과", roman:"beol-jip-gwa", en:"honeycomb and" },
          { kr:"플라스틱의", roman:"peul-la-seu-tik-ui", en:"plastic's" },
          { kr:"화학적", roman:"hwa-hak-jeok", en:"chemical" },
          { kr:"구조가", roman:"gu-jo-ga", en:"structure [subj.]" },
          { kr:"유사하다는", roman:"yu-sa-ha-da-neun", en:"that (they) are similar" },
          { kr:"점에", roman:"jeom-e", en:"to the point" },
          { kr:"주목했다.", roman:"ju-mok-haet-da.", en:"paid attention." }
        ]},
        { tokens: [
          { kr:"실제로", roman:"sil-je-ro", en:"in fact" },
          { kr:"애벌레에게", roman:"ae-beol-le-e-ge", en:"to the larvae" },
          { kr:"플라스틱을", roman:"peul-la-seu-tik-eul", en:"plastic [obj.]" },
          { kr:"먹였을", roman:"meok-yeot-eul", en:"fed" },
          { kr:"때", roman:"ttae", en:"when" },
          { kr:"벌집을", roman:"beol-jip-eul", en:"honeycomb [obj.]" },
          { kr:"소화하는", roman:"so-hwa-ha-neun", en:"that digests" },
          { kr:"효소가", roman:"hyo-so-ga", en:"enzyme [subj.]" },
          { kr:"생성되어", roman:"saeng-seong-doe-eo", en:"is produced, and" },
          { kr:"플라스틱을", roman:"peul-la-seu-tik-eul", en:"plastic [obj.]" },
          { kr:"빠르게", roman:"ppa-reu-ge", en:"quickly" },
          { kr:"분해했다.", roman:"bun-hae-haet-da.", en:"decomposed." }
        ]},
        { tokens: [
          { kr:"연구진은", roman:"yeon-gu-jin-eun", en:"the team [topic]" },
          { kr:"이", roman:"i", en:"this" },
          { kr:"효소를", roman:"hyo-so-reul", en:"enzyme [obj.]" },
          { kr:"대량", roman:"dae-ryang", en:"mass" },
          { kr:"생산해", roman:"saeng-san-hae", en:"producing" },
          { kr:"활용하면", roman:"hwal-yong-ha-myeon", en:"if utilized" },
          { kr:"폐플라스틱", roman:"pye-peul-la-seu-tik", en:"waste plastic" },
          { kr:"처리의", roman:"cheo-ri-ui", en:"treatment's" },
          { kr:"획기적", roman:"hoek-gi-jeok", en:"groundbreaking" },
          { kr:"방안이", roman:"bang-an-i", en:"solution [subj.]" },
          { kr:"될", roman:"doel", en:"will become" },
          { kr:"것으로", roman:"geot-eu-ro", en:"that" },
          { kr:"기대하고", roman:"gi-dae-ha-go", en:"expect, and" },
          { kr:"있다.", roman:"it-da.", en:"are." }
        ]}
      ],
      choices: [
        { num:1, kr:"연구진은 애벌레가 환경 문제를 발생시킨다는 점에 주목했다.", roman:"yeon-gu-jin-eun ae-beol-le-ga hwan-gyeong mun-je-reul bal-saeng-si-kin-da-neun jeom-e ju-mok-haet-da", en:"The team noted that the larvae cause environmental problems.", correct:false },
        { num:2, kr:"벌집과 플라스틱은 화학적으로 서로 다른 구조를 가지고 있다.", roman:"beol-jip-gwa peul-la-seu-tik-eun hwa-hak-jeok-eu-ro seo-ro da-reun gu-jo-reul ga-ji-go it-da", en:"Honeycomb and plastic have chemically different structures.", correct:false },
        { num:3, kr:"애벌레는 벌집과 플라스틱을 먹었을 때 각기 다른 효소를 배출했다.", roman:"ae-beol-le-neun beol-jip-gwa peul-la-seu-tik-eul meok-eot-eul ttae gak-gi da-reun hyo-so-reul bae-chul-haet-da", en:"The larvae secreted different enzymes for honeycomb and plastic.", correct:false },
        { num:4, kr:"연구진은 이 효소로 폐플라스틱을 처리할 수 있을 것이라고 기대했다.", roman:"yeon-gu-jin-eun i hyo-so-ro pye-peul-la-seu-tik-eul cheo-ri-hal su it-eul geot-i-ra-go gi-dae-haet-da", en:"The team expected they could treat waste plastic with this enzyme.", correct:true }
      ],
      answer: 4,
      whyRight: `The last sentence says the team "expects" that mass-producing and using this enzyme could be a groundbreaking method for treating waste plastic (폐플라스틱 처리의 획기적 방안). ④ states exactly that expectation.`,
      whyWrong: {
        "1": `They noted the <b>chemical similarity</b> of honeycomb and plastic, not that larvae "cause environmental problems." ① misreads the focus.`,
        "2": `The text says the structures are <b>similar</b> (유사하다), not different. ② reverses it.`,
        "3": `The <b>same</b> honeycomb-digesting enzyme broke down the plastic — not "different enzymes for each." ③ is wrong.`
      },
      vocab: [
        { kr:"연구진", roman:"yeon-gu-jin", en:"research team" },
        { kr:"애벌레", roman:"ae-beol-le", en:"larva, caterpillar" },
        { kr:"분해하다", roman:"bun-hae-ha-da", en:"to decompose, to break down" },
        { kr:"효소", roman:"hyo-so", en:"enzyme" },
        { kr:"벌집", roman:"beol-jip", en:"honeycomb, beehive" },
        { kr:"화학적", roman:"hwa-hak-jeok", en:"chemical" },
        { kr:"구조", roman:"gu-jo", en:"structure" },
        { kr:"유사하다", roman:"yu-sa-ha-da", en:"to be similar" },
        { kr:"주목하다", roman:"ju-mok-ha-da", en:"to pay attention to, to note" },
        { kr:"대량 생산", roman:"dae-ryang saeng-san", en:"mass production" },
        { kr:"폐플라스틱", roman:"pye-peul-la-seu-tik", en:"waste plastic" },
        { kr:"획기적", roman:"hoek-gi-jeok", en:"groundbreaking, epoch-making" }
      ],
      grammar: [
        {
          pattern: "-(ㄴ/는)다는 점에 주목하다",
          plainEnglish: `~다는 점에 주목하다 = "to pay attention to the point that ~." It packages a fact into "the point that ..." and says someone focused on it. 구조가 유사하다는 점에 주목했다 = "noted the point that the structures are similar."`,
          examples: [
            { kr:"가격이 싸다는 점에 주목했다.", roman:"Ga-gyeok-i ssa-da-neun jeom-e ju-mok-haet-da.", en:"They noted the point that the price is cheap." },
            { kr:"수요가 는다는 점에 주목하자.", roman:"Su-yo-ga neun-da-neun jeom-e ju-mok-ha-ja.", en:"Let's note the point that demand is increasing." }
          ],
          commonMistake: `Distinguish 유사하다 (similar) from 다르다 (different) — choice ② flips this. Reading the exact word saves you from the trap.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What did the researchers expect about the enzyme?`,
          choices: ["It could be a breakthrough for treating waste plastic", "It would harm the environment", "It only works on honeycomb", "It is impossible to mass-produce"],
          answer: 0,
          explain: `They expect mass-producing it could be a groundbreaking waste-plastic treatment.`
        },
        {
          kind: "mcq",
          q: `Why did the larvae's enzyme break down plastic?`,
          choices: ["Honeycomb and plastic have similar chemical structures", "Plastic is sweet", "The larvae mutated", "Plastic is softer than honeycomb"],
          answer: 0,
          explain: `The team noted the chemical similarity; the honeycomb-digesting enzyme also broke down the plastic.`
        }
      ]
    },
    // ── Q35 · Main Topic · space exploration & economy ──
    Q35: {
      num: 35,
      type: "main-topic",
      section: "M",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[35~38] 다음을 읽고 글의 주제로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Read the following and choose the option that best fits the topic of the text. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"인류를", roman:"in-ryu-reul", en:"humanity [obj.]" },
          { kr:"화성에", roman:"hwa-seong-e", en:"to Mars" },
          { kr:"보내기", roman:"bo-nae-gi", en:"sending" },
          { kr:"위한", roman:"wi-han", en:"for" },
          { kr:"우주", roman:"u-ju", en:"space" },
          { kr:"탐사", roman:"tam-sa", en:"exploration" },
          { kr:"프로젝트가", roman:"peu-ro-jek-teu-ga", en:"project [subj.]" },
          { kr:"한창이다.", roman:"han-chang-i-da.", en:"is in full swing." }
        ]},
        { tokens: [
          { kr:"이를", roman:"i-reul", en:"this [obj.]" },
          { kr:"두고", roman:"du-go", en:"regarding" },
          { kr:"당장의", roman:"dang-jang-ui", en:"immediate" },
          { kr:"의식주", roman:"ui-sik-ju", en:"food/clothing/shelter" },
          { kr:"문제를", roman:"mun-je-reul", en:"problems [obj.]" },
          { kr:"해결하는", roman:"hae-gyeol-ha-neun", en:"solving" },
          { kr:"것이", roman:"geot-i", en:"(that) [subj.]" },
          { kr:"더", roman:"deo", en:"more" },
          { kr:"시급하다고", roman:"si-geup-ha-da-go", en:"is urgent, that" },
          { kr:"비판하는", roman:"bi-pan-ha-neun", en:"criticizing" },
          { kr:"일각의", roman:"il-gak-ui", en:"some quarters'" },
          { kr:"목소리도", roman:"mok-so-ri-do", en:"voices also" },
          { kr:"있다.", roman:"it-da.", en:"exist." }
        ]},
        { tokens: [
          { kr:"하지만", roman:"ha-ji-man", en:"however" },
          { kr:"우주", roman:"u-ju", en:"space" },
          { kr:"탐사는", roman:"tam-sa-neun", en:"exploration [topic]" },
          { kr:"단순히", roman:"dan-sun-hi", en:"simply" },
          { kr:"미지의", roman:"mi-ji-ui", en:"unknown" },
          { kr:"세계를", roman:"se-gye-reul", en:"world [obj.]" },
          { kr:"탐구하는", roman:"tam-gu-ha-neun", en:"exploring" },
          { kr:"것만은", roman:"geot-man-eun", en:"only (that) [topic]" },
          { kr:"아니다.", roman:"a-ni-da.", en:"is not." }
        ]},
        { tokens: [
          { kr:"우주라는", roman:"u-ju-ra-neun", en:"the (so-called) space" },
          { kr:"극한의", roman:"geuk-han-ui", en:"extreme" },
          { kr:"환경은", roman:"hwan-gyeong-eun", en:"environment [topic]" },
          { kr:"기존의", roman:"gi-jon-ui", en:"existing" },
          { kr:"기술로는", roman:"gi-sul-lo-neun", en:"with technology" },
          { kr:"해결하지", roman:"hae-gyeol-ha-ji", en:"solve" },
          { kr:"못하는", roman:"mot-ha-neun", en:"cannot" },
          { kr:"혁신적인", roman:"hyeok-sin-jeok-in", en:"innovative" },
          { kr:"해결책을", roman:"hae-gyeol-chaek-eul", en:"solutions [obj.]" },
          { kr:"요구한다.", roman:"yo-gu-han-da.", en:"demands." }
        ]},
        { tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"과정에서", roman:"gwa-jeong-e-seo", en:"in the process" },
          { kr:"개발된", roman:"gae-bal-doen", en:"developed" },
          { kr:"기술은", roman:"gi-sul-eun", en:"technology [topic]" },
          { kr:"사회의", roman:"sa-hoe-ui", en:"society's" },
          { kr:"다양한", roman:"da-yang-han", en:"various" },
          { kr:"분야에서", roman:"bun-ya-e-seo", en:"in fields" },
          { kr:"새로운", roman:"sae-ro-un", en:"new" },
          { kr:"산업과", roman:"san-eop-gwa", en:"industries and" },
          { kr:"일자리를", roman:"il-ja-ri-reul", en:"jobs [obj.]" },
          { kr:"창출하며", roman:"chang-chul-ha-myeo", en:"creating, and" },
          { kr:"경제", roman:"gyeong-je", en:"economic" },
          { kr:"성장의", roman:"seong-jang-ui", en:"growth's" },
          { kr:"동력이", roman:"dong-nyeok-i", en:"driving force [subj.]" },
          { kr:"된다.", roman:"doen-da.", en:"becomes." }
        ]}
      ],
      choices: [
        { num:1, kr:"우주 탐사를 반대하는 주장이 갈수록 힘을 얻고 있다.", roman:"u-ju tam-sa-reul ban-dae-ha-neun ju-jang-i gal-su-rok him-eul eot-go it-da", en:"The argument against space exploration is gaining strength.", correct:false },
        { num:2, kr:"우주 탐사는 경제적 가치를 창출하지 못할 가능성이 높다.", roman:"u-ju tam-sa-neun gyeong-je-jeok ga-chi-reul chang-chul-ha-ji mot-hal ga-neung-seong-i nop-da", en:"Space exploration likely fails to create economic value.", correct:false },
        { num:3, kr:"우주 탐사 기술은 산업과 경제 전반을 발전시키는 역할을 한다.", roman:"u-ju tam-sa gi-sul-eun san-eop-gwa gyeong-je jeon-ban-eul bal-jeon-si-ki-neun yeok-hal-eul han-da", en:"Space-exploration technology develops industry and the economy as a whole.", correct:true },
        { num:4, kr:"우주 탐사의 가장 중요한 임무는 미지의 세계를 탐구하는 것이다.", roman:"u-ju tam-sa-ui ga-jang jung-yo-han im-mu-neun mi-ji-ui se-gye-reul tam-gu-ha-neun geot-i-da", en:"Space exploration's most important mission is to explore the unknown.", correct:false }
      ],
      answer: 3,
      whyRight: `After acknowledging critics, the writer argues (하지만 ...) that space tech "산업과 일자리를 창출하며 경제 성장의 동력이 된다" (creates industries and jobs, driving economic growth). The main point is ③ — space-exploration technology develops industry and the economy.`,
      whyWrong: {
        "1": `The critics' view is mentioned only to be rebutted (하지만). The passage's stance is pro-exploration, so ① isn't the topic.`,
        "2": `The text argues the <b>opposite</b> — that it DOES create economic value via new industries and jobs. ② contradicts the conclusion.`,
        "4": `The writer explicitly says it's "not simply exploring the unknown" (단순히 ... 것만은 아니다). So ④ is the view being moved beyond, not the main topic.`
      },
      vocab: [
        { kr:"인류", roman:"in-ryu", en:"humankind, humanity" },
        { kr:"화성", roman:"hwa-seong", en:"Mars" },
        { kr:"탐사", roman:"tam-sa", en:"exploration, probe" },
        { kr:"한창이다", roman:"han-chang-i-da", en:"to be in full swing / at its peak" },
        { kr:"의식주", roman:"ui-sik-ju", en:"food, clothing and shelter (basic needs)" },
        { kr:"시급하다", roman:"si-geup-ha-da", en:"to be urgent" },
        { kr:"미지", roman:"mi-ji", en:"the unknown" },
        { kr:"극한", roman:"geuk-han", en:"extreme (limit)" },
        { kr:"혁신적", roman:"hyeok-sin-jeok", en:"innovative" },
        { kr:"창출하다", roman:"chang-chul-ha-da", en:"to create, to generate" },
        { kr:"동력", roman:"dong-nyeok", en:"driving force, motive power" }
      ],
      grammar: [
        {
          pattern: "단순히 ~ 것만은 아니다 (not simply ~)",
          plainEnglish: `단순히 ... 것만은 아니다 = "it is not simply ~ (there's more to it)." It concedes one view and signals the writer's real point is bigger. The sentence right after it usually carries the main idea.`,
          examples: [
            { kr:"이것은 단순히 취미만은 아니다.", roman:"I-geot-eun dan-sun-hi chwi-mi-man-eun a-ni-da.", en:"This is not simply a hobby." },
            { kr:"성공은 단순히 운만은 아니다.", roman:"Seong-gong-eun dan-sun-hi un-man-eun a-ni-da.", en:"Success is not simply luck." }
          ],
          commonMistake: `In 주제 (topic) questions, the writer's claim comes after 하지만. Don't pick the rebutted view (critics, or "just exploring the unknown") as the topic.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the main point of the passage?`,
          choices: ["Space-exploration tech drives industry and economic growth", "Space exploration wastes money", "Basic needs always come first", "Mars travel is impossible"],
          answer: 0,
          explain: `The writer argues space tech creates new industries and jobs, becoming a driver of economic growth.`
        },
        {
          kind: "mcq",
          q: `What role does the critics' view play?`,
          choices: ["It is acknowledged, then rebutted with 하지만", "It is the conclusion", "It is never mentioned", "It is fully endorsed"],
          answer: 0,
          explain: `The critics say basic needs are more urgent; the writer counters with 하지만 and the economic-value argument.`
        }
      ]
    },
    // ── Q36 · Main Topic · workplace safety via environment ──
    Q36: {
      num: 36,
      type: "main-topic",
      section: "M",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[35~38] 다음을 읽고 글의 주제로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Read the following and choose the option that best fits the topic of the text. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"산업", roman:"san-eop", en:"industrial" },
          { kr:"현장에는", roman:"hyeon-jang-e-neun", en:"at worksites" },
          { kr:"위험", roman:"wi-heom", en:"hazard" },
          { kr:"요소가", roman:"yo-so-ga", en:"factors [subj.]" },
          { kr:"많아", roman:"man-a", en:"are many, so" },
          { kr:"안전사고가", roman:"an-jeon-sa-go-ga", en:"safety accidents [subj.]" },
          { kr:"빈번히", roman:"bin-beon-hi", en:"frequently" },
          { kr:"발생한다.", roman:"bal-saeng-han-da.", en:"occur." }
        ]},
        { tokens: [
          { kr:"이때", roman:"i-ttae", en:"at this time" },
          { kr:"시각적,", roman:"si-gak-jeok", en:"visual," },
          { kr:"물리적", roman:"mul-li-jeok", en:"physical" },
          { kr:"환경을", roman:"hwan-gyeong-eul", en:"environment [obj.]" },
          { kr:"개선하면", roman:"gae-seon-ha-myeon", en:"if (you) improve" },
          { kr:"안전사고를", roman:"an-jeon-sa-go-reul", en:"safety accidents [obj.]" },
          { kr:"효과적으로", roman:"hyo-gwa-jeok-eu-ro", en:"effectively" },
          { kr:"줄일", roman:"jul-il", en:"reduce" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있다.", roman:"it-da.", en:"(it) is possible." }
        ]},
        { tokens: [
          { kr:"일례로", roman:"il-lye-ro", en:"for example" },
          { kr:"기계의", roman:"gi-gye-ui", en:"a machine's" },
          { kr:"정지", roman:"jeong-ji", en:"stop" },
          { kr:"버튼에", roman:"beo-teun-e", en:"button [loc.]" },
          { kr:"빨간", roman:"ppal-gan", en:"red" },
          { kr:"화살표를", roman:"hwa-sal-pyo-reul", en:"arrow [obj.]" },
          { kr:"붙여", roman:"but-yeo", en:"attaching" },
          { kr:"두면", roman:"du-myeon", en:"if (you) keep" },
          { kr:"비상", roman:"bi-sang", en:"emergency" },
          { kr:"상황에서", roman:"sang-hwang-e-seo", en:"in a situation" },
          { kr:"근로자가", roman:"geun-ro-ja-ga", en:"a worker [subj.]" },
          { kr:"빠르게", roman:"ppa-reu-ge", en:"quickly" },
          { kr:"버튼을", roman:"beo-teun-eul", en:"button [obj.]" },
          { kr:"찾아", roman:"cha-ja", en:"finds" },
          { kr:"누를", roman:"nu-reul", en:"to press" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있다.", roman:"it-da.", en:"(it) is possible." }
        ]},
        { tokens: [
          { kr:"또", roman:"tto", en:"also" },
          { kr:"칼날을", roman:"kal-nal-eul", en:"blades [obj.]" },
          { kr:"사용하는", roman:"sa-yong-ha-neun", en:"that use" },
          { kr:"작업대", roman:"jak-eop-dae", en:"workbench" },
          { kr:"옆에", roman:"yeop-e", en:"next to" },
          { kr:"자석으로", roman:"ja-seok-eu-ro", en:"of magnet" },
          { kr:"된", roman:"doen", en:"made" },
          { kr:"수거함을", roman:"su-geo-ham-eul", en:"collection box [obj.]" },
          { kr:"두어", roman:"du-eo", en:"placing" },
          { kr:"위험한", roman:"wi-heom-han", en:"dangerous" },
          { kr:"칼날을", roman:"kal-nal-eul", en:"blades [obj.]" },
          { kr:"자석에", roman:"ja-seok-e", en:"to the magnet" },
          { kr:"부착하게", roman:"bu-chak-ha-ge", en:"to attach" },
          { kr:"만듦으로써", roman:"man-deul-eum-eu-ro-sseo", en:"by making" },
          { kr:"사고", roman:"sa-go", en:"accident" },
          { kr:"발생률을", roman:"bal-saeng-nyul-eul", en:"occurrence rate [obj.]" },
          { kr:"낮출", roman:"nat-chul", en:"lower" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있다.", roman:"it-da.", en:"(it) is possible." }
        ]}
      ],
      choices: [
        { num:1, kr:"근로자들의 작업 효율을 높이기 위한 대책이 마련되었다.", roman:"geun-ro-ja-deul-ui jak-eop hyo-yul-eul nop-i-gi wi-han dae-chaek-i ma-ryeon-doe-eot-da", en:"Measures to raise workers' efficiency have been prepared.", correct:false },
        { num:2, kr:"안전사고가 발생하는 원인을 규명하는 연구가 이루어졌다.", roman:"an-jeon-sa-go-ga bal-saeng-ha-neun won-in-eul gyu-myeong-ha-neun yeon-gu-ga i-ru-eo-jyeot-da", en:"Research investigating the causes of accidents was conducted.", correct:false },
        { num:3, kr:"산업 현장의 작업 환경을 개선하면 안전사고를 예방할 수 있다.", roman:"san-eop hyeon-jang-ui jak-eop hwan-gyeong-eul gae-seon-ha-myeon an-jeon-sa-go-reul ye-bang-hal su it-da", en:"Improving the work environment at industrial sites can prevent accidents.", correct:true },
        { num:4, kr:"안전사고 방지를 담당하는 현장 책임자의 역할이 강조되고 있다.", roman:"an-jeon-sa-go bang-ji-reul dam-dang-ha-neun hyeon-jang chaek-im-ja-ui yeok-hal-i gang-jo-doe-go it-da", en:"The role of the on-site safety manager is being emphasized.", correct:false }
      ],
      answer: 3,
      whyRight: `The thesis sentence is "시각적·물리적 환경을 개선하면 안전사고를 효과적으로 줄일 수 있다" — improving the environment effectively reduces accidents. The red-arrow and magnetic-box examples support it. The topic is ③: improving the work environment prevents accidents.`,
      whyWrong: {
        "1": `The passage is about <b>safety</b>, not "work efficiency." ① changes the subject.`,
        "2": `It does not "investigate causes" — it proposes environmental fixes. ② describes a different kind of study.`,
        "4": `The examples are about the physical environment (arrows, magnetic boxes), not a "manager's role." ④ adds an emphasis not in the text.`
      },
      vocab: [
        { kr:"산업 현장", roman:"san-eop hyeon-jang", en:"industrial worksite" },
        { kr:"위험 요소", roman:"wi-heom yo-so", en:"hazard, risk factor" },
        { kr:"안전사고", roman:"an-jeon-sa-go", en:"safety accident" },
        { kr:"빈번히", roman:"bin-beon-hi", en:"frequently" },
        { kr:"개선하다", roman:"gae-seon-ha-da", en:"to improve" },
        { kr:"효과적", roman:"hyo-gwa-jeok", en:"effective" },
        { kr:"비상 상황", roman:"bi-sang sang-hwang", en:"emergency situation" },
        { kr:"근로자", roman:"geun-ro-ja", en:"worker" },
        { kr:"자석", roman:"ja-seok", en:"magnet" },
        { kr:"부착하다", roman:"bu-chak-ha-da", en:"to attach, to affix" },
        { kr:"발생률", roman:"bal-saeng-nyul", en:"occurrence rate" },
        { kr:"예방하다", roman:"ye-bang-ha-da", en:"to prevent" }
      ],
      grammar: [
        {
          pattern: "-(으)로써 (by means of -ing)",
          plainEnglish: `N + (으)로써 or V-(으)ㅁ + 으로써 = "by means of / by doing." 부착하게 만듦으로써 = "by making (blades) attach." It states the method that achieves a result — here, lowering the accident rate.`,
          examples: [
            { kr:"환경을 개선함으로써 사고를 줄였다.", roman:"Hwan-gyeong-eul gae-seon-ham-eu-ro-sseo sa-go-reul jul-yeot-da.", en:"By improving the environment, they reduced accidents." },
            { kr:"대화로써 문제를 해결했다.", roman:"Dae-hwa-ro-sseo mun-je-reul hae-gyeol-haet-da.", en:"They solved the problem by means of dialogue." }
          ],
          commonMistake: `The topic of a 주제 question is the general claim (improve environment → fewer accidents), not a single example (the red arrow). Pick the umbrella statement.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the main idea?`,
          choices: ["Improving the physical work environment prevents safety accidents", "Workers should work faster", "Managers must be blamed for accidents", "Machines should be banned"],
          answer: 0,
          explain: `The thesis: improving the visual/physical environment effectively reduces accidents, shown by the examples.`
        },
        {
          kind: "mcq",
          q: `The red arrow and magnetic box are…`,
          choices: ["Examples supporting the main claim", "The main topic themselves", "Counterexamples", "Unrelated details"],
          answer: 0,
          explain: `They are 일례 (examples) illustrating how environmental improvements cut accidents.`
        }
      ]
    },
    // ── Q37 · Main Topic · urban openness vs. closed spaces ──
    Q37: {
      num: 37,
      type: "main-topic",
      section: "M",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[35~38] 다음을 읽고 글의 주제로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Read the following and choose the option that best fits the topic of the text. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"최근", roman:"choe-geun", en:"recently" },
          { kr:"동네", roman:"dong-ne", en:"neighborhood" },
          { kr:"놀이터와", roman:"nol-i-teo-wa", en:"playgrounds and" },
          { kr:"편의", roman:"pyeon-ui", en:"convenience" },
          { kr:"시설", roman:"si-seol", en:"facilities" },
          { kr:"등에", roman:"deung-e", en:"etc. to" },
          { kr:"외부인", roman:"oe-bu-in", en:"outsiders" },
          { kr:"출입을", roman:"chul-ip-eul", en:"entry [obj.]" },
          { kr:"금지하고", roman:"geum-ji-ha-go", en:"prohibiting, and" },
          { kr:"거주민만", roman:"geo-ju-min-man", en:"only residents" },
          { kr:"이용할", roman:"i-yong-hal", en:"to use" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있게", roman:"it-ge", en:"to be able" },
          { kr:"하는", roman:"ha-neun", en:"making" },
          { kr:"곳이", roman:"got-i", en:"places [subj.]" },
          { kr:"많아지고", roman:"man-a-ji-go", en:"increasing, and" },
          { kr:"있다.", roman:"it-da.", en:"are." }
        ]},
        { tokens: [
          { kr:"이러한", roman:"i-reo-han", en:"such" },
          { kr:"변화는", roman:"byeon-hwa-neun", en:"changes [topic]" },
          { kr:"관리의", roman:"gwan-li-ui", en:"management's" },
          { kr:"편리성과", roman:"pyeon-li-seong-gwa", en:"convenience and" },
          { kr:"거주민", roman:"geo-ju-min", en:"resident" },
          { kr:"보호를", roman:"bo-ho-reul", en:"protection [obj.]" },
          { kr:"추구한", roman:"chu-gu-han", en:"pursued" },
          { kr:"결과이지만", roman:"gyeol-gwa-i-ji-man", en:"a result, but" },
          { kr:"이는", roman:"i-neun", en:"this [topic]" },
          { kr:"도시의", roman:"do-si-ui", en:"the city's" },
          { kr:"개방성을", roman:"gae-bang-seong-eul", en:"openness [obj.]" },
          { kr:"약화시키는", roman:"yak-hwa-si-ki-neun", en:"that weakens" },
          { kr:"부작용을", roman:"bu-jak-yong-eul", en:"side effect [obj.]" },
          { kr:"낳는다.", roman:"nat-neun-da.", en:"produces." }
        ]},
        { tokens: [
          { kr:"도시", roman:"do-si", en:"city" },
          { kr:"발전에", roman:"bal-jeon-e", en:"for development" },
          { kr:"필요한", roman:"pil-yo-han", en:"needed" },
          { kr:"개방성은", roman:"gae-bang-seong-eun", en:"openness [topic]" },
          { kr:"다양한", roman:"da-yang-han", en:"diverse" },
          { kr:"사람이", roman:"sa-ram-i", en:"people [subj.]" },
          { kr:"어울릴", roman:"eo-ul-lil", en:"to mingle" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있는", roman:"it-neun", en:"that can" },
          { kr:"공간을", roman:"gong-gan-eul", en:"space [obj.]" },
          { kr:"확보하는", roman:"hwak-bo-ha-neun", en:"securing" },
          { kr:"데서", roman:"de-seo", en:"from (the act of)" },
          { kr:"비롯된다.", roman:"bi-rot-doen-da.", en:"originates." }
        ]},
        { tokens: [
          { kr:"도시의", roman:"do-si-ui", en:"the city's" },
          { kr:"공간이", roman:"gong-gan-i", en:"space [subj.]" },
          { kr:"폐쇄적으로", roman:"pye-swae-jeok-eu-ro", en:"in a closed way" },
          { kr:"구획화되면", roman:"gu-hoek-hwa-doe-myeon", en:"if partitioned" },
          { kr:"이웃", roman:"i-ut", en:"neighbor" },
          { kr:"간의", roman:"gan-ui", en:"between" },
          { kr:"교류가", roman:"gyo-ryu-ga", en:"exchange [subj.]" },
          { kr:"줄어", roman:"jul-eo", en:"decreases, and" },
          { kr:"활력을", roman:"hwal-lyeok-eul", en:"vitality [obj.]" },
          { kr:"잃게", roman:"il-ke", en:"to lose" },
          { kr:"된다.", roman:"doen-da.", en:"comes to." }
        ]}
      ],
      choices: [
        { num:1, kr:"도시 관리의 편리성을 높일 수 있도록 노력해야 한다.", roman:"do-si gwan-li-ui pyeon-li-seong-eul nop-il su it-do-rok no-ryeok-hae-ya han-da", en:"We should strive to raise the convenience of urban management.", correct:false },
        { num:2, kr:"도시를 설계할 때는 거주민 보호를 최우선으로 삼아야 한다.", roman:"do-si-reul seol-gye-hal ttae-neun geo-ju-min bo-ho-reul choe-u-seon-eu-ro sam-a-ya han-da", en:"When designing a city, resident protection must be the top priority.", correct:false },
        { num:3, kr:"외부인의 출입을 제한하여 거주민 간의 교류를 활성화해야 한다.", roman:"oe-bu-in-ui chul-ip-eul je-han-ha-yeo geo-ju-min gan-ui gyo-ryu-reul hwal-seong-hwa-hae-ya han-da", en:"We should restrict outsiders to boost exchange among residents.", correct:false },
        { num:4, kr:"도시의 활력을 위해서는 개방된 공간과 시설을 늘리는 것이 좋다.", roman:"do-si-ui hwal-lyeok-eul wi-hae-seo-neun gae-bang-doen gong-gan-gwa si-seol-eul neul-li-neun geot-i jot-da", en:"For a city's vitality, increasing open spaces and facilities is good.", correct:true }
      ],
      answer: 4,
      whyRight: `The writer warns that closing spaces to outsiders weakens 개방성 (openness), and openness — which comes from spaces where diverse people mingle — is what a city needs; closed partitioning makes a city lose vitality. The topic is therefore ④: for vitality, increase open spaces.`,
      whyWrong: {
        "1": `Management convenience is named as a <b>cause of the problem</b>, not the goal. ① endorses the very thing the writer criticizes.`,
        "2": `Resident protection is also a stated motive for the closures the writer warns against. ② is not the main point.`,
        "3": `Restricting outsiders is exactly what <b>reduces</b> exchange and vitality in the passage. ③ is the opposite of the writer's view.`
      },
      vocab: [
        { kr:"놀이터", roman:"nol-i-teo", en:"playground" },
        { kr:"편의 시설", roman:"pyeon-ui si-seol", en:"convenience facility, amenity" },
        { kr:"외부인", roman:"oe-bu-in", en:"outsider, non-member" },
        { kr:"출입", roman:"chul-ip", en:"entry and exit, access" },
        { kr:"거주민", roman:"geo-ju-min", en:"resident" },
        { kr:"개방성", roman:"gae-bang-seong", en:"openness" },
        { kr:"부작용", roman:"bu-jak-yong", en:"side effect" },
        { kr:"어울리다", roman:"eo-ul-li-da", en:"to mingle, to get along" },
        { kr:"확보하다", roman:"hwak-bo-ha-da", en:"to secure, to obtain" },
        { kr:"폐쇄적", roman:"pye-swae-jeok", en:"closed-off, exclusive" },
        { kr:"교류", roman:"gyo-ryu", en:"exchange, interaction" },
        { kr:"활력", roman:"hwal-lyeok", en:"vitality, energy" }
      ],
      grammar: [
        {
          pattern: "-는 데서 비롯되다 (to originate from -ing)",
          plainEnglish: `데(서) here = "the act/place of." V-는 데서 비롯되다 = "originates from (doing)." 공간을 확보하는 데서 비롯된다 = "originates from securing space." Useful for stating a source/cause.`,
          examples: [
            { kr:"성공은 노력하는 데서 비롯된다.", roman:"Seong-gong-eun no-ryeok-ha-neun de-seo bi-rot-doen-da.", en:"Success originates from making an effort." },
            { kr:"문제는 소통이 부족한 데서 비롯됐다.", roman:"Mun-je-neun so-tong-i bu-jok-han de-seo bi-rot-dwaet-da.", en:"The problem originated from a lack of communication." }
          ],
          commonMistake: `Watch the writer's stance: 관리 편리성 and 거주민 보호 are causes of the criticized closures, not goals to pursue. The endorsed value is openness.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does the writer recommend for a city's vitality?`,
          choices: ["Increasing open, shared spaces", "Closing facilities to outsiders", "Prioritizing management convenience", "Reducing the number of playgrounds"],
          answer: 0,
          explain: `Openness comes from spaces where diverse people mingle; closing them off drains vitality.`
        },
        {
          kind: "mcq",
          q: `In the passage, restricting outsiders leads to…`,
          choices: ["Less neighborly exchange and lost vitality", "More tourists", "Higher property value", "Better playgrounds"],
          answer: 0,
          explain: `Closed partitioning reduces 교류 (exchange) and the city loses 활력 (vitality).`
        }
      ]
    },
    // ── Q38 · Main Topic · earmarked taxes (목적세) ──
    Q38: {
      num: 38,
      type: "main-topic",
      section: "M",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[35~38] 다음을 읽고 글의 주제로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Read the following and choose the option that best fits the topic of the text. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"목적세는", roman:"mok-jeok-se-neun", en:"earmarked tax [topic]" },
          { kr:"사용처가", roman:"sa-yong-cheo-ga", en:"the use [subj.]" },
          { kr:"미리", roman:"mi-ri", en:"in advance" },
          { kr:"정해진", roman:"jeong-hae-jin", en:"determined" },
          { kr:"세금이다.", roman:"se-geum-i-da.", en:"is a tax." }
        ]},
        { tokens: [
          { kr:"교통세,", roman:"gyo-tong-se", en:"transportation tax," },
          { kr:"환경세,", roman:"hwan-gyeong-se", en:"environmental tax," },
          { kr:"교육세", roman:"gyo-yuk-se", en:"education tax" },
          { kr:"등이", roman:"deung-i", en:"etc. [subj.]" },
          { kr:"그", roman:"geu", en:"its" },
          { kr:"예이다.", roman:"ye-i-da.", en:"are examples." }
        ]},
        { tokens: [
          { kr:"그런데", roman:"geu-reon-de", en:"however" },
          { kr:"목적세가", roman:"mok-jeok-se-ga", en:"earmarked tax [subj.]" },
          { kr:"시의에", roman:"si-ui-e", en:"on circumstances" },
          { kr:"따라서는", roman:"tta-ra-seo-neun", en:"depending" },
          { kr:"국가", roman:"guk-ga", en:"national" },
          { kr:"재정의", roman:"jae-jeong-ui", en:"finances'" },
          { kr:"효율성을", roman:"hyo-yul-seong-eul", en:"efficiency [obj.]" },
          { kr:"떨어뜨릴", roman:"tteol-eo-tteu-ril", en:"to lower" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있다.", roman:"it-da.", en:"(it) may." }
        ]},
        { tokens: [
          { kr:"많은", roman:"man-eun", en:"many" },
          { kr:"종류의", roman:"jong-nyu-ui", en:"kinds of" },
          { kr:"목적세가", roman:"mok-jeok-se-ga", en:"earmarked taxes [subj.]" },
          { kr:"당해", roman:"dang-hae", en:"that" },
          { kr:"년에", roman:"nyeon-e", en:"year in" },
          { kr:"소진되지", roman:"so-jin-doe-ji", en:"used up" },
          { kr:"못하고", roman:"mot-ha-go", en:"cannot be, and" },
          { kr:"불필요한", roman:"bul-pil-yo-han", en:"unnecessary" },
          { kr:"곳에", roman:"got-e", en:"places in" },
          { kr:"남용되기", roman:"nam-yong-doe-gi", en:"are misused" },
          { kr:"때문이다.", roman:"ttae-mun-i-da.", en:"because." }
        ]},
        { tokens: [
          { kr:"남는", roman:"nam-neun", en:"leftover" },
          { kr:"목적세를", roman:"mok-jeok-se-reul", en:"earmarked tax [obj.]" },
          { kr:"적절히", roman:"jeok-jeol-hi", en:"appropriately" },
          { kr:"용도", roman:"yong-do", en:"purpose" },
          { kr:"변경해서", roman:"byeon-gyeong-hae-seo", en:"changing, and" },
          { kr:"필요한", roman:"pil-yo-han", en:"needed" },
          { kr:"곳에", roman:"got-e", en:"places in" },
          { kr:"사용하려고", roman:"sa-yong-ha-ryeo-go", en:"to use" },
          { kr:"해도", roman:"hae-do", en:"even if (you) try" },
          { kr:"목적세라는", roman:"mok-jeok-se-ra-neun", en:"the label 'earmarked tax'" },
          { kr:"명목에", roman:"myeong-mok-e", en:"to the designation" },
          { kr:"묶여", roman:"muk-yeo", en:"being bound" },
          { kr:"해당", roman:"hae-dang", en:"the relevant" },
          { kr:"분야", roman:"bun-ya", en:"field" },
          { kr:"외에는", roman:"oe-e-neun", en:"outside of" },
          { kr:"사용할", roman:"sa-yong-hal", en:"to use" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"없는", roman:"eop-neun", en:"cannot, which" },
          { kr:"것은", roman:"geot-eun", en:"(thing) [topic]" },
          { kr:"큰", roman:"keun", en:"a big" },
          { kr:"문제이다.", roman:"mun-je-i-da.", en:"is a problem." }
        ]}
      ],
      choices: [
        { num:1, kr:"목적세의 징수 금액을 점진적으로 늘려야 한다.", roman:"mok-jeok-se-ui jing-su geum-aek-eul jeom-jin-jeok-eu-ro neul-lyeo-ya han-da", en:"The amount of earmarked tax collected should be gradually increased.", correct:false },
        { num:2, kr:"목적세를 도입할 때는 국민의 동의를 얻어야 한다.", roman:"mok-jeok-se-reul do-ip-hal ttae-neun guk-min-ui dong-ui-reul eod-eo-ya han-da", en:"When introducing an earmarked tax, public consent must be obtained.", correct:false },
        { num:3, kr:"목적세를 통해 신속하게 쓸 수 있는 재원을 확보해야 한다.", roman:"mok-jeok-se-reul tong-hae sin-sok-ha-ge sseul su it-neun jae-won-eul hwak-bo-hae-ya han-da", en:"Through earmarked taxes, quickly usable funds should be secured.", correct:false },
        { num:4, kr:"목적세를 필요에 따라 유연하게 사용할 수 있도록 해야 한다.", roman:"mok-jeok-se-reul pil-yo-e tta-ra yu-yeon-ha-ge sa-yong-hal su it-do-rok hae-ya han-da", en:"Earmarked taxes should be made usable flexibly according to need.", correct:true }
      ],
      answer: 4,
      whyRight: `The core problem is that leftover earmarked tax can't be repurposed — it's "명목에 묶여" (bound to its label) and unusable elsewhere, hurting fiscal efficiency. The implied solution/topic is ④: earmarked taxes should be usable flexibly as needed.`,
      whyWrong: {
        "1": `The passage never argues for collecting <b>more</b>; the issue is rigid use of what's already collected. ① misses the point.`,
        "2": `Public consent for introducing the tax is never discussed. ② is off-topic.`,
        "3": `"Securing quickly usable funds" isn't the thesis; the thesis is about <b>flexibility to repurpose</b>. ③ is close but not the main claim.`
      },
      vocab: [
        { kr:"목적세", roman:"mok-jeok-se", en:"earmarked tax (use predetermined)" },
        { kr:"사용처", roman:"sa-yong-cheo", en:"place/purpose of use" },
        { kr:"세금", roman:"se-geum", en:"tax" },
        { kr:"재정", roman:"jae-jeong", en:"finances, the budget" },
        { kr:"효율성", roman:"hyo-yul-seong", en:"efficiency" },
        { kr:"소진되다", roman:"so-jin-doe-da", en:"to be used up, exhausted" },
        { kr:"남용되다", roman:"nam-yong-doe-da", en:"to be misused, overused" },
        { kr:"용도", roman:"yong-do", en:"use, purpose" },
        { kr:"변경하다", roman:"byeon-gyeong-ha-da", en:"to change, to alter" },
        { kr:"명목", roman:"myeong-mok", en:"nominal label, pretext" },
        { kr:"유연하다", roman:"yu-yeon-ha-da", en:"to be flexible" }
      ],
      grammar: [
        {
          pattern: "-(으)려고 해도 (even if you try to ~)",
          plainEnglish: `V-(으)려고 해도 = "even if (one) tries to ~." 사용하려고 해도 = "even if you try to use it." It sets up a frustrated attempt: you want to, but something blocks you (here, the rigid label).`,
          examples: [
            { kr:"바꾸려고 해도 규정 때문에 안 된다.", roman:"Ba-kku-ryeo-go hae-do gyu-jeong ttae-mun-e an doen-da.", en:"Even if you try to change it, the rules don't allow it." },
            { kr:"자려고 해도 잠이 안 와요.", roman:"Ja-ryeo-go hae-do jam-i an wa-yo.", en:"Even when I try to sleep, I can't fall asleep." }
          ],
          commonMistake: `The thesis is the proposed fix implied by the problem: rigidity is bad → make it flexible (④). Don't pick a true-but-minor detail like ③.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the main problem with earmarked taxes here?`,
          choices: ["Leftover funds can't be repurposed, hurting efficiency", "They are collected too rarely", "The public never consents to them", "They are spent too quickly"],
          answer: 0,
          explain: `Bound to their label, leftover earmarked taxes can't be used elsewhere even when needed — reducing fiscal efficiency.`
        },
        {
          kind: "mcq",
          q: `-(으)려고 해도 means…`,
          choices: ["Even if one tries to ~", "In order to ~", "Because of ~", "As soon as ~"],
          answer: 0,
          explain: `-(으)려고 해도 = "even if (one) tries to," signaling a blocked attempt.`
        }
      ]
    },
    // ── Q39 · Sentence Insertion · athletes' second careers ──
    Q39: {
      num: 39,
      type: "sentence-insertion",
      section: "N",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[39~41] 주어진 문장이 들어갈 곳으로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate place for the given sentence to be inserted. (2 points each)"
      },
      insertSentence: {
        kr: "사회적으로도 이들을 위한 재교육의 장이 충분히 마련되어 있지 않다.",
        roman: "sa-hoe-jeok-eu-ro-do i-deul-eul wi-han jae-gyo-yuk-ui jang-i chung-bun-hi ma-ryeon-doe-eo it-ji an-ta.",
        en: "Socially as well, sufficient re-education opportunities for these people are not provided."
      },
      passageParas: [
        { tokens: [
          { kr:"[삽입할 문장]", roman:"sap-ip-hal mun-jang", en:"[Sentence to insert]:" },
          { kr:"사회적으로도", roman:"sa-hoe-jeok-eu-ro-do", en:"socially as well" },
          { kr:"이들을", roman:"i-deul-eul", en:"these people [obj.]" },
          { kr:"위한", roman:"wi-han", en:"for" },
          { kr:"재교육의", roman:"jae-gyo-yuk-ui", en:"re-education's" },
          { kr:"장이", roman:"jang-i", en:"venue/opportunity [subj.]" },
          { kr:"충분히", roman:"chung-bun-hi", en:"sufficiently" },
          { kr:"마련되어", roman:"ma-ryeon-doe-eo", en:"provided" },
          { kr:"있지", roman:"it-ji", en:"being" },
          { kr:"않다.", roman:"an-ta.", en:"is not." }
        ]},
        { tokens: [
          { kr:"운동선수들의", roman:"un-dong-seon-su-deul-ui", en:"athletes'" },
          { kr:"평균", roman:"pyeong-gyun", en:"average" },
          { kr:"은퇴", roman:"eun-toe", en:"retirement" },
          { kr:"연령은", roman:"yeon-ryeong-eun", en:"age [topic]" },
          { kr:"23.6세로", roman:"i-sip-sam-jjeom-yuk-se-ro", en:"at 23.6 years" },
          { kr:"매우", roman:"mae-u", en:"very" },
          { kr:"짧은", roman:"jjalb-eun", en:"short" },
          { kr:"편이다.", roman:"pyeon-i-da.", en:"tends to be." },
          { kr:"(㉠)", roman:"(geu-yeok-1)", en:"[position ㉠]" }
        ]},
        { tokens: [
          { kr:"그래서", roman:"geu-rae-seo", en:"so" },
          { kr:"지도자의", roman:"ji-do-ja-ui", en:"coach's" },
          { kr:"길을", roman:"gil-eul", en:"path [obj.]" },
          { kr:"걷는", roman:"geot-neun", en:"who walk" },
          { kr:"소수의", roman:"so-su-ui", en:"a few" },
          { kr:"선수를", roman:"seon-su-reul", en:"players [obj.]" },
          { kr:"제외하면", roman:"je-oe-ha-myeon", en:"except for" },
          { kr:"대부분의", roman:"dae-bu-bun-ui", en:"most" },
          { kr:"선수들은", roman:"seon-su-deul-eun", en:"players [topic]" },
          { kr:"은퇴", roman:"eun-toe", en:"retirement" },
          { kr:"후", roman:"hu", en:"after" },
          { kr:"새로운", roman:"sae-ro-un", en:"new" },
          { kr:"직업을", roman:"jik-eop-eul", en:"job [obj.]" },
          { kr:"찾아야", roman:"cha-ja-ya", en:"must find" },
          { kr:"한다.", roman:"han-da.", en:"(do)." },
          { kr:"(㉡)", roman:"(geu-yeok-2)", en:"[position ㉡]" }
        ]},
        { tokens: [
          { kr:"하지만", roman:"ha-ji-man", en:"but" },
          { kr:"선수들은", roman:"seon-su-deul-eun", en:"players [topic]" },
          { kr:"오랜", roman:"o-raen", en:"long" },
          { kr:"시간", roman:"si-gan", en:"time" },
          { kr:"운동에만", roman:"un-dong-e-man", en:"only on sports" },
          { kr:"매진해", roman:"mae-jin-hae", en:"devoting" },
          { kr:"왔기", roman:"wat-gi", en:"having come" },
          { kr:"때문에", roman:"ttae-mun-e", en:"because" },
          { kr:"개개인이", roman:"gae-gae-in-i", en:"each individual [subj.]" },
          { kr:"은퇴", roman:"eun-toe", en:"retirement" },
          { kr:"이후의", roman:"i-hu-ui", en:"after" },
          { kr:"삶을", roman:"salm-eul", en:"life [obj.]" },
          { kr:"준비할", roman:"jun-bi-hal", en:"to prepare" },
          { kr:"여력이", roman:"yeo-ryeok-i", en:"capacity [subj.]" },
          { kr:"없다.", roman:"eop-da.", en:"have none." },
          { kr:"(㉢)", roman:"(geu-yeok-3)", en:"[position ㉢]" }
        ]},
        { tokens: [
          { kr:"이에", roman:"i-e", en:"accordingly" },
          { kr:"현역부터", roman:"hyeon-yeok-bu-teo", en:"from active years" },
          { kr:"선수들에게", roman:"seon-su-deul-e-ge", en:"to players" },
          { kr:"직업", roman:"jik-eop", en:"vocational" },
          { kr:"교육", roman:"gyo-yuk", en:"education" },
          { kr:"등을", roman:"deung-eul", en:"etc. [obj.]" },
          { kr:"지원하는", roman:"ji-won-ha-neun", en:"that support" },
          { kr:"구단이", roman:"gu-dan-i", en:"clubs [subj.]" },
          { kr:"많아지고", roman:"man-a-ji-go", en:"increasing, and" },
          { kr:"있다.", roman:"it-da.", en:"are." },
          { kr:"(㉣)", roman:"(geu-yeok-4)", en:"[position ㉣]" }
        ]}
      ],
      passageNote: "Sentence-insertion: read the given sentence (shown first, marked [삽입할 문장]), then pick the position ㉠~㉣ where it fits best.",
      choices: [
        { num:1, kr:"㉠", roman:"geu-yeok il", en:"position ㉠", correct:false },
        { num:2, kr:"㉡", roman:"geu-yeok i", en:"position ㉡", correct:false },
        { num:3, kr:"㉢", roman:"geu-yeok sam", en:"position ㉢", correct:true },
        { num:4, kr:"㉣", roman:"geu-yeok sa", en:"position ㉣", correct:false }
      ],
      answer: 3,
      whyRight: `The given sentence starts with "사회적으로도" (socially <b>as well</b>), adding a second, society-level shortfall on top of the individual one. The sentence just before ㉢ says individuals lack the capacity to prepare (개인 차원). ㉢ then adds the social-level lack, and the sentence after (이에 ... 구단이 많아지고 있다) responds with clubs stepping in. So ③ (㉢) fits.`,
      whyWrong: {
        "1": `At ㉠ the text has only stated the short retirement age — there's no "이들" (these people) yet for the given sentence to refer to, and no individual-level point to extend with "도 (also)."`,
        "2": `At ㉡ the discussion is still about needing a new job; the "재교육 (re-education)" idea and the individual-vs-social contrast haven't been set up.`,
        "4": `At ㉣ the clubs' solution has already been introduced — adding "there's no social provision" after the solution breaks the logical flow.`
      },
      vocab: [
        { kr:"은퇴", roman:"eun-toe", en:"retirement (from a career/sport)" },
        { kr:"연령", roman:"yeon-ryeong", en:"age" },
        { kr:"지도자", roman:"ji-do-ja", en:"leader, coach" },
        { kr:"제외하다", roman:"je-oe-ha-da", en:"to exclude" },
        { kr:"매진하다", roman:"mae-jin-ha-da", en:"to devote oneself fully" },
        { kr:"여력", roman:"yeo-ryeok", en:"spare capacity, leeway" },
        { kr:"현역", roman:"hyeon-yeok", en:"active duty / active player status" },
        { kr:"구단", roman:"gu-dan", en:"(sports) club, team organization" },
        { kr:"재교육", roman:"jae-gyo-yuk", en:"re-education, retraining" },
        { kr:"마련되다", roman:"ma-ryeon-doe-da", en:"to be prepared/provided" }
      ],
      grammar: [
        {
          pattern: "Connectors as insertion clues (그래서 / 하지만 / 이에)",
          plainEnglish: `For insertion questions, track the logical flow with connectors: 그래서 (so), 하지만 (but), 이에 (accordingly). A sentence with "~도 (also)" must come AFTER a related point it adds to. Match the connector logic before and after each slot.`,
          examples: [
            { kr:"개인도 어렵고, 사회적으로도 지원이 부족하다.", roman:"Gae-in-do eo-ryeop-go, sa-hoe-jeok-eu-ro-do ji-won-i bu-jok-ha-da.", en:"It's hard for individuals, and socially too the support is lacking." },
            { kr:"이에 대책을 마련하고 있다.", roman:"I-e dae-chaek-eul ma-ryeon-ha-go it-da.", en:"Accordingly, measures are being prepared." }
          ],
          commonMistake: `The "도 (also)" in the inserted sentence is the key: it needs a preceding individual-level point (at ㉢) so the social-level point can be added "as well."`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What signals where the given sentence belongs?`,
          choices: ["'사회적으로도' (also socially) extends a prior individual-level point", "It must go first", "It must go last", "The athlete's age decides it"],
          answer: 0,
          explain: `'도 (also)' means it adds to an existing point — the individual-capacity sentence at ㉢ — so it slots in there.`
        },
        {
          kind: "mcq",
          q: `What does 은퇴 mean?`,
          choices: ["Retirement from a career/sport", "Promotion", "Injury", "Training camp"],
          answer: 0,
          explain: `은퇴 = retirement, leaving one's active career.`
        }
      ]
    },
    // ── Q40 · Sentence Insertion · the clock and social change ──
    Q40: {
      num: 40,
      type: "sentence-insertion",
      section: "N",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[39~41] 주어진 문장이 들어갈 곳으로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate place for the given sentence to be inserted. (2 points each)"
      },
      insertSentence: {
        kr: "시간을 정확히 관리·통제할 수 있게 되면서 사회 전반에 획기적인 변화들이 나타나기 시작했다.",
        roman: "si-gan-eul jeong-hwak-hi gwan-li tong-je-hal su it-ge doe-myeon-seo sa-hoe jeon-ban-e hoek-gi-jeok-in byeon-hwa-deul-i na-ta-na-gi si-jak-haet-da.",
        en: "As it became possible to precisely manage and control time, groundbreaking changes began to appear throughout society."
      },
      passageParas: [
        { tokens: [
          { kr:"[삽입할 문장]", roman:"sap-ip-hal mun-jang", en:"[Sentence to insert]:" },
          { kr:"시간을", roman:"si-gan-eul", en:"time [obj.]" },
          { kr:"정확히", roman:"jeong-hwak-hi", en:"precisely" },
          { kr:"관리·통제할", roman:"gwan-li tong-je-hal", en:"manage and control" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있게", roman:"it-ge", en:"to be able" },
          { kr:"되면서", roman:"doe-myeon-seo", en:"as it became" },
          { kr:"사회", roman:"sa-hoe", en:"society" },
          { kr:"전반에", roman:"jeon-ban-e", en:"throughout" },
          { kr:"획기적인", roman:"hoek-gi-jeok-in", en:"groundbreaking" },
          { kr:"변화들이", roman:"byeon-hwa-deul-i", en:"changes [subj.]" },
          { kr:"나타나기", roman:"na-ta-na-gi", en:"to appear" },
          { kr:"시작했다.", roman:"si-jak-haet-da.", en:"began." }
        ]},
        { tokens: [
          { kr:"인간은", roman:"in-gan-eun", en:"humans [topic]" },
          { kr:"오랫동안", roman:"o-raet-dong-an", en:"for a long time" },
          { kr:"시간을", roman:"si-gan-eul", en:"time [obj.]" },
          { kr:"측정하는", roman:"cheuk-jeong-ha-neun", en:"measuring" },
          { kr:"방법을", roman:"bang-beop-eul", en:"methods [obj.]" },
          { kr:"찾기", roman:"chat-gi", en:"to find" },
          { kr:"위해", roman:"wi-hae", en:"in order to" },
          { kr:"노력해", roman:"no-ryeok-hae", en:"striving" },
          { kr:"왔다.", roman:"wat-da.", en:"have." },
          { kr:"(㉠)", roman:"(geu-yeok-1)", en:"[position ㉠]" }
        ]},
        { tokens: [
          { kr:"해시계,", roman:"hae-si-gye", en:"sundials," },
          { kr:"물시계", roman:"mul-si-gye", en:"water clocks" },
          { kr:"등을", roman:"deung-eul", en:"etc. [obj.]" },
          { kr:"거쳐", roman:"geo-chyeo", en:"passing through" },
          { kr:"기계식", roman:"gi-gye-sik", en:"mechanical" },
          { kr:"시계가", roman:"si-gye-ga", en:"clocks [subj.]" },
          { kr:"개발되면서", roman:"gae-bal-doe-myeon-seo", en:"as developed" },
          { kr:"정확한", roman:"jeong-hwak-han", en:"precise" },
          { kr:"시간의", roman:"si-gan-ui", en:"time's" },
          { kr:"측정이", roman:"cheuk-jeong-i", en:"measurement [subj.]" },
          { kr:"가능해졌다.", roman:"ga-neung-hae-jyeot-da.", en:"became possible." },
          { kr:"(㉡)", roman:"(geu-yeok-2)", en:"[position ㉡]" }
        ]},
        { tokens: [
          { kr:"노동자들이", roman:"no-dong-ja-deul-i", en:"workers [subj.]" },
          { kr:"일정한", roman:"il-jeong-han", en:"set" },
          { kr:"시간에", roman:"si-gan-e", en:"at times" },
          { kr:"출퇴근하고", roman:"chul-toe-geun-ha-go", en:"commute, and" },
          { kr:"서로", roman:"seo-ro", en:"each other" },
          { kr:"다른", roman:"da-reun", en:"different" },
          { kr:"공간에서도", roman:"gong-gan-e-seo-do", en:"even in spaces" },
          { kr:"공동의", roman:"gong-dong-ui", en:"shared" },
          { kr:"일을", roman:"il-eul", en:"work [obj.]" },
          { kr:"동시에", roman:"dong-si-e", en:"simultaneously" },
          { kr:"할", roman:"hal", en:"to do" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있게", roman:"it-ge", en:"to be able" },
          { kr:"되었다.", roman:"doe-eot-da.", en:"became." },
          { kr:"(㉢)", roman:"(geu-yeok-3)", en:"[position ㉢]" }
        ]},
        { tokens: [
          { kr:"또한", roman:"tto-han", en:"also" },
          { kr:"출발과", roman:"chul-bal-gwa", en:"departure and" },
          { kr:"도착", roman:"do-chak", en:"arrival" },
          { kr:"시간이", roman:"si-gan-i", en:"time [subj.]" },
          { kr:"일정해야", roman:"il-jeong-hae-ya", en:"must be fixed" },
          { kr:"하는", roman:"ha-neun", en:"which" },
          { kr:"기차나", roman:"gi-cha-na", en:"trains or" },
          { kr:"여객선", roman:"yeo-gaek-seon", en:"passenger ships" },
          { kr:"등의", roman:"deung-ui", en:"etc. of" },
          { kr:"대중교통", roman:"dae-jung-gyo-tong", en:"public transport" },
          { kr:"수단도", roman:"su-dan-do", en:"means too" },
          { kr:"크게", roman:"keu-ge", en:"greatly" },
          { kr:"발달하였다.", roman:"bal-dal-ha-yeot-da.", en:"developed." },
          { kr:"(㉣)", roman:"(geu-yeok-4)", en:"[position ㉣]" }
        ]},
        { tokens: [
          { kr:"오늘날", roman:"o-neul-nal", en:"today" },
          { kr:"톱니바퀴처럼", roman:"top-ni-ba-kwi-cheo-reom", en:"like cogwheels" },
          { kr:"돌아가는", roman:"dol-a-ga-neun", en:"turning" },
          { kr:"우리의", roman:"u-ri-ui", en:"our" },
          { kr:"일상이", roman:"il-sang-i", en:"daily life [subj.]" },
          { kr:"다", roman:"da", en:"all" },
          { kr:"시계의", roman:"si-gye-ui", en:"the clock's" },
          { kr:"지배를", roman:"ji-bae-reul", en:"control [obj.]" },
          { kr:"받고", roman:"bat-go", en:"under, and" },
          { kr:"있는", roman:"it-neun", en:"being" },
          { kr:"것이다.", roman:"geot-i-da.", en:"(it) is." }
        ]}
      ],
      passageNote: "Sentence-insertion: read the given sentence (shown first, marked [삽입할 문장]), then pick the position ㉠~㉣ where it fits best.",
      choices: [
        { num:1, kr:"㉠", roman:"geu-yeok il", en:"position ㉠", correct:false },
        { num:2, kr:"㉡", roman:"geu-yeok i", en:"position ㉡", correct:true },
        { num:3, kr:"㉢", roman:"geu-yeok sam", en:"position ㉢", correct:false },
        { num:4, kr:"㉣", roman:"geu-yeok sa", en:"position ㉣", correct:false }
      ],
      answer: 2,
      whyRight: `The given sentence is a hinge: "as precise time management became possible, groundbreaking changes began across society." It must follow the point that mechanical clocks made precise measurement possible (right before ㉡) and introduce the examples of change (workers' commutes, transport) that come after. So ② (㉡) fits.`,
      whyWrong: {
        "1": `At ㉠ only the long human effort to measure time has been stated — "precise control became possible" hasn't happened yet, so the given sentence is premature.`,
        "3": `At ㉢ the change examples have <b>already started</b> (workers commuting). The umbrella sentence introducing "changes began" should come before those examples, not in the middle.`,
        "4": `At ㉣ the examples are essentially finished; placing the "changes began to appear" sentence here is too late in the flow.`
      },
      vocab: [
        { kr:"관리", roman:"gwan-li", en:"management" },
        { kr:"통제", roman:"tong-je", en:"control, regulation" },
        { kr:"전반", roman:"jeon-ban", en:"the whole, overall" },
        { kr:"획기적", roman:"hoek-gi-jeok", en:"groundbreaking, epochal" },
        { kr:"측정하다", roman:"cheuk-jeong-ha-da", en:"to measure" },
        { kr:"해시계", roman:"hae-si-gye", en:"sundial" },
        { kr:"물시계", roman:"mul-si-gye", en:"water clock" },
        { kr:"기계식", roman:"gi-gye-sik", en:"mechanical (type)" },
        { kr:"출퇴근", roman:"chul-toe-geun", en:"commuting (to and from work)" },
        { kr:"대중교통", roman:"dae-jung-gyo-tong", en:"public transportation" },
        { kr:"지배", roman:"ji-bae", en:"rule, domination, control" }
      ],
      grammar: [
        {
          pattern: "-(으)면서 (as / while, simultaneous cause)",
          plainEnglish: `V-(으)면서 links two things happening together, often "as X happened, Y followed." 관리할 수 있게 되면서 변화가 나타났다 = "as it became manageable, changes appeared." This makes the given sentence a bridge between a cause (precise clocks) and effects (social changes).`,
          examples: [
            { kr:"기술이 발전하면서 생활이 편해졌다.", roman:"Gi-sul-i bal-jeon-ha-myeon-seo saeng-hwal-i pyeon-hae-jyeot-da.", en:"As technology advanced, life became more convenient." },
            { kr:"시간을 통제하면서 사회가 바뀌었다.", roman:"Si-gan-eul tong-je-ha-myeon-seo sa-hoe-ga ba-kkwi-eot-da.", en:"As time came to be controlled, society changed." }
          ],
          commonMistake: `A bridging sentence ("X became possible, so changes began") goes BEFORE the change examples, not after them. ㉡ sits right after the cause and right before the examples.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Why does the given sentence fit at ㉡?`,
          choices: ["It bridges the cause (precise clocks) and the change examples that follow", "It must conclude the passage", "It introduces sundials", "It restates the first sentence"],
          answer: 0,
          explain: `It follows 'mechanical clocks made precise time possible' and introduces the social changes (commutes, transport) listed next.`
        },
        {
          kind: "mcq",
          q: `-(으)면서 expresses…`,
          choices: ["'As / while' two things happen together", "A strong command", "A past regret", "A reported quote"],
          answer: 0,
          explain: `-(으)면서 links simultaneous actions/changes: as X, Y."`
        }
      ]
    },
    // ── Q41 · Sentence Insertion · The Age of the Sadaebu ──
    Q41: {
      num: 41,
      type: "sentence-insertion",
      section: "N",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[39~41] 주어진 문장이 들어갈 곳으로 가장 알맞은 것을 고르십시오. (각 2점)",
        en: "Choose the most appropriate place for the given sentence to be inserted. (2 points each)"
      },
      insertSentence: {
        kr: "오히려 사대부가 조선의 변화를 주도한 능력주의 원칙의 신봉자들이었음을 역사적 자료를 통해 증명한다.",
        roman: "o-hi-ryeo sa-dae-bu-ga jo-seon-ui byeon-hwa-reul ju-do-han neung-nyeok-ju-ui won-chik-ui sin-bong-ja-deul-i-eot-eum-eul yeok-sa-jeok ja-ryo-reul tong-hae jeung-myeong-han-da.",
        en: "Rather, it proves through historical materials that the sadaebu were believers in the principle of meritocracy who led Joseon's changes."
      },
      passageParas: [
        { tokens: [
          { kr:"[삽입할 문장]", roman:"sap-ip-hal mun-jang", en:"[Sentence to insert]:" },
          { kr:"오히려", roman:"o-hi-ryeo", en:"rather, on the contrary" },
          { kr:"사대부가", roman:"sa-dae-bu-ga", en:"the sadaebu [subj.]" },
          { kr:"조선의", roman:"jo-seon-ui", en:"Joseon's" },
          { kr:"변화를", roman:"byeon-hwa-reul", en:"change [obj.]" },
          { kr:"주도한", roman:"ju-do-han", en:"who led" },
          { kr:"능력주의", roman:"neung-nyeok-ju-ui", en:"meritocracy" },
          { kr:"원칙의", roman:"won-chik-ui", en:"principle's" },
          { kr:"신봉자들이었음을", roman:"sin-bong-ja-deul-i-eot-eum-eul", en:"were believers, that [obj.]" },
          { kr:"역사적", roman:"yeok-sa-jeok", en:"historical" },
          { kr:"자료를", roman:"ja-ryo-reul", en:"materials [obj.]" },
          { kr:"통해", roman:"tong-hae", en:"through" },
          { kr:"증명한다.", roman:"jeung-myeong-han-da.", en:"proves." }
        ]},
        { tokens: [
          { kr:"역사학자", roman:"yeok-sa-hak-ja", en:"historian" },
          { kr:"이승원이", roman:"i-seung-won-i", en:"Lee Seung-won [subj.]" },
          { kr:"『사대부의", roman:"sa-dae-bu-ui", en:"'The Sadaebu's" },
          { kr:"시대』라는", roman:"si-dae-ra-neun", en:"Age' titled" },
          { kr:"책을", roman:"chaek-eul", en:"book [obj.]" },
          { kr:"출간했다.", roman:"chul-gan-haet-da.", en:"published." },
          { kr:"(㉠)", roman:"(geu-yeok-1)", en:"[position ㉠]" }
        ]},
        { tokens: [
          { kr:"사대부는", roman:"sa-dae-bu-neun", en:"the sadaebu [topic]" },
          { kr:"국가", roman:"guk-ga", en:"state" },
          { kr:"운영에", roman:"un-yeong-e", en:"in governance" },
          { kr:"중요한", roman:"jung-yo-han", en:"important" },
          { kr:"역할을", roman:"yeok-hal-eul", en:"role [obj.]" },
          { kr:"했던", roman:"haet-deon", en:"that played" },
          { kr:"조선", roman:"jo-seon", en:"Joseon" },
          { kr:"시대의", roman:"si-dae-ui", en:"era's" },
          { kr:"양반", roman:"yang-ban", en:"yangban (noble)" },
          { kr:"계층을", roman:"gye-cheung-eul", en:"class [obj.]" },
          { kr:"말한다.", roman:"mal-han-da.", en:"refers to." },
          { kr:"(㉡)", roman:"(geu-yeok-2)", en:"[position ㉡]" }
        ]},
        { tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"책은", roman:"chaek-eun", en:"book [topic]" },
          { kr:"사대부", roman:"sa-dae-bu", en:"sadaebu" },
          { kr:"계층이", roman:"gye-cheung-i", en:"class [subj.]" },
          { kr:"조선의", roman:"jo-seon-ui", en:"Joseon's" },
          { kr:"정치·경제·문화에", roman:"jeong-chi gyeong-je mun-hwa-e", en:"on politics/economy/culture" },
          { kr:"미친", roman:"mi-chin", en:"that had" },
          { kr:"영향을", roman:"yeong-hyang-eul", en:"influence [obj.]" },
          { kr:"깊이", roman:"gip-i", en:"deeply" },
          { kr:"있게", roman:"it-ge", en:"(in depth)" },
          { kr:"분석하고", roman:"bun-seok-ha-go", en:"analyzes, and" },
          { kr:"있다.", roman:"it-da.", en:"is." },
          { kr:"(㉢)", roman:"(geu-yeok-3)", en:"[position ㉢]" }
        ]},
        { tokens: [
          { kr:"무엇보다도", roman:"mu-eot-bo-da-do", en:"above all" },
          { kr:"저자는", roman:"jeo-ja-neun", en:"the author [topic]" },
          { kr:"사대부가", roman:"sa-dae-bu-ga", en:"the sadaebu [subj.]" },
          { kr:"폐쇄적인", roman:"pye-swae-jeok-in", en:"closed" },
          { kr:"신분제", roman:"sin-bun-je", en:"status-system" },
          { kr:"사회에서", roman:"sa-hoe-e-seo", en:"in a society" },
          { kr:"특권만을", roman:"teuk-gwon-man-eul", en:"only privilege [obj.]" },
          { kr:"누리려", roman:"nu-ri-ryeo", en:"to enjoy" },
          { kr:"했다는", roman:"haet-da-neun", en:"sought, that" },
          { kr:"통념을", roman:"tong-nyeom-eul", en:"conventional belief [obj.]" },
          { kr:"비판한다.", roman:"bi-pan-han-da.", en:"criticizes." },
          { kr:"(㉣)", roman:"(geu-yeok-4)", en:"[position ㉣]" }
        ]},
        { tokens: [
          { kr:"이", roman:"i", en:"this" },
          { kr:"책을", roman:"chaek-eul", en:"book [obj.]" },
          { kr:"통해", roman:"tong-hae", en:"through" },
          { kr:"독자들은", roman:"dok-ja-deul-eun", en:"readers [topic]" },
          { kr:"사대부의", roman:"sa-dae-bu-ui", en:"the sadaebu's" },
          { kr:"다양한", roman:"da-yang-han", en:"various" },
          { kr:"면모를", roman:"myeon-mo-reul", en:"facets [obj.]" },
          { kr:"볼", roman:"bol", en:"to see" },
          { kr:"수", roman:"su", en:"(can)" },
          { kr:"있다.", roman:"it-da.", en:"can." }
        ]}
      ],
      passageNote: "Sentence-insertion: read the given sentence (shown first, marked [삽입할 문장]), then pick the position ㉠~㉣ where it fits best.",
      choices: [
        { num:1, kr:"㉠", roman:"geu-yeok il", en:"position ㉠", correct:false },
        { num:2, kr:"㉡", roman:"geu-yeok i", en:"position ㉡", correct:false },
        { num:3, kr:"㉢", roman:"geu-yeok sam", en:"position ㉢", correct:false },
        { num:4, kr:"㉣", roman:"geu-yeok sa", en:"position ㉣", correct:true }
      ],
      answer: 4,
      whyRight: `The given sentence begins with "오히려" (rather/on the contrary) and presents the author's counter-claim: the sadaebu actually led change as meritocrats. It must follow the statement of the <b>conventional belief being criticized</b> (that they only sought privilege), which sits right before ㉣. So ④ (㉣) — "rather, (the book) proves the opposite" — directly answers that criticism.`,
      whyWrong: {
        "1": `At ㉠ only the book's publication is stated. There's no "통념 (conventional belief)" yet for "오히려" to overturn.`,
        "2": `At ㉡ the text is just defining who the sadaebu were — no claim has been made for "rather" to contrast against.`,
        "3": `At ㉢ the book's general analysis is described, but the specific conventional belief (privilege-seeking) hasn't been raised yet, so the rebuttal is premature.`
      },
      vocab: [
        { kr:"오히려", roman:"o-hi-ryeo", en:"rather, on the contrary" },
        { kr:"사대부", roman:"sa-dae-bu", en:"scholar-official class of Joseon" },
        { kr:"주도하다", roman:"ju-do-ha-da", en:"to lead, to take the initiative" },
        { kr:"능력주의", roman:"neung-nyeok-ju-ui", en:"meritocracy" },
        { kr:"신봉자", roman:"sin-bong-ja", en:"devotee, believer" },
        { kr:"증명하다", roman:"jeung-myeong-ha-da", en:"to prove, to demonstrate" },
        { kr:"양반", roman:"yang-ban", en:"yangban, the noble class" },
        { kr:"계층", roman:"gye-cheung", en:"(social) class, stratum" },
        { kr:"통념", roman:"tong-nyeom", en:"conventional/common belief" },
        { kr:"비판하다", roman:"bi-pan-ha-da", en:"to criticize" },
        { kr:"면모", roman:"myeon-mo", en:"aspect, facet, side" }
      ],
      grammar: [
        {
          pattern: "오히려 (rather / on the contrary)",
          plainEnglish: `오히려 flags a reversal of expectation: "you'd think X, but rather the opposite." A sentence starting with 오히려 must follow the belief it overturns. Here, after stating people think sadaebu only sought privilege, "오히려 ... 증명한다" presents the opposite.`,
          examples: [
            { kr:"비쌀 줄 알았는데 오히려 쌌다.", roman:"Bi-ssal jul al-at-neun-de o-hi-ryeo ssat-da.", en:"I thought it'd be expensive, but it was rather cheap." },
            { kr:"혼나기는커녕 오히려 칭찬받았다.", roman:"Hon-na-gi-neun-keo-nyeong o-hi-ryeo ching-chan-bad-at-da.", en:"Far from being scolded, I was rather praised." }
          ],
          commonMistake: `Place an 오히려 sentence right AFTER the idea it contradicts (the 통념 at ㉣), never before that idea is introduced.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Why does the given sentence belong at ㉣?`,
          choices: ["'오히려' rebuts the conventional belief stated just before ㉣", "It must open the passage", "It defines the sadaebu", "It lists the book's chapters"],
          answer: 0,
          explain: `The sentence before ㉣ states the belief that sadaebu only sought privilege; '오히려 ... 증명한다' overturns it.`
        },
        {
          kind: "mcq",
          q: `오히려 means…`,
          choices: ["Rather / on the contrary", "Therefore", "For example", "In addition"],
          answer: 0,
          explain: `오히려 signals a reversal: contrary to expectation.`
        }
      ]
    },
    // ── Q42 · Feeling · narrative (passage withheld) ──
    Q42: {
      num: 42,
      type: "feeling-id",
      section: "O",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[42~43] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"《안내》", roman:"an-nae", en:"《Notice》" },
          { kr:"저작권", roman:"jeo-jak-gwon", en:"copyright" },
          { kr:"법령에", roman:"beom-nyeong-e", en:"by law" },
          { kr:"따라", roman:"tta-ra", en:"according to" },
          { kr:"지문은", roman:"ji-mun-eun", en:"the passage [topic]" },
          { kr:"공개하지", roman:"gong-gae-ha-ji", en:"disclose" },
          { kr:"않습니다.", roman:"an-seum-ni-da.", en:"is not." }
        ]}
      ],
      passageNote: "⚠️ Passage withheld in the source exam (copyright notice). The narrative (about a man '그', a marriage proposal, and a ring box) is not reproduced. Stem, choices, and answer key are transcribed from the exam.",
      choices: [
        { num:1, kr:"화나고 답답하다", roman:"hwa-na-go dap-dap-ha-da", en:"angry and frustrated", correct:false },
        { num:2, kr:"놀라고 당황스럽다", roman:"nol-la-go dang-hwang-seu-rop-da", en:"surprised and flustered", correct:true },
        { num:3, kr:"서럽고 짜증스럽다", roman:"seo-reop-go jja-jeung-seu-rop-da", en:"sorrowful and irritated", correct:false },
        { num:4, kr:"섭섭하고 허전하다", roman:"seop-seop-ha-go heo-jeon-ha-da", en:"disappointed and empty", correct:false }
      ],
      answer: 2,
      whyRight: `The official answer key marks ② 놀라고 당황스럽다 (surprised and flustered). In the underlined moment, 그 (he) reacts with surprise and fluster. (The passage is withheld in the source exam.)`,
      whyWrong: {
        "1": `화나고 답답하다 (angry and frustrated) is a harsher, more negative pairing than the surprise the key points to.`,
        "3": `서럽고 짜증스럽다 (sorrowful and irritated) mixes grief and annoyance — not the startled reaction.`,
        "4": `섭섭하고 허전하다 (disappointed and empty) is a wistful letdown, different from being flustered.`
      },
      vocab: [
        { kr:"화나다", roman:"hwa-na-da", en:"to get angry" },
        { kr:"답답하다", roman:"dap-dap-ha-da", en:"to feel stifled/frustrated" },
        { kr:"놀라다", roman:"nol-la-da", en:"to be surprised" },
        { kr:"당황스럽다", roman:"dang-hwang-seu-rop-da", en:"to be flustered/bewildered" },
        { kr:"서럽다", roman:"seo-reop-da", en:"to feel sorrowful/aggrieved" },
        { kr:"짜증스럽다", roman:"jja-jeung-seu-rop-da", en:"to be irritating/annoying" },
        { kr:"섭섭하다", roman:"seop-seop-ha-da", en:"to feel sad at parting, let down" },
        { kr:"허전하다", roman:"heo-jeon-ha-da", en:"to feel empty/forlorn" }
      ],
      grammar: [
        {
          pattern: "Paired emotion adjectives (A-고 B)",
          plainEnglish: `Feeling questions often give two-adjective pairs joined by -고 (and): 놀라고 당황스럽다 = "surprised and flustered." You must match BOTH adjectives to the moment, not just one.`,
          examples: [
            { kr:"갑작스러운 소식에 놀라고 당황스러웠다.", roman:"Gap-jak-seu-reo-un so-sik-e nol-la-go dang-hwang-seu-reo-wot-da.", en:"At the sudden news, (I) was surprised and flustered." },
            { kr:"시험에 떨어져서 서럽고 속상했다.", roman:"Si-heom-e tteol-eo-jyeo-seo seo-reop-go sok-sang-haet-da.", en:"Failing the exam, (I) felt aggrieved and upset." }
          ],
          commonMistake: `Both halves of the pair must fit. If only one adjective matches the scene, the option is wrong.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does 당황스럽다 mean?`,
          choices: ["To be flustered/bewildered", "To be sleepy", "To be proud", "To be grateful"],
          answer: 0,
          explain: `당황스럽다 = to feel flustered or thrown off, caught off guard.`
        },
        {
          kind: "mcq",
          q: `In a paired-adjective feeling question, you should…`,
          choices: ["Match both adjectives to the scene", "Match only the first one", "Pick the most negative pair", "Pick the longest option"],
          answer: 0,
          explain: `Both adjectives in the A-고 B pair must fit the described feeling.`
        }
      ]
    },
    // ── Q43 · Content/Inference · narrative (passage withheld) ──
    Q43: {
      num: 43,
      type: "content-match",
      section: "O",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[42~43] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"《안내》", roman:"an-nae", en:"《Notice》" },
          { kr:"저작권", roman:"jeo-jak-gwon", en:"copyright" },
          { kr:"법령에", roman:"beom-nyeong-e", en:"by law" },
          { kr:"따라", roman:"tta-ra", en:"according to" },
          { kr:"지문은", roman:"ji-mun-eun", en:"the passage [topic]" },
          { kr:"공개하지", roman:"gong-gae-ha-ji", en:"disclose" },
          { kr:"않습니다.", roman:"an-seum-ni-da.", en:"is not." }
        ]}
      ],
      passageNote: "⚠️ Passage withheld in the source exam (copyright notice). Narrative not reproduced. Stem, choices, and answer key transcribed from the exam.",
      choices: [
        { num:1, kr:"그는 반지함이 어디에 있는지 몰랐다.", roman:"geu-neun ban-ji-ham-i eo-di-e it-neun-ji mol-lat-da", en:"He didn't know where the ring box was.", correct:false },
        { num:2, kr:"그는 여자 앞에서 눈물을 자주 보였다.", roman:"geu-neun yeo-ja ap-e-seo nun-mul-eul ja-ju bo-yeot-da", en:"He often showed tears in front of the woman.", correct:false },
        { num:3, kr:"그는 청혼을 위해 주말여행을 계획했다.", roman:"geu-neun cheong-hon-eul wi-hae ju-mal-yeo-haeng-eul gye-hoek-haet-da", en:"He planned a weekend trip for the proposal.", correct:true },
        { num:4, kr:"그는 그녀와 함께 반지를 구매하러 갔다.", roman:"geu-neun geu-nyeo-wa ham-kke ban-ji-reul gu-mae-ha-reo gat-da", en:"He went with her to buy a ring.", correct:false }
      ],
      answer: 3,
      whyRight: `The official answer key marks ③: he planned a weekend trip for the marriage proposal (청혼을 위해 주말여행을 계획했다). (The passage is withheld in the source exam.)`,
      whyWrong: {
        "1": `"Didn't know where the ring box was" is not the matched detail per the key.`,
        "2": `"Often showed tears in front of the woman" is not supported by the key.`,
        "4": `"Went with her to buy a ring" is not the matched statement — the proposal was planned as a surprise trip.`
      },
      vocab: [
        { kr:"반지", roman:"ban-ji", en:"ring" },
        { kr:"반지함", roman:"ban-ji-ham", en:"ring box/case" },
        { kr:"청혼", roman:"cheong-hon", en:"marriage proposal" },
        { kr:"주말여행", roman:"ju-mal-yeo-haeng", en:"weekend trip" },
        { kr:"계획하다", roman:"gye-hoek-ha-da", en:"to plan" },
        { kr:"구매하다", roman:"gu-mae-ha-da", en:"to purchase" },
        { kr:"눈물", roman:"nun-mul", en:"tears" }
      ],
      grammar: [
        {
          pattern: "N을/를 위해 (for the sake of N)",
          plainEnglish: `N을/를 위해 = "for / for the sake of N." 청혼을 위해 주말여행을 계획했다 = "planned a weekend trip for the (marriage) proposal." It marks the purpose behind an action.`,
          examples: [
            { kr:"건강을 위해 운동해요.", roman:"Geon-gang-eul wi-hae un-dong-hae-yo.", en:"I exercise for my health." },
            { kr:"시험을 위해 공부했다.", roman:"Si-heom-eul wi-hae gong-bu-haet-da.", en:"I studied for the exam." }
          ],
          commonMistake: `For content/inference questions on a withheld passage, rely only on the stems and the official answer key — do not assume details the exam doesn't give.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What did 'he' do for the proposal (per the answer key)?`,
          choices: ["Planned a weekend trip", "Bought a ring with her", "Cried in front of her", "Lost the ring box"],
          answer: 0,
          explain: `The key supports ③: he planned a weekend trip for the marriage proposal.`
        },
        {
          kind: "mcq",
          q: `N을/를 위해 means…`,
          choices: ["For / for the sake of N", "Instead of N", "Despite N", "After N"],
          answer: 0,
          explain: `N을/를 위해 = for the sake of / in order to (achieve) N.`
        }
      ]
    },
    // ── Q44 · Blank · anatomy and Renaissance art ──
    Q44: {
      num: 44,
      type: "passage-blank",
      section: "P",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[44~45] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"르네상스", roman:"reu-ne-sang-seu", en:"Renaissance" },
          { kr:"시대에", roman:"si-dae-e", en:"in the era" },
          { kr:"꽃을", roman:"kkot-eul", en:"flower [obj.]" },
          { kr:"피운", roman:"pi-un", en:"that bloomed" },
          { kr:"해부학은", roman:"hae-bu-hak-eun", en:"anatomy [topic]" },
          { kr:"인체의", roman:"in-che-ui", en:"the body's" },
          { kr:"내부를", roman:"nae-bu-reul", en:"interior [obj.]" },
          { kr:"파악할", roman:"pa-ak-hal", en:"to grasp" },
          { kr:"수", roman:"su", en:"(able)" },
          { kr:"있게", roman:"it-ge", en:"to be able" },
          { kr:"해", roman:"hae", en:"making" },
          { kr:"의학", roman:"ui-hak", en:"medicine" },
          { kr:"분야에", roman:"bun-ya-e", en:"to the field" },
          { kr:"획기적인", roman:"hoek-gi-jeok-in", en:"groundbreaking" },
          { kr:"발전을", roman:"bal-jeon-eul", en:"progress [obj.]" },
          { kr:"가져왔다.", roman:"ga-jyeo-wat-da.", en:"brought." }
        ]},
        { tokens: [
          { kr:"동시에", roman:"dong-si-e", en:"at the same time" },
          { kr:"미술가들에게", roman:"mi-sul-ga-deul-e-ge", en:"to artists" },
          { kr:"인물의", roman:"in-mul-ui", en:"a figure's" },
          { kr:"움직임을", roman:"um-jik-im-eul", en:"movement [obj.]" },
          { kr:"좀", roman:"jom", en:"a bit" },
          { kr:"더", roman:"deo", en:"more" },
          { kr:"자연스럽게", roman:"ja-yeon-seu-reop-ge", en:"naturally" },
          { kr:"표현할", roman:"pyo-hyeon-hal", en:"to express" },
          { kr:"수", roman:"su", en:"(able)" },
          { kr:"있는", roman:"it-neun", en:"that can" },
          { kr:"길을", roman:"gil-eul", en:"a way [obj.]" },
          { kr:"열어", roman:"yeol-eo", en:"opened" },
          { kr:"주었다.", roman:"ju-eot-da.", en:"(for them)." }
        ]},
        { tokens: [
          { kr:"이후", roman:"i-hu", en:"afterward" },
          { kr:"미술가들은", roman:"mi-sul-ga-deul-eun", en:"artists [topic]" },
          { kr:"근육의", roman:"geun-yuk-ui", en:"muscles'" },
          { kr:"구조나", roman:"gu-jo-na", en:"structure or" },
          { kr:"움직임과", roman:"um-jik-im-gwa", en:"movement, and" },
          { kr:"관련된", roman:"gwan-ryeon-doen", en:"related" },
          { kr:"해부학적", roman:"hae-bu-hak-jeok", en:"anatomical" },
          { kr:"지식을", roman:"ji-sik-eul", en:"knowledge [obj.]" },
          { kr:"작품에", roman:"jak-pum-e", en:"to works" },
          { kr:"적용하여", roman:"jeok-yong-ha-yeo", en:"applying" },
          { kr:"인물들을", roman:"in-mul-deul-eul", en:"figures [obj.]" },
          { kr:"한층", roman:"han-cheung", en:"even" },
          { kr:"더", roman:"deo", en:"more" },
          { kr:"자연스럽게", roman:"ja-yeon-seu-reop-ge", en:"naturally" },
          { kr:"그려", roman:"geu-ryeo", en:"drawing" },
          { kr:"냈다.", roman:"naet-da.", en:"produced." }
        ]},
        { tokens: [
          { kr:"예를", roman:"ye-reul", en:"example [obj.]" },
          { kr:"들어", roman:"deul-eo", en:"for" },
          { kr:"이전의", roman:"i-jeon-ui", en:"earlier" },
          { kr:"그림에서는", roman:"geu-rim-e-seo-neun", en:"in paintings" },
          { kr:"( )", roman:"(blank)", en:"[BLANK]", isBlank:true },
          { kr:"알지", roman:"al-ji", en:"know" },
          { kr:"못해", roman:"mot-hae", en:"not being able to" },
          { kr:"사람의", roman:"sa-ram-ui", en:"a person's" },
          { kr:"발이", roman:"bal-i", en:"feet [subj.]" },
          { kr:"떠", roman:"tteo", en:"floating" },
          { kr:"있는", roman:"it-neun", en:"that are" },
          { kr:"것처럼", roman:"geot-cheo-reom", en:"as if" },
          { kr:"어색하게", roman:"eo-saek-ha-ge", en:"awkwardly" },
          { kr:"그렸다.", roman:"geu-ryeot-da.", en:"drew." }
        ]},
        { tokens: [
          { kr:"그러나", roman:"geu-reo-na", en:"but" },
          { kr:"해부학적", roman:"hae-bu-hak-jeok", en:"anatomical" },
          { kr:"지식이", roman:"ji-sik-i", en:"knowledge [subj.]" },
          { kr:"더해진", roman:"deo-hae-jin", en:"added" },
          { kr:"이후에는", roman:"i-hu-e-neun", en:"after, then" },
          { kr:"두", roman:"du", en:"two" },
          { kr:"발이", roman:"bal-i", en:"feet [subj.]" },
          { kr:"땅을", roman:"ttang-eul", en:"the ground [obj.]" },
          { kr:"딛고", roman:"dit-go", en:"planting, and" },
          { kr:"서", roman:"seo", en:"standing" },
          { kr:"있는", roman:"it-neun", en:"that are" },
          { kr:"모습을", roman:"mo-seup-eul", en:"figure [obj.]" },
          { kr:"현실감", roman:"hyeon-sil-gam", en:"realism" },
          { kr:"있게", roman:"it-ge", en:"with" },
          { kr:"그릴", roman:"geu-ril", en:"to draw" },
          { kr:"수", roman:"su", en:"(able)" },
          { kr:"있게", roman:"it-ge", en:"to be able" },
          { kr:"되었다.", roman:"doe-eot-da.", en:"became." }
        ]}
      ],
      choices: [
        { num:1, kr:"질병이 언제 발생하는지", roman:"jil-byeong-i eon-je bal-saeng-ha-neun-ji", en:"when disease occurs", correct:false },
        { num:2, kr:"근육이 어떻게 움직이는지", roman:"geun-yuk-i eo-tteo-ke um-jik-i-neun-ji", en:"how muscles move", correct:true },
        { num:3, kr:"인체의 구조가 왜 단순해지는지", roman:"in-che-ui gu-jo-ga wae dan-sun-hae-ji-neun-ji", en:"why the body's structure simplifies", correct:false },
        { num:4, kr:"해부학이 어떤 식으로 분류되는지", roman:"hae-bu-hak-i eo-tteon sik-eu-ro bun-nyu-doe-neun-ji", en:"how anatomy is classified", correct:false }
      ],
      answer: 2,
      whyRight: `The passage stresses that anatomy taught artists about <b>muscle structure and movement</b>, letting them draw figures naturally. Before that, not knowing "how muscles move" (근육이 어떻게 움직이는지) made feet look like they floated. The contrast (after anatomy, feet plant on the ground) confirms ②.`,
      whyWrong: {
        "1": `"When disease occurs" is a medical-timing idea unrelated to drawing a figure's posture. ① doesn't fit the art context.`,
        "3": `The body's structure doesn't "simplify"; anatomy revealed its complexity. ③ contradicts the passage.`,
        "4": `"How anatomy is classified" is about organizing the field, not about depicting movement. ④ misses the point about muscles.`
      },
      vocab: [
        { kr:"해부학", roman:"hae-bu-hak", en:"anatomy" },
        { kr:"인체", roman:"in-che", en:"the human body" },
        { kr:"파악하다", roman:"pa-ak-ha-da", en:"to grasp, to figure out" },
        { kr:"의학", roman:"ui-hak", en:"medicine (the discipline)" },
        { kr:"미술가", roman:"mi-sul-ga", en:"artist (visual)" },
        { kr:"근육", roman:"geun-yuk", en:"muscle" },
        { kr:"구조", roman:"gu-jo", en:"structure" },
        { kr:"적용하다", roman:"jeok-yong-ha-da", en:"to apply" },
        { kr:"어색하다", roman:"eo-saek-ha-da", en:"to be awkward/unnatural" },
        { kr:"현실감", roman:"hyeon-sil-gam", en:"sense of realism" },
        { kr:"딛다", roman:"dit-da", en:"to step on, to plant (a foot)" }
      ],
      grammar: [
        {
          pattern: "어떻게 V-는지 (알다/모르다)",
          plainEnglish: `-는지 turns a question into a noun clause: 어떻게 움직이는지 = "how (it) moves." With 알다/모르다 it means "to know/not know how ~." 근육이 어떻게 움직이는지 알지 못해 = "not knowing how muscles move."`,
          examples: [
            { kr:"이게 어떻게 작동하는지 몰라요.", roman:"I-ge eo-tteo-ke jak-dong-ha-neun-ji mol-la-yo.", en:"I don't know how this works." },
            { kr:"그가 왜 왔는지 알아요?", roman:"Geu-ga wae wat-neun-ji al-a-yo?", en:"Do you know why he came?" }
          ],
          commonMistake: `The blank pairs with 알지 못해 (not knowing) → the cause of awkward drawing. Only "how muscles move" explains floating feet vs. grounded feet.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What did earlier artists fail to know, causing awkward figures?`,
          choices: ["How muscles move", "When disease strikes", "How to classify anatomy", "Why bodies simplify"],
          answer: 0,
          explain: `Without knowing how muscles move, feet looked like they floated; anatomy fixed this.`
        },
        {
          kind: "mcq",
          q: `-는지 in '어떻게 움직이는지' does what?`,
          choices: ["Turns a question into a noun clause ('how it moves')", "Marks past tense", "Makes a command", "Adds politeness"],
          answer: 0,
          explain: `-는지 embeds an indirect question as a noun clause, often with 알다/모르다."`
        }
      ]
    },
    // ── Q45 · Topic · anatomy influenced art ──
    Q45: {
      num: 45,
      type: "main-topic",
      section: "P",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[44~45] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"르네상스", roman:"reu-ne-sang-seu", en:"Renaissance" },
          { kr:"해부학은", roman:"hae-bu-hak-eun", en:"anatomy [topic]" },
          { kr:"의학", roman:"ui-hak", en:"medicine" },
          { kr:"발전과", roman:"bal-jeon-gwa", en:"progress, and" },
          { kr:"함께", roman:"ham-kke", en:"together with" },
          { kr:"미술가들이", roman:"mi-sul-ga-deul-i", en:"artists [subj.]" },
          { kr:"인물을", roman:"in-mul-eul", en:"figures [obj.]" },
          { kr:"자연스럽게", roman:"ja-yeon-seu-reop-ge", en:"naturally" },
          { kr:"표현하도록", roman:"pyo-hyeon-ha-do-rok", en:"to express" },
          { kr:"도왔다.", roman:"do-wat-da.", en:"helped." }
        ]}
      ],
      passageNote: "Q45 shares the [44~45] anatomy passage (see Q44 for the full text). This paragraph is a one-line recap.",
      choices: [
        { num:1, kr:"해부학은 의학뿐만 아니라 미술에도 심대한 영향을 끼쳤다.", roman:"hae-bu-hak-eun ui-hak-ppun-man a-ni-ra mi-sul-e-do sim-dae-han yeong-hyang-eul kki-chyeot-da", en:"Anatomy had a profound influence not only on medicine but also on art.", correct:true },
        { num:2, kr:"미술가들은 해부학 강의를 통해 경제 활동을 할 수 있었다.", roman:"mi-sul-ga-deul-eun hae-bu-hak gang-ui-reul tong-hae gyeong-je hwal-dong-eul hal su it-eot-da", en:"Artists could earn a living through anatomy lectures.", correct:false },
        { num:3, kr:"해부학 강의는 일반인들의 그림에 대한 관점을 바꿔 놓았다.", roman:"hae-bu-hak gang-ui-neun il-ban-in-deul-ui geu-rim-e dae-han gwan-jeom-eul ba-kkwo no-at-da", en:"Anatomy lectures changed ordinary people's view of painting.", correct:false },
        { num:4, kr:"해부학의 발달로 미술에서 다룰 수 있는 소재가 다양해졌다.", roman:"hae-bu-hak-ui bal-dal-lo mi-sul-e-seo da-rul su it-neun so-jae-ga da-yang-hae-jyeot-da", en:"Anatomy's growth diversified the subjects art could handle.", correct:false }
      ],
      answer: 1,
      whyRight: `The passage shows anatomy brought "획기적인 발전" to <b>medicine</b> AND opened a way for <b>artists</b> to depict figures naturally. The topic spans both fields, so ① — a profound influence on medicine and art alike — is the main idea.`,
      whyWrong: {
        "2": `The text never says artists earned a living ("경제 활동") from anatomy lectures. ② invents an economic angle.`,
        "3": `It discusses how <b>artists</b> drew better, not how "ordinary people's" view of painting changed. ③ shifts the subject.`,
        "4": `The point is more <b>natural depiction</b> of the human figure, not a wider variety of subjects/소재. ④ misstates the benefit.`
      },
      vocab: [
        { kr:"해부학", roman:"hae-bu-hak", en:"anatomy" },
        { kr:"의학", roman:"ui-hak", en:"medicine" },
        { kr:"발전", roman:"bal-jeon", en:"development, progress" },
        { kr:"미술", roman:"mi-sul", en:"art (fine/visual)" },
        { kr:"영향을 끼치다", roman:"yeong-hyang-eul kki-chi-da", en:"to exert influence" },
        { kr:"심대하다", roman:"sim-dae-ha-da", en:"to be profound/significant" },
        { kr:"관점", roman:"gwan-jeom", en:"viewpoint, perspective" },
        { kr:"소재", roman:"so-jae", en:"subject matter, material" },
        { kr:"다양해지다", roman:"da-yang-hae-ji-da", en:"to become diverse" }
      ],
      grammar: [
        {
          pattern: "A뿐만 아니라 B에도 (not only A but also B)",
          plainEnglish: `A뿐만 아니라 B(에)도 = "not only A but also B." 의학뿐만 아니라 미술에도 = "not only on medicine but also on art." It signals that the topic covers two areas — perfect for a passage that links medicine and art.`,
          examples: [
            { kr:"한국어뿐만 아니라 영어도 잘해요.", roman:"Han-gug-eo-ppun-man a-ni-ra yeong-eo-do jal-hae-yo.", en:"(She) is good not only at Korean but also at English." },
            { kr:"이론뿐만 아니라 실습에도 강하다.", roman:"I-ron-ppun-man a-ni-ra sil-seup-e-do gang-ha-da.", en:"Strong not only in theory but also in practice." }
          ],
          commonMistake: `The topic must cover BOTH areas the passage develops (medicine + art). Options that mention only one field, or a side issue (income, subject variety), are too narrow.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the passage's main idea?`,
          choices: ["Anatomy profoundly influenced both medicine and art", "Artists got rich from anatomy lectures", "Ordinary people changed how they paint", "Art gained more subject variety"],
          answer: 0,
          explain: `Anatomy advanced medicine and let artists depict the human figure naturally — influence on both fields.`
        },
        {
          kind: "mcq",
          q: `A뿐만 아니라 B에도 means…`,
          choices: ["Not only A but also B", "Either A or B", "Neither A nor B", "A instead of B"],
          answer: 0,
          explain: `It expresses 'not only A but also B,' covering two things at once.`
        }
      ]
    },
    // ── Q46 · Author's Attitude · submarine cables ──
    Q46: {
      num: 46,
      type: "attitude",
      section: "Q",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[46~47] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"전", roman:"jeon", en:"whole" },
          { kr:"세계", roman:"se-gye", en:"world" },
          { kr:"바다", roman:"ba-da", en:"sea" },
          { kr:"밑에는", roman:"mit-e-neun", en:"beneath" },
          { kr:"400개가", roman:"sa-baek-gae-ga", en:"400 [subj.]" },
          { kr:"넘는", roman:"neom-neun", en:"over" },
          { kr:"해저", roman:"hae-jeo", en:"submarine (seabed)" },
          { kr:"전선이", roman:"jeon-seon-i", en:"cables [subj.]" },
          { kr:"설치돼", roman:"seol-chi-dwae", en:"installed" },
          { kr:"있다.", roman:"it-da.", en:"are." }
        ]},
        { tokens: [
          { kr:"나라", roman:"na-ra", en:"country" },
          { kr:"간", roman:"gan", en:"between" },
          { kr:"정보", roman:"jeong-bo", en:"information" },
          { kr:"통신의", roman:"tong-sin-ui", en:"communications'" },
          { kr:"99%가", roman:"gu-sip-gu-peo-sen-teu-ga", en:"99% [subj.]" },
          { kr:"이", roman:"i", en:"these" },
          { kr:"해저", roman:"hae-jeo", en:"submarine" },
          { kr:"전선을", roman:"jeon-seon-eul", en:"cables [obj.]" },
          { kr:"통해", roman:"tong-hae", en:"through" },
          { kr:"이루어진다.", roman:"i-ru-eo-jin-da.", en:"is carried out." }
        ]},
        { tokens: [
          { kr:"하지만", roman:"ha-ji-man", en:"but" },
          { kr:"한국은", roman:"han-guk-eun", en:"Korea [topic]" },
          { kr:"급증하는", roman:"geup-jeung-ha-neun", en:"surging" },
          { kr:"정보", roman:"jeong-bo", en:"information" },
          { kr:"전송량에", roman:"jeon-song-nyang-e", en:"transmission volume, compared to" },
          { kr:"비해", roman:"bi-hae", en:"relative to" },
          { kr:"해저", roman:"hae-jeo", en:"submarine" },
          { kr:"전선이", roman:"jeon-seon-i", en:"cables [subj.]" },
          { kr:"턱없이", roman:"teok-eop-si", en:"woefully" },
          { kr:"부족하다.", roman:"bu-jok-ha-da.", en:"are insufficient." }
        ]},
        { tokens: [
          { kr:"따라서", roman:"tta-ra-seo", en:"therefore" },
          { kr:"정부는", roman:"jeong-bu-neun", en:"the government [topic]" },
          { kr:"법적·경제적·외교적", roman:"beop-jeok gyeong-je-jeok oe-gyo-jeok", en:"legal/economic/diplomatic" },
          { kr:"제도를", roman:"je-do-reul", en:"systems [obj.]" },
          { kr:"정비하는", roman:"jeong-bi-ha-neun", en:"organizing" },
          { kr:"등", roman:"deung", en:"etc." },
          { kr:"해저", roman:"hae-jeo", en:"submarine" },
          { kr:"전선의", roman:"jeon-seon-ui", en:"cables'" },
          { kr:"수를", roman:"su-reul", en:"number [obj.]" },
          { kr:"늘리는", roman:"neul-li-neun", en:"increasing" },
          { kr:"적극적인", roman:"jeok-geuk-jeok-in", en:"active, proactive" },
          { kr:"방안을", roman:"bang-an-eul", en:"measures [obj.]" },
          { kr:"마련해야", roman:"ma-ryeon-hae-ya", en:"must prepare" },
          { kr:"한다.", roman:"han-da.", en:"(do)." }
        ]}
      ],
      passageNote: "Q46–Q47 share the [46~47] submarine-cable passage. Q47 continues with the same text.",
      choices: [
        { num:1, kr:"해저 전선의 구축으로 생길 부작용을 우려하고 있다.", roman:"hae-jeo jeon-seon-ui gu-chuk-eu-ro saeng-gil bu-jak-yong-eul u-ryeo-ha-go it-da", en:"Worried about side effects from building cables.", correct:false },
        { num:2, kr:"해저 전선의 문제점과 위험성에 대해 역설하고 있다.", roman:"hae-jeo jeon-seon-ui mun-je-jeom-gwa wi-heom-seong-e dae-hae yeok-seol-ha-go it-da", en:"Stressing the problems and dangers of cables.", correct:false },
        { num:3, kr:"해저 전선에 대한 국가적 차원의 대응을 촉구하고 있다.", roman:"hae-jeo jeon-seon-e dae-han guk-ga-jeok cha-won-ui dae-eung-eul chok-gu-ha-go it-da", en:"Urging a national-level response on submarine cables.", correct:true },
        { num:4, kr:"해저 전선이 세계정세에 미치는 영향을 부정하고 있다.", roman:"hae-jeo jeon-seon-i se-gye-jeong-se-e mi-chi-neun yeong-hyang-eul bu-jeong-ha-go it-da", en:"Denying cables' influence on world affairs.", correct:false }
      ],
      answer: 3,
      whyRight: `The writer says Korea has too few cables and concludes "따라서 정부는 ... 적극적인 방안을 마련해야 한다" (therefore the government must take active measures). That is <b>urging a national/government-level response</b> — ③.`,
      whyWrong: {
        "1": `The writer wants <b>more</b> cables and isn't worried about side effects of building them. ① reverses the stance.`,
        "2": `The tone is a call to action, not merely "stressing dangers." ② captures only a complaint, missing the urging.`,
        "4": `The writer affirms cables' huge importance (99% of international comms). ④ says the opposite (denying influence).`
      },
      vocab: [
        { kr:"해저", roman:"hae-jeo", en:"seabed, submarine (under the sea)" },
        { kr:"전선", roman:"jeon-seon", en:"(electric/communication) cable, line" },
        { kr:"설치되다", roman:"seol-chi-doe-da", en:"to be installed" },
        { kr:"통신", roman:"tong-sin", en:"communication(s)" },
        { kr:"급증하다", roman:"geup-jeung-ha-da", en:"to surge, to increase sharply" },
        { kr:"전송량", roman:"jeon-song-nyang", en:"transmission volume" },
        { kr:"턱없이", roman:"teok-eop-si", en:"woefully, absurdly (insufficient)" },
        { kr:"정비하다", roman:"jeong-bi-ha-da", en:"to put in order, to overhaul" },
        { kr:"적극적", roman:"jeok-geuk-jeok", en:"active, proactive" },
        { kr:"촉구하다", roman:"chok-gu-ha-da", en:"to urge, to call for" },
        { kr:"역설하다", roman:"yeok-seol-ha-da", en:"to emphasize, to stress" }
      ],
      grammar: [
        {
          pattern: "따라서 ... -아/어야 한다 (therefore ... must)",
          plainEnglish: `For 태도 (attitude) questions, the writer's stance is clearest in the conclusion. 따라서 (therefore) + -아/어야 한다 (must do) = a call to action. 정부는 ... 마련해야 한다 = "the government must prepare ~," i.e. the writer urges (촉구) it.`,
          examples: [
            { kr:"따라서 대책을 마련해야 한다.", roman:"Tta-ra-seo dae-chaek-eul ma-ryeon-hae-ya han-da.", en:"Therefore, measures must be prepared." },
            { kr:"정부가 나서야 한다.", roman:"Jeong-bu-ga na-seo-ya han-da.", en:"The government must step up." }
          ],
          commonMistake: `Match the verb of attitude: 촉구하다 (urge) for a call to action, 우려하다 (worry), 역설하다 (stress), 부정하다 (deny). The "must prepare" conclusion = 촉구 (urging).`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the writer's attitude?`,
          choices: ["Urging a national/government response to add cables", "Worried about cable side effects", "Denying cables matter", "Neutral and uninterested"],
          answer: 0,
          explain: `The conclusion 'the government must take active measures' is a call to action = 촉구 (urging).`
        },
        {
          kind: "mcq",
          q: `촉구하다 means…`,
          choices: ["To urge / call for", "To deny", "To doubt", "To apologize"],
          answer: 0,
          explain: `촉구하다 = to urge or press for action.`
        }
      ]
    },
    // ── Q47 · Content Match · submarine cables ──
    Q47: {
      num: 47,
      type: "content-match",
      section: "Q",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[46~47] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"서해안은", roman:"seo-hae-an-eun", en:"the West Coast [topic]" },
          { kr:"수심이", roman:"su-sim-i", en:"water depth [subj.]" },
          { kr:"얕아", roman:"yat-a", en:"is shallow, so" },
          { kr:"설치가", roman:"seol-chi-ga", en:"installation [subj.]" },
          { kr:"까다롭고", roman:"kka-da-rop-go", en:"is tricky, and" },
          { kr:"어민들의", roman:"eo-min-deul-ui", en:"fishermen's" },
          { kr:"반대도", roman:"ban-dae-do", en:"opposition too" },
          { kr:"극심하다.", roman:"geuk-sim-ha-da.", en:"is severe." }
        ]}
      ],
      passageNote: "Q47 shares the [46~47] submarine-cable passage (see Q46 for the opening). This paragraph adds the West-Coast detail; full passage also notes installation needs advanced tech, capital and neighboring-country cooperation.",
      choices: [
        { num:1, kr:"한국은 현재 충분한 수의 해저 전선을 보유하고 있다.", roman:"han-guk-eun hyeon-jae chung-bun-han su-ui hae-jeo jeon-seon-eul bo-yu-ha-go it-da", en:"Korea currently has a sufficient number of cables.", correct:false },
        { num:2, kr:"해저 전선을 통해 전송되는 국가 간 정보의 양이 매우 많다.", roman:"hae-jeo jeon-seon-eul tong-hae jeon-song-doe-neun guk-ga gan jeong-bo-ui yang-i mae-u man-ta", en:"The amount of inter-country information sent via cables is very large.", correct:true },
        { num:3, kr:"어민들은 인근 어장에 해저 전선을 설치하는 것을 환영한다.", roman:"eo-min-deul-eun in-geun eo-jang-e hae-jeo jeon-seon-eul seol-chi-ha-neun geot-eul hwan-yeong-han-da", en:"Fishermen welcome installing cables near their fishing grounds.", correct:false },
        { num:4, kr:"해저 전선은 지형에 구애받지 않고 자유롭게 설치할 수 있다.", roman:"hae-jeo jeon-seon-eun ji-hyeong-e gu-ae-bat-ji an-go ja-yu-rop-ge seol-chi-hal su it-da", en:"Cables can be installed freely regardless of terrain.", correct:false }
      ],
      answer: 2,
      whyRight: `The passage states 99% of inter-country communications go through these cables, so the volume of information they carry is enormous. ② matches this directly.`,
      whyWrong: {
        "1": `Korea has "턱없이 부족하다" (woefully too few) cables. ① says "sufficient" — the opposite.`,
        "3": `Fishermen's opposition is "극심하다" (severe); they do NOT welcome installation. ③ reverses it.`,
        "4": `Shallow West-Coast water makes installation "까다롭고" (tricky) — terrain very much matters. ④ contradicts the text.`
      },
      vocab: [
        { kr:"보유하다", roman:"bo-yu-ha-da", en:"to possess, to hold" },
        { kr:"전송되다", roman:"jeon-song-doe-da", en:"to be transmitted" },
        { kr:"국가 간", roman:"guk-ga gan", en:"between countries, international" },
        { kr:"양", roman:"yang", en:"amount, quantity" },
        { kr:"어민", roman:"eo-min", en:"fisherman, fishing folk" },
        { kr:"어장", roman:"eo-jang", en:"fishing ground" },
        { kr:"환영하다", roman:"hwan-yeong-ha-da", en:"to welcome" },
        { kr:"지형", roman:"ji-hyeong", en:"terrain, topography" },
        { kr:"구애받다", roman:"gu-ae-bat-da", en:"to be constrained/bound (by)" },
        { kr:"수심", roman:"su-sim", en:"water depth" },
        { kr:"까다롭다", roman:"kka-da-rop-da", en:"to be tricky, finicky, demanding" }
      ],
      grammar: [
        {
          pattern: "N에 구애받지 않고 (without being bound by N)",
          plainEnglish: `N에 구애받다 = "to be constrained by N"; with 않고 = "without being bound by N." 지형에 구애받지 않고 = "regardless of terrain." Useful for "free from constraints" claims — which you then check against the text.`,
          examples: [
            { kr:"형식에 구애받지 않고 자유롭게 쓰세요.", roman:"Hyeong-sik-e gu-ae-bat-ji an-go ja-yu-rop-ge sseu-se-yo.", en:"Write freely, without being bound by format." },
            { kr:"날씨에 구애받지 않는다.", roman:"Nal-ssi-e gu-ae-bat-ji an-neun-da.", en:"It is not affected by the weather." }
          ],
          commonMistake: `Content-match traps flip facts: Korea has too FEW cables (not enough), fishermen OPPOSE (not welcome), terrain DOES matter. Verify each option against the exact wording.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Which statement matches the passage?`,
          choices: ["A very large amount of international information travels via these cables", "Korea has plenty of cables", "Fishermen welcome the cables", "Terrain doesn't affect installation"],
          answer: 0,
          explain: `99% of inter-country communications go through the cables, so the data volume is huge.`
        },
        {
          kind: "mcq",
          q: `Why is installation hard on the West Coast?`,
          choices: ["Shallow water and strong fishermen opposition", "Too much government funding", "No demand for data", "The cables are too short"],
          answer: 0,
          explain: `수심이 얕아 설치가 까다롭고 (shallow → tricky) and 어민들의 반대 (fishermen oppose) make it hard.`
        }
      ]
    },
    // ── Q48 · Author's Purpose · retirement-pay reform ──
    Q48: {
      num: 48,
      type: "purpose",
      section: "R",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[48~50] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"퇴직", roman:"toe-jik", en:"retirement" },
          { kr:"급여", roman:"geup-yeo", en:"benefit/pay" },
          { kr:"제도", roman:"je-do", en:"system" },
          { kr:"도입", roman:"do-ip", en:"introduction" },
          { kr:"후", roman:"hu", en:"after" },
          { kr:"20년", roman:"i-sip-nyeon", en:"20 years" },
          { kr:"만에", roman:"man-e", en:"after (only)" },
          { kr:"개편안이", roman:"gae-pyeon-an-i", en:"a reform proposal [subj.]" },
          { kr:"마련되고", roman:"ma-ryeon-doe-go", en:"is prepared, and" },
          { kr:"있다.", roman:"it-da.", en:"is." }
        ]},
        { tokens: [
          { kr:"그", roman:"geu", en:"its" },
          { kr:"배경에는", roman:"bae-gyeong-e-neun", en:"in the background" },
          { kr:"퇴직금", roman:"toe-jik-geum", en:"severance pay" },
          { kr:"체불", roman:"che-bul", en:"non-payment, arrears" },
          { kr:"문제가", roman:"mun-je-ga", en:"problem [subj.]" },
          { kr:"있다.", roman:"it-da.", en:"there is." }
        ]},
        { tokens: [
          { kr:"회사가", roman:"hoe-sa-ga", en:"companies [subj.]" },
          { kr:"퇴직금을", roman:"toe-jik-geum-eul", en:"severance [obj.]" },
          { kr:"사외", roman:"sa-oe", en:"external" },
          { kr:"기관에", roman:"gi-gwan-e", en:"to institutions" },
          { kr:"맡기지", roman:"mat-gi-ji", en:"entrust" },
          { kr:"않고", roman:"an-go", en:"not, and" },
          { kr:"자체", roman:"ja-che", en:"self" },
          { kr:"관리하다", roman:"gwan-li-ha-da", en:"manage" },
          { kr:"보니", roman:"bo-ni", en:"as they did" },
          { kr:"체불이", roman:"che-bul-i", en:"non-payment [subj.]" },
          { kr:"빈번히", roman:"bin-beon-hi", en:"frequently" },
          { kr:"발생해", roman:"bal-saeng-hae", en:"occurred" },
          { kr:"왔다.", roman:"wat-da.", en:"has." }
        ]},
        { tokens: [
          { kr:"이번", roman:"i-beon", en:"this" },
          { kr:"개편안은", roman:"gae-pyeon-an-eun", en:"reform proposal [topic]" },
          { kr:"외부", roman:"oe-bu", en:"external" },
          { kr:"기관에", roman:"gi-gwan-e", en:"to institutions" },
          { kr:"맡기는", roman:"mat-gi-neun", en:"entrusting" },
          { kr:"것을", roman:"geot-eul", en:"(this) [obj.]" },
          { kr:"의무화하고,", roman:"ui-mu-hwa-ha-go", en:"makes mandatory, and" },
          { kr:"수령", roman:"su-ryeong", en:"receipt" },
          { kr:"시기를", roman:"si-gi-reul", en:"timing [obj.]" },
          { kr:"55세로", roman:"o-sip-o-se-ro", en:"to age 55" },
          { kr:"정한다.", roman:"jeong-han-da.", en:"sets." }
        ]},
        { tokens: [
          { kr:"그러나", roman:"geu-reo-na", en:"however" },
          { kr:"매달", roman:"mae-dal", en:"monthly" },
          { kr:"납입", roman:"nap-ip", en:"payment-in" },
          { kr:"조항은", roman:"jo-hang-eun", en:"clause [topic]" },
          { kr:"영세", roman:"yeong-se", en:"small/petty" },
          { kr:"사업장에", roman:"sa-eop-jang-e", en:"to businesses" },
          { kr:"부담이", roman:"bu-dam-i", en:"a burden [subj.]" },
          { kr:"되고,", roman:"doe-go", en:"becomes, and" },
          { kr:"조기", roman:"jo-gi", en:"early" },
          { kr:"수령", roman:"su-ryeong", en:"receipt" },
          { kr:"제한은", roman:"je-han-eun", en:"restriction [topic]" },
          { kr:"선택권을", roman:"seon-taek-gwon-eul", en:"the right to choose [obj.]" },
          { kr:"침해한다는", roman:"chim-hae-han-da-neun", en:"infringes, that" },
          { kr:"반론도", roman:"ban-ron-do", en:"counterargument too" },
          { kr:"있다.", roman:"it-da.", en:"exists." }
        ]}
      ],
      passageNote: "Q48–Q50 share the [48~50] retirement-pay reform passage. Q49 and Q50 continue with the same text.",
      choices: [
        { num:1, kr:"제도 개편의 긍정적인 사례를 제시하려고", roman:"je-do gae-pyeon-ui geung-jeong-jeok-in sa-rye-reul je-si-ha-ryeo-go", en:"To present positive cases of the reform", correct:false },
        { num:2, kr:"제도 적용의 범위를 제한하도록 요구하려고", roman:"je-do jeok-yong-ui beom-wi-reul je-han-ha-do-rok yo-gu-ha-ryeo-go", en:"To demand limiting the system's scope", correct:false },
        { num:3, kr:"제도 도입을 위해 근로자의 관심을 유도하려고", roman:"je-do do-ip-eul wi-hae geun-ro-ja-ui gwan-sim-eul yu-do-ha-ryeo-go", en:"To draw workers' interest in introducing it", correct:false },
        { num:4, kr:"제도 개편의 취지와 예상되는 문제점을 알리려고", roman:"je-do gae-pyeon-ui chwi-ji-wa ye-sang-doe-neun mun-je-jeom-eul al-li-ryeo-go", en:"To explain the reform's intent and the anticipated problems", correct:true }
      ],
      answer: 4,
      whyRight: `The passage explains <b>why</b> the reform exists (the severance non-payment problem, retirement-income concern) AND lays out its <b>expected problems</b> (burden on small businesses, infringing workers' choice). That balanced "intent + anticipated problems" is exactly ④.`,
      whyWrong: {
        "1": `It does NOT present "positive cases"; it gives background and drawbacks. ① is one-sided and wrong.`,
        "2": `It never "demands limiting the scope" — it neutrally informs. ② misstates the purpose.`,
        "3": `The aim isn't to "drum up workers' interest in introducing" the system; it explains and evaluates a reform. ③ is off.`
      },
      vocab: [
        { kr:"퇴직금", roman:"toe-jik-geum", en:"severance/retirement pay" },
        { kr:"제도", roman:"je-do", en:"system, institution" },
        { kr:"개편안", roman:"gae-pyeon-an", en:"reform/reorganization proposal" },
        { kr:"체불", roman:"che-bul", en:"non-payment, payment in arrears" },
        { kr:"맡기다", roman:"mat-gi-da", en:"to entrust, to leave (to)" },
        { kr:"의무화하다", roman:"ui-mu-hwa-ha-da", en:"to make mandatory" },
        { kr:"수령", roman:"su-ryeong", en:"receipt, receiving" },
        { kr:"영세 사업장", roman:"yeong-se sa-eop-jang", en:"small/micro business" },
        { kr:"부담", roman:"bu-dam", en:"burden" },
        { kr:"선택권", roman:"seon-taek-gwon", en:"right to choose" },
        { kr:"침해하다", roman:"chim-hae-ha-da", en:"to infringe, to violate" },
        { kr:"반론", roman:"ban-ron", en:"counterargument, rebuttal" }
      ],
      grammar: [
        {
          pattern: "취지 (intent) + 문제점 (problems) = balanced informing",
          plainEnglish: `For 목적 (purpose) questions, see whether the writer informs neutrally or argues one side. Here both the 취지 (intent/background) and the 예상되는 문제점 (expected problems) are laid out → the purpose is to INFORM about both, = ④.`,
          examples: [
            { kr:"이 글은 정책의 취지와 문제점을 함께 설명한다.", roman:"I geul-eun jeong-chaek-ui chwi-ji-wa mun-je-jeom-eul ham-kke seol-myeong-han-da.", en:"This text explains both the policy's intent and its problems." },
            { kr:"장단점을 알리려고 쓴 글이다.", roman:"Jang-dan-jeom-eul al-li-ryeo-go sseun geul-i-da.", en:"It's written to inform of the pros and cons." }
          ],
          commonMistake: `If a passage gives BOTH sides (intent + drawbacks), the purpose is to inform/explain — not to advocate, demand, or promote.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What is the writer's purpose?`,
          choices: ["To explain the reform's intent and its expected problems", "To praise the reform", "To demand a smaller scope", "To recruit workers' support"],
          answer: 0,
          explain: `The text gives the background/intent and the anticipated drawbacks — balanced informing (④).`
        },
        {
          kind: "mcq",
          q: `체불 means…`,
          choices: ["Non-payment / overdue payment", "Bonus", "Promotion", "Resignation"],
          answer: 0,
          explain: `체불 = failure to pay on time (e.g., 퇴직금 체불 = unpaid severance).`
        }
      ]
    },
    // ── Q49 · Blank · retirement-pay reform ──
    Q49: {
      num: 49,
      type: "passage-blank",
      section: "R",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[48~50] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"이번", roman:"i-beon", en:"this" },
          { kr:"개편안은", roman:"gae-pyeon-an-eun", en:"reform proposal [topic]" },
          { kr:"퇴직금을", roman:"toe-jik-geum-eul", en:"severance [obj.]" },
          { kr:"매달", roman:"mae-dal", en:"every month" },
          { kr:"외부", roman:"oe-bu", en:"external" },
          { kr:"기관에", roman:"gi-gwan-e", en:"to an institution" },
          { kr:"맡기는", roman:"mat-gi-neun", en:"entrusting" },
          { kr:"것을", roman:"geot-eul", en:"(this) [obj.]" },
          { kr:"의무화해", roman:"ui-mu-hwa-hae", en:"making mandatory" },
          { kr:"( )", roman:"(blank)", en:"[BLANK]", isBlank:true },
          { kr:"줄이고", roman:"jul-i-go", en:"reduces, and" },
          { kr:"수령", roman:"su-ryeong", en:"receipt" },
          { kr:"시기를", roman:"si-gi-reul", en:"timing [obj.]" },
          { kr:"55세로", roman:"o-sip-o-se-ro", en:"to age 55" },
          { kr:"정해", roman:"jeong-hae", en:"setting" },
          { kr:"노인", roman:"no-in", en:"elderly" },
          { kr:"빈곤", roman:"bin-gon", en:"poverty" },
          { kr:"문제", roman:"mun-je", en:"problem" },
          { kr:"해결을", roman:"hae-gyeol-eul", en:"solving [obj.]" },
          { kr:"꾀한다.", roman:"kkoe-han-da.", en:"seeks." }
        ]}
      ],
      passageNote: "Q49 shares the [48~50] retirement-pay passage (see Q48 for the background). Key prior fact: the reform's whole point is to fix frequent 퇴직금 체불 (unpaid severance).",
      choices: [
        { num:1, kr:"경쟁 업체의 수를", roman:"gyeong-jaeng eop-che-ui su-reul", en:"the number of competing companies", correct:false },
        { num:2, kr:"퇴직금의 수령액을", roman:"toe-jik-geum-ui su-ryeong-aek-eul", en:"the amount of severance received", correct:false },
        { num:3, kr:"노령 근로자의 비중을", roman:"no-ryeong geun-ro-ja-ui bi-jung-eul", en:"the proportion of elderly workers", correct:false },
        { num:4, kr:"퇴직금 체불의 위험성을", roman:"toe-jik-geum che-bul-ui wi-heom-seong-eul", en:"the risk of unpaid severance", correct:true }
      ],
      answer: 4,
      whyRight: `The reform's stated background is frequent severance <b>non-payment</b> (체불) because companies self-managed the funds. Making it mandatory to entrust funds to an external institution every month therefore "줄이고 (reduces)" exactly <b>the risk of unpaid severance</b> — ④.`,
      whyWrong: {
        "1": `"Number of competing companies" has nothing to do with entrusting severance funds. ① is irrelevant.`,
        "2": `It doesn't reduce the <b>amount</b> received; the amount is separate from where funds are kept. ② misreads the goal.`,
        "3": `"Proportion of elderly workers" isn't something entrusting funds would reduce. ③ doesn't fit the cause-effect.`
      },
      vocab: [
        { kr:"의무화하다", roman:"ui-mu-hwa-ha-da", en:"to make compulsory" },
        { kr:"외부 기관", roman:"oe-bu gi-gwan", en:"external institution" },
        { kr:"수령액", roman:"su-ryeong-aek", en:"amount received" },
        { kr:"노령", roman:"no-ryeong", en:"old age" },
        { kr:"비중", roman:"bi-jung", en:"proportion, weight" },
        { kr:"위험성", roman:"wi-heom-seong", en:"riskiness, danger" },
        { kr:"빈곤", roman:"bin-gon", en:"poverty" },
        { kr:"꾀하다", roman:"kkoe-ha-da", en:"to seek, to attempt (to achieve)" },
        { kr:"경쟁 업체", roman:"gyeong-jaeng eop-che", en:"competitor (company)" }
      ],
      grammar: [
        {
          pattern: "Cause→remedy logic for blanks",
          plainEnglish: `When a measure is introduced "to reduce ( )," the blank is the very PROBLEM that motivated the measure. The stated problem is 체불 (non-payment); entrusting funds externally reduces 체불의 위험성 (the risk of non-payment). Match the blank to the named problem.`,
          examples: [
            { kr:"사고 위험성을 줄이기 위해 규칙을 만들었다.", roman:"Sa-go wi-heom-seong-eul jul-i-gi wi-hae gyu-chik-eul man-deul-eot-da.", en:"They made rules to reduce the risk of accidents." },
            { kr:"체불을 막고자 외부에 맡긴다.", roman:"Che-bul-eul mak-go-ja oe-bu-e mat-gin-da.", en:"To prevent non-payment, (funds) are entrusted externally." }
          ],
          commonMistake: `Trace back to the problem the passage opened with (체불). The blank that a measure "reduces" should name that exact problem — choice ④.`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `What does entrusting funds to an external institution reduce?`,
          choices: ["The risk of unpaid severance (체불)", "The number of competitors", "The amount of severance", "The proportion of elderly workers"],
          answer: 0,
          explain: `The reform targets the 체불 problem, so external custody reduces the risk of non-payment.`
        },
        {
          kind: "mcq",
          q: `꾀하다 means…`,
          choices: ["To seek / attempt to achieve", "To refuse", "To postpone", "To forget"],
          answer: 0,
          explain: `꾀하다 = to seek or attempt to bring about (a goal).`
        }
      ]
    },
    // ── Q50 · Content Match · retirement-pay reform ──
    Q50: {
      num: 50,
      type: "content-match",
      section: "R",
      passageType: "multi-para",
      groupInstruction: {
        kr: "[48~50] 다음을 읽고 물음에 답하십시오. (각 2점)",
        en: "Read the following and answer the questions. (2 points each)"
      },
      passageParas: [
        { tokens: [
          { kr:"이번", roman:"i-beon", en:"this" },
          { kr:"개편안은", roman:"gae-pyeon-an-eun", en:"reform [topic]" },
          { kr:"퇴직금을", roman:"toe-jik-geum-eul", en:"severance [obj.]" },
          { kr:"외부", roman:"oe-bu", en:"external" },
          { kr:"기관에", roman:"gi-gwan-e", en:"to an institution" },
          { kr:"맡기게", roman:"mat-gi-ge", en:"to entrust" },
          { kr:"하는", roman:"ha-neun", en:"that makes" },
          { kr:"안을", roman:"an-eul", en:"a plan [obj.]" },
          { kr:"포함한다.", roman:"po-ham-han-da.", en:"includes." }
        ]}
      ],
      passageNote: "Q50 shares the [48~50] retirement-pay passage (see Q48). Recap facts: system introduced 20 years ago; current rule allows immediate receipt; proposal sets receipt at 55 and adds a burden to small businesses.",
      choices: [
        { num:1, kr:"퇴직 급여 제도가 도입된 것은 최근의 일이다.", roman:"toe-jik geup-yeo je-do-ga do-ip-doen geot-eun choe-geun-ui il-i-da", en:"The retirement-benefit system was introduced recently.", correct:false },
        { num:2, kr:"현행 제도에서는 55세가 돼야 퇴직금을 수령할 수 있다.", roman:"hyeon-haeng je-do-e-seo-neun o-sip-o-se-ga dwae-ya toe-jik-geum-eul su-ryeong-hal su it-da", en:"Under the current system, you can only receive severance at 55.", correct:false },
        { num:3, kr:"이번 개편안은 퇴직금을 외부 기관에 맡기게 하는 안을 포함한다.", roman:"i-beon gae-pyeon-an-eun toe-jik-geum-eul oe-bu gi-gwan-e mat-gi-ge ha-neun an-eul po-ham-han-da", en:"The reform includes a plan to entrust severance to an external institution.", correct:true },
        { num:4, kr:"이번 개편안이 시행되면 영세 사업장의 부담을 덜어 줄 수 있게 된다.", roman:"i-beon gae-pyeon-an-i si-haeng-doe-myeon yeong-se sa-eop-jang-ui bu-dam-eul deol-eo jul su it-ge doen-da", en:"If implemented, the reform will ease the burden on small businesses.", correct:false }
      ],
      answer: 3,
      whyRight: `The proposal explicitly makes it mandatory to entrust severance funds to an external institution every month. ③ states exactly this — the reform includes that external-custody plan.`,
      whyWrong: {
        "1": `The system was introduced <b>20 years ago</b> (도입 후 20년), not recently. ① is wrong on timing.`,
        "2": `Receiving only at 55 is the <b>proposed</b> rule; the <b>current</b> system allows immediate receipt. ② confuses current vs. proposed.`,
        "4": `The reform <b>adds</b> a monthly-payment burden on small businesses — it does not ease it. ④ reverses the effect.`
      },
      vocab: [
        { kr:"도입되다", roman:"do-ip-doe-da", en:"to be introduced/adopted" },
        { kr:"현행", roman:"hyeon-haeng", en:"current, in force" },
        { kr:"수령하다", roman:"su-ryeong-ha-da", en:"to receive (money/benefits)" },
        { kr:"포함하다", roman:"po-ham-ha-da", en:"to include" },
        { kr:"시행되다", roman:"si-haeng-doe-da", en:"to be implemented/enforced" },
        { kr:"덜다", roman:"deol-da", en:"to lessen, to relieve" },
        { kr:"부담", roman:"bu-dam", en:"burden" },
        { kr:"안", roman:"an", en:"plan, proposal, draft" }
      ],
      grammar: [
        {
          pattern: "현행 (current) vs. 개편안 (proposed) — time/scope traps",
          plainEnglish: `Content-match options love to swap 현행 (current system) with the 개편안 (proposed reform). Age-55 receipt is part of the PROPOSAL, not the current rule. Always check whether a statement describes now or the future plan.`,
          examples: [
            { kr:"현행 제도에서는 바로 받을 수 있다.", roman:"Hyeon-haeng je-do-e-seo-neun ba-ro bad-eul su it-da.", en:"Under the current system, you can receive it immediately." },
            { kr:"개편안에서는 55세로 정한다.", roman:"Gae-pyeon-an-e-seo-neun o-sip-o-se-ro jeong-han-da.", en:"Under the reform, it is set at age 55." }
          ],
          commonMistake: `Distinguish 현행 (current) from the 개편안 (proposal), and watch direction words: the reform ADDS a burden (부담이 된다), it doesn't relieve it (덜어 주다).`
        }
      ],
      quiz: [
        {
          kind: "mcq",
          q: `Which statement matches the passage?`,
          choices: ["The reform includes entrusting severance to an external institution", "The system was introduced recently", "The current rule pays severance only at 55", "The reform eases small-business burden"],
          answer: 0,
          explain: `Mandatory external custody of severance funds is a core part of the proposal (③).`
        },
        {
          kind: "mcq",
          q: `When was the retirement-benefit system introduced?`,
          choices: ["About 20 years ago", "This year", "55 years ago", "It hasn't been introduced yet"],
          answer: 0,
          explain: `The passage opens with 도입 후 20년 만에 — 20 years after its introduction.`
        }
      ]
    },
  } // end lessons
}; // end window.TOPIK2
