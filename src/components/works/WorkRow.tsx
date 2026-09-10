import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { type Language } from '../../hooks/useLanguage';
import { type Work, SERVICE_FILTERS, copyLang, worksT, mediaCounts, countLabel, displayLeading } from './worksData';

interface WorkRowProps {
  work: Work;
  lang: Language;
  index: number;
  search: string;
  /** Rows above the fold skip lazy-loading so the first strip is not blank. */
  priority?: boolean;
}

/**
 * One full-bleed case study row: oversized client name, a marquee of the
 * services, and a horizontally scrollable strip of the actual deliverables.
 *
 * The reference layout (bikebear) uses a single 16:9 key visual per row, which
 * cannot work here — every asset we hold is 9:16 or square. The strip keeps the
 * full-bleed rhythm without cropping vertical video.
 */
export function WorkRow({ work, lang, index, search, priority = false }: WorkRowProps) {
  const cl = copyLang(lang);
  const t = worksT[lang];
  const { videos, images } = mediaCounts(work.media);
  const dark = index % 2 === 0;

  const services = work.services
    .map(id => SERVICE_FILTERS.find(s => s.id === id)?.label[lang])
    .filter(Boolean) as string[];

  // Enough repeats that the marquee never shows a gap on a wide screen
  const marquee = Array.from({ length: 4 }, () => services).flat();
  const strip = work.media.slice(0, 8);

  return (
    <section
      className={`relative overflow-hidden ${dark ? 'bg-brand-blue text-white' : 'bg-white text-brand-blue'}`}
    >
      {/* Header runs down the same centre axis as the hero handset */}
      <div className="px-4 sm:px-8 lg:px-12 pt-14 sm:pt-20 pb-10 sm:pb-14 flex flex-col items-center text-center">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-xs font-bold tabular-nums text-brand-cyan">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${dark ? 'text-white/40' : 'text-brand-blue/40'}`}>
            {work.industry[cl]}
          </span>
        </div>

        <Link to={`/works-v2/${work.slug}${search}`} className="group block max-w-5xl">
          <h2
            className={`font-black tracking-[-0.035em] uppercase ${displayLeading(work.client_name)}
                       text-[clamp(2.1rem,7.5vw,5.5rem)] group-hover:text-brand-cyan transition-colors duration-300`}
          >
            {work.client_name}
          </h2>
        </Link>

        <p className="mt-4 text-base sm:text-xl font-bold text-brand-cyan max-w-2xl">
          {work.highlight[cl]}
        </p>
      </div>

      {/* Service marquee */}
      <div
        className={`overflow-hidden border-y py-2.5 ${
          dark ? 'border-white/12' : 'border-brand-blue/10'
        }`}
      >
        <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
          {marquee.map((s, i) => (
            <span
              key={i}
              className={`text-xs sm:text-sm font-bold uppercase tracking-[0.2em] ${
                dark ? 'text-white/35' : 'text-brand-blue/35'
              }`}
            >
              {s}
              <span className="text-brand-cyan ml-8">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* Deliverables strip — real 9:16 / square assets, never cropped to landscape */}
      <div
        className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-8 lg:px-12 py-8
                   snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]
                   [&::-webkit-scrollbar]:hidden"
      >
        {strip.map((m, i) => (
          <Link
            key={m.src}
            to={`/works-v2/${work.slug}${search}`}
            className={`relative shrink-0 snap-start overflow-hidden rounded-lg ${
              m.type === 'video' ? 'aspect-9/16 w-32 sm:w-44' : 'aspect-4/5 w-32 sm:w-44'
            } ${dark ? 'bg-white/5' : 'bg-brand-blue/5'}`}
          >
            <img
              src={m.thumb}
              alt=""
              width={600}
              height={m.type === 'video' ? 1067 : 750}
              loading={priority && i < 5 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              onContextMenu={e => e.preventDefault()}
              className="w-full h-full object-cover select-none hover:scale-105 transition-transform duration-500"
            />
            {m.type === 'video' && m.duration != null && (
              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold tabular-nums">
                {Math.floor(m.duration / 60)}:{String(m.duration % 60).padStart(2, '0')}
              </span>
            )}
          </Link>
        ))}

        {work.media.length > strip.length && (
          <Link
            to={`/works-v2/${work.slug}${search}`}
            className={`shrink-0 snap-start w-32 sm:w-44 aspect-9/16 rounded-lg flex items-center justify-center
                        text-sm font-bold ${dark ? 'bg-white/5 text-white/60' : 'bg-brand-blue/5 text-brand-blue/60'}`}
          >
            +{work.media.length - strip.length}
          </Link>
        )}
      </div>

      {/* Footer: counts + CTA */}
      <div className="px-4 sm:px-8 lg:px-12 pb-14 sm:pb-20 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
        <p className={`text-sm font-medium ${dark ? 'text-white/45' : 'text-brand-blue/45'}`}>
          {[
            videos > 0 ? countLabel(videos, 'video', lang) : null,
            images > 0 ? countLabel(images, 'design', lang) : null,
          ].filter(Boolean).join('  ·  ')}
        </p>

        <Link
          to={`/works-v2/${work.slug}${search}`}
          className={`group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em]
                      border-b-2 pb-1 transition-colors ${
                        dark
                          ? 'border-white/25 hover:border-brand-cyan hover:text-brand-cyan'
                          : 'border-brand-blue/20 hover:border-brand-cyan hover:text-brand-cyan'
                      }`}
        >
          {t.viewCase}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
