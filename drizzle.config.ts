import { defineConfig } from "drizzle-kit";
import { getCredentials } from "./src/libs/drizzle/get-credentials";

const credentials = getCredentials();

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/libs/drizzle/schema.ts",
  out: "./src/libs/drizzle/migrations",
  dbCredentials: {
    host: credentials.DB_HOST,
    port: credentials.DB_PORT,
    user: credentials.DB_USER,
    password: credentials.DB_PASSWORD,
    database: credentials.DB_NAME,
  },
});
