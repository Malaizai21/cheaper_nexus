import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Navbar } from '../components/Navbar';
import { WorkRow } from '../components/works/WorkRow';
import { HeroPhone } from '../components/works/HeroPhone';
import { WorkFilters } from '../components/works/WorkFilters';
import { useLanguage } from '../hooks/useLanguage';
import { type Work, copyLang, worksT, WHATSAPP_URL, displayLeading } from '../components/works/worksData';

const SITE_URL = 'https://cheapernexus.com';

/**
 * Client work index — full-bleed rows down a centre axis, led by a handset
 * cycling the reel. Everything here is vertical social content, so the phone
 * is how the work is actually seen rather than decoration.
 */
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

  const search = params.toString() ? `?${params}` : '';
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

      <div className="min-h-screen bg-brand-blue">
        {/* Hero — centred: label, headline, then the handset directly beneath,
            so the eye runs straight down the middle into the work. */}
        <header className="bg-brand-blue text-white pt-28 pb-16 overflow-hidden">
          <div className="px-4 sm:px-8 lg:px-12 flex flex-col items-center text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-cyan mb-6">
              {lang === 'zh' ? '客户作品' : lang === 'ms' ? 'Kerja Kami' : 'Our Work'}
            </p>

            <h1
              className={`font-black uppercase tracking-[-0.04em] text-[clamp(2.6rem,9vw,7rem)] max-w-5xl ${
                displayLeading(lang === 'zh' ? '我们做过' : 'WORK WE')
              }`}
            >
              {lang === 'zh' ? '我们做过' : 'WORK WE'}
              <br />
              <span className="text-brand-cyan">{lang === 'zh' ? '的作品' : 'DELIVERED'}</span>
            </h1>

            <p className="mt-6 max-w-lg text-white/50 text-sm sm:text-base leading-relaxed">
              {t.heroSub}
            </p>

            <div className="mt-12">
              <HeroPhone works={works} lang={lang} />
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-brand-blue border-y border-white/10">
          <div className="px-4 sm:px-8 lg:px-12 py-5">
            <WorkFilters
              variant="dark"
              lang={lang}
              industries={industries}
              activeServices={activeServices}
              activeIndustries={activeIndustries}
              onToggle={toggle}
              onClear={() => setParams(new URLSearchParams(), { replace: true })}
              count={filtered.length}
            />
          </div>
        </div>

        {/* Rows */}
        <main>
          {loading ? (
            <div className="h-[60vh] bg-brand-blue" />
          ) : filtered.length === 0 ? (
            <div className="py-28 text-center bg-white">
              <p className="text-brand-blue/50">{t.empty}</p>
            </div>
          ) : (
            filtered.map((w, i) => (
              <WorkRow key={w.slug} work={w} lang={lang} index={i} search={search} priority={i === 0} />
            ))
          )}
        </main>

        {/* CTA */}
        <section className="bg-brand-cyan text-brand-blue">
          <div className="px-4 sm:px-8 lg:px-12 py-20 text-center">
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
          </div>
        </section>
      </div>
    </>
  );
}
