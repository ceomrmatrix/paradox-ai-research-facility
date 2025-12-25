import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({

  base: '/paradox-ai-research-facility/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
});
