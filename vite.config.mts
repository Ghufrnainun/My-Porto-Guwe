import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('framer-motion')) return 'vendor-motion';
          if (id.includes('@radix-ui')) return 'vendor-radix';
          if (id.includes('@tanstack')) return 'vendor-query';
          if (id.includes('lucide-react')) return 'vendor-icons';
          if (
            /node_modules[/\\](react|react-dom|scheduler|react-router|react-router-dom)[/\\]/.test(
              id,
            )
          ) {
            return 'vendor-react';
          }
        },
      },
    },
  },
}));
