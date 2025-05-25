// External features
import { WorkerController } from "@/lib/classes/WorkerController";
import { Mime } from "@/globals/constants/mime";

// Internal features
import type { WorkerRequest, WorkerResponse } from "./types/worker";
import { useBackupStore } from "./stores/use_backup";
import Worker from "./workers/worker?worker";

const BackupWorker = new WorkerController<WorkerRequest, WorkerResponse>(
    () => new Worker({ name: "BackupWorker" }),
    async (data) => {

        // Check if progress callback is triggered
        if (data.progress) {
            console.log(data.progress);
            useBackupStore.getState().setProgress(data.progress);
            return;
        }

        // Check if backup data is received
        if (data.backup) {
            console.log("Backup Finished");
            const backup = new Blob([data.backup], { type: Mime.JSON_UTF8 });

            let a = document.createElement("a"),
                url = URL.createObjectURL(backup);
            a.href = url;
            /** BirthAler_backup_YYYY_MM_DDThh_mm_ss_mmmZ */
            const filename = `BirthAlert_backup_${new Date().toISOString()}`.replace(/[-:. ]/g, "_");
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            let c = setTimeout(() => {
                clearTimeout(c);
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }

        // Check if progress is done
        if (data.done) {
            useBackupStore.getState().setFinishProgress();
        }

    },
    (ev) => {
        console.error("BackupWorker Error:", ev);
    },
);

export { BackupWorker };