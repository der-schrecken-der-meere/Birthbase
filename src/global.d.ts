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

//
// Extend Dexie interface (typescript-wise)
//
declare module 'dexie' {
    // Extend methods on db
    interface Dexie {
        export(options?: ExportOptions): Promise<Blob>;
        import(blob: Blob, options?: ImportOptions): Promise<void>;
    }
        interface DexieConstructor {
        import(blob: Blob, options?: StaticImportOptions): Promise<Dexie>;
    }
}