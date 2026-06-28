import Link from 'next/link';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: '1',
    title: 'Select your product',
    desc: 'Choose from over 1300 top quality products including brands you know and love',
  },
  {
    n: '2',
    title: 'Add your design',
    desc: 'Use our free design tool to fully customize your print-on-demand products',
  },
  {
    n: '3',
    title: 'Start selling',
    desc: 'You set your profit margin, we take care of production and delivery',
  },
];

const PRODUCTS = [
  { name: 'Phone Cases', brand: 'By Generic brand', emoji: '📱' },
  { name: 'Tote Bag', brand: 'By Generic brand', emoji: '👜', highlighted: true },
  { name: 'Short Sleeve Tee', brand: 'By Bella+Canvas', emoji: '👕' },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f2f2ec] text-[#1c1b18]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Hero />
          <Showcase />
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero (left column)                                                 */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section>
      <h1 className="max-w-md text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
        Start with $0 investment
      </h1>

      <ol className="mt-10 max-w-md">
        {STEPS.map((step) => (
          <li key={step.n} className="border-b border-black/10 py-5">
            <div className="flex gap-5">
              <span className="text-xl font-bold tabular-nums">{step.n}</span>
              <div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-black/55">
                  {step.desc}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-9 flex flex-col items-start gap-5">
        <Button
          asChild
          className="h-auto rounded-xl bg-[#2b2a26] px-7 py-3.5 text-sm font-bold hover:bg-black"
        >
          <Link href="/products">Start designing</Link>
        </Button>
        <a href="#" className="font-bold underline underline-offset-4">
          Learn more
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Showcase (right column)                                            */
/* ------------------------------------------------------------------ */

function Showcase() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#a9e2f7] p-6 sm:p-10">
      <div className="mx-auto flex w-max items-end gap-4">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
      <Cursor />
    </section>
  );
}

function ProductCard({
  name,
  brand,
  emoji,
  highlighted = false,
}: {
  name: string;
  brand: string;
  emoji: string;
  highlighted?: boolean;
}) {
  return (
    <Card
      className={cn(
        'shrink-0 rounded-xl border-transparent p-3',
        highlighted
          ? 'z-10 w-56 -translate-y-2 shadow-xl ring-2 ring-sky-400'
          : 'w-48 shadow-sm',
      )}
    >
      <div className="flex aspect-square items-center justify-center rounded-lg bg-neutral-100 text-6xl">
        <span aria-hidden>{emoji}</span>
      </div>
      <CardContent className="p-0 px-1 pb-1 pt-3">
        <p className="font-bold">{name}</p>
        <p className="text-sm text-black/50">{brand}</p>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Cursor graphic                                                     */
/* ------------------------------------------------------------------ */

function Cursor() {
  return (
    <svg
      className="pointer-events-none absolute left-[54%] top-[64%] h-16 w-16 drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]"
      viewBox="0 0 24 24"
      fill="white"
      stroke="black"
      strokeWidth="1.4"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5.5 3.2 L5.5 20.4 L10.1 15.9 L13.2 22.4 L15.7 21.2 L12.6 14.8 L19.2 14.8 Z" />
    </svg>
  );
}
