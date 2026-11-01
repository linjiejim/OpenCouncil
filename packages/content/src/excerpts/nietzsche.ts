/**
 * Friedrich Nietzsche — Zarathustra, Beyond Good and Evil, Twilight of the Idols (selected passages).
 *   • German: Also sprach Zarathustra (PG #7205), Jenseits von Gut und Böse (PG #7204),
 *     Götzen-Dämmerung (PG #7203) — Project Gutenberg, public domain.
 *   • English: Thomas Common (d. 1919) — Thus Spake Zarathustra (1909), PG #1998;
 *     Helen Zimmern (d. 1934) — Beyond Good and Evil (1907), PG #4363;
 *     Thomas Common — The Twilight of the Idols (1896, Works of Friedrich Nietzsche vol. XI,
 *     ed. Tille), the only public-domain English version that passes life+70 (Ludovici 1911
 *     does not); no proofread transcription exists, so it is cut from the archive.org OCR of the
 *     1896 printing, and only where that OCR is clean.
 *
 * The Gay Science and On the Genealogy of Morals are not used: no German text in an allowed
 * source (Gutenberg's "Der tolle Mensch" #19793 is an audio book only).
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const ZA_DE = {
  url: 'https://www.gutenberg.org/cache/epub/7205/pg7205-images.html',
  format: 'html',
  lang: 'german',
} as const;
const ZA_EN = {
  url: 'https://www.gutenberg.org/cache/epub/1998/pg1998.txt',
  format: 'text',
  translator: 'Thomas Common (1909)',
} as const;
const JGB_DE = {
  url: 'https://www.gutenberg.org/cache/epub/7204/pg7204-images.html',
  format: 'html',
  lang: 'german',
} as const;
const BGE_EN = {
  url: 'https://www.gutenberg.org/cache/epub/4363/pg4363.txt',
  format: 'text',
  translator: 'Helen Zimmern (1907)',
} as const;
const GD_DE = {
  url: 'https://www.gutenberg.org/cache/epub/7203/pg7203-images.html',
  format: 'html',
  lang: 'german',
} as const;
const TI_EN = {
  url: 'https://archive.org/download/casewagnertwili00commgoog/casewagnertwili00commgoog_djvu.txt',
  format: 'text',
  translator: 'Thomas Common (1896)',
} as const;
const LICENSE = 'German: public domain (Project Gutenberg); English: public domain';
const ZA_SRC = 'https://www.gutenberg.org/ebooks/1998';
const BGE_SRC = 'https://www.gutenberg.org/ebooks/4363';

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Thus Spoke Zarathustra, Prologue 2',
    chapterEn: 'Thus Spoke Zarathustra — Prologue', chapterZh: '查拉图斯特拉如是说·前言', chapterOrig: 'Also sprach Zarathustra — Vorrede',
    original: { ...ZA_DE, start: 'Als Zarathustra aber allein war, sprach er also zu seinem Herzen', end: 'dass Gott todt ist!“' },
    english: { ...ZA_EN, start: 'When Zarathustra was alone, however, he said to his heart', end: 'GOD IS DEAD!”' },
    sourceUrl: ZA_SRC, license: LICENSE,
    summaryEn: 'Leaving an old hermit who still praises God in the forest, Zarathustra marvels that the saint has not yet heard that God is dead.',
    summaryZh: '查拉图斯特拉告别了仍在林中赞美上帝的老隐士，心中惊叹：这位圣者竟然还没有听说，上帝已经死了。',
    similarQuestions: ['What happens when we lose our faith?', 'Where do values come from without religion?', 'How do I create meaning in a meaningless world?'],
    contextNote: 'The first announcement of the death of God in Zarathustra (1883); Nietzsche had introduced the theme a year earlier in The Gay Science §125 ("The Madman"). It is not a triumphant slogan but a diagnosis: the belief that grounded Western values has lost its hold, and new values must be created.',
    tags: ['faith', 'divinity', 'meaning-of-life'], weight: 5,
  },
  {
    canonicalRef: 'Thus Spoke Zarathustra, Prologue 3',
    chapterEn: 'Thus Spoke Zarathustra — Prologue', chapterZh: '查拉图斯特拉如是说·前言', chapterOrig: 'Also sprach Zarathustra — Vorrede',
    original: { ...ZA_DE, start: 'Ich lehre euch den Übermenschen.', end: 'für den Übermenschen sein: ein Gelächter oder eine schmerzliche Scham.' },
    english: { ...ZA_EN, start: 'I TEACH YOU THE SUPERMAN.', end: 'to the Superman: a laughing-stock, a thing of shame.' },
    sourceUrl: ZA_SRC, license: LICENSE,
    summaryEn: 'Man is something to be surpassed. All beings so far have created something beyond themselves; as the ape is to man, so man shall be to the Superman.',
    summaryZh: '人是应当被超越的东西。迄今一切存在者都创造了超越自身的东西；猿猴之于人是什么，人之于超人也将是什么。',
    similarQuestions: ['What should I aspire to become?', 'Is human nature fixed?', 'How do I transcend my limitations?'],
    contextNote: 'Zarathustra\'s first speech to the crowd in the market-place. The Übermensch (Common: "Superman"; often "Overman") is not a political or racial ideal but a call to self-overcoming — to surpass what one is and create new values.',
    tags: ['meaning-of-life', 'character', 'freedom'], weight: 5,
  },
  {
    canonicalRef: 'Thus Spoke Zarathustra, Prologue 5',
    chapterEn: 'Thus Spoke Zarathustra — Prologue', chapterZh: '查拉图斯特拉如是说·前言', chapterOrig: 'Also sprach Zarathustra — Vorrede',
    original: { ...ZA_DE, start: 'Ich sage euch: man muss noch Chaos in sich haben', end: 'ihr habt noch Chaos in euch.' },
    english: { ...ZA_EN, start: 'I tell you: one must still have chaos in one', end: 'ye have still chaos in you.' },
    sourceUrl: ZA_SRC, license: LICENSE,
    summaryEn: 'One must still have chaos within oneself to give birth to a dancing star — and, Zarathustra tells the crowd, you still have chaos in you.',
    summaryZh: '人必须在自身中仍有混沌，才能孕育出一颗跳舞的星——查拉图斯特拉告诉人群：你们身上还有混沌。',
    similarQuestions: ['Is struggle necessary for creativity?', 'Can order and chaos coexist?', 'Is my inner turmoil a bad thing?'],
    contextNote: 'Spoken just before Zarathustra describes the "last man", who has made life small, safe and comfortable and no longer longs for anything beyond himself. Inner chaos is the raw material of creation, which the last man has lost.',
    tags: ['suffering', 'character', 'freedom'], weight: 4,
  },
  {
    canonicalRef: 'Thus Spoke Zarathustra IV, The Drunken Song 10',
    chapterEn: 'Thus Spoke Zarathustra — Part IV, The Drunken Song', chapterZh: '查拉图斯特拉如是说·第四部·醉歌', chapterOrig: 'Also sprach Zarathustra — Das trunkne Lied',
    original: { ...ZA_DE, start: 'Sagtet ihr jemals ja zu Einer Lust?', end: 'Denn alle Lust will—Ewigkeit!' },
    english: { ...ZA_EN, start: 'Said ye ever Yea to one joy?', end: 'FOR JOYS ALL WANT—ETERNITY!' },
    sourceUrl: ZA_SRC, license: LICENSE,
    summaryEn: 'To say yes to a single joy is to say yes to all woe, because all things are chained together. Whoever has wished a moment to return has wished everything to come back — and so has loved the world.',
    summaryZh: '对一种快乐说"是"，就是对一切痛苦说"是"，因为万物彼此相连。谁曾希望某一刻重来，谁就希望一切都回来——于是他爱了这个世界。',
    similarQuestions: ['How do I accept my past?', 'Can I learn to love my life as it is?', 'How do I stop regretting my choices?'],
    contextNote: 'Near the end of Zarathustra, at midnight. It is Nietzsche\'s poetic expression of the eternal recurrence and of what he elsewhere calls amor fati (love of fate): affirming life means affirming all of it, suffering included.',
    tags: ['destiny', 'happiness', 'suffering'], weight: 5,
  },
  {
    canonicalRef: 'Beyond Good and Evil 108',
    chapterEn: 'Beyond Good and Evil — Apophthegms and Interludes', chapterZh: '善恶的彼岸·格言与插曲', chapterOrig: 'Jenseits von Gut und Böse — Sprüche und Zwischenspiele',
    original: { ...JGB_DE, start: 'Es giebt gar keine moralischen Phänomene', end: 'Ausdeutung von Phänomenen…..' },
    english: { ...BGE_EN, start: 'There is no such thing as moral phenomena', end: 'moral interpretation of phenomena.' },
    sourceUrl: BGE_SRC, license: LICENSE,
    summaryEn: 'There are no moral phenomena at all, only a moral interpretation of phenomena.',
    summaryZh: '根本不存在道德现象，只存在对现象的道德解释。',
    similarQuestions: ['Is morality objective or subjective?', 'Who decides what is right and wrong?', 'Are moral judgments just opinions?'],
    contextNote: 'Beyond Good and Evil (1886), §108. Nietzsche denies that moral values are found in events themselves; they are interpretations that people project onto them — a key step in his "genealogical" questioning of morality.',
    tags: ['goodness', 'truth', 'doubt'], weight: 4,
  },
  {
    canonicalRef: 'Beyond Good and Evil 146',
    chapterEn: 'Beyond Good and Evil — Apophthegms and Interludes', chapterZh: '善恶的彼岸·格言与插曲', chapterOrig: 'Jenseits von Gut und Böse — Sprüche und Zwischenspiele',
    original: { ...JGB_DE, start: 'Wer mit Ungeheuern kämpft', end: 'blickt der Abgrund auch in dich hinein.' },
    english: { ...BGE_EN, start: 'He who fights with monsters', end: 'the abyss will also gaze into thee.' },
    sourceUrl: BGE_SRC, license: LICENSE,
    summaryEn: 'Whoever fights monsters should take care not to become one; if you gaze long into an abyss, the abyss also gazes into you.',
    summaryZh: '与怪物搏斗的人，要当心自己不要因此变成怪物；你久久凝视深渊时，深渊也在凝视你。',
    similarQuestions: ['How do I fight injustice without becoming bitter?', 'Can fighting evil corrupt you?', 'How do I maintain my integrity in conflict?'],
    contextNote: 'Beyond Good and Evil, §146 — one of Nietzsche\'s most quoted aphorisms. It warns of the psychological cost of long engagement with darkness: what we oppose can reshape us.',
    tags: ['character', 'self-knowledge', 'suffering'], weight: 5,
  },
  {
    canonicalRef: 'Beyond Good and Evil 229',
    chapterEn: 'Beyond Good and Evil — Our Virtues', chapterZh: '善恶的彼岸·我们的美德', chapterOrig: 'Jenseits von Gut und Böse — Unsere Tugenden',
    original: { ...JGB_DE, start: 'Fast Alles, was wir "höhere Cultur" nennen', end: 'es hat sich nur - vergöttlicht.' },
    english: { ...BGE_EN, start: 'Almost everything that we call "higher culture"', end: 'it has only been--transfigured.' },
    sourceUrl: BGE_SRC, license: LICENSE,
    summaryEn: 'Almost everything we call "higher culture" rests on the spiritualising and deepening of cruelty. The "wild beast" in us was never killed; it lives on, transfigured.',
    summaryZh: '我们所说的"高等文化"几乎全都建立在对残酷的精神化与深化之上。我们身上的那头"野兽"从未被杀死；它依然活着，只是被神化了。',
    similarQuestions: ['Is civilization built on violence?', 'Why is self-discipline so hard?', 'What is the cost of progress?'],
    contextNote: 'Beyond Good and Evil, §229. Nietzsche goes on to find this sublimated cruelty in tragedy, religious self-denial and even the search for knowledge, which forces the mind to say no where it would like to believe. He develops the theme in On the Genealogy of Morals (1887): "without cruelty, no festival".',
    tags: ['suffering', 'self-knowledge', 'power'], weight: 3,
  },
  {
    canonicalRef: 'Twilight of the Idols, Maxims and Arrows 8',
    chapterEn: 'Twilight of the Idols — Maxims and Arrows', chapterZh: '偶像的黄昏·箴言与箭', chapterOrig: 'Götzen-Dämmerung — Sprüche und Pfeile',
    original: { ...GD_DE, start: 'Aus der Kriegsschule des Lebens.', end: 'macht mich stärker.' },
    english: { ...TI_EN, start: 'From the military school of life.', end: 'strengthens me.' },
    sourceUrl: 'https://archive.org/details/casewagnertwili00commgoog', license: LICENSE,
    summaryEn: 'From the military school of life: what does not kill me makes me stronger.',
    summaryZh: '来自生命的军校：杀不死我的，使我更强大。',
    similarQuestions: ['How do I recover from setbacks?', 'Does suffering make you stronger?', 'How do I build resilience?'],
    contextNote: 'Twilight of the Idols (1888/89), "Maxims and Arrows" §8 — Common (1896) titles the chapter "Apophthegms and Darts". Perhaps Nietzsche\'s most famous line, written in his last productive year while he was in chronically poor health.',
    tags: ['perseverance', 'suffering', 'courage'], weight: 5,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'nietzsche',
  dataFile: 'nietzsche-selected-works.json',
  thinkerName: 'Friedrich Nietzsche',
  tradition: 'existentialism',
  supersedes: ['Thus Spoke Zarathustra & Selected Works'],
  work: {
    titleEn: 'Zarathustra, Beyond Good and Evil & Twilight of the Idols (Selected Passages)',
    titleZh: '查拉图斯特拉如是说、善恶的彼岸与偶像的黄昏（精选）',
    titleOrig: 'Also sprach Zarathustra · Jenseits von Gut und Böse · Götzen-Dämmerung',
    language: 'german',
    circaYear: 1885,
    description:
      'Selected passages from Thus Spoke Zarathustra (1883–85), Beyond Good and Evil (1886) and Twilight of the Idols (1889). German texts from Project Gutenberg; public-domain English translations by Thomas Common (Thus Spake Zarathustra, 1909, via Project Gutenberg; The Twilight of the Idols, 1896, via an archive.org scan) and Helen Zimmern (Beyond Good and Evil, 1907, via Project Gutenberg).',
    copyright: 'public-domain',
    sourceUrl: 'https://www.gutenberg.org/ebooks/1998',
  },
  items,
};

export default work;
