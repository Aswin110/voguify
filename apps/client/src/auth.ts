import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, type Role } from "@voguify/database";

/**
 * Central Auth.js (NextAuth v5) configuration.
 *
 * - Users, accounts and sessions are persisted in Postgres via the Prisma
 *   adapter, so sign-ins create rows in our existing `User` table.
 * - Google      → one-click OAuth sign-in.
 * - Resend      → passwordless email "magic link" sign-in.
 *
 * Both providers read their credentials from env automatically:
 *   Google  → AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET
 *   Resend  → AUTH_RESEND_KEY
 * and the session cookie is signed with AUTH_SECRET.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      // Same person, one account: if someone first signed in via the email
      // magic link and later uses Google (or vice-versa) with the SAME email,
      // link Google to that existing user instead of erroring. Safe here
      // because Google verifies email ownership and so does the magic link.
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      from: process.env.AUTH_EMAIL_FROM ?? "onboarding@resend.dev",
    }),
  ],
  pages: {
    // Use our own branded pages instead of the default Auth.js screens.
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    // With the database session strategy, `user` is the full row from Postgres.
    // Surface the id and role on `session.user` so server components / route
    // handlers can gate admin features with `session.user.role === 'ADMIN'`.
    session({ session, user }) {
      session.user.id = user.id;
      // `role` is on our DB row but not on Auth.js's base AdapterUser type.
      session.user.role = (user as typeof user & { role: Role }).role;
      return session;
    },
  },
});
