import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.svg', 'favicon.svg', 'pwa-icon.svg'],
      manifest: {
        name: 'CurrencyEx Institutional Converter',
        short_name: 'CurrencyEx',
        description: 'Live Institutional Currency Converter with 160+ currencies.',
        theme_color: '#2563eb',
        background_color: '#fcfcfd',
        display: 'standalone',
        icons: [
          {
            src: 'logo.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
})
