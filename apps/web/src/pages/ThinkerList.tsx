import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { api } from '../lib/api';
import { Portrait } from '../components/common/Portrait';
import { Loader2, MapPin } from 'lucide-react';

const TRADITION_COLORS: Record<string, string> = {
  confucianism: '#b8860b',
  daoism: '#6b8e6b',
  buddhism: '#daa520',
  christianity: '#4682b4',
  islam: '#2e8b57',
  'ancient-greek': '#8b4513',
  stoicism: '#708090',
  existentialism: '#696969',
  enlightenment: '#9370db',
  sufism: '#9370db',
};

const TRADITION_LABELS: Record<string, { en: string; zh: string }> = {
  confucianism: { en: 'Confucianism', zh: '儒家' },
  daoism: { en: 'Daoism', zh: '道家' },
  buddhism: { en: 'Buddhism', zh: '佛教' },
  christianity: { en: 'Christianity', zh: '基督教' },
  islam: { en: 'Islam', zh: '伊斯兰' },
  'ancient-greek': { en: 'Ancient Greek', zh: '古希腊' },
  stoicism: { en: 'Stoicism', zh: '斯多葛' },
  existentialism: { en: 'Existentialism', zh: '存在主义' },
  enlightenment: { en: 'Enlightenment', zh: '启蒙' },
  sufism: { en: 'Sufism', zh: '苏菲' },
};

/** Historical era markers for the timeline */
const ERA_MARKERS = [
  { year: -600, en: 'Axial Age Begins', zh: '轴心时代开始' },
  { year: -500, en: 'Classical Greece', zh: '古典希腊' },
  { year: -400, en: 'Warring States', zh: '战国时代' },
  { year: -300, en: 'Hellenistic Era', zh: '希腊化时代' },
  { year: 0, en: 'Common Era', zh: '公元纪年' },
  { year: 100, en: 'Pax Romana', zh: '罗马和平' },
  { year: 500, en: 'Medieval Period', zh: '中世纪' },
  { year: 630, en: 'Rise of Islam', zh: '伊斯兰兴起' },
  { year: 1200, en: 'Mongol Era', zh: '蒙古时代' },
  { year: 1400, en: 'Renaissance', zh: '文艺复兴' },
  { year: 1500, en: 'Ming Dynasty', zh: '明朝' },
  { year: 1700, en: 'Enlightenment', zh: '启蒙时代' },
  { year: 1850, en: 'Modern Era', zh: '现代' },
];

function formatYear(year: number, lang: string): string {
  if (year < 0) return lang === 'zh' ? `公元前 ${Math.abs(year)} 年` : `${Math.abs(year)} BCE`;
  return lang === 'zh' ? `公元 ${year} 年` : `${year} CE`;
}

export function ThinkerList() {
  const { lang, t } = useI18n();
  const [thinkers, setThinkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.getThinkers().then((data) => { setThinkers(data); setLoading(false); });
  }, []);

  // Sort thinkers by born year, get unique traditions
  const sortedThinkers = useMemo(() => {
    let filtered = thinkers;
    if (filter) filtered = thinkers.filter((t) => t.tradition === filter);
    return [...filtered].sort((a, b) => {
      const aYear = a.born_year ?? a.bornYear ?? 0;
      const bYear = b.born_year ?? b.bornYear ?? 0;
      return aYear - bYear;
    });
  }, [thinkers, filter]);

  const traditions = useMemo(() => {
    const set = new Set(thinkers.map((t) => t.tradition));
    return [...set];
  }, [thinkers]);

  // Relevant era markers based on sorted thinkers range
  const relevantMarkers = useMemo(() => {
    if (sortedThinkers.length === 0) return ERA_MARKERS;
    const years = sortedThinkers.flatMap((t) => {
      const born = t.born_year ?? t.bornYear ?? 0;
      const died = t.died_year ?? t.diedYear ?? born + 80;
      return [born, died];
    });
    const min = Math.min(...years) - 50;
    const max = Math.max(...years) + 50;
    return ERA_MARKERS.filter((m) => m.year >= min && m.year <= max);
  }, [sortedThinkers]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="animate-spin text-[var(--color-gold)]" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="text-3xl font-serif font-semibold text-[var(--color-ink)] mb-2">{t('nav.thinkers')}</h1>
        <p className="text-[var(--color-ink-light)]">
          {lang === 'zh' ? '横跨两千年的人类智慧长河' : 'Two millennia of humanity\'s greatest minds'}
        </p>
      </div>

      {/* Tradition filter pills */}
      <div className="flex flex-wrap gap-2 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <button
          onClick={() => setFilter('')}
          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
            !filter ? 'bg-[var(--color-ink)] text-white shadow-sm' : 'bg-white border border-[var(--color-parchment-dark)] text-[var(--color-ink-light)] hover:border-[var(--color-gold)]'
          }`}
        >
          {lang === 'zh' ? '全部' : 'All'}
        </button>
        {traditions.map((tradition) => {
          const label = TRADITION_LABELS[tradition];
          return (
            <button
              key={tradition}
              onClick={() => setFilter(filter === tradition ? '' : tradition)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                filter === tradition
                  ? 'text-white shadow-sm'
                  : 'bg-white border border-[var(--color-parchment-dark)] text-[var(--color-ink-light)] hover:border-[var(--color-gold)]'
              }`}
              style={filter === tradition ? { backgroundColor: TRADITION_COLORS[tradition] ?? '#666' } : {}}
            >
              {lang === 'zh' ? label?.zh : label?.en ?? tradition}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="timeline-wrapper">

        {/* Thinker timeline entries */}
        <div className="relative space-y-0">
          {/* Render era markers and thinker cards in chronological order */}
          {(() => {
            type TimelineItem =
              | { type: 'era'; year: number; en: string; zh: string }
              | { type: 'thinker'; data: any; index: number };

            const items: TimelineItem[] = [];

            // Merge era markers and thinkers by year
            let eraIdx = 0;
            sortedThinkers.forEach((th, i) => {
              const bornYear = th.born_year ?? th.bornYear ?? 0;
              // Insert era markers that come before this thinker
              while (eraIdx < relevantMarkers.length && relevantMarkers[eraIdx].year <= bornYear) {
                items.push({ type: 'era', ...relevantMarkers[eraIdx] });
                eraIdx++;
              }
              items.push({ type: 'thinker', data: th, index: i });
            });
            // Remaining era markers
            while (eraIdx < relevantMarkers.length) {
              items.push({ type: 'era', ...relevantMarkers[eraIdx] });
              eraIdx++;
            }

            return items.map((item, idx) => {
              if (item.type === 'era') {
                return (
                  <div key={`era-${item.year}`} className="relative py-4 sm:py-6">
                    <div className="flex justify-center">
                      <div className="bg-[var(--color-parchment)] border border-[var(--color-parchment-dark)] px-4 py-1.5 rounded-full text-xs font-medium text-[var(--color-ink-light)] z-10 relative">
                        <span className="text-[var(--color-gold)] mr-1.5">{formatYear(item.year, lang)}</span>
                        {lang === 'zh' ? item.zh : item.en}
                      </div>
                    </div>
                  </div>
                );
              }

              const th = item.data;
              const isLeft = item.index % 2 === 0;
              const tradition = th.tradition;
              const tradColor = TRADITION_COLORS[tradition] ?? '#666';
              const tradLabel = TRADITION_LABELS[tradition];
              const name = lang === 'zh' ? th.name_zh || th.nameZh : th.name_en || th.nameEn;
              const bio = lang === 'zh' ? th.core_ideas_zh || th.coreIdeasZh : th.core_ideas_en || th.coreIdeasEn;
              const bornYear = th.born_year ?? th.bornYear ?? 0;
              const diedYear = th.died_year ?? th.diedYear ?? 0;

              return (
                <div
                  key={th.slug}
                  className="relative py-3 sm:py-4 animate-fade-in-up"
                  style={{ animationDelay: `${item.index * 0.08}s` }}
                >
                  {/* Desktop layout: alternate left/right */}
                  <div className={`hidden md:flex items-start gap-6 ${isLeft ? 'flex-row-reverse' : ''}`}>
                    {/* Card side */}
                    <div className={`w-[calc(50%-2rem)] ${isLeft ? 'text-right' : ''}`}>
                      <Link
                        to={`/thinker/${th.slug}`}
                        className="block bg-white rounded-xl border border-[var(--color-parchment-dark)] p-5 hover:border-[var(--color-gold)] hover:shadow-md transition-all group"
                      >
                        <div className={`flex items-start gap-4 ${isLeft ? 'flex-row-reverse' : ''}`}>
                          <Portrait slug={th.slug} name={name} tradition={tradition} size={56} className="transition-transform group-hover:scale-105" />
                          <div className={`min-w-0 flex-1 ${isLeft ? 'text-right' : ''}`}>
                            <h3 className="font-semibold text-lg text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
                              {name}
                            </h3>
                            <div className={`flex items-center gap-2 mt-0.5 text-sm text-[var(--color-ink-light)] ${isLeft ? 'justify-end' : ''}`}>
                              <span
                                className="px-2 py-0.5 rounded-full text-[11px]"
                                style={{ backgroundColor: tradColor + '15', color: tradColor }}
                              >
                                {lang === 'zh' ? tradLabel?.zh : tradLabel?.en ?? tradition}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <MapPin size={11} />{th.region}
                              </span>
                            </div>
                            <p className="text-sm text-[var(--color-ink-light)] mt-2 line-clamp-2">{bio}</p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Center dot on timeline */}
                    <div className="relative flex flex-col items-center z-10 shrink-0" style={{ width: '2rem' }}>
                      <div
                        className="w-4 h-4 rounded-full border-2 bg-[var(--color-parchment)] mt-5 transition-transform hover:scale-125"
                        style={{ borderColor: tradColor }}
                      />
                    </div>

                    {/* Year label side */}
                    <div className={`w-[calc(50%-2rem)] flex ${isLeft ? '' : 'justify-end'}`}>
                      <div className="pt-4">
                        <p className="text-sm font-medium text-[var(--color-ink)]">
                          {formatYear(bornYear, lang)}
                        </p>
                        {diedYear !== 0 && (
                          <p className="text-xs text-[var(--color-ink-light)]">
                            — {formatYear(diedYear, lang)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile layout: always left-aligned */}
                  <div className="flex md:hidden items-start gap-3 ml-6">
                    {/* Dot */}
                    <div className="relative flex flex-col items-center z-10 shrink-0" style={{ width: '1.5rem' }}>
                      <div
                        className="w-3 h-3 rounded-full border-2 bg-[var(--color-parchment)] mt-5"
                        style={{ borderColor: tradColor }}
                      />
                    </div>

                    {/* Card */}
                    <Link
                      to={`/thinker/${th.slug}`}
                      className="flex-1 bg-white rounded-xl border border-[var(--color-parchment-dark)] p-4 hover:border-[var(--color-gold)] transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <Portrait slug={th.slug} name={name} tradition={tradition} size={44} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
                            {name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-light)] mt-0.5">
                            <span className="text-[var(--color-gold)]">{th.era}</span>
                            <span>·</span>
                            <span>{th.region}</span>
                          </div>
                          <p className="text-xs text-[var(--color-ink-light)] mt-1.5 line-clamp-2">{bio}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            });
          })()}
        </div>

        {/* Bottom of timeline */}
        <div className="text-center py-8 relative z-10">
          <p className="text-sm text-[var(--color-ink-light)] italic font-serif">
            {lang === 'zh' ? '更多思想家，即将加入...' : 'More thinkers coming soon...'}
          </p>
        </div>
      </div>
    </div>
  );
}
