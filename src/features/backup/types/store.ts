import { type OperationCode } from "../constants/enums/tasks";

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
};

export type {
    BackupStore,
    BackupStoreState,
};