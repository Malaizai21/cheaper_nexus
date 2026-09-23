import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ArrowRight, Plus, Minus } from 'lucide-react';
import { type Language } from '../../hooks/useLanguage';
import { offerT, waLink, waGeneral, waPackage } from './offerData';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
});

/* ------------------------------------------------------------------ */
/* Proof bar                                                           */
/* ------------------------------------------------------------------ */

interface ProofBarProps {
  lang: Language;
  clients: number;
  pieces: number;
  industries: number;
}

/** Counts are derived from works.json, never hardcoded — they stay true as cases are added. */
export function ProofBar({ lang, clients, pieces, industries }: ProofBarProps) {
  const t = offerT[lang];
  const items = [t.proofClients(clients), t.proofPieces(pieces), t.proofIndustries(industries)];

  return (
    <div className="bg-brand-blue border-y border-white/10">
      <div className="px-4 sm:px-8 lg:px-12 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
        {items.map((label, i) => (
          <span key={i} className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0" />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export function WorksPricing({ lang }: { lang: Language }) {
  const t = offerT[lang];

  return (
    <section id="pricing" className="bg-brand-blue scroll-mt-20">
      <div className="px-4 sm:px-8 lg:px-12 py-20 sm:py-28 max-w-7xl mx-auto">
        <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-cyan mb-5">
            {t.pricingEyebrow}
          </p>
          <h2 className="font-black tracking-[-0.03em] text-white text-[clamp(1.9rem,5.5vw,3.6rem)] leading-[1.08]">
            {t.pricingTitle}
          </h2>
          <p className="mt-5 text-white/55 text-sm sm:text-base leading-relaxed">{t.pricingSub}</p>
        </motion.div>

        {/* Packages */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3 items-start">
          {t.tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              {...fadeUp(i)}
              className={`relative flex flex-col rounded-2xl p-7 sm:p-8 h-full ${
                tier.popular
                  ? 'bg-white text-brand-blue shadow-[0_24px_70px_-20px_rgba(0,212,255,0.45)] ring-2 ring-brand-cyan'
                  : 'bg-white/[0.04] text-white border border-white/10'
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-7 px-3 py-1 rounded-full bg-brand-cyan text-brand-blue text-[10px] font-black uppercase tracking-[0.15em]">
                  {t.popularBadge}
                </span>
              )}

              <h3 className={`text-lg font-bold ${tier.popular ? 'text-brand-blue' : 'text-white'}`}>
                {tier.name}
              </h3>
              <p className={`mt-1.5 text-xs leading-relaxed ${tier.popular ? 'text-brand-blue/70' : 'text-white/55'}`}>
                {tier.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-2 flex-wrap">
                <span className="text-4xl sm:text-[2.75rem] font-black tracking-[-0.03em]">{tier.price}</span>
                <span className={`text-xs font-medium ${tier.popular ? 'text-brand-blue/65' : 'text-white/55'}`}>
                  {tier.unit}
                </span>
              </div>

              <ul className="mt-7 space-y-3 grow">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex gap-2.5 text-sm leading-relaxed">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${tier.popular ? 'text-brand-blue' : 'text-brand-cyan'}`}
                      strokeWidth={3}
                    />
                    <span className={tier.popular ? 'text-brand-blue/80' : 'text-white/70'}>{f}</span>
                  </li>
                ))}
              </ul>

              <p
                className={`mt-6 pt-5 text-xs font-semibold border-t ${
                  tier.popular ? 'border-brand-blue/10 text-brand-blue/65' : 'border-white/10 text-white/50'
                }`}
              >
                {t.valuePrefix} {tier.value}
              </p>

              <a
                href={waLink(waPackage(lang, tier.name, tier.price, tier.unit))}
                target="_blank"
                rel="noopener noreferrer"
                data-package={tier.id}
                className={`mt-5 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-bold text-sm transition-colors ${
                  tier.popular
                    ? 'bg-brand-blue text-white hover:bg-brand-blue/90'
                    : 'bg-brand-cyan text-brand-blue hover:bg-brand-cyan/90'
                }`}
              >
                {t.tierCta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Ala carte */}
        <motion.div {...fadeUp()} className="mt-20 sm:mt-24">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-black tracking-[-0.02em] text-white text-[clamp(1.5rem,4vw,2.4rem)] leading-[1.15]">
              {t.alaTitle}
            </h3>
            <p className="mt-4 text-white/50 text-sm leading-relaxed">{t.alaSub}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {t.ala.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl p-6 flex flex-col ${
                  item.feature
                    ? 'bg-brand-cyan/10 border border-brand-cyan/40'
                    : 'bg-white/[0.03] border border-white/10'
                }`}
              >
                <p className="text-sm font-bold text-white">{item.title}</p>
                <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                  <span className={`text-2xl font-black tracking-[-0.02em] ${item.feature ? 'text-brand-cyan' : 'text-white'}`}>
                    {item.price}
                  </span>
                  <span className="text-[11px] font-semibold text-white/55">{item.unit}</span>
                </div>
                <p className="mt-2.5 text-xs text-white/55 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-white/45 leading-relaxed max-w-3xl mx-auto text-center">
            {t.alaNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Process                                                             */
/* ------------------------------------------------------------------ */

export function WorksProcess({ lang }: { lang: Language }) {
  const t = offerT[lang];

  return (
    <section className="bg-brand-blue border-t border-white/10">
      <div className="px-4 sm:px-8 lg:px-12 py-20 sm:py-24 max-w-7xl mx-auto">
        <motion.div {...fadeUp()} className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-cyan mb-5">
            {t.processEyebrow}
          </p>
          <h2 className="font-black tracking-[-0.03em] text-white text-[clamp(1.7rem,4.5vw,3rem)] leading-[1.12]">
            {t.processTitle}
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden">
          {t.steps.map((s, i) => (
            <motion.div key={i} {...fadeUp(i)} className="bg-brand-blue p-7 sm:p-8">
              <span className="text-brand-cyan font-black text-sm tracking-[0.1em]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-white font-bold text-base">{s.title}</h3>
              <p className="mt-3 text-white/55 text-sm leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export function WorksFaq({ lang }: { lang: Language }) {
  const t = offerT[lang];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-brand-blue border-t border-white/10">
      <div className="px-4 sm:px-8 lg:px-12 py-20 sm:py-24 max-w-3xl mx-auto">
        <motion.h2
          {...fadeUp()}
          className="font-black tracking-[-0.03em] text-white text-[clamp(1.7rem,4.5vw,3rem)] leading-[1.12] text-center"
        >
          {t.faqTitle}
        </motion.h2>

        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {t.faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-5 py-5 text-left group"
                >
                  <span className="text-white font-semibold text-sm sm:text-base leading-relaxed group-hover:text-brand-cyan transition-colors">
                    {f.q}
                  </span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                  ) : (
                    <Plus className="w-5 h-5 text-white/40 shrink-0 mt-0.5 group-hover:text-brand-cyan transition-colors" />
                  )}
                </button>
                {isOpen && (
                  <p className="pb-6 -mt-1 text-white/55 text-sm leading-relaxed max-w-2xl">{f.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky mobile CTA                                                   */
/* ------------------------------------------------------------------ */

/** Phone-only bar so the WhatsApp link is never more than a thumb away on a long page. */
export function StickyCta({ lang }: { lang: Language }) {
  const t = offerT[lang];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-blue/95 backdrop-blur border-t border-white/15 px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-white font-bold text-sm truncate">{t.stickyLabel}</p>
        <a href="#pricing" className="text-brand-cyan text-[11px] font-semibold">
          {t.heroCtaSecondary}
        </a>
      </div>
      <a
        href={waLink(waGeneral[lang])}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 px-5 py-2.5 rounded-full bg-brand-cyan text-brand-blue font-bold text-sm"
      >
        {t.stickyCta}
      </a>
    </div>
  );
}
