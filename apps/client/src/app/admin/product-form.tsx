'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';

import { MultiImageUploader } from '@/components/multi-image-uploader';
import { Button } from '@/components/ui/button';
import type { ProductFormState } from './actions';

export type ProductInitial = {
  name?: string;
  slug?: string;
  brand?: string | null;
  styleNo?: string | null;
  category?: string | null;
  priceCents?: number;
  premiumCents?: number | null;
  sizes?: number | null;
  colors?: number | null;
  printProviders?: number | null;
  description?: string | null;
  highlights?: string[];
  bestseller?: boolean;
  published?: boolean;
  images?: string[];
};

const INITIAL_STATE: ProductFormState = { ok: false };

const CATEGORIES = [
  { value: 'tee', label: 'T-shirts' },
  { value: 'hoodie', label: 'Hoodies' },
  { value: 'bag', label: 'Bags' },
  { value: 'phone', label: 'Phone Cases' },
  { value: 'mug', label: 'Mugs' },
  { value: 'cap', label: 'Hats' },
];

const field =
  'h-10 w-full rounded-lg border border-black/20 px-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10';
const labelCls = 'mb-1.5 block text-sm font-semibold';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function dollars(cents: number | null | undefined): string {
  return cents != null ? String(cents / 100) : '';
}

export function ProductForm({
  action,
  initial,
  productId,
  submitLabel,
}: {
  action: (
    prev: ProductFormState,
    formData: FormData,
  ) => Promise<ProductFormState>;
  initial?: ProductInitial;
  productId?: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [name, setName] = useState(initial?.name ?? '');
  const [slug, setSlug] = useState(initial?.slug ?? '');
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));

  return (
    <form action={formAction} className="space-y-8">
      {productId && <input type="hidden" name="id" value={productId} />}

      {/* ---------- Images ---------- */}
      <section>
        <label className={labelCls}>Product images</label>
        <MultiImageUploader onChange={setImages} initial={initial?.images} />
        <input type="hidden" name="images" value={JSON.stringify(images)} />
      </section>

      {/* ---------- Basics ---------- */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugEdited) setSlug(slugify(e.target.value));
            }}
            placeholder="Unisex Heavy Cotton Tee"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelCls}>
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            placeholder="unisex-heavy-cotton-tee"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="brand" className={labelCls}>
            Brand
          </label>
          <input
            id="brand"
            name="brand"
            defaultValue={initial?.brand ?? ''}
            placeholder="Gildan"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="styleNo" className={labelCls}>
            Style no.
          </label>
          <input
            id="styleNo"
            name="styleNo"
            defaultValue={initial?.styleNo ?? ''}
            placeholder="5000"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="category" className={labelCls}>
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={initial?.category ?? ''}
            className={field}
          >
            <option value="">— none —</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className={labelCls}>
            Price (USD)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initial?.priceCents != null ? dollars(initial.priceCents) : '0'}
            placeholder="8.80"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="premium" className={labelCls}>
            Premium price (USD) — optional
          </label>
          <input
            id="premium"
            name="premium"
            type="number"
            min="0"
            step="0.01"
            defaultValue={dollars(initial?.premiumCents)}
            placeholder="6.20"
            className={field}
          />
        </div>
      </section>

      {/* ---------- Options meta ---------- */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="sizes" className={labelCls}>
            Sizes
          </label>
          <input
            id="sizes"
            name="sizes"
            type="number"
            min="0"
            defaultValue={initial?.sizes ?? ''}
            placeholder="8"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="colors" className={labelCls}>
            Colors
          </label>
          <input
            id="colors"
            name="colors"
            type="number"
            min="0"
            defaultValue={initial?.colors ?? ''}
            placeholder="70"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="printProviders" className={labelCls}>
            Print providers
          </label>
          <input
            id="printProviders"
            name="printProviders"
            type="number"
            min="0"
            defaultValue={initial?.printProviders ?? ''}
            placeholder="23"
            className={field}
          />
        </div>
      </section>

      {/* ---------- Copy ---------- */}
      <section className="space-y-4">
        <div>
          <label htmlFor="description" className={labelCls}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={initial?.description ?? ''}
            placeholder="Short product description…"
            className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
          />
        </div>
        <div>
          <label htmlFor="highlights" className={labelCls}>
            Highlights — one per line
          </label>
          <textarea
            id="highlights"
            name="highlights"
            rows={4}
            defaultValue={(initial?.highlights ?? []).join('\n')}
            placeholder={'100% cotton\nClassic fit\nPre-shrunk'}
            className="w-full rounded-lg border border-black/20 px-3 py-2 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
          />
        </div>
      </section>

      {/* ---------- Flags ---------- */}
      <section className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="bestseller"
            defaultChecked={initial?.bestseller ?? false}
            className="h-4 w-4"
          />
          Bestseller
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? true}
            className="h-4 w-4"
          />
          Published (visible in catalog)
        </label>
      </section>

      {/* ---------- Submit ---------- */}
      <div className="flex items-center gap-4 border-t border-black/10 pt-6">
        <Button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[#bff24d] px-6 font-bold text-black shadow-none hover:bg-[#aee63f]"
        >
          {pending ? 'Saving…' : submitLabel}
        </Button>

        {state.message && (
          <span
            className={`text-sm font-medium ${
              state.ok ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {state.message}{' '}
            {state.ok && state.slug && (
              <Link
                href={`/products/${state.slug}`}
                className="underline underline-offset-2"
              >
                View →
              </Link>
            )}
          </span>
        )}
      </div>
    </form>
  );
}
