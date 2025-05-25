import type { DBRecord } from "@/types/db";
import type { BirthAlert } from "@/database/lib/classes/BirthAlert";
import type { TABLES } from "@/database/lib/enums/tables";
import { delete_ids } from "../functions/db/delete_ids";

class Model<I, O> {
    public tableName: TABLES;
    private db: BirthAlert;

    constructor(tableName: TABLES, db: BirthAlert) {
        this.tableName = tableName;
        this.db = db;
    }

    /**
     * Create new records and return them with their autoincremented ids
     * @param records 
     * @returns A new record with its id
     */
    async createRecords(records: (I & Partial<DBRecord>)[]): Promise<(O & DBRecord)[]> {
        // Remove all ids from records
        const no_ids = delete_ids(records);
        return this.db.add(this.tableName, no_ids) as unknown as (O & DBRecord)[];
    }

    /**
     * Get multiple records by their ids
     * @param ids Ids of the records to get
     * @returns An array of records with their ids
     */
    async readRecords(ids: number[]): Promise<(O & DBRecord)[]> {
        return this.db.get(this.tableName, ids) as unknown as (O & DBRecord)[];
    }

    /**
     * Get all records in the table
     * @returns An array of all records in the table
     */
    async readAllRecords(): Promise<(O & DBRecord)[]> {
        return this.db.get(this.tableName) as unknown as (O & DBRecord)[];
    }

    /**
     * Update multiple records by their ids with the new values
     * @param records An array of new records to update the existing ids
     * @returns An array of updated records with their ids
     */
    async updateRecords(records: (I & DBRecord)[]): Promise<(O & DBRecord)[]> {
        return this.db.upd(this.tableName, records as any) as unknown as (O & DBRecord)[];
    }

    /**
     * Delete multiple records by their ids
     * @param ids Ids of the records to delete
     * @returns Amount of deleted records
     */
    async deleteRecords(ids: number[]): Promise<number> {
        return this.db.del(this.tableName, ids);
    }

    /**
     * Delete all records in the table
     */
    async eraseTable(): Promise<void> {
        return this.db.clear(this.tableName);
    }
};

export { Model };