import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures assets load cleanly on GitHub Pages (/<repo-name>/) or custom domains
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
