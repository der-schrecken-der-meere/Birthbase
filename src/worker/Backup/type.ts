import type { TABLES } from "@/database/db";
import { type OperationCode } from "./enum";

type Request = {
    operation: OperationCode.EXPORT,
    tables: TABLES[],
} | {
    operation: OperationCode.IMPORT,
    import_data: ArrayBuffer,
};

type Response = {
    error?: string,
    progress?: number,
    done?: boolean,
    backup?: ArrayBuffer,
};

export type { Response, Request };