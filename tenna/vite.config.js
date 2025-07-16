import { defineConfig } from 'vite'

export default defineConfig({
  root: 'static', // Serve files from the 'static' directory
  server: {
    proxy: {
      // Proxy all API requests to the FastAPI backend
      '/current': 'http://127.0.0.1:8000',
      '/set-target': 'http://127.0.0.1:8000',
      '/set-rocket-position': 'http://127.0.0.1:8000',
      '/set-antenna-position': 'http://127.0.0.1:8000',
      '/stream-updates': 'http://127.0.0.1:8000',
      '/set-mode': 'http://127.0.0.1:8000',
    }
  }
}) 