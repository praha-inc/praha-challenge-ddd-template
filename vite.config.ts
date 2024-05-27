import { builtinModules } from "node:module";
import path from "node:path";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    lib: {
      entry: path.resolve(import.meta.dirname, "./src/index.ts"),
      fileName: () => "index.mjs",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((module) => `node:${module}`),
      ],
    },
  },
});
