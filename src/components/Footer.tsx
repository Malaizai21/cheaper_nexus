import { Link } from 'react-router-dom';
import { type Language } from '../hooks/useLanguage';

/**
 * Registered entity as recorded with SSM. Malaysian companies must show the
 * registration number alongside the company name, so this footer goes on every
 * public page. `BRAND_NAME` stays the short form used in marketing copy;
 * `LEGAL_NAME` is what pairs with the registration number.
 */
export const BRAND_NAME = 'Cheaper Nexus';
export const LEGAL_NAME = 'Cheaper Nexus Sdn Bhd';
export const SSM_NUMBER = '202601007953 (1670051-W)';

const footerT: Record<Language, {
  rights: string; services: string; pricing: string; works: string; blog: string; contact: string;
}> = {
  zh: { rights: '版权所有', services: '服务项目', pricing: '价格套餐', works: '客户作品', blog: '营销博客', contact: '联系我们' },
  en: { rights: 'All rights reserved', services: 'Services', pricing: 'Pricing', works: 'Works', blog: 'Blog', contact: 'Contact' },
  ms: { rights: 'Hak cipta terpelihara', services: 'Perkhidmatan', pricing: 'Harga', works: 'Kerja Kami', blog: 'Blog', contact: 'Hubungi' },
};

interface FooterProps {
  lang: Language;
  /** Dark pages (works, case studies) invert the palette. */
  variant?: 'light' | 'dark';
}

export function Footer({ lang, variant = 'light' }: FooterProps) {
  const t = footerT[lang];
  const dark = variant === 'dark';

  const muted = dark ? 'text-white/40' : 'text-brand-blue/40';
  const linkCls = `text-sm transition-colors hover:text-brand-cyan ${dark ? 'text-white/45' : 'text-brand-blue/40'}`;

  return (
    <footer className={`py-10 border-t ${dark ? 'bg-brand-blue border-white/10' : 'border-brand-blue/6'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-7">
        <Link to="/" className="shrink-0 self-center md:self-auto">
          <picture>
            <source srcSet={dark ? '/logo-dark.png' : '/logo.webp'} type={dark ? 'image/png' : 'image/webp'} />
            <img
              src={dark ? '/logo-dark.png' : '/logo.png'}
              alt={BRAND_NAME}
              width={430}
              height={120}
              loading="lazy"
              className="h-10 w-auto object-contain"
            />
          </picture>
        </Link>

        <div className={`text-center text-xs leading-relaxed ${muted}`}>
          <p className="font-medium">
            {LEGAL_NAME} <span className="tabular-nums">{SSM_NUMBER}</span>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} {LEGAL_NAME}. {t.rights}.</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          {[
            { to: '/services', label: t.services },
            { to: '/works',    label: t.works    },
            { to: '/pricing',  label: t.pricing  },
            { to: '/blog',     label: t.blog     },
            { to: '/contact',  label: t.contact  },
          ].map(l => (
            <Link key={l.to} to={l.to} className={linkCls}>{l.label}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
