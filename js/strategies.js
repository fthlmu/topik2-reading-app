// js/strategies.js — per-section reading strategies for TOPIK II 읽기 (102회 structure)
// AI-authored (C) content for the korean-learning project; verify against your own practice.
// Cards follow the ACTUAL 102nd-exam question per group (lessons.js groupInstruction + choices),
// not the older section labels: M = main topic, N = sentence insertion, O = novel, P = blank + topic.
window.STRATEGIES = {
  A: {
    id: 'A',
    title: '빈칸에 알맞은 말',
    titleEn: 'Fill the blank (grammar)',
    paceSec: 40,
    steps: [
      'Read the whole sentence first and find the time, reason, or condition clue around the blank.',
      'Match that clue to an ending: "one year has passed" after the blank calls for -(으)ㄴ 지.',
      'Plug each choice in and reread; keep the only one that makes a complete, natural sentence.'
    ],
    signals: ['-(으)ㄴ 지', '-아/어 가다', '점점', '-다가', '-거나', '-(으)ㄹ 때'],
    trap: 'Picking an ending that just looks familiar without checking the clue word (like 점점 or 일 년이 됐다) that decides it.',
    example: 'Q1'
  },
  B: {
    id: 'B',
    title: '의미가 비슷한 것',
    titleEn: 'Same meaning as underlined',
    paceSec: 40,
    steps: [
      'Translate only the underlined part into plain English first, e.g. "might be late" for 늦을지도 모른다.',
      'Sort that meaning into a family: maybe, because, just as, almost, pretend, or must.',
      'Pick the choice from the same family and check it keeps the same yes or no sense.'
    ],
    signals: ['-(으)ㄹ지도 모르다', '-(으)ㄹ 수도 있다', '-(으)ㄴ 대로', '-(으)ㄴ 것과 같이', '-(으)ㄹ 리가 없다'],
    trap: 'Choosing an ending that shares a word with the underlined part but flips its meaning, like 늦을 리가 없다 (cannot be late).',
    example: 'Q3'
  },
  C: {
    id: 'C',
    title: '무엇에 대한 글',
    titleEn: 'What is this ad or notice about?',
    paceSec: 30,
    steps: [
      'Treat it as a riddle: spot the nouns first, because they name the product or place, like 이불 (blanket).',
      'Use the request as a second clue: what does it ask you to do, leave, start, or book?',
      'Name the category in English before reading the choices, then pick the closest word.'
    ],
    signals: ['맡겨 주세요', '시작하세요', '예매', '결제', '모집', '안내'],
    trap: 'Grabbing a choice because one word matches, when the whole ad points to a wider category like 건강 관리 (health care).',
    example: 'Q6'
  },
  D: {
    id: 'D',
    title: '내용과 같은 것',
    titleEn: 'Match the notice, graph, or short news',
    paceSec: 60,
    steps: [
      'Read the four choices first so you know which facts to hunt for: dates, numbers, who, where.',
      'Check each choice against the text one by one; numbers, rankings, and "not" words go first.',
      'Cross out any choice with one wrong detail, like 직접 (in person); the answer is often the main point reworded.'
    ],
    signals: ['가장 많다 / 가장 낮다', '절반', '세 번째', '이상 / 이하', '직접', '않아도 되다'],
    trap: 'Choosing a choice that is mostly right but has one changed detail, such as the wrong rank on a chart.',
    example: 'Q10'
  },
  E: {
    id: 'E',
    title: '순서에 맞게 배열',
    titleEn: 'Put the sentences in order',
    paceSec: 60,
    steps: [
      'Look at the choices: only two sentences can start, so pick the one that names the topic in full.',
      'A first sentence never opens with a pointing-back or linking word like 이러한; those come later.',
      'Find one locked pair (a sentence and the one it refers back to), then pick the only choice with it.'
    ],
    signals: ['그', '이러한 / 이', '하지만', '그래서', '이후', '또한'],
    trap: 'Starting with a sentence that feels like an intro but begins with 이 or 그, which means something must come before it.',
    example: 'Q13'
  },
  F: {
    id: 'F',
    title: '빈칸에 알맞은 것',
    titleEn: 'Fill the blank (short passage)',
    paceSec: 70,
    steps: [
      'Read the sentence before and the sentence after the blank; the blank restates a point made nearby.',
      'Let the words touching the blank guide you: after 사냥을 할 때 the answer must be about hunting.',
      'Say the missing idea in English first, then pick the choice that matches it, not the nicest one.'
    ],
    signals: ['그래서', '따라서', '-기 때문에', '즉', '-(으)ㄹ 정도로', '이처럼'],
    trap: 'Picking a choice that is true in real life but never supported by the passage, like a benefit nobody mentioned.',
    example: 'Q16'
  },
  G: {
    id: 'G',
    title: '접속 표현 · 중심 생각',
    titleEn: 'Linking word + main idea',
    paceSec: 90,
    steps: [
      'Read the whole passage once and label how it moves: problem, solution, extra benefit, or contrast.',
      'For the blank, compare both sides: adding one more point needs 또한; a flip needs a contrast word.',
      'For the main idea, pick the choice that covers the whole passage, usually the conclusion at the end.'
    ],
    signals: ['또한', '반면', '비록 -지만', '과연', '이로 인해', '-기 위해'],
    trap: 'For the main idea, choosing an option on the same topic that says something the writer never claimed.',
    example: 'Q19'
  },
  H: {
    id: 'H',
    title: '관용 표현 · 내용 일치',
    titleEn: 'Idiom blank + matching fact',
    paceSec: 90,
    steps: [
      'Decide the mood around the blank first: is the writer annoyed, relieved, waiting, or embarrassed?',
      'Learn idioms by feeling, not word by word: 눈살을 찌푸리다 means making people frown in disapproval.',
      'For the fact question, check each choice against the text; rising vs falling and who did what go first.'
    ],
    signals: ['눈살을 찌푸리다', '목이 빠지게', '한숨을 돌리다', '코가 납작해지다', '잦아지다', '-고 있다'],
    trap: 'Translating the idiom word by word (neck falling out, nose flattened) instead of knowing the feeling it carries.',
    example: 'Q21'
  },
  I: {
    id: 'I',
    title: '인물의 심정 · 내용 일치',
    titleEn: 'Narrator feeling + story facts',
    paceSec: 80,
    steps: [
      'This is a short personal story: read the lines just before the underlined part to see what just happened.',
      'Name the feeling in one English word, then match it: looking forward to something is 설레다.',
      'For the fact question, follow the order of events; wrong choices swap what happened first or how often.'
    ],
    signals: ['설레다', '아쉽다', '그립다', '샘나다', '한 번도 -지 않았다', '바로'],
    trap: 'Choosing a feeling word you only half know; 설레다, 섭섭하다 and 아쉽다 mean excited, hurt, and regretful.',
    example: 'Q23'
  },
  J: {
    id: 'J',
    title: '신문 기사 제목',
    titleEn: 'Explain the newspaper headline',
    paceSec: 60,
    steps: [
      'Split the headline at the comma or dots into two halves and translate each half on its own.',
      'Decode the picture words: 가뭄 (drought) means a long lack of something, like medals.',
      'Pick the choice that keeps both halves and the link between them (but, so, thanks to).'
    ],
    signals: ['솜방망이', '가뭄', '톡톡', '물결', '선 넘다', '여전히'],
    trap: 'Choosing a choice that explains only one half of the headline, or turns "still too soft" into "made softer".',
    example: 'Q27'
  },
  K: {
    id: 'K',
    title: '빈칸에 알맞은 내용',
    titleEn: 'Fill the blank (explanation text)',
    paceSec: 90,
    steps: [
      'Read the sentence after the blank first; it usually explains or proves what the blank says.',
      'Follow the cause and effect: if it takes 30 minutes to get strong again, the blank must mean "weakens".',
      'Test each choice in the gap and ask: does the next sentence still make sense right after it?'
    ],
    signals: ['-기 때문이다', '이처럼', '즉', '따라서', '-(으)려면', '덕분에'],
    trap: 'Picking a choice that sounds scientific but is not what the following sentence explains or proves.',
    example: 'Q29'
  },
  L: {
    id: 'L',
    title: '글의 내용과 같은 것',
    titleEn: 'Match the facts (longer text)',
    paceSec: 110,
    steps: [
      'Skim the four choices first and note their key nouns so you know what to look for.',
      'Find each noun in the passage and compare the claim: who did it, did it change, is it known or unknown.',
      'Watch for one-word flips, like 더 이상 (no longer) turned into "still keeps" in a wrong choice.'
    ],
    signals: ['더 이상 -지 않다', '추정되다', '기대하다', '-에 주목하다', '알 수 없다', '각기 다르다'],
    trap: 'Trusting a choice that copies words from the text but reverses one part, such as same vs different.',
    example: 'Q32'
  },
  M: {
    id: 'M',
    title: '글의 주제',
    titleEn: 'Main topic (opinion text)',
    paceSec: 100,
    steps: [
      'Find the turn word, often 하지만; the writer\'s real point comes right after it.',
      'Treat examples as support only; the topic is the sentence those examples are there to prove.',
      'Reject choices that state the other side or just one example; pick the one matching the conclusion.'
    ],
    signals: ['하지만', '그러나', '-아야/어야 한다', '따라서', '필요하다', '중요하다'],
    trap: 'Picking the view the writer mentions only to argue against, like the critics at the start of Q35.',
    example: 'Q35'
  },
  N: {
    id: 'N',
    title: '문장이 들어갈 곳',
    titleEn: 'Insert the given sentence',
    paceSec: 110,
    steps: [
      'Read the given sentence first and circle its opening word, like 오히려 (rather); it shows what came before.',
      'Ask what that word needs before it: "also" needs a similar point, "rather" needs the opposite view.',
      'Test the slot by reading the sentences before and after it together; it must lead into the next line too.'
    ],
    signals: ['오히려', '-도 (also)', '이러한', '이에', '그래서', '하지만'],
    trap: 'Placing the sentence where the topic matches but the flow breaks, because you ignored its first word.',
    example: 'Q39'
  },
  O: {
    id: 'O',
    title: '인물의 심정 (소설)',
    titleEn: 'Character feeling + story facts (novel)',
    paceSec: 110,
    steps: [
      'Read from the start up to the underlined line and note what happened to the character just before it.',
      'Judge the feeling from actions like freezing or stammering; a sudden shock points to 당황스럽다.',
      'For the fact question, keep only what the story actually shows; reject plans or events it never states.'
    ],
    signals: ['당황스럽다', '섭섭하다', '허전하다', '답답하다', '서럽다', '그 (he)'],
    trap: 'Picking a two-feeling choice where only one half fits; in pairs like 놀라고 당황스럽다 both words must match.',
    example: 'Q42'
  },
  P: {
    id: 'P',
    title: '빈칸 · 글의 주제',
    titleEn: 'Blank + main idea',
    paceSec: 110,
    steps: [
      'Look for a before vs after contrast around the blank; the blank names what people did not know before.',
      'Use the marker 예를 들어: the blank sentence is an example of the point made just above it.',
      'For the main idea, pick the choice that covers every field the passage mentions, not just one.'
    ],
    signals: ['예를 들어', '그러나', '이전에는', '동시에', '-뿐만 아니라', '이후'],
    trap: 'For the main idea, choosing one detail (only art, or only lectures) when the passage covers two fields at once.',
    example: 'Q44'
  },
  Q: {
    id: 'Q',
    title: '필자의 태도 · 내용 일치',
    titleEn: 'Writer attitude + matching fact',
    paceSec: 120,
    steps: [
      'Read both questions and all choices first, so one read of the passage answers both.',
      'For attitude, look at the last sentence: 따라서 ... -아야 한다 means the writer is urging action.',
      'For the fact question, check numbers and amounts first, then drop choices that deny the stated problem.'
    ],
    signals: ['촉구하다 (urge)', '우려하다 (worry)', '역설하다 (stress)', '부정하다 (deny)', '따라서', '-아야/어야 한다'],
    trap: 'Judging attitude by the topic instead of the ending: a text about a shortage can still be urging action, not worrying.',
    example: 'Q46'
  },
  R: {
    id: 'R',
    title: '글의 목적 · 빈칸 · 내용',
    titleEn: 'Purpose + blank + fact (long text)',
    paceSec: 120,
    steps: [
      'Read all three questions first, then read the passage once, answering each as you reach its part.',
      'For purpose, ask if the writer explains, praises, or attacks; reasons plus problems means 알리려고.',
      'For the blank, tie it to the background problem: a rule made to fix unpaid pay must reduce that risk.'
    ],
    signals: ['-(으)려고', '취지', '문제점', '그러나', '반론', '의무화하다'],
    trap: 'Choosing a one-sided purpose (only praise or only a demand) when the writer gives both the reason and the problems.',
    example: 'Q48'
  }
};
if (typeof module !== 'undefined') module.exports = window.STRATEGIES;
