import Link from 'next/link';
import { MailCheck } from 'lucide-react';

export const metadata = {
  title: 'Check your email — Voguify',
};

/**
 * Shown after a magic-link email is sent (Auth.js `verifyRequest` page).
 */
export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#bff24d]">
          <MailCheck className="h-7 w-7 text-black" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Check your email
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-black/60">
          We sent you a sign-in link. Click it to finish logging in — you can
          close this tab afterwards. The link expires in 24 hours.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-block text-sm font-semibold text-black underline underline-offset-4"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}
