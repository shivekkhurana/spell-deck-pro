/// <reference types="vite/client" />
/// <reference types="bun-types" />

interface ImportMetaEnv {
  readonly VITE_ANTHROPIC_API_KEY: string;
  readonly VITE_SPELL_CHECK_MODEL: string;
  readonly VITE_SPELL_CHECK_DEBOUNCE_MS: string;
  readonly VITE_MAX_SPELL_CHECKS_PER_MINUTE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
