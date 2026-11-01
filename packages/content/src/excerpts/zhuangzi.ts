/**
 * Zhuangzi (莊子) — selected passages.
 *   • Chinese: Chinese Wikisource 莊子 chapter pages (public domain); for Ch. 17 the main text of
 *     南華真經註疏 (Guo Xiang / Cheng Xuanying), because the 莊子/秋水 page carries inline variant notes.
 *   • English: Herbert A. Giles, "Chuang Tzŭ: Mystic, Moralist, and Social Reformer" (London: Bernard
 *     Quaritch, 1889; Giles d. 1935), public domain — English Wikisource transcription proofread against
 *     the 1889 scans; Ch. 3's opening from Project Gutenberg #59709 (same edition).
 *
 * Giles interleaves his own notes with the translation; every English span below is chosen so that it
 * contains only translation, never a note.
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const zhPage = (page: string) =>
  `https://zh.wikisource.org/w/api.php?action=parse&format=json&prop=text&page=${encodeURI(page)}`;
const zh = (page: string) => ({ url: zhPage(page), format: 'mediawiki', lang: 'classical-chinese' }) as const;

const gilesPage = (ch: number) => `Chuang_Tzŭ_(Giles)/Chapter_${ch}`;
const giles = (ch: number) =>
  ({
    url: `https://en.wikisource.org/w/api.php?action=parse&format=json&prop=text&page=${encodeURI(gilesPage(ch))}`,
    format: 'mediawiki',
    translator: 'Herbert A. Giles (1889)',
  }) as const;
const GILES_PG = {
  url: 'https://www.gutenberg.org/cache/epub/59709/pg59709.txt',
  format: 'text',
  translator: 'Herbert A. Giles (1889)',
} as const;
const src = (ch: number) => `https://en.wikisource.org/wiki/${encodeURI(gilesPage(ch))}`;
const LICENSE = 'Chinese: public domain (Wikisource); English: public domain';

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Zhuangzi 1 (Xiaoyaoyou): Kun and Peng',
    chapterEn: 'Chapter 1: Transcendental Bliss (Xiaoyaoyou)', chapterZh: '逍遥游', chapterOrig: '逍遙遊',
    original: { ...zh('莊子/逍遙遊'), start: '北冥有魚，其名爲鯤。', end: '其翼若垂天之雲。' },
    english: { ...giles(1), start: 'IN the northern ocean there is a fish', end: 'its wings obscure the sky like clouds.' },
    sourceUrl: src(1), license: LICENSE,
    summaryEn: 'A fish in the northern ocean, thousands of li in size, changes into a vast bird whose wings darken the sky like clouds. The book opens with a scale beyond ordinary measure, and with transformation.',
    summaryZh: '北方大海里有一条大鱼，大到不知有几千里；它化而为鸟，展翅高飞时，翅膀如同遮天的云。全书以超出常人尺度的形象和"化"的主题开篇。',
    similarQuestions: ['How to think bigger?', 'What is true freedom?', 'How to transcend limitations?', 'Can I transform my life completely?', 'What does it mean to dream big?'],
    contextNote: 'The opening of the Zhuangzi. Giles renders the fish Kun (鯤) as "Leviathan" and the bird Peng (鵬) as "Rukh". The chapter goes on to contrast the great bird with a cicada and a dove who laugh at it, setting up the theme of small and great perspectives.',
    tags: ['freedom', 'cosmos', 'nature'], weight: 5,
  },
  {
    canonicalRef: 'Zhuangzi 1 (Xiaoyaoyou): small and great knowledge',
    chapterEn: 'Chapter 1: Transcendental Bliss (Xiaoyaoyou)', chapterZh: '逍遥游', chapterOrig: '逍遙遊',
    original: { ...zh('莊子/逍遙遊'), start: '小知不及大知，小年不及大年。', end: '此小年也。' },
    english: { ...giles(1), start: 'Small knowledge has not the compass of great knowledge', end: 'Theirs are short years.' },
    sourceUrl: src(1), license: LICENSE,
    summaryEn: 'Small knowledge cannot reach as far as great knowledge, just as a short life cannot span a long one: the morning mushroom never sees night and day pass, the cicada never sees spring and autumn.',
    summaryZh: '小智比不上大智，短命比不上长寿：朝生暮死的菌类不知道一天的昼夜，蝉不知道一年的春秋。我们的理解总受限于自身的尺度。',
    similarQuestions: ['How limited is my perspective?', 'Am I missing the bigger picture?', 'How to gain broader understanding?', 'What are my blind spots?'],
    contextNote: 'This comes right after the cicada and the little dove mock the great bird for flying so far. Zhuangzi uses short-lived and long-lived creatures to show that every being judges from within its own span.',
    tags: ['wisdom', 'self-knowledge', 'doubt'], weight: 4,
  },
  {
    canonicalRef: 'Zhuangzi 1 (Xiaoyaoyou): the perfect man',
    chapterEn: 'Chapter 1: Transcendental Bliss (Xiaoyaoyou)', chapterZh: '逍遥游', chapterOrig: '逍遙遊',
    original: { ...zh('莊子/逍遙遊'), start: '故曰：「至人无己', end: '聖人无名。」' },
    english: { ...giles(1), start: 'Thus it has been said, "The perfect man ignores self;', end: 'the true Sage ignores reputation."' },
    sourceUrl: src(1), license: LICENSE,
    summaryEn: 'The perfect man has no self, the divine man no achievement, the true sage no name — in Giles’s words, they ignore self, action and reputation.',
    summaryZh: '至人没有自我，神人不求功业，圣人不求名声。最高的境界是放下自我、功劳和名誉。',
    similarQuestions: ['How to overcome ego?', 'Does recognition matter?', 'What is spiritual perfection?', 'Should I seek fame?', 'How to let go of ambition?'],
    contextNote: 'This line closes the first part of the chapter: after a man indifferent to praise and blame, and Liezi who could ride the wind but still depended on it, Zhuangzi points to one who depends on nothing. The stories that follow (Yao offering the empire to Xu You, who refuses it) illustrate "no name".',
    tags: ['freedom', 'self-knowledge', 'simplicity'], weight: 5,
  },
  {
    canonicalRef: 'Zhuangzi 2 (Qiwulun): the butterfly dream',
    chapterEn: 'Chapter 2: The Identity of Contraries (Qiwulun)', chapterZh: '齐物论', chapterOrig: '齊物論',
    original: { ...zh('莊子/齊物論'), start: '昔者莊周夢爲胡蝶', end: '此之謂物化。' },
    english: { ...giles(2), start: 'Once upon a time, I, Chuang Tzŭ, dreamt I was a butterfly', end: 'The transition is called Metempsychosis.' },
    sourceUrl: src(2), license: LICENSE,
    summaryEn: 'Zhuangzi dreams he is a butterfly, wholly a butterfly; on waking he cannot tell whether he is a man who dreamt of being a butterfly or a butterfly dreaming of being a man. Yet there is a distinction between them — and the passage from one to the other is the transformation of things.',
    summaryZh: '庄周梦见自己是一只蝴蝶，醒来后不知道是庄周梦见了蝴蝶，还是蝴蝶梦见了庄周。二者必定有分别，而从此到彼的转变，就叫"物化"。',
    similarQuestions: ['What is real?', 'Who am I really?', 'Is life a dream?', 'How do I know what\'s true?', 'What is the nature of identity?', 'How to deal with uncertainty about reality?'],
    contextNote: 'The closing passage of the Qiwulun and perhaps the most famous in Chinese philosophy. Giles translates 物化 ("the transformation of things") as "Metempsychosis", a Western term the original does not use.',
    tags: ['self-knowledge', 'doubt', 'impermanence'], weight: 5,
  },
  {
    canonicalRef: 'Zhuangzi 2 (Qiwulun): this and that',
    chapterEn: 'Chapter 2: The Identity of Contraries (Qiwulun)', chapterZh: '齐物论', chapterOrig: '齊物論',
    original: { ...zh('莊子/齊物論'), start: '雖然，方生方死', end: '亦因是也。' },
    english: { ...giles(2), start: 'Nevertheless, when one is born, the other dies.', end: 'places himself in subjective relation with all things.' },
    sourceUrl: src(2), license: LICENSE,
    summaryEn: 'Opposites arise together: as one is born the other dies, as one is affirmed the other is denied. So the sage does not take sides between "this" and "that", but sees things in the light of Heaven.',
    summaryZh: '对立面相伴而生：方生方死，方可方不可，有是就有非。所以圣人不陷入彼此是非之争，而是以天理观照万物。',
    similarQuestions: ['Is there absolute right and wrong?', 'How to deal with moral ambiguity?', 'Can opposites coexist?', 'Why do people disagree about what is right?'],
    contextNote: 'A central argument of the Qiwulun: "this" (是) and "that" (彼) define each other, so no fixed standpoint is final. Giles renders the pair as "subjective" and "objective", and 天 (Heaven) as "God".',
    tags: ['truth', 'doubt', 'wisdom'], weight: 4,
  },
  {
    canonicalRef: 'Zhuangzi 3 (Yangshengzhu): life has a limit',
    chapterEn: 'Chapter 3: Nourishment of the Soul (Yangshengzhu)', chapterZh: '养生主', chapterOrig: '養生主',
    original: { ...zh('莊子/養生主'), start: '吾生也有涯，而知也无涯。', end: '可以盡年。' },
    english: { ...GILES_PG, start: 'My life has a limit, but my knowledge is without limit.', end: 'work out your allotted span.' },
    sourceUrl: 'https://www.gutenberg.org/ebooks/59709', license: LICENSE,
    summaryEn: 'Life is limited but knowledge is not; to chase the limitless with the limited is fatal. Avoid both fame and disgrace, keep to the middle course, and you will preserve body and mind and live out your years.',
    summaryZh: '生命有限而知识无限，以有限追逐无限，必然危殆。做好事不求名，做坏事不近刑，顺着中道而行，就能保全身体、养护天性、尽享天年。',
    similarQuestions: ['How to avoid burnout?', 'Is knowledge worth pursuing endlessly?', 'How to prioritize what to learn?', 'When should I stop trying to know everything?', 'How to accept my limitations?'],
    contextNote: 'The opening of the chapter on "nourishing life". Zhuangzi warns against the very pursuit of knowledge that philosophy represents, and offers instead the image of following the middle channel (緣督以爲經).',
    tags: ['wisdom', 'simplicity', 'practice'], weight: 5,
  },
  {
    canonicalRef: 'Zhuangzi 3 (Yangshengzhu): Cook Ding',
    chapterEn: 'Chapter 3: Nourishment of the Soul (Yangshengzhu)', chapterZh: '养生主', chapterOrig: '養生主',
    original: { ...zh('莊子/養生主'), start: '文惠君曰：「譆！善哉！技蓋至此乎！」', end: '未嘗見全牛也。' },
    english: { ...giles(3), start: '"Well done!" cried the Prince.', end: 'I saw no more whole animals.' },
    sourceUrl: src(3), license: LICENSE,
    summaryEn: 'Praised for his skill, the cook replies that what he cares about is the Way (Tao), which goes beyond skill: at first he saw only whole oxen, but after three years he no longer saw the whole animal.',
    summaryZh: '文惠君称赞庖丁技艺高超，庖丁答道：我所喜好的是道，已经超过了技术。刚开始解牛时，眼里看到的都是整头牛；三年之后，就再也看不到整头的牛了。',
    similarQuestions: ['How to achieve mastery?', 'What is the secret of excellence?', 'How to work without burnout?', 'What is flow state?', 'How to make hard work look easy?'],
    contextNote: 'From the parable of Cook Ding (Giles: "Prince Hui’s cook"). The cook goes on to explain that he now works by spirit rather than sight, follows the natural spaces between the joints, and has used the same blade for nineteen years; the prince concludes that he has learned how to nourish life.',
    tags: ['practice', 'wisdom', 'non-action'], weight: 5,
  },
  {
    canonicalRef: 'Zhuangzi 4 (Renjianshi): the use of the useless',
    chapterEn: 'Chapter 4: Man among Men (Renjianshi)', chapterZh: '人间世', chapterOrig: '人間世',
    original: { ...zh('莊子/人間世'), start: '山木，自寇也。', end: '而莫知无用之用也。' },
    english: { ...giles(4), start: 'Hills suffer from the trees they produce.', end: 'they do not know the use of useless things.' },
    sourceUrl: src(4), license: LICENSE,
    summaryEn: 'What is useful invites its own destruction: cinnamon is edible, so the tree is cut down; lacquer is useful, so the tree is gashed. Everyone knows the use of the useful, but no one knows the use of the useless.',
    summaryZh: '有用反而招致伤害：桂树可以吃，所以被砍伐；漆树有用，所以被割开。人们都知道有用的用处，却不知道无用的用处。',
    similarQuestions: ['Is being ambitious dangerous?', 'Should I always try to be useful?', 'How to protect myself from being exploited?', 'What is the value of doing nothing?', 'Is it okay to be ordinary?'],
    contextNote: 'The last lines of the chapter, which is full of stories of trees and people saved by being "useless". Giles reads these lines as the end of the madman Jieyu’s song to Confucius, and takes 山木自寇 as "hills suffer from the trees they produce".',
    tags: ['simplicity', 'wisdom', 'freedom'], weight: 5,
  },
  {
    canonicalRef: 'Zhuangzi 6 (Dazongshi): life and death',
    chapterEn: 'Chapter 6: The Great Supreme (Dazongshi)', chapterZh: '大宗师', chapterOrig: '大宗師',
    original: { ...zh('莊子/大宗師'), start: '死生，命也；', end: '皆物之情也。' },
    english: { ...giles(6), start: 'Life and Death belong to Destiny.', end: 'beyond the interference of man, an inevitable law.' },
    sourceUrl: src(6), license: LICENSE,
    summaryEn: 'Life and death are fated; their succession, like that of night and day, belongs to Heaven. There are things in which human beings can have no say — that is simply how things are.',
    summaryZh: '生死是命中注定的，就像昼夜交替一样，是自然之常。有些事是人无法干预的，这就是万物的实情。',
    similarQuestions: ['How to accept death?', 'How to deal with things I cannot control?', 'Is fate real?', 'How to find peace with mortality?', 'What happens when we die?'],
    contextNote: 'From the chapter on the "great and venerable teacher". Giles renders 天 (Heaven) as "God". Zhuangzi’s serenity about death recurs throughout the book — in Chapter 18 he is found drumming and singing after his wife’s death.',
    tags: ['death', 'destiny', 'nature'], weight: 4,
  },
  {
    canonicalRef: 'Zhuangzi 14 (Tianyun): fish on dry land',
    chapterEn: 'Chapter 14: The Circling Sky (Tianyun)', chapterZh: '天运', chapterOrig: '天運',
    original: { ...zh('莊子/天運'), start: '夫鵠不日浴而白', end: '不若相忘於江湖。' },
    english: { ...giles(14), start: 'The snow-goose is white without a daily bath.', end: 'in the first instance in their native rivers and lakes.' },
    sourceUrl: src(14), license: LICENSE,
    summaryEn: 'The goose is white and the crow black without effort. When the spring dries up, fish stranded on land keep each other alive with breath and spittle — but far better to leave them to forget one another in the rivers and lakes.',
    summaryZh: '天鹅不用天天洗浴也是白的，乌鸦不用天天染也是黑的。泉水干了，鱼困在陆地上，用湿气互相嘘吸，用唾沫互相润湿，不如在江湖里彼此相忘。',
    similarQuestions: ['What is true friendship?', 'Is codependency healthy?', 'How to love without clinging?', 'Do we need moral rules to be good?', 'What is healthy independence in relationships?'],
    contextNote: 'Laozi’s reply to Confucius, who has come to preach benevolence and righteousness: such virtues are like fish moistening each other once the water is gone. The same image appears in Chapter 6 (Dazongshi), and 相忘於江湖 ("forgetting each other in the rivers and lakes") has become a common Chinese expression.',
    tags: ['friendship', 'freedom', 'simplicity'], weight: 5,
  },
  {
    canonicalRef: 'Zhuangzi 17 (Qiushui): the well-frog',
    chapterEn: 'Chapter 17: Autumn Floods (Qiushui)', chapterZh: '秋水', chapterOrig: '秋水',
    original: { ...zh('南華真經註疏/卷十九'), start: '井蛙不可以語於海者', end: '束於教也。' },
    english: { ...giles(17), start: 'You cannot speak of ocean to a well-frog', end: 'his scope is too restricted.' },
    sourceUrl: src(17), license: LICENSE,
    summaryEn: 'You cannot talk about the ocean to a frog in a well, about ice to a summer insect, or about the Way to a narrow scholar: each is confined by its space, its season, or its teaching.',
    summaryZh: '不能和井底之蛙谈论大海，因为它受居处的局限；不能和夏天的虫子谈论冰，因为它受时令的局限；不能和见识浅陋的人谈论道，因为他受所学教条的束缚。',
    similarQuestions: ['Why can\'t people understand each other?', 'How to broaden my perspective?', 'Am I trapped in my own bubble?', 'How to communicate with people who think differently?', 'Why are some people closed-minded?'],
    contextNote: 'The Spirit of the North Sea speaks to the River Spirit, who has just discovered how small he is. 井底之蛙 ("the frog at the bottom of the well") is now a standard idiom for narrow-mindedness. The Chinese is taken from the main text of 南華真經註疏.',
    tags: ['wisdom', 'education', 'self-knowledge'], weight: 5,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'zhuangzi',
  dataFile: 'zhuangzi-zhuangzi.json',
  thinkerName: 'Zhuangzi',
  tradition: 'daoism',
  supersedes: ['Zhuangzi'],
  work: {
    titleEn: 'Zhuangzi (Selected Passages)',
    titleZh: '庄子（精选）',
    titleOrig: '莊子',
    language: 'classical-chinese',
    circaYear: -300,
    description:
      'Selected passages from the Zhuangzi, the Daoist classic attributed to Zhuang Zhou, known for its parables, paradoxes and play with perspective. Chinese text from Chinese Wikisource (public domain) with the public-domain English translation of Herbert A. Giles (1889), via English Wikisource and Project Gutenberg.',
    copyright: 'public-domain',
    sourceUrl: 'https://en.wikisource.org/wiki/Chuang_Tz%C5%AD_(Giles)',
  },
  items,
};

export default work;
