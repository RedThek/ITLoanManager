import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Alias @/ → src/ requis pour les imports Shadcn du type '@/components/ui/button'
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

// https://vite.dev/config/
//export default defineConfig({
//  plugins: [react()],
//})
