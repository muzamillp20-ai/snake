import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment
  // Must match the repository name: https://muzamillp20-ai.github.io/snake/
  base: "/snake/",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    // Ensure assets are correctly referenced with the base path
    assetsDir: "assets",
  },
});
