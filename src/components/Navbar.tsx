import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Languages, Phone } from 'lucide-react';
import { type Language } from '../hooks/useLanguage';

const navT: Record<Language, {
  services: string; pricing: string; blog: string; contact: string; cta: string;
}> = {
  zh: { services: '服务项目', pricing: '价格套餐', blog: '营销博客', contact: '联系我们', cta: '免费咨询' },
  en: { services: 'Services', pricing: 'Pricing', blog: 'Blog', contact: 'Contact', cta: 'Free Consultation' },
  ms: { services: 'Perkhidmatan', pricing: 'Harga', blog: 'Blog', contact: 'Hubungi', cta: 'Konsultasi Percuma' },
};

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
}

export function Navbar({ lang, setLang }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const t = navT[lang];

  const links = [
    { href: '/services', label: t.services },
    { href: '/pricing', label: t.pricing },
    { href: '/blog', label: t.blog },
    { href: '/contact', label: t.contact },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-white/90 backdrop-blur-md border-b border-brand-blue/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Cheaper Nexus" className="h-12 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.href}
                to={l.href}
                className={`text-sm font-medium transition-colors ${
                  loc.pathname === l.href ? 'text-brand-cyan' : 'text-brand-blue hover:text-brand-cyan'
                }`}
              >
                {l.label}
              </Link>
            ))}

            {/* Language switcher */}
            <div className="flex items-center gap-2 px-3 py-1 bg-brand-blue/5 rounded-full">
              <Languages className="w-4 h-4 text-brand-blue/40" />
              <select
                value={lang}
                onChange={e => setLang(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-brand-blue outline-none cursor-pointer"
              >
                <option value="zh">中文</option>
                <option value="en">EN</option>
                <option value="ms">MS</option>
              </select>
            </div>

            <a
              href="https://wa.me/60134391541"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-white rounded-full text-sm font-semibold hover:bg-brand-blue/90 transition-all"
            >
              <Phone className="w-4 h-4" /> {t.cta}
            </a>
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-3">
            <select
              value={lang}
              onChange={e => setLang(e.target.value as Language)}
              className="bg-brand-blue/5 px-2 py-1 rounded text-xs font-bold text-brand-blue outline-none"
            >
              <option value="zh">中文</option>
              <option value="en">EN</option>
              <option value="ms">MS</option>
            </select>
            <button onClick={() => setOpen(!open)} className="p-2 text-brand-blue">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-brand-blue/5 bg-white px-4 py-4 space-y-1">
          {links.map(l => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                loc.pathname === l.href
                  ? 'bg-brand-cyan/10 text-brand-cyan'
                  : 'text-brand-blue hover:bg-brand-blue/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://wa.me/60134391541"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 px-4 py-3 bg-brand-blue text-white rounded-xl text-sm font-semibold text-center"
          >
            {t.cta}
          </a>
        </div>
      )}
    </nav>
  );
}
