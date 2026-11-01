import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n';
import { api } from '../lib/api';
import { Loader2, ArrowLeft, X } from 'lucide-react';
import * as d3 from 'd3';
import { EMBLEMS } from '../components/common/Portrait';

const TRADITION_COLORS: Record<string, string> = {
  confucianism: '#b8860b',
  daoism: '#6b8e6b',
  buddhism: '#daa520',
  christianity: '#4682b4',
  'ancient-greek': '#8b4513',
  stoicism: '#708090',
  existentialism: '#696969',
  enlightenment: '#9370db',
  islam: '#2e8b57',
  sufism: '#9370db',
};

const TRADITION_LABELS: Record<string, { en: string; zh: string; color: string }> = {
  confucianism: { en: 'Confucianism', zh: '儒家', color: '#b8860b' },
  daoism: { en: 'Daoism', zh: '道家', color: '#6b8e6b' },
  buddhism: { en: 'Buddhism', zh: '佛教', color: '#daa520' },
  christianity: { en: 'Christianity', zh: '基督教', color: '#4682b4' },
  'ancient-greek': { en: 'Ancient Greek', zh: '古希腊', color: '#8b4513' },
  stoicism: { en: 'Stoicism', zh: '斯多葛', color: '#708090' },
  existentialism: { en: 'Existentialism', zh: '存在主义', color: '#696969' },
  enlightenment: { en: 'Enlightenment', zh: '启蒙', color: '#9370db' },
  islam: { en: 'Islam', zh: '伊斯兰', color: '#2e8b57' },
  sufism: { en: 'Sufism', zh: '苏菲', color: '#9370db' },
};

/** Theme-to-thinker associations — which thinkers have ideas relevant to which themes */
const THEME_THINKER_LINKS: Record<string, string[]> = {
  existence: ['dhammapada', 'zhuangzi', 'marcus-aurelius', 'seneca', 'gospels', 'nietzsche', 'rumi'],
  ethics: ['confucius', 'aristotle', 'plato', 'wang-yangming', 'gospels', 'kant', 'mencius', 'quran'],
  relationships: ['confucius', 'gospels', 'aristotle', 'seneca', 'dhammapada', 'rumi', 'mencius'],
  self: ['marcus-aurelius', 'wang-yangming', 'dhammapada', 'plato', 'seneca', 'epictetus', 'nietzsche'],
  society: ['confucius', 'plato', 'aristotle', 'laozi', 'wang-yangming', 'mencius', 'kant', 'quran'],
  knowledge: ['plato', 'aristotle', 'laozi', 'zhuangzi', 'wang-yangming', 'kant', 'quran'],
  transcendence: ['laozi', 'zhuangzi', 'dhammapada', 'gospels', 'plato', 'rumi', 'quran'],
  action: ['wang-yangming', 'confucius', 'marcus-aurelius', 'laozi', 'seneca', 'epictetus', 'mencius', 'nietzsche'],
};

/** Thinker name map for the graph */
const THINKER_NAMES: Record<string, { en: string; zh: string; tradition: string }> = {
  confucius: { en: 'Confucius', zh: '孔子', tradition: 'confucianism' },
  laozi: { en: 'Laozi', zh: '老子', tradition: 'daoism' },
  zhuangzi: { en: 'Zhuangzi', zh: '庄子', tradition: 'daoism' },
  buddha: { en: 'Buddha', zh: '佛陀', tradition: 'buddhism' },
  'wang-yangming': { en: 'Wang Yangming', zh: '王阳明', tradition: 'confucianism' },
  plato: { en: 'Plato', zh: '柏拉图', tradition: 'ancient-greek' },
  aristotle: { en: 'Aristotle', zh: '亚里士多德', tradition: 'ancient-greek' },
  'marcus-aurelius': { en: 'Marcus Aurelius', zh: '奥勒留', tradition: 'stoicism' },
  jesus: { en: 'Jesus', zh: '耶稣', tradition: 'christianity' },
  seneca: { en: 'Seneca', zh: '塞涅卡', tradition: 'stoicism' },
  mencius: { en: 'Mencius', zh: '孟子', tradition: 'confucianism' },
  epictetus: { en: 'Epictetus', zh: '爱比克泰德', tradition: 'stoicism' },
  nietzsche: { en: 'Nietzsche', zh: '尼采', tradition: 'existentialism' },
  kant: { en: 'Kant', zh: '康德', tradition: 'enlightenment' },
  rumi: { en: 'Rumi', zh: '鲁米', tradition: 'sufism' },
  muhammad: { en: 'Muhammad', zh: '穆罕默德', tradition: 'islam' },
};

/** Theme icon map */
const THEME_ICONS: Record<string, string> = {
  existence: '🌌', ethics: '⚖️', relationships: '🤝', self: '🪞',
  society: '🏛️', knowledge: '📚', transcendence: '✨', action: '🎯',
};

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  type: 'theme' | 'thinker';
  label: string;
  icon?: string;
  color: string;
  radius: number;
  tradition?: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

export function ThemeExplore() {
  const { lang, t } = useI18n();
  const [themes, setThemes] = useState<any[]>([]);
  const [thinkers, setThinkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tag-drill state
  const [selectedTag, setSelectedTag] = useState<any | null>(null);
  const [tagPassages, setTagPassages] = useState<any[]>([]);
  const [loadingPassages, setLoadingPassages] = useState(false);

  // Force graph state
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  useEffect(() => {
    Promise.all([api.getThemes(), api.getThinkers()]).then(([th, tk]) => {
      setThemes(th);
      setThinkers(tk);
      setLoading(false);
    });
  }, []);

  // Build the force graph
  useEffect(() => {
    if (loading || themes.length === 0 || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.max(560, Math.min(window.innerHeight * 0.65, 700));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    // Build nodes and links
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const addedThinkers = new Set<string>();

    themes.forEach((theme) => {
      const slug = theme.slug;
      nodes.push({
        id: `theme-${slug}`,
        type: 'theme',
        label: lang === 'zh' ? (theme.name_zh ?? theme.nameZh) : (theme.name_en ?? theme.nameEn),
        icon: theme.icon || THEME_ICONS[slug] || '💡',
        color: '#b8860b',
        radius: 32,
      });

      const linkedThinkers = THEME_THINKER_LINKS[slug] ?? [];
      linkedThinkers.forEach((tSlug) => {
        if (!addedThinkers.has(tSlug)) {
          const info = THINKER_NAMES[tSlug];
          if (info) {
            nodes.push({
              id: `thinker-${tSlug}`,
              type: 'thinker',
              label: lang === 'zh' ? info.zh : info.en,
              color: TRADITION_COLORS[info.tradition] ?? '#666',
              radius: 22,
              tradition: info.tradition,
            });
            addedThinkers.add(tSlug);
          }
        }
        links.push({ source: `theme-${slug}`, target: `thinker-${tSlug}` });
      });
    });

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(120).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius((d) => d.radius + 10))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });
    svg.call(zoom);

    const g = svg.append('g');

    // Defs for patterns — only for thinkers with an emblem
    const defs = g.append('defs');
    addedThinkers.forEach((slug) => {
      if (!EMBLEMS.has(slug)) return;
      defs.append('pattern')
        .attr('id', `portrait-${slug}`)
        .attr('width', 1).attr('height', 1)
        .append('image')
        .attr('href', `/emblems/${slug}.jpg`)
        .attr('width', 44).attr('height', 44)
        .attr('preserveAspectRatio', 'xMidYMid slice');
    });

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', '#b8860b')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.2);

    // Draw nodes
    const node = g.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x; d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      );

    // Theme nodes: rounded rect with emoji
    const themeNodes = node.filter((d) => d.type === 'theme');
    themeNodes.append('rect')
      .attr('width', 64).attr('height', 64)
      .attr('x', -32).attr('y', -32)
      .attr('rx', 16).attr('ry', 16)
      .attr('fill', '#faf6f0')
      .attr('stroke', '#b8860b')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);
    themeNodes.append('text')
      .text((d) => d.icon ?? '💡')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 24)
      .attr('y', -2);
    themeNodes.append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('y', 50)
      .attr('font-size', 12)
      .attr('font-family', "'Crimson Pro', serif")
      .attr('font-weight', 600)
      .attr('fill', '#2c1810');

    // Thinker nodes: emblem, or a designed dark medallion for those without one
    const thinkerNodes = node.filter((d) => d.type === 'thinker');
    const slugOf = (d: GraphNode) => d.id.replace('thinker-', '');
    thinkerNodes.append('circle')
      .attr('r', 22)
      .attr('fill', (d) => (EMBLEMS.has(slugOf(d)) ? `url(#portrait-${slugOf(d)})` : '#241a12'))
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 2.5);
    // Serif initial for medallion (non-portrait) nodes
    thinkerNodes.filter((d) => !EMBLEMS.has(slugOf(d)))
      .append('text')
      .text((d) => (d.label ?? '?').trim().charAt(0))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', 18)
      .attr('font-family', "'Crimson Pro', serif")
      .attr('font-weight', 600)
      .attr('fill', '#c39a52');
    thinkerNodes.append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('y', 38)
      .attr('font-size', 11)
      .attr('font-family', "'Inter', sans-serif")
      .attr('fill', '#6d5a47');

    // Hover effects
    node.on('mouseenter', function (event, d) {
      setHoveredNode(d.id);

      // Highlight connected links
      link.attr('stroke-opacity', (l: any) => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        return srcId === d.id || tgtId === d.id ? 0.7 : 0.08;
      }).attr('stroke-width', (l: any) => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        return srcId === d.id || tgtId === d.id ? 2.5 : 1;
      });

      // Dim non-connected nodes
      const connectedIds = new Set<string>();
      connectedIds.add(d.id);
      links.forEach((l) => {
        const srcId = typeof l.source === 'object' ? (l.source as GraphNode).id : l.source as string;
        const tgtId = typeof l.target === 'object' ? (l.target as GraphNode).id : l.target as string;
        if (srcId === d.id) connectedIds.add(tgtId);
        if (tgtId === d.id) connectedIds.add(srcId);
      });
      node.attr('opacity', (n) => connectedIds.has(n.id) ? 1 : 0.25);
    });

    node.on('mouseleave', function () {
      setHoveredNode(null);
      link.attr('stroke-opacity', 0.2).attr('stroke-width', 1.5);
      node.attr('opacity', 1);
    });

    // Click handler
    node.on('click', function (event, d) {
      event.stopPropagation();
      if (d.type === 'theme') {
        setSelectedNode(d.id);
      } else {
        // Navigate to thinker page
        const slug = d.id.replace('thinker-', '');
        window.location.href = `/thinker/${slug}`;
      }
    });

    // Tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => { simulation.stop(); };
  }, [loading, themes, thinkers, lang]);

  // When a theme node is clicked, show its tags
  const selectedTheme = selectedNode
    ? themes.find((th) => `theme-${th.slug}` === selectedNode)
    : null;

  const handleTagClick = async (tag: any) => {
    if (selectedTag?.slug === (tag.slug ?? tag.id)) {
      setSelectedTag(null);
      setTagPassages([]);
      return;
    }
    setSelectedTag(tag);
    setLoadingPassages(true);
    try {
      const data = await api.searchByTag(tag.slug);
      setTagPassages(data.results);
    } catch {
      setTagPassages([]);
    } finally {
      setLoadingPassages(false);
    }
  };

  const closeTagView = () => {
    setSelectedTag(null);
    setTagPassages([]);
  };

  // Group passages by tradition
  const groupedPassages = tagPassages.reduce((acc, p) => {
    const tradition = p.tradition ?? 'other';
    if (!acc[tradition]) acc[tradition] = [];
    acc[tradition].push(p);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="animate-spin text-[var(--color-gold)]" size={32} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Tag passages detail view */}
      {selectedTag && (
        <div className="mb-8 animate-fade-in-up">
          <button
            onClick={closeTagView}
            className="text-sm text-[var(--color-ink-light)] hover:text-[var(--color-gold)] mb-4 inline-flex items-center gap-1"
          >
            <ArrowLeft size={14} /> {lang === 'zh' ? '返回主题' : 'Back to themes'}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-serif font-semibold text-[var(--color-ink)]">
              {lang === 'zh' ? selectedTag.name_zh ?? selectedTag.nameZh : selectedTag.name_en ?? selectedTag.nameEn}
            </h2>
            <button onClick={closeTagView} className="p-1 hover:bg-black/5 rounded">
              <X size={16} className="text-[var(--color-ink-light)]" />
            </button>
          </div>

          {loadingPassages ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[var(--color-gold)]" size={24} /></div>
          ) : tagPassages.length === 0 ? (
            <p className="text-center py-8 text-[var(--color-ink-light)]">
              {lang === 'zh' ? '暂无相关段落' : 'No related passages found yet'}
            </p>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedPassages).map(([tradition, passages]) => {
                const label = TRADITION_LABELS[tradition];
                return (
                  <div key={tradition}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: label?.color ?? '#666' }} />
                      <h3 className="font-semibold text-[var(--color-ink)]">
                        {lang === 'zh' ? label?.zh ?? tradition : label?.en ?? tradition}
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {(passages as any[]).map((p: any) => {
                        const thinkerName = lang === 'zh' ? p.thinker_name_zh : p.thinker_name_en;
                        const workTitle = lang === 'zh' ? p.work_title_zh : p.work_title_en;
                        const summary = lang === 'zh' ? p.summary_zh : p.summary_en;
                        return (
                          <div key={p.id} className="bg-white rounded-xl border border-[var(--color-parchment-dark)] p-5 animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-2 text-sm">
                              <span className="font-medium" style={{ color: label?.color ?? '#666' }}>{thinkerName}</span>
                              <span className="text-[var(--color-ink-light)]">·</span>
                              <Link to={`/work/${p.work_id}`} className="text-[var(--color-ink-light)] hover:text-[var(--color-gold)]">{workTitle}</Link>
                            </div>
                            <p className="font-serif text-[var(--color-ink)] leading-relaxed mb-1 italic">
                              {p.original_text?.substring(0, 150)}{p.original_text?.length > 150 ? '...' : ''}
                            </p>
                            <p className="text-sm text-[var(--color-ink)] leading-relaxed">
                              {p.english_text?.substring(0, 200)}{p.english_text?.length > 200 ? '...' : ''}
                            </p>
                            {summary && <p className="text-xs text-[var(--color-ink-light)] mt-2">💡 {summary}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main force graph view */}
      {!selectedTag && (
        <>
          <div className="mb-6 animate-fade-in-up">
            <h1 className="text-3xl font-serif font-semibold text-[var(--color-ink)] mb-2">{t('theme.explore')}</h1>
            <p className="text-[var(--color-ink-light)]">
              {lang === 'zh'
                ? '拖拽探索思想家与主题的关联，点击主题查看标签，点击思想家查看详情'
                : 'Drag to explore connections between thinkers and themes. Click to drill down.'}
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-4 text-xs text-[var(--color-ink-light)] animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="font-medium text-[var(--color-ink)]">{lang === 'zh' ? '传统：' : 'Traditions:'}</span>
            {Object.entries(TRADITION_LABELS).map(([key, val]) => (
              <span key={key} className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: val.color }} />
                {lang === 'zh' ? val.zh : val.en}
              </span>
            ))}
          </div>

          {/* Force Graph */}
          <div
            ref={containerRef}
            className="force-graph-container bg-white rounded-2xl border border-[var(--color-parchment-dark)] overflow-hidden shadow-sm relative animate-fade-in-scale"
            style={{ animationDelay: '0.15s' }}
          >
            <svg ref={svgRef} className="w-full" style={{ minHeight: 560 }} />

            {/* Zoom hint */}
            <div className="absolute bottom-3 right-3 flex gap-1.5 text-[var(--color-ink-light)]">
              <div className="bg-[var(--color-parchment)]/80 backdrop-blur-sm px-2 py-1 rounded text-[10px]">
                {lang === 'zh' ? '滚轮缩放 · 拖拽移动' : 'Scroll to zoom · Drag to pan'}
              </div>
            </div>
          </div>

          {/* Theme tags panel — shown when a theme node is clicked */}
          {selectedTheme && (
            <div className="mt-6 bg-white rounded-xl border border-[var(--color-parchment-dark)] p-5 animate-slide-down">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg text-[var(--color-ink)] flex items-center gap-2">
                  <span>{selectedTheme.icon}</span>
                  {lang === 'zh' ? (selectedTheme.name_zh ?? selectedTheme.nameZh) : (selectedTheme.name_en ?? selectedTheme.nameEn)}
                </h3>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 hover:bg-black/5 rounded"
                >
                  <X size={16} className="text-[var(--color-ink-light)]" />
                </button>
              </div>
              <p className="text-sm text-[var(--color-ink-light)] mb-4">{selectedTheme.description}</p>
              {selectedTheme.tags && (
                <div className="flex flex-wrap gap-2">
                  {selectedTheme.tags.map((tag: any) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag)}
                      className="px-3 py-1.5 rounded-full bg-[var(--color-parchment)] text-sm text-[var(--color-ink-light)] hover:bg-[var(--color-gold)]/10 hover:text-[var(--color-gold)] transition-colors cursor-pointer"
                    >
                      {lang === 'zh' ? tag.name_zh ?? tag.nameZh : tag.name_en ?? tag.nameEn}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
