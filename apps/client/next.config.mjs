import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Next only auto-loads .env from this app's folder, so load the shared root
// .env explicitly and expose the public vars the app needs.
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../');
config({ path: resolve(rootDir, '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep Prisma out of the bundle so its query engine resolves correctly at
  // runtime when used from server components / route handlers.
  serverExternalPackages: ['@prisma/client', '@voguify/database'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
