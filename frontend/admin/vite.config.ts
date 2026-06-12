import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'baseline-widely-available',
    modulePreload: {
      polyfill: false,
    },
    minify: 'oxc',
    cssMinify: 'lightningcss',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-core',
              test: /[\\/]node_modules[\\/](?:react|react-dom)[\\/]/,
            },
            {
              name: 'mantine-ui',
              test: /[\\/]node_modules[\\/](?:@mantine[\\/](?:core|dates|hooks)|dayjs)[\\/]/,
            },
            {
              name: 'query-state',
              test: /[\\/]node_modules[\\/](?:@tanstack[\\/]react-query|zustand)[\\/]/,
            },
            {
              name: 'forms-validation',
              test: /[\\/]node_modules[\\/](?:@hookform[\\/]resolvers|react-hook-form|zod)[\\/]/,
            },
            {
              name: 'http-client',
              test: /[\\/]node_modules[\\/]axios[\\/]/,
            },
            {
              name: 'icons',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            },
          ],
        },
      },
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
