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

const SITE_URL = 'https://cheapernexus.com';

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [lang, setLang] = useLanguage();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const t = worksT[lang];
  const cl = copyLang(lang);

  /** Filters live in the URL, so carrying the query string back restores the list view. */
  const backSearch = location.search;

  useEffect(() => {
    fetch('/works/works.json')
      .then(r => r.json())
      .then((data: Work[]) => { setWorks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const work = works.find(w => w.slug === slug);
  const sorted = [...works].sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex(w => w.slug === slug);
  const next = idx >= 0 ? sorted[(idx + 1) % sorted.length] : null;

  if (loading) {
    return (
      <>
        <Navbar lang={lang} setLang={setLang} />
        <div className="min-h-screen bg-brand-white pt-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
            <div className="h-8 w-1/2 bg-brand-blue/5 rounded animate-pulse" />
            <div className="aspect-16/9 bg-brand-blue/5 rounded-2xl animate-pulse" />
          </div>
        </div>
      </>
    );
  }

  if (!work) {
    return (
      <>
        <Navbar lang={lang} setLang={setLang} />
        <div className="min-h-screen bg-brand-white pt-32 text-center px-4">
          <p className="text-brand-blue/50 mb-6">404 — {t.empty}</p>
          <Link to="/works" className="inline-flex items-center gap-2 text-brand-cyan font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> {t.backToWorks}
          </Link>
        </div>
      </>
    );
  }

  const canonical = `${SITE_URL}/works/${work.slug}`;
  const title = `${work.client_name} — ${work.industry[cl]} | Cheaper Nexus`;
  const hasChallenge = Boolean(work.challenge[cl]?.trim());
  const deliverables = work.deliverables[cl] ?? [];
  const { videos, images } = mediaCounts(work.media);

  return (
    <>
      <Helmet>
        <html lang={lang === 'zh' ? 'zh-MY' : lang === 'ms' ? 'ms-MY' : 'en-MY'} />
        <title>{title}</title>
        <meta name="description" content={work.summary[cl]} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={work.summary[cl]} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE_URL}${work.cover_image}`} />
        <meta property="og:site_name" content="Cheaper Nexus" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="alternate" hrefLang="zh-MY" href={canonical} />
        <link rel="alternate" hrefLang="en-MY" href={canonical} />
        <link rel="alternate" hrefLang="ms-MY" href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: `${work.client_name} — ${work.industry.en}`,
            headline: work.client_name,
            description: work.summary.en,
            url: canonical,
            image: `${SITE_URL}${work.cover_image}`,
            inLanguage: ['zh-MY', 'en-MY'],
            creator: {
              '@type': 'Organization',
              name: 'Cheaper Nexus',
              url: SITE_URL,
              telephone: '+60172915754',
            },
            about: { '@type': 'Thing', name: work.industry.en },
            keywords: work.services
              .map(s => SERVICE_FILTERS.find(f => f.id === s)?.label.en)
              .filter(Boolean)
              .join(', '),
          })}
        </script>
      </Helmet>

      <Navbar lang={lang} setLang={setLang} />

      <article className="min-h-screen bg-brand-white">
        {/* Header */}
        <header className="bg-brand-blue text-brand-white pt-28 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Link
              to={`/works${backSearch}`}
              className="inline-flex items-center gap-2 text-brand-white/50 hover:text-brand-white transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {t.backToWorks}
            </Link>

            <p className="text-brand-cyan text-sm font-semibold mb-2">{work.industry[cl]}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5">{work.client_name}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {work.services.map(id => {
                const f = SERVICE_FILTERS.find(s => s.id === id);
                return f ? (
                  <span key={id} className="px-3 py-1 rounded-full bg-white/10 text-white/85 text-xs font-semibold">
                    {f.label[lang]}
                  </span>
                ) : null;
              })}
            </div>

            <p className="text-xl sm:text-2xl font-bold text-brand-cyan leading-snug mb-3">
              {work.highlight[cl]}
            </p>

            <p className="text-white/50 text-sm font-medium">
              {[
                videos > 0 ? countLabel(videos, 'video', lang) : null,
                images > 0 ? countLabel(images, 'design', lang) : null,
              ].filter(Boolean).join(' · ')}
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-14">
          {/* Overview */}
          <section>
            <h2 className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider mb-3">{t.overview}</h2>
            <p className="text-lg text-brand-blue/75 leading-relaxed">{work.summary[cl]}</p>
          </section>

          {/* Challenge — only when the client has supplied one */}
          {hasChallenge && (
            <section>
              <h2 className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider mb-3">{t.challenge}</h2>
              <p className="text-brand-blue/70 leading-relaxed">{work.challenge[cl]}</p>
            </section>
          )}

          {/* Approach */}
          <section>
            <h2 className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider mb-3">{t.approach}</h2>
            <p className="text-brand-blue/70 leading-relaxed mb-6">{work.approach[cl]}</p>

            {deliverables.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-brand-blue mb-3">{t.deliverables}</h3>
                <ul className="space-y-2">
                  {deliverables.map(d => (
                    <li key={d} className="flex items-start gap-2.5 text-sm text-brand-blue/70">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>

          {/* Gallery */}
          <section>
            <h2 className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider mb-4">{t.gallery}</h2>
            <WorkGallery media={work.media} lang={lang} clientName={work.client_name} />
          </section>

          {/* Next case */}
          {next && next.slug !== work.slug && (
            <section className="pt-4 border-t border-brand-blue/8">
              <p className="text-xs font-bold text-brand-blue/40 uppercase tracking-wider mb-3">{t.nextCase}</p>
              <Link
                to={`/works/${next.slug}${backSearch}`}
                className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-brand-blue/3 transition-colors"
              >
                <img
                  src={next.cover_image}
                  alt={next.client_name}
                  width={160}
                  height={200}
                  loading="lazy"
                  decoding="async"
                  className="w-16 h-20 object-cover rounded-xl shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-bold text-brand-blue group-hover:text-brand-cyan transition-colors truncate">
                    {next.client_name}
                  </p>
                  <p className="text-sm text-brand-blue/45 truncate">{next.industry[cl]}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-brand-blue/25 group-hover:text-brand-cyan group-hover:translate-x-1 transition-all ml-auto shrink-0" />
              </Link>
            </section>
          )}
        </div>

        {/* CTA */}
        <section className="bg-brand-blue text-brand-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t.ctaTitle}</h2>
            <p className="text-brand-white/60 mb-7">{t.ctaSub}</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-cyan text-brand-blue rounded-full font-bold hover:bg-brand-cyan/90 transition-colors"
            >
              {t.ctaButton}
            </a>
          </div>
        </section>
      </article>
    </>
  );
}
