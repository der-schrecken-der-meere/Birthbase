// External features
import { Model } from "@/lib/classes/Model";
import { birthAlert } from "@/database/lib/instances/birthAlert";
import { TABLES } from "@/database/lib/enums/tables";

// Internal features
import type { AppSettings } from "./types";

const settingsModel = new Model<AppSettings, AppSettings>(
    TABLES.SETTINGS,
    birthAlert,
);

export { settingsModel };