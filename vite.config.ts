
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
          // Vendor libraries
          if (id.includes('node_modules')) {
            // Core React chunk (keep small for initial load)
            if (id.includes('react') && !id.includes('router') && !id.includes('query') && !id.includes('hook-form')) {
              return 'react-core';
            }
            
            // Router (loaded when needed)
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            
            // UI components (split by usage frequency)
            if (id.includes('@radix-ui/react-dialog') || 
                id.includes('@radix-ui/react-toast') || 
                id.includes('@radix-ui/react-slot') ||
                id.includes('@radix-ui/react-label')) {
              return 'ui-core-vendor'; // Essential UI
            }
            
            if (id.includes('@radix-ui')) {
              return 'ui-extended-vendor'; // Extended UI components
            }
            
            // Charts (heavy, load when needed)
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            
            // Animations (load when needed) 
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            
            // Forms (used on specific pages)
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            
            // Database
            if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
              return 'data-vendor';
            }
            
            // Icons (load when needed)
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons-vendor';
            }
            
            // Utilities (essential)
            if (id.includes('clsx') || id.includes('class-variance-authority') || id.includes('tailwind-merge')) {
              return 'utils-vendor';
            }
            
            // Date utilities (specific pages)
            if (id.includes('date-fns')) {
              return 'date-vendor';
            }
            
            // Large libraries that can be lazy loaded
            if (id.includes('html-to-image') || id.includes('tesseract') || id.includes('react-player')) {
              return 'heavy-vendor';
            }
            
            // Everything else
            return 'vendor';
          }
          
          // Application code splitting by feature
          if (id.includes('/src/')) {
            // PuppyBook feature (large, can be lazy loaded)
            if (id.includes('/PuppyBook/') || id.includes('PuppyBook')) {
              return 'feature-puppybook';
            }
            
            // Weight tracking (core feature)
            if (id.includes('weight-tracking') || id.includes('WeightTracker') || id.includes('WeightChart')) {
              return 'feature-weight';
            }
            
            // Food calculator (important feature)
            if (id.includes('FoodCalculator') || id.includes('food-calculation')) {
              return 'feature-calculator';
            }
            
            // Admin/management features (rarely used)
            if (id.includes('/admin/') || id.includes('Admin')) {
              return 'feature-admin';
            }
            
            // UI components (shared)
            if (id.includes('/ui/') || id.includes('/components/ui/')) {
              return 'app-ui';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Lower limit to enforce smaller chunks
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
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
      'lucide-react',
      'framer-motion',
    ],
  },
}));
