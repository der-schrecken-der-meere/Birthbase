/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IS_TAURI: boolean;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}