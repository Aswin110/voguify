import Link from 'next/link';
import { Heart } from 'lucide-react';

import { Navbar } from '@/components/navbar';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceCents: number;
  premiumCents: number | null;
  imageUrl: string | null;
  brand: string | null;
  styleNo: string | null;
  category: string | null;
  bestseller: boolean;
  sizes: number | null;
  colors: number | null;
  printProviders: number | null;
};

const CATEGORY_EMOJI: Record<string, string> = {
  bag: '👜',
  tee: '👕',
  phone: '📱',
  hoodie: '🧥',
  mug: '☕',
  cap: '🧢',
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as Product[];
  } catch {
    // API not reachable — render the empty state rather than crashing.
    return [];
  }
}

function formatPrice(cents: number): string {
  return `USD ${(cents / 100).toFixed(2)}`;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#f2f2ec] text-[#1c1b18]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Product catalog
            </h1>
            <p className="mt-2 text-black/55">
              Choose a product to start designing.
            </p>
          </div>
          <Link href="/" className="font-bold underline underline-offset-4">
            ← Back home
          </Link>
        </div>

        {products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const emoji =
    (product.category && CATEGORY_EMOJI[product.category]) || '🛍️';

  const meta = [
    product.sizes != null && `${product.sizes} sizes`,
    product.colors != null && `${product.colors} colors`,
    product.printProviders != null &&
      `${product.printProviders} print providers`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="group">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[#e0ded5] text-7xl">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden>{emoji}</span>
        )}

        <button
          type="button"
          aria-label="Add to favorites"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-md bg-white/90 text-black shadow-sm transition hover:bg-white"
        >
          <Heart className="h-4 w-4" />
        </button>

        {product.bestseller && (
          <span className="absolute bottom-3 left-3 rounded-md bg-[#f7cda0] px-2.5 py-1 text-xs font-semibold text-[#6b4423]">
            Bestseller
          </span>
        )}
      </div>

      <div className="pt-3">
        <h3 className="font-bold leading-snug">{product.name}</h3>
        <p className="mt-0.5 text-sm text-black/50">
          By {product.brand ?? 'Generic brand'}
          {product.styleNo ? ` · ${product.styleNo}` : ''}
        </p>

        <p className="mt-2.5 font-bold">From {formatPrice(product.priceCents)}</p>
        {product.premiumCents != null && (
          <p className="text-sm text-black/55">
            From {formatPrice(product.premiumCents)} with Voguify Premium
          </p>
        )}
        {meta && <p className="mt-1 text-sm text-black/45">{meta}</p>}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-2xl border border-dashed border-black/15 bg-white/50 px-6 py-20 text-center">
      <p className="text-2xl font-bold">No products yet</p>
      <p className="mx-auto mt-2 max-w-md text-black/55">
        Products added from the admin dashboard will appear here. (The admin
        dashboard is coming soon.)
      </p>
    </div>
  );
}
