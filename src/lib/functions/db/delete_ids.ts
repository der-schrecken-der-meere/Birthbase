import { DBRecord } from "@/types/db";

const delete_ids = <T extends Partial<DBRecord>>(
    records: T[],
): Omit<T, "id">[] => {
    return records.map((record) => {
        const deref_record = { ...record };
        if (Object.hasOwn(record, "id")) {
            delete deref_record.id;
        }
        return deref_record
    });
};

export { delete_ids };