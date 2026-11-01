import { useEffect, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { api } from '../../lib/api';
import { X, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  passageId: number;
  onClose: () => void;
}

export function CitationModal({ passageId, onClose }: Props) {
  const { lang } = useI18n();
  const [passage, setPassage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPassage(passageId).then((d) => { setPassage(d); setLoading(false); }).catch(() => setLoading(false));
  }, [passageId]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-black/5 rounded-full z-10">
          <X size={18} className="text-[var(--color-ink-light)]" />
        </button>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-[var(--color-gold)]" size={28} />
          </div>
        ) : passage ? (
          <div className="p-6">
            {/* Header */}
            <div className="mb-4">
              <p className="text-xs text-[var(--color-ink-light)] uppercase tracking-wide">
                {passage.thinker?.name_en ?? passage.thinker?.nameEn} · {passage.work?.title_en ?? passage.work?.titleEn}
              </p>
              <p className="text-sm text-[var(--color-ink-light)]">
                {passage.chapter?.title_en ?? passage.chapter?.titleEn}
              </p>
            </div>

            {/* Original text */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-[var(--color-ink-light)] uppercase tracking-wide mb-1">
                {lang === 'zh' ? '原文' : 'Original Text'}
              </p>
              <p className="font-serif text-lg text-[var(--color-ink)] leading-relaxed">
                {passage.original_text ?? passage.originalText}
              </p>
            </div>

            {/* English translation */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-[var(--color-ink-light)] uppercase tracking-wide mb-1">
                {lang === 'zh' ? '英文翻译' : 'English Translation'}
              </p>
              <p className="text-[var(--color-ink)] leading-relaxed">
                {passage.english_text ?? passage.englishText}
              </p>
            </div>

            {/* Summary */}
            {(passage.summary_en ?? passage.summaryEn) && (
              <div className="mb-4 bg-[var(--color-parchment)]/50 rounded-lg p-3">
                <p className="text-sm text-[var(--color-ink-light)]">
                  💡 {lang === 'zh' ? passage.summary_zh ?? passage.summaryZh : passage.summary_en ?? passage.summaryEn}
                </p>
              </div>
            )}

            {/* Context note */}
            {(passage.context_note ?? passage.contextNote) && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-[var(--color-ink-light)] uppercase tracking-wide mb-1">
                  {lang === 'zh' ? '时代背景' : 'Historical Context'}
                </p>
                <p className="text-sm text-[var(--color-ink-light)] leading-relaxed">
                  {passage.context_note ?? passage.contextNote}
                </p>
              </div>
            )}

            {/* Link to full work */}
            {passage.work && (
              <Link
                to={`/work/${passage.work.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-sm text-[var(--color-gold)] hover:underline"
              >
                <ExternalLink size={12} />
                {lang === 'zh' ? '查看完整著作' : 'View full work'}
              </Link>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-[var(--color-ink-light)]">
            {lang === 'zh' ? '未找到引用详情' : 'Citation details not found'}
          </div>
        )}
      </div>
    </div>
  );
}
