// External features
import type { TABLES } from "@/database/db";

// Internal features
import { OperationCode } from "../constants/enums/tasks";

type WorkerRequest = {
    operation: OperationCode.EXPORT,
    /** Tables to export */
    tables: TABLES[],
} | {
    operation: OperationCode.IMPORT,
    /** Data to import */
    import_data: ArrayBuffer,
};

type WorkerResponse = {
    /** Error key for translation */
    error?: string,
    /** Progress value */
    progress?: number,
    /** Indicates whether the process is done */
    done?: boolean,
    /** Exported data */
    backup?: ArrayBuffer,
};

export type {
    WorkerRequest,
    WorkerResponse,
};