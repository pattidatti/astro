import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: { outDir: 'dist' },
  server: {
    port: 5173,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    }
  },
  preview: {
    port: 4173,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    }
  }
});
