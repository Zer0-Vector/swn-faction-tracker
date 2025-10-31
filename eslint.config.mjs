import { defineConfig, globalIgnores } from "eslint/config";
import reactPlugin from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import configPrettier from "eslint-config-prettier";
import sonarjs from "eslint-plugin-sonarjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/*.stories.*",
    "**/*.test.*",
    "storybook-static/",
    "build/",
    ".storybook/",
  ]),
  js.configs.recommended,
  tseslint.configs.strict,
  compat.config(reactPlugin.configs.recommended),
  configPrettier,
  {
    files: ["src/**/*.{ts,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      react: reactPlugin,
      "@typescript-eslint": tseslint.plugin,
      "simple-import-sort": simpleImportSort,
      // cSpell:ignore sonarjs
      sonarjs: sonarjs,
    },

    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        document: "readonly",
        console: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
      },
    },

    rules: {
      "one-var": ["error", "never"],
      "no-empty-pattern": "off",
      "no-empty-function": "off",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "no-useless-computed-key": "off",
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^react$", "^[a-z]"],
            ["^@"],
            ["^~"],
            [String.raw`^\.\.(?!/?$)`, String.raw`^\.\./?$`],
            [String.raw`^.+\.s?css$`],
            [String.raw`^\u0000`],
          ],
        },
      ],

      "simple-import-sort/exports": "warn",
      "prefer-const": "warn",
      "complexity": ["warn", { max: 10 }],
      "max-lines-per-function": ["warn", { max: 128 }],
      "sonarjs/cognitive-complexity": ["warn", 10],
    },
  },
]);
