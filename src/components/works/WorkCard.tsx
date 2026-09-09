import { Link } from 'react-router-dom';
import { ArrowUpRight, Play, ImageIcon } from 'lucide-react';
import { type Language } from '../../hooks/useLanguage';
import { type Work, SERVICE_FILTERS, copyLang, worksT, mediaCounts } from './worksData';

interface WorkCardProps {
  work: Work;
  lang: Language;
  /** Preserves the active filters so the browser Back button returns to the same view. */
  search: string;
  /** Above-the-fold cards load eagerly — lazy-loading the first one wrecks LCP. */
  priority?: boolean;
}

export function WorkCard({ work, lang, search, priority = false }: WorkCardProps) {
  const cl = copyLang(lang);
  const t = worksT[lang];
  const { videos: videoCount, images: imageCount } = mediaCounts(work.media);

  return (
    <Link
      to={`/works/${work.slug}${search}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-brand-blue/8 hover:border-brand-cyan/40 hover:shadow-lg hover:shadow-brand-blue/5 transition-all duration-300"
    >
      {/* Cover — fixed 4:5 box so the grid never shifts as images load */}
      <div className="relative aspect-4/5 overflow-hidden bg-brand-blue/5">
        <img
          src={work.cover_thumb}
          alt={work.client_name}
          width={600}
          height={750}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-blue/85 via-brand-blue/10 to-transparent" />

        {/* Media count chips */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {videoCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-[11px] font-semibold">
              <Play className="w-3 h-3 fill-current" /> {videoCount}
            </span>
          )}
          {imageCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-[11px] font-semibold">
              <ImageIcon className="w-3 h-3" /> {imageCount}
            </span>
          )}
        </div>

        {/* Headline angle — what makes this piece of work distinctive */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-bold leading-snug text-[15px] drop-shadow-sm">
            {work.highlight[cl]}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-brand-blue leading-snug group-hover:text-brand-cyan transition-colors">
            {work.client_name}
          </h3>
          <ArrowUpRight className="w-4 h-4 shrink-0 mt-0.5 text-brand-blue/25 group-hover:text-brand-cyan transition-colors" />
        </div>

        <p className="mt-1 text-xs font-medium text-brand-blue/45">{work.industry[cl]}</p>

        <p className="mt-3 text-sm text-brand-blue/65 leading-relaxed line-clamp-3">
          {work.summary[cl]}
        </p>

        <div className="mt-4 pt-3 border-t border-brand-blue/5 flex flex-wrap gap-1.5">
          {work.services.map(id => {
            const f = SERVICE_FILTERS.find(s => s.id === id);
            if (!f) return null;
            return (
              <span
                key={id}
                className="px-2 py-0.5 rounded-full bg-brand-cyan/8 text-brand-cyan text-[11px] font-semibold"
              >
                {f.label[lang]}
              </span>
            );
          })}
        </div>

        <span className="sr-only">{t.viewCase}</span>
      </div>
    </Link>
  );
}
