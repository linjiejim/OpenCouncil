import type { Database } from '../index.js';
import { themes, tags, thinkers } from '../schema/index.js';

export const THEMES_SEED = [
  { slug: 'existence', nameEn: 'Existence', nameZh: '存在', icon: '🌌', description: 'Meaning of life, death, suffering, time, free will', sortOrder: 1 },
  { slug: 'ethics', nameEn: 'Ethics', nameZh: '伦理', icon: '⚖️', description: 'Good and evil, justice, duty, honesty, compassion', sortOrder: 2 },
  { slug: 'relationships', nameEn: 'Relationships', nameZh: '关系', icon: '🤝', description: 'Love, friendship, family, community, solitude', sortOrder: 3 },
  { slug: 'self', nameEn: 'Self', nameZh: '自我', icon: '🪞', description: 'Identity, virtue, desire, discipline, happiness', sortOrder: 4 },
  { slug: 'society', nameEn: 'Society', nameZh: '社会', icon: '🏛️', description: 'Power, wealth, education, governance, equality', sortOrder: 5 },
  { slug: 'knowledge', nameEn: 'Knowledge', nameZh: '知识', icon: '📚', description: 'Truth, wisdom, doubt, faith, reason', sortOrder: 6 },
  { slug: 'transcendence', nameEn: 'Nature & Transcendence', nameZh: '自然与超越', icon: '✨', description: 'Cosmos, divinity, soul, nature, destiny', sortOrder: 7 },
  { slug: 'action', nameEn: 'Action', nameZh: '行动', icon: '🎯', description: 'Courage, perseverance, choice, practice, non-action', sortOrder: 8 },
];

export const TAGS_SEED = [
  // Existence
  { slug: 'meaning-of-life', nameEn: 'Meaning of Life', nameZh: '人生意义', themeSlug: 'existence' },
  { slug: 'death', nameEn: 'Death & Mortality', nameZh: '死亡', themeSlug: 'existence' },
  { slug: 'suffering', nameEn: 'Suffering', nameZh: '苦难', themeSlug: 'existence' },
  { slug: 'impermanence', nameEn: 'Impermanence', nameZh: '无常', themeSlug: 'existence' },
  { slug: 'freedom', nameEn: 'Freedom & Free Will', nameZh: '自由', themeSlug: 'existence' },
  // Ethics
  { slug: 'justice', nameEn: 'Justice', nameZh: '正义', themeSlug: 'ethics' },
  { slug: 'goodness', nameEn: 'Goodness', nameZh: '善', themeSlug: 'ethics' },
  { slug: 'duty', nameEn: 'Duty & Responsibility', nameZh: '责任', themeSlug: 'ethics' },
  { slug: 'honesty', nameEn: 'Honesty & Integrity', nameZh: '诚信', themeSlug: 'ethics' },
  { slug: 'compassion', nameEn: 'Compassion', nameZh: '慈悲', themeSlug: 'ethics' },
  { slug: 'benevolence', nameEn: 'Benevolence', nameZh: '仁', themeSlug: 'ethics' },
  // Relationships
  { slug: 'love', nameEn: 'Love', nameZh: '爱', themeSlug: 'relationships' },
  { slug: 'friendship', nameEn: 'Friendship', nameZh: '友谊', themeSlug: 'relationships' },
  { slug: 'family', nameEn: 'Family', nameZh: '家庭', themeSlug: 'relationships' },
  { slug: 'community', nameEn: 'Community', nameZh: '社群', themeSlug: 'relationships' },
  { slug: 'solitude', nameEn: 'Solitude', nameZh: '孤独', themeSlug: 'relationships' },
  // Self
  { slug: 'self-knowledge', nameEn: 'Self-Knowledge', nameZh: '自知', themeSlug: 'self' },
  { slug: 'virtue', nameEn: 'Virtue', nameZh: '美德', themeSlug: 'self' },
  { slug: 'desire', nameEn: 'Desire & Moderation', nameZh: '欲望', themeSlug: 'self' },
  { slug: 'discipline', nameEn: 'Discipline', nameZh: '自律', themeSlug: 'self' },
  { slug: 'happiness', nameEn: 'Happiness', nameZh: '幸福', themeSlug: 'self' },
  { slug: 'character', nameEn: 'Character', nameZh: '品格', themeSlug: 'self' },
  // Society
  { slug: 'governance', nameEn: 'Governance', nameZh: '治理', themeSlug: 'society' },
  { slug: 'wealth', nameEn: 'Wealth & Poverty', nameZh: '贫富', themeSlug: 'society' },
  { slug: 'education', nameEn: 'Education', nameZh: '教育', themeSlug: 'society' },
  { slug: 'power', nameEn: 'Power', nameZh: '权力', themeSlug: 'society' },
  { slug: 'equality', nameEn: 'Equality', nameZh: '平等', themeSlug: 'society' },
  // Knowledge
  { slug: 'truth', nameEn: 'Truth', nameZh: '真理', themeSlug: 'knowledge' },
  { slug: 'wisdom', nameEn: 'Wisdom', nameZh: '智慧', themeSlug: 'knowledge' },
  { slug: 'doubt', nameEn: 'Doubt & Inquiry', nameZh: '怀疑', themeSlug: 'knowledge' },
  { slug: 'faith', nameEn: 'Faith', nameZh: '信仰', themeSlug: 'knowledge' },
  { slug: 'reason', nameEn: 'Reason', nameZh: '理性', themeSlug: 'knowledge' },
  // Transcendence
  { slug: 'nature', nameEn: 'Nature', nameZh: '自然', themeSlug: 'transcendence' },
  { slug: 'divinity', nameEn: 'Divinity', nameZh: '神性', themeSlug: 'transcendence' },
  { slug: 'soul', nameEn: 'Soul & Spirit', nameZh: '灵魂', themeSlug: 'transcendence' },
  { slug: 'destiny', nameEn: 'Destiny & Fate', nameZh: '命运', themeSlug: 'transcendence' },
  { slug: 'cosmos', nameEn: 'Cosmos', nameZh: '宇宙', themeSlug: 'transcendence' },
  // Action
  { slug: 'courage', nameEn: 'Courage', nameZh: '勇气', themeSlug: 'action' },
  { slug: 'perseverance', nameEn: 'Perseverance', nameZh: '坚韧', themeSlug: 'action' },
  { slug: 'choice', nameEn: 'Choice & Decision', nameZh: '选择', themeSlug: 'action' },
  { slug: 'practice', nameEn: 'Practice', nameZh: '实践', themeSlug: 'action' },
  { slug: 'non-action', nameEn: 'Non-Action (Wu Wei)', nameZh: '无为', themeSlug: 'action' },
  { slug: 'simplicity', nameEn: 'Simplicity', nameZh: '简朴', themeSlug: 'action' },
];

export const THINKERS_SEED = [
  {
    slug: 'confucius', nameEn: 'Confucius', nameZh: '孔子', nameOrig: '孔丘',
    tradition: 'confucianism', era: '551–479 BCE', bornYear: -551, diedYear: -479, region: 'China',
    bioEn: 'Chinese philosopher and politician of the Spring and Autumn period. He is traditionally credited as the founder of Confucianism. His philosophy emphasized personal and governmental morality, correctness of social relationships, justice, kindness, and sincerity.',
    bioZh: '春秋时期中国哲学家、政治家。被尊为儒家学派创始人。他的哲学强调个人与政治道德、社会关系的正确性、正义、仁慈与诚信。',
    coreIdeasEn: 'Ren (benevolence), Li (ritual propriety), Junzi (the exemplary person), Rectification of names, Filial piety',
    coreIdeasZh: '仁、礼、君子、正名、孝',
  },
  {
    slug: 'laozi', nameEn: 'Laozi', nameZh: '老子', nameOrig: '李耳',
    tradition: 'daoism', era: '~6th century BCE', bornYear: -600, diedYear: -500, region: 'China',
    bioEn: 'Ancient Chinese philosopher, traditionally regarded as the founder of Daoism and the author of the Tao Te Ching. His philosophy emphasizes living in harmony with the Tao (the Way), the fundamental nature of the universe.',
    bioZh: '中国古代哲学家，被尊为道家学派创始人，《道德经》作者。他的哲学强调与道和谐共处——道是宇宙万物的根本。',
    coreIdeasEn: 'Tao (the Way), Wu Wei (non-action), Naturalness, Simplicity, Paradox of opposites',
    coreIdeasZh: '道、无为、自然、朴素、对立统一',
  },
  {
    slug: 'zhuangzi', nameEn: 'Zhuangzi', nameZh: '庄子', nameOrig: '庄周',
    tradition: 'daoism', era: '369–286 BCE', bornYear: -369, diedYear: -286, region: 'China',
    bioEn: 'Chinese philosopher who lived during the Warring States period. A central figure in Daoism, known for his playful, paradoxical stories that challenge fixed perspectives. His writings are celebrated for their literary brilliance and philosophical depth.',
    bioZh: '战国时期中国哲学家。道家核心人物，以充满游戏性的寓言和悖论闻名，挑战固有的认知框架。其著作以文学才华和哲学深度著称。',
    coreIdeasEn: 'Relativity of perspectives, Wandering freely, Transformation of things, Uselessness as usefulness',
    coreIdeasZh: '齐物论、逍遥游、物化、无用之用',
  },
  {
    slug: 'dhammapada', nameEn: 'Buddhism · The Dhammapada', nameZh: '佛教 · 法句经', nameOrig: 'Dhammapada',
    tradition: 'buddhism', era: 'c. 3rd century BCE', bornYear: -300, diedYear: null, region: 'India',
    bioEn: 'A collection of 423 verses from the Pali Canon, traditionally received as sayings of the Buddha. OpenCouncil presents it as a text of the Buddhist tradition: the council quotes it and describes what it teaches, without speaking as the Buddha.',
    bioZh: '巴利三藏中的一部偈颂集，共 423 偈，传统上视为佛陀的言教。OpenCouncil 把它作为佛教传统的经典来呈现：议事厅引用原文、转述其教导，不以佛陀的口吻说话。',
    coreIdeasEn: 'Mind as forerunner, Non-hatred, Heedfulness, Self-mastery, Impermanence, The path',
    coreIdeasZh: '心为法本、以无怨止怨、不放逸、自制、无常、道',
  },
  {
    slug: 'wang-yangming', nameEn: 'Wang Yangming', nameZh: '王阳明', nameOrig: '王守仁',
    tradition: 'confucianism', era: '1472–1529', bornYear: 1472, diedYear: 1529, region: 'China',
    bioEn: 'Chinese philosopher, statesman, and military strategist during the Ming dynasty. He developed the philosophy of "innate knowing" (liangzhi) and the "unity of knowledge and action" (zhixing heyi), emphasizing that moral knowledge is inseparable from moral action.',
    bioZh: '明代中国哲学家、政治家和军事家。他发展了"良知"和"知行合一"的哲学思想，强调道德认知与道德实践不可分离。',
    coreIdeasEn: 'Unity of knowledge and action, Innate moral knowing (Liangzhi), Mind as principle',
    coreIdeasZh: '知行合一、良知、心即理',
  },
  {
    slug: 'plato', nameEn: 'Plato (Socrates)', nameZh: '柏拉图（苏格拉底）', nameOrig: 'Πλάτων',
    tradition: 'ancient-greek', era: '428–348 BCE', bornYear: -428, diedYear: -348, region: 'Greece',
    bioEn: 'Athenian philosopher, student of Socrates and teacher of Aristotle. Through his dialogues, he preserved and developed Socrates\' method of inquiry. His works explore justice, beauty, equality, and the nature of reality, establishing foundational Western philosophy.',
    bioZh: '雅典哲学家，苏格拉底的学生、亚里士多德的老师。他通过对话录保存并发展了苏格拉底的探究方法。其著作探讨了正义、美、平等和实在的本质，奠定了西方哲学的基础。',
    coreIdeasEn: 'Theory of Forms, Socratic method, Philosopher-king, Allegory of the Cave, Examined life',
    coreIdeasZh: '理型论、苏格拉底方法、哲人王、洞穴寓言、审视过的人生',
  },
  {
    slug: 'aristotle', nameEn: 'Aristotle', nameZh: '亚里士多德', nameOrig: 'Ἀριστοτέλης',
    tradition: 'ancient-greek', era: '384–322 BCE', bornYear: -384, diedYear: -322, region: 'Greece',
    bioEn: 'Greek philosopher and polymath. Student of Plato and tutor of Alexander the Great. His works cover logic, metaphysics, ethics, politics, biology, and aesthetics. His Nicomachean Ethics remains one of the most important works on how to live well.',
    bioZh: '古希腊哲学家和博学家。柏拉图的学生、亚历山大大帝的老师。其著作涵盖逻辑学、形而上学、伦理学、政治学、生物学和美学。《尼各马可伦理学》至今仍是关于如何美好生活最重要的著作之一。',
    coreIdeasEn: 'Eudaimonia (flourishing), Virtue ethics, Golden mean, Practical wisdom (phronesis), Four causes',
    coreIdeasZh: '幸福（eudaimonia）、美德伦理学、中庸之道、实践智慧、四因说',
  },
  {
    slug: 'marcus-aurelius', nameEn: 'Marcus Aurelius', nameZh: '马可·奥勒留', nameOrig: 'Marcus Aurelius Antoninus',
    tradition: 'stoicism', era: '121–180 CE', bornYear: 121, diedYear: 180, region: 'Rome',
    bioEn: 'Roman Emperor from 161 to 180 CE and a Stoic philosopher. His private journal, Meditations, written during military campaigns, is a profound record of self-examination and Stoic practice. A rare intersection of supreme political power and philosophical wisdom.',
    bioZh: '公元161年至180年的罗马皇帝，斯多葛哲学家。他在军旅途中写下的私人日记《沉思录》，是一部深刻的自我审视和斯多葛实践记录。政治最高权力与哲学智慧的罕见交汇。',
    coreIdeasEn: 'Control what you can, Impermanence, Duty, Rational nature, Cosmic perspective',
    coreIdeasZh: '控制可控之事、无常、责任、理性本质、宇宙视角',
  },
  {
    slug: 'gospels', nameEn: 'Christianity · The Gospels', nameZh: '基督教 · 福音书', nameOrig: 'Τὰ Εὐαγγέλια',
    tradition: 'christianity', era: 'c. 70–100 CE', bornYear: 70, diedYear: 100, region: 'Eastern Mediterranean',
    bioEn: 'The four Gospels of the New Testament — Matthew, Mark, Luke and John — which record the life and teaching of Jesus of Nazareth. OpenCouncil presents them as texts of the Christian tradition: the council quotes them and describes what they teach, without speaking as Jesus.',
    bioZh: '新约中的四部福音书——马太、马可、路加、约翰——记载了拿撒勒人耶稣的生平与教导。OpenCouncil 把它们作为基督教传统的经典来呈现：议事厅引用原文、转述其教导，不以耶稣的口吻说话。',
    coreIdeasEn: 'Love of neighbour, Forgiveness, Kingdom of God, Beatitudes, Golden Rule, Parables',
    coreIdeasZh: '爱人如己、宽恕、天国、八福、黄金法则、比喻',
  },
  {
    slug: 'seneca', nameEn: 'Seneca', nameZh: '塞涅卡', nameOrig: 'Lucius Annaeus Seneca',
    tradition: 'stoicism', era: '4 BCE – 65 CE', bornYear: -4, diedYear: 65, region: 'Rome',
    bioEn: 'Roman Stoic philosopher, statesman, dramatist, and tutor to Emperor Nero. His Moral Letters to Lucilius and essays on anger, brevity of life, and tranquility are among the most readable and practical works of ancient philosophy.',
    bioZh: '罗马斯多葛哲学家、政治家、戏剧家，皇帝尼禄的导师。他写给卢基里乌斯的道德书简，以及关于愤怒、生命之短暂和宁静的论文，是古代哲学中最可读、最实用的著作之一。',
    coreIdeasEn: 'Shortness of life, Anger management, Tranquility of mind, Providence, Wealth and virtue',
    coreIdeasZh: '生命短暂、控制愤怒、心灵宁静、天命、财富与美德',
  },
  // === Phase 1: New thinkers ===
  {
    slug: 'mencius', nameEn: 'Mencius', nameZh: '孟子', nameOrig: '孟轲',
    tradition: 'confucianism', era: '372–289 BCE', bornYear: -372, diedYear: -289, region: 'China',
    bioEn: 'Confucian philosopher known as the "Second Sage." He developed the theory of innate human goodness and advocated for benevolent governance, arguing that the people are the most important element in a state.',
    bioZh: '被尊为"亚圣"的儒家哲学家。发展了性善论，倡导仁政，认为"民为贵，社稷次之，君为轻"。',
    coreIdeasEn: 'Innate goodness, Four sprouts of virtue, Benevolent governance, Flood-like qi, People as foundation',
    coreIdeasZh: '性善论、四端、仁政、浩然之气、民为贵',
  },
  {
    slug: 'epictetus', nameEn: 'Epictetus', nameZh: '爱比克泰德', nameOrig: 'Ἐπίκτητος',
    tradition: 'stoicism', era: '50–135 CE', bornYear: 50, diedYear: 135, region: 'Rome/Greece',
    bioEn: 'Born a slave in Hierapolis, Epictetus became one of the most influential Stoic philosophers. His teachings on the dichotomy of control — distinguishing what is "up to us" from what is not — form the practical core of Stoic philosophy and the basis of modern CBT.',
    bioZh: '生于希拉波利斯的奴隶，后成为最具影响力的斯多葛哲学家之一。他关于"控制的二分法"的教导——区分什么是"取决于我们的"和什么不是——构成了斯多葛哲学的实践核心，也是现代认知行为疗法的基础。',
    coreIdeasEn: 'Dichotomy of control, Inner freedom, Bear and forbear, Role ethics, Judgments cause suffering',
    coreIdeasZh: '控制的二分法、内在自由、忍受与克制、角色伦理、判断导致痛苦',
  },
  {
    slug: 'nietzsche', nameEn: 'Friedrich Nietzsche', nameZh: '尼采', nameOrig: 'Friedrich Wilhelm Nietzsche',
    tradition: 'existentialism', era: '1844–1900', bornYear: 1844, diedYear: 1900, region: 'Germany',
    bioEn: 'German philosopher whose provocative ideas about the Übermensch, eternal recurrence, and the death of God challenged conventional morality and affirmed life in all its complexity. His work profoundly influenced existentialism, postmodernism, and psychology.',
    bioZh: '德国哲学家，其关于超人、永恒轮回和上帝之死的挑衅性思想挑战了传统道德观，肯定了生命的全部复杂性。深刻影响了存在主义、后现代主义和心理学。',
    coreIdeasEn: 'Will to power, Übermensch, Eternal recurrence, Amor fati, Revaluation of all values',
    coreIdeasZh: '权力意志、超人、永恒轮回、爱命运、重估一切价值',
  },
  {
    slug: 'kant', nameEn: 'Immanuel Kant', nameZh: '康德', nameOrig: 'Immanuel Kant',
    tradition: 'enlightenment', era: '1724–1804', bornYear: 1724, diedYear: 1804, region: 'Germany',
    bioEn: 'Central figure in modern philosophy. His categorical imperative in ethics, his "Copernican revolution" in epistemology, and his vision of perpetual peace have shaped the entire trajectory of Western thought. His motto "Sapere aude" (dare to know) defined the Enlightenment.',
    bioZh: '现代哲学核心人物。他在伦理学上的绝对命令、认识论上的"哥白尼革命"和永久和平愿景塑造了西方思想的整个走向。他的座右铭"Sapere aude"（敢于求知）定义了启蒙运动。',
    coreIdeasEn: 'Categorical imperative, Sapere aude, Duty ethics, Perpetual peace, Critique of pure reason',
    coreIdeasZh: '绝对命令、敢于求知、义务伦理学、永久和平、纯粹理性批判',
  },
  {
    slug: 'rumi', nameEn: 'Rumi', nameZh: '鲁米', nameOrig: 'جلال‌الدین محمد بلخی',
    tradition: 'sufism', era: '1207–1273', bornYear: 1207, diedYear: 1273, region: 'Persia/Turkey',
    bioEn: 'Persian Sufi mystic poet and Islamic scholar. His Masnavi is considered one of the greatest works of mystical literature. Rumi\'s poetry transcends cultural and religious boundaries, celebrating divine love, the soul\'s journey, and the unity of all existence.',
    bioZh: '波斯苏菲神秘主义诗人和伊斯兰学者。其《玛斯纳维》被视为神秘主义文学最伟大的作品之一。鲁米的诗歌超越文化和宗教界限，歌颂神圣之爱、灵魂之旅和万物一体。',
    coreIdeasEn: 'Divine love, Soul\'s journey, Unity of existence, Inner transformation, The Guest House',
    coreIdeasZh: '神圣之爱、灵魂之旅、万物一体、内在转化、客栈',
  },
  {
    slug: 'quran', nameEn: 'Islam · The Quran', nameZh: '伊斯兰 · 古兰经', nameOrig: 'القرآن',
    tradition: 'islam', era: '610–632 CE', bornYear: 610, diedYear: 632, region: 'Arabia',
    bioEn: 'The scripture of Islam, which Muslims believe God revealed to the Prophet Muhammad over some twenty-three years (610–632 CE). OpenCouncil presents it as the text of the Islamic tradition: the council quotes it and describes what it teaches, never speaking in the voice of God or of the Prophet.',
    bioZh: '伊斯兰教的经典。穆斯林相信它是真主在约二十三年间（公元 610–632 年）降示给先知穆罕默德的启示。OpenCouncil 把它作为伊斯兰传统的经典来呈现：议事厅引用原文、转述其教导，绝不以真主或先知的口吻说话。',
    coreIdeasEn: 'Mercy, Justice, Patience, Gratitude, Human dignity, Accountability',
    coreIdeasZh: '仁慈、公正、坚忍、感恩、人的尊严、善恶有报',
  },
];

export async function seedDatabase(db: Database) {
  console.log('🌱 Seeding themes...');
  await db.insert(themes).values(THEMES_SEED).onConflictDoNothing();

  console.log('🏷️ Seeding tags...');
  // Get theme IDs
  const themeRows = await db.select().from(themes);
  const themeMap = new Map(themeRows.map((t) => [t.slug, t.id]));

  const tagValues = TAGS_SEED.map((t) => ({
    slug: t.slug,
    nameEn: t.nameEn,
    nameZh: t.nameZh,
    themeId: themeMap.get(t.themeSlug) ?? null,
  }));
  await db.insert(tags).values(tagValues).onConflictDoNothing();

  console.log('🧠 Seeding thinkers...');
  // Upsert, so edits to names / bios here reach an already-seeded database.
  for (const t of THINKERS_SEED) {
    const fields: Partial<typeof t> = { ...t };
    delete fields.slug;
    await db.insert(thinkers).values(t).onConflictDoUpdate({ target: thinkers.slug, set: fields });
  }

  console.log('✅ Seed complete!');
}
