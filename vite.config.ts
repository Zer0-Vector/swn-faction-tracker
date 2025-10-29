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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .split("node_modules/")[1] // get the path after node_modules
              .split("/")[0]; // get the package name
          }
          return null;
        }
      }
    }
  },
  test: {
    clearMocks: true,
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts", "dotenv/config"],
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
