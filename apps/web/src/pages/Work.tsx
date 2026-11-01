import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { api } from '../lib/api';
import { ArrowLeft, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export function Work() {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useI18n();
  const [work, setWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
  const [passages, setPassages] = useState<Record<number, any[]>>({});
  const [loadingChapter, setLoadingChapter] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getWork(Number(id)).then((data) => { setWork(data); setLoading(false); });
  }, [id]);

  const toggleChapter = async (chapterId: number) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
      return;
    }
    setExpandedChapter(chapterId);
    if (!passages[chapterId]) {
      setLoadingChapter(chapterId);
      const data = await api.getPassagesByChapter(chapterId);
      setPassages((prev) => ({ ...prev, [chapterId]: data }));
      setLoadingChapter(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[var(--color-gold)]" size={32} /></div>;
  }
  if (!work) return <div className="text-center py-16 text-[var(--color-ink-light)]">Work not found</div>;

  const title = lang === 'zh' ? work.title_zh ?? work.titleZh : work.title_en ?? work.titleEn;
  const thinkerName = lang === 'zh' ? work.thinker?.name_zh ?? work.thinker?.nameZh : work.thinker?.name_en ?? work.thinker?.nameEn;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to={`/thinker/${work.thinker?.slug}`}
        className="text-sm text-[var(--color-ink-light)] hover:text-[var(--color-gold)] mb-6 inline-flex items-center gap-1"
      >
        <ArrowLeft size={14} /> {thinkerName}
      </Link>

      <h1 className="text-3xl font-serif font-semibold text-[var(--color-ink)] mb-2">{title}</h1>
      {work.title_orig && <p className="text-[var(--color-ink-light)] font-serif mb-4">{work.title_orig}</p>}
      {work.description && <p className="text-[var(--color-ink-light)] mb-8">{work.description}</p>}

      {/* Chapters */}
      <div className="space-y-2">
        {work.chapters?.map((ch: any) => {
          const chTitle = lang === 'zh' ? ch.title_zh ?? ch.titleZh ?? ch.title_en ?? ch.titleEn : ch.title_en ?? ch.titleEn;
          const isExpanded = expandedChapter === ch.id;
          const chPassages = passages[ch.id] ?? [];

          return (
            <div key={ch.id} className="bg-white rounded-xl border border-[var(--color-parchment-dark)] overflow-hidden">
              <button
                onClick={() => toggleChapter(ch.id)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-[var(--color-parchment)]/30 transition-colors"
              >
                <span className="font-medium text-[var(--color-ink)] text-left">{chTitle}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[var(--color-ink-light)]">
                    {ch.passage_count ?? ch.passageCount} {lang === 'zh' ? '段' : 'passages'}
                  </span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-[var(--color-parchment-dark)]/50">
                  {loadingChapter === ch.id ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[var(--color-gold)]" size={24} /></div>
                  ) : (
                    <div className="divide-y divide-[var(--color-parchment-dark)]/30">
                      {chPassages.map((p: any) => (
                        <div key={p.id} className="px-5 py-4 hover:bg-[var(--color-parchment)]/20">
                          <p className="passage-original mb-2">{p.original_text ?? p.originalText}</p>
                          <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">{p.english_text ?? p.englishText}</p>
                          {(p.summary_en ?? p.summaryEn) && (
                            <p className="text-xs text-[var(--color-ink-light)]/60 mt-2 italic">
                              💡 {lang === 'zh' ? p.summary_zh ?? p.summaryZh : p.summary_en ?? p.summaryEn}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
