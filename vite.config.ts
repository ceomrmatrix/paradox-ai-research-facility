import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // This must match your sub-folder name on GitHub Pages
  base: '/paradox-ai-research-facility/', 
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    // Ensures assets are found correctly in the sub-folder
    assetsDir: 'assets',
  }
});
