import { create_default_settings } from "@/database/birthalert/settings/default";
import { settingsModel } from "@/database/birthalert/settings/model";

// If no settings is available, ensure that atleast
// one is stored in the database
const arr = await settingsModel.readAllRecords();
if (arr.length === 0) {
    const defaultSettings = create_default_settings();
    settingsModel.createRecords([defaultSettings]);
}