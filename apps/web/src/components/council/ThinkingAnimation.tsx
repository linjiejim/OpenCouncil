import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '../../lib/i18n';
import { THINKING_PHRASES } from '../../lib/constants';
import { Portrait } from '../common/Portrait';

/** Map thinker names to their emblem slugs */
const PORTRAIT_SLUGS: Record<string, string> = {
  'Confucius': 'confucius', '孔子': 'confucius',
  'Laozi': 'laozi', '老子': 'laozi',
  'Zhuangzi': 'zhuangzi', '庄子': 'zhuangzi',
  'The Dhammapada': 'dhammapada', '《法句经》': 'dhammapada',
  'Wang Yangming': 'wang-yangming', '王阳明': 'wang-yangming',
  'Socrates': 'plato', '苏格拉底': 'plato',
  'Aristotle': 'aristotle', '亚里士多德': 'aristotle',
  'Marcus Aurelius': 'marcus-aurelius', '马可·奥勒留': 'marcus-aurelius',
  'The Gospels': 'gospels', '福音书': 'gospels',
  'Seneca': 'seneca', '塞涅卡': 'seneca',
  'Mencius': 'mencius', '孟子': 'mencius',
  'Epictetus': 'epictetus', '爱比克泰德': 'epictetus',
  'Nietzsche': 'nietzsche', '尼采': 'nietzsche',
  'Kant': 'kant', '康德': 'kant',
  'Rumi': 'rumi', '鲁米': 'rumi',
  'The Quran': 'quran', '《古兰经》': 'quran',
};

const SLUG_TO_NAMES: Record<string, { en: string; zh: string }> = {
  'confucius': { en: 'Confucius', zh: '孔子' },
  'laozi': { en: 'Laozi', zh: '老子' },
  'zhuangzi': { en: 'Zhuangzi', zh: '庄子' },
  'dhammapada': { en: 'The Dhammapada', zh: '《法句经》' },
  'wang-yangming': { en: 'Wang Yangming', zh: '王阳明' },
  'plato': { en: 'Socrates', zh: '苏格拉底' },
  'aristotle': { en: 'Aristotle', zh: '亚里士多德' },
  'marcus-aurelius': { en: 'Marcus Aurelius', zh: '马可·奥勒留' },
  'gospels': { en: 'The Gospels', zh: '福音书' },
  'seneca': { en: 'Seneca', zh: '塞涅卡' },
  'mencius': { en: 'Mencius', zh: '孟子' },
  'epictetus': { en: 'Epictetus', zh: '爱比克泰德' },
  'nietzsche': { en: 'Nietzsche', zh: '尼采' },
  'kant': { en: 'Kant', zh: '康德' },
  'rumi': { en: 'Rumi', zh: '鲁米' },
  'quran': { en: 'The Quran', zh: '《古兰经》' },
};

interface ThinkingAnimationProps {
  /** If set, only cycle through these thinker slugs (deep dive / @ mentions) */
  thinkerSlugs?: string[];
}

export function ThinkingAnimation({ thinkerSlugs }: ThinkingAnimationProps) {
  const { lang, t } = useI18n();
  const allPhrases = THINKING_PHRASES[lang];

  const phrases = useMemo(() => {
    if (!thinkerSlugs || thinkerSlugs.length === 0) return allPhrases;
    const filtered = thinkerSlugs
      .map((slug) => {
        const names = SLUG_TO_NAMES[slug];
        if (!names) return null;
        const thinkerName = lang === 'zh' ? names.zh : names.en;
        const existing = allPhrases.find((p) => p.thinker === thinkerName);
        if (existing) return existing;
        return { thinker: thinkerName, phrase: lang === 'zh' ? '正在沉思…' : 'is pondering…' };
      })
      .filter(Boolean) as typeof allPhrases;
    return filtered.length > 0 ? filtered : allPhrases;
  }, [thinkerSlugs, allPhrases, lang]);

  // Shuffle once per mount so each question shows the thinkers in a different
  // order — repeated questions surface different faces flashing by.
  const ordered = useMemo(() => {
    const a = [...phrases];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, [phrases]);

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => { setIndex(0); setFade(true); }, [ordered]);

  useEffect(() => {
    if (ordered.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIndex((prev) => (prev + 1) % ordered.length); setFade(true); }, 300);
    }, 3800);
    return () => clearInterval(interval);
  }, [ordered.length]);

  const current = ordered[index];
  if (!current) return null;
  const slug = PORTRAIT_SLUGS[current.thinker] ?? 'confucius';

  return (
    <div className="chamber rounded-3xl px-6 py-12 sm:py-16 text-center animate-fade-in-scale">
      <p className="eyebrow text-[var(--color-candle)] mb-7">{t('council.deliberating')}</p>

      <div className={`transition-all duration-300 ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
        <div className="flex justify-center mb-5">
          <Portrait
            slug={slug}
            name={current.thinker}
            size={84}
            ring
            ringWidth={2}
            breathing
          />
        </div>
        <p className="font-serif text-xl sm:text-2xl">
          <span className="text-[var(--color-candle)] font-semibold">{current.thinker}</span>{' '}
          <span className="text-[var(--color-chamber-ink-soft)]">{current.phrase}</span>
        </p>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-candle)]"
            style={{ animation: `flicker 1.5s ease-in-out ${i * 0.3}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
