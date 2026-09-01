import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

// ─── Swipe config ──────────────────────────────────────────────────────────
// Minimum horizontal drag (px) before we count it as an intentional swipe.
// This prevents accidental micro-movements from triggering navigation.
const SWIPE_THRESHOLD = 40;

// Maximum thumbnails shown before a "+N" overflow button appears
const MAX_VISIBLE_THUMBS = 5;

/**
 * ProductImageGallery
 *
 * A reusable, self-contained image gallery for Universal Market product pages.
 *
 * Props
 * ─────
 * images     string[]   Array of image URLs. Can be empty.
 * alt        string     Accessible base label (usually the product name).
 * className  string     Extra classes applied to the root wrapper.
 *
 * State ownership
 * ───────────────
 * `activeIndex` lives here because no other part of the app needs to know
 * which gallery slide the user is on. Keeping it local avoids unnecessary
 * global state and makes the component portable.
 */
export default function ProductImageGallery({ images = [], alt = 'Product image', className = '' }) {
  // Filter out falsy entries (undefined / null / empty string from Supabase)
  const validImages = images.filter(Boolean);
  const hasImages = validImages.length > 0;
  const isMulti = validImages.length > 1;

  // ── Active index ─────────────────────────────────────────────────────────
  const [activeIndex, setActiveIndex] = useState(0);

  // When the image collection changes (e.g. user navigates to a different
  // product while this component stays mounted), reset to the first image.
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  // Clamp defensively — guards against a length shrink between renders
  const safeIndex = Math.min(activeIndex, Math.max(0, validImages.length - 1));

  // ── Per-image error tracking ──────────────────────────────────────────────
  const [errorSet, setErrorSet] = useState(new Set());

  const markError = useCallback((idx) => {
    setErrorSet((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
  }, []);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === validImages.length - 1 ? 0 : i + 1));
  }, [validImages.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? validImages.length - 1 : i - 1));
  }, [validImages.length]);

  // ── Swipe / touch ─────────────────────────────────────────────────────────
  // We track where the finger landed (touchstart) then measure the horizontal
  // delta when it lifts (touchend). If |delta| > SWIPE_THRESHOLD we navigate.
  const touchStartX = useRef(null);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX.current;
      touchStartX.current = null;
      if (Math.abs(delta) < SWIPE_THRESHOLD) return; // tiny nudge — ignore
      delta < 0 ? goNext() : goPrev();              // swipe-left = next
    },
    [goNext, goPrev]
  );

  // ── Thumbnail data ────────────────────────────────────────────────────────
  const visibleThumbs = validImages.slice(0, MAX_VISIBLE_THUMBS);
  const overflowCount = validImages.length - MAX_VISIBLE_THUMBS;

  // ── No images ─────────────────────────────────────────────────────────────
  if (!hasImages) {
    return (
      <div
        className={`relative w-full aspect-[4/3] rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-400 ${className}`}
        role="img"
        aria-label="Product image unavailable"
      >
        <ImageOff className="h-10 w-10 opacity-40" strokeWidth={1.5} />
        <p className="text-sm font-medium">Product image unavailable</p>
      </div>
    );
  }

  // Resolve the src — fall back to null when that image failed to load
  const activeSrc = errorSet.has(safeIndex) ? null : validImages[safeIndex];

  return (
    <div className={`space-y-3 ${className}`}>

      {/* ── Main image container ─────────────────────────────────────────── */}
      <div
        className="relative w-full aspect-[4/3] rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden select-none"
        onTouchStart={isMulti ? handleTouchStart : undefined}
        onTouchEnd={isMulti ? handleTouchEnd : undefined}
      >
        {activeSrc ? (
          <img
            key={safeIndex}   /* key change forces a clean remount / fade-in */
            src={activeSrc}
            alt={`${alt}${isMulti ? ` — image ${safeIndex + 1} of ${validImages.length}` : ''}`}
            className="w-full h-full object-contain transition-opacity duration-200 ease-in"
            draggable={false}
            onError={() => markError(safeIndex)}
          />
        ) : (
          /* Individual image failed */
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageOff className="h-8 w-8 opacity-40" strokeWidth={1.5} />
            <p className="text-xs">Image failed to load</p>
          </div>
        )}

        {/* ── Prev / Next controls — only rendered when multiple images ──── */}
        {isMulti && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous product image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 border border-white/80 text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-[#064e3b]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Next product image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 border border-white/80 text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-[#064e3b]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* ── Image counter ──────────────────────────────────────────── */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="absolute bottom-2 right-3 z-10 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm pointer-events-none"
            >
              {safeIndex + 1} / {validImages.length}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnail strip — only rendered when multiple images ──────────── */}
      {isMulti && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="list"
          aria-label="Product image thumbnails"
        >
          {visibleThumbs.map((src, idx) => {
            const isActive = idx === safeIndex;
            const hasFailed = errorSet.has(idx);

            return (
              <button
                key={idx}
                type="button"
                role="listitem"
                aria-label={`View product image ${idx + 1}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => setActiveIndex(idx)}
                className={[
                  'shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-150',
                  isActive
                    ? 'border-[#064e3b] ring-1 ring-[#064e3b]'
                    : 'border-gray-200 hover:border-gray-300',
                ].join(' ')}
              >
                {hasFailed ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageOff className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                ) : (
                  <img
                    src={src}
                    alt={`${alt} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                    loading="lazy"
                    onError={() => markError(idx)}
                  />
                )}
              </button>
            );
          })}

          {/* "+N" overflow pill — jumps to the first hidden image */}
          {overflowCount > 0 && (
            <button
              type="button"
              aria-label={`${overflowCount} more image${overflowCount > 1 ? 's' : ''}`}
              onClick={() => setActiveIndex(MAX_VISIBLE_THUMBS)}
              className="shrink-0 w-16 h-16 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-semibold text-gray-500 hover:border-gray-300 transition"
            >
              +{overflowCount}
            </button>
          )}
        </div>
      )}

    </div>
  );
}
