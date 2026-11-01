import { useI18n } from '../../lib/i18n';
import { TRADITION_LABELS } from '../../lib/constants';
import { Portrait } from '../common/Portrait';
import { isScripture } from '@opencouncil/types';
import { ScrollText, ExternalLink, CornerDownRight } from 'lucide-react';

interface Citation {
  passageId: number;
  quoteOriginal: string;
  quoteEnglish: string;
  workTitle: string;
  chapterTitle: string;
}

export interface Perspective {
  thinkerSlug?: string;
  thinkerName?: string;
  thinkerNameZh?: string;
  tradition?: string;
  era?: string;
  portraitUrl?: string | null;
  response: string;
  citations?: Citation[];
  isInference?: boolean;
  workId?: number | null;
}

interface Props {
  perspective: Perspective;
  index?: number;
  onThinkerClick?: (slug: string) => void;
  onCitationClick?: (passageId: number) => void;
  onDeepDive?: (perspective: Perspective) => void;
}

/**
 * One thinker taking the floor. The original text is elevated to a hero
 * pull-quote (the soul of the product); the plain-language reading follows;
 * sources are presented as confident provenance, not a disclaimer.
 */
export function SpeakerBlock({ perspective, index = 0, onThinkerClick, onCitationClick, onDeepDive }: Props) {
  const { lang } = useI18n();
  const tradition = TRADITION_LABELS[perspective.tradition ?? ''] ?? { en: perspective.tradition, zh: perspective.tradition, color: '#a87b35' };
  const name = lang === 'zh' ? perspective.thinkerNameZh || perspective.thinkerName : perspective.thinkerName;
  const slug = perspective.thinkerSlug ?? '';
  const color = tradition.color;

  const hero = perspective.citations?.[0];
  const heroQuote = hero?.quoteOriginal?.trim();
  const heroEnglish = hero?.quoteEnglish?.trim();
  const showEnglish = heroEnglish && heroEnglish !== heroQuote;

  return (
    <article
      className="speaker-reveal relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-parchment-dark)] shadow-[0_1px_3px_rgba(42,28,18,0.04)] overflow-hidden"
      style={{ animationDelay: `${index * 0.45}s` }}
    >
      {/* tradition accent */}
      <div className="h-[3px] w-full" style={{ background: color, opacity: 0.85 }} />

      <div className="p-5 sm:p-7">
        {/* Speaker header */}
        <header className="flex items-center gap-3.5 mb-4">
          <button onClick={() => slug && onThinkerClick?.(slug)} className="shrink-0" title={name ?? ''}>
            <Portrait slug={slug} name={name} tradition={perspective.tradition} size={52} ringWidth={2} />
          </button>
          <div className="min-w-0 flex-1">
            <button
              onClick={() => slug && onThinkerClick?.(slug)}
              className="font-serif font-semibold text-lg text-[var(--color-ink)] hover:text-[var(--color-gold)] transition-colors text-left truncate block leading-tight"
            >
              {name}
            </button>
            <div className="flex items-center gap-2 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: color + '1f', color }}>
                {lang === 'zh' ? tradition.zh : tradition.en}
              </span>
              <span className="text-[var(--color-ink-faint)] truncate">{perspective.era}</span>
            </div>
          </div>
          {onDeepDive && !isScripture(slug) && (
            <button
              onClick={() => onDeepDive(perspective)}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[var(--color-ink-light)] border border-[var(--color-parchment-dark)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
            >
              <CornerDownRight size={13} />
              <span className="hidden sm:inline">{lang === 'zh' ? '追问' : 'Press'}</span>
            </button>
          )}
        </header>

        {/* Hero original-text pull-quote */}
        {heroQuote && (
          <blockquote className="relative my-5 pl-5 border-l-[3px]" style={{ borderColor: color }}>
            <p className="quote-hero text-[var(--color-ink)]">{heroQuote}</p>
            {showEnglish && (
              <p className="mt-2.5 text-[var(--color-ink-light)] italic font-serif text-[1.02rem] leading-relaxed">
                {heroEnglish}
              </p>
            )}
          </blockquote>
        )}

        {/* Plain-language reading */}
        <div className="gloss text-[var(--color-ink)] whitespace-pre-wrap">{perspective.response}</div>

        {perspective.isInference && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--color-gold)]/10 rounded-full text-xs text-[var(--color-gold)]">
            {lang === 'zh' ? '基于其思想的推演' : 'Inferred from their philosophy'}
          </div>
        )}

        {/* Provenance — confident, not apologetic */}
        {perspective.citations && perspective.citations.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[var(--color-parchment-dark)] space-y-1.5">
            {perspective.citations.map((cite, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[var(--color-ink-faint)]">
                <ScrollText size={13} className="shrink-0" style={{ color }} />
                <span className="font-serif text-[var(--color-ink-light)] truncate">
                  {cite.workTitle}
                  {cite.chapterTitle ? ` · ${cite.chapterTitle}` : ''}
                </span>
                {cite.passageId > 0 && (
                  <button
                    onClick={() => onCitationClick?.(cite.passageId)}
                    className="shrink-0 ml-auto inline-flex items-center gap-1 text-[var(--color-gold)] hover:underline"
                  >
                    <ExternalLink size={11} />
                    {lang === 'zh' ? '查看原文' : 'Source'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
