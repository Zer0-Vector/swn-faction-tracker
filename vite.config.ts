import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  build: {
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.d.ts",
        "**/*.stories.{ts,tsx}",
        "**/__mocks__/**/*.{ts,tsx}",
        "src/firebase*",
        "src/index.tsx",
        "src/reportWebVitals.ts",
        "src/types/**/*",
      ],
      reporter: [
        ["text"],
        ["html"],
        ["lcov", { projectRoot: "./src" }]
      ],
    }
  },
} as UserConfig);
