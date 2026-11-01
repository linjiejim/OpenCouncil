/**
 * Marcus Aurelius — Meditations.
 *   • Greek: Perseus Digital Library TEI (ed. Leopold), CC BY-SA 4.0
 *   • English: George Long (1862), public domain, Project Gutenberg #15877
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const GRC = {
  url: 'https://raw.githubusercontent.com/PerseusDL/canonical-greekLit/master/data/tlg0562/tlg001/tlg0562.tlg001.perseus-grc2.xml',
  format: 'xml',
  lang: 'ancient-greek',
} as const;
const LONG = {
  url: 'https://www.gutenberg.org/cache/epub/15877/pg15877.txt',
  format: 'text',
  translator: 'George Long (1862)',
} as const;
const LICENSE = 'Greek: CC BY-SA 4.0 (Perseus); English: public domain';
const src = (book: number) => `https://www.gutenberg.org/ebooks/15877#book-${book}`;

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Meditations 2.1',
    chapterEn: 'Book II', chapterZh: '第二卷', chapterOrig: 'Βιβλίον Β',
    original: { ...GRC, start: 'Ἕωθεν προλέγειν ἑαυτῷ', end: 'τὸ ἀγανακτεῖν καὶ ἀποστρέφεσθαι.' },
    english: { ...LONG, start: 'Begin the morning by saying to thyself', end: 'to be vexed and to turn away.' },
    sourceUrl: src(2), license: LICENSE,
    summaryEn: 'Expect to meet difficult people each day. They act from ignorance of good and evil; since they share in the same reason as you, they cannot truly harm you, and you should not hate them.',
    summaryZh: '每天出门前就预料到会遇见难相处的人。他们出于对善恶的无知而行事；他们与你同样分有理性，所以既伤不了你，你也不该憎恨他们。',
    similarQuestions: ['How to deal with difficult people?', 'How to start the day with the right mindset?', 'Why do people hurt others?', 'How to not take things personally?'],
    contextNote: 'The opening of Book II, which a heading in the manuscripts places "among the Quadi on the Granua" — written while Marcus was on campaign on the Danube frontier.',
    tags: ['character', 'community', 'discipline'], weight: 5,
  },
  {
    canonicalRef: 'Meditations 2.11',
    chapterEn: 'Book II', chapterZh: '第二卷', chapterOrig: 'Βιβλίον Β',
    original: { ...GRC, start: 'Ὡς ἤδη δυνατοῦ ὄντος ἐξιέναι τοῦ βίου', end: 'καὶ λέγειν καὶ διανοεῖσθαι.' },
    english: { ...LONG, start: 'Since it is possible that thou mayest depart from life', end: 'regulate every act and thought accordingly.' },
    sourceUrl: src(2), license: LICENSE,
    summaryEn: 'Since you could leave life at any moment, let that possibility govern every act and thought.',
    summaryZh: '你随时可能离开人世，那就让这一点来约束你的每一个行动和念头。',
    similarQuestions: ['How to live without regret?', 'How to deal with fear of death?', 'What really matters in life?', 'How to stop wasting time?'],
    contextNote: 'Remembering death is a recurring Stoic exercise in the Meditations. Marcus reigned through the Antonine Plague and long frontier wars.',
    tags: ['death', 'meaning-of-life', 'discipline'], weight: 5,
  },
  {
    canonicalRef: 'Meditations 2.15',
    chapterEn: 'Book II', chapterZh: '第二卷', chapterOrig: 'Βιβλίον Β',
    original: { ...GRC, start: 'Ὅτι πᾶν ὑπόληψις.', end: 'μέχρι τοῦ ἀληθοῦς δέχηται.' },
    english: { ...LONG, start: 'Remember that all is opinion.', end: 'as far as it is true.' },
    sourceUrl: src(2), license: LICENSE,
    summaryEn: 'Everything depends on how we judge it. The saying is useful as far as it is true.',
    summaryZh: '一切取决于我们如何看待它。这句话在它为真的范围内是有用的。',
    similarQuestions: ['Is everything just a matter of perspective?', 'How can I change how I feel about events?', 'Why do things upset me so much?'],
    contextNote: 'Monimus was a Cynic philosopher who called everything "vapour" (typhos). Marcus endorses the point only "as far as it is true" — a qualified claim, not relativism.',
    tags: ['self-knowledge', 'truth', 'wisdom'], weight: 4,
  },
  {
    canonicalRef: 'Meditations 5.1',
    chapterEn: 'Book V', chapterZh: '第五卷', chapterOrig: 'Βιβλίον Ε',
    original: { ...GRC, start: 'Ὄρθρου, ὅταν δυσόκνως ἐξεγείρῃ', end: 'ἐμαυτὸν θάλπω;' },
    english: { ...LONG, start: 'In the morning when thou risest unwillingly', end: 'keep myself warm?' },
    sourceUrl: src(5), license: LICENSE,
    summaryEn: 'When you don’t want to get up, remember you are rising to do the work of a human being — the very thing you exist for.',
    summaryZh: '早上不想起床时，提醒自己：我起身是去做一个人该做的事——那正是我存在的目的。',
    similarQuestions: ['How to find motivation in the morning?', 'How to overcome laziness?', 'What is my purpose?', 'Why should I work hard?'],
    contextNote: 'One of the most human moments in the Meditations: the emperor arguing with himself about getting out of bed.',
    tags: ['duty', 'discipline', 'meaning-of-life'], weight: 4,
  },
  {
    canonicalRef: 'Meditations 5.16',
    chapterEn: 'Book V', chapterZh: '第五卷', chapterOrig: 'Βιβλίον Ε',
    original: { ...GRC, start: 'Οἷα ἂν πολλάκις φαντασθῇς', end: 'ὑπὸ τῶν φαντασιῶν ἡ ψυχή.' },
    english: { ...LONG, start: 'Such as are thy habitual thoughts', end: 'the soul is dyed by the thoughts.' },
    sourceUrl: src(5), license: LICENSE,
    summaryEn: 'Your habitual thoughts shape the character of your mind; the soul takes on the colour of its thoughts.',
    summaryZh: '你惯常的想法塑造了你心灵的品性；灵魂会被它的念头所浸染。',
    similarQuestions: ['How do my thoughts affect my life?', 'How to become a more positive person?', 'Can I change my character?', 'How to train my mind?'],
    contextNote: 'The image is of dyeing cloth: repeated impressions gradually colour the soul. It anticipates modern ideas of habit formation.',
    tags: ['self-knowledge', 'character', 'practice'], weight: 5,
  },
  {
    canonicalRef: 'Meditations 7.67',
    chapterEn: 'Book VII', chapterZh: '第七卷', chapterOrig: 'Βιβλίον Ζ',
    original: { ...GRC, start: 'τούτου μέμνησο ἀεὶ καὶ ἔτι ἐκείνου', end: 'καὶ εὐπειθὴς θεῷ.' },
    english: { ...LONG, start: 'Always bear this in mind; and another thing too', end: 'social and obedient to God.' },
    sourceUrl: src(7), license: LICENSE,
    summaryEn: 'Very little is needed for a happy life. Even if you will never be a great thinker, you can still be free, modest, social and obedient to God.',
    summaryZh: '幸福的生活所需极少。即使你成不了大学问家，也依然可以自由、谦逊、合群、顺从神意。',
    similarQuestions: ['What do I really need to be happy?', 'Am I enough without achievements?', 'How to be content with less?'],
    contextNote: 'Marcus consoles himself for not becoming the logician or natural philosopher he had hoped to be: the good life does not depend on such attainments.',
    tags: ['happiness', 'simplicity', 'virtue'], weight: 4,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'marcus-aurelius',
  dataFile: 'marcus-aurelius-meditations.json',
  thinkerName: 'Marcus Aurelius',
  tradition: 'stoicism',
  supersedes: ['Meditations'],
  work: {
    titleEn: 'Meditations (Selected Passages)',
    titleZh: '沉思录（精选）',
    titleOrig: 'Τὰ εἰς ἑαυτόν',
    language: 'ancient-greek',
    circaYear: 175,
    description:
      'Selected passages from the private notebooks of the Roman emperor Marcus Aurelius. Greek text from the Perseus Digital Library (CC BY-SA 4.0) with the public-domain English translation of George Long (1862), via Project Gutenberg.',
    copyright: 'Greek CC BY-SA 4.0 · English PD',
    sourceUrl: 'https://www.gutenberg.org/ebooks/15877',
  },
  items,
};

export default work;
