// Packages
import type { BulkError, Collection, ModifyError } from "dexie";
import { Dexie } from "dexie";

// External features
import type { DBRecord, DexieConfig, DexieTable, GetInsertType } from "@/lib/types/db";

// Internal features
import type { BirthAlertTables } from "@/database/types";
import type { AppBirthday } from "@/database/birthalert/birthdays/types";
import type { AppSettings } from "@/database/birthalert/settings/types";
import type { AppNotification } from "@/database/birthalert/notifications/types";

type TABLES = BirthAlertTables;

class BirthAlert extends Dexie implements TABLES {

    birthdays!: DexieTable<AppBirthday & DBRecord>;
    settings!:  DexieTable<AppSettings & DBRecord>;
    notifications!: DexieTable<AppNotification & DBRecord>;

    constructor(dexieConfig: DexieConfig) {
        super(dexieConfig.name);
        for (const state of dexieConfig.history) {
            let version = this.version(state.version);
            if (state.stores) {
                version = version.stores(state.stores);
            }
            if (state.upgrade) {
                version.upgrade(state.upgrade);
            }
        }
    }

    add<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, record: Omit<T, "id">): Promise<T>;
    add<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, record: Omit<T, "id">[]): Promise<T[]>;
    add<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, record: Omit<T, "id">|Omit<T, "id">[]): Promise<T|T[]> {
        return new Promise((resolve, reject) => {
            this.transaction("rw", this[table], async () => {
                if (Array.isArray(record)) {
                    return await (this[table] as Dexie.Table<any, number>).bulkAdd(record, {allKeys: true});
                } else {
                    return await (this[table] as Dexie.Table<any, number>).add(record);
                }
            })
            .then(async (v) => {
                if (Array.isArray(v)) {
                    const _records = await this[table].where("id").anyOf(v).toArray();
                    resolve(_records as T[]);
                } else {
                    const _record = await this.get(table, v);
                    resolve(_record as T);
                }
            })
            .catch(Dexie.BulkError, (e: BulkError) => {
                reject({
                    msg: e.message,
                })
            })
            .catch((e) => {
                reject({
                    msg: e,
                });
            })
        })
    }
    get<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K): Promise<T[]>;
    get<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, id: number): Promise<T>;
    get<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, id: number[]): Promise<T[]>;
    get<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, id?: number | number[]): Promise<T|T[]> {
        return new Promise((resolve, reject) => {
            this.transaction("r", (this[table] as Dexie.Table<any, number>), async () => {
                if (typeof id === "number") {
                    return this[table].get(id);
                } else if (Array.isArray(id)) {
                    return this[table].bulkGet(id);
                } else {
                    return this[table].toArray();
                }
            })
            .then(v => {
                if (Array.isArray(v)) resolve(v as any);
                else if (typeof v === "undefined") resolve (v as any);
                else resolve(v as any);
            })
            .catch((e) => {
                reject({
                    msg: e,
                })
            })
        })
    }
    upd<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, record: T): Promise<T>;
    upd<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, record: T[]): Promise<T[]>;
    upd<K extends keyof TABLES, T extends GetInsertType<TABLES, K>>(table: K, record: T|T[]): Promise<T|T[]> {
        return new Promise((resolve, reject) => {
            this.transaction("rw", this[table], async () => {
                if (Array.isArray(record)) {
                    const ids = record.map(e => e.id);
                    await (this[table].where("id").anyOf(ids) as Collection<T>).modify((v, r) => {
                        r.value = record.find((value) => value.id === v.id) as T
                    })
                } else {
                    const { id, ..._record } = record;
                    const a = await (this[table] as Dexie.Table<any, number>).update(record.id, _record);
                    if (a === 0) throw Error("No element was found");
                }
            })
            .then(() => {
                resolve(record);
            })
            .catch(Dexie.ModifyError, (error: ModifyError) => {
                reject({
                    msg: error.message,
                })
            })
            .catch(error => {
                reject({
                    msg: error,
                })
            })
        });
    }
    del<K extends keyof TABLES>(table: K, records: number|number[]): Promise<number> {
        return new Promise((resolve, reject) => {
            this.transaction("rw", this[table], async () => {
                if (Array.isArray(records) && records.length === 0) {
                    reject({
                        msg: "No records passed to the function",
                    });
                }
                return await this[table].where("id").anyOf(records).delete();
            })
            .then(v => {
                resolve(v);
            })
            .catch((e) => {
                reject({
                    msg: e,
                })
            })
        })
    }
}

export { BirthAlert };