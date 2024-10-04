import Dexie, { BulkError, Collection, ModifyError } from "dexie";
import { I_Database_Methods, I_Update_Method_DB, I_Record, I_Read_Method_DB, I_Create_Method_DB } from "./db";
import { I_Birthday, I_Settings, I_Birthbase } from "./birthbase";

class DexieDB extends Dexie implements I_Database_Methods<I_Birthbase> {
    birthdays!: Dexie.Table<I_Birthday, number>;
    settings!: Dexie.Table<I_Settings, number>;

    constructor() {
        super("BirthdayDB");
        try {
            this.version(1).stores({
                birthdays: "++id, name, date",
                settings: "++id, mode, color, permission.notification, remember",
            })
        } catch (e) {
            console.error(e);
        }
    }
    getStorageSize = async (): Promise<number | undefined> => {
        return new Promise(async (resolve, reject) => {
            if (navigator.storage) {
                const estimation = await navigator.storage.estimate();
                if (estimation.usageDetails) resolve(estimation.usageDetails.indexedDB);
                else resolve(undefined);
            } else {
                reject({
                    msg: "Storage Manager not found",
                })
            }
        })
    };
    _update: I_Update_Method_DB<I_Birthbase> = (
        table,
        record,
    ) => {
        return new Promise((resolve, reject) => {
            let _recs = Array.isArray(record) ? record : [record];
            let ids = _recs.map(e => e.id);
            this.transaction("rw", this[table], async () => {
                await (this[table].where("id").anyOf(ids) as Collection<I_Record>).modify((v, r) => {
                    r.value = _recs.find((_v) => _v.id === v.id) as I_Record;
                });
                return await this[table].where("id").anyOf(ids).toArray();
            })
            .then(v => {
                if (v.length === 1) resolve(v[0] as any);
                resolve(v as any);
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
    _read: I_Read_Method_DB<I_Birthbase> = (
        table,
        id?,
    ) => {
        return new Promise((resolve, reject) => {
            this.transaction("r", this[table], async () => {
                if (typeof id === "number") {
                    return this[table].get(id);
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
    _delete: <K extends keyof I_Birthbase>(table: K, records: number | number[]) => Promise<number> = (
        table,
        records,
    ) => {
        return new Promise((resolve, reject) => {
            this.transaction("rw", this[table], async () => {
                if (Array.isArray(records) && records.length === 0) {
                    reject({
                        msg: "No records passed to the function",
                    });
                }
                const count = await this[table].where("id").anyOf(records).delete();
                resolve(count);
            })
            .catch((e) => {
                reject({
                    msg: e,
                })
            })
        })
    };
    _create: I_Create_Method_DB<I_Birthbase> = (
        table,
        record,
    ) => {
        return new Promise((resolve, reject) => {
            this.transaction("rw", this[table], async () => {
                if (Array.isArray(record)) {
                    if (record.length === 0) reject({
                        msg: "No records passed to the function",
                    });
                    const keys = await (this[table] as Dexie.Table<any, number>).bulkAdd(record, {allKeys: true});
                    
                    const recordPromises = keys.map(e => this._read(table, e));
                    const v = await Promise.all(recordPromises);

                    resolve(v as any);
                } else {
                    const key = await (this[table] as Dexie.Table<any, number>).add(record);
                    
                    const v = await this._read(table, key);
                    
                    resolve(v as any);
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
    };
}

const db = new DexieDB();

export { DexieDB, db };