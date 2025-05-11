import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/infosaudeteste/', // 👈 ESSENCIAL PARA GITHUB PAGES
  plugins: [react()],
})
