import Dexie, { BulkError, Collection, ModifyError } from "dexie";
import { Birthday } from "./tables/birthday";
import { getDefaultSettings, type Settings } from "./tables/setting";
import { calcDaysUntilNextBirthday } from "@/lib/main_util";

type DexieTable<T extends {id: number}> = Dexie.Table<T, number>;

interface I_Birthbase {
    birthdays: DexieTable<Birthday>;
    settings: DexieTable<Settings>;
}

type insertType<T> = T extends DexieTable<infer A> ? A : never;

type getInsert<T extends keyof I_Birthbase> = insertType<I_Birthbase[T]>

class DexieDB extends Dexie implements I_Birthbase {
    birthdays!: Dexie.Table<Birthday, number>;
    settings!: Dexie.Table<Settings, number>;

    constructor() {
        super("BirthdayDB");
        this.version(1).stores({
            birthdays: "++id, name, date, marked",
            settings: "id, mode, color, permission.notification, remember",
        })
        this.version(2).stores({
            settings: null,
        })
        this.version(3).stores({
            settings: "++id, mode, color, permission.notification, remember",
        })
        this.version(4).stores({
            settings: "++id, mode, color, remember",
        })
    }
    create<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K, record: Omit<T, "id">): Promise<T>;
    create<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K, record: Omit<T, "id">[]): Promise<T[]>;
    create<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K, record: Omit<T, "id">|Omit<T, "id">[]): Promise<T|T[]> {
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
                    const _record = await this.read(table, v);
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
    read<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K): Promise<T[]>;
    read<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K, id: number): Promise<T>;
    read<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K, id?: number): Promise<T|T[]> {
        return new Promise((resolve, reject) => {
            this.transaction("r", (this[table] as Dexie.Table<any, number>), async () => {
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
    update<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K, record: T): Promise<T>;
    update<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K, record: T[]): Promise<T[]>;
    update<K extends keyof I_Birthbase, T extends getInsert<K>>(table: K, record: T|T[]): Promise<T|T[]> {
        return new Promise((resolve, reject) => {
            let ids: null|number[] = 
                Array.isArray(record) ? record.map(e => e.id) : null;
            this.transaction("rw", this[table], async () => {
                if (Array.isArray(record)) {
                    const a = await (this[table].where("id").anyOf(ids as number[]) as Collection<T>).modify((v, r) => {
                        r.value = record.find((value) => value.id === v.id) as T
                    })
                    if (a === 0) throw Error("No element was found");
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
    Delete<K extends keyof I_Birthbase>(table: K, records: number|number[]): Promise<number> {
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
     * Updates the given attributes in the Config
     * 
     * If nothing passed attributes be the same
     */
    async storeSettings (updates: Omit<Partial<Settings>, "id"> = {}): Promise<Settings> {
        return new Promise(async (resolve, reject) => {
            try {
                const settingsArray = await this.read("settings");
                const settings = await (async () => {
                    const _settings = getDefaultSettings();
                    if (settingsArray.length === 0) {
                        const { id, ...updatedSettings } = ({ ..._settings, ...updates } as Settings);
                        const newSettings = this.create("settings", updatedSettings);
                        return newSettings
                    }
                    const updatedSettings = { ..._settings, ...settingsArray[0], ...updates }
                    const newSettings = this.update("settings", updatedSettings);
                    return newSettings;
                })();
                resolve(settings);
            } catch (e) {
                console.error()
                reject(e);
            }
        })
    }

    /**
     * Returns Birthdays between today and earliest notification
     * 
     * @param days earliest notification
     * @param maxBirthdays How many birthdays will be returned
     */
    async getSortedBirthdays (days: number, maxBirthdays: number = 10): Promise<Birthday[]> {
        const today = new Date();
        return new Promise((resolve, reject) => {
            if (maxBirthdays === 0) reject("Must be atleast one entry");
            this.transaction("r", this.birthdays, async () => {
                return await this.birthdays.filter((birthday) => {
                    if (birthday.marked) return false;
                    const date = new Date(birthday.date);
                    const difference = (calcDaysUntilNextBirthday(date, today));
                    return difference <= days;
                }).limit(maxBirthdays).sortBy("date");
            })
            .then((v) => {
                resolve(v);
            })
            .catch((e) => {
                reject(e.msg);
            })
        })
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
}

const db = new DexieDB();

/**
 * Settings Config at the start of the application
 * 
 * If App has no Config, Config will be filled with undefined values
 */
const __INI_APP_SETTINGS__ = await db.storeSettings();

export { DexieDB, db, __INI_APP_SETTINGS__};