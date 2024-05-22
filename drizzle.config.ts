import { defineConfig } from "drizzle-kit";
import { getCredentials } from "./src/libs/drizzle/get-credentials";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/libs/drizzle/schema.ts",
  out: "./src/libs/drizzle/migrations",
  dbCredentials: (() => {
    const credentials = getCredentials();
    return {
      host: credentials.DB_HOST,
      port: credentials.DB_PORT,
      username: credentials.DB_USER,
      password: credentials.DB_PASSWORD,
      database: credentials.DB_NAME,
    };
  })(),
});
