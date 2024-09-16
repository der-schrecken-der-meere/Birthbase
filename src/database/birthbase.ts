import { Color } from "@/frontend/store/color/colorSlice";
import { Mode } from "@/frontend/store/mode/modeSlice";
import { Database, I_DB_Error, I_Record, I_Table_Methods_Config } from "./db";
import { db as DexieDB } from "./dexie_db";
// import { ISODateFull } from "@/lib/main_utils";

interface I_Settings extends I_Record {
    mode: Mode;
    color: Color;
    permissions: {
        notification: NotificationPermission,
    };
}

interface I_Birthday extends I_Record {
    name: {
        first: string,
        last: string,
    };
    date: string;
}

type I_Birthbase = {
    "settings": {
        in: I_Settings,
        out: I_Settings,
    }
    "birthdays": {
        in: I_Birthday,
        out: I_Birthday,
    }
};

const SettingsConfig: I_Table_Methods_Config<I_Birthbase, "settings"> = {
    create: async (ref, record) => {
        if (Array.isArray(record)) {
            return ref.db_instance._create("settings", record) as any;
        } else {
            return ref.db_instance._create("settings", record) as any;
        }
    },
    read: async (ref, id?) => {
        if (typeof id === "number") {
            return ref.db_instance._read("settings", id) as any;
        } else {
            return ref.db_instance._read("settings") as any;
        }
    },
    update: async (ref, record) => {
        if (Array.isArray(record)) {
            return ref.db_instance._update("settings", record) as any;
        } else {
            return ref.db_instance._update("settings", record) as any;
        }
    },
    delete: async (ref, id) => {
        return ref.db_instance._delete("settings", id);
    },
}

const BirthdayConfig: I_Table_Methods_Config<I_Birthbase, "birthdays"> = {
    create: async (ref, record) => {
        if (Array.isArray(record)) {
            return ref.db_instance._create("birthdays", record) as any;
        } else {
            return ref.db_instance._create("birthdays", record) as any;
        }
    },
    read: async (ref, id?) => {
        if (typeof id === "number") {
            return ref.db_instance._read("birthdays", id) as any;
        } else {
            return ref.db_instance._read("birthdays") as any;
        }
    },
    update: async (ref, record) => {
        if (Array.isArray(record)) {
            return ref.db_instance._update("birthdays", record) as any;
        } else {
            return ref.db_instance._update("birthdays", record) as any;
        }
    },
    delete: async (ref, id) => {
        return ref.db_instance._delete("birthdays", id);
    },
}

let db: Database<I_Birthbase> = null as unknown as Database<I_Birthbase>; 
let _: I_Settings[] = null as unknown as I_Settings[];

try {
    db = new Database<I_Birthbase>(() => {
            // if (isTauri) ...
            return DexieDB;
        },[
            {
                tableName: "settings",
                table: SettingsConfig as any
            },
            {
                tableName: "birthdays",
                table: BirthdayConfig as any,
            },
        ]
    );

    _ = await db.tables.settings.read()
} catch (error) {
    console.error((error as I_DB_Error).msg);
}
const __APP_SETTINGS__ = _[_.length - 1] as I_Settings | undefined;

const storeSettings = async (updates: Omit<Partial<I_Settings>, "id">): Promise<I_Settings> => {
    const base_settings = (await db.tables.settings.read())[0] as I_Settings | undefined;
    if (typeof base_settings === "undefined") {
        return db.tables.settings.create(updates as I_Settings);
    } else {
        const newSettings = { ...base_settings, ...updates };
        return db.tables.settings.update(newSettings);
    }
}

// Check if datamigration json are defined
try {
    const migrationURL = "src/database/data_migration";
    const migrationFile = await fetch(migrationURL + "/migration.json", {headers: {"Content-Type": "application/json"}});
    // Array of filenames where birthday data is stored
    const migrationJSON: string[] = await migrationFile.json();
    const data: I_Birthday[] = await Promise.all(migrationJSON.map(async filename => {
        const file = await fetch(migrationURL + "/" + filename);
        return await file.json();
    }));
    const birthdays = data.flat();
    if (birthdays.length > 0) await db.tables.birthdays.create(birthdays);
} catch (err) {
    console.error(err)
}

const getSettings = async (): Promise<I_Settings | undefined> => {
    return (await db.tables.settings.read())[0];
}

export type { I_Birthday, I_Settings, I_Birthbase }
export { db, __APP_SETTINGS__, storeSettings, getSettings };