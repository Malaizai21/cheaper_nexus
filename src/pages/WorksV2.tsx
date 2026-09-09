import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { X } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { WorkRow } from '../components/works/WorkRow';
import { useLanguage } from '../hooks/useLanguage';
import { type Work, SERVICE_FILTERS, copyLang, worksT, WHATSAPP_URL } from '../components/works/worksData';

/**
 * Editorial layout prototype for /works — full-bleed rows instead of a card
 * grid. Lives alongside the current /works so both can be compared before
 * either is retired. Not linked from the navbar and not in the sitemap.
 */
export default function WorksV2() {
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
  const search = params.toString() ? `?${params}` : '';

  return (
    <>
      <Helmet>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        {/* Prototype route — keep it out of the index while both layouts exist */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Navbar lang={lang} setLang={setLang} />

      <div className="min-h-screen bg-brand-blue">
        {/* Hero — oversized type, marquee, flat brand ground */}
        <header className="bg-brand-blue text-white pt-28 pb-10 overflow-hidden">
          <div className="px-4 sm:px-8 lg:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-cyan mb-5">
              {lang === 'zh' ? '客户作品' : lang === 'ms' ? 'Kerja Kami' : 'Our Work'}
            </p>
            <h1 className="font-black uppercase leading-[0.85] tracking-[-0.04em] text-[clamp(3rem,13vw,10rem)]">
              {lang === 'zh' ? '我们做过' : 'WORK WE'}
              <br />
              <span className="text-brand-cyan">{lang === 'zh' ? '的作品' : 'DELIVERED'}</span>
            </h1>
            <p className="mt-7 max-w-xl text-white/55 text-base sm:text-lg leading-relaxed">
              {t.heroSub}
            </p>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-brand-blue border-y border-white/10">
          <div className="px-4 sm:px-8 lg:px-12 py-5 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 shrink-0 mr-1">
                {t.filterService}
              </span>
              {SERVICE_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggle('service', f.id)}
                  aria-pressed={activeServices.includes(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeServices.includes(f.id)
                      ? 'bg-brand-cyan text-brand-blue'
                      : 'bg-white/8 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {f.label[lang]}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 shrink-0 mr-1">
                {t.filterIndustry}
              </span>
              {industries.map(f => (
                <button
                  key={f.id}
                  onClick={() => toggle('industry', f.id)}
                  aria-pressed={activeIndustries.includes(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeIndustries.includes(f.id)
                      ? 'bg-white text-brand-blue'
                      : 'bg-white/8 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-0.5">
              <span className="text-xs text-white/40 font-medium">{t.resultCount(filtered.length)}</span>
              {hasFilters && (
                <button
                  onClick={() => setParams(new URLSearchParams(), { replace: true })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-cyan hover:underline"
                >
                  <X className="w-3 h-3" /> {t.clearFilters}
                </button>
              )}
            </div>
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
