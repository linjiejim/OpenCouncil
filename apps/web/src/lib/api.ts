const BASE = '/api';

async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

export const api = {
  // Thinkers
  getThinkers: (tradition?: string) =>
    fetchJSON<any[]>(`/thinkers${tradition ? `?tradition=${tradition}` : ''}`),
  getThinker: (slug: string) => fetchJSON<any>(`/thinkers/${slug}`),

  // Works
  getWork: (id: number) => fetchJSON<any>(`/works/${id}`),

  // Passages
  getPassagesByChapter: (chapterId: number) => fetchJSON<any[]>(`/passages/by-chapter/${chapterId}`),
  getPassage: (id: number) => fetchJSON<any>(`/passages/${id}`),

  // Search
  search: (q: string, opts?: { tradition?: string; thinker?: string; limit?: number; offset?: number }) => {
    const params = new URLSearchParams({ q });
    if (opts?.tradition) params.set('tradition', opts.tradition);
    if (opts?.thinker) params.set('thinker', opts.thinker);
    if (opts?.limit) params.set('limit', String(opts.limit));
    if (opts?.offset) params.set('offset', String(opts.offset));
    return fetchJSON<{ results: any[]; total: number; translatedFrom?: string; translatedTo?: string }>(`/search?${params}`);
  },

  // Search by tag
  searchByTag: (slug: string) =>
    fetchJSON<{ results: any[] }>(`/search/by-tag/${slug}`),

  // Themes
  getThemes: () => fetchJSON<any[]>('/themes'),

  // Council — supports multi-turn, @ mentions, and deep dive
  askCouncil: (opts: {
    question: string;
    lang?: string;
    thinkerSlugs?: string[];
    conversationHistory?: { role: string; content: string }[];
    deepDiveSlug?: string;
  }) =>
    fetchJSON<any>('/council/ask', {
      method: 'POST',
      body: JSON.stringify(opts),
    }),
};
