import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  base: '/cum1-nghiquyet57-tronbo4sanpham-2026/',
  optimizeDeps: {
    entries: ['index.html']
  },
  server: {
    port: 5175,
    host: '127.0.0.1',
    watch: {
      ignored: ['**/dist/**', '**/test-results/**', '**/playwright-report/**', '**/deliverables/01_Video/**']
    }
  },
  preview: {
    port: 4175,
    host: '127.0.0.1'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 900
  }
});
