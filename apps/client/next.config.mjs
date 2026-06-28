/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep Prisma out of the bundle so its query engine resolves correctly at
  // runtime when used from server components / route handlers.
  serverExternalPackages: ['@prisma/client', '@voguify/database'],
};

export default nextConfig;
