import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias:
      command === "build"
        ? [
            {
              find: /^cubing(\/.*)?$/,
              replacement: "https://cdn.cubing.net/v0/js/cubing$1",
            },
          ]
        : [],
  },
}))
