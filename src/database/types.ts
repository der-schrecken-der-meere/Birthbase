// External features
import type { DBRecord, DexieTable } from "@/types/db";

// Internal features
import type { AppBirthday } from "./birthalert/birthdays/types";
import type { AppSettings } from "./birthalert/settings/types";
import type { AppNotification } from "./birthalert/notifications/types";


type BirthAlertTables = {
    birthdays: DexieTable<AppBirthday & DBRecord>;
    settings: DexieTable<AppSettings & DBRecord>;
    notifications: DexieTable<AppNotification & DBRecord>;
};

export type { BirthAlertTables };