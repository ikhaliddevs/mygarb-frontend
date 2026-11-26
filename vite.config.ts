import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // Original designs and uploads are references, never public build assets.
  publicDir: false,
  server: { host: 'localhost', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1' },
  test: {
    environment: 'jsdom',
    env: { VITE_API_BASE_URL: 'http://localhost:5000/api' },
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/shared/config/**', 'src/services/api/**'],
      exclude: ['**/*.test.*'],
      reporter: ['text', 'html'],
    },
  },
});
