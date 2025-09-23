
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

            // Core React and ALL React-dependent libraries
            // IMPORTANT: This must include anything that uses React hooks or components
            if (id.includes('react') ||
                id.includes('react-dom') ||
                id.includes('react-router') ||
                id.includes('react-hook-form') ||
                id.includes('react-helmet') ||
                id.includes('react-i18next') ||
                id.includes('react-icons') ||
                id.includes('react-share') ||
                id.includes('react-swipeable') ||
                id.includes('react-day-picker') ||
                id.includes('react-resizable') ||
                id.includes('use-') ||  // Common hook libraries
                id.includes('next-themes')) {  // Uses React context
              return 'react-vendor';
            }

            // UI libraries (Radix UI is React-based but handles its own React imports)
            if (id.includes('@radix-ui') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }

            // Database and queries
            if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
              return 'data-vendor';
            }

            // Charts and heavy libraries (these also use React but are large enough for separate chunk)
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
    // Explicitly include React to ensure proper dependency resolution
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'react-helmet-async',
      'lucide-react'
    ],
  },
}));
