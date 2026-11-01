/**
 * Content collector — `pnpm content:collect`
 *
 * The honest split that makes "可溯源 / traceable" real:
 *   • original text + translation  → fetched VERBATIM from an authoritative,
 *     public-domain/CC0 source (never written by us or an LLM)
 *   • editorial metadata (summary, similar questions, context) → authored here,
 *     and clearly separable from the sourced text
 *
 * For each curated canonical reference we fetch the verbatim text, run it through
 * the verification gate, and (only if it passes) write it into a committed JSON
 * data file. `content:import` then loads those files. Collection (network, occasional)
 * is thus decoupled from import (deterministic, offline).
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fetchDhammapadaVerse } from './sources/suttacentral.js';
import { fetchQuranVerse } from './sources/quran.js';
import { fetchGospelVerse } from './sources/gospels.js';
import { fetchAnalects } from './sources/legge.js';
import { fetchRumiPassage, type RumiSpec } from './sources/rumi.js';
import { fetchDaodejing } from './sources/daodejing.js';
import { fetchExcerpt } from './sources/excerpt.js';
import { EXCERPT_WORKS } from './excerpts/index.js';
import { verify } from './sources/verify.js';
import { enrich, ENRICH_MODEL } from './sources/enrich.js';
import type { FetchedText } from './sources/types.js';
import {
  ALLOWED_TAGS, mapPool, dhpItem, quranItem, gospelItem, analectsItem, daodejingItem,
  type Curated,
} from './works.js';

const DATA_DIR = resolve(import.meta.dirname, 'data');

type Fetcher = (ref: string) => Promise<FetchedText>;

async function buildWork(opts: {
  work: Record<string, unknown>;
  thinkerName: string;
  tradition: string;
  fetcher: Fetcher;
  curated: Curated[];
}) {
  const { work, thinkerName, tradition, fetcher, curated } = opts;
  let verified = 0;
  let skipped = 0;

  // Fetch + verify + (enrich if needed), concurrently, preserving order.
  const built = await mapPool(curated, 6, async (c) => {
    let text: FetchedText;
    try {
      text = await fetcher(c.ref);
    } catch (err) {
      console.warn(`  ⚠️  fetch failed for ${c.ref}: ${String(err)} — skipping`);
      skipped++;
      return null;
    }
    const v = verify(text);
    if (v.status !== 'verified') {
      console.warn(`  ⚠️  ${text.canonicalRef} failed verification (${v.issues.join('; ')}) — skipping`);
      skipped++;
      return null;
    }
    if (c.expectContains && !text.originalText.includes(c.expectContains)) {
      console.warn(`  ⚠️  ${text.canonicalRef} integrity check failed (missing「${c.expectContains}」) — skipping`);
      skipped++;
      return null;
    }

    // Editorial metadata: hand-authored if present, else LLM-derived.
    let meta: Required<Pick<Curated, 'summaryEn' | 'summaryZh' | 'similarQuestions' | 'contextNote' | 'tags' | 'weight'>>;
    let metadataSource: string;
    if (c.summaryEn && c.summaryZh && c.similarQuestions?.length) {
      meta = {
        summaryEn: c.summaryEn, summaryZh: c.summaryZh, similarQuestions: c.similarQuestions,
        contextNote: c.contextNote ?? '', tags: c.tags ?? [], weight: c.weight ?? 3,
      };
      metadataSource = 'editorial';
    } else {
      try {
        const e = await enrich({
          thinkerName, tradition, canonicalRef: text.canonicalRef,
          originalText: text.originalText, englishText: text.englishText, allowedTags: ALLOWED_TAGS,
        });
        meta = { ...e, weight: c.weight ?? e.weight };
        metadataSource = ENRICH_MODEL;
      } catch (err) {
        console.warn(`  ⚠️  enrich failed for ${text.canonicalRef}: ${String(err)} — skipping`);
        skipped++;
        return null;
      }
    }

    verified++;
    console.log(`  ✅ ${text.canonicalRef} (${metadataSource})`);
    return {
      chapter: { titleEn: c.chapterEn, titleZh: c.chapterZh, titleOrig: c.chapterOrig },
      passage: {
        // sourced, verbatim
        originalText: text.originalText,
        englishText: text.englishText,
        transliteration: text.transliteration,
        canonicalRef: text.canonicalRef,
        originalLang: text.originalLang,
        translator: text.translator,
        sourceUrl: text.sourceUrl,
        license: text.license,
        verificationStatus: v.status,
        metadataSource,
        // editorial (authored or AI-derived)
        ...meta,
      },
    };
  });

  // Group into chapters, preserving first-seen order.
  const chapterOrder: string[] = [];
  const byChapter = new Map<string, { titleEn: string; titleZh: string; titleOrig?: string; passages: unknown[] }>();
  for (const b of built) {
    if (!b) continue;
    const key = b.chapter.titleEn;
    if (!byChapter.has(key)) {
      chapterOrder.push(key);
      byChapter.set(key, { ...b.chapter, passages: [] });
    }
    byChapter.get(key)!.passages.push(b.passage);
  }

  const out = { work, chapters: chapterOrder.map((k) => byChapter.get(k)!) };
  return { out, verified, skipped };
}

// ─────────────────────────────────────────────────────────────────────────────
// Curation: Dhammapada
// ─────────────────────────────────────────────────────────────────────────────
const DHAMMAPADA: Curated[] = [
  {
    ref: '1', chapterEn: 'Yamakavagga (Pairs)', chapterZh: '双品', chapterOrig: 'Yamakavagga',
    summaryEn: 'Mind precedes all things. Act from a corrupt mind and suffering follows like a cartwheel behind the ox.',
    summaryZh: '心是万法的先导。以败坏之心行事，痛苦便如车轮跟随拉车的牛一样随之而来。',
    similarQuestions: ['How does my thinking shape my life?', 'Why do I keep suffering?', 'Can I change my mindset?'],
    contextNote: 'The opening verse of the Dhammapada, placing mind at the root of all experience — centuries before modern cognitive psychology.',
    tags: ['wisdom', 'self-knowledge', 'suffering'], weight: 5,
  },
  {
    ref: '5', chapterEn: 'Yamakavagga (Pairs)', chapterZh: '双品', chapterOrig: 'Yamakavagga',
    summaryEn: 'Hatred is never ended by hatred, only by love. This is an ancient, unchanging law.',
    summaryZh: '仇恨永远无法止息仇恨，唯有以爱方能止息。这是亘古不变的法则。',
    similarQuestions: ['How do I break a cycle of revenge?', 'How should I respond to hatred?', 'Is forgiveness weakness?'],
    contextNote: 'One of the most quoted Buddhist verses. It parallels, yet differs from, the Christian teaching of turning the other cheek.',
    tags: ['compassion', 'love', 'character'], weight: 5,
  },
  {
    ref: '50', chapterEn: 'Pupphavagga (Flowers)', chapterZh: '花品', chapterOrig: 'Pupphavagga',
    summaryEn: 'Do not dwell on others’ faults and failings; look instead at what you yourself have done or left undone.',
    summaryZh: '不要执着于他人的过失，而应审视自己做了什么、又遗漏了什么。',
    similarQuestions: ['Why do I judge others so much?', 'How do I stop criticizing people?', 'Where should I focus to grow?'],
    contextNote: 'A redirection of moral attention from others to oneself — a recurring theme in the Dhammapada.',
    tags: ['self-knowledge', 'character', 'virtue'], weight: 4,
  },
  {
    ref: '81', chapterEn: 'Paṇḍitavagga (The Wise)', chapterZh: '智者品', chapterOrig: 'Paṇḍitavagga',
    summaryEn: 'As a solid rock is unmoved by the wind, the wise are unshaken by praise and blame.',
    summaryZh: '如同坚岩不为风动，智者不为毁誉所动。',
    similarQuestions: ['How do I stop caring what people think?', 'How to stay steady under criticism?', 'How to handle praise and blame?'],
    contextNote: 'The rock-and-wind image is among the most enduring Buddhist metaphors for equanimity.',
    tags: ['wisdom', 'discipline', 'self-knowledge'], weight: 4,
  },
  {
    ref: '103', chapterEn: 'Sahassavagga (Thousands)', chapterZh: '千品', chapterOrig: 'Sahassavagga',
    summaryEn: 'Greater than conquering a thousand men in battle is the one who conquers themselves.',
    summaryZh: '战胜千军万马，不如战胜自己一人。',
    similarQuestions: ['What is the hardest thing to conquer?', 'What does real strength mean?', 'How do I master myself?'],
    contextNote: 'Reframes heroism inward: self-mastery as the supreme victory.',
    tags: ['discipline', 'courage', 'self-knowledge'], weight: 5,
  },
  {
    ref: '121', chapterEn: 'Pāpavagga (Wickedness)', chapterZh: '恶品', chapterOrig: 'Pāpavagga',
    summaryEn: 'Do not make light of small wrongs, thinking they won’t matter; drop by drop the pot is filled.',
    summaryZh: '莫轻小恶，以为无碍；点滴累积，恶器自满。',
    similarQuestions: ['Do small bad habits matter?', 'How do small choices add up?', 'Why avoid minor wrongs?'],
    contextNote: 'Paired with verse 122 on small goods; together they teach that character is built incrementally.',
    tags: ['character', 'discipline', 'practice'], weight: 4,
  },
  {
    ref: '122', chapterEn: 'Pāpavagga (Wickedness)', chapterZh: '恶品', chapterOrig: 'Pāpavagga',
    summaryEn: 'Do not make light of small goods, thinking they won’t matter; drop by drop the pot is filled.',
    summaryZh: '莫轻小善，以为无益；点滴累积，善器自满。',
    similarQuestions: ['Do small good deeds matter?', 'Is it worth doing tiny good things?', 'How does goodness accumulate?'],
    contextNote: 'The mirror of verse 121: goodness, like harm, is the sum of small repeated acts.',
    tags: ['goodness', 'practice', 'perseverance'], weight: 4,
  },
  {
    ref: '183', chapterEn: 'Buddhavagga (The Buddha)', chapterZh: '佛陀品', chapterOrig: 'Buddhavagga',
    summaryEn: 'Do no evil, cultivate good, purify your own mind — this is the teaching of all the Buddhas.',
    summaryZh: '诸恶莫作，众善奉行，自净其意——是诸佛教。',
    similarQuestions: ['What is the essence of Buddhism?', 'How should I live well?', 'What is the simplest moral rule?'],
    contextNote: 'Traditionally regarded as a one-verse summary of the entire Buddhist path.',
    tags: ['goodness', 'virtue', 'practice'], weight: 5,
  },
  {
    ref: '197', chapterEn: 'Sukhavagga (Happiness)', chapterZh: '乐品', chapterOrig: 'Sukhavagga',
    summaryEn: 'Happily we live, free of hate among the hateful; among hostile people we dwell without hate.',
    summaryZh: '我们快乐地生活，于怨恨者中无怨；于敌意者中，安住而无憎。',
    similarQuestions: ['How can I be happy among hostile people?', 'How to keep peace in conflict?', 'Can I be unaffected by others’ anger?'],
    contextNote: 'Opens the Happiness chapter with the Buddhist ideal of equanimity amid hostility.',
    tags: ['happiness', 'compassion', 'solitude'], weight: 4,
  },
  {
    ref: '204', chapterEn: 'Sukhavagga (Happiness)', chapterZh: '乐品', chapterOrig: 'Sukhavagga',
    summaryEn: 'Health is the greatest gain, contentment the greatest wealth, trust the best kin, and peace the highest happiness.',
    summaryZh: '健康是最大的利益，知足是最大的财富，信任是最好的亲人，寂静是最高的快乐。',
    similarQuestions: ['What is true wealth?', 'What really makes a good life?', 'What should I value most?'],
    contextNote: 'A compact reordering of priorities: well-being and contentment above material gain.',
    tags: ['happiness', 'wealth', 'desire'], weight: 5,
  },
  {
    ref: '223', chapterEn: 'Kodhavagga (Anger)', chapterZh: '忿怒品', chapterOrig: 'Kodhavagga',
    summaryEn: 'Conquer anger with kindness, evil with good, stinginess with giving, and lies with truth.',
    summaryZh: '以慈胜怒，以善胜恶，以施胜悭，以实胜妄。',
    similarQuestions: ['How do I deal with anger?', 'How to respond to someone cruel?', 'How to overcome stinginess?'],
    contextNote: 'A practical fourfold antidote — meeting each negative force with its opposite virtue.',
    tags: ['compassion', 'goodness', 'honesty'], weight: 4,
  },
  {
    ref: '252', chapterEn: 'Malavagga (Impurities)', chapterZh: '垢秽品', chapterOrig: 'Malavagga',
    summaryEn: 'Others’ faults are easy to see; our own are hard. We winnow others’ like chaff but hide our own.',
    summaryZh: '他人之过易见，自己之过难知。扬人过如簸糠，掩己过如藏弊。',
    similarQuestions: ['Why is it easy to see others’ flaws?', 'How do I become more self-aware?', 'Why do I excuse my own faults?'],
    contextNote: 'A pointed observation on self-deception and the asymmetry of moral perception.',
    tags: ['self-knowledge', 'honesty', 'wisdom'], weight: 4,
  },
  {
    ref: '276', chapterEn: 'Maggavagga (The Path)', chapterZh: '道品', chapterOrig: 'Maggavagga',
    summaryEn: 'You yourselves must do the work; the awakened ones only point the way.',
    summaryZh: '修行须靠自己；觉者仅指示道路。',
    similarQuestions: ['Can someone else save me?', 'Who is responsible for my growth?', 'Is a teacher enough?'],
    contextNote: 'A core statement of self-reliance: teachers can show the path, but each person must walk it.',
    tags: ['practice', 'self-knowledge', 'freedom'], weight: 5,
  },
  {
    ref: '277', chapterEn: 'Maggavagga (The Path)', chapterZh: '道品', chapterOrig: 'Maggavagga',
    summaryEn: 'All conditioned things are impermanent — seeing this with wisdom, one turns away from suffering.',
    summaryZh: '诸行无常——以智慧观见者，便从苦中转离。',
    similarQuestions: ['Why does everything change?', 'How to accept impermanence?', 'Why can’t I hold onto good things?'],
    contextNote: 'The first of the Three Marks of Existence (impermanence, suffering, non-self), verses 277–279.',
    tags: ['impermanence', 'wisdom', 'suffering'], weight: 5,
  },
  {
    ref: '278', chapterEn: 'Maggavagga (The Path)', chapterZh: '道品', chapterOrig: 'Maggavagga',
    summaryEn: 'All conditioned things are suffering — seeing this with wisdom, one turns away from suffering.',
    summaryZh: '诸行皆苦——以智慧观见者，便从苦中转离。',
    similarQuestions: ['Why is there so much suffering?', 'Is life inherently unsatisfying?', 'How to find peace with dissatisfaction?'],
    contextNote: 'The second of the Three Marks of Existence.',
    tags: ['suffering', 'wisdom', 'impermanence'], weight: 4,
  },
  {
    ref: '279', chapterEn: 'Maggavagga (The Path)', chapterZh: '道品', chapterOrig: 'Maggavagga',
    summaryEn: 'All things are not-self — seeing this with wisdom, one turns away from suffering.',
    summaryZh: '诸法无我——以智慧观见者，便从苦中转离。',
    similarQuestions: ['What is the self?', 'Is there a fixed “me”?', 'Why does clinging to identity cause pain?'],
    contextNote: 'The third of the Three Marks of Existence; the doctrine of non-self (anattā).',
    tags: ['self-knowledge', 'wisdom', 'soul'], weight: 5,
  },
  {
    ref: '348', chapterEn: 'Taṇhāvagga (Craving)', chapterZh: '爱欲品', chapterOrig: 'Taṇhāvagga',
    summaryEn: 'Let go of the past, the future, and the present; cross beyond to the far shore, freed from all becoming.',
    summaryZh: '放下过去、未来与现在；越渡彼岸，从一切生灭中解脱。',
    similarQuestions: ['How do I let go?', 'How to stop clinging?', 'How to be free of regret and anxiety?'],
    contextNote: 'An invitation to release attachment across all three times as the path to liberation.',
    tags: ['freedom', 'desire', 'impermanence'], weight: 4,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Curation: Quran
// ─────────────────────────────────────────────────────────────────────────────
const QURAN: Curated[] = [
  {
    ref: '2:152', chapterEn: 'Al-Baqarah (The Cow)', chapterZh: '黄牛章', chapterOrig: 'البقرة',
    summaryEn: 'Remember Me and I will remember you; be thankful and do not deny Me.',
    summaryZh: '你们记念我，我便记念你们；你们当感谢我，不要辜负我。',
    similarQuestions: ['How do I cultivate gratitude?', 'What is the value of remembrance?', 'How to feel close to God?'],
    contextNote: 'A reciprocal promise central to Islamic devotional practice (dhikr) and gratitude (shukr).',
    tags: ['faith', 'divinity', 'happiness'], weight: 4,
  },
  {
    ref: '2:153', chapterEn: 'Al-Baqarah (The Cow)', chapterZh: '黄牛章', chapterOrig: 'البقرة',
    summaryEn: 'Seek help through patience and prayer; God is with the steadfast.',
    summaryZh: '你们当借坚忍和礼拜而求祐助；真主确是与坚忍者同在的。',
    similarQuestions: ['How do I cope with hardship?', 'Where do I find strength in difficulty?', 'What is the value of patience?'],
    contextNote: 'Patience (ṣabr) paired with prayer is a recurring Quranic prescription for adversity.',
    tags: ['perseverance', 'faith', 'suffering'], weight: 5,
  },
  {
    ref: '2:156', chapterEn: 'Al-Baqarah (The Cow)', chapterZh: '黄牛章', chapterOrig: 'البقرة',
    summaryEn: 'Those who, struck by calamity, say: “To God we belong, and to Him we return.”',
    summaryZh: '当灾难降临时，他们说："我们确是真主所有的，我们必定只归依他。"',
    similarQuestions: ['How do I face loss and grief?', 'What to say in the face of death?', 'How to accept calamity?'],
    contextNote: 'The istirjāʿ — words traditionally recited by Muslims at moments of death and disaster.',
    tags: ['death', 'destiny', 'faith'], weight: 5,
  },
  {
    ref: '2:255', chapterEn: 'Al-Baqarah (The Cow)', chapterZh: '黄牛章', chapterOrig: 'البقرة',
    summaryEn: 'The Throne Verse: God, the Living, the Eternal, whose knowledge and sovereignty encompass all things.',
    summaryZh: '宝座经文：真主，永生不灭的主宰，其知识与主权遍及万物。',
    similarQuestions: ['What is the nature of God in Islam?', 'How is God described?', 'What does divine sovereignty mean?'],
    contextNote: 'Āyat al-Kursī, among the most revered verses of the Quran, describing God’s majesty and omniscience.',
    tags: ['divinity', 'cosmos', 'faith'], weight: 5,
  },
  {
    ref: '2:286', chapterEn: 'Al-Baqarah (The Cow)', chapterZh: '黄牛章', chapterOrig: 'البقرة',
    summaryEn: 'God burdens no soul beyond its capacity; each gains what it earns and bears what it earns.',
    summaryZh: '真主只依各人的能力而加以责成；各人行善有功，作恶有罪。',
    similarQuestions: ['Is my burden too heavy?', 'Can I handle what I’m going through?', 'Does God give more than we can bear?'],
    contextNote: 'A widely cited verse of consolation, affirming that hardship is always within human capacity.',
    tags: ['suffering', 'destiny', 'perseverance'], weight: 5,
  },
  {
    ref: '13:11', chapterEn: 'Ar-Raʿd (The Thunder)', chapterZh: '雷霆章', chapterOrig: 'الرعد',
    summaryEn: 'God does not change the condition of a people until they change what is in themselves.',
    summaryZh: '真主必不变更任何民众的境况，直到他们变更自己的内心。',
    similarQuestions: ['How does real change happen?', 'Can I change my life?', 'Why must change start within?'],
    contextNote: 'Frequently invoked in discussions of personal and social reform — change begins from within.',
    tags: ['choice', 'practice', 'freedom'], weight: 5,
  },
  {
    ref: '13:28', chapterEn: 'Ar-Raʿd (The Thunder)', chapterZh: '雷霆章', chapterOrig: 'الرعد',
    summaryEn: 'In the remembrance of God do hearts find rest.',
    summaryZh: '真主的记念，确能使心安宁。',
    similarQuestions: ['How do I find inner peace?', 'Why is my heart restless?', 'What calms anxiety?'],
    contextNote: 'A concise statement linking spiritual remembrance to tranquility of the heart.',
    tags: ['happiness', 'faith', 'solitude'], weight: 4,
  },
  {
    ref: '16:90', chapterEn: 'An-Naḥl (The Bee)', chapterZh: '蜜蜂章', chapterOrig: 'النحل',
    summaryEn: 'God enjoins justice, kindness, and generosity to kin, and forbids indecency, wrong, and oppression.',
    summaryZh: '真主命人公平、行善、施济亲戚，并禁止淫乱、作恶和压迫。',
    similarQuestions: ['What does God ask of us?', 'What are the core ethics of Islam?', 'How should I treat others?'],
    contextNote: 'Often called the most comprehensive ethical verse of the Quran; recited in every Friday sermon.',
    tags: ['justice', 'goodness', 'compassion'], weight: 5,
  },
  {
    ref: '39:53', chapterEn: 'Az-Zumar (The Throngs)', chapterZh: '队伍章', chapterOrig: 'الزمر',
    summaryEn: 'Despair not of God’s mercy; God forgives all sins.',
    summaryZh: '你们不要绝望于真主的慈恩；真主必赦宥一切罪过。',
    similarQuestions: ['Can I be forgiven?', 'Is it ever too late to change?', 'How to cope with guilt and shame?'],
    contextNote: 'One of the most hopeful verses in the Quran, addressed to those overwhelmed by their failings.',
    tags: ['faith', 'goodness', 'suffering'], weight: 5,
  },
  {
    ref: '49:13', chapterEn: 'Al-Ḥujurāt (The Rooms)', chapterZh: '寝室章', chapterOrig: 'الحجرات',
    summaryEn: 'Humanity is made into peoples and tribes to know one another; the noblest is the most righteous.',
    summaryZh: '我把你们造成许多民族和宗族，以便你们互相认识；你们中最尊贵的是最敬畏的。',
    similarQuestions: ['What is the basis of human equality?', 'How should we view other cultures?', 'What makes a person noble?'],
    contextNote: 'A foundational verse on human equality and diversity, transcending tribe and race.',
    tags: ['equality', 'community', 'justice'], weight: 5,
  },
  {
    ref: '94:5', chapterEn: 'Ash-Sharḥ (Relief)', chapterZh: '开拓章', chapterOrig: 'الشرح',
    summaryEn: 'For indeed, with hardship comes ease.',
    summaryZh: '与艰难相伴的，确有容易。',
    similarQuestions: ['Will things get better?', 'How do I keep hope in hard times?', 'Is there relief after difficulty?'],
    contextNote: 'Repeated emphatically across verses 5–6 for assurance during distress.',
    tags: ['perseverance', 'suffering', 'happiness'], weight: 4,
  },
  {
    ref: '94:6', chapterEn: 'Ash-Sharḥ (Relief)', chapterZh: '开拓章', chapterOrig: 'الشرح',
    summaryEn: 'Indeed, with hardship comes ease.',
    summaryZh: '与艰难相伴的，确有容易。',
    similarQuestions: ['Does relief always follow hardship?', 'How to endure suffering?', 'Where is hope in difficulty?'],
    contextNote: 'The emphatic repetition of 94:5 — hardship is never the whole story.',
    tags: ['perseverance', 'suffering', 'happiness'], weight: 4,
  },
  {
    ref: '103:2', chapterEn: 'Al-ʿAṣr (The Declining Day)', chapterZh: '时光章', chapterOrig: 'العصر',
    summaryEn: 'By time — surely mankind is in loss.',
    summaryZh: '以时光盟誓，一切人确是在亏折之中。',
    similarQuestions: ['Am I wasting my life?', 'What is the value of time?', 'What makes a life not wasted?'],
    contextNote: 'From one of the shortest and most famous surahs; al-Shāfiʿī said reflecting on it alone would suffice as guidance.',
    tags: ['meaning-of-life', 'practice', 'wisdom'], weight: 4,
  },
  {
    ref: '103:3', chapterEn: 'Al-ʿAṣr (The Declining Day)', chapterZh: '时光章', chapterOrig: 'العصر',
    summaryEn: 'Except those who believe, do good, and counsel one another to truth and to patience.',
    summaryZh: '惟信道而行善，并以真理相劝、以坚忍相勉者除外。',
    similarQuestions: ['What saves a life from waste?', 'What should I devote my life to?', 'What makes life meaningful?'],
    contextNote: 'The conclusion of Sūrat al-ʿAṣr: faith, good works, and mutual encouragement toward truth and patience.',
    tags: ['meaning-of-life', 'goodness', 'perseverance'], weight: 4,
  },
];

// Confucius — famous Analects chapters. End-anchors guard against parse misalignment;
// any verse from a book whose Wikisource page parses imperfectly is auto-dropped.
// Anchors verified against Legge's actual text (his chapter numbering is offset from
// the modern standard in several books, so some refs differ from what you'd expect).
const CONFUCIUS: Curated[] = [
  ['1.1', '不亦君子乎'], ['1.4', '傳不習乎'], ['1.16', '患不知人也'],
  ['2.1', '北辰'], ['2.4', '不踰矩'], ['2.11', '可以爲師矣'], ['2.15', '思而不學則殆'], ['2.17', '是知也'],
  ['3.3', '如樂何'],
  ['4.8', '朝聞道'], ['4.16', '小人喻於利'], ['4.17', '內自省也'],
  ['6.11', '小人儒'], ['6.18', '好之者'], ['6.20', '敬鬼神而遠之'], ['6.21', '仁者壽'],
  ['7.8', '則不復也'], ['7.21', '必有我師焉'], ['7.22', '桓魋'],
  ['8.7', '不亦遠乎'],
  ['9.25', '不可奪志'], ['9.26', '不忮不求'],
  ['12.2', '請事斯語矣'], ['12.5', '皆兄弟也'],
  ['13.23', '小人同而不和'], ['13.27', '近仁'],
  ['15.23', '勿施於人'], ['15.24', '勿施於人'],
].map(([ref, anchor]) => analectsItem(ref, anchor));

// Ref-only expansions — sourced text fetched verbatim, metadata LLM-derived.
const DHP_MORE: Curated[] = [
  21, 23, 33, 35, 42, 43, 62, 76, 80, 85, 96, 100, 110, 127, 129, 145, 153, 154,
  160, 165, 184, 201, 216, 222, 239, 251, 280, 372,
].map(dhpItem);

const QURAN_MORE: Curated[] = [
  '2:177', '2:195', '2:216', '2:256', '3:159', '4:36', '4:135', '5:8', '5:32', '6:160',
  '16:97', '17:23', '17:70', '25:63', '29:69', '31:18', '41:34', '42:43', '49:11', '49:12',
  '64:11', '65:3', '93:3', '93:5', '99:7', '99:8',
].map(quranItem);

const GOSPELS: Curated[] = [
  'Matthew 5:3', 'Matthew 5:9', 'Matthew 5:44', 'Matthew 6:21', 'Matthew 6:24', 'Matthew 6:34',
  'Matthew 7:1', 'Matthew 7:12', 'Matthew 11:28', 'Matthew 22:39', 'Mark 8:36', 'Mark 12:31',
  'Luke 6:37', 'Luke 10:27', 'Luke 12:15', 'Luke 23:34', 'John 3:16', 'John 8:32', 'John 13:34',
  'John 14:6', 'John 15:13', 'John 11:25',
].map(gospelItem);

// Laozi — Daodejing chapters (ctext original + Legge "Tâo Teh King", aligned by chapter).
const LAOZI: Curated[] = [
  1, 2, 8, 9, 11, 22, 24, 27, 33, 37, 44, 46, 48, 56, 63, 64, 66, 76, 78, 81,
].map(daodejingItem);

// Rumi — hand-curated specs (authentic ganjoor Persian + Whinfield PD English).
// Each pairing is eyeballed before import; the anchor guards the Persian.
const RUMI_SPECS: RumiSpec[] = [
  {
    canonicalRef: 'Masnavi I, Proem (Song of the Reed)',
    ganjoorUrl: '/moulavi/masnavi/daftar1/sh1', beytFrom: 1, beytTo: 18,
    whinfieldBook: 'I', whinfieldHeading: 'PROLOGUE.',
  },
];
const RUMI_BY_REF = new Map(RUMI_SPECS.map((s) => [s.canonicalRef, s]));
const RUMI: Curated[] = [
  { ref: 'Masnavi I, Proem (Song of the Reed)', chapterEn: 'Masnavi, Book I', chapterZh: '玛斯纳维·第一卷', chapterOrig: 'دفتر اول', expectContains: 'بشنو این نی' },
];

async function main() {
  mkdirSync(DATA_DIR, { recursive: true });
  // Optional CLI filter: `content:collect dhammapada quran` runs only those works.
  // No args → collect everything. (Avoids needlessly re-enriching existing data.)
  const only = new Set(process.argv.slice(2).map((s) => s.toLowerCase()));
  const want = (name: string) => only.size === 0 || only.has(name);
  console.log(`📥 OpenCouncil content collector${only.size ? ` (only: ${[...only].join(', ')})` : ''}\n`);

  if (want('dhammapada')) {
  console.log('Buddhism — Dhammapada (SuttaCentral / Bhikkhu Sujato, CC0):');
  const dhp = await buildWork({
    thinkerName: 'Buddhism · The Dhammapada',
    tradition: 'buddhism',
    fetcher: (ref) => fetchDhammapadaVerse(Number(ref)),
    curated: [...DHAMMAPADA, ...DHP_MORE],
    work: {
      titleEn: 'The Dhammapada (Selected Verses)',
      titleZh: '法句经（精选）',
      titleOrig: 'Dhammapada',
      language: 'pali',
      circaYear: -300,
      description:
        'Verse sayings of the Buddha from the Pali Canon. Pali root text (Mahāsaṅgīti edition) and English translation by Bhikkhu Sujato, both released into the public domain (CC0).',
      copyright: 'CC0',
      sourceUrl: 'https://suttacentral.net/dhp',
    },
  });
  writeFileSync(resolve(DATA_DIR, 'buddhism-dhammapada.json'), JSON.stringify(dhp.out, null, 2) + '\n');
  console.log(`  → ${dhp.verified} verified, ${dhp.skipped} skipped → data/buddhism-dhammapada.json\n`);
  }

  if (want('quran')) {
  console.log('Islam — Quran (Tanzil / Pickthall 1930, public domain):');
  const quran = await buildWork({
    thinkerName: 'Islam · The Quran',
    tradition: 'islam',
    fetcher: fetchQuranVerse,
    curated: [...QURAN, ...QURAN_MORE],
    work: {
      titleEn: 'The Quran (Selected Verses)',
      titleZh: '古兰经（精选）',
      titleOrig: 'القرآن',
      language: 'arabic',
      circaYear: 632,
      description:
        'Selected verses of the Quran. Uthmani Arabic text © Tanzil Project (tanzil.net, CC BY 3.0, reproduced verbatim) with the public-domain English translation of Marmaduke Pickthall (1930), via the Quran.com API.',
      copyright: 'Arabic CC BY 3.0 · English PD',
      sourceUrl: 'https://quran.com',
    },
  });
  writeFileSync(resolve(DATA_DIR, 'islam-quran.json'), JSON.stringify(quran.out, null, 2) + '\n');
  console.log(`  → ${quran.verified} verified, ${quran.skipped} skipped → data/islam-quran.json\n`);
  }

  if (want('gospels')) {
  console.log('Christianity — Gospels (SBLGNT Greek + World English Bible, public domain):');
  const gospels = await buildWork({
    thinkerName: 'Christianity · The Gospels',
    tradition: 'christianity',
    fetcher: fetchGospelVerse,
    curated: GOSPELS,
    work: {
      titleEn: 'The Gospels (Selected Teachings)',
      titleZh: '福音书（精选教导）',
      titleOrig: 'Τὰ Εὐαγγέλια',
      language: 'koine-greek',
      circaYear: 80,
      description:
        'Selected teachings of Jesus from the four Gospels. Koine Greek from the SBL Greek New Testament (© 2010 Society of Biblical Literature and Logos Bible Software, CC BY 4.0), reassembled word by word from the MorphGNT edition, with the public-domain World English Bible (WEB) translation.',
      copyright: 'Greek CC BY 4.0 · English PD',
      sourceUrl: 'https://sblgnt.com',
    },
  });
  writeFileSync(resolve(DATA_DIR, 'christianity-gospels.json'), JSON.stringify(gospels.out, null, 2) + '\n');
  console.log(`  → ${gospels.verified} verified, ${gospels.skipped} skipped → data/christianity-gospels.json\n`);
  }

  if (want('confucius')) {
  console.log('Confucius — Analects (Wikisource / James Legge, public domain):');
  const analects = await buildWork({
    thinkerName: 'Confucius',
    tradition: 'confucianism',
    fetcher: fetchAnalects,
    curated: CONFUCIUS,
    work: {
      titleEn: 'The Analects (Selected Chapters)',
      titleZh: '论语（精选）',
      titleOrig: '論語',
      language: 'classical-chinese',
      circaYear: -500,
      description:
        'Selected chapters of the Analects of Confucius. Classical Chinese text with the public-domain English translation of James Legge (The Chinese Classics, 1861), via Wikisource.',
      copyright: 'public-domain',
      sourceUrl: 'https://en.wikisource.org/wiki/The_Chinese_Classics/Volume_1',
    },
  });
  writeFileSync(resolve(DATA_DIR, 'confucius-analects.json'), JSON.stringify(analects.out, null, 2) + '\n');
  console.log(`  → ${analects.verified} verified, ${analects.skipped} skipped → data/confucius-analects.json\n`);
  }

  if (want('laozi')) {
  console.log('Laozi — Daodejing (ctext original + James Legge, public domain):');
  const laozi = await buildWork({
    thinkerName: 'Laozi',
    tradition: 'daoism',
    fetcher: fetchDaodejing,
    curated: LAOZI,
    work: {
      titleEn: 'Tao Te Ching (Selected Chapters)',
      titleZh: '道德经（精选）',
      titleOrig: '道德經',
      language: 'classical-chinese',
      circaYear: -400,
      description:
        'Selected chapters of the Tao Te Ching. Classical Chinese text via the Chinese Text Project (ctext.org) with the public-domain English translation of James Legge (Sacred Books of the East v39, 1891), via Wikisource.',
      copyright: 'public-domain',
      sourceUrl: 'https://ctext.org/dao-de-jing',
    },
  });
  writeFileSync(resolve(DATA_DIR, 'laozi-daodejing.json'), JSON.stringify(laozi.out, null, 2) + '\n');
  console.log(`  → ${laozi.verified} verified, ${laozi.skipped} skipped → data/laozi-daodejing.json\n`);
  }

  if (want('rumi')) {
  console.log('Rumi — Masnavi (ganjoor Persian + Whinfield 1898, public domain):');
  const rumi = await buildWork({
    thinkerName: 'Rumi',
    tradition: 'sufism',
    fetcher: (ref) => fetchRumiPassage(RUMI_BY_REF.get(ref)!),
    curated: RUMI,
    work: {
      titleEn: 'Masnavi (Selected Passages)',
      titleZh: '玛斯纳维（精选）',
      titleOrig: 'مثنوی معنوی',
      language: 'persian',
      circaYear: 1260,
      description:
        'Selected passages of Rumi’s Masnavi. Persian text from ganjoor.net with the public-domain English verse translation of E. H. Whinfield (1898), via Wikisource.',
      copyright: 'public-domain',
      sourceUrl: 'https://ganjoor.net/moulavi/masnavi',
    },
  });
  writeFileSync(resolve(DATA_DIR, 'rumi-masnavi.json'), JSON.stringify(rumi.out, null, 2) + '\n');
  console.log(`  → ${rumi.verified} verified, ${rumi.skipped} skipped → data/rumi-masnavi.json\n`);
  }

  // Excerpt-sourced works: verbatim cuts from public-domain / openly licensed
  // editions, with hand-written editorial metadata (no LLM call).
  for (const ew of EXCERPT_WORKS) {
    if (!want(ew.thinkerSlug)) continue;
    console.log(`${ew.thinkerName} — ${ew.work.titleEn}:`);
    const byRef = new Map(ew.items.map((i) => [i.canonicalRef, i]));
    const built = await buildWork({
      thinkerName: ew.thinkerName,
      tradition: ew.tradition,
      fetcher: (ref) => fetchExcerpt(byRef.get(ref)!),
      curated: ew.items.map((i) => ({
        ref: i.canonicalRef,
        chapterEn: i.chapterEn, chapterZh: i.chapterZh, chapterOrig: i.chapterOrig,
        summaryEn: i.summaryEn, summaryZh: i.summaryZh, similarQuestions: i.similarQuestions,
        contextNote: i.contextNote, tags: i.tags, weight: i.weight,
      })),
      work: ew.work,
    });
    writeFileSync(resolve(DATA_DIR, ew.dataFile), JSON.stringify(built.out, null, 2) + '\n');
    console.log(`  → ${built.verified} verified, ${built.skipped} skipped → data/${ew.dataFile}\n`);
  }

  console.log('🎉 Collection complete.');
}

main().catch((err) => {
  console.error('Collection failed:', err);
  process.exit(1);
});
