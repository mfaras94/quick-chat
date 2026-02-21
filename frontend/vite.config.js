import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.png",
        "android/*.png",
        "ios/*.png",
      ],
      manifest: {
        id: "/",
        name: "QuickChat",
        short_name: "QuickChat",
        description: "Real-time chat app",
        theme_color: "#10b981",
        background_color: "#18181b",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/android/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/ios/192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/ios/512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ]
      }
    })
  ],
})
