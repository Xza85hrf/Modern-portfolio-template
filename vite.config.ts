import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path, { dirname } from "path";
import checker from "vite-plugin-checker";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), checker({ typescript: true, overlay: false })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@db": path.resolve(__dirname, "db"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: "../dist",  // Relative to root (client/), outputs to project root /dist
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV !== 'production', // Disable source maps in production
    chunkSizeWarningLimit: 600, // Increase limit to 600KB (default is 500KB)
    rollupOptions: {
      // Suppress eval warning from lottie-web (known issue, safe in this context)
      onwarn(warning, warn) {
        if (warning.code === 'EVAL' && warning.id?.includes('lottie-web')) {
          return; // Suppress lottie-web eval warnings
        }
        warn(warning);
      },
      output: {
        manualChunks: {
          // Separate heavy animation libraries
          "framer-motion": ["framer-motion"],
          "gsap": ["gsap", "@gsap/react"],
          // Separate Lottie animation library
          "lottie": ["lottie-react", "lottie-web"],
          // Separate particle system
          "particles": ["@tsparticles/react", "@tsparticles/slim", "@tsparticles/engine"],
          // Group Radix UI components
          "radix": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
          ],
          // Separate TipTap editor (loaded only in admin)
          "editor": ["@tiptap/react", "@tiptap/starter-kit"],
          // Separate charting library
          "charts": ["recharts"],
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT ? parseInt(process.env.PORT) : 5000, // Use PORT env var or default to 5000
    strictPort: false, // Allow finding an available port if specified port is in use
    proxy: {
      // Proxy API requests to Express server
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
