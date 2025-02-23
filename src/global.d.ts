import type { ColumnMeta } from "@tanstack/react-table"
import "@tanstack/react-table";
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

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        ns: string,
        key: string,
    }
}