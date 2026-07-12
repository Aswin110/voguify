import type { DefaultSession } from 'next-auth';
import type { Role } from '@voguify/database';

// Teach Auth.js about the extra fields we put on the session, so app code gets
// `session.user.role` / `session.user.id` type-safe. (The adapter user is read
// from Postgres and carries `role` at runtime; it's cast in the session
// callback since Auth.js's base AdapterUser type doesn't declare it.)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }
}
