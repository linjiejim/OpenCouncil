import { useEffect, useState, useRef } from 'react';
import { useI18n } from '../../lib/i18n';
import { api } from '../../lib/api';
import { TRADITION_LABELS } from '../../lib/constants';
import { Portrait } from '../common/Portrait';

interface Props {
  query: string; // text after @
  onSelect: (thinker: any) => void;
  onClose: () => void;
}

export function ThinkerMentionPopup({ query, onSelect, onClose }: Props) {
  const { lang } = useI18n();
  const [thinkers, setThinkers] = useState<any[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getThinkers().then(setThinkers);
  }, []);

  // Filter thinkers by query
  const filtered = thinkers.filter((t) => {
    const q = query.toLowerCase();
    if (!q) return true;
    const nameEn = (t.name_en ?? t.nameEn ?? '').toLowerCase();
    const nameZh = t.name_zh ?? t.nameZh ?? '';
    const slug = t.slug ?? '';
    return nameEn.includes(q) || nameZh.includes(q) || slug.includes(q);
  });

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter' && filtered[selectedIdx]) { e.preventDefault(); onSelect(filtered[selectedIdx]); }
      else if (e.key === 'Escape') { onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [filtered, selectedIdx, onSelect, onClose]);

  useEffect(() => { setSelectedIdx(0); }, [query]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 bg-white rounded-xl shadow-xl border border-[var(--color-parchment-dark)] overflow-hidden max-h-64 overflow-y-auto w-72"
      // Always anchored ABOVE the input (its relative wrapper) so the list is fully visible.
      style={{ bottom: '100%', left: 0, marginBottom: 8 }}
    >
      <div className="p-1.5">
        {filtered.map((t, i) => {
          const tradition = TRADITION_LABELS[t.tradition];
          const name = lang === 'zh' ? t.name_zh ?? t.nameZh : t.name_en ?? t.nameEn;
          const isSelected = i === selectedIdx;
          return (
            <button
              key={t.slug}
              onClick={() => onSelect(t)}
              onMouseEnter={() => setSelectedIdx(i)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isSelected ? 'bg-[var(--color-gold)]/10' : 'hover:bg-[var(--color-parchment)]'
              }`}
            >
              <Portrait slug={t.slug} name={name} tradition={t.tradition} size={36} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--color-ink)] truncate">{name}</p>
                <p className="text-xs text-[var(--color-ink-light)]">
                  {lang === 'zh' ? tradition?.zh : tradition?.en} · {t.era}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
