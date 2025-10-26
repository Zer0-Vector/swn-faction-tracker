/// <reference types="vite/client" />

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_FIREBASE_CONFIG: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_FIREBASE_APPCHECK_DEBUG_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
