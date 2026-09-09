import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { WorkGallery } from '../components/works/WorkGallery';
import { useLanguage } from '../hooks/useLanguage';
import {
  type Work, SERVICE_FILTERS, copyLang, worksT, WHATSAPP_URL, mediaCounts, countLabel,
} from '../components/works/worksData';

/** Editorial-layout counterpart to WorkDetail, paired with the /works-v2 prototype. */
export default function WorkDetailV2() {
  const { slug } = useParams<{ slug: string }>();
  const [lang, setLang] = useLanguage();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const t = worksT[lang];
  const cl = copyLang(lang);
  const backSearch = location.search;

  useEffect(() => {
    fetch('/works/works.json')
      .then(r => r.json())
      .then((d: Work[]) => { setWorks(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const work = works.find(w => w.slug === slug);
  const sorted = [...works].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex(w => w.slug === slug);
  const next = idx >= 0 ? sorted[(idx + 1) % sorted.length] : null;

  if (loading || !work) {
    return (
      <>
        <Navbar lang={lang} setLang={setLang} />
        <div className="min-h-screen bg-brand-blue pt-32 px-6">
          {!loading && (
            <Link to="/works-v2" className="text-brand-cyan font-bold inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> {t.backToWorks}
            </Link>
          )}
        </div>
      </>
    );
  }

  const { videos, images } = mediaCounts(work.media);
  const deliverables = work.deliverables[cl] ?? [];
  const hasChallenge = Boolean(work.challenge[cl]?.trim());

  return (
    <>
      <Helmet>
        <title>{`${work.client_name} — ${work.industry[cl]} | Cheaper Nexus`}</title>
        <meta name="description" content={work.summary[cl]} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar lang={lang} setLang={setLang} />

      <article className="bg-brand-blue text-white">
        {/* Masthead */}
        <header className="pt-28 pb-12 px-4 sm:px-8 lg:px-12 overflow-hidden">
          <Link
            to={`/works-v2${backSearch}`}
            className="inline-flex items-center gap-2 text-white/45 hover:text-brand-cyan transition-colors mb-8 text-xs font-bold uppercase tracking-[0.16em]"
          >
            <ArrowLeft className="w-4 h-4" /> {t.backToWorks}
          </Link>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-cyan mb-4">
            {work.industry[cl]}
          </p>

          <h1 className="font-black uppercase leading-[0.86] tracking-[-0.04em] text-[clamp(2.6rem,11vw,8rem)]">
            {work.client_name}
          </h1>

          <p className="mt-7 text-xl sm:text-3xl font-bold text-brand-cyan max-w-3xl leading-snug">
            {work.highlight[cl]}
          </p>

          <p className="mt-6 text-sm font-medium text-white/40">
            {[
              videos > 0 ? countLabel(videos, 'video', lang) : null,
              images > 0 ? countLabel(images, 'design', lang) : null,
            ].filter(Boolean).join('  ·  ')}
          </p>
        </header>

        {/* Service marquee */}
        <div className="overflow-hidden border-y border-white/12 py-3">
          <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
            {Array.from({ length: 6 }, () => work.services).flat().map((id, i) => {
              const f = SERVICE_FILTERS.find(s => s.id === id);
              return (
                <span key={i} className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/35">
                  {f?.label[lang]}
                  <span className="text-brand-cyan ml-8">◆</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Copy — two-column editorial */}
        <div className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-10 lg:gap-16">
          <div>
            <h2 className="font-black uppercase text-2xl sm:text-3xl tracking-[-0.02em] leading-tight">
              {t.overview}
            </h2>
          </div>
          <div className="space-y-10">
            <p className="text-lg sm:text-xl text-white/75 leading-relaxed">{work.summary[cl]}</p>

            {hasChallenge && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-cyan mb-3">{t.challenge}</h3>
                <p className="text-white/65 leading-relaxed">{work.challenge[cl]}</p>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-cyan mb-3">{t.approach}</h3>
              <p className="text-white/65 leading-relaxed">{work.approach[cl]}</p>
            </div>

            {deliverables.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-brand-cyan mb-4">{t.deliverables}</h3>
                <ul className="space-y-2.5">
                  {deliverables.map(d => (
                    <li key={d} className="flex items-start gap-3 text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-1" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Gallery on a light ground so the creative reads properly */}
        <section className="bg-white text-brand-blue px-4 sm:px-8 lg:px-12 py-16 sm:py-20">
          <h2 className="font-black uppercase text-2xl sm:text-3xl tracking-[-0.02em] mb-8">{t.gallery}</h2>
          <WorkGallery media={work.media} lang={lang} clientName={work.client_name} />
        </section>

        {/* Next */}
        {next && next.slug !== work.slug && (
          <Link
            to={`/works-v2/${next.slug}${backSearch}`}
            className="group block px-4 sm:px-8 lg:px-12 py-16 sm:py-20 border-t border-white/10 hover:bg-white/3 transition-colors"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35 mb-4">{t.nextCase}</p>
            <div className="flex items-center justify-between gap-6">
              <h2 className="font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(1.8rem,7vw,4.5rem)] group-hover:text-brand-cyan transition-colors">
                {next.client_name}
              </h2>
              <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 shrink-0 text-white/30 group-hover:text-brand-cyan group-hover:translate-x-2 transition-all" />
            </div>
          </Link>
        )}

        {/* CTA */}
        <section className="bg-brand-cyan text-brand-blue px-4 sm:px-8 lg:px-12 py-20 text-center">
          <h2 className="font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2rem,7vw,5rem)]">
            {t.ctaTitle}
          </h2>
          <p className="mt-5 text-brand-blue/70 font-medium">{t.ctaSub}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-9 py-4 bg-brand-blue text-white rounded-full font-bold hover:bg-brand-blue/90 transition-colors"
          >
            {t.ctaButton}
          </a>
        </section>
      </article>
    </>
  );
}
