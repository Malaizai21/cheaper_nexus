import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { marked } from 'marked';
import { ArrowLeft, Calendar, BookOpen, Tag } from 'lucide-react';

const SITE_URL = 'https://cheapernexus.com';

type Article = {
  id: number;
  slug: string;
  language: string;
  title: string;
  meta_description: string;
  keywords: string;
  content: string;
  writing_style: string;
  featured_image_prompt: string;
  image_url?: string;
  word_count: number;
  topic: string;
  created_at: string;
};

marked.setOptions({ gfm: true, breaks: true });

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/blog/${slug}.json`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then(data => { if (data) { setArticle(data); setLoading(false); } })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (article) {
      document.title = article.title;
    }
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center">
        <div className="text-brand-blue/40 animate-pulse text-lg">加载中...</div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-brand-white flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-brand-blue mb-4">文章不存在</h1>
        <Link to="/blog" className="text-brand-cyan hover:underline">← 返回博客列表</Link>
      </div>
    );
  }

  const keywords: string[] = Array.isArray(article.keywords) ? article.keywords : JSON.parse(article.keywords || '[]');
  const date = new Date(article.created_at).toLocaleDateString('zh-MY', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const html = marked.parse(article.content) as string;
  const canonicalUrl = `${SITE_URL}/blog/${article.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.meta_description,
    image: article.image_url ? (article.image_url.startsWith('http') ? article.image_url : `${SITE_URL}${article.image_url}`) : `${SITE_URL}/logo.png`,
    datePublished: article.created_at,
    dateModified: article.created_at,
    author: { '@type': 'Organization', name: 'Cheaper Nexus', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Cheaper Nexus',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    url: canonicalUrl,
    inLanguage: article.language === 'zh' ? 'zh-MY' : article.language === 'ms' ? 'ms-MY' : 'en-MY',
    keywords: keywords.join(', '),
    wordCount: article.word_count,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  };

  return (
    <div className="min-h-screen bg-brand-white">
      <Helmet>
        <title>{article.title} | Cheaper Nexus</title>
        <meta name="description" content={article.meta_description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.meta_description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Cheaper Nexus" />
        {article.image_url && (
          <meta property="og:image" content={article.image_url.startsWith('http') ? article.image_url : `${SITE_URL}${article.image_url}`} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.meta_description} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      {/* Back nav */}
      <div className="sticky top-0 z-20 bg-brand-white/90 backdrop-blur border-b border-brand-blue/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-brand-blue/60 hover:text-brand-blue transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> 营销知识库
          </Link>
        </div>
      </div>

      {/* Featured image */}
      {article.image_url && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-64 md:h-80 object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Article header */}
      <header className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {keywords.slice(0, 4).map(kw => (
            <span key={kw} className="inline-flex items-center gap-1 px-3 py-1 bg-brand-cyan/10 text-brand-cyan rounded-full text-xs font-semibold">
              <Tag className="w-3 h-3" /> {kw}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-brand-blue leading-tight mb-6">
          {article.title}
        </h1>
        <p className="text-brand-blue/60 text-lg leading-relaxed mb-8">{article.meta_description}</p>
        <div className="flex flex-wrap items-center gap-6 text-sm text-brand-blue/40 pb-8 border-b border-brand-blue/5">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {date}</span>
          <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {article.word_count.toLocaleString()} 字</span>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-blue/5 text-brand-blue/60 font-semibold">
            {{ zh: '中文', en: 'English', ms: 'Bahasa' }[article.language] ?? article.language}
          </span>
        </div>
      </header>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div
          className="prose-article"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {/* CTA footer */}
      <div className="bg-brand-blue text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h2 className="text-2xl font-bold mb-3">准备好把文章里的策略付诸实践了吗？</h2>
          <p className="text-white/60 mb-6">Cheaper Nexus 提供 Google SEO、Meta 广告、社媒管理等一站式服务。</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/60182228688"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-brand-cyan text-brand-blue rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              WhatsApp Calvin
            </a>
            <Link to="/blog" className="px-8 py-3 border-2 border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-all">
              更多文章
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
