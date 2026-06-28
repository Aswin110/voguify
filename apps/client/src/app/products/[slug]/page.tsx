import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { DecorationMethod } from '@/components/decoration-method';
import { cn } from '@/lib/utils';

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  highlights: string[];
  priceCents: number;
  premiumCents: number | null;
  imageUrl: string | null;
  brand: string | null;
  styleNo: string | null;
  category: string | null;
  bestseller: boolean;
};

const CATEGORY_EMOJI: Record<string, string> = {
  bag: '👜',
  tee: '👕',
  phone: '📱',
  hoodie: '🧥',
  mug: '☕',
  cap: '🧢',
};

const CATEGORY_LABEL: Record<string, string> = {
  bag: 'Bags',
  tee: 'T-shirts',
  phone: 'Phone Cases',
  hoodie: 'Hoodies',
  mug: 'Mugs',
  cap: 'Hats',
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Product | null;
    return data && data.id ? data : null;
  } catch {
    return null;
  }
}

function formatPrice(cents: number): string {
  return `USD ${(cents / 100).toFixed(2)}`;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const emoji =
    (product.category && CATEGORY_EMOJI[product.category]) || '🛍️';
  const categoryLabel =
    (product.category && CATEGORY_LABEL[product.category]) || 'Products';
  const choiceCents = product.premiumCents ?? product.priceCents;

  return (
    <div className="min-h-screen bg-white text-[#1c1b18]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* ---------- Gallery ---------- */}
          <div>
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-[#cfccc2] text-[9rem]">
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

              <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md bg-white text-black shadow-sm">
                <Heart className="h-4 w-4" />
              </span>

              {product.bestseller && (
                <span className="absolute bottom-4 left-4 rounded-md bg-[#f7cda0] px-2.5 py-1 text-xs font-semibold text-[#6b4423]">
                  Bestseller
                </span>
              )}
            </div>

            {/* thumbnail strip (placeholders) */}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-black/15 text-black/60 hover:bg-black/5"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'grid h-16 w-16 place-items-center rounded-md bg-[#e0ded5] text-2xl',
                      i === 0 && 'ring-2 ring-[#4b4a40]',
                    )}
                  >
                    <span aria-hidden>{emoji}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                aria-label="Next"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-black/15 text-black/60 hover:bg-black/5"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ---------- Details ---------- */}
          <div>
            <nav className="text-sm text-black/55">
              <Link href="/products" className="hover:text-black">
                Catalog
              </Link>{' '}
              / {categoryLabel}
            </nav>

            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-2 flex items-center gap-3 text-black/55">
              <span>
                {product.brand ?? 'Generic brand'}
                {product.styleNo ? ` ${product.styleNo}` : ''}
              </span>
              <span className="font-bold text-black underline underline-offset-4">
                Product details
              </span>
            </p>

            {product.highlights.length > 0 ? (
              <ul className="mt-7 space-y-3 text-[15px] leading-relaxed text-black/80">
                {product.highlights.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/60" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              product.description && (
                <p className="mt-7 text-[15px] leading-relaxed text-black/80">
                  {product.description}
                </p>
              )
            )}

            {/* decoration method */}
            <div className="mt-8">
              <p className="mb-2 flex items-center gap-3 font-bold">
                Decoration Method
                <span className="text-sm font-bold underline underline-offset-4">
                  Help me choose
                </span>
              </p>
              <DecorationMethod methods={['DTG', 'Embroidery']} />
            </div>

            {/* choice card */}
            <div className="mt-6 rounded-2xl bg-[#e7f6cb] p-6">
              <p className="text-lg font-extrabold">
                Voguify <span className="text-xs font-bold">Choice</span>
              </p>
              <p className="mt-1 text-sm text-black/70">
                Get the best price and quality on every order with Voguify
                Choice.
              </p>
              <ul className="mt-4 space-y-2 text-[15px]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>
                    From <span className="font-bold">{formatPrice(choiceCents)}</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>
                    <span className="font-bold">Network of top-rated</span>{' '}
                    providers
                  </span>
                </li>
              </ul>
              <Button
                asChild
                className="mt-5 h-auto w-full rounded-lg bg-[#2b2a26] py-3.5 text-sm font-bold hover:bg-black"
              >
                <a href="#">Start designing</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
