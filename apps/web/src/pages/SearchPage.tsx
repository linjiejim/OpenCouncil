import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { api } from '../lib/api';
import { Search as SearchIcon, Loader2, Languages } from 'lucide-react';

const TRADITION_LABELS: Record<string, { en: string; zh: string; color: string }> = {
  confucianism: { en: 'Confucianism', zh: '儒家', color: '#b8860b' },
  daoism: { en: 'Daoism', zh: '道家', color: '#6b8e6b' },
  buddhism: { en: 'Buddhism', zh: '佛教', color: '#daa520' },
  christianity: { en: 'Christianity', zh: '基督教', color: '#4682b4' },
  'ancient-greek': { en: 'Ancient Greek', zh: '古希腊', color: '#8b4513' },
  stoicism: { en: 'Stoicism', zh: '斯多葛', color: '#708090' },
};

export function SearchPage() {
  const { lang, t } = useI18n();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [translationInfo, setTranslationInfo] = useState<{ from: string; to: string } | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setTranslationInfo(null);
    try {
      const data = await api.search(query);
      setResults(data.results);
      setTotal(data.total);
      if (data.translatedFrom && data.translatedTo) {
        setTranslationInfo({ from: data.translatedFrom, to: data.translatedTo });
      }
    } finally {
      setLoading(false);
    }
  };

  // Group results by tradition
  const grouped = results.reduce((acc, r) => {
    const tradition = r.tradition ?? 'other';
    if (!acc[tradition]) acc[tradition] = [];
    acc[tradition].push(r);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif font-semibold text-[var(--color-ink)] mb-6">{t('nav.search')}</h1>

      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={t('search.placeholder')}
          className="w-full px-5 py-3 pr-12 rounded-xl border border-[var(--color-parchment-dark)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)]"
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-ink-light)] hover:text-[var(--color-gold)]"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <SearchIcon size={20} />}
        </button>
      </div>

      {/* Translation indicator */}
      {translationInfo && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
          <Languages size={16} className="text-blue-500" />
          <span className="text-sm text-blue-700">
            {lang === 'zh'
              ? `已将 "${translationInfo.from}" 翻译为 "${translationInfo.to}" 进行搜索`
              : `Translated "${translationInfo.from}" to "${translationInfo.to}" for search`}
          </span>
        </div>
      )}

      {searched && !loading && (
        <p className="text-sm text-[var(--color-ink-light)] mb-4">
          {total} {t('search.results')}
        </p>
      )}

      {results.length === 0 && searched && !loading && (
        <p className="text-center py-12 text-[var(--color-ink-light)]">{t('search.noResults')}</p>
      )}

      {/* Results grouped by tradition */}
      {Object.entries(grouped).map(([tradition, items]) => {
        const label = TRADITION_LABELS[tradition];
        return (
          <div key={tradition} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: label?.color ?? '#666' }}
              />
              <h2 className="font-semibold text-[var(--color-ink)]">
                {lang === 'zh' ? label?.zh ?? tradition : label?.en ?? tradition}
              </h2>
              <span className="text-xs text-[var(--color-ink-light)]">({(items as any[]).length})</span>
            </div>

            <div className="space-y-3">
              {(items as any[]).map((r: any) => {
                const thinkerName = lang === 'zh' ? r.thinker_name_zh : r.thinker_name_en;
                const workTitle = lang === 'zh' ? r.work_title_zh : r.work_title_en;
                const chapterTitle = lang === 'zh' ? r.chapter_title_zh : r.chapter_title_en;
                const summary = lang === 'zh' ? r.summary_zh : r.summary_en;

                return (
                  <div key={r.id} className="bg-white rounded-xl border border-[var(--color-parchment-dark)] p-5 hover:border-[var(--color-gold)]/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <span className="font-medium" style={{ color: label?.color ?? '#666' }}>
                        {thinkerName}
                      </span>
                      <span className="text-[var(--color-ink-light)]">·</span>
                      <Link
                        to={`/work/${r.work_id}`}
                        className="text-[var(--color-ink-light)] hover:text-[var(--color-gold)] transition-colors"
                      >
                        {workTitle}
                      </Link>
                      <span className="text-[var(--color-ink-light)]">·</span>
                      <span className="text-[var(--color-ink-light)]">{chapterTitle}</span>
                    </div>

                    {/* Original text */}
                    <p className="font-serif text-[var(--color-ink)] leading-relaxed mb-2 italic">
                      {r.original_text?.substring(0, 120)}{r.original_text?.length > 120 ? '...' : ''}
                    </p>

                    {/* English text with highlights */}
                    <div
                      className="text-[var(--color-ink)] text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: r.headline }}
                    />

                    {/* Summary */}
                    {summary && (
                      <p className="text-xs text-[var(--color-ink-light)] mt-2">
                        💡 {summary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
