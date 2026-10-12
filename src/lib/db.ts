import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "@/db/relations";
import { env } from "@/lib/env";

const pool = new Pool({ connectionString: env.DATABASE_URL });

// Vercel Fluid compute keeps the function alive between requests; this closes idle clients before it suspends.
attachDatabasePool(pool);

export const db = drizzle({ client: pool, relations });
