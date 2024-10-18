interface I_Record {
    id: number;
};
interface I_DB_Error {
    code?: number;
    msg: any;
}

type T_Table_Def = {
    in: I_Record;
    out: I_Record;
};
interface I_Table_Defs {
    [key: string]: T_Table_Def;
}

type U_TableNames<T extends I_Table_Defs> = keyof T;
type U_TableInType<T extends I_Table_Defs, K extends U_TableNames<T>> = T[K]["in"];
type U_TableOutType<T extends I_Table_Defs, K extends U_TableNames<T>> = T[K]["out"];

type I_Create_Method_DB<T extends I_Table_Defs> = {
    <K extends U_TableNames<T>>(table: K, record: Omit<U_TableInType<T, K>, "id">): Promise<U_TableOutType<T, K>>;
    <K extends U_TableNames<T>>(table: K, record: Omit<U_TableInType<T, K>, "id">[]): Promise<U_TableOutType<T, K>[]>;
}
type I_Read_Method_DB<T extends I_Table_Defs> = {
    <K extends U_TableNames<T>>(table: K): Promise<U_TableOutType<T, K>[]>;
    <K extends U_TableNames<T>>(table: K, id: number): Promise<U_TableOutType<T, K> | undefined>;
}
type I_Update_Method_DB<T extends I_Table_Defs> = {
    <K extends U_TableNames<T>>(table: K, records: U_TableInType<T, K>): Promise<U_TableOutType<T, K>>;
    <K extends U_TableNames<T>>(table: K, records: U_TableInType<T, K>[]): Promise<U_TableOutType<T, K>[]>;
}
interface I_Database_Methods<T extends I_Table_Defs> {
    getStorageSize: () => Promise<number | undefined>;
    _create: I_Create_Method_DB<T>;
    _read: I_Read_Method_DB<T>;
    _update: I_Update_Method_DB<T>;
    _delete: <K extends U_TableNames<T>>(table: K, records: number|number[]) => Promise<number>;
}

interface I_Ref_Props<T extends I_Table_Defs> {
    db_instance: I_Database_Methods<T>;
}

type I_Create_Method_Config<T extends I_Table_Defs, IN extends I_Record, OUT extends I_Record> = {
    (ref: I_Ref_Props<T>, record: Omit<IN, "id">): Promise<OUT>
    (ref: I_Ref_Props<T>, records: Omit<IN, "id">[]): Promise<OUT[]>
}
type I_Read_Method_Config<T extends I_Table_Defs, OUT extends I_Record> = {
    (ref: I_Ref_Props<T>): Promise<OUT[]>;
    (ref: I_Ref_Props<T>, id: number): Promise<OUT | undefined>;
}
type I_Update_Method_Config<T extends I_Table_Defs, IN extends I_Record, OUT extends I_Record> = {
    (ref: I_Ref_Props<T>, record: IN): Promise<OUT>;
    (ref: I_Ref_Props<T>, records: IN[]): Promise<OUT[]>;
}
type I_Delete_Method_Config<T extends I_Table_Defs> = {
    (ref: I_Ref_Props<T>, ids: number|number[]): Promise<number>;
}
interface I_Table_Methods_Config<T extends I_Table_Defs, K extends keyof T> {
    create: I_Create_Method_Config<T, U_TableInType<T, K>, U_TableOutType<T, K>>
    read: I_Read_Method_Config<T, U_TableOutType<T, K>>;
    update: I_Update_Method_Config<T, U_TableInType<T, K>, U_TableOutType<T, K>>;
    delete: I_Delete_Method_Config<T>;
}

type I_Read_Method<O extends I_Record> = {
    (): Promise<O[]>;
    (id: number): Promise<O | undefined>;
}
type I_Create_Method<I extends I_Record, O extends I_Record> = {
    (record: Omit<I, "id">): Promise<O>;
    (records: Omit<I, "id">[]): Promise<O[]>;
}
type I_Update_Method<I extends I_Record, O extends I_Record> = {
    (record: I): Promise<O>;
    (records: I[]): Promise<O[]>;
}
type I_Delete_Method = {
    (ids: number|number[]): Promise<number>;
}
interface I_Table_Methods<I extends I_Record, O extends I_Record> {
    create: I_Create_Method<I, O>;
    read: I_Read_Method<O>;
    update: I_Update_Method<I, O>;
    delete: I_Delete_Method;
}

interface I_Uni_Database<T extends I_Table_Defs> {
    db_instance: I_Database_Methods<T>;
    tables: {
        [K in keyof T]: {
            [M in keyof I_Table_Methods<T[K]["in"], T[K]["out"]>]: I_Table_Methods<T[K]["in"], T[K]["out"]>[M];
        };
    };
}

interface I_Table_Def_DB<T extends I_Table_Defs, N extends U_TableNames<T>> {
    tableName: N;
    table: I_Table_Methods_Config<T, N>
}

class Database <T extends I_Table_Defs> implements I_Uni_Database<T> {
    db_instance!: I_Database_Methods<T>;
    tables!: { [K in keyof T]: {
        create: I_Create_Method<T[K]["in"], T[K]["out"]>;
        read: I_Read_Method<T[K]["out"]>;
        update: I_Update_Method<T[K]["in"], T[K]["out"]>;
        delete: I_Delete_Method;
    }; };
    constructor (
        db_instance: () => I_Database_Methods<T>,
        tables: I_Table_Def_DB<T, U_TableNames<T>>[]
    ) {
        this.db_instance = db_instance();
        this.tables = {} as any;
        tables.forEach((v) => {
            const ref_props: I_Ref_Props<T> = {
                db_instance: this.db_instance,
            }
            this.tables[v.tableName] = {
                create: (record) => {
                    return v.table.create(ref_props, record as any) as any;
                },
                read: (id?) => {
                    if (typeof id === "number") {
                        return v.table.read(ref_props, id) as any;
                    } else {
                        return v.table.read(ref_props) as any;
                    }
                },
                update: (record) => {
                    return v.table.update(ref_props, record as any) as any;
                },
                delete: (id) => {
                    return v.table.delete(ref_props, id);
                }
            };
        })
    }
}

export type { I_Record, I_DB_Error, I_Table_Methods_Config, T_Table_Def, I_Database_Methods, I_Update_Method_DB, I_Read_Method_DB, I_Create_Method_DB, U_TableInType, U_TableNames, U_TableOutType, I_Table_Def_DB, I_Table_Defs }
export { Database }