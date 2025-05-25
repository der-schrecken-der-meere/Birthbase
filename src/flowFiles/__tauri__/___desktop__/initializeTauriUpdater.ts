// External features
import { settingsModel } from "@/database/birthalert/settings/model";
import { check_update } from "@/features/__tauri__/__desktop__/updater/lib/functions/check_updater";
import { useUpdateStore } from "@/features/__tauri__/__desktop__/updater/stores/use_update";

const setPrompting = useUpdateStore.getState().setPrompting;

// Get first settings object
const [settings] = await settingsModel.readAllRecords();

// Set prompt window at start to "dont show"
setPrompting(false);

// If user has auto search enabled, check for updates
if (settings.autosearch) {
    await check_update();
}

// If an update is available, prompt user that an update is available
if (useUpdateStore.getState().isAvailable) {
    setPrompting(true);
}