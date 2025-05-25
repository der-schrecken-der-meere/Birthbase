import type { Dexie, Transaction } from "dexie";

type DBRecord = {
    id: number,
};

type DexieTable<T extends DBRecord> = Dexie.Table<T, number>;

type insertType<T> = T extends DexieTable<infer A> ? A : never;

type GetInsertType<
    TABLES extends { [tableName: string ]: DexieTable<DBRecord> },
    T extends keyof TABLES
> = insertType<TABLES[T]>;

type DexieConfig = {
    /** Name of the database */
    name: string,
    /** Current version */
    version: number,
    /** History of changes */
    history: readonly DexieHistory[],
};

type DexieHistory = {
    /** Version of a change */
    version: number,
    /** Changes that will apply when the version is called for the first time */
    stores?: {
        [tableName: string]: string | null;
    },
    /** Updater function when the version is called for the first time */
    upgrade?: (trans: Transaction) => PromiseLike<any>,
};

export type {
    DBRecord,
    DexieConfig,
    DexieHistory,
    DexieTable,
    GetInsertType,
};