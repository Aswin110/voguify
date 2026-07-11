import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth, signIn } from '@/auth';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Log in or sign up — Voguify',
};

/** Multi-color Google "G" mark (Lucide has no brand logo). */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

export default async function LoginPage() {
  // Already signed in? Send them home.
  const session = await auth();
  if (session?.user) redirect('/');

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm sm:p-10">
        <Link
          href="/"
          className="mb-8 block text-center text-2xl font-extrabold tracking-tight"
        >
          Voguify
        </Link>

        <h1 className="text-center text-2xl font-bold tracking-tight">
          Log in or sign up
        </h1>
        <p className="mt-2 text-center text-sm text-black/60">
          No password needed. New here? An account is created automatically.
        </p>

        {/* Google OAuth — a server action kicks off the redirect flow. */}
        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: '/' });
          }}
          className="mt-8"
        >
          <Button
            type="submit"
            variant="outline"
            className="h-11 w-full rounded-lg border-black/20 font-bold"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-black/10" />
          <span className="text-xs font-semibold uppercase tracking-wide text-black/40">
            or
          </span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        {/* Passwordless email magic link. */}
        <form
          action={async (formData: FormData) => {
            'use server';
            const email = String(formData.get('email') ?? '').trim();
            await signIn('resend', { email, redirectTo: '/' });
          }}
          className="space-y-3"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="h-11 w-full rounded-lg border border-black/20 bg-white px-3.5 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </div>
          <Button
            type="submit"
            className="h-11 w-full rounded-lg bg-[#bff24d] font-bold text-black shadow-none hover:bg-[#aee63f]"
          >
            Email me a sign-in link
          </Button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-black/45">
          By continuing you agree to Voguify&apos;s Terms of Service and
          Privacy Policy.
        </p>
      </div>
    </main>
  );
}
