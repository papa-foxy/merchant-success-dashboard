import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  optimizeDeps: {
    include: ['date-fns/addYears'], // Add the specific module here
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3128',
        changeOrigin: true,
        secure: false
      }
    }
  }
});