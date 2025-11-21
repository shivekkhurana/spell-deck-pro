/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ANTHROPIC_API_KEY: string;
  readonly SPELL_CHECK_MODEL: string;
  readonly SPELL_CHECK_DEBOUNCE_MS: string;
  readonly MAX_SPELL_CHECKS_PER_MINUTE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
