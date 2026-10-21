/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/frontend',
  server:{
    port: 4200,
    host: 'localhost',
    proxy: { '/api': 'http://localhost:8080' },
  },
  preview:{
    port: 4300,
    host: 'localhost',
    proxy: { '/api': 'http://localhost:8080' },
  },
  plugins: [react()],
  build: {
    outDir: '../../dist/frontend',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    name: 'frontend',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/frontend',
      provider: 'v8' as const,
    }
  },
}));
