# Voguify

A pnpm-workspaces monorepo.

| Path                 | Stack                                              |
| -------------------- | -------------------------------------------------- |
| `apps/client`        | Next.js 15 (App Router, TypeScript, Tailwind CSS)  |
| `apps/server`        | NestJS 11                                          |
| `packages/database`  | Prisma 6 schema + generated client (PostgreSQL)    |

`packages/database` is the single source of truth for the data layer. It is
consumed by both the server and the client as `@voguify/database`:

```ts
import { prisma, PrismaClient, type User } from '@voguify/database';
```

## Prerequisites

- Node.js >= 22 (`.nvmrc`)
- pnpm 10
- A PostgreSQL database (use `docker compose up -d`, or any Postgres instance)

## Getting started

```bash
# 1. install all workspace dependencies
pnpm install

# 2. configure environment (two files use DATABASE_URL)
cp packages/database/.env.example packages/database/.env   # Prisma CLI
cp apps/server/.env.example apps/server/.env               # server runtime
cp apps/client/.env.example apps/client/.env.local         # client → API URL

# 3. start postgres (requires Docker) — or point DATABASE_URL at your own DB
pnpm db:up

# 4. build the shared client, then run the first migration
pnpm db:build
pnpm db:migrate

# 5. run client + server together
pnpm dev
```

- Client → http://localhost:3000
- Server → http://localhost:4000/api (health check at `/api/health`)

## How the shared Prisma package works

- `packages/database` owns `prisma/schema.prisma` and compiles a small wrapper
  (`src/index.ts`) to `dist/` (CommonJS + types).
- It re-exports everything from `@prisma/client` plus a shared `prisma`
  singleton.
- The **server** wraps it in a NestJS `PrismaService`
  (`apps/server/src/prisma`). The **client** can import `prisma` directly from
  server components / route handlers (Prisma is marked as a
  `serverExternalPackage` in `next.config.mjs`).
- `pnpm build` builds in topological order, so `@voguify/database` is always
  built before the apps that depend on it.

> After changing `schema.prisma`, run `pnpm db:generate` (or `pnpm db:migrate`)
> followed by `pnpm db:build` to refresh the generated client + types.

## Useful scripts (run from the repo root)

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Build the db package, then run client+server |
| `pnpm dev:client`  | Run only the Next.js app                     |
| `pnpm dev:server`  | Run only the NestJS app                      |
| `pnpm build`       | Build all packages (topological order)       |
| `pnpm db:build`    | Generate the Prisma client + compile package |
| `pnpm db:migrate`  | Create/apply a Prisma migration (dev)        |
| `pnpm db:studio`   | Open Prisma Studio                           |
| `pnpm db:up`       | Start the Postgres container                 |
