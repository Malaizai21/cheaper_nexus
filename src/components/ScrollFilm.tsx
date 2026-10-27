import { useEffect, useRef, useState } from 'react';

/**
 * A film the visitor scrubs by scrolling: the page's scroll position drives the
 * video's currentTime, so pausing holds a frame and scrolling back runs it in
 * reverse.
 *
 * The poster is a real <img>, not the video's own poster attribute, because a
 * <video> can only paint after it has fetched and decoded. The image lands
 * immediately and the clip is fetched after load, so a visitor on a slow
 * connection still gets a composed hero rather than an empty black box.
 *
 * Progress is published as a `--p` custom property rather than React state.
 * The scrub fires on every scroll frame, and re-rendering the hero's subtree at
 * that rate would cost far more than the seek it is driving; children fade
 * themselves in CSS off the same variable.
 *
 * Seeks are coalesced through rAF. A seek per scroll event queues faster than
 * the decoder retires them, which is what makes a scrubbed video feel like it
 * is lagging behind the page rather than attached to it.
 */

interface ScrollFilmProps {
  /** Scroll distance in viewport heights. More means a slower, longer scrub. */
  height?: number;
  children?: React.ReactNode;
}

const DESKTOP = '/hero/film.mp4';
const MOBILE = '/hero/film-mobile.mp4';
const POSTER = '/hero/film-poster.jpg';
const POSTER_MOBILE = '/hero/film-poster-mobile.jpg';

/**
 * Scrub progress at which the hero copy has finished fading out.
 *
 * Tuned against the footage, not picked: the handset is bright enough to fight
 * the headline from roughly a third of the way in, so the copy is gone before
 * it arrives rather than sitting on top of it.
 */
const COPY_GONE = 0.28;
const COPY_FADE = 0.2;

/** `HTMLMediaElement.HAVE_METADATA` — duration and dimensions are known. */
const HAVE_METADATA = 1;

export function ScrollFilm({ height = 2.6, children }: ScrollFilmProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [reduced, setReduced] = useState(false);
  const [painted, setPainted] = useState(false);

  // Decide the source on the client, and only once the page has loaded — the
  // clip must never compete with the first paint for bandwidth.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }
    const pick = () => setSrc(window.innerWidth < 768 ? MOBILE : DESKTOP);
    if (document.readyState === 'complete') {
      pick();
      return;
    }
    window.addEventListener('load', pick, { once: true });
    return () => window.removeEventListener('load', pick);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const video = videoRef.current;
    if (!section || !sticky || !video || !src) return;

    let frame = 0;
    let target = 0;
    let duration = 0;

    const apply = () => {
      frame = 0;
      if (!duration) return;
      // Seeking to a time the decoder already shows still costs a decode.
      if (Math.abs(video.currentTime - target) < 0.01) return;
      video.currentTime = target;
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
      sticky.style.setProperty('--p', progress.toFixed(4));
      // Faded-out copy still catches clicks, which would put an invisible CTA
      // in the middle of the screen. This is a DOM write rather than React
      // state on purpose: it flips once per crossing, but it is computed on
      // every scroll frame.
      const live = progress < COPY_GONE ? 'on' : 'off';
      if (sticky.dataset.copy !== live) sticky.dataset.copy = live;
      target = progress * duration;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onMeta = () => {
      duration = video.duration || 0;
      onScroll();
    };
    const onSeeked = () => setPainted(true);

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('seeked', onSeeked, { once: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // A cached clip can reach HAVE_METADATA before this effect runs, and then
    // the event never comes: duration stays 0, every seek is skipped, and the
    // film sits on its first frame looking like a still image.
    if (video.readyState >= HAVE_METADATA) onMeta();
    else onScroll();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [src]);

  // Without the scrub there is nothing to scroll through, so the section
  // collapses to a single screen rather than several of dead space.
  const tall = reduced ? 1 : height;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#05070b]"
      style={{ height: `${tall * 100}vh` }}
    >
      <div
        ref={stickyRef}
        data-copy="on"
        className="group sticky top-0 h-screen w-full overflow-hidden"
        style={{ '--p': '0' } as React.CSSProperties}
      >
        <picture>
          <source srcSet={POSTER_MOBILE} media="(max-width: 767px)" />
          <img
            src={POSTER}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              painted ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </picture>

        {src && (
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              painted ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* The film ends on a screen that fills the frame at full brightness.
            Tucking its lower edge under the page colour keeps the handoff to
            the next section from landing as a hard horizontal line. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #05070b)' }}
        />

        <div className="relative h-full">{children}</div>
      </div>
    </section>
  );
}

/**
 * Hero copy that clears out of the film's way.
 *
 * The handset starts as a speck in the dark and ends filling the frame at full
 * brightness, so there is no overlay treatment that keeps text readable across
 * the whole scrub. Instead the copy owns the dark opening and is gone before
 * the screen arrives — which is also the more cinematic reading of the shot.
 */
export function FilmCopy({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-8 group-data-[copy=off]:pointer-events-none"
      style={{
        opacity: `clamp(0, calc((${COPY_GONE} - var(--p)) / ${COPY_FADE}), 1)`,
        transform: 'translateY(calc(var(--p) * -60px))',
      }}
    >
      {children}
    </div>
  );
}
