import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  server: {
    fs: {
      strict: false, // Permite acessar arquivos fora da raiz do projeto
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
})
