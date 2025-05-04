import { type ExportProgress } from "dexie-export-import";
import type { Request, Response } from "./type";
import { db } from "@/database/db";
import { OperationCode } from "./enum";
import { ImportProgress } from "dexie-export-import/dist/import";
import { BackupError } from "@/globals/constants/errors/backup";
import { export_backup } from "./worker_tasks/export_backup";
import { import_backup } from "./worker_tasks/import_backup";

let isProcessing: null|"import"|"export" = null;

const post_message = (msg: Response, transfer?: Transferable[]) => {
    if (transfer) {
        self.postMessage(msg, transfer);
        return;
    }
    self.postMessage(msg);
};

const on_progress = (progress: ExportProgress|ImportProgress) => {
    post_message({
        progress: progress.completedRows / (progress.totalRows as number) * 100,
    });
};

self.onmessage = async (
    { data }: MessageEvent<Request>
) => {
    console.log("BackupWorker Request:", data);

    const { operation } = data;

    // Check if any operation is already running
    if (isProcessing) {
        post_message({
            error: isProcessing === "export"
                ? BackupError.EXPORT_RUNNING
                : BackupError.IMPORT_RUNNING,
        });
        return;
    }

    try {
        switch (operation) {
            case OperationCode.IMPORT:
                isProcessing = "import";

                const { import_data } = data;

                await import_backup(import_data, db, on_progress);

                post_message({ done: true });
                break;
            case OperationCode.EXPORT:
                isProcessing = "export";

                const { tables } = data;

                const backup = await export_backup(tables, db, on_progress);

                post_message({ backup: backup, done: true }, [backup]);
                break;
            default:
                break;
        }

        isProcessing = null;
    } catch (e) {
        isProcessing = null;
        post_message({ error: JSON.stringify(e) });
    }
};