import type { Color } from "@/store/color/colorSlice";
import type { Mode } from "@/store/mode/modeSlice";
import Dexie, { type PromiseExtended } from "dexie";


interface I_Birthday {
    id?: number | string;
    name: {
        first: string,
        last: string,
    };
    date: string;
};

interface I_Settings {
    id: number;
    mode: Mode;
    color: Color;
    notification: {
        permission: NotificationPermission,
    };
}

type T_Result = {
    birthday: I_Birthday,
    settings: I_Settings,
}

interface I_BirthdayDB {
    birthday: Dexie.Table<I_Birthday, number>;
    settings: Dexie.Table<I_Settings, number>;
}
class BirthdayDB extends Dexie implements I_BirthdayDB  {
    birthday!: Dexie.Table<I_Birthday, number, I_Birthday>;
    settings!: Dexie.Table<I_Settings, number, I_Settings>;

    constructor() {
        super("BirthdayDB");
        this.version(1).stores({
            birthday: "++id, name, date",
            settings: "id, mode, color, notification.permission"
        })
    }

    STORE_SETTINGS(settingsObj: { mode?: Mode, color?: Color, notification?: { permission?: NotificationPermission } }) {
        return this.transaction("rw", this.settings, async () => {     
            const settings = await this.settings.get(1);
            if (settings) settingsObj = { ...settings, ...settingsObj}
            const key = await this.settings.put({...settingsObj, id: 1} as unknown as I_Settings);
            return this.GET(key, "settings");
        })
    }

    /**
     * Returns all Birthdays which are created
     */
    POST(birthdayObj: I_Birthday|I_Birthday[]) {
    
        const birthdayObjs = [birthdayObj].flat().map(
            b => { 
                const { id, ...newObj } = b;
                return newObj;
            }
        );

        console.log(birthdayObjs);

        return this.transaction("rw", this.birthday, async () => {
            const keys = await this.birthday.bulkAdd(birthdayObjs, {allKeys: true});

            const birthdayPromises = keys.map(async e => {
                return await this.GET(e, "birthday");
            });

            return await Promise.all(birthdayPromises);
        })
    }
    getTable<K extends keyof I_BirthdayDB>(key: K): I_BirthdayDB[K] {
        return this[key] as unknown as I_BirthdayDB[K]
    }
    /**
     * Gets the Data of a single ID or of all Birthdays in the Table
     */
    GET<K extends keyof I_BirthdayDB, T extends (number|undefined)>(id: T, table: K): PromiseExtended<T extends number ? (T_Result[K] | undefined) : T_Result[K][]> {
        const tableID = this.getTable(table);
        return this.transaction("r", tableID, async () => {
            if (id === undefined) return tableID.toArray() as any;
            else return tableID.get(id) as any;
        });
    }
    /**
     * Updates all given Birthdays in the Table and returns the number of updated records
     */
    PATCH(birthdayObj: I_Birthday|I_Birthday[]) {
        const birthdayObjs = [birthdayObj].flat()

        const updateArr = birthdayObjs.map(e => ({
            key: e.id,
            changes: {
                name: e.name,
                date: e.date,
            }
        }))

        return this.transaction("rw", this.birthday, async () => {
            return this.birthday.bulkUpdate(updateArr as unknown as []);
        })
    }
    /**
     * Deletes all the Birthdays with the given ID(s) and returns the amount of deleted records
     */
    DELETE(id: number|number[]) {
        return this.transaction("rw", this.birthday, async () => {
            return this.birthday.where("id").equals(id).delete();
        })
    }
    /**
     * Deletes all Data in the Table
     */
    TRUNCATE<K extends keyof I_BirthdayDB>(table: K) {
        const tableID = this.getTable(table);
        return this.transaction("rw", tableID, async () => {
            return tableID.clear();
        })
    }
}

const db = new BirthdayDB();

const __APP_SETTINGS__ = await db.GET(1, "settings");
console.log(__APP_SETTINGS__)

export type { I_Birthday, I_Settings};
export { BirthdayDB, db,  __APP_SETTINGS__};