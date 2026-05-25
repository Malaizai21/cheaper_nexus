import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';

export type ArticleSummary = {
  id: number;
  slug: string;
  language: string;
  title: string;
  meta_description: string;
  keywords: string;
  word_count: number;
  writing_style: string;
  topic: string;
  created_at: string;
};

const LANG_BADGES: Record<string, { label: string; color: string }> = {
  zh: { label: '中文', color: 'bg-red-100 text-red-700' },
  en: { label: 'EN', color: 'bg-blue-100 text-blue-700' },
  ms: { label: 'BM', color: 'bg-green-100 text-green-700' },
};

const STYLE_LABELS: Record<string, string> = {
  professional: '专业', friendly: '友好', educational: '教育',
  sales: '销售', storytelling: '故事', trend: '趋势',
};

export function BlogCard({ article }: { article: ArticleSummary }) {
  const badge = LANG_BADGES[article.language] ?? LANG_BADGES.en;
  const date = new Date(article.created_at).toLocaleDateString('zh-MY', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group flex flex-col h-full p-8 bg-white rounded-[28px] border border-brand-blue/5 hover:border-brand-cyan/30 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${badge.color}`}>
          {badge.label}
        </span>
        {article.writing_style && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-cyan/10 text-brand-cyan">
            {STYLE_LABELS[article.writing_style] ?? article.writing_style}
          </span>
        )}
        <span className="ml-auto text-xs text-brand-blue/40">{date}</span>
      </div>

      <h3 className="text-lg font-bold text-brand-blue mb-3 leading-snug group-hover:text-brand-cyan transition-colors line-clamp-2">
        {article.title}
      </h3>

      <p className="text-sm text-brand-blue/60 leading-relaxed flex-grow line-clamp-3">
        {article.meta_description}
      </p>

      <div className="flex items-center justify-between mt-6 pt-5 border-t border-brand-blue/5">
        <div className="flex items-center gap-1.5 text-xs text-brand-blue/40">
          <Globe className="w-3.5 h-3.5" />
          {article.word_count.toLocaleString()} words
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-brand-cyan group-hover:gap-2 transition-all">
          阅读全文 <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
