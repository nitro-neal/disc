import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite already provides history fallback for SPA routes in development.
// For production (e.g., Vercel / Netlify / GitHub Pages), make sure the
// hosting platform rewrites all non-asset requests to /index.html.

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    server: {
      host: true,
      hmr: {
        overlay: true,
      },
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
  }
})