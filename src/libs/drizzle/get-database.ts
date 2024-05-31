import { drizzle } from "drizzle-orm/postgres-js";
import memoize from "just-memoize";
import postgres from "postgres";
import { getCredentials } from "./get-credentials";
import * as schema from "./schema";

export type Database = ReturnType<typeof getDatabase>;

export const getDatabase = memoize(() => {
  const credentials = getCredentials();
  const client = postgres({
    host: credentials.DB_HOST,
    port: credentials.DB_PORT,
    username: credentials.DB_USER,
    password: credentials.DB_PASSWORD,
    database: credentials.DB_NAME,
  });

  return drizzle(client, { schema });
});
