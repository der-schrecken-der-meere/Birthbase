import type { ColumnMeta } from "@tanstack/react-table"
export {}

declare global {
    interface Window {
        __TAURI__: any
    }
    interface StorageEstimate extends StorageEstimate {
        usageDetails?: {
            indexedDB: number,
        }
    }
}