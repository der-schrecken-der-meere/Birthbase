import { defineConfig, loadEnv } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_ENV_HOST;
const mobile = process.env.TAURI_ENV_PLATFORM;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isPreview }) => {
  return {
    publicDir: "public",
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]]
        }
      }),
      tailwindcss(),
    ],
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
      host: mobile === "android" ? '0.0.0.0' : (host || false),
      // host: mobile === (host || false),
      port: 1420,
      strictPort: true,
  //     host: mobile ? "0.0.0.0" : false,
      hmr: host
        ? {
            protocol: "ws",
            host: host,
            port: 1430,
          }
        : undefined,
      watch: {
        // 3. tell vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext"
      }
    },
    build: {
      rollupOptions: {
        output: {
          format: "es"
        }
      },
      target: "esnext",
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      sourcemap: true/*!!process.env.TAURI_DEBUG*/,
    },
    worker: {
      format: "es",
    }
  }
})