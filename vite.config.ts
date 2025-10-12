import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // IONOS serves from domain root, no subpath needed
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: false,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  css: {
    // Ensure proper CSS processing
    modules: {
      localsConvention: "camelCase",
    },
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
  build: {
    rollupOptions: {
      // CRITICAL FIX: Disable manual chunking to avoid circular dependency issues
      // Let Vite handle the chunking automatically
      output: {
        // Remove manual chunks to fix initialization errors
      },
      // Exclude Storybook files from production build
      external: mode === "production" ? [/@storybook/] : [],
    },
    chunkSizeWarningLimit: 1000,
    // Use esbuild for reliable minification
    minify: "esbuild",
  },
  optimizeDeps: {
    // Explicitly include React to ensure proper dependency resolution
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react-router-dom",
      "@tanstack/react-query",
      "@supabase/supabase-js",
      "react-helmet-async",
      "lucide-react",
    ],
  },
}));
