/**
 * Wang Yangming — Chuanxi Lu 傳習錄 (Instructions for Practical Living).
 *   • Chinese: Chinese Wikisource, 傳習錄/卷上 and 傳習錄/卷下 (public domain).
 *     Section numbers there follow the standard numbering (Wing-tsit Chan).
 *   • English: Frederick Goodrich Henke, "The Philosophy of Wang Yang-ming" (1916),
 *     the only pre-1931 English translation. Henke died in 1963, so it is public
 *     domain in the US by publication date only (not life+70) — an accepted
 *     exception for this work. No proofread transcription exists, so the text is
 *     the archive.org OCR of two scans (University of Toronto and University of
 *     California copies); every span was chosen to avoid OCR errors, line-break
 *     hyphenation, footnote markers and page headers, and checked word by word
 *     against both scans.
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const zh = (vol: '上' | '下') =>
  ({
    url: `https://zh.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(`傳習錄/卷${vol}`)}&prop=text&format=json`,
    format: 'mediawiki',
    lang: 'classical-chinese',
  }) as const;
const ia = (id: string) => `https://archive.org/download/${id}/${id}_djvu.txt`;
const TORONTO = 'philosophyofwang00wanguoft';
const CALIFORNIA = 'philosophyofwang00wangiala';
const henke = (id: string) =>
  ({ url: ia(id), format: 'text', translator: 'Frederick Goodrich Henke (1916)' }) as const;
const LICENSE = 'Chinese: public domain (Chinese Wikisource); English: public domain in the US (published 1916)';
const page = (id: string, p: number) => `https://archive.org/details/${id}/page/${p}/mode/1up`;

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Chuanxi Lu I.5 (a)',
    chapterEn: 'Vol. I — Xu Ai’s record', chapterZh: '卷上·徐爱录', chapterOrig: '傳習錄上·徐愛錄',
    original: { ...zh('上'), start: '知是行之始，行是知之成。', end: '只說一個行，已自有知在。' },
    english: { ...henke(TORONTO), start: 'Knowledge is the beginning of practice', end: 'the knowing is already included.' },
    sourceUrl: page(TORONTO, 55), license: LICENSE,
    summaryEn: 'Knowing is the beginning of acting and acting is the completion of knowing. Properly understood, to speak of one is already to include the other.',
    summaryZh: '知是行的开端，行是知的完成。真正领会了，说一个“知”，行已在其中；说一个“行”，知也已在其中。',
    similarQuestions: ['Why do I know what\'s right but fail to do it?', 'How to bridge the gap between knowing and doing?', 'Is knowledge without action valuable?', 'What is the relationship between theory and practice?'],
    contextNote: 'From the classic statement of the "unity of knowledge and action" (知行合一), Wang Yangming\'s best-known doctrine. It answers his disciple Xu Ai, who held that people often know filial duty yet fail to practise it, so knowing and acting must be two things. Wang was arguing against the prevailing reading of Zhu Xi that knowledge must come first and action follow.',
    tags: ['practice', 'wisdom', 'self-knowledge'], weight: 5,
  },
  {
    canonicalRef: 'Chuanxi Lu I.5 (b)',
    chapterEn: 'Vol. I — Xu Ai’s record', chapterZh: '卷上·徐爱录', chapterOrig: '傳習錄上·徐愛錄',
    original: { ...zh('上'), start: '知寒，必已自寒了；', end: '不曾有私意隔斷的。' },
    english: { ...henke(TORONTO), start: 'Likewise to understand cold one must first have endured cold', end: 'before selfish aims have separated them.' },
    sourceUrl: page(TORONTO, 54), license: LICENSE,
    summaryEn: 'To know cold you must have felt cold; to know hunger you must have been hungry. Knowing and doing cannot be pulled apart — that is their original state, before selfish aims divide them.',
    summaryZh: '要知道冷，必定自己已经冷过；要知道饿，必定自己已经饿过。知与行怎么分得开？这才是知行的本来面目，只是被私意隔断了。',
    similarQuestions: ['Why don\'t I act on what I know?', 'Can I really understand something I have never experienced?', 'How to turn knowledge into action?', 'Why is self-improvement so hard?'],
    contextNote: 'Same conversation as above. Just before this, Wang says "No one who really has knowledge fails to practice it" (未有知而不行者) and that knowing without acting is simply not yet knowing (知而不行，只是未知); the analogies of cold and hunger illustrate that claim.',
    tags: ['practice', 'self-knowledge', 'truth'], weight: 5,
  },
  {
    canonicalRef: 'Chuanxi Lu I.3',
    chapterEn: 'Vol. I — Xu Ai’s record', chapterZh: '卷上·徐爱录', chapterOrig: '傳習錄上·徐愛錄',
    original: { ...zh('上'), start: '都只在此心，心即理也。', end: '便是信與仁。' },
    english: { ...henke(CALIFORNIA), start: 'They are all in the mind, for the mind is itself', end: 'emerge, sincerity and benevolence.' },
    sourceUrl: page(CALIFORNIA, 51), license: LICENSE,
    summaryEn: 'The principles of filial piety, loyalty, sincerity and benevolence are not found in parents, rulers, friends or subjects but in one\'s own mind, which is itself principle. A mind free of selfish desire needs nothing added from outside; its acts are simply right.',
    summaryZh: '孝、忠、信、仁的道理不在父母、君主、朋友、百姓身上，而在自己心中——心即理。心没有私欲遮蔽，就是天理，不必从外面添加一分；由这样的心发出来，自然是孝、是忠、是信与仁。',
    similarQuestions: ['Where does morality come from?', 'Should I follow my heart?', 'How to know right from wrong?', 'Do I need external authorities to guide me?'],
    contextNote: 'Wang\'s doctrine that "the mind is principle" (心即理) answers Xu Ai\'s worry that seeking the good only in the mind would neglect the principles of worldly affairs. Earlier in the same exchange Wang asks, "Is there any law apart from the mind?" It directly challenged Zhu Xi\'s view that principle must be investigated in external things.',
    tags: ['goodness', 'self-knowledge', 'virtue'], weight: 5,
  },
  {
    canonicalRef: 'Chuanxi Lu III.206',
    chapterEn: 'Vol. III — Chen Jiuchuan’s record', chapterZh: '卷下·陈九川录', chapterOrig: '傳習錄下·陳九川錄',
    original: { ...zh('下'), start: '爾那一點良知，是爾自家底準則。', end: '實實落落依著他做去' },
    english: { ...henke(TORONTO), start: 'The little intuitive knowledge of good you have is your own standard.', end: 'but must truly follow its lead.' },
    sourceUrl: page(TORONTO, 150), license: LICENSE,
    summaryEn: 'Your innate knowledge of the good is your own standard. Wherever your thoughts go, it knows when they are right and when they are wrong. Do not deceive it — simply follow it, honestly and concretely.',
    summaryZh: '你那一点良知，就是你自己的准则。念头起处，是的它便知是，非的它便知非，一点也瞒不过它。只要不欺骗它，老老实实依着它去做。',
    similarQuestions: ['How to trust my intuition?', 'Should I follow others\' advice?', 'How to know right from wrong?', 'Where do I find wisdom?', 'Am I looking in the wrong places for answers?'],
    contextNote: 'Chen Jiuchuan visited Wang in Ganzhou in 1520 and complained that he could not find a "steady and joyful" place in his practice. Wang\'s "secret" is liangzhi (良知, innate knowing of the good) as an inner standard. This replaces a poem ("everyone has a compass within") that is not part of the Chuanxi Lu.',
    tags: ['self-knowledge', 'honesty', 'wisdom'], weight: 5,
  },
  {
    canonicalRef: 'Chuanxi Lu III.289',
    chapterEn: 'Vol. III — Recorded sayings', chapterZh: '卷下·语录', chapterOrig: '傳習錄下',
    original: { ...zh('下'), start: '聖人之知，如青天之日；', end: '其能辨黑白則一。' },
    english: { ...henke(CALIFORNIA), start: 'The knowledge of the sage may be compared to the sun', end: 'may all equally distinguish between black and white.' },
    sourceUrl: page(CALIFORNIA, 190), license: LICENSE,
    summaryEn: 'The knowing of a sage is like the sun in a clear sky, a worthy person\'s like the sun behind drifting clouds, an ordinary person\'s like the sun on a dark, foggy day. The brightness differs, but all can tell black from white.',
    summaryZh: '圣人的知如青天中的太阳，贤人的如浮云遮着的太阳，愚人的如阴霾天里的太阳。明暗虽然不同，能分辨黑白这一点却是一样的。',
    similarQuestions: ['Do I really know right from wrong?', 'Is morality innate or learned?', 'Does everyone have a conscience?', 'Am I capable of being good?'],
    contextNote: 'Wang taught that innate knowing (liangzhi) is present in everyone, sage and ordinary person alike; what differs is how far it is obscured. He goes on to say that even in the dark of night one can still dimly make out black and white. This replaces a definition of liangzhi as Mencius\'s "sense of right and wrong", which comes from Wang\'s Inquiry on the Great Learning (大學問), not the Chuanxi Lu.',
    tags: ['wisdom', 'goodness', 'equality'], weight: 4,
  },
  {
    canonicalRef: 'Chuanxi Lu I.39',
    chapterEn: 'Vol. I — Lu Cheng’s record', chapterZh: '卷上·陆澄录', chapterOrig: '傳習錄上·陸澄錄',
    original: { ...zh('上'), start: '須教他省察克治。', end: '方始為快。' },
    english: { ...henke(TORONTO), start: 'He should be taught to examine and control himself', end: 'Then first has a condition of joy been instituted.' },
    sourceUrl: page(TORONTO, 84), license: LICENSE,
    summaryEn: 'Self-examination and self-mastery must never lapse. Like clearing out bandits, you must resolve to sweep them away completely: hunt down lust, greed and love of fame one by one, pull out the root, and never let it grow back.',
    summaryZh: '省察克治的功夫一刻也不能间断。就像剿除盗贼，要有扫除廓清的决心：把好色、好货、好名等私欲逐一搜寻出来，拔去病根，永不复起，才算痛快。',
    similarQuestions: ['How to maintain self-discipline?', 'Why do I keep falling back into bad habits?', 'How to overcome my inner demons?', 'What is the hardest battle?', 'How to break a bad habit for good?'],
    contextNote: 'Wang, a successful general who suppressed bandits in Jiangxi, often used military metaphors for self-cultivation. The famous line "It is easy to defeat the bandits in the mountains, hard to defeat the bandits in the heart" comes from one of his letters, not the Chuanxi Lu; this is the Chuanxi Lu passage on the same theme. Here he warns that sitting in meditation alone is not enough for beginners.',
    tags: ['discipline', 'desire', 'character'], weight: 5,
  },
  {
    canonicalRef: 'Chuanxi Lu I.23',
    chapterEn: 'Vol. I — Lu Cheng’s record', chapterZh: '卷上·陆澄录', chapterOrig: '傳習錄上·陸澄錄',
    original: { ...zh('上'), start: '問：「靜時亦覺意思好', end: '動亦定。' },
    english: { ...henke(CALIFORNIA), start: 'I made inquiry saying: "When I am tranquil', end: 'his purpose is fixed.' },
    sourceUrl: page(CALIFORNIA, 76), license: LICENSE,
    summaryEn: 'Feeling calm in quiet moments but losing it once events arrive means you have only cultivated stillness, not self-mastery. You must be tempered in real affairs; only then can you stand firm, settled both at rest and in action.',
    summaryZh: '静时觉得心境不错，一遇事就变了样，说明只知养静，没有下克己的功夫。人要在事上磨炼，才立得住，才能静时也定、动时也定。',
    similarQuestions: ['Why do I lose my calm under pressure?', 'Is meditation enough?', 'How to stay composed in a crisis?', 'How to grow through difficulties?'],
    contextNote: 'The source of the phrase "training on actual affairs" (事上磨练), one of Wang\'s most practical teachings. Henke renders 事上磨 loosely as "experience in affairs"; the Chinese says one must be ground and polished on real tasks.',
    tags: ['practice', 'discipline', 'perseverance'], weight: 4,
  },
  {
    canonicalRef: 'Chuanxi Lu III.275',
    chapterEn: 'Vol. III — Recorded sayings', chapterZh: '卷下·语录', chapterOrig: '傳習錄下',
    original: { ...zh('下'), start: '你來看此花時', end: '便知此花不在你的心外。' },
    english: { ...henke(TORONTO), start: 'When you see them, their colors at once become clear.', end: 'not external to your mind.' },
    sourceUrl: page(TORONTO, 169), license: LICENSE,
    summaryEn: 'When you look at the flowers, their colours at once become clear — so the flowers are not outside your mind.',
    summaryZh: '你来看这花时，花的颜色一下子明白起来——由此便知，这花不在你的心外。',
    similarQuestions: ['Does reality exist outside my mind?', 'What is the relationship between consciousness and reality?', 'Is the world as I perceive it?'],
    contextNote: 'The end of the famous "flowers on the cliff" exchange at Nanzhen. A friend pointed to flowering trees that bloom and fall on their own deep in the mountains and asked what they had to do with his mind; Wang first replied that before you looked at them, they and your mind were both at rest (同歸於寂). Often compared with Berkeley\'s idealism, though Wang\'s point concerns the mind\'s engagement with things rather than whether they exist.',
    tags: ['nature', 'self-knowledge', 'truth'], weight: 5,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'wang-yangming',
  dataFile: 'wang-yangming-chuanxi-lu.json',
  thinkerName: 'Wang Yangming',
  tradition: 'confucianism',
  supersedes: ['Instructions for Practical Living'],
  work: {
    titleEn: 'Instructions for Practical Living (Selected Passages)',
    titleZh: '传习录（精选）',
    titleOrig: '傳習錄',
    language: 'classical-chinese',
    circaYear: 1518,
    description:
      'Selected passages from the Chuanxi Lu, the record of Wang Yangming\'s conversations with his disciples and the central text of his school of Neo-Confucianism. Chinese text from Chinese Wikisource (public domain) with the English translation of Frederick Goodrich Henke, "The Philosophy of Wang Yang-ming" (1916; public domain in the US), from the archive.org scans of that edition.',
    copyright: 'PD (English: US, published 1916)',
    sourceUrl: 'https://archive.org/details/philosophyofwang00wanguoft',
  },
  items,
};

export default work;
