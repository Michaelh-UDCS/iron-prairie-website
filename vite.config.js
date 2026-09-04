import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    legalComments: 'none'
  },
  server: {
    port: 5173
  },
  build: {
    target: 'es2022',
    cssMinify: true,
    modulePreload: {
      resolveDependencies(filename, deps) {
        return deps.filter(
          (dep) => !dep.includes('firebase') && !dep.includes('analytics') && !dep.includes('stripe')
        );
      }
    },
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
