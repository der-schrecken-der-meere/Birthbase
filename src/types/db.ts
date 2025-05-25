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

type DexieHistory = Array<{
    version: number,
    stores?: {
        [tableName: string]: string | null;
    },
    upgrade?: (trans: Transaction) => PromiseLike<any>,
}>;


export type {
    DBRecord,
    DexieHistory,
    DexieTable,
    GetInsertType,
};