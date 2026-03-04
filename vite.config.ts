import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api/weather": {
        target: "https://api.open-meteo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/weather/, "/v1"),
      },
      "/api/air-quality": {
        target: "https://air-quality-api.open-meteo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/air-quality/, "/v1"),
      },
      "/api/archive": {
        target: "https://archive-api.open-meteo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/archive/, "/v1"),
      },
      "/api/geocoding": {
        target: "https://geocoding-api.open-meteo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/geocoding/, "/v1"),
      },
      "/api/nominatim": {
        target: "https://nominatim.openstreetmap.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nominatim/, ""),
      },
      "/api/ai": {
        target: "https://ark.cn-beijing.volces.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, "/api/v3"),
      },
    },
  },
});
