import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // This ensures assets load from the correct repo subfolder
  base: '/paradox-ai-research-facility/', 
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      // Allows imports using the '@' symbol to point to root
      '@': path.resolve(__dirname, '.'),
    }
  }
});
