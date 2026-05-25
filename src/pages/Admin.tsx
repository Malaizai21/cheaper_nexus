import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Trash2, ExternalLink, RefreshCw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { marked } from 'marked';
import type { ArticleSummary } from '../components/BlogCard';

type Style = { id: string; label: string; labelZh: string; labelMs: string; icon: string };
type KeywordData = { primary_keyword: string; secondary_keywords: string[]; long_tail_keywords: string[]; search_intent: string; difficulty: string; content_angle: string; suggested_title: string };
type GeneratedArticle = { id: number; slug: string; title: string; meta_description: string; content: string; word_count: number; keywords: string[]; featured_image_prompt: string };

const LANGUAGES = [
  { id: 'zh', label: '中文', flag: '🇨🇳' },
  { id: 'en', label: 'English', flag: '🇲🇾' },
  { id: 'ms', label: 'Bahasa Melayu', flag: '🇲🇾' },
];

const DIFF_COLORS: Record<string, string> = { low: 'text-green-600 bg-green-50', medium: 'text-yellow-600 bg-yellow-50', high: 'text-red-600 bg-red-50' };

marked.setOptions({ gfm: true, breaks: true });

export default function Admin() {
  const [styles, setStyles]           = useState<Style[]>([]);
  const [articles, setArticles]       = useState<ArticleSummary[]>([]);
  const [topic, setTopic]             = useState('');
  const [language, setLanguage]       = useState('zh');
  const [styleId, setStyleId]         = useState('professional');
  const [keywords, setKeywords]       = useState<KeywordData | null>(null);
  const [generated, setGenerated]     = useState<GeneratedArticle | null>(null);
  const [step, setStep]               = useState<'idle' | 'researching' | 'generating' | 'done' | 'error'>('idle');
  const [statusMsg, setStatusMsg]     = useState('');
  const [previewTab, setPreviewTab]   = useState<'preview' | 'raw'>('preview');
  const [deleting, setDeleting]       = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/styles').then(r => r.json()).then(setStyles);
    loadArticles();
  }, []);

  function loadArticles() {
    fetch('/api/articles').then(r => r.json()).then(setArticles);
  }

  async function handleGenerate() {
    if (!topic.trim()) return;
    setStep('researching');
    setStatusMsg('🔍 正在研究关键词...');
    setKeywords(null);
    setGenerated(null);

    try {
      const kwRes = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language }),
      });
      const kwData: KeywordData = await kwRes.json();
      setKeywords(kwData);

      setStep('generating');
      setStatusMsg('✍️ 正在生成 SEO 文章（约 30-60 秒）...');

      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, language, writingStyle: styleId }),
      });
      const genData: GeneratedArticle = await genRes.json();
      if ((genData as any).error) throw new Error((genData as any).error);

      setGenerated(genData);
      setStep('done');
      setStatusMsg('');
      loadArticles();
    } catch (err) {
      setStep('error');
      setStatusMsg(String(err));
    }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    setDeleting(null);
    loadArticles();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Top bar */}
      <div className="bg-brand-blue text-white px-4 sm:px-6 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> 返回网站
        </Link>
        <span className="text-white/20">|</span>
        <span className="font-bold">SEO 内容后台</span>
        <Link to="/blog" className="ml-auto flex items-center gap-1 text-brand-cyan text-sm font-semibold hover:opacity-80">
          查看博客 <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-8">
        {/* ── LEFT: Generator Form ── */}
        <div className="space-y-6">
          {/* Topic */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-blue/5">
            <label className="block text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-3">
              主题 / Topic
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              rows={3}
              placeholder="例如：马来西亚中小企业如何用 TikTok 增加销售额"
              className="w-full px-4 py-3 text-sm bg-brand-blue/5 rounded-2xl outline-none resize-none focus:ring-2 focus:ring-brand-cyan text-brand-blue placeholder-brand-blue/30"
            />
          </div>

          {/* Language */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-blue/5">
            <label className="block text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-3">语言</label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map(l => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    language === l.id
                      ? 'bg-brand-blue text-white shadow'
                      : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10'
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Writing Style */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-blue/5">
            <label className="block text-xs font-bold text-brand-blue/40 uppercase tracking-widest mb-3">写作风格</label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyleId(s.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                    styleId === s.id
                      ? 'bg-brand-blue text-white shadow'
                      : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.labelZh}</span>
                  {styleId === s.id && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim() || step === 'researching' || step === 'generating'}
            className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-brand-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-blue/20"
          >
            {(step === 'researching' || step === 'generating') ? (
              <><RefreshCw className="w-5 h-5 animate-spin" /> {statusMsg}</>
            ) : (
              <><Sparkles className="w-5 h-5" /> 生成 SEO 文章</>
            )}
          </button>

          {step === 'error' && (
            <div className="p-4 bg-red-50 rounded-2xl text-red-600 text-sm">{statusMsg}</div>
          )}

          {/* Keyword Research Result */}
          {keywords && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-blue/5 space-y-4">
              <h3 className="font-bold text-brand-blue flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> 关键词研究完成
              </h3>
              <div>
                <span className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider">主关键词</span>
                <p className="mt-1 font-semibold text-brand-cyan">{keywords.primary_keyword}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider">次关键词</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {keywords.secondary_keywords.map(k => (
                    <span key={k} className="px-2 py-0.5 bg-brand-blue/5 text-brand-blue rounded-full text-xs">{k}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider">难度</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${DIFF_COLORS[keywords.difficulty] ?? 'text-brand-blue/60 bg-brand-blue/5'}`}>
                  {keywords.difficulty}
                </span>
                <span className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider">意图</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-600">{keywords.search_intent}</span>
              </div>
              <div>
                <span className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider">内容角度</span>
                <p className="mt-1 text-sm text-brand-blue/70">{keywords.content_angle}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Preview + Article List ── */}
        <div className="space-y-6">
          {/* Generated Article Preview */}
          {generated && (
            <div className="bg-white rounded-3xl shadow-sm border border-brand-blue/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-brand-blue/5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-bold text-green-600">文章已生成并保存</span>
                  </div>
                  <h2 className="text-lg font-bold text-brand-blue leading-snug">{generated.title}</h2>
                </div>
                <Link
                  to={`/blog/${generated.slug}`}
                  target="_blank"
                  className="flex items-center gap-1 px-4 py-2 bg-brand-cyan/10 text-brand-cyan rounded-xl text-sm font-bold hover:bg-brand-cyan/20 transition-colors whitespace-nowrap ml-4"
                >
                  查看文章 <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="px-6 pt-4 pb-2 border-b border-brand-blue/5">
                <p className="text-sm text-brand-blue/60 mb-3">{generated.meta_description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {generated.keywords?.map(k => (
                    <span key={k} className="px-2.5 py-0.5 bg-brand-cyan/10 text-brand-cyan rounded-full text-xs font-semibold">{k}</span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 px-6 pt-4">
                {(['preview', 'raw'] as const).map(t => (
                  <button key={t} onClick={() => setPreviewTab(t)}
                    className={`pb-2 text-sm font-semibold border-b-2 transition-colors ${previewTab === t ? 'border-brand-cyan text-brand-cyan' : 'border-transparent text-brand-blue/40 hover:text-brand-blue'}`}
                  >
                    {t === 'preview' ? '渲染预览' : 'Markdown 源码'}
                  </button>
                ))}
              </div>

              <div className="px-6 pb-6 max-h-[600px] overflow-y-auto">
                {previewTab === 'preview' ? (
                  <div className="prose-article pt-4" dangerouslySetInnerHTML={{ __html: marked.parse(generated.content) as string }} />
                ) : (
                  <pre className="text-xs text-brand-blue/70 whitespace-pre-wrap font-mono pt-4 leading-relaxed">{generated.content}</pre>
                )}
              </div>

              {generated.featured_image_prompt && (
                <div className="mx-6 mb-6 p-4 bg-brand-blue/5 rounded-2xl">
                  <span className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider block mb-1">图片生成提示词</span>
                  <p className="text-sm text-brand-blue/60 italic">{generated.featured_image_prompt}</p>
                </div>
              )}
            </div>
          )}

          {/* Articles List */}
          <div className="bg-white rounded-3xl shadow-sm border border-brand-blue/5 overflow-hidden">
            <div className="px-6 py-5 border-b border-brand-blue/5 flex items-center justify-between">
              <h3 className="font-bold text-brand-blue">已发布文章 ({articles.length})</h3>
              <button onClick={loadArticles} className="p-1.5 hover:bg-brand-blue/5 rounded-lg transition-colors">
                <RefreshCw className="w-4 h-4 text-brand-blue/40" />
              </button>
            </div>

            {articles.length === 0 ? (
              <div className="py-12 text-center text-brand-blue/40 text-sm">
                还没有文章。在左侧输入主题开始生成！
              </div>
            ) : (
              <ul className="divide-y divide-brand-blue/5">
                {articles.map(a => (
                  <li key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-blue/[0.02] transition-colors group">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      a.language === 'zh' ? 'bg-red-100 text-red-600' : a.language === 'en' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {a.language.toUpperCase()}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-brand-blue truncate">{a.title}</p>
                      <p className="text-xs text-brand-blue/40 mt-0.5">
                        {new Date(a.created_at).toLocaleDateString('zh-MY')} · {a.word_count.toLocaleString()} 字 · /{a.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link to={`/blog/${a.slug}`} target="_blank"
                        className="p-1.5 rounded-lg hover:bg-brand-cyan/10 text-brand-cyan transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(a.id)}
                        disabled={deleting === a.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50">
                        {deleting === a.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
