'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, X, Star } from 'lucide-react';

import { uploadToCloudinary } from '@/lib/cloudinary';

/**
 * Uploads multiple images to Cloudinary and reports the ordered list of URLs
 * via `onChange`. The FIRST image is treated as the main/cover image; the rest
 * become the product-page carousel. Supports remove and "make main".
 */
export function MultiImageUploader({
  onChange,
  initial = [],
}: {
  onChange: (urls: string[]) => void;
  initial?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [inFlight, setInFlight] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function commit(next: string[]) {
    setUrls(next);
    onChange(next);
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ''; // allow re-selecting the same file later
    if (!files.length) return;

    setError(null);
    setInFlight((n) => n + files.length);

    await Promise.all(
      files.map(async (file) => {
        try {
          const url = await uploadToCloudinary(file);
          setUrls((prev) => {
            const next = [...prev, url];
            onChange(next);
            return next;
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Upload failed');
        } finally {
          setInFlight((n) => n - 1);
        }
      }),
    );
  }

  return (
    <div className="space-y-3">
      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
          inFlight > 0
            ? 'border-black/20 bg-black/5'
            : 'border-black/20 hover:border-black/40 hover:bg-black/[0.02]'
        }`}
      >
        {inFlight > 0 ? (
          <Loader2 className="h-6 w-6 animate-spin text-black/60" />
        ) : (
          <UploadCloud className="h-6 w-6 text-black/60" />
        )}
        <span className="text-sm font-semibold">
          {inFlight > 0
            ? `Uploading ${inFlight}…`
            : 'Click to upload one or more images'}
        </span>
        <span className="text-xs text-black/45">
          First image = main (cover). The rest show in the product carousel.
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </label>

      {error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      {urls.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {urls.map((url, i) => (
            <li
              key={url}
              className={`group relative aspect-square overflow-hidden rounded-lg border bg-black/5 ${
                i === 0 ? 'border-[#8ab531] ring-2 ring-[#bff24d]' : 'border-black/10'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={i === 0 ? 'Main image' : `Image ${i + 1}`}
                className="h-full w-full object-cover"
              />

              {i === 0 && (
                <span className="absolute left-1 top-1 flex items-center gap-1 rounded bg-[#bff24d] px-1.5 py-0.5 text-[10px] font-bold text-black">
                  <Star className="h-3 w-3" /> Main
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/50 px-1.5 py-1 opacity-0 transition group-hover:opacity-100">
                {i !== 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      commit([url, ...urls.filter((u) => u !== url)])
                    }
                    className="text-[10px] font-semibold text-white hover:underline"
                  >
                    Make main
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold text-white/70">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => commit(urls.filter((u) => u !== url))}
                  className="grid h-5 w-5 place-items-center rounded bg-white/90 text-black hover:bg-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
