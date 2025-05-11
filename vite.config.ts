
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
      '/api': 'http://localhost:5000',
      '/v1_1': 'http://localhost:5000'
    }
  }
}))
