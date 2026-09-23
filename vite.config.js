/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4100,
    strictPort: true,
    allowedHosts: 'all',
    proxy: {
      '/storage': {
        target: `http://localhost:${process.env.API_PORT || 4101}`,
        changeOrigin: true,
      },
      '/file': {
        target: `http://localhost:${process.env.API_PORT || 4101}`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@core': path.resolve(__dirname, './src/core'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@features': path.resolve(__dirname, './src/features'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@store': path.resolve(__dirname, './src/store'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  plugins: [react()],
  base: './',
  build: {
    outDir: path.resolve(__dirname, '../api.lopon/public/react'),
    emptyOutDir: true
  }
})

