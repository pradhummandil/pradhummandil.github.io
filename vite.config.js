import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: true,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  }
});
