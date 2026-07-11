import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { auth, signOut } from '@/auth';
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

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

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
          {user ? (
            <>
              <span className="hidden text-sm font-semibold text-black/70 sm:inline">
                {user.name ?? user.email}
              </span>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded-lg border-black/20 px-5 font-bold"
                >
                  Log out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="rounded-lg border-black/20 px-5 font-bold"
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="rounded-lg bg-[#bff24d] px-5 font-bold text-black shadow-none hover:bg-[#aee63f]"
              >
                <Link href="/login">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
