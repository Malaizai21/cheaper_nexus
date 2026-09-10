import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { type Work } from './worksData';

interface WorkWallProps {
  works: Work[];
  /** How many distinct clips to show before the strip repeats. */
  count?: number;
}

/**
 * Hero wall — vertical work drifting sideways behind the headline.
 *
 * Pure CSS translation rather than a carousel library: the strip is rendered
 * twice and moved by half its width, which loops seamlessly and costs no
 * JavaScript. Tiles use the 300px `wall` variant (~16 KB) since they render
 * around 160-200 CSS px.
 */
export function WorkWall({ works, count = 9 }: WorkWallProps) {
  /** One clip per client first, so the strip shows range rather than repetition. */
  const tiles = useMemo(() => {
    const picks = works
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(w => {
        const v = w.media.find(m => m.type === 'video' && m.wall);
        return v ? { slug: w.slug, name: w.client_name, src: v.wall! } : null;
      })
      .filter((t): t is { slug: string; name: string; src: string } => t !== null);
    return picks.slice(0, count);
  }, [works, count]);

  if (!tiles.length) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      /* Fade the ends into the page rather than cutting them off square. */
      style={{
        maskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)',
        WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)',
      }}
    >
      <div className="animate-marquee flex w-max gap-3 sm:gap-4">
        {[0, 1].map(copy =>
          tiles.map((t, i) => (
            <Link
              key={`${copy}-${t.src}`}
              to={`/works/${t.slug}`}
              aria-hidden={copy === 1}
              tabIndex={copy === 1 ? -1 : undefined}
              className="group relative block shrink-0 w-[132px] sm:w-[176px] aspect-9/16 overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10"
            >
              <img
                src={t.src}
                alt={copy === 0 ? t.name : ''}
                width={300}
                height={533}
                loading={copy === 0 && i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                onContextMenu={e => e.preventDefault()}
                className="h-full w-full object-cover select-none opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
              />
            </Link>
          )),
        )}
      </div>
    </div>
  );
}
