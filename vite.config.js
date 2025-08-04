import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
    },
  }

  // Only set base path for production builds (GitHub Pages)
  if (command !== 'serve') {
    config.base = '/discgolfpro/'
  }

  return config
})
