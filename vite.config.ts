import { defineConfig, loadEnv } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

const host = process.env.TAURI_ENV_HOST;
const platform = process.env.TAURI_ENV_PLATFORM;

const is_mobile = (platform === "android" || platform === "ios");
const is_desktop = (platform === "windows" || platform === "linux" || platform === "macos");

const is_tauri = (is_desktop || is_mobile);

const is_linux = platform === "linux";
const is_macos = platform === "macos";
const is_windows = platform === "windows";
const is_android = platform === "android";
const is_ios = platform === "ios";

console.log(platform);

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isPreview }) => {
  return {
    define: {
      "__IS_TAURI__": is_tauri,
      "__TAURI_IS_DESKTOP__": is_desktop,
      "__TAURI_IS_MOBILE__": is_mobile,
      "__TAURI_IS_LINUX__": is_linux,
      "__TAURI_IS_MAC__": is_macos,
      "__TAURI_IS_WINDOWS__": is_windows,
      "__TAURI_IS_ANDROID__": is_android,
      "__TAURI_IS_IOS__": is_ios,
    },
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
        "@com": path.resolve(__dirname, "./src/components"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@stores": path.resolve(__dirname, "./src/stores"),
        "@features": path.resolve(__dirname, "./src/features"),
        "@apis": path.resolve(__dirname, "./src/apis"),
        "@lib": path.resolve(__dirname, "./src/lib"),
      },
    },
    envPrefix: ['VITE_', 'TAURI_PLATFORM', 'TAURI_ARCH', 'TAURI_FAMILY', 'TAURI_PLATFORM_VERSION', 'TAURI_PLATFORM_TYPE', 'TAURI_DEBUG', 'TAURI_'],

  //   // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //   //
  //   // 1. prevent vite from obscuring rust errors
    clearScreen: false,
  //   // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      host: platform === "android" ? '0.0.0.0' : (host || false),
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
        external: (id) => {
          if (is_tauri) {
            if (/_(desktop|mobile|macos|linux|windows|android|ios)_/.test(id)) {
              if (is_mobile) {
                if (/desktop/.test(id)) {
                  return true;
                }
                if (is_android) {
                  if (/^(?!.*android).*(ios)/.test(id)) {
                    return true;
                  }
                } else if (is_ios) {
                  if (/^(?!.*ios).*(android)/.test(id)) {
                    return true;
                  }
                }
              } else if (is_desktop) {
                if (/mobile/.test(id)) {
                  return true;
                }
                if (is_windows) {
                  if (/^(?!.*windows).*(macos|linux)/i.test(id)) {
                    return true;
                  }
                } else if (is_linux) {
                  if (/^(?!.*linux).*(macos|windows)/i.test(id)) {
                    return true;
                  }
                } else if (is_macos) {
                  if (/^(?!.*macos).*(macos|linux)/i.test(id)) {
                    return true;
                  }
                }
              }
            }
          } else {
            if (/_(desktop|mobile|macos|linux|windows|android|ios|tauri)_/i.test(id)) {
              return false;
            }
          }
        },
        output: {
          manualChunks: (id) => {
            if (/__tauri__\/tauri_init/.test(id)) {
              return "init_tauri";
            }
            if (/__tauri__\/__desktop__\/updater_init/.test(id)) {
              return "init_updater";
            }
          },
          format: "es"
        }
      },
      target: "esnext",
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      sourcemap: true/*!!process.env.TAURI_DEBUG*/,
    },
    worker: {
      format: "es",
    },
  }
})