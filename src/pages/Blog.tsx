import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, RefreshCw } from 'lucide-react';
import { BlogCard, type ArticleSummary } from '../components/BlogCard';
import { SEO } from '../components/SEO';

const LANG_TABS = [
  { id: 'all', label: '全部' },
  { id: 'zh',  label: '中文' },
  { id: 'en',  label: 'English' },
  { id: 'ms',  label: 'Bahasa' },
];

export default function Blog() {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading]   = useState(true);
  const [langFilter, setLangFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/blog/index.json')
      .then(r => r.json())
      .then((data: ArticleSummary[]) => { setArticles(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = articles.filter(a => {
    const matchLang = langFilter === 'all' || a.language === langFilter;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.topic.toLowerCase().includes(search.toLowerCase());
    return matchLang && matchSearch;
  });

  return (
    <>
      <SEO lang="zh" />
      <div className="min-h-screen bg-brand-white">
        {/* Header */}
        <div className="bg-brand-blue text-brand-white pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-white/60 hover:text-brand-white transition-colors mb-8 text-sm">
              <ArrowLeft className="w-4 h-4" /> 返回首页
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">营销知识库</h1>
            <p className="text-brand-white/60 text-lg max-w-xl">
              数码营销干货、SEO 技巧、社媒运营指南，助你的业务在马来西亚市场脱颖而出。
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="sticky top-0 z-20 bg-brand-white/90 backdrop-blur border-b border-brand-blue/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex gap-2">
              {LANG_TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setLangFilter(t.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    langFilter === t.id
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-xs sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-blue/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="搜索文章..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-brand-blue/5 rounded-full outline-none focus:ring-2 focus:ring-brand-cyan"
              />
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-32 text-brand-blue/40">
              <RefreshCw className="w-6 h-6 animate-spin mr-3" /> 加载中...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32 text-brand-blue/40">
              <p className="text-lg font-medium mb-2">暂无文章</p>
              <p className="text-sm">前往 <Link to="/admin" className="text-brand-cyan hover:underline">管理后台</Link> 生成你的第一篇 SEO 文章</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a: ArticleSummary) => <BlogCard key={a.id} article={a} />)}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-brand-blue/[0.03] border-t border-brand-blue/5 py-16">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-2xl font-bold text-brand-blue mb-3">需要专业的数码营销服务？</h2>
            <p className="text-brand-blue/60 mb-6">Cheaper Nexus 提供从内容创作到 Google SEO 的一站式服务。</p>
            <a
              href="https://wa.me/60182228688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-full font-bold hover:bg-brand-blue/90 transition-all"
            >
              WhatsApp 免费咨询
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
