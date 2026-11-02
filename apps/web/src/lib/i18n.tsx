import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'zh';

const translations: Record<Lang, Record<string, string>> = {
  en: {
    'app.title': 'OpenCouncil',
    'app.subtitle': 'Wisdom Across Time',
    'app.tagline': 'Hear what history\'s greatest thinkers would say about your question',
    'nav.home': 'The Council',
    'nav.thinkers': 'Thinkers',
    'nav.themes': 'Themes',
    'nav.search': 'Search',
    'home.placeholder': 'Ask a question that matters to you...',
    'home.ask': 'Ask the Council',
    'home.examples': 'Bring a question, and the council will convene.',
    'home.tryAsking': 'Or begin with',
    'council.thinking': 'The council is deliberating...',
    'council.abstract': 'Your question touches on:',
    'council.frame': 'The council considers',
    'council.takeaway': 'In one breath',
    'council.synthesis': "The council's reading",
    'council.consensus': 'Where they converge',
    'council.tensions': 'Where they diverge',
    'council.voices': 'voices convened',
    'council.provenance': 'Every line below is traceable to an original text — open any source to read it yourself.',
    'council.viewSource': 'Read the source',
    'council.deepDive': 'Press further',
    'council.followup': 'Follow up — or summon a thinker with @',
    'council.deepfollow': 'Continue with this thinker…',
    'limit.daily': "Today's free trial is used up. Come back tomorrow — or run your own copy.",
    'limit.rate': "You're asking faster than the trial allows. Take a breather and try again a little later — or run your own copy.",
    'limit.selfHost': 'Self-host OpenCouncil (GitHub)',
    'error.llm': 'The council could not answer this time. Please try again.',
    'council.newSession': 'Convene a new question',
    'council.deliberating': 'The council is convening',
    'council.disclaimer': '⚠️ These responses are AI-generated interpretations grounded in original texts. Click "View original text" to verify citations.',
    'council.askAnother': 'Ask another question',
    'council.citation': 'Source',
    'council.expand': 'View original text',
    'council.context': 'Historical context',
    'thinker.works': 'Works',
    'thinker.coreIdeas': 'Core Ideas',
    'thinker.bio': 'Biography',
    'passage.original': 'Original Text',
    'passage.english': 'English Translation',
    'passage.context': 'Historical Context & Boundaries',
    'search.placeholder': 'Search across all traditions...',
    'search.results': 'results',
    'search.noResults': 'No results found',
    'theme.explore': 'Explore Themes',
    'common.loading': 'Loading...',
    'common.back': 'Back',
    'common.readMore': 'Read more',
  },
  zh: {
    'app.title': 'OpenCouncil',
    'app.subtitle': '穿越时空的思想议事厅',
    'app.tagline': '听听人类历史上最伟大的思想家们，如何回应你的问题',
    'nav.home': '议事厅',
    'nav.thinkers': '思想家',
    'nav.themes': '主题',
    'nav.search': '搜索',
    'home.placeholder': '提出一个对你重要的问题...',
    'home.ask': '召集议事厅',
    'home.examples': '带着一个问题来，议事厅即刻为你召集。',
    'home.tryAsking': '或从这里开始',
    'council.thinking': '议事厅正在讨论中...',
    'council.abstract': '你的问题触及了：',
    'council.frame': '议事厅在思考',
    'council.takeaway': '一句话',
    'council.synthesis': '议事厅的合议',
    'council.consensus': '他们一致之处',
    'council.tensions': '他们分歧之处',
    'council.voices': '位思想家入席',
    'council.provenance': '以下每一句都可溯源至原著——点开任一出处，亲自查证。',
    'council.viewSource': '查看原文',
    'council.deepDive': '继续追问',
    'council.followup': '继续提问 —— 或用 @ 召唤某位思想家',
    'council.deepfollow': '继续与这位思想家深入…',
    'limit.daily': '今天的试用额度用完了，明天再来，或者自部署一份。',
    'limit.rate': '提问有点太快了，歇一会儿再来，或者自部署一份。',
    'limit.selfHost': '在 GitHub 上自部署 OpenCouncil',
    'error.llm': '议事厅这次没能作答，请稍后再试。',
    'council.newSession': '开启新的一问',
    'council.deliberating': '议事厅正在召集',
    'council.disclaimer': '⚠️ 以上回答基于思想家原著的 AI 推演。点击「查看原文」可核实引用。',
    'council.citation': '出处',
    'council.expand': '查看原文',
    'council.context': '时代背景',
    'thinker.works': '著作',
    'thinker.coreIdeas': '核心思想',
    'thinker.bio': '生平',
    'passage.original': '原文',
    'passage.english': '英文翻译',
    'passage.context': '时代背景与适用边界',
    'search.placeholder': '跨传统搜索...',
    'search.results': '条结果',
    'search.noResults': '未找到相关内容',
    'theme.explore': '探索主题',
    'common.loading': '加载中...',
    'common.back': '返回',
    'common.readMore': '阅读更多',
  },
};

interface I18nContext {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const I18nCtx = createContext<I18nContext>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('oc-lang');
      if (saved === 'zh' || saved === 'en') return saved;
      return navigator.language.startsWith('zh') ? 'zh' : 'en';
    }
    return 'en';
  });

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('oc-lang', newLang);
  };

  const t = (key: string) => translations[lang][key] ?? key;

  return <I18nCtx.Provider value={{ lang, setLang: handleSetLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);

/** Helper to pick lang-specific field from DB objects */
export function localized(obj: any, field: string, lang: Lang): string {
  if (lang === 'zh') return obj[`${field}Zh`] || obj[`${field}_zh`] || obj[`${field}En`] || obj[`${field}_en`] || '';
  return obj[`${field}En`] || obj[`${field}_en`] || '';
}
