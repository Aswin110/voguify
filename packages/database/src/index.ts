import { PrismaClient } from '@prisma/client';

// Re-export all Prisma types/enums so consumers import everything from
// `@voguify/database` (e.g. `import { Prisma, User } from '@voguify/database'`).
export * from '@prisma/client';

// A single shared PrismaClient instance. Reusing one client avoids exhausting
// database connections during hot-reload (Next.js) or in serverless contexts.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
