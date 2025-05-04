import { BackupError } from "@/globals/constants/errors/backup";
import { Mime } from "@/globals/constants/mime";
import type { Dexie } from "dexie";
import { importInto, peakImportFile } from "dexie-export-import";
import { ImportProgress } from "dexie-export-import/dist/import";

/**
 * 
 * @param data Data to import
 * @param db Dexie instance
 * @param on_progress Callback function to handle progress updates
 * @returns Void or Promise rejection with `BackupError.FILE_STRUCTURE`
 */
const import_backup = async (
    data: ArrayBuffer,
    db: Dexie,
    on_progress: (progress: ImportProgress) => void
): Promise<void> => {

    const blob = new Blob([data], { type: Mime.JSON_UTF8 });

    const importMeta = await peakImportFile(blob);

    // Check if data format is valid
    if (Object.hasOwn(importMeta, "incomplete")) {
        return Promise.reject(BackupError.FILE_STRUCTURE);
    }

    return await importInto(db, blob, {
        overwriteValues: true,
        progressCallback: (progress) => {
            on_progress(progress);
            return true;
        }
    });
};

export { import_backup };