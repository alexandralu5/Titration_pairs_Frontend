import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const pages = mode === 'pages'
  const localHttps = mode === 'https'
  const base = pages ? '/Titration_pairs_Frontend/' : '/'
  const key = new URL('./.certs/cert.key', import.meta.url)
  const cert = new URL('./.certs/cert.crt', import.meta.url)
  const hasCertificate = localHttps && existsSync(key) && existsSync(cert)
  const { LABSTER_LAN_IP } = loadEnv(mode, process.cwd(), 'LABSTER_')
  const proxy = pages ? undefined : {
    '^/api(?:/|$)': {
      target: 'http://127.0.0.1:3000',
      changeOrigin: true,
    },
    '^/minio/': {
      target: 'http://127.0.0.1:9000',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/minio/, ''),
    },
  }
  const server = {
    host: localHttps ? '0.0.0.0' : 'localhost',
    port: 3001,
    strictPort: true,
    https: hasCertificate ? { key: readFileSync(key), cert: readFileSync(cert) } : undefined,
    proxy,
  }

  return {
    base,
    plugins: [
      react(),
      localHttps && !hasCertificate && mkcert({
        hosts: LABSTER_LAN_IP ? [LABSTER_LAN_IP] : [],
        savePath: fileURLToPath(new URL('./.certs/', import.meta.url)),
      }),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'serviceWorker.ts',
        devOptions: { enabled: true, type: 'module' },
        injectManifest: {
          rollupFormat: 'iife',
          globPatterns: ['**/*.{html,js,css,svg,png,jpg,mp4,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        },
        manifest: {
          name: 'Labster',
          short_name: 'Labster',
          lang: 'ru',
          start_url: base,
          scope: base,
          display_override: ['fullscreen'],
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#000000',
          icons: [192, 512].map((size) => ({
            src: `icon-${size}.png`,
            type: 'image/png',
            sizes: `${size}x${size}`,
          })),
        },
      }),
    ],
    server,
    preview: server,
  }
})
