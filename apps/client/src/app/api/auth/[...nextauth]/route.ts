import { handlers } from '@/auth';

// Auth.js mounts all of its endpoints (sign-in, callbacks, sign-out, the
// magic-link verification, etc.) under /api/auth/*.
export const { GET, POST } = handlers;

// Prisma (the session/adapter store) needs the Node.js runtime, not edge.
export const runtime = 'nodejs';

// Auth endpoints are inherently request-time; never try to statically render.
export const dynamic = 'force-dynamic';
