/**
 * Mencius (孟子) — selected passages.
 *   • Chinese: Chinese Wikisource 孟子 chapter pages (public domain)
 *   • English: James Legge, The Chinese Classics vol. II, The Works of Mencius (1861; 2nd ed. 1895;
 *     Legge d. 1897), public domain, via English Wikisource. The Wikisource pages interleave the Chinese
 *     with Legge's English, so every English span below covers exactly one of Legge's English blocks
 *     (or part of one) and never crosses a Chinese block.
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const zhPage = (page: string) =>
  `https://zh.wikisource.org/w/api.php?action=parse&format=json&prop=text&page=${encodeURI(page)}`;
const zh = (part: string) => ({ url: zhPage(`孟子/${part}`), format: 'mediawiki', lang: 'classical-chinese' }) as const;

const leggePage = (n: number) => `The_Chinese_Classics/Volume_2/The_Works_of_Mencius/chapter${String(n).padStart(2, '0')}`;
const legge = (n: number) =>
  ({
    url: `https://en.wikisource.org/w/api.php?action=parse&format=json&prop=text&page=${leggePage(n)}`,
    format: 'mediawiki',
    translator: 'James Legge (1861; names in pinyin per the Wikisource transcription)',
  }) as const;
const src = (n: number) => `https://en.wikisource.org/wiki/${leggePage(n)}`;
const LICENSE = 'Chinese: public domain (Wikisource); English: public domain';

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Mencius 1A1',
    chapterEn: 'Liang Hui Wang I (King Hui of Liang, Part 1)', chapterZh: '梁惠王上', chapterOrig: '梁惠王上',
    original: { ...zh('梁惠王上'), start: '孟子對曰：「王！何必曰利？', end: '王亦曰仁義而已矣，何必曰利？」' },
    english: { ...legge(1), start: 'Mencius replied, \'Why must your Majesty use that word "profit?"', end: 'Why must you use that word - "profit?".\'' },
    sourceUrl: src(1), license: LICENSE,
    summaryEn: 'Why speak of profit? Benevolence and righteousness are enough. If ruler, officers and commoners all ask how to profit themselves, they will snatch from one another and the state will be endangered.',
    summaryZh: '何必谈利？有仁义就够了。如果君主、大夫、百姓都只问怎样对自己有利，上下互相争夺，国家就危险了。',
    similarQuestions: ['Should leaders prioritize profit or ethics?', 'How should a nation be governed?', 'Is morality more important than wealth?', 'What happens when everyone pursues self-interest?'],
    contextNote: 'The opening passage of the Mencius. King Hui of Liang has asked whether Mencius brings something to profit his kingdom; this is Mencius’s reply, a direct challenge to the utilitarian statecraft of the Warring States.',
    tags: ['governance', 'benevolence', 'justice'], weight: 5,
  },
  {
    canonicalRef: 'Mencius 2A2',
    chapterEn: 'Gong Sun Chou I', chapterZh: '公孙丑上', chapterOrig: '公孫丑上',
    original: { ...zh('公孫丑上'), start: '難言也。其為氣也', end: '非義襲而取之也。' },
    english: { ...legge(3), start: 'It is difficult to describe it. This is the passion-nature:', end: 'it is not to be obtained by incidental acts of righteousness.' },
    sourceUrl: src(3), license: LICENSE,
    summaryEn: 'The "flood-like qi" is hard to describe: supremely great and strong, it fills all between heaven and earth when nourished by uprightness. It accompanies righteousness and the Way, and grows from an accumulation of righteous deeds — it cannot be seized by an occasional righteous act.',
    summaryZh: '浩然之气难以言说：它至大至刚，用正直去培养而不加伤害，就能充塞天地之间。它与义和道相配合，是由不断积累的义行所生成的，不是偶然做一件义事就能取得的。',
    similarQuestions: ['How do I build inner strength?', 'What is moral courage?', 'How can I become more confident in doing right?', 'How does character grow over time?'],
    contextNote: 'Mencius’s answer to his disciple Gongsun Chou, who asked what he meant by 浩然之氣 — Legge renders it "vast, flowing passion-nature". The same reply goes on to the parable of the man of Song who pulled up his corn to help it grow (揠苗助長).',
    tags: ['courage', 'virtue', 'discipline'], weight: 5,
  },
  {
    canonicalRef: 'Mencius 2A6',
    chapterEn: 'Gong Sun Chou I', chapterZh: '公孙丑上', chapterOrig: '公孫丑上',
    original: { ...zh('公孫丑上'), start: '所以謂人皆有不忍人之心者', end: '不足以事父母。' },
    english: { ...legge(3), start: 'When I say that all men have a mind which cannot bear', end: 'they will not suffice for a man to serve his parents with.' },
    sourceUrl: src(3), license: LICENSE,
    summaryEn: 'Anyone who suddenly sees a child about to fall into a well feels alarm and distress — not to win favour or praise, but spontaneously. Compassion, shame, deference and the sense of right and wrong are the beginnings of benevolence, righteousness, propriety and wisdom; developed, they can protect all within the four seas.',
    summaryZh: '任何人突然看见一个小孩将要掉进井里，都会有惊惧同情之心——不是为了结交孩子的父母，也不是为了博取名声。恻隐、羞恶、辞让、是非之心，是仁、义、礼、智的开端；把它们扩充起来，足以安定天下。',
    similarQuestions: ['Are humans naturally good or evil?', 'Why do we feel empathy?', 'Is compassion innate or learned?', 'How can I grow my good qualities?'],
    contextNote: 'The famous "child at the well" thought experiment and the doctrine of the "four sprouts" (四端), which Legge translates as four "principles". Mencius’s point is that virtue must be cultivated from beginnings everyone already has.',
    tags: ['compassion', 'goodness', 'benevolence'], weight: 5,
  },
  {
    canonicalRef: 'Mencius 3A4',
    chapterEn: 'Teng Wen Gong I', chapterZh: '滕文公上', chapterOrig: '滕文公上',
    original: { ...zh('滕文公上'), start: '然則治天下獨可耕且為與？', end: '天下之通義也。' },
    english: { ...legge(5), start: 'Then, is it the government of the kingdom which alone can be carried on', end: 'This is a principle universally recognised.' },
    sourceUrl: src(5), license: LICENSE,
    summaryEn: 'Government cannot be carried on alongside farming any more than a craft can. Great men and small men have their own business: some labour with their minds and govern, others labour with their strength and are governed; the governed support those who govern.',
    summaryZh: '治理天下不能一边耕种一边进行，正如各种手艺不能都由一人兼做。有大人之事，有小人之事；劳心者治人，劳力者治于人；治于人者养活人，治人者被人养活，这是天下通行的道理。',
    similarQuestions: ['Is social hierarchy natural?', 'What is the role of intellectuals in society?', 'How should society be organized?', 'Why is division of labour necessary?'],
    contextNote: 'Mencius argues against Chen Xiang, a follower of the Agriculturalist Xu Xing, who held that rulers should farm alongside their people. The passage has been both celebrated and criticized as a defence of social hierarchy.',
    tags: ['governance', 'community', 'duty'], weight: 3,
  },
  {
    canonicalRef: 'Mencius 4B28',
    chapterEn: 'Li Lou II', chapterZh: '离娄下', chapterOrig: '離婁下',
    original: { ...zh('離婁下'), start: '君子所以異於人者', end: '於禽獸又何難焉！』' },
    english: { ...legge(8), start: 'That whereby the superior man is distinguished from other men', end: 'Why should I go to contend with a brute?"' },
    sourceUrl: src(8), license: LICENSE,
    summaryEn: 'The benevolent love others and the courteous respect others; whoever loves others is loved, whoever respects others is respected. When someone treats you badly, first turn back on yourself and ask where you fell short — only then conclude the fault is theirs.',
    summaryZh: '仁者爱人，有礼者敬人；爱人的人，别人总会爱他；敬人的人，别人总会敬他。有人蛮横对待我，君子一定先反省自己是否不仁、无礼、不忠，反省之后对方依旧如此，才断定是对方的问题。',
    similarQuestions: ['How do I earn respect?', 'Why should I be kind to others?', 'How do relationships work?', 'What should I do when someone treats me badly?'],
    contextNote: 'Mencius’s belief in moral reciprocity, joined to the Confucian habit of self-examination (自反). It is not a bargain ("I give so I get") but a description of how virtue naturally draws a response — and of what to do when it does not.',
    tags: ['love', 'benevolence', 'character'], weight: 4,
  },
  {
    canonicalRef: 'Mencius 6A2',
    chapterEn: 'Gaozi I', chapterZh: '告子上', chapterOrig: '告子上',
    original: { ...zh('告子上'), start: '水信無分於東西', end: '其性亦猶是也。' },
    english: { ...legge(11), start: 'Water indeed will flow indifferently to the east or west', end: 'their nature is dealt with in this way.' },
    sourceUrl: src(11), license: LICENSE,
    summaryEn: 'Water may not care whether it flows east or west, but it always flows downward; human nature tends to goodness in the same way. Water can be splashed over your head or forced uphill, but that is force, not its nature — and so it is when people are made to do wrong.',
    summaryZh: '水固然不分东西，但难道不分上下吗？人性向善，就像水往低处流。拍水可以使它溅过额头，堵水可以使它流上山岗，但这是外力所迫，不是水的本性；人做坏事，也是同样的道理。',
    similarQuestions: ['Is human nature fundamentally good?', 'Can people change for the better?', 'Why do people do bad things if they are naturally good?'],
    contextNote: 'Mencius’s reply in his debate with Gaozi, who had just compared human nature to whirling water that flows east or west wherever a channel is opened — morally neutral. Mencius turns the same image to argue for a natural direction toward goodness.',
    tags: ['goodness', 'nature', 'character'], weight: 5,
  },
  {
    canonicalRef: 'Mencius 6A10',
    chapterEn: 'Gaozi I', chapterZh: '告子上', chapterOrig: '告子上',
    original: { ...zh('告子上'), start: '魚，我所欲也', end: '賢者能勿喪耳。' },
    english: { ...legge(11), start: 'I like fish, and I also like bear\'s paws.', end: 'what belongs to such men is simply that they do not lose it.' },
    sourceUrl: src(11), license: LICENSE,
    summaryEn: 'If I cannot have both fish and bear’s paw, I take the bear’s paw; if I cannot keep both life and righteousness, I choose righteousness. There are things we want more than life and hate more than death — everyone has this heart; the worthy simply do not lose it.',
    summaryZh: '鱼和熊掌不能兼得，就舍鱼而取熊掌；生命和道义不能兼得，就舍生而取义。人有比生命更想要的东西，有比死亡更厌恶的东西；这种心人人都有，贤者只是能够不丧失它而已。',
    similarQuestions: ['Is there anything worth dying for?', 'How do I make tough moral choices?', 'What should I do when my values conflict with my interests?'],
    contextNote: 'One of the most famous analogies in Chinese literature. The everyday choice between two delicacies illuminates the ultimate choice between self-preservation and righteousness. The passage continues with the beggar who refuses food given with contempt.',
    tags: ['choice', 'virtue', 'courage'], weight: 5,
  },
  {
    canonicalRef: 'Mencius 6B15',
    chapterEn: 'Gaozi II', chapterZh: '告子下', chapterOrig: '告子下',
    original: { ...zh('告子下'), start: '舜發於畎畝之中', end: '而死於安樂也。' },
    english: { ...legge(12), start: 'Shun rose from among the channelled fields.', end: 'death from ease and pleasure.' },
    sourceUrl: src(12), license: LICENSE,
    summaryEn: 'Great figures rose from the fields, the building site, the market and prison. When Heaven is about to give someone a great office, it first tries their mind with suffering and their body with toil and hunger, to stir their resolve and supply what they lack. Life springs from sorrow and calamity; death from ease and pleasure.',
    summaryZh: '舜出身于田野，傅说、管仲、百里奚等人或起于筑墙，或起于狱中，或起于市井。上天将要把重任交给一个人，必定先使他心志受苦、筋骨劳累、身体饥饿、处境困乏，以此激发他的心志，坚韧他的性情，增加他的能力。由此可知，忧患使人生存，安乐使人灭亡。',
    similarQuestions: ['Why do bad things happen to good people?', 'How do I grow from adversity?', 'Does suffering have a purpose?', 'How to deal with setbacks?'],
    contextNote: 'Perhaps the most widely quoted passage of the Mencius in modern China, memorized in school; its closing line, 生於憂患，死於安樂, is a proverb in its own right.',
    tags: ['suffering', 'perseverance', 'destiny'], weight: 5,
  },
  {
    canonicalRef: 'Mencius 7A1',
    chapterEn: 'Jin Xin I', chapterZh: '尽心上', chapterOrig: '盡心上',
    original: { ...zh('盡心上'), start: '盡其心者，知其性也。', end: '所以立命也。' },
    english: { ...legge(13), start: 'He who has exhausted all his mental constitution knows his nature.', end: 'this is the way in which he establishes his Heaven-ordained being.' },
    sourceUrl: src(13), license: LICENSE,
    summaryEn: 'Whoever fully realizes their heart knows their nature, and knowing one’s nature one knows Heaven. Preserving the heart and nourishing one’s nature is how one serves Heaven; cultivating oneself and awaiting whatever comes, untroubled by early death or long life, is how one establishes one’s destiny.',
    summaryZh: '充分发挥自己的本心，就能认识自己的本性；认识了本性，就认识了天。保存本心、涵养本性，就是侍奉天的方法。不论短命还是长寿都不三心二意，修养自身以等待天命，这就是安身立命的方法。',
    similarQuestions: ['How do I find my purpose?', 'What is self-knowledge?', 'How do I connect with something greater than myself?', 'How should I face an uncertain lifespan?'],
    contextNote: 'The opening of the "Jin Xin" book, outlining a path from self-cultivation to Heaven. Legge translates 心 as "mental constitution". The passage deeply influenced later Neo-Confucian thinkers such as Wang Yangming.',
    tags: ['self-knowledge', 'destiny', 'practice'], weight: 4,
  },
  {
    canonicalRef: 'Mencius 7A9',
    chapterEn: 'Jin Xin I', chapterZh: '尽心上', chapterOrig: '盡心上',
    original: { ...zh('盡心上'), start: '尊德樂義，則可以囂囂矣。', end: '達則兼善天下。' },
    english: { ...legge(13), start: 'Honour virtue and delight in righteousness', end: 'they made the whole kingdom virtuous as well.' },
    sourceUrl: src(13), license: LICENSE,
    summaryEn: 'Honour virtue and delight in righteousness, and you can be content whether or not you are recognized. In poverty a scholar keeps his righteousness; in success he keeps to the Way. Without office, cultivate yourself; with it, make the whole world good.',
    summaryZh: '尊崇德行、喜爱道义，就能无论得志与否都自得其乐。士人穷困时不失义，显达时不离道。不得志时修身于世，得志时恩泽于民：穷则独善其身，达则兼善天下。',
    similarQuestions: ['What should I do when I have no power to change things?', 'How should success change my behavior?', 'What is the balance between personal growth and social impact?', 'How to stay content without recognition?'],
    contextNote: 'Mencius’s advice to Song Goujian, who travelled from court to court seeking office. The closing line (窮則獨善其身，達則兼善天下) became a guiding maxim for Chinese scholar-officials.',
    tags: ['virtue', 'duty', 'character'], weight: 5,
  },
  {
    canonicalRef: 'Mencius 7B14',
    chapterEn: 'Jin Xin II', chapterZh: '尽心下', chapterOrig: '盡心下',
    original: { ...zh('盡心下'), start: '民為貴，社稷次之，君為輕。', end: '得乎諸侯為大夫。' },
    english: { ...legge(14), start: 'The people are the most important element in a nation;', end: 'is the way to become a great officer.' },
    sourceUrl: src(14), license: LICENSE,
    summaryEn: 'The people matter most, the altars of land and grain come next, and the ruler counts least. Winning the common people is the way to become Son of Heaven.',
    summaryZh: '人民最为重要，国家社稷次之，君主最轻。得到百姓拥护的人才能成为天子。',
    similarQuestions: ['What is the purpose of government?', 'Should leaders serve the people or rule them?', 'What makes a legitimate government?'],
    contextNote: 'One of the most radical political statements in ancient Chinese thought, placing the people above the ruler. Mencius goes on to say that even the spirits of the land and grain may be replaced if they fail the people. The passage has been cited throughout Chinese history against tyranny.',
    tags: ['governance', 'power', 'community'], weight: 5,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'mencius',
  dataFile: 'mencius-mencius.json',
  thinkerName: 'Mencius',
  tradition: 'confucianism',
  supersedes: ['Mencius'],
  work: {
    titleEn: 'Mencius (Selected Passages)',
    titleZh: '孟子（精选）',
    titleOrig: '孟子',
    language: 'classical-chinese',
    circaYear: -300,
    description:
      'Selected passages from the Mencius, conversations of Mencius with rulers, disciples and rivals on innate human goodness and humane government. Chinese text from Chinese Wikisource (public domain) with the public-domain English translation of James Legge (The Chinese Classics, vol. II, 1861/1895), via English Wikisource.',
    copyright: 'public-domain',
    sourceUrl: 'https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_2/The_Works_of_Mencius',
  },
  items,
};

export default work;
