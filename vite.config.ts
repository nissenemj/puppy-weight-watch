import { createReadStream } from "node:fs";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import site from "./src/data/sitePages.json";

function previewPages(): Plugin {
  const aliases: Record<string, string | undefined> = site.aliases;
  return {
    name: "preview-pages",
    configurePreviewServer(server) {
      const dist = path.resolve(server.config.root, server.config.build.outDir);
      server.middlewares.use((req, res, next) => {
        if (req.method !== "GET" && req.method !== "HEAD") return next();
        const url = new URL(req.url ?? "/", "http://localhost");
        const route = url.pathname.replace(/\/+$/, "") || "/";
        const alias = aliases[route];
        if (alias || route !== url.pathname) {
          res.writeHead(308, { Location: (alias ?? route) + url.search });
          return res.end();
        }
        if (Object.hasOwn(site.pages, route)) {
          req.url = (route === "/" ? "/index.html" : `${route}.html`) + url.search;
          return next();
        }
        if (site.appPaths.includes(route)) {
          req.url = "/_app.html" + url.search;
          return next();
        }
        if (path.extname(route)) return next();
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        if (req.method === "HEAD") return res.end();
        createReadStream(path.join(dist, "404.html")).pipe(res);
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // IONOS serves from domain root, no subpath needed
  base: "/",
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: false,
  },
  plugins: [react(), previewPages(), mode === "development" && componentTagger()].filter(
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
