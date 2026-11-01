import { useI18n } from '../../lib/i18n';
import { Handshake, GitCompare } from 'lucide-react';

interface Tension {
  en: string;
  zh: string;
}
export interface SynthesisData {
  consensus?: string;
  consensusZh?: string;
  tensions?: Tension[];
}

interface Props {
  synthesis: SynthesisData;
  /** reveal after the speakers have taken the floor */
  delay?: number;
}

/**
 * The council's closing reading: where the traditions converge, and where
 * they genuinely diverge. This is what a single answer can never give you.
 */
export function Synthesis({ synthesis, delay = 0 }: Props) {
  const { lang, t } = useI18n();
  const consensus = lang === 'zh' ? synthesis.consensusZh || synthesis.consensus : synthesis.consensus;
  const tensions = (synthesis.tensions ?? [])
    .map((x) => (lang === 'zh' ? x.zh || x.en : x.en))
    .filter(Boolean);

  if (!consensus && tensions.length === 0) return null;

  return (
    <section
      className="speaker-reveal rounded-2xl border border-[var(--color-gold)]/30 overflow-hidden"
      style={{
        animationDelay: `${delay}s`,
        background: 'linear-gradient(180deg, rgba(168,123,53,0.06), rgba(168,123,53,0.02))',
      }}
    >
      <div className="px-5 sm:px-7 py-3 border-b border-[var(--color-gold)]/20">
        <p className="eyebrow text-[var(--color-gold)]">{t('council.synthesis')}</p>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {consensus && (
          <div className="flex gap-3.5">
            <span className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-sage)]/15 flex items-center justify-center mt-0.5">
              <Handshake size={17} className="text-[var(--color-sage)]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)] mb-1">{t('council.consensus')}</p>
              <p className="gloss text-[var(--color-ink-light)]">{consensus}</p>
            </div>
          </div>
        )}

        {tensions.length > 0 && (
          <div className="flex gap-3.5">
            <span className="shrink-0 w-9 h-9 rounded-full bg-[var(--color-gold)]/15 flex items-center justify-center mt-0.5">
              <GitCompare size={17} className="text-[var(--color-gold)]" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--color-ink)] mb-2">{t('council.tensions')}</p>
              <ul className="space-y-2.5">
                {tensions.map((tn, i) => (
                  <li key={i} className="flex gap-2.5 text-[var(--color-ink-light)]">
                    <span className="select-none text-[var(--color-gold)]/60 font-serif leading-relaxed">⇋</span>
                    <span className="leading-relaxed">{tn}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
