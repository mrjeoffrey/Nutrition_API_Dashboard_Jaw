
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"


export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development',
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': 'https://nut-api.catacomb.fyi',
      '/v1_1': 'https://nut-api.catacomb.fyi'
    }
  }
}))
