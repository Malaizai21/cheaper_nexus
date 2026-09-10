import { X } from 'lucide-react';
import { type Language } from '../../hooks/useLanguage';
import { SERVICE_FILTERS, worksT } from './worksData';

interface WorkFiltersProps {
  lang: Language;
  industries: { id: string; label: string }[];
  activeServices: string[];
  activeIndustries: string[];
  onToggle: (key: 'service' | 'industry', value: string) => void;
  onClear: () => void;
  count: number;
  variant?: 'light' | 'dark';
}

/**
 * Service and industry chips.
 *
 * Thirteen chips wrapped to seven rows on a 390px screen — a 205px sticky bar
 * eating a quarter of the viewport before any work was visible. Each group is
 * now a single horizontally scrollable row on phones and only wraps from `sm`
 * up, where there is room for it.
 */
export function WorkFilters({
  lang, industries, activeServices, activeIndustries, onToggle, onClear, count, variant = 'light',
}: WorkFiltersProps) {
  const t = worksT[lang];
  const dark = variant === 'dark';

  // Label sits inline with its chips rather than on its own line — two stacked
  // labels cost ~40px of a phone viewport for no information gain.
  const label = `text-[10px] font-bold uppercase tracking-[0.14em] shrink-0 w-14 sm:w-auto sm:mr-1 ${
    dark ? 'text-white/35' : 'text-brand-blue/40'
  }`;

  const row = 'flex gap-2 flex-nowrap overflow-x-auto sm:flex-wrap sm:overflow-visible min-w-0 ' +
    '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ' +
    'pr-4 sm:pr-0';

  const chip = (active: boolean, accent: 'cyan' | 'plain') => {
    if (active) {
      return accent === 'cyan'
        ? 'bg-brand-cyan text-brand-blue'
        : dark ? 'bg-white text-brand-blue' : 'bg-brand-blue text-white';
    }
    return dark
      ? 'bg-white/8 text-white/70 hover:bg-white/15'
      : 'bg-brand-blue/5 text-brand-blue hover:bg-brand-blue/10';
  };

  const base = 'shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 sm:flex-wrap">
        <span className={label}>{t.filterService}</span>
        <div className={row}>
          {SERVICE_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => onToggle('service', f.id)}
              aria-pressed={activeServices.includes(f.id)}
              className={`${base} ${chip(activeServices.includes(f.id), 'cyan')}`}
            >
              {f.label[lang]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:flex-wrap">
        <span className={label}>{t.filterIndustry}</span>
        <div className={row}>
          {industries.map(f => (
            <button
              key={f.id}
              onClick={() => onToggle('industry', f.id)}
              aria-pressed={activeIndustries.includes(f.id)}
              className={`${base} ${chip(activeIndustries.includes(f.id), 'plain')}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-[11px] font-medium ${dark ? 'text-white/40' : 'text-brand-blue/45'}`}>
          {t.resultCount(count)}
        </span>
        {(activeServices.length > 0 || activeIndustries.length > 0) && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-cyan hover:underline"
          >
            <X className="w-3 h-3" /> {t.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
}
