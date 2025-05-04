import { TABLES } from "@/database/db";
import { BackupWorker } from "@/worker/Backup/controller";
import { OperationCode } from "@/worker/Backup/enum";
import { create } from "zustand";

type BackupStoreState = {
    /** Percantage of the export process */
    progress: number,
    /** Indicates whether the worker is currently active processing import or export */
    isProcessing: OperationCode | null,
};

interface BackupStore extends BackupStoreState {
    /** Starts the backup progress */
    setStartExport: () => void,
    /** Starts the backup progress */
    setStartImport: (data: Blob) => void,
    /** Finishes the backup progress */
    setFinishProgress: () => void,
    /** Cancel the progress if an existing backup is currently running */
    setCancelProgress: () => void,

    setProgress: (progress: number) => void,
}

const useBackupStore = create<BackupStore>()((set) => ({
    progress: 0,
    isProcessing: null,
    setStartExport: () => {
        BackupWorker.create_worker();
        set(() => ({
            progress: 0,
            isProcessing: OperationCode.EXPORT
        }));
        BackupWorker.send_message({
            tables: [TABLES.BIRTHDAYS, TABLES.SETTINGS],
            operation: OperationCode.EXPORT
        });
    },
    setStartImport: async (data) => {
        BackupWorker.create_worker();
        const array_buffer = await data.arrayBuffer();
        set(() => ({
            progress: 0,
            isProcessing: OperationCode.IMPORT,
        }));
        BackupWorker.send_message({
            operation: OperationCode.IMPORT,
            import_data: array_buffer,
        });
    },
    setFinishProgress: () => {
        BackupWorker.kill_worker();
        const setValue: Partial<BackupStore> = {
            progress: 100,
            isProcessing: null,
        };
        set(() => (setValue));
    },
    setCancelProgress: () => {
        BackupWorker.kill_worker();
        set(() => ({
            progress: 0,
            isProcessing: null,
        }));
    },

    setProgress: (progress) => set(() => ({
        progress,
    })),
}));

export type { BackupStoreState };
export { useBackupStore };