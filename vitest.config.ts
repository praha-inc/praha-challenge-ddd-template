import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    mockReset: true,
    clearMocks: true,
    restoreMocks: true,
    env: {
      DB_HOST: "localhost",
      DB_PORT: "5432",
      DB_USER: "postgres",
      DB_PASSWORD: "password",
      DB_NAME: "database",
    },
  },
});
