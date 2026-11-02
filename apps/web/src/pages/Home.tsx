import { useState, useRef, useCallback, useEffect } from 'react';
import { useI18n } from '../lib/i18n';
import { api, ApiError, REPO_URL } from '../lib/api';
import { Logo } from '../components/brand/Logo';
import { Portrait } from '../components/common/Portrait';
import { SpeakerBlock } from '../components/council/SpeakerBlock';
import { Synthesis } from '../components/council/Synthesis';
import { ThinkingAnimation } from '../components/council/ThinkingAnimation';
import { ThinkerInfoModal } from '../components/council/ThinkerInfoModal';
import { CitationModal } from '../components/council/CitationModal';
import { ThinkerMentionPopup } from '../components/council/ThinkerMentionPopup';
import { SharePoster } from '../components/council/SharePoster';
import { Send, RotateCcw, Share2, ScrollText, X } from 'lucide-react';

const EXAMPLE_QUESTIONS = {
  en: [
    'What is the meaning of a good life?',
    'How should I deal with failure and setbacks?',
    'Is it better to act or to wait?',
    'How do I balance ambition with contentment?',
    'What is true courage?',
  ],
  zh: [
    '什么是美好的人生？',
    '如何面对失败和挫折？',
    '该行动还是该等待？',
    '如何平衡进取心与知足？',
    '什么是真正的勇气？',
  ],
};

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  result?: any;
}

export function Home() {
  const { lang, t } = useI18n();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [error, setError] = useState('');
  const [limitNotice, setLimitNotice] = useState<'daily_limit' | 'rate_limited' | null>(null);
  const [mentionedThinkers, setMentionedThinkers] = useState<any[]>([]);
  const [showMentionPopup, setShowMentionPopup] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [thinkerInfoSlug, setThinkerInfoSlug] = useState<string | null>(null);
  const [citationPassageId, setCitationPassageId] = useState<number | null>(null);
  const [deepDiveSlug, setDeepDiveSlug] = useState<string | null>(null);
  const [showSharePoster, setShowSharePoster] = useState(false);
  const [council, setCouncil] = useState<any[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasConversation = conversation.length > 0;
  const latestResult = conversation.filter((m) => m.role === 'assistant').slice(-1)[0]?.result;

  // Load the assembled council for the resting-state portrait wall
  useEffect(() => {
    api.getThinkers().then((d) => setCouncil(d ?? [])).catch(() => {});
  }, []);

  const activeThinkerSlugs = (() => {
    if (deepDiveSlug) return [deepDiveSlug];
    if (mentionedThinkers.length > 0) return mentionedThinkers.map((t) => t.slug);
    return undefined;
  })();

  const handleAsk = useCallback(async (q?: string) => {
    const finalQ = q ?? question;
    if (!finalQ.trim()) return;

    setLoading(true);
    setError('');
    setLimitNotice(null);

    const history = conversation.map((m) => ({
      role: m.role,
      content: m.role === 'assistant' ? JSON.stringify(m.result) : m.content,
    }));

    setConversation((prev) => [...prev, { role: 'user', content: finalQ }]);

    try {
      const thinkerSlugs = mentionedThinkers.map((t) => t.slug);
      const res = await api.askCouncil({
        question: finalQ,
        lang,
        thinkerSlugs: thinkerSlugs.length > 0 ? thinkerSlugs : undefined,
        conversationHistory: history.length > 0 ? history : undefined,
        deepDiveSlug: deepDiveSlug ?? undefined,
      });
      setConversation((prev) => [...prev, { role: 'assistant', content: '', result: res }]);
      setDeepDiveSlug(null);
      setMentionedThinkers([]);
    } catch (e: any) {
      // Trial limits and model failures get a friendly note instead of a raw error.
      const code = e instanceof ApiError ? e.code : undefined;
      if (code === 'daily_limit' || code === 'rate_limited') setLimitNotice(code);
      else setError(code === 'llm_failed' ? t('error.llm') : e.message);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  }, [question, lang, conversation, mentionedThinkers, deepDiveSlug, t]);

  const handleReset = () => {
    setConversation([]);
    setQuestion('');
    setError('');
    setLimitNotice(null);
    setMentionedThinkers([]);
    setDeepDiveSlug(null);
  };

  const handleInputChange = (value: string) => {
    setQuestion(value);
    const match = value.match(/@(\S*)$/);
    if (match) { setShowMentionPopup(true); setMentionQuery(match[1]); }
    else setShowMentionPopup(false);
  };

  const handleMentionSelect = (thinker: any) => {
    setQuestion(question.replace(/@\S*$/, ''));
    setShowMentionPopup(false);
    if (!mentionedThinkers.find((t) => t.slug === thinker.slug)) {
      setMentionedThinkers((prev) => [...prev, thinker]);
    }
    inputRef.current?.focus();
  };

  const removeMention = (slug: string) =>
    setMentionedThinkers((prev) => prev.filter((t) => t.slug !== slug));

  const handleDeepDive = (perspective: any) => {
    setDeepDiveSlug(perspective.thinkerSlug);
    setQuestion('');
    inputRef.current?.focus();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const examples = EXAMPLE_QUESTIONS[lang];

  // ---- Composer (used inline when empty, sticky when conversing) ----
  const composer = (
    <div className="relative">
      {deepDiveSlug && (
        <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-[var(--color-gold)]/10 rounded-full w-fit animate-slide-down">
          <Portrait slug={deepDiveSlug} size={22} ring={false} />
          <span className="text-sm text-[var(--color-gold)]">{t('council.deepfollow')}</span>
          <button onClick={() => setDeepDiveSlug(null)} className="text-[var(--color-ink-faint)] hover:text-red-500">
            <X size={13} />
          </button>
        </div>
      )}

      {mentionedThinkers.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {mentionedThinkers.map((th, i) => (
            <span
              key={th.slug}
              className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 bg-[var(--color-gold)]/10 rounded-full text-sm animate-fade-in-scale"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <Portrait slug={th.slug} name={lang === 'zh' ? (th.name_zh ?? th.nameZh) : (th.name_en ?? th.nameEn)} tradition={th.tradition} size={20} ring={false} />
              <span className="text-[var(--color-gold)]">{lang === 'zh' ? th.name_zh ?? th.nameZh : th.name_en ?? th.nameEn}</span>
              <button onClick={() => removeMention(th.slug)} className="text-[var(--color-ink-faint)] hover:text-red-500"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2">
        {hasConversation && (
          <button
            onClick={handleReset}
            title={t('council.newSession')}
            className="shrink-0 mb-1 w-11 h-11 rounded-full border border-[var(--color-parchment-dark)] bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-ink-light)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors"
          >
            <RotateCcw size={17} />
          </button>
        )}
        <div className="relative flex-1">
          {showMentionPopup && (
            <ThinkerMentionPopup query={mentionQuery} onSelect={handleMentionSelect} onClose={() => setShowMentionPopup(false)} />
          )}
          <textarea
            ref={inputRef}
            value={question}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !showMentionPopup) { e.preventDefault(); handleAsk(); } }}
            placeholder={
              deepDiveSlug
                ? t('council.deepfollow')
                : hasConversation
                  ? t('council.followup')
                  : t('home.placeholder')
            }
            rows={hasConversation ? 1 : 3}
            className="w-full px-4 sm:px-5 py-3.5 pr-14 rounded-2xl border border-[var(--color-parchment-dark)] bg-[var(--color-surface)] text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/30 focus:border-[var(--color-gold)] resize-none text-base sm:text-lg font-serif transition-all shadow-sm"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="absolute right-2.5 bottom-2.5 p-2.5 rounded-xl bg-[var(--color-gold)] text-white hover:bg-[var(--color-gold-light)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className={`max-w-3xl mx-auto px-4 ${hasConversation ? 'pt-8 pb-44' : 'py-8 sm:py-12'}`}>

        {/* ===== Resting hero ===== */}
        {!hasConversation && !loading && (
          <section className="text-center animate-fade-in-up">
            <div className="flex justify-center mb-5">
              <span className="text-[var(--color-ink)]"><Logo size={56} /></span>
            </div>
            <h1 className="font-serif font-semibold text-3xl sm:text-[2.6rem] leading-tight text-[var(--color-ink)] mb-3">
              {t('app.subtitle')}
            </h1>
            <p className="text-[var(--color-ink-light)] text-base sm:text-lg max-w-xl mx-auto">
              {t('app.tagline')}
            </p>

            {/* Assembled council */}
            {council.length > 0 && (
              <div className="mt-9 mb-2">
                <div className="flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
                  {council.map((th) => (
                    <button
                      key={th.slug}
                      onClick={() => setThinkerInfoSlug(th.slug)}
                      title={lang === 'zh' ? th.name_zh ?? th.nameZh : th.name_en ?? th.nameEn}
                      className="transition-transform hover:scale-110 hover:z-10"
                    >
                      <Portrait slug={th.slug} name={lang === 'zh' ? (th.name_zh ?? th.nameZh) : (th.name_en ?? th.nameEn)} tradition={th.tradition} size={40} ringWidth={2} />
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-[var(--color-ink-faint)]">
                  {lang === 'zh'
                    ? `${council.length} 位思想家在席 · 跨越十余个传统与两千五百年`
                    : `${council.length} thinkers convened · across a dozen traditions and 2,500 years`}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ===== Conversation thread ===== */}
        {hasConversation && (
          <div className="space-y-10">
            {conversation.map((msg, idx) => {
              if (msg.role === 'user') {
                return (
                  <div key={idx} className="flex justify-end user-bubble-enter">
                    <div className="bg-[var(--color-gold)]/10 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%]">
                      <p className="text-[var(--color-ink)] font-serif text-lg">{msg.content}</p>
                    </div>
                  </div>
                );
              }
              const result = msg.result;
              if (!result) return null;
              const perspectives = result.perspectives ?? [];
              const abstract = lang === 'zh' ? result.questionAbstractZh || result.questionAbstract : result.questionAbstract;
              const takeaway = lang === 'zh' ? result.takeawayZh || result.takeaway : result.takeaway;

              return (
                <div key={idx} className="space-y-6">
                  {/* Moderator frames the question */}
                  {abstract && (
                    <div className="text-center animate-fade-in-up">
                      <p className="eyebrow mb-1.5">{t('council.frame')}</p>
                      <p className="font-serif text-xl sm:text-2xl text-[var(--color-gold)]">{abstract}</p>
                    </div>
                  )}

                  {/* One-breath take-away */}
                  {takeaway && (
                    <div className="chamber rounded-3xl px-6 sm:px-10 py-8 text-center animate-fade-in-scale">
                      <p className="eyebrow text-[var(--color-candle)] mb-3">{t('council.takeaway')}</p>
                      <p className="font-serif text-2xl sm:text-[1.9rem] leading-snug text-[var(--color-chamber-ink)]">
                        “{takeaway}”
                      </p>
                    </div>
                  )}

                  {perspectives.length === 0 ? (
                    <p className="text-center text-[var(--color-ink-light)] py-6">{result.disclaimer}</p>
                  ) : (
                    <>
                      {/* Provenance — stated with confidence */}
                      <p className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-ink-faint)] max-w-lg mx-auto text-center">
                        <ScrollText size={12} className="shrink-0" />
                        {t('council.provenance')}
                      </p>

                      {/* Speakers take the floor, one by one */}
                      <div className="space-y-5">
                        {perspectives.map((p: any, i: number) => (
                          <SpeakerBlock
                            key={i}
                            perspective={p}
                            index={i}
                            onThinkerClick={(slug) => setThinkerInfoSlug(slug)}
                            onCitationClick={(id) => setCitationPassageId(id)}
                            onDeepDive={handleDeepDive}
                          />
                        ))}
                      </div>

                      {/* The council's synthesis */}
                      {result.synthesis && (
                        <Synthesis synthesis={result.synthesis} delay={perspectives.length * 0.45 + 0.2} />
                      )}

                      {/* Turn footer */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setShowSharePoster(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[var(--color-ink-light)] hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/8 transition-colors"
                        >
                          <Share2 size={14} />
                          {lang === 'zh' ? '分享' : 'Share'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Thinking */}
        {loading && <div className="mt-6"><ThinkingAnimation thinkerSlugs={activeThinkerSlugs} /></div>}

        {/* Trial limit reached */}
        {limitNotice && (
          <div data-testid="limit-notice" className="bg-[var(--color-surface)] border border-[var(--color-parchment-dark)] rounded-xl p-5 my-6 animate-fade-in-scale text-center">
            <p className="text-[var(--color-ink)] text-sm leading-relaxed">
              {t(limitNotice === 'daily_limit' ? 'limit.daily' : 'limit.rate')}
            </p>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-2 text-sm text-[var(--color-gold)] underline underline-offset-4 hover:opacity-80"
            >
              {t('limit.selfHost')}
            </a>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 my-6 animate-fade-in-scale">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Inline composer + examples (resting state) */}
        {!hasConversation && !loading && (
          <>
            <div className="mt-9 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{composer}</div>
            <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.18s' }}>
              <p className="text-sm text-[var(--color-ink-faint)] mb-3">{t('home.tryAsking')}</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((q) => (
                  <button
                    key={q}
                    onClick={() => { setQuestion(q); handleAsk(q); }}
                    className="px-3.5 py-2 rounded-full border border-[var(--color-parchment-dark)] text-sm text-[var(--color-ink-light)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-all bg-[var(--color-surface)] hover:shadow-sm active:scale-95"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky composer (conversation state) */}
      {hasConversation && !loading && (
        <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--color-parchment-dark)] bg-[var(--color-parchment)]/85 backdrop-blur-md">
          <div className="max-w-3xl mx-auto px-4 py-3">{composer}</div>
        </div>
      )}

      {/* Modals */}
      {thinkerInfoSlug && <ThinkerInfoModal slug={thinkerInfoSlug} onClose={() => setThinkerInfoSlug(null)} />}
      {citationPassageId && <CitationModal passageId={citationPassageId} onClose={() => setCitationPassageId(null)} />}
      {showSharePoster && latestResult && (
        <SharePoster
          question={conversation.filter((m) => m.role === 'user').slice(-1)[0]?.content ?? ''}
          questionAbstract={latestResult.questionAbstract}
          perspectives={latestResult.perspectives ?? []}
          onClose={() => setShowSharePoster(false)}
        />
      )}
    </div>
  );
}
