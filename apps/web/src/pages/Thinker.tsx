import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { api } from '../lib/api';
import { Portrait } from '../components/common/Portrait';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';

export function Thinker() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, t } = useI18n();
  const [thinker, setThinker] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.getThinker(slug).then((data) => { setThinker(data); setLoading(false); });
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[var(--color-gold)]" size={32} /></div>;
  }

  if (!thinker) {
    return <div className="text-center py-16 text-[var(--color-ink-light)]">Thinker not found</div>;
  }

  const name = lang === 'zh' ? thinker.name_zh ?? thinker.nameZh : thinker.name_en ?? thinker.nameEn;
  const bio = lang === 'zh' ? thinker.bio_zh ?? thinker.bioZh : thinker.bio_en ?? thinker.bioEn;
  const coreIdeas = lang === 'zh' ? thinker.core_ideas_zh ?? thinker.coreIdeasZh : thinker.core_ideas_en ?? thinker.coreIdeasEn;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/thinkers" className="text-sm text-[var(--color-ink-light)] hover:text-[var(--color-gold)] mb-6 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> {t('common.back')}
      </Link>

      {/* Profile header */}
      <div className="bg-white rounded-xl border border-[var(--color-parchment-dark)] p-8 mb-8">
        <div className="flex items-start gap-6">
          <Portrait slug={slug} name={name} tradition={thinker.tradition} size={84} />
          <div>
            <h1 className="text-3xl font-serif font-semibold text-[var(--color-ink)]">{name}</h1>
            {thinker.name_orig && thinker.name_orig !== name && (
              <p className="text-[var(--color-ink-light)] mt-1">{thinker.name_orig}</p>
            )}
            <p className="text-[var(--color-ink-light)] mt-1">{thinker.era} · {thinker.region}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-[var(--color-ink-light)] uppercase tracking-wide mb-2">
            {t('thinker.bio')}
          </h2>
          <p className="text-[var(--color-ink)] leading-relaxed">{bio}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-sm font-semibold text-[var(--color-ink-light)] uppercase tracking-wide mb-2">
            {t('thinker.coreIdeas')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {coreIdeas?.split(/[,，、]/).map((idea: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] text-sm">
                {idea.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Works */}
      <h2 className="text-xl font-serif font-semibold text-[var(--color-ink)] mb-4 flex items-center gap-2">
        <BookOpen size={20} /> {t('thinker.works')}
      </h2>
      <div className="space-y-3">
        {thinker.works?.map((work: any) => (
          <Link
            key={work.id}
            to={`/work/${work.id}`}
            className="block bg-white rounded-xl border border-[var(--color-parchment-dark)] p-5 hover:border-[var(--color-gold)] hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-[var(--color-ink)]">
              {lang === 'zh' ? work.title_zh ?? work.titleZh : work.title_en ?? work.titleEn}
            </h3>
            {work.title_orig && (
              <p className="text-sm text-[var(--color-ink-light)]">{work.title_orig}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-[var(--color-ink-light)]">
              {work.circa_year && <span>c. {Math.abs(work.circa_year)} {work.circa_year < 0 ? 'BCE' : 'CE'}</span>}
              <span>{work.chapter_count ?? work.chapterCount} chapters</span>
            </div>
          </Link>
        ))}
        {(!thinker.works || thinker.works.length === 0) && (
          <p className="text-[var(--color-ink-light)] text-center py-8">No works imported yet.</p>
        )}
      </div>
    </div>
  );
}
