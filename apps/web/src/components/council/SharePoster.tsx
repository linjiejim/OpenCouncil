import { useRef, useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { X, Download, Share2 } from 'lucide-react';
import { TRADITION_LABELS } from '../../lib/constants';

interface Props {
  question: string;
  questionAbstract: string;
  perspectives: any[];
  onClose: () => void;
}

export function SharePoster({ question, questionAbstract, perspectives, onClose }: Props) {
  const { lang } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);

  const generatePoster = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGenerating(true);

    const ctx = canvas.getContext('2d')!;
    const W = 800;
    const H = 1200;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = '#faf6f0';
    ctx.fillRect(0, 0, W, H);

    // Header decoration
    ctx.fillStyle = '#b8860b';
    ctx.fillRect(0, 0, W, 4);

    // Title
    ctx.fillStyle = '#2c1810';
    ctx.font = 'bold 28px "Crimson Pro", serif';
    ctx.textAlign = 'center';
    ctx.fillText('OpenCouncil', W / 2, 50);

    ctx.fillStyle = '#5c4a3a';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText(lang === 'zh' ? '穿越时空的思想议事厅' : 'Wisdom Across Time', W / 2, 75);

    // Divider line
    ctx.strokeStyle = '#f0e8db';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 95);
    ctx.lineTo(W - 100, 95);
    ctx.stroke();

    // Question
    ctx.fillStyle = '#b8860b';
    ctx.font = 'italic 20px "Crimson Pro", serif';
    const questionLines = wrapText(ctx, `"${question}"`, W - 120);
    let y = 125;
    for (const line of questionLines) {
      ctx.fillText(line, W / 2, y);
      y += 28;
    }

    // Theme
    ctx.fillStyle = '#5c4a3a';
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText(questionAbstract, W / 2, y + 10);
    y += 40;

    // Perspectives
    ctx.textAlign = 'left';
    for (const p of perspectives.slice(0, 3)) {
      const tradition = TRADITION_LABELS[p.tradition] ?? { color: '#666' };
      const name = lang === 'zh' ? p.thinkerNameZh || p.thinkerName : p.thinkerName;

      // Thinker name with tradition color
      ctx.fillStyle = tradition.color;
      ctx.font = 'bold 16px "Crimson Pro", serif';
      ctx.fillText(name, 60, y);

      // Tradition tag
      const tLabel = lang === 'zh' ? (TRADITION_LABELS[p.tradition]?.zh ?? '') : (TRADITION_LABELS[p.tradition]?.en ?? '');
      ctx.fillStyle = '#5c4a3a';
      ctx.font = '12px "Inter", sans-serif';
      const nameWidth = ctx.measureText(name).width;
      ctx.fillText(`· ${tLabel}`, 60 + nameWidth + 8 + (16 * 2), y); // account for bold font width
      y += 8;

      // Response excerpt
      ctx.fillStyle = '#2c1810';
      ctx.font = '14px "Inter", sans-serif';
      const responseLines = wrapText(ctx, p.response.substring(0, 200) + '...', W - 120);
      for (const line of responseLines.slice(0, 4)) {
        y += 20;
        ctx.fillText(line, 60, y);
      }

      y += 30;
      if (y > H - 120) break;
    }

    // Footer
    ctx.fillStyle = '#f0e8db';
    ctx.fillRect(0, H - 80, W, 80);

    ctx.fillStyle = '#5c4a3a';
    ctx.font = '12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(lang === 'zh' ? '基于思想家原著的 AI 推演 · opencouncil.app' : 'AI interpretations based on original texts · opencouncil.app', W / 2, H - 50);
    ctx.fillText(new Date().toLocaleDateString(), W / 2, H - 30);

    // Bottom decoration
    ctx.fillStyle = '#b8860b';
    ctx.fillRect(0, H - 4, W, 4);

    setGenerating(false);
  };

  const downloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `opencouncil-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const sharePoster = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      if (navigator.share) {
        const file = new File([blob], 'opencouncil-wisdom.png', { type: 'image/png' });
        try {
          await navigator.share({ title: 'OpenCouncil', text: question, files: [file] });
        } catch { /* user cancelled */ }
      } else {
        downloadPoster();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-black/5 rounded-full z-10">
          <X size={18} className="text-[var(--color-ink-light)]" />
        </button>

        <div className="p-5">
          <h3 className="text-lg font-serif font-semibold text-[var(--color-ink)] mb-4">
            {lang === 'zh' ? '分享海报' : 'Share Poster'}
          </h3>

          {/* Canvas preview */}
          <div className="bg-[var(--color-parchment)] rounded-lg p-3 mb-4">
            <canvas
              ref={canvasRef}
              className="w-full rounded shadow"
              style={{ maxHeight: 500 }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={generatePoster}
              disabled={generating}
              className="flex-1 py-2.5 rounded-xl bg-[var(--color-gold)] text-white font-medium hover:bg-[var(--color-gold-light)] transition-colors text-sm"
            >
              {generating ? (lang === 'zh' ? '生成中...' : 'Generating...') : (lang === 'zh' ? '生成海报' : 'Generate Poster')}
            </button>
            <button
              onClick={downloadPoster}
              className="p-2.5 rounded-xl border border-[var(--color-parchment-dark)] hover:border-[var(--color-gold)] transition-colors"
              title={lang === 'zh' ? '下载' : 'Download'}
            >
              <Download size={18} className="text-[var(--color-ink-light)]" />
            </button>
            <button
              onClick={sharePoster}
              className="p-2.5 rounded-xl border border-[var(--color-parchment-dark)] hover:border-[var(--color-gold)] transition-colors"
              title={lang === 'zh' ? '分享' : 'Share'}
            >
              <Share2 size={18} className="text-[var(--color-ink-light)]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Wrap text into lines that fit a max width */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/(\s+)/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current + word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = test;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}
