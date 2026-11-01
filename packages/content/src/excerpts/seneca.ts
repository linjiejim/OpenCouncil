/**
 * Seneca — Moral Letters to Lucilius and Dialogues (selected passages).
 *   • Latin, Letters: Perseus Digital Library TEI (Epistulae Morales, ed. Gummere), CC BY-SA 4.0
 *   • Latin, Dialogues: Latin Wikisource (De brevitate vitae, De providentia, De ira)
 *   • English, Dialogues: Aubrey Stewart (Bohn, 1889; d. 1918), public domain, Project Gutenberg #64576
 *   • English, Letters: Richard M. Gummere (Loeb, 1917–1925; d. 1969), via English Wikisource.
 *     DOCUMENTED EXCEPTION: public domain in the US (published 1917–1925) but NOT life+70
 *     (Gummere died 1969). No proofread pre-1931 translation of the Letters by a translator who died
 *     before 1956 is available online (Morell 1786 and Clode 1888 exist only as archive.org scans).
 *     Replace these four items if such a text becomes available.
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const LAT_EP = {
  url: 'https://raw.githubusercontent.com/PerseusDL/canonical-latinLit/master/data/phi1017/phi015/phi1017.phi015.perseus-lat2.xml',
  format: 'xml',
  lang: 'latin',
} as const;
const laWs = (page: string) =>
  ({ url: `https://la.wikisource.org/w/api.php?action=parse&page=${page}&prop=text&format=json`, format: 'mediawiki', lang: 'latin' }) as const;
const LAT_BREV = laWs('De_brevitate_vitae');
const LAT_PROV = laWs('De_providentia');
const LAT_IRA2 = laWs('De_ira/Liber_II');

const STEWART = {
  url: 'https://www.gutenberg.org/cache/epub/64576/pg64576.txt',
  format: 'text',
  translator: 'Aubrey Stewart (1889)',
} as const;
const gummere = (letter: number) =>
  ({
    url: `https://en.wikisource.org/w/api.php?action=parse&page=Moral_letters_to_Lucilius/Letter_${letter}&prop=text&format=json`,
    format: 'mediawiki',
    translator: 'Richard M. Gummere (1917–1925)',
  }) as const;
const wsLetter = (letter: number) => `https://en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_${letter}`;

const LICENSE_DIALOGUE = 'Latin: public domain (Latin Wikisource); English: public domain';
const LICENSE_LETTER = 'Latin: CC BY-SA 4.0 (Perseus); English: public domain in the US (published 1917–1925)';
const GUTENBERG = 'https://www.gutenberg.org/ebooks/64576';

const BREV = { chapterEn: 'On the Shortness of Life', chapterZh: '论生命之短暂', chapterOrig: 'De Brevitate Vitae' };
const LETTERS = { chapterEn: 'Moral Letters to Lucilius', chapterZh: '道德书简', chapterOrig: 'Epistulae Morales ad Lucilium' };

const items: ExcerptItem[] = [
  {
    canonicalRef: 'De Brevitate Vitae 1.4',
    ...BREV,
    original: { ...LAT_BREV, start: 'Ita est: non accipimus brevem vitam', end: 'nec inopes eius sed prodigi sumus.' },
    english: { ...STEWART, start: 'Thus it is: we do not receive a short life', end: 'but wasteful of them.' },
    sourceUrl: GUTENBERG, license: LICENSE_DIALOGUE,
    summaryEn: 'We are not given a short life; we make it short. We are not poor in time but wasteful of it.',
    summaryZh: '我们得到的生命并不短，是我们把它变短了；我们不是缺少时间，而是在挥霍时间。',
    similarQuestions: ['Is life too short?', 'How to stop wasting time?', 'Am I spending my time wisely?', 'Why does time fly by so fast?', 'How to make the most of my life?'],
    contextNote: 'From the first chapter of “On the Shortness of Life”, written around 49 CE to Paulinus. Just before this sentence Seneca argues that life is long enough for the greatest achievements if the whole of it is well spent.',
    tags: ['meaning-of-life', 'death', 'discipline'], weight: 5,
  },
  {
    canonicalRef: 'De Brevitate Vitae 7.3',
    ...BREV,
    original: { ...LAT_BREV, start: 'Nihil minus est hominis occupati quam vivere', end: 'tota vita discendum est mori.' },
    english: { ...STEWART, start: 'No man knows less about living than a business man', end: 'spent in learning how to die.' },
    sourceUrl: GUTENBERG, license: LICENSE_DIALOGUE,
    summaryEn: 'Busy people know least about living. Other arts can be learned even by boys, but it takes a whole life to learn how to live — and, more surprisingly, a whole life to learn how to die.',
    summaryZh: '忙碌的人最不懂得生活。别的技艺连孩子都学得会，但学会生活需要一辈子——更令人惊讶的是，学会死亡也需要一辈子。',
    similarQuestions: ['How to prepare for death?', 'Is it too late to start living?', 'What is the art of living?', 'How to live without regret?', 'Why is life so hard to figure out?'],
    contextNote: 'From chapter 7 of “On the Shortness of Life”. Seneca’s target is the occupati, people absorbed in business and ambition. For the Stoics, contemplating death is not morbid: it focuses attention on what matters.',
    tags: ['death', 'wisdom', 'meaning-of-life'], weight: 4,
  },
  {
    canonicalRef: 'Letters to Lucilius 1.1',
    ...LETTERS,
    original: { ...LAT_EP, start: 'Ita fac, mi Lucili; vindica te tibi', end: 'tota vita aliud agentibus.' },
    english: { ...gummere(1), start: 'Continue to act thus, my dear Lucilius', end: 'doing that which is not to the purpose.' },
    sourceUrl: wsLetter(1), license: LICENSE_LETTER,
    summaryEn: 'Set yourself free for your own sake: gather and save the time that is taken from you, stolen, or slips away. The most disgraceful loss is the one due to carelessness — most of life passes in doing ill, much in doing nothing, and all of it in doing what is beside the point.',
    summaryZh: '为了你自己，把自己解放出来：把被夺走、被偷走或悄悄溜走的时间收回来、守住。最可耻的损失是因疏忽造成的——人生大半在做坏事中度过，许多在无所事事中度过，而整个一生都在做不相干的事。',
    similarQuestions: ['How to take back control of my time?', 'Why am I always busy but never productive?', 'Am I living someone else’s life?', 'How to prioritize?', 'Am I wasting my life?'],
    contextNote: 'The opening of the first letter to Lucilius: Seneca begins the whole collection with time. “Vindica te tibi” is often rendered “claim yourself for yourself”. Written in the last years of his life, around 62–65 CE.',
    tags: ['freedom', 'discipline', 'meaning-of-life'], weight: 5,
  },
  {
    canonicalRef: 'Letters to Lucilius 1.2–3',
    ...LETTERS,
    original: { ...LAT_EP, start: 'Quem mihi dabis, qui aliquod pretium tempori ponat', end: 'tempus tantum nostrum est.' },
    english: { ...gummere(1), start: 'What man can you show me who places any value on his time', end: 'is ours, except time.' },
    sourceUrl: wsLetter(1), license: LICENSE_LETTER,
    summaryEn: 'We die daily: most of death already lies behind us. So hold every hour in your grasp and seize today’s task, for while we postpone, life speeds by. Nothing is truly ours except time.',
    summaryZh: '我们每天都在死去：死亡的大半已在身后。所以要抓住每一个小时，做好今天的事，因为在我们拖延之时，生命匆匆而过。除了时间，没有什么真正属于我们。',
    similarQuestions: ['How to stop procrastinating?', 'How to live in the present?', 'Am I putting off my real life?', 'How to make today count?', 'Why do I always think I’ll start tomorrow?'],
    contextNote: 'Letter 1. The Latin “Dum differtur vita transcurrit” (while we postpone, life speeds by) is one of the most quoted Stoic sayings.',
    tags: ['death', 'impermanence', 'discipline'], weight: 5,
  },
  {
    canonicalRef: 'Letters to Lucilius 2.2–3',
    ...LETTERS,
    original: { ...LAT_EP, start: 'Illud autem vide, ne ista lectio auctorum multorum', end: 'satis est habere, quantum legas.' },
    english: { ...gummere(2), start: 'Be careful, however, lest this reading of many authors', end: 'as many books as you can read.' },
    sourceUrl: wsLetter(2), license: LICENSE_LETTER,
    summaryEn: 'Reading many authors of every kind makes the mind scattered. Linger with a few master thinkers and digest them; everywhere means nowhere. Since you cannot read all the books you own, own only as many as you can read.',
    summaryZh: '博览各类作者会让心智散乱。要与少数大师长久相处、消化他们的思想；无处不在等于无处可在。既然读不完拥有的书，那么拥有能读完的书就够了。',
    similarQuestions: ['How to learn effectively?', 'Am I reading too much without understanding?', 'Is information overload making me dumber?', 'How to develop deep knowledge?', 'What should I read?'],
    contextNote: 'Letter 2, “On discursiveness in reading”. Seneca compares the restless reader to a traveller with many hosts and no friends, and to a plant that never takes root because it is moved too often.',
    tags: ['education', 'discipline', 'simplicity'], weight: 4,
  },
  {
    canonicalRef: 'Letters to Lucilius 106.11–12',
    ...LETTERS,
    original: { ...LAT_EP, start: 'In supervacuis subtilitas teritur', end: 'non vitae sed scholae discimus.' },
    english: { ...gummere(106), start: 'We dull our fine edge by such superfluous pursuits', end: 'not for life, but for the lecture-room.' },
    sourceUrl: wsLetter(106), license: LICENSE_LETTER,
    summaryEn: 'Hair-splitting about superfluous questions makes people clever but not good. Wisdom is plainer than that; literature should improve the mind. As in everything, we suffer from excess in learning — we learn for the lecture-room, not for life.',
    summaryZh: '在无用的问题上钻牛角尖，只会让人变得聪明，而不会让人变得善良。智慧要朴素得多；读书应当用来改善心灵。我们在学问上也像在一切事上一样过度——我们是为课堂而学，不是为生活而学。',
    similarQuestions: ['What is the purpose of education?', 'Is school teaching me what I need?', 'How to apply what I learn?', 'What knowledge is most useful?'],
    contextNote: 'The close of Letter 106. Seneca actually wrote “non vitae sed scholae discimus” — we learn for school, not for life — as a complaint. The popular motto “Non scholae sed vitae discimus” reverses his wording to state the ideal he implies.',
    tags: ['education', 'wisdom', 'goodness'], weight: 4,
  },
  {
    canonicalRef: 'De Providentia 5.9',
    chapterEn: 'On Providence', chapterZh: '论天意', chapterOrig: 'De Providentia',
    original: { ...LAT_PROV, start: 'Languida ingenia et in somnum itura', end: 'Ignis aurum probat, miseria fortes uiros.' },
    english: { ...STEWART, start: 'Dull minds, tending to sleep', end: 'misfortune tries brave men.' },
    sourceUrl: GUTENBERG, license: LICENSE_DIALOGUE,
    summaryEn: 'Sluggish natures are made of sluggish stuff; a person worth the name needs a harder fate. Their road goes up and down through troubled waters, and they must smooth what is rough. Fire tries gold, misfortune tries brave men.',
    summaryZh: '迟钝的心灵由迟钝的材料构成；要成为值得一提的人，需要更严酷的命运。他的路起伏不平，要在风浪中掌舵，把坎坷磨平。火炼真金，逆境炼勇者。',
    similarQuestions: ['How to face adversity?', 'Is suffering useful?', 'How to build resilience?', 'Does struggle make you stronger?', 'Why do bad things happen to good people?'],
    contextNote: 'From “On Providence”, which answers Lucilius’ question why misfortunes befall good men if providence rules the world. The related saying “It is not because things are difficult that we do not dare; it is because we do not dare that they are difficult” comes from Letter 104.26, not from this passage.',
    tags: ['suffering', 'courage', 'perseverance'], weight: 5,
  },
  {
    canonicalRef: 'De Ira 2.29.1',
    chapterEn: 'On Anger, Book II', chapterZh: '论愤怒·第二卷', chapterOrig: 'De Ira, Liber II',
    original: { ...LAT_IRA2, start: 'Maximum remedium irae mora est.', end: 'tota uincetur, dum partibus carpitur.' },
    english: { ...STEWART, start: 'The greatest remedy for anger is delay', end: 'by plucking away its parts we shall remove the whole.' },
    sourceUrl: GUTENBERG, license: LICENSE_DIALOGUE,
    summaryEn: 'The greatest remedy for anger is delay: ask it at first not to pardon but to judge. Its first impulses are fierce, but it will subside if it waits; do not try to quell it all at once, but take it apart piece by piece.',
    summaryZh: '治愤怒最好的良药是拖延：一开始不求它宽恕，只求它先作判断。愤怒初起时来势凶猛，但只要等一等就会平息；不要妄图一下子消灭它，而要一部分一部分地拆解。',
    similarQuestions: ['How to control my anger?', 'Why do I get angry so easily?', 'How to stop overreacting?', 'How to stay calm under pressure?'],
    contextNote: 'From “On Anger”, written for Seneca’s brother Novatus — in effect an ancient manual of anger management. The motto sometimes attached to it, “Ira initium insaniae est” (anger is the beginning of madness), is from Ennius, not Seneca.',
    tags: ['discipline', 'reason', 'practice'], weight: 5,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'seneca',
  dataFile: 'seneca-letters-dialogues.json',
  thinkerName: 'Seneca',
  tradition: 'stoicism',
  supersedes: ['Moral Letters & Essays (Selected)'],
  work: {
    titleEn: 'Moral Letters & Dialogues (Selected Passages)',
    titleZh: '道德书简与对话录（精选）',
    titleOrig: 'Epistulae Morales ad Lucilium / Dialogi',
    language: 'latin',
    circaYear: 63,
    description:
      'Selected passages from Seneca’s Moral Letters to Lucilius and his Dialogues (On the Shortness of Life, On Providence, On Anger). Latin of the Letters from the Perseus Digital Library (CC BY-SA 4.0) and of the Dialogues from Latin Wikisource. English of the Dialogues in the public-domain translation of Aubrey Stewart (1889), via Project Gutenberg; English of the Letters in Richard M. Gummere’s Loeb translation (1917–1925), public domain in the US, via English Wikisource.',
    copyright: 'Latin CC BY-SA 4.0 or PD · English PD (US)',
    sourceUrl: 'https://www.gutenberg.org/ebooks/64576',
  },
  items,
};

export default work;
