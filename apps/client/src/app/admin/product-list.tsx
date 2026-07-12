'use client';

import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

import { deleteProduct } from './actions';

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  images: string[];
  priceCents: number;
  published: boolean;
};

function formatPrice(cents: number): string {
  return `USD ${(cents / 100).toFixed(2)}`;
}

export function ProductList({ products }: { products: ProductRow[] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/50">
        No products yet. Add one above.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-black/10">
      {products.map((p) => {
        const cover = p.images?.[0] ?? p.imageUrl;
        return (
          <li key={p.id} className="flex items-center gap-3 py-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-black/5">
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">
                {p.name}
                {!p.published && (
                  <span className="ml-2 rounded bg-black/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-black/50">
                    Draft
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-black/50">
                /{p.slug} · {formatPrice(p.priceCents)} ·{' '}
                {(p.images?.length ?? 0) || (p.imageUrl ? 1 : 0)} image
                {((p.images?.length ?? 0) || (p.imageUrl ? 1 : 0)) === 1 ? '' : 's'}
              </p>
            </div>

            <Link
              href={`/admin/${p.id}/edit`}
              className="flex items-center gap-1 rounded-lg border border-black/20 px-3 py-1.5 text-xs font-semibold hover:bg-black/5"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>

            <form
              action={deleteProduct}
              onSubmit={(e) => {
                if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}
