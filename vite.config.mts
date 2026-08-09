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
        // Manually split large vendor chunks so the initial JS bundle is smaller.
        // Chunks are loaded lazily when their route or feature is first visited.
        manualChunks(id) {
          // Tiptap — only loaded in PostEditor (already lazy)
          if (id.includes('@tiptap')) return 'vendor-tiptap';
          // Recharts — only loaded in AdminDashboard (already lazy)
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) return 'vendor-charts';
          // Supabase client
          if (id.includes('@supabase')) return 'vendor-supabase';
          // Framer Motion — large, separate chunk
          if (id.includes('framer-motion')) return 'vendor-motion';
          // React + router — always needed, keep together
          if (id.includes('/react/') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
          // All remaining node_modules → single vendor chunk
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
    // Raise warning limit slightly (PostEditor with tiptap is inherently large)
    chunkSizeWarningLimit: 500,
  },
}));
