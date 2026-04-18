import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      mode === 'production' ? 'https://api.chat.mathmex.com' : 'http://127.0.0.1:8010/api'
    ),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mathlive: ['mathlive'],
          katex: ['katex'],
        },
      },
    },
  },
}))
