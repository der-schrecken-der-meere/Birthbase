import { type Settings } from "@/database/tables/settings/settings";

import { useUpdateStore } from "@/stores/use_update_store";

import { check_update } from "@/features/__tauri__/__desktop__/updater/fn/check_updater";

/** Initialize all specific update configs */
const init_updater = async (settings: Omit<Settings, "id">) => {
    const setPrompting = useUpdateStore.getState().setPrompting;

    // Set prompt window at start to "dont show"
    setPrompting(false);

    // If user has auto search enabled, check for updates
    if (settings.auto_search) {
        await check_update();
    }

    if (useUpdateStore.getState().isAvailable) {
        // Prompt user that an update is available
        setPrompting(true);
    }
};

export { init_updater };