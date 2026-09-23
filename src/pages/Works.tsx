import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageCircle } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { WorkRow } from '../components/works/WorkRow';
import { HeroPhone } from '../components/works/HeroPhone';
import { WorkFilters } from '../components/works/WorkFilters';
import { ProofBar, WorksPricing, WorksProcess, WorksFaq, StickyCta } from '../components/works/WorksOffer';
import { useLanguage } from '../hooks/useLanguage';
import { type Work, copyLang, worksT, WHATSAPP_URL, displayLeading } from '../components/works/worksData';
import { offerT, waLink, waGeneral } from '../components/works/offerData';

const SITE_URL = 'https://cheapernexus.com';

/**
 * Client work + pricing on one page.
 *
 * This is the landing page paid traffic hits, so the offer and the proof live
 * together: price first (an ad click already knows it wants something), then
 * the work that justifies it, then process and objections. Every price here is
 * mirrored from /pricing and /services via offerData.ts — the two must agree.
 */
export default function Works() {
  const [lang, setLang] = useLanguage();
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();

  const t = worksT[lang];
  const o = offerT[lang];
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

  /** Proof numbers are counted off the data rather than written by hand. */
  const totals = useMemo(() => ({
    clients: works.length,
    pieces: works.reduce((n, w) => n + w.media.length, 0),
    industries: new Set(works.map(w => w.industry.en)).size,
  }), [works]);

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
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            name: o.pricingTitle,
            url: `${canonical}#pricing`,
            provider: { '@type': 'Organization', name: 'Cheaper Nexus', url: SITE_URL },
            itemListElement: offerT.en.tiers.map(tier => ({
              '@type': 'Offer',
              name: tier.name,
              price: tier.price.replace(/[^\d]/g, ''),
              priceCurrency: 'MYR',
              description: tier.features.join('; '),
              url: `${canonical}#pricing`,
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: o.faqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <Navbar lang={lang} setLang={setLang} />

      <div className="min-h-screen bg-brand-blue">
        {/* Hero — centred: label, headline, price anchor, CTAs, then the handset,
            so the eye runs straight down the middle into the offer. */}
        <header className="bg-brand-blue text-white pt-28 pb-14 overflow-hidden">
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

            {/* Price anchor — an ad click should see a number before it scrolls. */}
            <p className="mt-7 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-cyan/35 bg-brand-cyan/10 text-brand-cyan text-xs sm:text-sm font-semibold">
              {o.heroPriceAnchor}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={waLink(waGeneral[lang])}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-cyan text-brand-blue font-bold text-sm hover:bg-brand-cyan/90 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                {o.heroCtaPrimary}
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white font-semibold text-sm hover:border-brand-cyan hover:text-brand-cyan transition-colors"
              >
                {o.heroCtaSecondary}
              </a>
            </div>

            <div className="mt-12">
              <HeroPhone works={works} lang={lang} />
            </div>
          </div>
        </header>

        <ProofBar lang={lang} clients={totals.clients} pieces={totals.pieces} industries={totals.industries} />

        {/* Offer first — paid traffic arrives already wanting a number. */}
        <WorksPricing lang={lang} />

        {/* Then the proof that justifies it. */}
        <section className="bg-brand-blue border-t border-white/10">
          <div className="px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 max-w-7xl mx-auto text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-cyan mb-5">
              {o.workEyebrow}
            </p>
            <h2 className="font-black tracking-[-0.03em] text-white text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.08] max-w-3xl mx-auto">
              {o.workTitle}
            </h2>
            <p className="mt-5 text-white/50 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {o.workSub}
            </p>
          </div>
        </section>

        {/* Filters */}
        <div className="bg-brand-blue border-b border-white/10 mt-10">
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

        <WorksProcess lang={lang} />
        <WorksFaq lang={lang} />

        {/* CTA */}
        <section className="bg-brand-cyan text-brand-blue">
          <div className="px-4 sm:px-8 lg:px-12 py-20 text-center">
            <h2 className="font-black uppercase leading-[0.9] tracking-[-0.03em] text-[clamp(2rem,7vw,5rem)]">
              {t.ctaTitle}
            </h2>
            <p className="mt-5 text-brand-blue/85 font-medium">{t.ctaSub}</p>
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

      <Footer lang={lang} variant="dark" />
      {/* Clearance so the sticky bar never covers the SSM line. */}
      <div className="lg:hidden h-20 bg-brand-blue" />
      <StickyCta lang={lang} />
    </>
  );
}
