import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { defineConfig } from 'vite'

// GitHub Pages project site: https://saiparla.github.io/vaji-launch/
export default defineConfig({
  base: '/vaji-launch/',
  plugins: [
    react(),
    vike({
      prerender: true,
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
})
