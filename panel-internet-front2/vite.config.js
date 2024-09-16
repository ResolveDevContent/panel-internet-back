import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react';

const manifestForPlugin = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
  manifest: {
    name: 'WI-NET - Servicio de Internet',
    short_name: 'WI-NET',
    theme_color: '#ffffff',
    icons: [
        {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
        },
        {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
        },
        {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
        },
        {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
        }
    ],
  }, 
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(manifestForPlugin)
  ]
})