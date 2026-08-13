import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Served from https://wemerson123.github.io/mb-barbershop-landing/.
  // Change to '/' if this ever moves to its own domain.
  base: '/mb-barbershop-landing/',
  build: {
    // GitHub Pages (classic) serves this repo from master:/docs.
    outDir: 'docs',
    emptyOutDir: true,
  },
  server: {
    port: 5202,
    strictPort: true,
  },
});
