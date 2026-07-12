'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Product-detail image gallery: a large main image plus a thumbnail strip with
 * prev/next. `images[0]` is the cover. Falls back to an emoji when there are no
 * images (older seeded products).
 */
export function ProductGallery({
  images,
  emoji,
  name,
  bestseller,
}: {
  images: string[];
  emoji: string;
  name: string;
  bestseller: boolean;
}) {
  const [active, setActive] = useState(0);
  const hasImages = images.length > 0;
  const current = images[active];

  function step(delta: number) {
    setActive((i) => (i + delta + images.length) % images.length);
  }

  return (
    <div>
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-[#cfccc2] text-[9rem]">
        {hasImages ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={current}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden>{emoji}</span>
        )}

        <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md bg-white text-black shadow-sm">
          <Heart className="h-4 w-4" />
        </span>

        {bestseller && (
          <span className="absolute bottom-4 left-4 rounded-md bg-[#f7cda0] px-2.5 py-1 text-xs font-semibold text-[#6b4423]">
            Bestseller
          </span>
        )}
      </div>

      {/* thumbnail strip (only when there's more than one image) */}
      {images.length > 1 && (
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => step(-1)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-black/15 text-black/60 hover:bg-black/5"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-2 overflow-x-auto">
            {images.map((url, i) => (
              <button
                key={url}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  'h-16 w-16 shrink-0 overflow-hidden rounded-md bg-[#e0ded5]',
                  i === active && 'ring-2 ring-[#4b4a40]',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${name} thumbnail ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => step(1)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-black/15 text-black/60 hover:bg-black/5"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
