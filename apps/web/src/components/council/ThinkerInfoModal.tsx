import { useEffect, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { api } from '../../lib/api';
import { X, Loader2, BookOpen } from 'lucide-react';
import { TRADITION_LABELS } from '../../lib/constants';
import { Portrait } from '../common/Portrait';
import { Link } from 'react-router-dom';

interface Props {
  slug: string;
  onClose: () => void;
}

export function ThinkerInfoModal({ slug, onClose }: Props) {
  const { lang } = useI18n();
  const [thinker, setThinker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.getThinker(slug)
      .then((d) => { setThinker(d); setLoading(false); })
      .catch(() => { setLoading(false); });
  }, [slug]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const tradition = TRADITION_LABELS[thinker?.tradition ?? ''];
  const name = lang === 'zh' ? thinker?.name_zh ?? thinker?.nameZh : thinker?.name_en ?? thinker?.nameEn;
  const bio = lang === 'zh' ? thinker?.bio_zh ?? thinker?.bioZh : thinker?.bio_en ?? thinker?.bioEn;
  const ideas = lang === 'zh' ? thinker?.core_ideas_zh ?? thinker?.coreIdeasZh : thinker?.core_ideas_en ?? thinker?.coreIdeasEn;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-black/5 rounded-full z-10">
          <X size={18} className="text-[var(--color-ink-light)]" />
        </button>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[var(--color-gold)]" size={28} />
          </div>
        ) : thinker ? (
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Portrait slug={slug} name={name} tradition={thinker.tradition} size={64} />
              <div>
                <h2 className="text-xl font-serif font-semibold text-[var(--color-ink)]">{name}</h2>
                {thinker.name_orig && thinker.name_orig !== name && (
                  <p className="text-sm text-[var(--color-ink-light)]">{thinker.name_orig}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs"
                    style={{ backgroundColor: (tradition?.color ?? '#666') + '15', color: tradition?.color ?? '#666' }}
                  >
                    {lang === 'zh' ? tradition?.zh : tradition?.en}
                  </span>
                  <span className="text-xs text-[var(--color-ink-light)]">{thinker.era}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-[var(--color-ink)] leading-relaxed mb-4">{bio}</p>

            {ideas && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-[var(--color-ink-light)] uppercase tracking-wide mb-2">
                  {lang === 'zh' ? '核心思想' : 'Core Ideas'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ideas.split(/[,，、]/).map((idea: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-xs">
                      {idea.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {thinker.works && thinker.works.length > 0 && (
              <div className="border-t border-[var(--color-parchment-dark)] pt-3">
                <p className="text-xs font-semibold text-[var(--color-ink-light)] uppercase tracking-wide mb-2 flex items-center gap-1">
                  <BookOpen size={12} /> {lang === 'zh' ? '著作' : 'Works'}
                </p>
                {thinker.works.map((w: any) => (
                  <Link
                    key={w.id}
                    to={`/work/${w.id}`}
                    onClick={onClose}
                    className="block text-sm text-[var(--color-gold)] hover:underline mb-1"
                  >
                    {lang === 'zh' ? w.title_zh ?? w.titleZh : w.title_en ?? w.titleEn}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
