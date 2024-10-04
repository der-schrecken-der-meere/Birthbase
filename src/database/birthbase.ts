import { Color } from "@/frontend/store/color/colorSlice";
import { Mode } from "@/frontend/store/mode/modeSlice";
import { Database, I_DB_Error, I_Record, I_Table_Methods_Config } from "./db";
import { db as DexieDB } from "./dexie_db";
// import { ISODateFull } from "@/lib/main_utils";

interface I_Settings extends I_Record {
    mode: Mode | undefined;
    color: Color | undefined;
    permissions: {
        notification: NotificationPermission | undefined,
    };
    remember: number | undefined;
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
let initial_settings: I_Settings[] = [];

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

    initial_settings = await db.tables.settings.read()
} catch (error) {
    console.error((error as I_DB_Error).msg);
}

/**
 * Settings Config at the start of the application
 * 
 * If App has no Config, Config will be filled with undefined values
 */
const __INI_APP_SETTINGS__ = await (async () => {
    // If Config is available then take the first of the array
    if (initial_settings.length > 0) return initial_settings[0];
    // Create Config with undefined values if Config not found
    const settings = await db.tables.settings.create({
        color: undefined,
        mode: undefined,
        permissions: {
            notification: undefined,
        },
        remember: undefined,
    });
    return settings;
})();

/**
 * Updates the given attributes in the Config
 * 
 * If nothing passed attributes be the same
 */
const storeSettings = async (updates: Omit<Partial<I_Settings>, "id">): Promise<I_Settings> => {
    // Get the first Config and take replace its older values with newer values
    const base_settings = (await db.tables.settings.read())[0];
    const newSettings = { ...base_settings, ...updates };

    return db.tables.settings.update(newSettings);
}

// const fileToIDB = <DB extends I_Table_Defs>(files: FileList, db: Database<DB>, table) => {
//     if (files.length === 0) return;

//     const size = [...files].reduce((acc, cur) => acc + cur.size, 0);
//     if (size > 100_000_000_000) throw Error("The files exceeds the limit of 100GB");

// }

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
export { db, __INI_APP_SETTINGS__, storeSettings, getSettings };