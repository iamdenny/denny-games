import { defineConfig } from 'vite';

export default defineConfig({
  base: '/portfolio/sokoban/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
