import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa";
import react from '@vitejs/plugin-react';

const manifestForPlugin = {
  registerType: "prompt",
  includesAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
  manifest: {
    "name": "WI-NET - Servicio de Internet",
    "short_name": "WI-NET",
    "description": "Aplicación de WI-NET para facilitar la visualización de datos",
    "icons": [
      {
        "src": "src/assets/images/windows11/SmallTile.scale-100.png",
        "sizes": "71x71"
      },
      {
        "src": "src/assets/images/windows11/SmallTile.scale-125.png",
        "sizes": "89x89"
      },
      {
        "src": "src/assets/images/windows11/SmallTile.scale-150.png",
        "sizes": "107x107"
      },
      {
        "src": "src/assets/images/windows11/SmallTile.scale-200.png",
        "sizes": "142x142"
      },
      {
        "src": "src/assets/images/windows11/SmallTile.scale-400.png",
        "sizes": "284x284"
      },
      {
        "src": "src/assets/images/windows11/Square150x150Logo.scale-100.png",
        "sizes": "150x150"
      },
      {
        "src": "src/assets/images/windows11/Square150x150Logo.scale-125.png",
        "sizes": "188x188"
      },
      {
        "src": "src/assets/images/windows11/Square150x150Logo.scale-150.png",
        "sizes": "225x225"
      },
      {
        "src": "src/assets/images/windows11/Square150x150Logo.scale-200.png",
        "sizes": "300x300"
      },
      {
        "src": "src/assets/images/windows11/Square150x150Logo.scale-400.png",
        "sizes": "600x600"
      },
      {
        "src": "src/assets/images/windows11/Wide310x150Logo.scale-100.png",
        "sizes": "310x150"
      },
      {
        "src": "src/assets/images/windows11/Wide310x150Logo.scale-125.png",
        "sizes": "388x188"
      },
      {
        "src": "src/assets/images/windows11/Wide310x150Logo.scale-150.png",
        "sizes": "465x225"
      },
      {
        "src": "src/assets/images/windows11/Wide310x150Logo.scale-200.png",
        "sizes": "620x300"
      },
      {
        "src": "src/assets/images/windows11/Wide310x150Logo.scale-400.png",
        "sizes": "1240x600"
      },
      {
        "src": "src/assets/images/windows11/LargeTile.scale-100.png",
        "sizes": "310x310"
      },
      {
        "src": "src/assets/images/windows11/LargeTile.scale-125.png",
        "sizes": "388x388"
      },
      {
        "src": "src/assets/images/windows11/LargeTile.scale-150.png",
        "sizes": "465x465"
      },
      {
        "src": "src/assets/images/windows11/LargeTile.scale-200.png",
        "sizes": "620x620"
      },
      {
        "src": "src/assets/images/windows11/LargeTile.scale-400.png",
        "sizes": "1240x1240"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.scale-100.png",
        "sizes": "44x44"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.scale-125.png",
        "sizes": "55x55"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.scale-150.png",
        "sizes": "66x66"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.scale-200.png",
        "sizes": "88x88"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.scale-400.png",
        "sizes": "176x176"
      },
      {
        "src": "src/assets/images/windows11/StoreLogo.scale-100.png",
        "sizes": "50x50"
      },
      {
        "src": "src/assets/images/windows11/StoreLogo.scale-125.png",
        "sizes": "63x63"
      },
      {
        "src": "src/assets/images/windows11/StoreLogo.scale-150.png",
        "sizes": "75x75"
      },
      {
        "src": "src/assets/images/windows11/StoreLogo.scale-200.png",
        "sizes": "100x100"
      },
      {
        "src": "src/assets/images/windows11/StoreLogo.scale-400.png",
        "sizes": "200x200"
      },
      {
        "src": "src/assets/images/windows11/SplashScreen.scale-100.png",
        "sizes": "620x300"
      },
      {
        "src": "src/assets/images/windows11/SplashScreen.scale-125.png",
        "sizes": "775x375"
      },
      {
        "src": "src/assets/images/windows11/SplashScreen.scale-150.png",
        "sizes": "930x450"
      },
      {
        "src": "src/assets/images/windows11/SplashScreen.scale-200.png",
        "sizes": "1240x600"
      },
      {
        "src": "src/assets/images/windows11/SplashScreen.scale-400.png",
        "sizes": "2480x1200"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-16.png",
        "sizes": "16x16"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-20.png",
        "sizes": "20x20"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-24.png",
        "sizes": "24x24"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-30.png",
        "sizes": "30x30"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-32.png",
        "sizes": "32x32"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-36.png",
        "sizes": "36x36"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-40.png",
        "sizes": "40x40"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-44.png",
        "sizes": "44x44"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-48.png",
        "sizes": "48x48"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-60.png",
        "sizes": "60x60"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-64.png",
        "sizes": "64x64"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-72.png",
        "sizes": "72x72"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-80.png",
        "sizes": "80x80"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-96.png",
        "sizes": "96x96"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.targetsize-256.png",
        "sizes": "256x256"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",
        "sizes": "16x16"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",
        "sizes": "20x20"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",
        "sizes": "24x24"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",
        "sizes": "30x30"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",
        "sizes": "32x32"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",
        "sizes": "36x36"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",
        "sizes": "40x40"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",
        "sizes": "44x44"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",
        "sizes": "48x48"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",
        "sizes": "60x60"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",
        "sizes": "64x64"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",
        "sizes": "72x72"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",
        "sizes": "80x80"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",
        "sizes": "96x96"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",
        "sizes": "256x256"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",
        "sizes": "16x16"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",
        "sizes": "20x20"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",
        "sizes": "24x24"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",
        "sizes": "30x30"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",
        "sizes": "32x32"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",
        "sizes": "36x36"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",
        "sizes": "40x40"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",
        "sizes": "44x44"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",
        "sizes": "48x48"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",
        "sizes": "60x60"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",
        "sizes": "64x64"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",
        "sizes": "72x72"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",
        "sizes": "80x80"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",
        "sizes": "96x96"
      },
      {
        "src": "src/assets/images/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",
        "sizes": "256x256"
      },
      {
        "src": "src/assets/images/android/android-launchericon-512-512.png",
        "sizes": "512x512"
      },
      {
        "src": "src/assets/images/android/android-launchericon-192-192.png",
        "sizes": "192x192"
      },
      {
        "src": "src/assets/images/android/android-launchericon-144-144.png",
        "sizes": "144x144"
      },
      {
        "src": "src/assets/images/android/android-launchericon-96-96.png",
        "sizes": "96x96"
      },
      {
        "src": "src/assets/images/android/android-launchericon-72-72.png",
        "sizes": "72x72"
      },
      {
        "src": "src/assets/images/android/android-launchericon-48-48.png",
        "sizes": "48x48"
      },
      {
        "src": "src/assets/images/ios/16.png",
        "sizes": "16x16"
      },
      {
        "src": "src/assets/images/ios/20.png",
        "sizes": "20x20"
      },
      {
        "src": "src/assets/images/ios/29.png",
        "sizes": "29x29"
      },
      {
        "src": "src/assets/images/ios/32.png",
        "sizes": "32x32"
      },
      {
        "src": "src/assets/images/ios/40.png",
        "sizes": "40x40"
      },
      {
        "src": "src/assets/images/ios/50.png",
        "sizes": "50x50"
      },
      {
        "src": "src/assets/images/ios/57.png",
        "sizes": "57x57"
      },
      {
        "src": "src/assets/images/ios/58.png",
        "sizes": "58x58"
      },
      {
        "src": "src/assets/images/ios/60.png",
        "sizes": "60x60"
      },
      {
        "src": "src/assets/images/ios/64.png",
        "sizes": "64x64"
      },
      {
        "src": "src/assets/images/ios/72.png",
        "sizes": "72x72"
      },
      {
        "src": "src/assets/images/ios/76.png",
        "sizes": "76x76"
      },
      {
        "src": "src/assets/images/ios/80.png",
        "sizes": "80x80"
      },
      {
        "src": "src/assets/images/ios/87.png",
        "sizes": "87x87"
      },
      {
        "src": "src/assets/images/ios/100.png",
        "sizes": "100x100"
      },
      {
        "src": "src/assets/images/ios/114.png",
        "sizes": "114x114"
      },
      {
        "src": "src/assets/images/ios/120.png",
        "sizes": "120x120"
      },
      {
        "src": "src/assets/images/ios/128.png",
        "sizes": "128x128"
      },
      {
        "src": "src/assets/images/ios/144.png",
        "sizes": "144x144"
      },
      {
        "src": "src/assets/images/ios/152.png",
        "sizes": "152x152"
      },
      {
        "src": "src/assets/images/ios/167.png",
        "sizes": "167x167"
      },
      {
        "src": "src/assets/images/ios/180.png",
        "sizes": "180x180"
      },
      {
        "src": "src/assets/images/ios/192.png",
        "sizes": "192x192"
      },
      {
        "src": "src/assets/images/ios/256.png",
        "sizes": "256x256"
      },
      {
        "src": "src/assets/images/ios/512.png",
        "sizes": "512x512"
      },
      {
        "src": "src/assets/images/ios/1024.png",
        "sizes": "1024x1024"
      }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#ffffff",
    "background_color": "#154c7a",
    "orientation": "portrait"
  },
  devOptions: {
    enabled: true,
    type: 'module'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(manifestForPlugin)
  ],
})