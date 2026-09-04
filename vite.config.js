import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            if (id.includes('analytics')) return 'analytics';
            return;
          }
          if (id.includes('firebase')) return 'firebase';
          if (id.includes('@stripe') || id.includes('stripe')) return 'stripe';
          if (id.includes('lucide-react')) return 'lucide';
          if (id.includes('react-router')) return 'router';
          if (id.includes('react-dom') || id.includes('/react/')) return 'react-vendor';
        }
      }
    }
  }
});
