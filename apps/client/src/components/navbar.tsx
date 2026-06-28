import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';

const NAV_ITEMS: { label: string; hasMenu: boolean }[] = [
  { label: 'Catalog', hasMenu: false },
  { label: 'Pricing', hasMenu: false },
  { label: 'How it works', hasMenu: true },
  { label: 'Solutions', hasMenu: true },
  { label: 'Learn', hasMenu: true },
  { label: 'Services', hasMenu: true },
  { label: 'Support', hasMenu: true },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          Voguify
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-1 text-[#1c1b18]/90 transition hover:text-black"
            >
              {item.label}
              {item.hasMenu && <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-lg border-black/20 px-5 font-bold"
          >
            Log in
          </Button>
          <Button className="rounded-lg bg-[#bff24d] px-5 font-bold text-black shadow-none hover:bg-[#aee63f]">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
