import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./Routes",
      generatedRouteTree: "./Routes/routeTree.gen.ts",
      routeFileIgnorePattern: "(router|routeTree.gen)\\.(tsx?|js)$",
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  build: {
    outDir: "dist",
  },
});
