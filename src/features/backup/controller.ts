// External features
import { WorkerController } from "@/lib/util/classes/WorkerController";
import { Mime } from "@/globals/constants/mime";
import { ToastType, useToastStore } from "@/stores/use_toast_store";
import i18n from "@/i18n/config";

// Internal features
import type { WorkerRequest, WorkerResponse } from "./types/worker";
import { useBackupStore } from "./stores/use_backup";
import Worker from "./workers/worker?worker";

const BackupWorker = new WorkerController<WorkerRequest, WorkerResponse>(
    () => new Worker({ name: "BackupWorker" }),
    async (ev) => {

        console.log("Backup", ev.data);

        // Check if any error occurred
        if (ev.data.error) {
            console.error("BackupWorker Error:", ev.data.error);
            useToastStore.getState().setToast({
                title: i18n.t("error", { ns: "generally" }),
                description: i18n.t(`${ev.data.error}`, { ns: "error" }),
            }, ToastType.ERROR);
            return;
        }

        // Check if progress callback is triggered
        if (ev.data.progress) {
            console.log(ev.data.progress);
            useBackupStore.getState().setProgress(ev.data.progress);
            return;
        }

        // Check if backup data is received
        if (ev.data.backup) {
            console.log("Backup Finished");
            const backup = new Blob([ev.data.backup], { type: Mime.JSON_UTF8 });

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
        if (ev.data.done) {
            useBackupStore.getState().setFinishProgress();
        }

    },
    (ev) => {
        console.error("BackupWorker Error:", ev);
    },
);

export { BackupWorker };