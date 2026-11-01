/**
 * Epictetus — Discourses (Arrian) and Enchiridion.
 *   • Greek: Perseus Digital Library TEI (ed. Schenkl), CC BY-SA 4.0
 *   • English: George Long (1877/1888; d. 1879), public domain —
 *     Project Gutenberg #10661 ("A Selection from the Discourses of Epictetus with the Encheiridion");
 *     Enchiridion 1 is taken from Perseus's digitisation of Long's translation instead, because the
 *     Gutenberg text renders Long's Greek glosses there as "[Greek: …]" transliterations.
 */
import type { ExcerptItem, ExcerptWork } from './types.js';

const PERSEUS = 'https://raw.githubusercontent.com/PerseusDL/canonical-greekLit/master/data/tlg0557';
const GRC_DISC = { url: `${PERSEUS}/tlg001/tlg0557.tlg001.perseus-grc2.xml`, format: 'xml', lang: 'ancient-greek' } as const;
const GRC_ENCH = { url: `${PERSEUS}/tlg002/tlg0557.tlg002.perseus-grc2.xml`, format: 'xml', lang: 'ancient-greek' } as const;
const LONG = {
  url: 'https://www.gutenberg.org/cache/epub/10661/pg10661.txt',
  format: 'text',
  translator: 'George Long (1877)',
} as const;
const LONG_PERSEUS = {
  url: `${PERSEUS}/tlg002/tlg0557.tlg002.perseus-eng3.xml`,
  format: 'xml',
  translator: 'George Long (1877)',
} as const;
const LICENSE = 'Greek: CC BY-SA 4.0 (Perseus); English: public domain';
const LICENSE_PERSEUS_EN = 'Greek: CC BY-SA 4.0 (Perseus); English: public domain translation, Perseus digitisation (CC BY-SA 4.0)';
const GUTENBERG = 'https://www.gutenberg.org/ebooks/10661';

const ENCH = { chapterEn: 'Enchiridion (The Manual)', chapterZh: '手册', chapterOrig: 'Ἐγχειρίδιον' };
const DISC1 = { chapterEn: 'Discourses, Book I', chapterZh: '论说集·第一卷', chapterOrig: 'Διατριβαί Α' };

const items: ExcerptItem[] = [
  {
    canonicalRef: 'Enchiridion 1.1–3',
    ...ENCH,
    original: { ...GRC_ENCH, start: 'τῶν ὄντων τὰ μέν ἐστιν ἐφʼ ἡμῖν', end: 'οὐδὲ γὰρ βλαβερόν τι πείσῃ.' },
    english: { ...LONG_PERSEUS, start: 'OF things some are in our power', end: 'for you will not suffer any harm.' },
    sourceUrl: 'https://scaife.perseus.org/reader/urn:cts:greekLit:tlg0557.tlg002.perseus-eng3:1/',
    license: LICENSE_PERSEUS_EN,
    summaryEn: 'Some things are in our power — opinion, impulse, desire, aversion, our own acts — and some are not: body, property, reputation, office. Treat only what is yours as yours and nothing can compel, hinder or harm you.',
    summaryZh: '有些事在我们能力之内——看法、意向、欲望、厌恶，总之是我们自己的行为；有些则不在——身体、财产、名声、官职。只把属于自己的当作自己的，就没有什么能强迫、阻碍或伤害你。',
    similarQuestions: ['How do I stop worrying about things I cannot change?', 'What should I focus my energy on?', 'How do I deal with things outside my control?'],
    contextNote: 'The opening of the Enchiridion, the short handbook that Arrian distilled from Epictetus’ lectures. This “dichotomy of control” is the foundation of Epictetus’ teaching and is often cited as a forerunner of cognitive behavioural therapy.',
    tags: ['freedom', 'choice', 'self-knowledge'], weight: 5,
  },
  {
    canonicalRef: 'Enchiridion 5',
    ...ENCH,
    original: { ...GRC_ENCH, start: 'ταράσσει τοὺς ἀνθρώπους οὐ τὰ πράγματα', end: 'πεπαιδευμένου τὸ μήτε ἄλλῳ μήτε ἑαυτῷ.' },
    english: { ...LONG, start: 'Men are disturbed not by the things which happen', end: 'neither to blame another, nor himself.' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'We are disturbed not by events but by our opinions about them. Death is not terrible — the opinion that it is terrible is the terrible thing — so when troubled, look to your own judgments rather than blaming others.',
    summaryZh: '扰乱人的不是事情本身，而是人对事情的看法。死亡并不可怕——认为死亡可怕的看法才可怕。所以受困扰时，要检查自己的判断，而不是责怪他人。',
    similarQuestions: ['Why do I feel so anxious?', 'How can I change my perspective on problems?', 'Is my suffering caused by reality or my thoughts?', 'Who is to blame when I am upset?'],
    contextNote: 'Enchiridion 5. Albert Ellis and Aaron Beck both acknowledged this principle as an ancestor of cognitive therapy. The closing lines sketch three stages of progress: blaming others, blaming oneself, blaming no one.',
    tags: ['suffering', 'self-knowledge', 'death'], weight: 5,
  },
  {
    canonicalRef: 'Enchiridion 8',
    ...ENCH,
    original: { ...GRC_ENCH, start: 'μὴ ζήτει τὰ γινόμενα γίνεσθαι ὡς θέλεις', end: 'ὡς γίνεται καὶ εὐροήσεις.' },
    english: { ...LONG, start: 'Seek not that the things which happen should happen as you wish', end: 'you will have a tranquil flow of life.' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'Do not demand that events happen as you wish; wish them to happen as they do, and your life will flow smoothly.',
    summaryZh: '不要要求事情按你的意愿发生，而要愿意事情如其所是地发生，这样你的生活就会顺畅安宁。',
    similarQuestions: ['How do I accept what I cannot change?', 'How do I stop being disappointed?', 'What is the secret to inner peace?', 'How do I let go of expectations?'],
    contextNote: 'Enchiridion 8. The Stoics held that events unfold by the reason of the cosmos; peace comes from aligning one’s will with that order rather than resisting it.',
    tags: ['nature', 'desire', 'happiness'], weight: 5,
  },
  {
    canonicalRef: 'Enchiridion 10',
    ...ENCH,
    original: { ...GRC_ENCH, start: 'ἐφʼ ἑκάστου τῶν προσπιπτόντων μέμνησο', end: 'οὐ συναρπάσουσιν αἱ φαντασίαι.' },
    english: { ...LONG, start: 'On the occasion of every accident (event) that befalls you', end: 'the appearances will not carry you along with them.' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'For everything that befalls you, ask what power you have to meet it: temptation calls for self-control, hardship for endurance, insults for patience. Trained this way, impressions will not sweep you away.',
    summaryZh: '遇到任何事，都要反问自己有什么能力去应对它：面对诱惑用自制，面对劳苦用坚忍，面对辱骂用忍耐。这样训练成习惯，表象就不会把你卷走。',
    similarQuestions: ['How do I develop self-discipline?', 'How should I handle pain and temptation?', 'What is the secret to resilience?'],
    contextNote: 'Enchiridion 10. The famous two-word motto “bear and forbear” (anechou kai apechou) is reported for Epictetus only by Aulus Gellius (Attic Nights 17.19); this chapter, which pairs endurance with self-restraint, is the closest passage in the Enchiridion.',
    tags: ['discipline', 'perseverance', 'practice'], weight: 4,
  },
  {
    canonicalRef: 'Enchiridion 14.2',
    ...ENCH,
    original: { ...GRC_ENCH, start: 'κύριος ἑκάστου ἐστὶν', end: 'εἰ δὲ μή, δουλεύειν ἀνάγκη.' },
    english: { ...LONG, start: 'He is the master of every man who has the power', end: 'if he does not observe this rule, he must be a slave.' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'Whoever controls what you want or fear is your master. To be free, neither desire nor avoid anything that depends on others.',
    summaryZh: '谁掌握着你想要或害怕的东西，谁就是你的主人。想要自由，就不要渴求或逃避任何取决于他人的东西。',
    similarQuestions: ['What is true freedom?', 'Why do I feel controlled by others?', 'Am I free if my happiness depends on other people?'],
    contextNote: 'Enchiridion 14. The saying often quoted as “No man is free who is not master of himself” is not in the Discourses or the Enchiridion; this chapter is the closest genuine statement of the idea. Epictetus spent his youth as a slave in Rome.',
    tags: ['freedom', 'desire', 'discipline'], weight: 5,
  },
  {
    canonicalRef: 'Enchiridion 17',
    ...ENCH,
    original: { ...GRC_ENCH, start: 'μέμνησο, ὅτι ὑποκριτὴς εἶ δράματος', end: 'ἐκλέξασθαι δʼ αὐτὸ ἄλλου.' },
    english: { ...LONG, start: 'Remember that thou art an actor in a play', end: 'but to select the part, belongs to another.' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'You are an actor in a play whose author chooses the part — short or long, poor man, lame man, magistrate or private person. Your job is to play the given part well; choosing it belongs to another.',
    summaryZh: '你是一出戏里的演员，角色由作者决定——戏长戏短，演穷人、跛子、官员还是平民。你的本分是演好分给你的角色，挑选角色则是别人的事。',
    similarQuestions: ['How do I accept my circumstances?', 'What if I am dealt a bad hand in life?', 'How do I find meaning in an unchosen situation?'],
    contextNote: 'Enchiridion 17. The theatrical metaphor: circumstances are given, but how you respond to them is yours. Epictetus, born a slave and lame, spoke from experience.',
    tags: ['duty', 'destiny', 'character'], weight: 4,
  },
  {
    canonicalRef: 'Enchiridion 23',
    ...ENCH,
    original: { ...GRC_ENCH, start: 'ἐάν ποτέ σοι γένηται ἔξω στραφῆναι', end: 'ἀρκοῦ οὖν ἐν παντὶ τῷ εἶναι φιλόσοφος' },
    english: { ...LONG, start: 'If it should ever happen to you to be turned to externals', end: 'Be satisfied then in everything with being a philosopher' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'If you ever turn outward in order to please someone, you have lost your purpose. Be content in everything simply with being a philosopher.',
    summaryZh: '一旦你为了讨好别人而转向外物，你就失去了自己的立足点。在一切事上，满足于做一个哲学家就够了。',
    similarQuestions: ['How do I stop caring about what others think?', 'How do I build self-confidence?', 'Why do I need validation from others?'],
    contextNote: 'Enchiridion 23 (the excerpt stops before the last clause, where the Greek edition marks two words as deleted). The chapter goes on: if you also want to seem a philosopher, seem one to yourself — philosophy is lived, not performed for an audience.',
    tags: ['self-knowledge', 'character', 'virtue'], weight: 3,
  },
  {
    canonicalRef: 'Enchiridion 39',
    ...ENCH,
    original: { ...GRC_ENCH, start: 'μέτρον κτήσεως τὸ σῶμα ἑκάστῳ', end: 'ὅρος οὐθείς ἐστιν.' },
    english: { ...LONG, start: 'The measure of possession (property) is to every man the body', end: 'no limit to that which has once passed the true measure.' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'The body’s needs are the right measure of possessions, as the foot is the measure of the shoe. Once you pass that measure there is no limit: the shoe becomes gilded, then purple, then embroidered.',
    summaryZh: '身体的需要是财物的尺度，正如脚是鞋的尺度。一旦越过这个尺度就再无止境：鞋先镀金，再染紫，再绣花。',
    similarQuestions: ['How do I become content with what I have?', 'Is wealth the key to happiness?', 'How do I stop wanting more?', 'How much is enough?'],
    contextNote: 'Enchiridion 39. The popular line “Wealth consists not in having great possessions, but in having few wants” does not appear in the Discourses or the Enchiridion; this chapter is Epictetus’ own image for the limits of wanting.',
    tags: ['wealth', 'desire', 'simplicity'], weight: 4,
  },
  {
    canonicalRef: 'Discourses 1.1.21–25',
    ...DISC1,
    original: { ...GRC_DISC, start: 'τί οὖν δεῖ πρόχειρον ἔχειν ἐν τοῖς τοιούτοις;', end: 'ἐν τούτοις γυμνάζεσθαι.' },
    english: { ...LONG, start: 'What then should a man have in readiness in such circumstances?', end: 'in which they should exercise themselves.' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'Keep ready the distinction between what is mine and what is not. A tyrant can chain my leg, imprison my body or cut off my head, but not even Zeus can overpower my will.',
    summaryZh: '随时备好这个区分：什么是我的，什么不是我的。暴君可以锁住我的腿、囚禁我的身体、砍下我的头，但我的意志连宙斯也无法征服。',
    similarQuestions: ['What is true freedom?', 'Can anyone take away my inner freedom?', 'How do I stay free under pressure?', 'How do I face threats calmly?'],
    contextNote: 'Discourses I.1, “Of the things which are in our power and not in our power”. Epictetus, who spent his youth as a slave of Nero’s freedman Epaphroditus, locates freedom in the will (prohairesis), which no external force can reach.',
    tags: ['freedom', 'courage', 'choice'], weight: 5,
  },
  {
    canonicalRef: 'Discourses 1.24.1–2',
    ...DISC1,
    original: { ...GRC_DISC, start: 'αἱ περιστάσεις εἰσὶν αἱ τοὺς ἄνδρας δεικνύουσαι.', end: 'ἂν θέλῃς ὡς ἀθλητὴς νεανίσκῳ χρῆσθαι.' },
    english: { ...LONG, start: 'It is circumstances (difficulties) which show what men are.', end: 'as an athlete would deal with a young antagonist.' },
    sourceUrl: GUTENBERG, license: LICENSE,
    summaryEn: 'Difficulties show what people are. When one falls on you, remember that God, like a wrestling trainer, has matched you with a tough young opponent so that you may become an Olympic victor — which cannot happen without sweat.',
    summaryZh: '困境显出一个人的本色。困难降临时，要记得：神像摔跤教练一样，给你配了一个强悍的年轻对手，好让你成为奥林匹亚的胜者——而这离不开汗水。',
    similarQuestions: ['Why is life so hard?', 'How can I grow from challenges?', 'Is there purpose in my struggles?'],
    contextNote: 'Discourses I.24, “How we should struggle with circumstances”. The athletic metaphor was central to Stoic teaching: the philosopher is an athlete of the soul, and hardships are the training.',
    tags: ['perseverance', 'suffering', 'courage'], weight: 4,
  },
];

const work: ExcerptWork = {
  thinkerSlug: 'epictetus',
  dataFile: 'epictetus-discourses-enchiridion.json',
  thinkerName: 'Epictetus',
  tradition: 'stoicism',
  supersedes: ['Discourses and Enchiridion'],
  work: {
    titleEn: 'Discourses and Enchiridion (Selected Passages)',
    titleZh: '论说集与手册（精选）',
    titleOrig: 'Διατριβαί / Ἐγχειρίδιον',
    language: 'ancient-greek',
    circaYear: 108,
    description:
      'Selected passages from the teachings of Epictetus as recorded by his student Arrian: the Discourses and the Enchiridion (Manual). Greek text of Heinrich Schenkl’s edition from the Perseus Digital Library (CC BY-SA 4.0), with the public-domain English translation of George Long, via Project Gutenberg (and, for Enchiridion 1, Perseus’s digitisation of the same translation).',
    copyright: 'Greek CC BY-SA 4.0 · English PD',
    sourceUrl: 'https://www.gutenberg.org/ebooks/10661',
  },
  items,
};

export default work;
