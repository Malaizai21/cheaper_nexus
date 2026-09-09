import { type ReactNode } from 'react';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

interface PhoneFrameProps {
  /** Handle shown in the post header — the client's own name, since it is their content. */
  handle: string;
  children: ReactNode;
  /** Small caption line under the actions, e.g. the case highlight. */
  caption?: string;
  className?: string;
}

/**
 * A phone shell wrapping a 9:16 slot, chromed like a social feed post.
 *
 * Everything here is vertical social content, so showing it inside a handset is
 * how the work is actually consumed. The chrome is a generic feed treatment —
 * avatar, handle, action row — not any platform's branding.
 */
export function PhoneFrame({ handle, children, caption, className = '' }: PhoneFrameProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Bezel */}
      <div className="relative rounded-[2.2rem] bg-[#111827] p-2.5 shadow-2xl shadow-black/40 ring-1 ring-white/10">
        {/* Screen */}
        <div className="relative overflow-hidden rounded-[1.7rem] bg-black">
          {/* Dynamic island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 h-4 w-16 rounded-full bg-black/90" />

          {/* Post header */}
          <div className="flex items-center gap-2 px-3 pt-7 pb-2 bg-black">
            <span
              aria-hidden
              className="h-6 w-6 shrink-0 rounded-full bg-linear-to-tr from-brand-cyan via-white to-brand-cyan p-[1.5px]"
            >
              <span className="block h-full w-full rounded-full bg-brand-blue" />
            </span>
            <span className="text-[11px] font-semibold text-white truncate">{handle}</span>
            <span aria-hidden className="ml-auto text-white/60 text-sm leading-none tracking-widest">···</span>
          </div>

          {/* Media slot — 9:16 */}
          <div className="relative aspect-9/16 bg-black">{children}</div>

          {/* Action row */}
          <div className="flex items-center gap-3.5 px-3 py-2.5 bg-black">
            <Heart className="w-4 h-4 text-white" />
            <MessageCircle className="w-4 h-4 text-white" />
            <Send className="w-4 h-4 text-white" />
            <Bookmark className="w-4 h-4 text-white ml-auto" />
          </div>

          {caption && (
            <p className="px-3 pb-3 -mt-0.5 text-[11px] leading-snug text-white/70 bg-black line-clamp-2">
              <span className="font-semibold text-white">{handle}</span> {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
