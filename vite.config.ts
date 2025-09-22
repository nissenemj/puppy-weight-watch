
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // IONOS serves from domain root, no subpath needed
  base: '/',
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  css: {
    // Ensure proper CSS processing
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Simplified chunking for production reliability
          if (id.includes('node_modules')) {
            // IMPORTANT: Exclude Storybook from production build
            if (id.includes('@storybook') || id.includes('storybook')) {
              return; // Don't include in any chunk
            }

            // Core React libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }

            // UI libraries
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }

            // Database and queries
            if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
              return 'data-vendor';
            }

            // Charts and heavy libraries
            if (id.includes('recharts') || id.includes('framer-motion') ||
                id.includes('html-to-image') || id.includes('tesseract') ||
                id.includes('react-player')) {
              return 'heavy-vendor';
            }

            // Everything else
            return 'vendor';
          }
        },
      },
      // Exclude Storybook files from production build
      external: mode === 'production' ? [/@storybook/] : [],
    },
    chunkSizeWarningLimit: 500, // Lower limit to enforce smaller chunks
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for production debugging
        drop_debugger: mode === 'production',
      },
    },
  },
  optimizeDeps: {
    // Let Vite handle React automatically - include only non-core libraries
    include: [
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'react-helmet-async',
      'lucide-react'
    ],
  },
}));
