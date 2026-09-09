import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { type Language } from '../../hooks/useLanguage';
import { type Work, copyLang } from './worksData';
import { PhoneFrame } from './PhoneFrame';

interface HeroPhoneProps {
  works: Work[];
  lang: Language;
}

const INTERVAL = 3200;

/**
 * Hero handset that cycles through one video poster per client.
 *
 * Posters, not the videos themselves: a still is ~30 KB against ~2 MB, and the
 * page already sits right on its mobile performance budget. The cycle pauses
 * when the tab is hidden and never starts for reduced-motion users.
 */
export function HeroPhone({ works, lang }: HeroPhoneProps) {
  const cl = copyLang(lang);
  const [i, setI] = useState(0);
  const indexRef = useRef(0);

  /** Manual dot clicks must move the ref too, or the timer resumes from the old slide. */
  const goTo = (n: number) => { indexRef.current = n; setI(n); };

  /** One representative vertical clip per client, so the reel spans the roster. */
  const slides = useMemo(
    () => works
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(w => {
        const video = w.media.find(m => m.type === 'video');
        return video ? { work: w, thumb: video.thumb } : null;
      })
      .filter((s): s is { work: Work; thumb: string } => s !== null)
      .slice(0, 8),
    [works],
  );

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: number | undefined;
    let cancelled = false;

    /** Only advance once the next frame has decoded, so the handle and caption
     *  never label a client over the previous client's footage. The index is
     *  read from a ref — a state updater must stay pure, and using one to read
     *  `i` fired the preload several times and made the handle jump around. */
    const advance = () => {
      const next = (indexRef.current + 1) % slides.length;
      const img = new Image();
      img.src = slides[next].thumb;
      const commit = () => {
        if (cancelled) return;
        indexRef.current = next;
        setI(next);
      };
      img.decode().then(commit).catch(commit);
    };

    const start = () => { timer ??= window.setInterval(advance, INTERVAL); };
    const stop = () => { if (timer) window.clearInterval(timer); timer = undefined; };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [slides.length]);

  if (!slides.length) return null;

  const active = slides[i];

  return (
    <div className="relative w-[230px] sm:w-[270px] shrink-0">
      <PhoneFrame handle={active.work.client_name} caption={active.work.highlight[cl]}>
        {slides.map((s, n) => (
          <img
            key={s.thumb}
            src={s.thumb}
            alt={s.work.client_name}
            width={600}
            height={1067}
            loading={n === 0 ? 'eager' : 'lazy'}
            decoding="async"
            draggable={false}
            onContextMenu={e => e.preventDefault()}
            className={`absolute inset-0 h-full w-full object-cover select-none transition-opacity duration-700 ${
              n === i ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        <Link
          to={`/works-v2/${active.work.slug}`}
          className="absolute inset-0 z-10"
          aria-label={active.work.client_name}
        />
      </PhoneFrame>

      {/* Progress dots */}
      <div className="mt-5 flex justify-center gap-1.5">
        {slides.map((s, n) => (
          <button
            key={s.thumb}
            onClick={() => goTo(n)}
            aria-label={s.work.client_name}
            className={`h-1 rounded-full transition-all ${
              n === i ? 'w-6 bg-brand-cyan' : 'w-1.5 bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
