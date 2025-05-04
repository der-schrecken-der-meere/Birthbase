// External features
import { type Dexie } from "dexie";
import { type ExportProgress, exportDB } from "dexie-export-import";
import { TABLES } from "@/database/db";
import { objectDiff } from "@/lib/functions/object/diff";

/**
 * Exports the database data as an ArrayBuffer.
 * 
 * @param tables Tables to export
 * @param db Dexie instance
 * @param on_progress Callback function to handle progress updates
 * @returns Database data as ArrayBuffer
 */
const export_backup = async (tables: TABLES[], db: Dexie, on_progress: (progress: ExportProgress) => void): Promise<ArrayBuffer> => {
    const skipTables = objectDiff(TABLES, tables);

    const blob = await exportDB(db, {
        skipTables,
        progressCallback: (progress) => {
            on_progress(progress);
            return true;
        },
    });

    return await blob.arrayBuffer();
};

export { export_backup };