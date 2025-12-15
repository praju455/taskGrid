import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Support both PostgreSQL and MongoDB
const storageType = process.env.STORAGE || 'mongo';

let pool: Pool | null = null;
let dbInstance: any = null;

if (storageType === 'postgres') {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for PostgreSQL storage");
  }

  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  dbInstance = drizzle({ client: pool, schema });
}

export const db = dbInstance;
