import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Порт 3000 занят веб-сервисом NestJS, поэтому фронтенд запускается на 3001
    port: 3001,
    // Проксирование запросов (обход CORS)
    proxy: {
      // Веб-сервис: /api/... -> http://localhost:3000/api/...
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // S3 (MinIO): /minio/titration/img.jpg -> http://localhost:9000/titration/img.jpg
      '/minio': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/minio/, ''),
      },
    },
  },
})
