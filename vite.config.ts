import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1600,
    target: 'esnext' //browsers can handle the latest ES features
  },
  server: {
    proxy: {
      "/api/spotify": "http://localhost:5000"
    }
  },
  plugins: [react()],
})
