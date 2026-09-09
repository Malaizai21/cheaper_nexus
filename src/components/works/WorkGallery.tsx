import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { type Language } from '../../hooks/useLanguage';
import { type WorkMedia, worksT } from './worksData';

interface WorkGalleryProps {
  media: WorkMedia[];
  lang: Language;
  clientName: string;
}

export function WorkGallery({ media, lang, clientName }: WorkGalleryProps) {
  const t = worksT[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => setOpenIndex(i => (i === null ? i : (i + delta + media.length) % media.length)),
    [media.length],
  );

  // Keyboard nav + scroll lock while the lightbox is open
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, step]);

  // Playback is user-initiated (they clicked the item), never an unsolicited autoplay.
  useEffect(() => {
    if (openIndex === null) return;
    const el = videoRef.current;
    if (el) el.play().catch(() => { /* browser blocked it — the controls are still there */ });
  }, [openIndex]);

  const current = openIndex === null ? null : media[openIndex];

  /** Client work is not ours to hand out — block the casual save paths.
   *  This deters right-click/drag saving; it is not, and cannot be, real DRM. */
  const noSave = {
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
    draggable: false,
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {media.map((m, i) => {
          const isVideo = m.type === 'video';
          return (
            <button
              key={m.src}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={isVideo ? t.playVideo : `${clientName} — ${i + 1}`}
              className={`group relative overflow-hidden rounded-xl bg-brand-blue/5 border border-brand-blue/8 hover:border-brand-cyan/40 transition-all ${
                isVideo ? 'aspect-9/16' : 'aspect-4/5'
              }`}
            >
              <img
                {...noSave}
                src={m.thumb}
                alt={`${clientName} — ${isVideo ? 'video' : 'design'} ${i + 1}`}
                width={600}
                height={isVideo ? 1067 : 750}
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
              />
              {isVideo && (
                <>
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-brand-blue fill-current translate-x-0.5" />
                    </span>
                  </span>
                  {m.duration != null && (
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold tabular-nums">
                      {Math.floor(m.duration / 60)}:{String(m.duration % 60).padStart(2, '0')}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-100 bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label={t.closeLightbox}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {media.length > 1 && (
            <>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); step(-1); }}
                aria-label={t.prevMedia}
                className="absolute left-2 sm:left-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={e => { e.stopPropagation(); step(1); }}
                aria-label={t.nextMedia}
                className="absolute right-2 sm:right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div className="max-h-[85vh] max-w-full flex flex-col items-center" onClick={e => e.stopPropagation()}>
            {current.type === 'video' ? (
              <video
                {...noSave}
                ref={videoRef}
                key={current.src}
                src={current.src}
                poster={current.poster}
                controls
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                playsInline
                preload="metadata"
                className="max-h-[85vh] max-w-full rounded-lg"
              />
            ) : (
              <img
                {...noSave}
                src={current.src}
                alt={clientName}
                width={current.width ?? 1200}
                height={current.height ?? 1500}
                className="max-h-[85vh] max-w-full object-contain rounded-lg select-none"
              />
            )}
            <p className="mt-3 text-white/50 text-xs tabular-nums">
              {openIndex! + 1} / {media.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
