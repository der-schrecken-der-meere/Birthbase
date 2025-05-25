import Dexie from "dexie";
import type { BulkError, Collection, ModifyError } from "dexie";

import type { Birthday } from "./tables/birthday/birthdays.ts";
import type { Settings } from "./tables/settings/type.ts";

// import calcDaysUntilNextBirthday from "../lib/functions/birthdays/calcDaysUntilNextBirthday.ts";
import { MidnightTimestamp } from "@/lib/types/date.ts";
import { AppNotification } from "./tables/notifications/notifications.ts";
import { calculate_days_until_next_birthday, unify_birthday } from "@/lib/functions/birthday.ts";
import { midnight_utc } from "@/lib/functions/date.ts";

type DexieTable<T extends {id: number}> = Dexie.Table<T, number>;

interface Birthbase {
    birthdays: DexieTable<Birthday>;
    settings: DexieTable<Settings>;
    notifications: DexieTable<AppNotification>;
}

type insertType<T> = T extends DexieTable<infer A> ? A : never;

type getInsert<T extends keyof Birthbase> = insertType<Birthbase[T]>

type getSortedBirthdaysOptions = {
    /**
     * The Birthdays between the current date and current date + ```maxDayDifference```
     */
    maxDayDifference?: number,
    /**
     * The max amount of birthdays that will be displayed
     */
    maxBirthdays?: number,
    /**
     * Gets also the birthdays that are marked as read
     */
    all?: boolean,
    /**
     * The date or ISOString which is used for comparison. Default value is the current date
     */
    comparingDate?: Date|MidnightTimestamp,
}

// Contants
enum TABLES {
    BIRTHDAYS = "birthdays",
    SETTINGS = "settings",
    NOTIFICATIONS = "notifications",
};

enum Errors {
    NO_FOUND = "Es wurde kein Element gefunden",
    NO_SUPPORT = ""
};

const c_db_name = "BirthdayDB";
const currrent_version = 13;



// Classes
class DexieDB extends Dexie implements Birthbase {
    birthdays!: Dexie.Table<Birthday, number>;
    settings!: Dexie.Table<Settings, number>;
    notifications!: Dexie.Table<AppNotification, number>;

    constructor() {
        super(c_db_name);
        this.version(7).stores({
            settings: "++id",
        })
        this.version(8).stores({
            notifications: "++id,timestamp",
        });
        this.version(currrent_version).stores({
            birthdays: "++id,timestamp",
        }).upgrade(async trans => {
            return trans.table(TABLES.BIRTHDAYS).toCollection().modify((birthday: Birthday) => {
                /** @ts-ignore */
                const timestamp = midnight_utc(+new Date(birthday.date));
                const { id, name: { first, last } } = birthday;
                const new_birthday: Birthday = { id, name: { first, last }, timestamp, reminder: [] };
                birthday = unify_birthday(new_birthday);
            });
        })
    }
    add<K extends keyof Birthbase, T extends getInsert<K>>(table: K, record: Omit<T, "id">): Promise<T>;
    add<K extends keyof Birthbase, T extends getInsert<K>>(table: K, record: Omit<T, "id">[]): Promise<T[]>;
    add<K extends keyof Birthbase, T extends getInsert<K>>(table: K, record: Omit<T, "id">|Omit<T, "id">[]): Promise<T|T[]> {
        return new Promise((resolve, reject) => {
            this.transaction("rw", this[table], async () => {
                if (Array.isArray(record)) {
                    if (record.length === 0) reject({
                        msg: "No records passed to the function",
                    });
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
    get<K extends keyof Birthbase, T extends getInsert<K>>(table: K): Promise<T[]>;
    get<K extends keyof Birthbase, T extends getInsert<K>>(table: K, id: number): Promise<T>;
    get<K extends keyof Birthbase, T extends getInsert<K>>(table: K, id: number[]): Promise<T[]>;
    get<K extends keyof Birthbase, T extends getInsert<K>>(table: K, id?: number | number[]): Promise<T|T[]> {
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
    upd<K extends keyof Birthbase, T extends getInsert<K>>(table: K, record: T): Promise<T>;
    upd<K extends keyof Birthbase, T extends getInsert<K>>(table: K, record: T[]): Promise<T[]>;
    upd<K extends keyof Birthbase, T extends getInsert<K>>(table: K, record: T|T[]): Promise<T|T[]> {
        return new Promise((resolve, reject) => {
            this.transaction("rw", this[table], async () => {
                if (Array.isArray(record)) {
                    const ids = record.map(e => e.id);
                    const a = await (this[table].where("id").anyOf(ids) as Collection<T>).modify((v, r) => {
                        r.value = record.find((value) => value.id === v.id) as T
                    })
                    if (a === 0) throw Error(Errors.NO_FOUND);
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
    del<K extends keyof Birthbase>(table: K, records: number|number[]): Promise<number> {
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

    /**
     * Returns a sorted birthday array (Closest Birthday at first position)
     */
    async get_sorted_birthdays (
        options?: getSortedBirthdaysOptions,
        // days: number, maxBirthdays: number = 10
    ): Promise<Birthday[]> {
        return new Promise((resolve, reject) => {
            this.transaction("r", this.birthdays, async () => {
                let collection = this.birthdays.toCollection();
                if (options) {
                    if (options.maxDayDifference) {
                        collection = collection.filter((birthday) => {
                            const difference = (calculate_days_until_next_birthday(birthday.timestamp));
                            return difference <= (options.maxDayDifference as number);
                        })
                    }
                    if (options.maxBirthdays) {
                        collection = collection.limit(options.maxBirthdays);
                    }
                }
                const res = await collection.toArray();
                return res.sort((a, b) => {
                    const _a = calculate_days_until_next_birthday(a.timestamp);
                    const _b = calculate_days_until_next_birthday(b.timestamp);
                    if (_a > _b) return 1;
                    if (_a < _b) return -1;
                    return 0;
                });
            })
            .then((v) => {
                resolve(v);
            })
            .catch((e) => {
                reject(e.msg);
            })
        })
    }

    get_storage_size = async (): Promise<number | undefined> => {
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

    clear = async <K extends keyof Birthbase>(table: K) => {
        this.transaction("rw", this[table], async () => {
            await this[table].clear();
            Promise.resolve();
        })
        .catch(error => {
            Promise.reject(error);
        });
    };
}

const db = new DexieDB();

export { DexieDB, db, TABLES };