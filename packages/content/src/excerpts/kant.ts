/**
 * Immanuel Kant — the two Critiques & Perpetual Peace (selected passages).
 *   • German: Kritik der reinen Vernunft, 2nd ed. 1787 (Project Gutenberg #6343);
 *     Zum ewigen Frieden, Königsberg: Nicolovius 1795 (Project Gutenberg #46873). Public domain.
 *   • English: J. M. D. Meiklejohn (1855; d. 1902), Project Gutenberg #4280;
 *     William Hastie (1891; d. 1903), "Perpetual Peace" on English Wikisource. Public domain.
 *
 *   • Critique of Practical Reason: German, Gutenberg #49543 (Akademie text, apparatus stripped);
 *     English, T. K. Abbott (1873; d. 1913), Gutenberg #5683. Public domain.
 *
 * The Groundwork, "What is Enlightenment?" and "Idea for a Universal History" are not
 * used: no clean German text in an allowed source (or, for the Enlightenment essay, no
 * public-domain English translation). The categorical imperative and the formula of
 * humanity are quoted from the Critique of Practical Reason instead.
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const KRV_DE = {
  url: 'https://www.gutenberg.org/cache/epub/6343/pg6343.txt',
  format: 'text',
  lang: 'german',
} as const;
const MEIKLEJOHN = {
  url: 'https://www.gutenberg.org/cache/epub/4280/pg4280-images.html',
  format: 'html',
  translator: 'J. M. D. Meiklejohn (1855)',
} as const;
const ZEF_DE = {
  url: 'https://www.gutenberg.org/cache/epub/46873/pg46873-images.html',
  format: 'html',
  lang: 'german',
} as const;
// Critique of Practical Reason. The Gutenberg German text carries the Akademie edition's
// apparatus inside sentences (line markers "|161.35|", page markers "#289#", "=" for spaced
// emphasis); the English carries "{BOOK_1|CHAPTER_1 ^paragraph 65}" anchors. Both are stripped.
const KPV_DE = {
  url: 'https://www.gutenberg.org/cache/epub/49543/pg49543.txt',
  format: 'text',
  lang: 'german',
  strip: '\\|\\d+\\.\\d+\\||#\\d+#|=',
} as const;
const ABBOTT_KPV = {
  url: 'https://www.gutenberg.org/cache/epub/5683/pg5683.txt',
  format: 'text',
  translator: 'Thomas Kingsmill Abbott (1873)',
  strip: '\\{[^}]*\\}',
} as const;
const KPV_SRC = 'https://www.gutenberg.org/ebooks/5683';
const hastie = (page: string) =>
  ({
    url: `https://en.wikisource.org/w/api.php?action=parse&page=Perpetual_Peace/${page}&prop=text&format=json`,
    format: 'mediawiki',
    translator: 'William Hastie (1891)',
  }) as const;
const LICENSE = 'German: public domain (Project Gutenberg); English: public domain';
const KRV_SRC = 'https://www.gutenberg.org/ebooks/4280';
const zefSrc = (page: string) => `https://en.wikisource.org/wiki/Perpetual_Peace/${page}`;

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Critique of Pure Reason B1',
    chapterEn: 'Critique of Pure Reason — Introduction', chapterZh: '纯粹理性批判·导言', chapterOrig: 'Kritik der reinen Vernunft — Einleitung',
    original: { ...KRV_DE, start: 'Daß alle unsere Erkenntnis mit der Erfahrung anfange', end: 'doch nicht eben alle aus der Erfahrung.' },
    english: { ...MEIKLEJOHN, start: 'That all our knowledge begins with experience there can be no doubt.', end: 'it by no means follows that all arises out of experience.' },
    sourceUrl: KRV_SRC, license: LICENSE,
    summaryEn: 'All our knowledge begins with experience: our senses must first be affected before we can know anything. But it does not follow that all knowledge arises out of experience — the mind may contribute something of its own.',
    summaryZh: '我们的一切知识都从经验开始：感官必须先受到触动，我们才能认识任何东西。但这并不意味着一切知识都来源于经验——心灵本身可能也贡献了某些东西。',
    similarQuestions: ['Where does knowledge come from?', 'Is all knowledge learned from experience?', 'Can we know anything without the senses?'],
    contextNote: 'The opening of the Introduction to the second edition (1787). In one stroke Kant grants the empiricists their starting point while preparing his central claim: that some knowledge is a priori, supplied by the structure of the mind itself.',
    tags: ['reason', 'truth', 'wisdom'], weight: 4,
  },
  {
    canonicalRef: 'Critique of Pure Reason A51/B75',
    chapterEn: 'Critique of Pure Reason — Transcendental Logic', chapterZh: '纯粹理性批判·先验逻辑', chapterOrig: 'Kritik der reinen Vernunft — Transzendentale Logik',
    original: { ...KRV_DE, start: 'Ohne Sinnlichkeit würde uns kein Gegenstand gegeben', end: 'kann Erkenntnis entspringen.' },
    english: { ...MEIKLEJOHN, start: 'Without the sensuous faculty no object would be given to us', end: 'can knowledge arise.' },
    sourceUrl: KRV_SRC, license: LICENSE,
    summaryEn: 'Thoughts without content are empty; intuitions without concepts are blind. Knowledge arises only when the senses and the understanding work together — neither alone is sufficient.',
    summaryZh: '没有内容的思维是空的，没有概念的直观是盲的。只有感性与知性结合，才能产生知识——任何一方单独都不够。',
    similarQuestions: ['How do we know things?', 'Is experience or reason more important?', 'What are the limits of knowledge?'],
    contextNote: 'One of the most quoted lines of the Critique. Kant joins the rationalist (Descartes, Leibniz) and empiricist (Locke, Hume) traditions: concepts without experience are empty, and raw experience without concepts yields no knowledge. Meiklejohn renders "leer" as "void".',
    tags: ['reason', 'truth', 'wisdom'], weight: 5,
  },
  {
    canonicalRef: 'Critique of Pure Reason Bxxx',
    chapterEn: 'Critique of Pure Reason — Preface to the Second Edition', chapterZh: '纯粹理性批判·第二版序言', chapterOrig: 'Kritik der reinen Vernunft — Vorrede zur zweiten Auflage',
    original: { ...KRV_DE, start: 'Ich mußte also das Wissen aufheben', end: 'der jederzeit gar sehr dogmatisch ist.' },
    english: { ...MEIKLEJOHN, start: 'I must, therefore, abolish knowledge', end: 'which militates against morality.' },
    sourceUrl: KRV_SRC, license: LICENSE,
    summaryEn: 'Kant had to limit the claims of knowledge to make room for belief. Metaphysics pursued without a prior critique of reason is the real source of the dogmatic unbelief that undermines morality.',
    summaryZh: '康德必须限制知识的僭越，以便为信仰留出地盘。未经理性批判就从事形而上学，正是那种与道德相冲突的独断式无信仰的真正根源。',
    similarQuestions: ['Can science explain everything?', 'Is there room for faith in a rational world?', 'What are the limits of reason?'],
    contextNote: 'From the Preface to the second edition (1787). By showing that speculative reason cannot prove or disprove God, freedom or immortality, Kant clears space for them as matters of practical (moral) belief. Meiklejohn translates "aufheben" as "abolish" and "Glauben" as "belief"; later translators often write "deny knowledge to make room for faith".',
    tags: ['faith', 'reason', 'doubt'], weight: 4,
  },
  {
    canonicalRef: 'Critique of Pure Reason A805/B833',
    chapterEn: 'Critique of Pure Reason — Canon of Pure Reason', chapterZh: '纯粹理性批判·纯粹理性的法规', chapterOrig: 'Kritik der reinen Vernunft — Kanon der reinen Vernunft',
    original: { ...KRV_DE, start: 'Alles Interesse meiner Vernunft', end: '3. Was darf ich hoffen?' },
    english: { ...MEIKLEJOHN, start: 'The whole interest of reason, speculative as well as practical', end: '3. WHAT MAY I HOPE?' },
    sourceUrl: KRV_SRC, license: LICENSE,
    summaryEn: 'Every interest of reason comes down to three questions: What can I know? What ought I to do? What may I hope?',
    summaryZh: '理性的全部关切都归结为三个问题：我能知道什么？我应当做什么？我可以希望什么？',
    similarQuestions: ['What are the most important questions in life?', 'What should philosophy try to answer?', 'How should I think about knowledge, duty and hope?'],
    contextNote: 'From the Canon of Pure Reason near the end of the Critique. The three questions map onto Kant\'s life work: theory of knowledge, ethics, and religion. In his Logic lectures he added a fourth — "What is man?" — to which the other three refer.',
    tags: ['meaning-of-life', 'reason', 'wisdom'], weight: 5,
  },
  {
    canonicalRef: 'Critique of Pure Reason A808/B836',
    chapterEn: 'Critique of Pure Reason — Canon of Pure Reason', chapterZh: '纯粹理性批判·纯粹理性的法规', chapterOrig: 'Kritik der reinen Vernunft — Kanon der reinen Vernunft',
    original: { ...KRV_DE, start: 'Das war die Beantwortung der ersten von den zwei Fragen', end: 'auch diese Hoffnung notwendigerweise damit verknüpfen.' },
    english: { ...MEIKLEJOHN, start: 'That is the answer to the first of the two questions of pure reason', end: 'necessarily also connect this hope with it.' },
    sourceUrl: KRV_SRC, license: LICENSE,
    summaryEn: 'The moral answer to "What ought I to do?" is: Do that which will make you worthy of happiness. The next question is whether, having made oneself worthy, one may also hope to be happy.',
    summaryZh: '对"我应当做什么"的道德回答是：去做那使你配得上幸福的事。接下来的问题是：一个人若使自己配得上幸福，是否也可以希望获得幸福。',
    similarQuestions: ['Should I pursue happiness or goodness?', 'Do good people deserve to be happy?', 'What is the point of being moral?'],
    contextNote: 'Kant separates being happy from being worthy of happiness: morality does not teach how to become happy but how to deserve it. The hope that worthiness and happiness will finally coincide is, for Kant, what leads reason to postulate God and a future life.',
    tags: ['happiness', 'virtue', 'duty'], weight: 4,
  },
  {
    canonicalRef: 'Perpetual Peace, Second Section (Ak 8:348–349)',
    chapterEn: 'Perpetual Peace — Second Section', chapterZh: '永久和平论·第二节', chapterOrig: 'Zum ewigen Frieden — Zweyter Abschnitt',
    original: { ...ZEF_DE, start: 'Der Friedenszustand unter Menschen, die neben', end: 'als einen Feind behandeln.' },
    english: { ...hastie('Second_Section'), start: 'A state of Peace among men who live side by side', end: 'as an enemy.' },
    sourceUrl: zefSrc('Second_Section'), license: LICENSE,
    summaryEn: 'Peace is not the natural condition of people living side by side; the state of nature is a state of war, or at least of constant threat. Peace must therefore be established — the mere absence of fighting is no guarantee of it.',
    summaryZh: '和平并不是比邻而居的人们的自然状态；自然状态是战争状态，至少是持续的威胁。因此和平必须被建立起来——仅仅没有交战并不能保障和平。',
    similarQuestions: ['How do we achieve lasting peace?', 'Is conflict inevitable?', 'What creates stability between nations?'],
    contextNote: 'The opening of the Second Section of Perpetual Peace (1795), which then sets out the "definitive articles": republican constitutions, a federation of free states, and cosmopolitan right. Kant\'s proposal is often cited as a precursor of the League of Nations and the United Nations.',
    tags: ['governance', 'justice', 'community'], weight: 4,
  },
  {
    canonicalRef: 'Perpetual Peace, First Supplement (Ak 8:366)',
    chapterEn: 'Perpetual Peace — First Supplement', chapterZh: '永久和平论·第一条补充', chapterOrig: 'Zum ewigen Frieden — Erster Zusatz',
    original: { ...ZEF_DE, start: 'Das Problem der Staatserrichtung ist', end: 'Ein solches Problem muß auflöslich seyn.' },
    english: { ...hastie('Supplements'), start: 'The problem of the institution of a State', end: 'Such a problem must be capable of solution.' },
    sourceUrl: zefSrc('Supplements'), license: LICENSE,
    summaryEn: 'Setting up a just state is a problem that could be solved even for a race of devils, provided they have intelligence: the constitution must be arranged so that selfish wills check one another and public conduct turns out as if people had no bad intentions.',
    summaryZh: '建立一个国家的问题，即使对一群魔鬼来说也是可以解决的，只要他们有理智：宪制必须安排得让各自的私心相互牵制，使公共行为的结果仿佛人们并无恶意一样。',
    similarQuestions: ['Can good institutions work with imperfect people?', 'Do we need people to be good for society to work?', 'Why do checks and balances matter?'],
    contextNote: 'Kant argues that a good political order does not depend on first making people morally good, but on the "mechanism of nature" — institutions that set self-interest against self-interest. It expresses the same realism about human nature as his line, in the 1784 essay on universal history, that nothing straight can be made from the crooked timber of humanity.',
    tags: ['governance', 'power', 'character'], weight: 4,
  },
  {
    canonicalRef: 'Critique of Practical Reason §7 (Ak 5:30)',
    chapterEn: 'Critique of Practical Reason — Analytic', chapterZh: '实践理性批判·分析论', chapterOrig: 'Kritik der praktischen Vernunft — Analytik',
    original: { ...KPV_DE, start: 'Handle so, daß die Maxime deines Willens', end: 'einer allgemeinen Gesetzgebung gelten könne.' },
    english: { ...ABBOTT_KPV, start: 'Act so that the maxim of thy will', end: 'as a principle of universal legislation.' },
    sourceUrl: KPV_SRC, license: LICENSE,
    summaryEn: 'The fundamental law of pure practical reason: act only on a maxim you could will to hold as a law for everyone.',
    summaryZh: '纯粹实践理性的基本法则：只按照你能同时意愿它成为普遍立法原则的准则去行动。',
    similarQuestions: ['How do I know if an action is morally right?', 'What if everyone did what I am about to do?', 'Is it ever okay to make an exception for myself?', 'What is the categorical imperative?'],
    contextNote: 'This is the categorical imperative as Kant states it in the Critique of Practical Reason (1788). The better-known wording ("Act only according to that maxim…") is from the Groundwork of the Metaphysics of Morals (1785), which is not in this collection; the test is the same: no exceptions for oneself.',
    tags: ['duty', 'reason', 'goodness'], weight: 5,
  },
  {
    canonicalRef: 'Critique of Practical Reason (Ak 5:87)',
    chapterEn: 'Critique of Practical Reason — Analytic', chapterZh: '实践理性批判·分析论', chapterOrig: 'Kritik der praktischen Vernunft — Analytik',
    original: { ...KPV_DE, start: 'Der Mensch ist zwar unheilig genug', end: 'ist Zweck an sich selbst.' },
    english: { ...ABBOTT_KPV, start: 'Man is indeed unholy enough', end: 'is an end in himself.' },
    sourceUrl: KPV_SRC, license: LICENSE,
    summaryEn: 'People are far from holy, yet the humanity in each person must be held sacred: anything else may be used merely as a means, but every rational being is an end in itself.',
    summaryZh: '人远非圣洁，但每个人身上的人性必须被视为神圣：其余一切都可以仅仅被当作手段，唯有人和一切有理性的存在者是目的本身。',
    similarQuestions: ['Is it wrong to use people?', 'Why does every person deserve respect?', 'What is human dignity?', 'Can I treat someone merely as a means to my goals?'],
    contextNote: 'The idea behind the Groundwork\'s "formula of humanity" (treat humanity never merely as a means, always also as an end), here in Kant\'s own words from the Critique of Practical Reason.',
    tags: ['equality', 'justice', 'duty'], weight: 5,
  },
  {
    canonicalRef: 'Critique of Practical Reason, Conclusion (Ak 5:161)',
    chapterEn: 'Critique of Practical Reason — Conclusion', chapterZh: '实践理性批判·结论', chapterOrig: 'Kritik der praktischen Vernunft — Beschluß',
    original: { ...KPV_DE, start: 'Zwei Dinge erfüllen das Gemüth', end: 'mit dem Bewußtsein meiner Existenz.' },
    english: { ...ABBOTT_KPV, start: 'Two things fill the mind with ever new and increasing admiration and awe', end: 'with the consciousness of my existence.' },
    sourceUrl: KPV_SRC, license: LICENSE,
    summaryEn: 'Two things fill the mind with ever-growing wonder and awe: the starry heavens above and the moral law within. Both are not distant speculations but directly bound up with one\'s own existence.',
    summaryZh: '有两样东西，越是经常而持久地思索，就越使心灵充满常新而日增的惊叹和敬畏：头上的星空和心中的道德法则。它们不是遥远的猜测，而与我自身的存在直接相连。',
    similarQuestions: ['What gives life a sense of awe?', 'Where does morality come from?', 'How do I feel small and significant at the same time?', 'What is worth wondering about?'],
    contextNote: 'The opening of the Conclusion of the Critique of Practical Reason (1788) — the line later engraved on Kant\'s memorial plaque in Königsberg.',
    tags: ['cosmos', 'reason', 'meaning-of-life'], weight: 5,
  },

];

const work: ExcerptWork = {
  thinkerSlug: 'kant',
  dataFile: 'kant-critiques-and-perpetual-peace.json',
  thinkerName: 'Immanuel Kant',
  tradition: 'enlightenment',
  supersedes: ['Groundwork & Critiques — Selected Passages', 'Critique of Pure Reason & Perpetual Peace (Selected Passages)'],
  work: {
    titleEn: 'The Critiques & Perpetual Peace (Selected Passages)',
    titleZh: '纯粹理性批判、实践理性批判与永久和平论（精选）',
    titleOrig: 'Kritik der reinen Vernunft · Kritik der praktischen Vernunft · Zum ewigen Frieden',
    language: 'german',
    circaYear: 1787,
    description:
      'Selected passages from Kant\'s Critique of Pure Reason (2nd ed., 1787), Critique of Practical Reason (1788) and Perpetual Peace (1795). German texts from Project Gutenberg; public-domain English translations by J. M. D. Meiklejohn (Critique of Pure Reason, 1855), T. K. Abbott (Critique of Practical Reason, 1873), both via Project Gutenberg, and William Hastie (Perpetual Peace, 1891, via English Wikisource).',
    copyright: 'public-domain',
    sourceUrl: 'https://www.gutenberg.org/ebooks/4280',
  },
  items,
};

export default work;
