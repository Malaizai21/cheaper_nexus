import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { WorkCard } from '../components/works/WorkCard';
import { useLanguage } from '../hooks/useLanguage';
import { type Work, SERVICE_FILTERS, copyLang, worksT, WHATSAPP_URL } from '../components/works/worksData';

const SITE_URL = 'https://cheapernexus.com';

export default function Works() {
  const [lang, setLang] = useLanguage();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();

  const t = worksT[lang];
  const cl = copyLang(lang);

  useEffect(() => {
    fetch('/works/works.json')
      .then(r => r.json())
      .then((data: Work[]) => { setWorks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const activeServices = params.getAll('service');
  const activeIndustries = params.getAll('industry');

  /** Industry options come from the data, so a new case study needs no code change. */
  const industries = useMemo(() => {
    const seen = new Map<string, string>();
    for (const w of works) if (!seen.has(w.industry.en)) seen.set(w.industry.en, w.industry[cl]);
    return [...seen.entries()].map(([id, label]) => ({ id, label }));
  }, [works, cl]);

  const filtered = useMemo(
    () => works
      .filter(w => !activeServices.length || w.services.some(s => activeServices.includes(s)))
      .filter(w => !activeIndustries.length || activeIndustries.includes(w.industry.en))
      .sort((a, b) => a.order - b.order),
    [works, activeServices.join(), activeIndustries.join()],
  );

  const toggle = (key: 'service' | 'industry', value: string) => {
    const next = new URLSearchParams(params);
    const current = next.getAll(key);
    next.delete(key);
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    updated.forEach(v => next.append(key, v));
    setParams(next, { replace: true });
  };

  const hasFilters = activeServices.length > 0 || activeIndustries.length > 0;
  const canonical = `${SITE_URL}/works`;

  return (
    <>
      <Helmet>
        <html lang={lang === 'zh' ? 'zh-MY' : lang === 'ms' ? 'ms-MY' : 'en-MY'} />
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t.metaTitle} />
        <meta property="og:description" content={t.metaDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:site_name" content="Cheaper Nexus" />
        <link rel="alternate" hrefLang="zh-MY" href={canonical} />
        <link rel="alternate" hrefLang="en-MY" href={canonical} />
        <link rel="alternate" hrefLang="ms-MY" href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t.metaTitle,
            description: t.metaDesc,
            url: canonical,
            hasPart: works.map(w => ({
              '@type': 'CreativeWork',
              name: `${w.client_name} — ${w.industry.en}`,
              url: `${SITE_URL}/works/${w.slug}`,
              creator: { '@type': 'Organization', name: 'Cheaper Nexus' },
            })),
          })}
        </script>
      </Helmet>

      <Navbar lang={lang} setLang={setLang} />

      <div className="min-h-screen bg-brand-white">
        {/* Hero */}
        <header className="bg-brand-blue text-brand-white pt-28 pb-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-brand-white/50 hover:text-brand-white transition-colors mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" /> {lang === 'zh' ? '返回首页' : lang === 'ms' ? 'Laman Utama' : 'Home'}
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{t.heroTitle}</h1>
            <p className="text-brand-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">{t.heroSub}</p>
          </div>
        </header>

        {/* Filters */}
        <div className="sticky top-20 z-30 bg-brand-white/95 backdrop-blur-sm border-b border-brand-blue/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue/40 uppercase tracking-wide shrink-0">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {t.filterService}
              </span>
              {SERVICE_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggle('service', f.id)}
                  aria-pressed={activeServices.includes(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeServices.includes(f.id)
                      ? 'bg-brand-blue text-white'
                      : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10'
                  }`}
                >
                  {f.label[lang]}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-brand-blue/40 uppercase tracking-wide shrink-0">
                {t.filterIndustry}
              </span>
              {industries.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggle('industry', f.id)}
                  aria-pressed={activeIndustries.includes(f.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeIndustries.includes(f.id)
                      ? 'bg-brand-cyan text-brand-blue'
                      : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-brand-blue/45 font-medium">{t.resultCount(filtered.length)}</span>
              {hasFilters && (
                <button
                  onClick={() => setParams(new URLSearchParams(), { replace: true })}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-cyan hover:underline"
                >
                  <X className="w-3 h-3" /> {t.clearFilters}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-brand-blue/8 overflow-hidden">
                  <div className="aspect-4/5 bg-brand-blue/5 animate-pulse" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 w-2/3 bg-brand-blue/5 rounded animate-pulse" />
                    <div className="h-3 w-1/3 bg-brand-blue/5 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-brand-blue/50">{t.empty}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(w => (
                <WorkCard key={w.slug} work={w} lang={lang} search={params.toString() ? `?${params}` : ''} />
              ))}
            </div>
          )}
        </main>

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
      </div>
    </>
  );
}
