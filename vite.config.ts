import { fileURLToPath, URL } from 'node:url'
import * as path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [vue(), VueDevTools()],
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: {
      cert: path.resolve(__dirname, './localhost.pem'),
      key: path.resolve(__dirname, './localhost-key.pem')
    },
    hmr: true
  }
})
