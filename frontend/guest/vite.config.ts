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
              name: 'router-query',
              test: /[\\/]node_modules[\\/](?:@tanstack[\\/]react-query|react-router|react-router-dom)[\\/]/,
            },
            {
              name: 'forms-validation',
              test: /[\\/]node_modules[\\/](?:@hookform[\\/]resolvers|libphonenumber-js|react-hook-form|zod)[\\/]/,
            },
            {
              name: 'floating-ui',
              test: /[\\/]node_modules[\\/]@floating-ui[\\/]/,
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
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  server: {
    port: 3002,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
