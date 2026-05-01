import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/singlestore/driver';

const isLocal = process.env.NEON_LOCAL === 'true' || process.env.NODE_ENV !== 'production';

if (isLocal) {
  neonConfig.fetchEndpoint = `http://${process.env.NEON_LOCAL_HOST || 'neon-local'}:${process.env.NEON_LOCAL_PORT || 5432}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

export { db, sql };
