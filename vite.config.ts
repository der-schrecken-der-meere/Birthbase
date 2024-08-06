import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import { internalIpV4 } from "internal-ip";

// const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envPrefix: ['VITE_', 'TAURI_PLATFORM', 'TAURI_ARCH', 'TAURI_FAMILY', 'TAURI_PLATFORM_VERSION', 'TAURI_PLATFORM_TYPE', 'TAURI_DEBUG'],

//   // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
//   //
//   // 1. prevent vite from obscuring rust errors
  clearScreen: false,
//   // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
//     host: mobile ? "0.0.0.0" : false,
    // hmr: mobile
//       ? {
//           protocol: "ws",
//           host: await internalIpV4(),
//           port: 1421,
//         }
//       : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
//   build: {
    // target: ["es2021", "chrome126", "safari13"],
    // minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // sourcemap: true/*!!process.env.TAURI_DEBUG*/,
//   }
}))