// lib/db.ts
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Reuse a single Neon instance across hot reloads in dev
const globalForNeon = global as unknown as { sql?: ReturnType<typeof neon> };

export const sql = globalForNeon.sql ?? neon(process.env.DATABASE_URL);

if (!globalForNeon.sql) globalForNeon.sql = sql;
