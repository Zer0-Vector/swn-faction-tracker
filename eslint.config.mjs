import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import reactPlugin from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores(["**/*.stories.*", "**/*.test.*", "storybook-static/"]),
  js.configs.recommended,
  tseslint.configs.strict,
  compat.config(reactPlugin.configs.recommended),
  {
    files: ["src/**/*.{ts,tsx}"],
    settings: {
      "react": {
        version: "detect",
      }
    },
    plugins: {
      "react": reactPlugin,
      "@typescript-eslint": tseslint.plugin,
      "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "script",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
      },
    },

    rules: {
      "no-extra-semi": "error",
      "padded-blocks": ["warn", {
        blocks: "never",
        classes: "always",
        switches: "never",
      }],

      "one-var": ["error", "never"],
      "no-empty-pattern": "off",
      "no-unexpected-multiline": "error",
      "eol-last": ["error", "always"],
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "no-useless-computed-key": "off",
      "simple-import-sort/imports": ["warn", {
        groups: [
          ["^react$", "^[a-z]"],
          ["^@"],
          ["^~"],
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          ["^.+\\.s?css$"],
          ["^\\u0000"],
        ],
      }],

      "simple-import-sort/exports": "warn",
      "prefer-const": "warn",
    },
  }
]);
