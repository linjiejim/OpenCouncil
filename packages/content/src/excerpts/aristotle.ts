/**
 * Aristotle — Nicomachean Ethics (with one passage from the Politics).
 *   • Greek: Perseus Digital Library TEI (Ethics ed. Bywater; Politics ed. Ross), CC BY-SA 4.0
 *   • English: D. P. Chase (1847; d. 1902), Ethics, public domain, Project Gutenberg #8438
 *              William Ellis (1776), Politics, public domain, Project Gutenberg #6762
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const NE_GRC = {
  url: 'https://raw.githubusercontent.com/PerseusDL/canonical-greekLit/master/data/tlg0086/tlg010/tlg0086.tlg010.perseus-grc2.xml',
  format: 'xml',
  lang: 'ancient-greek',
} as const;
const CHASE = {
  url: 'https://www.gutenberg.org/cache/epub/8438/pg8438.txt',
  format: 'text',
  translator: 'D. P. Chase (1847)',
} as const;
const POL_GRC = {
  url: 'https://raw.githubusercontent.com/PerseusDL/canonical-greekLit/master/data/tlg0086/tlg035/tlg0086.tlg035.perseus-grc2.xml',
  format: 'xml',
  lang: 'ancient-greek',
} as const;
const ELLIS = {
  url: 'https://www.gutenberg.org/cache/epub/6762/pg6762.txt',
  format: 'text',
  translator: 'William Ellis (1776)',
} as const;
const LICENSE = 'Greek: CC BY-SA 4.0 (Perseus); English: public domain';
const neBook = (book: number) =>
  `https://www.gutenberg.org/cache/epub/8438/pg8438-images.html#chap${String(book).padStart(2, '0')}`;

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Nicomachean Ethics 1094a',
    chapterEn: 'Book I - The Good Life', chapterZh: '第一卷 · 至善', chapterOrig: 'Βιβλίον Α',
    original: { ...NE_GRC, start: 'πᾶσα τέχνη καὶ πᾶσα μέθοδος', end: 'τἀγαθόν, οὗ πάντʼ ἐφίεται.' },
    english: { ...CHASE, start: 'Every art, and every science reduced to a teachable form', end: 'that which all things aim at.”' },
    sourceUrl: neBook(1), license: LICENSE,
    summaryEn: 'Every art, inquiry, action and choice seems to aim at some good, which is why the good has been well described as that at which all things aim.',
    summaryZh: '每一种技艺、每一种探究，以及每一个行动和选择，似乎都以某种善为目的；所以人们说得好：善就是万物所追求的东西。',
    similarQuestions: ['What is the ultimate goal of life?', 'What am I really striving for?', 'What is the highest good?', 'What should I aim for in life?'],
    contextNote: 'The opening sentence of the Nicomachean Ethics. Aristotle starts from the observation that all human activity is purposive, then asks what the highest good — the end sought for its own sake — might be.',
    tags: ['goodness', 'meaning-of-life', 'choice'], weight: 5,
  },
  {
    canonicalRef: 'Nicomachean Ethics 1098a',
    chapterEn: 'Book I - The Good Life', chapterZh: '第一卷 · 至善', chapterOrig: 'Βιβλίον Α',
    original: { ...NE_GRC, start: 'εἰ δʼ ἐστὶν ἔργον ἀνθρώπου ψυχῆς ἐνέργεια', end: 'οὐδʼ ὀλίγος χρόνος.' },
    english: { ...CHASE, start: 'If then the work of Man is a working of the soul', end: 'that makes a man blessed and happy.' },
    sourceUrl: neBook(1), license: LICENSE,
    summaryEn: 'The human good is an activity of the soul in accordance with excellence (virtue) — the best and most complete, if there are several — and in a complete life: one swallow or one fine day does not make a spring, and one day does not make a person happy.',
    summaryZh: '人的善是灵魂合乎德性（卓越）的活动；若德性不止一种，则合乎最好、最完满的那一种；而且要贯穿完整的一生：一只燕子或一个晴天造不成春天，一天也造不成一个幸福的人。',
    similarQuestions: ['What is happiness?', 'How to be truly happy?', 'Is happiness a choice or a circumstance?', 'Can I be happy without being good?', 'What is the good life?', 'How to find fulfillment?'],
    contextNote: 'Aristotle’s definition of eudaimonia, reached through the “function argument”: a good harpist plays well, so a good human lives well, exercising reason with excellence. Chase leaves the phrase “in a complete life” in Greek (ἐν βίῳ τελείῳ). Eudaimonia is better rendered “flourishing” than a passing feeling of happiness.',
    tags: ['happiness', 'virtue', 'soul'], weight: 5,
  },
  {
    canonicalRef: 'Nicomachean Ethics 1103a–b',
    chapterEn: 'Book II - Virtue and the Golden Mean', chapterZh: '第二卷 · 美德与中庸', chapterOrig: 'Βιβλίον Β',
    original: { ...NE_GRC, start: 'τὰς δʼ ἀρετὰς λαμβάνομεν ἐνεργήσαντες πρότερον', end: 'μᾶλλον δὲ τὸ πᾶν.' },
    english: { ...CHASE, start: 'But the Virtues we get by first performing single acts of working', end: 'or rather I would say it makes all the difference.' },
    sourceUrl: neBook(2), license: LICENSE,
    summaryEn: 'We acquire the virtues by first exercising them, as with the arts: people become builders by building and harpists by playing, and we become just by doing just acts, self-controlled by self-controlled acts, brave by brave acts. Habits arise from repeated acts like them, so how we are trained from childhood makes all the difference.',
    summaryZh: '德性是先通过实践才获得的，技艺也是如此：人靠盖房子成为建筑师，靠弹琴成为琴师；同样，我们做公正的事才成为公正的人，做节制的事才成为节制的人，做勇敢的事才成为勇敢的人。品性由相应的活动反复养成，所以从小养成什么习惯，关系重大，甚至决定一切。',
    similarQuestions: ['How to become a better person?', 'Is character innate or developed?', 'How to build good habits?', 'Can I change who I am?', 'How to develop self-discipline?'],
    contextNote: 'The source of the popular line “We are what we repeatedly do. Excellence, then, is not an act, but a habit,” which is Will Durant’s 1926 summary of Aristotle, not a quotation. Aristotle’s point here is that moral virtue comes from habituation (ethos), which is also why he gives lawgivers and upbringing such a large role.',
    tags: ['character', 'practice', 'virtue', 'education'], weight: 5,
  },
  {
    canonicalRef: 'Nicomachean Ethics 1106b–1107a',
    chapterEn: 'Book II - Virtue and the Golden Mean', chapterZh: '第二卷 · 美德与中庸', chapterOrig: 'Βιβλίον Β',
    original: { ...NE_GRC, start: 'ἔστιν ἄρα ἡ ἀρετὴ ἕξις προαιρετική', end: 'κατὰ δὲ τὸ ἄριστον καὶ τὸ εὖ ἀκρότης.' },
    english: { ...CHASE, start: 'Virtue then is “a state apt to exercise deliberate choice', end: 'it is the highest state possible.' },
    sourceUrl: neBook(2), license: LICENSE,
    summaryEn: 'Virtue is a settled state of choosing, lying in the mean relative to us, determined by reason as a person of practical wisdom would determine it. It is a mean between two vices, one of excess and one of deficiency, finding and choosing what is right in feelings and actions; by its essence a mean, but in goodness the highest point.',
    summaryZh: '德性是一种做选择的稳定品质，它处在相对于我们而言的适中之处，由理性来确定，也就是明智之人会如何确定。它是两种恶之间的适中，一种是过度，一种是不及；它在情感和行动中找到并选择恰当之处。就本质而言它是适中，就善而言它是顶点。',
    similarQuestions: ['How to find balance in life?', 'Am I being too cautious or too reckless?', 'What is the right amount of anything?', 'How to make good decisions?', 'Is moderation always best?'],
    contextNote: 'Aristotle’s formal definition of moral virtue, the doctrine of the mean. Just before it he explains that feeling fear, anger or pity at the right times, about the right things, towards the right people, for the right reason and in the right way is the mean; so the mean is “relative to us,” not an arithmetic midpoint. Right after it he adds that some acts and feelings (envy, theft, murder) have no mean at all. Courage, for example, lies between cowardice and rashness (Book III). The idea is often compared with the Confucian Zhongyong (中庸).',
    tags: ['virtue', 'choice', 'wisdom'], weight: 5,
  },
  {
    canonicalRef: 'Nicomachean Ethics 1140b',
    chapterEn: 'Book VI - Practical Wisdom', chapterZh: '第六卷 · 实践智慧', chapterOrig: 'Βιβλίον ΣΤ',
    original: { ...NE_GRC, start: 'λείπεται ἄρα αὐτὴν εἶναι ἕξιν ἀληθῆ', end: 'τοὺς οἰκονομικοὺς καὶ τοὺς πολιτικούς.' },
    english: { ...CHASE, start: 'It remains then that it must be “a state of mind true', end: 'skilled in domestic management or civil government.' },
    sourceUrl: neBook(6), license: LICENSE,
    summaryEn: 'Practical wisdom is a true state, accompanied by reason, apt to act with regard to what is good or bad for human beings. Unlike making, whose end lies beyond it, in action doing well is itself the end. That is why people like Pericles count as practically wise: they can see what is good for themselves and for people in general.',
    summaryZh: '实践智慧是一种与理性相伴、真实的、指向行动的品质，关乎对人而言的善与恶。制作的目的在制作之外，而行动本身做得好就是目的。所以像伯里克利这样的人被认为有实践智慧：他们能看清什么对自己、对众人是好的。',
    similarQuestions: ['How to make better decisions?', 'What is practical wisdom?', 'How to develop good judgment?', 'Is wisdom different from intelligence?', 'How to know what the right thing to do is?'],
    contextNote: 'Phronesis (practical wisdom) is defined by elimination: it cannot be scientific knowledge, because action concerns what can be otherwise, and it cannot be art, because doing differs from making. Aristotle later argues that one cannot be fully good without practical wisdom, nor practically wise without moral virtue.',
    tags: ['wisdom', 'reason', 'choice'], weight: 5,
  },
  {
    canonicalRef: 'Nicomachean Ethics 1155a',
    chapterEn: 'Book VIII - Friendship', chapterZh: '第八卷 · 友谊', chapterOrig: 'Βιβλίον Η',
    original: { ...NE_GRC, start: 'μετὰ δὲ ταῦτα περὶ φιλίας ἕποιτʼ ἂν διελθεῖν·', end: 'μόνην οἴονται καταφυγὴν εἶναι τοὺς φίλους.' },
    english: { ...CHASE, start: 'Next would seem properly to follow a dissertation on Friendship', end: 'men think friends to be their only refuge.' },
    sourceUrl: neBook(8), license: LICENSE,
    summaryEn: 'Friendship is a virtue or involves virtue, and it is most necessary for life: no one would choose to live without friends even with every other good. The rich and powerful need friends most, to do good to and to keep their fortune safe, and in poverty and misfortune friends are thought to be the only refuge.',
    summaryZh: '友爱是一种德性，或者与德性相伴，而且是生活中最必需的东西：即使拥有其他一切好东西，也没有人愿意过没有朋友的生活。富人和掌权者最需要朋友，既为了施惠，也为了守住所有；而在贫困和不幸中，人们认为朋友是唯一的避难所。',
    similarQuestions: ['How important is friendship?', 'Can I be happy without friends?', 'Is success meaningless without someone to share it?', 'Why do I feel lonely despite having everything?'],
    contextNote: 'The opening of Book VIII. Aristotle devotes two of the ten books of the Ethics (VIII and IX) to friendship (philia), a word that covers family bonds, partnerships and civic ties as well as personal friendship.',
    tags: ['friendship', 'happiness', 'community'], weight: 5,
  },
  {
    canonicalRef: 'Nicomachean Ethics 1156b',
    chapterEn: 'Book VIII - Friendship', chapterZh: '第八卷 · 友谊', chapterOrig: 'Βιβλίον Η',
    original: { ...NE_GRC, start: 'τελεία δʼ ἐστὶν ἡ τῶν ἀγαθῶν φιλία', end: 'ἡ δʼ ἀρετὴ μόνιμον.' },
    english: { ...CHASE, start: 'That then is perfect Friendship which subsists', end: 'has in it a principle of permanence.' },
    sourceUrl: neBook(8), license: LICENSE,
    summaryEn: 'Perfect friendship is between good people alike in virtue. They wish each other good for the friend’s own sake, not as a means to something else, so their friendship lasts as long as they remain good — and goodness is lasting.',
    summaryZh: '完美的友爱存在于德性相似的好人之间。他们为了朋友本身而希望朋友好，而不是把朋友当作手段，所以只要他们仍是好人，这种友爱就会持续；而德性是持久的。',
    similarQuestions: ['What is true friendship?', 'How to find real friends?', 'Are most friendships transactional?', 'How to build deep connections?', 'Why do some friendships fade?'],
    contextNote: 'Aristotle distinguishes friendships of utility, of pleasure and of virtue. The first two end when the advantage or pleasure ends; only the third is complete and lasting, and it is rare because good people are few and such friendship takes time.',
    tags: ['friendship', 'virtue', 'character'], weight: 4,
  },
  {
    canonicalRef: 'Nicomachean Ethics 1177b–1178a',
    chapterEn: 'Book X - Contemplation', chapterZh: '第十卷 · 沉思', chapterOrig: 'Βιβλίον Ι',
    original: { ...NE_GRC, start: 'ὁ δὲ τοιοῦτος ἂν εἴη βίος κρείττων ἢ κατʼ ἄνθρωπον·', end: 'πολὺ μᾶλλον πάντων ὑπερέχει.' },
    english: { ...CHASE, start: 'But such a life will be higher than mere human nature', end: 'it far more excels all the others.' },
    sourceUrl: neBook(10), license: LICENSE,
    summaryEn: 'The life of the intellect is higher than a merely human life, because we live it by virtue of something divine in us. So we should not heed those who tell mortals to think only mortal thoughts; as far as we can, we should make ourselves immortal and live by the best thing in us, which, though small in bulk, far surpasses everything else in power and worth.',
    summaryZh: '理智的生活高于单纯属人的生活，因为过这种生活靠的是我们身上神性的部分。所以不要听那些劝人“身为凡人只想凡人之事”的话；而要尽可能让自己不朽，按照我们身上最好的部分去生活。它体积虽小，力量和价值却远超一切。',
    similarQuestions: ['What is the highest purpose of life?', 'Should I prioritize thinking or doing?', 'Is intellectual life worth pursuing?', 'What makes humans special?'],
    contextNote: 'In the final book of the Ethics Aristotle argues that the contemplative life (bios theōrētikos) is the highest form of human flourishing, ranking it above the life of political and moral action, which he calls happy “in a secondary degree.”',
    tags: ['reason', 'happiness', 'divinity'], weight: 4,
  },
  {
    canonicalRef: 'Politics 1253a',
    chapterEn: 'From the Politics, Book I', chapterZh: '政治学 · 第一卷', chapterOrig: 'Πολιτικά Α',
    original: { ...POL_GRC, start: 'ἐκ τούτων οὖν φανερὸν ὅτι τῶν φύσει ἡ πόλις ἐστί', end: 'ἢ κρείττων ἢ ἄνθρωπος·' },
    english: { ...ELLIS, start: 'Hence it is evident that a city is a natural production', end: 'must be either inferior or superior to man:' },
    sourceUrl: 'https://www.gutenberg.org/ebooks/6762', license: LICENSE,
    summaryEn: 'The city exists by nature, and man is by nature a political animal. Anyone who is by nature, and not by accident, unfit for a city is either less or more than human.',
    summaryZh: '城邦是自然形成的，人天生是政治的动物。一个出于本性而非偶然不能过城邦生活的人，不是低于人，就是高于人。',
    similarQuestions: ['Do I need other people?', 'Why is community important?', 'Can I achieve fulfillment alone?', 'What is human nature?'],
    contextNote: 'From Book I of the Politics. “Political” means “belonging to the polis,” the city-community, not party politics. Aristotle goes on to say that humans alone have speech to discuss what is just and unjust, and that someone who needs no community is “either a beast or a god.”',
    tags: ['community', 'nature', 'governance'], weight: 5,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'aristotle',
  dataFile: 'aristotle-nicomachean-ethics.json',
  thinkerName: 'Aristotle',
  tradition: 'ancient-greek',
  supersedes: ['Nicomachean Ethics (with Selected Works)'],
  work: {
    titleEn: 'Nicomachean Ethics, with the Politics (Selected Passages)',
    titleZh: '尼各马可伦理学（附政治学，精选）',
    titleOrig: 'Ἠθικὰ Νικομάχεια',
    language: 'ancient-greek',
    circaYear: -340,
    description:
      'Selected passages from Aristotle’s Nicomachean Ethics, on the good life, virtue, practical wisdom and friendship, with one passage from the Politics. Greek text from the Perseus Digital Library (Ethics ed. Bywater, Politics ed. Ross; CC BY-SA 4.0) with the public-domain English translations of D. P. Chase (Ethics, 1847) and William Ellis (Politics, 1776), via Project Gutenberg.',
    copyright: 'Greek CC BY-SA 4.0 · English PD',
    sourceUrl: 'https://www.gutenberg.org/ebooks/8438',
  },
  items,
};

export default work;
