import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { VitePWA } from 'vite-plugin-pwa';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  server: { port: 8765, host: true, strictPort: true },
  preview: { port: 8765, host: true, strictPort: true },
  plugins: [svelte(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
    manifest: {
      name: 'Microset · 10 min/jour',
      short_name: 'Microset',
      description: 'Microset — programme 10 min/jour au poids du corps. Streak, progrès, mobilité.',
      theme_color: '#0a0e14',
      background_color: '#0a0e14',
      display: 'standalone',
      orientation: 'portrait',
      lang: 'fr',
      start_url: '/',
      icons: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      navigateFallback: '/index.html',
      globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
    },
    devOptions: { enabled: false },
  }), cloudflare()],
});