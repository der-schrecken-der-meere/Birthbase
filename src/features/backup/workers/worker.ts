// External features
import { type ExportProgress } from "dexie-export-import";
import { type ImportProgress } from "dexie-export-import/dist/import";
import { db } from "@/database/db";

// Internal features
import type { WorkerResponse, WorkerRequest } from "../types/worker";
import { OperationCode } from "../constants/enums/tasks";
import { BackupError } from "../constants/enums/errors";
import { import_backup } from "./tasks/import_backup";
import { export_backup } from "./tasks/export_backup";

let isProcessing: null|"import"|"export" = null;

const post_message = (msg: WorkerResponse, transfer?: Transferable[]) => {
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
    { data }: MessageEvent<WorkerRequest>
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