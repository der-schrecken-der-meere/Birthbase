/// <reference types="vite/client" />

declare const __IS_TAURI__: boolean;
declare const __TAURI_IS_DESKTOP__: boolean;
declare const __TAURI_IS_MOBILE__: boolean;
declare const __TAURI_IS_LINUX__: boolean;
declare const __TAURI_IS_MAC__: boolean;
declare const __TAURI_IS_WINDOWS__: boolean;
declare const __TAURI_IS_LINUX__: boolean;
declare const __TAURI_IS_ANDROID__: boolean;
declare const __TAURI_IS_IOS__: boolean;

interface ImportMetaEnv {
    readonly VITE_IS_TAURI: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}