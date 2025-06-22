import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Optional: You can enable cartographer only locally, not in CI/CD
const isReplit = process.env.REPL_ID !== undefined;
const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    // Don't include cartographer on production environments like Render
    ...(isReplit && !isProduction
      ? [require("@replit/vite-plugin-cartographer").cartographer()]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve("client/src"),
      "@shared": path.resolve("shared"),
      "@assets": path.resolve("attached_assets"),
    },
  },
  root: "client",
  build: {
    outDir: path.resolve("dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tabs",
          ],
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
