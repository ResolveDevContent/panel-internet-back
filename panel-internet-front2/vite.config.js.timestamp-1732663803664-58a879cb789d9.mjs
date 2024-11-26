// vite.config.js
import { defineConfig } from "file:///D:/TechFix/Programacion/Resolve%20dev/panel-internet/panel-internet-back/panel-internet-front2/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///D:/TechFix/Programacion/Resolve%20dev/panel-internet/panel-internet-back/panel-internet-front2/node_modules/vite-plugin-pwa/dist/index.js";
import react from "file:///D:/TechFix/Programacion/Resolve%20dev/panel-internet/panel-internet-back/panel-internet-front2/node_modules/@vitejs/plugin-react/dist/index.mjs";
var manifestForPlugin = {
  registerType: "autoUpdate",
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
  manifest: {
    name: "WI-NET - Servicio de Internet",
    short_name: "WI-NET",
    theme_color: "#ffffff",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  }
};
var vite_config_default = defineConfig({
  plugins: [
    react(),
    VitePWA(manifestForPlugin)
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxUZWNoRml4XFxcXFByb2dyYW1hY2lvblxcXFxSZXNvbHZlIGRldlxcXFxwYW5lbC1pbnRlcm5ldFxcXFxwYW5lbC1pbnRlcm5ldC1iYWNrXFxcXHBhbmVsLWludGVybmV0LWZyb250MlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVGVjaEZpeFxcXFxQcm9ncmFtYWNpb25cXFxcUmVzb2x2ZSBkZXZcXFxccGFuZWwtaW50ZXJuZXRcXFxccGFuZWwtaW50ZXJuZXQtYmFja1xcXFxwYW5lbC1pbnRlcm5ldC1mcm9udDJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1RlY2hGaXgvUHJvZ3JhbWFjaW9uL1Jlc29sdmUlMjBkZXYvcGFuZWwtaW50ZXJuZXQvcGFuZWwtaW50ZXJuZXQtYmFjay9wYW5lbC1pbnRlcm5ldC1mcm9udDIvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgeyBWaXRlUFdBIH0gZnJvbSBcInZpdGUtcGx1Z2luLXB3YVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5cclxuY29uc3QgbWFuaWZlc3RGb3JQbHVnaW4gPSB7XHJcbiAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXHJcbiAgaW5jbHVkZUFzc2V0czogWydmYXZpY29uLmljbycsICdhcHBsZS10b3VjaC1pY29uLnBuZycsICdtYXNrLWljb24uc3ZnJ10sXHJcbiAgbWFuaWZlc3Q6IHtcclxuICAgIG5hbWU6ICdXSS1ORVQgLSBTZXJ2aWNpbyBkZSBJbnRlcm5ldCcsXHJcbiAgICBzaG9ydF9uYW1lOiAnV0ktTkVUJyxcclxuICAgIHRoZW1lX2NvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICBpY29uczogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAncHdhLTY0eDY0LnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnNjR4NjQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdwd2EtMTkyeDE5Mi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzE5MngxOTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBzcmM6ICdwd2EtNTEyeDUxMi5wbmcnLFxyXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcclxuICAgICAgICAgICAgcHVycG9zZTogJ2FueSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgc3JjOiAnbWFza2FibGUtaWNvbi01MTJ4NTEyLnBuZycsXHJcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxyXG4gICAgICAgICAgICBwdXJwb3NlOiAnbWFza2FibGUnXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICB9LCBcclxufVxyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgVml0ZVBXQShtYW5pZmVzdEZvclBsdWdpbilcclxuICBdXHJcbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzZCxTQUFTLG9CQUFvQjtBQUNuZixTQUFTLGVBQWU7QUFDeEIsT0FBTyxXQUFXO0FBRWxCLElBQU0sb0JBQW9CO0FBQUEsRUFDeEIsY0FBYztBQUFBLEVBQ2QsZUFBZSxDQUFDLGVBQWUsd0JBQXdCLGVBQWU7QUFBQSxFQUN0RSxVQUFVO0FBQUEsSUFDUixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixhQUFhO0FBQUEsSUFDYixPQUFPO0FBQUEsTUFDSDtBQUFBLFFBQ0ksS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLE1BQ1Y7QUFBQSxNQUNBO0FBQUEsUUFDSSxLQUFLO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxNQUFNO0FBQUEsTUFDVjtBQUFBLE1BQ0E7QUFBQSxRQUNJLEtBQUs7QUFBQSxRQUNMLE9BQU87QUFBQSxRQUNQLE1BQU07QUFBQSxRQUNOLFNBQVM7QUFBQSxNQUNiO0FBQUEsTUFDQTtBQUFBLFFBQ0ksS0FBSztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQ1AsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ2I7QUFBQSxJQUNKO0FBQUEsRUFDRjtBQUNGO0FBR0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUSxpQkFBaUI7QUFBQSxFQUMzQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
