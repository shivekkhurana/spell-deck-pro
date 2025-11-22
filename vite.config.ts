import { readFileSync } from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vitest/config';

// Plugin to fix LRUCache import issue in @asamuzakjp/css-color
// The package uses CommonJS require() but lru-cache v11 is ESM-only with default export
const fixLRUCachePlugin = (): Plugin => ({
  name: 'fix-lru-cache',
  enforce: 'pre',
  transform(code, id) {
    // Fix the import for @asamuzakjp/css-color which uses lru-cache
    if (id.includes('@asamuzakjp/css-color')) {
      // Replace CommonJS pattern: import_lru_cache.LRUCache
      // With: (import_lru_cache.default || import_lru_cache) which handles both ESM and CJS
      let fixedCode = code;

      // Handle the specific pattern from the error
      if (code.includes('import_lru_cache.LRUCache')) {
        fixedCode = fixedCode.replace(
          /import_lru_cache\.LRUCache/g,
          '(import_lru_cache.default || import_lru_cache)'
        );
      }

      // Also handle require() patterns if present
      fixedCode = fixedCode.replace(
        /require\(['"]lru-cache['"]\)\.LRUCache/g,
        "require('lru-cache').default || require('lru-cache')"
      );

      if (fixedCode !== code) {
        return {
          code: fixedCode,
          map: null,
        };
      }
    }
  },
});

export default defineConfig({
  // @ts-expect-error - Vitest bundles its own Vite version causing type conflicts, but runtime works correctly
  plugins: [react(), tailwindcss(), fixLRUCachePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['lru-cache'],
  },
  optimizeDeps: {
    include: ['lru-cache'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  server: {
    fs: {
      // Allow serving files from node_modules for dictionary files
      allow: ['..'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
  },
});
