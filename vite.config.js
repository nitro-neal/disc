import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    server: {
      host: true,
      hmr: {
        overlay: true
      },
      watch: {
        usePolling: true,
        interval: 100
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
  }

  // Only set base path for production builds (GitHub Pages)
  if (command !== 'serve') {
    config.base = '/disc/'
  }

  return config
})
