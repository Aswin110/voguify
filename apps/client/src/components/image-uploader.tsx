'use client';

import { useState } from 'react';
import { UploadCloud, Loader2, Check, X } from 'lucide-react';

import { uploadToCloudinary } from '@/lib/cloudinary';

type Status = 'idle' | 'uploading' | 'done' | 'error';

/**
 * Single-image unsigned Cloudinary uploader. Calls `onUploaded` with the
 * hosted URL on success. (For product galleries use MultiImageUploader.)
 */
export function ImageUploader({
  onUploaded,
}: {
  onUploaded?: (url: string) => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setError(null);
    try {
      const secureUrl = await uploadToCloudinary(file);
      setUrl(secureUrl);
      setStatus('done');
      onUploaded?.(secureUrl);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  return (
    <div className="space-y-3">
      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
          status === 'uploading'
            ? 'pointer-events-none border-black/20 bg-black/5'
            : 'border-black/20 hover:border-black/40 hover:bg-black/[0.02]'
        }`}
      >
        {status === 'uploading' ? (
          <Loader2 className="h-6 w-6 animate-spin text-black/60" />
        ) : status === 'done' ? (
          <Check className="h-6 w-6 text-green-600" />
        ) : (
          <UploadCloud className="h-6 w-6 text-black/60" />
        )}
        <span className="text-sm font-semibold">
          {status === 'uploading'
            ? 'Uploading…'
            : status === 'done'
              ? 'Uploaded — choose another to replace'
              : 'Click to upload an image'}
        </span>
        <span className="text-xs text-black/45">PNG, JPG, WEBP up to ~10MB</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          disabled={status === 'uploading'}
        />
      </label>

      {status === 'error' && error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      {url && (
        <div className="relative h-40 w-full overflow-hidden rounded-lg border border-black/10 bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Uploaded preview"
            className="h-full w-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
