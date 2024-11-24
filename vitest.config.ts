import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    alias: {
      "@test": "./test",
    },
    root: "./",
    coverage: {
      include: ["src/**"],
      exclude: ["src/main.ts", "src/metadata.ts", "src/**/*module.ts", "src/**/logger.config.ts"],
      cleanOnRerun: true,
    },
  },
  resolve: {
    alias: {
      "@test": "./test",
    },
  },
  plugins: [swc.vite()],
});
