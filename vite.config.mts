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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Strictly isolate heavy packages that belong to lazy-loaded routes
          if (id.includes('@tiptap') || id.includes('prosemirror')) {
            return 'vendor-tiptap';
          }
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) {
            return 'vendor-charts';
          }
          if (id.includes('@supabase')) {
            return 'vendor-supabase';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
