import { useEffect, useRef, useState } from 'react';

/**
 * The site's shared motion vocabulary.
 *
 * These presets started as local constants in Home.tsx. Every other page was
 * static, which made the homepage read as a different site — so they live here
 * now and the pages spread them onto `motion` elements.
 */

/** Shared easing. Typed as a fixed tuple so it satisfies motion's `Easing`. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* The travel and the settle are deliberately long — a short 36px nudge read as
   barely-there, so headings rise further and cards arrive one after another
   rather than almost together. */
export const fadeUp = {
  initial: { opacity: 0, y: 90 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 1.05, ease: EASE },
};

export const stagger = (i: number) => ({
  initial: { opacity: 0, y: 72, scale: 0.965 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-90px' },
  transition: { duration: 0.85, delay: i * 0.13, ease: EASE },
});

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Counts a figure up once it scrolls into view.
 *
 * The values this runs on are real campaign results, written as display
 * strings ("RM 5.20", "RM 14.53"), so it animates the number in place and
 * leaves the currency, decimals and any suffix exactly as authored. A string
 * holding more than one number — a range like "RM 3.94 – 5.82" — is rendered
 * untouched: counting only the first half of a range would misstate it.
 */
export function CountUp({
  value,
  duration = 1200,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  const matches = value.match(/\d[\d,]*(?:\.\d+)?/g);
  const animatable = matches?.length === 1 ? matches[0] : null;

  useEffect(() => {
    const el = ref.current;
    if (!el || !animatable || prefersReduced()) return;

    const target = parseFloat(animatable.replace(/,/g, ''));
    const decimals = (animatable.split('.')[1] || '').length;
    const grouped = animatable.includes(',');
    if (!isFinite(target)) return;

    const render = (n: number) => {
      const fixed = n.toFixed(decimals);
      const out = grouped
        ? Number(fixed).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed;
      setShown(value.replace(animatable, out));
    };

    let frame = 0;
    let start = 0;
    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / duration);
      // Same curve as EASE, so a counting figure settles with the card it is on.
      render(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        render(0);
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, animatable, duration]);

  // The authored string is what renders server-side and before the observer
  // fires, so a visitor without JS — and a crawler — reads the real figure.
  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}
