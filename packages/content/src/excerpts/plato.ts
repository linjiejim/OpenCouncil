/**
 * Plato — selected dialogues (Apology, Crito, Republic, Symposium, Phaedrus, Meno).
 *   • Greek: Perseus Digital Library TEI (ed. Burnet), CC BY-SA 4.0
 *   • English: Benjamin Jowett (1871–1892; d. 1893), public domain, Project Gutenberg
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const grc = (work: string) =>
  ({
    url: `https://raw.githubusercontent.com/PerseusDL/canonical-greekLit/master/data/tlg0059/${work}/tlg0059.${work}.perseus-grc2.xml`,
    format: 'xml',
    lang: 'ancient-greek',
  }) as const;
const jowett = (pg: number) =>
  ({
    url: `https://www.gutenberg.org/cache/epub/${pg}/pg${pg}.txt`,
    format: 'text',
    translator: 'Benjamin Jowett (1871–1892)',
  }) as const;

const APOLOGY = { grc: grc('tlg002'), en: jowett(1656), url: 'https://www.gutenberg.org/ebooks/1656' };
const CRITO = { grc: grc('tlg003'), en: jowett(1657), url: 'https://www.gutenberg.org/ebooks/1657' };
const SYMPOSIUM = { grc: grc('tlg011'), en: jowett(1600), url: 'https://www.gutenberg.org/ebooks/1600' };
const PHAEDRUS = { grc: grc('tlg012'), en: jowett(1636), url: 'https://www.gutenberg.org/ebooks/1636' };
const MENO = { grc: grc('tlg024'), en: jowett(1643), url: 'https://www.gutenberg.org/ebooks/1643' };
const REPUBLIC = { grc: grc('tlg030'), en: jowett(1497) };
const republicBook = (anchor: number) =>
  `https://www.gutenberg.org/cache/epub/1497/pg1497-images.html#link2H_4_${String(anchor).padStart(4, '0')}`;

const LICENSE = 'Greek: CC BY-SA 4.0 (Perseus); English: public domain';

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Apology 37e–38a',
    chapterEn: 'The Apology (Defence of Socrates)', chapterZh: '申辩篇', chapterOrig: 'Ἀπολογία Σωκράτους',
    original: { ...APOLOGY.grc, start: 'ἴσως οὖν ἄν τις εἴποι·', end: 'πείθειν δὲ οὐ ῥᾴδιον.' },
    english: { ...APOLOGY.en, start: 'Some one will say: Yes, Socrates, but cannot you hold your tongue', end: 'although a thing of which it is hard for me to persuade you.' },
    sourceUrl: APOLOGY.url, license: LICENSE,
    summaryEn: 'Asked why he will not simply keep quiet and live in exile, Socrates answers that discussing virtue and examining himself and others every day is the greatest good for a human being: the unexamined life is not worth living.',
    summaryZh: '有人问苏格拉底为何不能闭口不言、去别处平安度日。他回答：每天谈论美德、审视自己和他人，是人最大的善；未经审视的人生不值得过。',
    similarQuestions: ['What makes life worth living?', 'Why should I reflect on my life?', 'Is self-awareness important?', 'How to live a meaningful life?', 'What is the point of philosophy?'],
    contextNote: 'Spoken at Socrates’ trial in 399 BCE, after the guilty verdict, when he was 70 and was invited to propose his own penalty. Exile was an option; he refused to stop philosophising. Jowett renders the famous sentence (ὁ δὲ ἀνεξέταστος βίος οὐ βιωτὸς ἀνθρώπῳ) as “the unexamined life is not worth living.”',
    tags: ['self-knowledge', 'meaning-of-life', 'virtue'], weight: 5,
  },
  {
    canonicalRef: 'Apology 21b–d',
    chapterEn: 'The Apology (Defence of Socrates)', chapterZh: '申辩篇', chapterOrig: 'Ἀπολογία Σωκράτους',
    original: { ...APOLOGY.grc, start: 'καὶ πολὺν μὲν χρόνον ἠπόρουν τί ποτε λέγει·', end: 'ὅτι ἃ μὴ οἶδα οὐδὲ οἴομαι εἰδέναι.' },
    english: { ...APOLOGY.en, start: 'After long consideration, I thought of a method of trying the question.', end: 'I seem to have slightly the advantage of him.' },
    sourceUrl: APOLOGY.url, license: LICENSE,
    summaryEn: 'To test the oracle that called him the wisest of men, Socrates questions a politician reputed to be wise and finds he is not. Neither of them knows anything truly fine and good, but Socrates is wiser in one small respect: he does not think he knows what he does not know.',
    summaryZh: '为了检验称他为最智慧之人的神谕，苏格拉底去盘问一位以智慧著称的政治家，发现此人并不智慧。两人都不真正懂得美与善，但苏格拉底在一点上略胜一筹：自己不知道的，他不自以为知道。',
    similarQuestions: ['What is wisdom?', 'How to be humble?', 'Am I as smart as I think?', 'Why is intellectual humility important?', 'How much do I really know?'],
    contextNote: 'The popular slogan “I know that I know nothing” is not in Plato; this is the passage it loosely paraphrases. Socrates’ claim is narrower: he does not suppose he knows what he does not know. The Delphic oracle had told his friend Chaerephon that no one was wiser than Socrates, and these cross-examinations earned him the enmity that led to his trial.',
    tags: ['wisdom', 'doubt', 'self-knowledge'], weight: 5,
  },
  {
    canonicalRef: 'Apology 30a–b',
    chapterEn: 'The Apology (Defence of Socrates)', chapterZh: '申辩篇', chapterOrig: 'Ἀπολογία Σωκράτους',
    original: { ...APOLOGY.grc, start: 'οὐδὲν γὰρ ἄλλο πράττων ἐγὼ περιέρχομαι', end: 'καὶ ἰδίᾳ καὶ δημοσίᾳ.' },
    english: { ...APOLOGY.en, start: 'For I do nothing but go about persuading you all', end: 'every other good of man, public as well as private.' },
    sourceUrl: APOLOGY.url, license: LICENSE,
    summaryEn: 'Socrates says his whole activity is urging people to care first for the improvement of the soul rather than for their bodies or property: virtue does not come from money, but money and every other good come from virtue.',
    summaryZh: '苏格拉底说，他所做的不过是劝人首先关心灵魂的完善，而不是身体和财产：美德不来自金钱，金钱和人的其他一切好东西，无论公私，都来自美德。',
    similarQuestions: ['Should I chase money or virtue?', 'Does wealth make you a better person?', 'What should I prioritize — career or character?', 'What brings true prosperity?'],
    contextNote: 'From Socrates’ defence speech. He presents his questioning of fellow citizens as a service to the god, and he himself lived in poverty. The sentence can also be read as “virtue makes money and everything else good for people” — translators differ on the grammar.',
    tags: ['virtue', 'wealth', 'soul'], weight: 4,
  },
  {
    canonicalRef: 'Republic 514a–515c',
    chapterEn: 'The Republic, Book VII', chapterZh: '理想国 · 第七卷', chapterOrig: 'Πολιτεία Ζ',
    original: { ...REPUBLIC.grc, start: 'μετὰ ταῦτα δή, εἶπον, ἀπείκασον', end: 'πολλὴ ἀνάγκη, ἔφη.' },
    english: { ...REPUBLIC.en, start: 'And now, I said, let me show in a figure', end: 'That is certain.' },
    sourceUrl: republicBook(10), license: LICENSE,
    summaryEn: 'The opening of the allegory of the cave: prisoners chained since childhood see only shadows cast on a wall by objects carried before a fire, and they take those shadows for the whole of reality. “Like ourselves,” Socrates says.',
    summaryZh: '洞穴寓言的开头：一群从小被锁住的囚徒，只能看到火光把身后搬运的器物投在墙上的影子，并把这些影子当作全部的真实。苏格拉底说：“他们就像我们。”',
    similarQuestions: ['Am I living in an illusion?', 'How to see reality clearly?', 'Why do people resist the truth?', 'What is the nature of reality?', 'Why is it painful to grow?'],
    contextNote: 'Republic VII opens with this image of “our nature in its education and want of education.” The allegory continues beyond this excerpt: a freed prisoner is painfully led up into the sunlight, and if he returned to tell the others they would laugh at him and might even kill him. It is often read alongside Socrates’ own fate.',
    tags: ['truth', 'education', 'wisdom'], weight: 5,
  },
  {
    canonicalRef: 'Republic 433a–b',
    chapterEn: 'The Republic, Book IV', chapterZh: '理想国 · 第四卷', chapterOrig: 'Πολιτεία Δ',
    original: { ...REPUBLIC.grc, start: 'ἀλλʼ, ἦν δʼ ἐγώ, ἄκουε εἴ τι ἄρα λέγω.', end: 'τὸ τὰ αὑτοῦ πράττειν.' },
    english: { ...REPUBLIC.en, start: 'Well then, tell me, I said, whether I am right or not:', end: 'may be assumed to be justice.' },
    sourceUrl: republicBook(7), license: LICENSE,
    summaryEn: 'Justice turns out to be the principle laid down when the city was founded: each person should practise the one thing their nature is best suited for. Justice is doing one’s own business and not being a busybody.',
    summaryZh: '正义原来就是建城之初定下的原则：每个人只做最适合自己天性的那一件事。正义就是做自己分内的事，不多管闲事。',
    similarQuestions: ['What is justice?', 'How should society be organized?', 'Should everyone do what they are best at?', 'What is my role in society?'],
    contextNote: 'Having found wisdom, courage and temperance in the ideal city, Socrates identifies justice as the remaining virtue that makes the others possible. He goes on to apply the same principle to the soul, where justice is each part (reason, spirit, appetite) doing its own work.',
    tags: ['justice', 'governance', 'duty'], weight: 4,
  },
  {
    canonicalRef: 'Symposium 211b–c',
    chapterEn: 'Symposium', chapterZh: '会饮篇', chapterOrig: 'Συμπόσιον',
    original: { ...SYMPOSIUM.grc, start: 'ὅταν δή τις ἀπὸ τῶνδε διὰ τὸ ὀρθῶς παιδεραστεῖν', end: 'καὶ γνῷ αὐτὸ τελευτῶν ὃ ἔστι καλόν.' },
    english: { ...SYMPOSIUM.en, start: 'He who from these ascending under the influence of true love', end: 'and at last knows what the essence of beauty is.' },
    sourceUrl: SYMPOSIUM.url, license: LICENSE,
    summaryEn: 'The right way of love is to use beautiful things as steps: from one beautiful body to all, from bodies to beautiful practices, from practices to beautiful kinds of knowledge, and finally to knowledge of beauty itself.',
    summaryZh: '爱的正确道路，是把美的事物当作阶梯：从一个美的身体到所有美的身体，从身体到美的行为，从行为到美的学问，最终认识美本身。',
    similarQuestions: ['What is love?', 'Is love more than physical attraction?', 'How does love help us grow?', 'What is the highest form of love?', 'Can love lead to wisdom?'],
    contextNote: 'From Socrates’ speech in the Symposium, where he recounts what the priestess Diotima of Mantinea taught him about love — the “ladder of love.” The Greek speaks of loving boys rightly (paiderastein), set in the customs of Athenian upper-class society; Jowett renders it “true love.”',
    tags: ['love', 'wisdom', 'soul'], weight: 5,
  },
  {
    canonicalRef: 'Crito 48a–b',
    chapterEn: 'Crito', chapterZh: '克力同篇', chapterOrig: 'Κρίτων',
    original: { ...CRITO.grc, start: 'οὐκ ἄρα, ὦ βέλτιστε, πάνυ ἡμῖν οὕτω φροντιστέον', end: 'μένει ἢ οὐ μένει; ΚΡ. μένει.' },
    english: { ...CRITO.en, start: 'Then, my friend, we must not regard what the many say of us', end: 'CRITO: Yes, it does.' },
    sourceUrl: CRITO.url, license: LICENSE,
    summaryEn: 'What matters is not what the many say but what the one who understands justice says, and the truth itself. Even if the many can kill us, the principle stands: not life, but a good life, is to be chiefly valued — and a good life is a just and honourable one.',
    summaryZh: '要紧的不是众人怎么说，而是懂得正义的那个人和真理本身怎么说。即使众人能置我们于死地，原则依然成立：最该看重的不是活着，而是活得好；而活得好就是活得正当、高尚。',
    similarQuestions: ['What matters more — length of life or quality?', 'How to live a good life?', 'Is it worth compromising principles to survive?', 'Should I care what others think of me?'],
    contextNote: 'In prison awaiting execution, Socrates is urged by his friend Crito to escape. He insists on reasoning from these agreed principles; the dialogue concludes that escaping would be unjust, and he stays to die.',
    tags: ['virtue', 'justice', 'meaning-of-life'], weight: 5,
  },
  {
    canonicalRef: 'Phaedrus 246a–b',
    chapterEn: 'Phaedrus', chapterZh: '斐德罗篇', chapterOrig: 'Φαῖδρος',
    original: { ...PHAEDRUS.grc, start: 'περὶ δὲ τῆς ἰδέας αὐτῆς ὧδε λεκτέον.', end: 'ἡ περὶ ἡμᾶς ἡνιόχησις.' },
    english: { ...PHAEDRUS.en, start: 'Of the nature of the soul, though her true form', end: 'gives a great deal of trouble to him.' },
    sourceUrl: PHAEDRUS.url, license: LICENSE,
    summaryEn: 'The soul is pictured as a charioteer with a pair of winged horses. The gods’ horses are all good, but the human charioteer drives one noble horse and one ignoble one, so driving them is necessarily hard.',
    summaryZh: '灵魂被比作一位驾着两匹带翼骏马的御者。诸神的马都是好马，人的御者却驾着一匹高贵、一匹卑劣的马，所以驾驭起来必然艰难。',
    similarQuestions: ['Why am I conflicted about what to do?', 'How to control my impulses?', 'Why do I want things I know are bad for me?', 'What is self-control?'],
    contextNote: 'From Socrates’ second speech in the Phaedrus. The charioteer is commonly read as reason, the noble horse as spirited emotion and the unruly horse as appetite, matching the three-part soul of the Republic; the myth goes on to tell how souls lose their wings and fall into bodies.',
    tags: ['soul', 'desire', 'discipline'], weight: 4,
  },
  {
    canonicalRef: 'Meno 81c–d',
    chapterEn: 'Meno', chapterZh: '美诺篇', chapterOrig: 'Μένων',
    original: { ...MENO.grc, start: 'ἅτε οὖν ἡ ψυχὴ ἀθάνατός τε οὖσα', end: 'ἀνάμνησις ὅλον ἐστίν.' },
    english: { ...MENO.en, start: 'The soul, then, as being immortal', end: 'all enquiry and all learning is but recollection.' },
    sourceUrl: MENO.url, license: LICENSE,
    summaryEn: 'Because the soul is immortal and has seen all things, it already has knowledge of them; what we call learning is recollection. Having recalled one thing, a person can find out all the rest, if they are strenuous and do not give up the search.',
    summaryZh: '灵魂不朽，见过一切，所以本就拥有关于万物的知识；我们所谓的学习其实是回忆。只要回想起一件事，人就能找出其余的一切，前提是他勇于探究、不半途而废。',
    similarQuestions: ['How does real learning happen?', 'Do I already have the answers within me?', 'Is knowledge innate or learned?', 'What makes a great teacher?', 'Why keep searching when it is hard?'],
    contextNote: 'Socrates’ reply to “Meno’s paradox” — that one can neither seek what one knows nor what one does not know. He then demonstrates the theory of recollection (anamnesis) by leading an untaught slave boy, through questions, to a geometrical truth. The dialogue’s larger question is whether virtue can be taught.',
    tags: ['education', 'soul', 'perseverance'], weight: 4,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'plato',
  dataFile: 'plato-dialogues.json',
  thinkerName: 'Plato',
  tradition: 'ancient-greek',
  supersedes: ['The Dialogues (Selected)'],
  work: {
    titleEn: 'The Dialogues (Selected Passages)',
    titleZh: '对话录（精选）',
    titleOrig: 'Διάλογοι',
    language: 'ancient-greek',
    circaYear: -380,
    description:
      'Selected passages from Plato’s dialogues — the Apology, Crito, Republic, Symposium, Phaedrus and Meno — presenting the method and teachings of Socrates. Greek text (ed. Burnet) from the Perseus Digital Library (CC BY-SA 4.0) with the public-domain English translations of Benjamin Jowett, via Project Gutenberg.',
    copyright: 'Greek CC BY-SA 4.0 · English PD',
    sourceUrl: 'https://www.gutenberg.org/ebooks/author/93',
  },
  items,
};

export default work;
