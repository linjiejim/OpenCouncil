import { useState } from 'react';
import { TRADITION_LABELS } from '../../lib/constants';

/**
 * Slugs that have an emblem in /public/emblems. We draw a symbol taken from
 * each thinker's own texts (Zhuangzi's butterfly, Seneca's hourglass, Kant's
 * starry sky…) instead of a face: no reliable likeness survives for most of
 * them, and a council that refuses to invent quotations shouldn't invent faces.
 */
export const EMBLEMS = new Set([
  'confucius', 'laozi', 'zhuangzi', 'dhammapada', 'wang-yangming',
  'plato', 'aristotle', 'marcus-aurelius', 'gospels', 'seneca',
  'mencius', 'epictetus', 'nietzsche', 'kant', 'rumi', 'quran',
]);

interface PortraitProps {
  slug?: string;
  name?: string;
  tradition?: string;
  /** diameter in px */
  size?: number;
  /** show a tradition-colored ring */
  ring?: boolean;
  ringWidth?: number;
  className?: string;
  /** extra glow (used while deliberating) */
  breathing?: boolean;
}

/**
 * Unified avatar. An engraved emblem for thinkers who have one; for the rest,
 * a matching medallion — a serif initial on a dark coin with a
 * tradition-colored ring — so the whole council reads as one coherent set.
 */
export function Portrait({
  slug,
  name,
  tradition,
  size = 44,
  ring = true,
  ringWidth = 2,
  className = '',
  breathing = false,
}: PortraitProps) {
  const [failed, setFailed] = useState(false);
  const color = TRADITION_LABELS[tradition ?? '']?.color ?? '#a87b35';
  const hasReal = !!slug && EMBLEMS.has(slug) && !failed;
  // Initial: for Latin names use the surname (last word) so "Immanuel Kant" → K,
  // "Friedrich Nietzsche" → N, "Prophet Muhammad" → M; for CJK use the first glyph.
  const raw = (name ?? slug ?? '?').trim();
  const initial = /[A-Za-z]/.test(raw)
    ? (raw.replace(/[()]/g, '').split(/\s+/).filter(Boolean).pop() ?? raw).charAt(0).toUpperCase()
    : raw.charAt(0);

  return (
    <span
      className={`portrait relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 ${breathing ? 'animate-breathe' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: ring ? `0 0 0 ${ringWidth}px ${color}` : undefined,
        background: 'radial-gradient(circle at 50% 32%, #34281c, #1a130d)',
      }}
    >
      {hasReal ? (
        <img
          src={`/emblems/${slug}.jpg`}
          alt={name ?? ''}
          className="portrait-img w-full h-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="font-serif font-semibold leading-none select-none"
          style={{ color: 'var(--color-gold-light)', fontSize: size * 0.44 }}
        >
          {initial}
        </span>
      )}
    </span>
  );
}
