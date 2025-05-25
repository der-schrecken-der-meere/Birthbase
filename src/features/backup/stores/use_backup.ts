// External features
import { TABLES } from "@/database/db";
import { create } from "zustand";

// Internal features
import type { BackupStore } from "../types/store";
import { OperationCode } from "../constants/enums/tasks";
import { BackupWorker } from "../controller";

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

export { useBackupStore };