import type { VersionNumber } from "@/lib/types/number";

import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { type } from "@tauri-apps/plugin-os";
import { init_app_store } from "../stores/init_app_store";

/**
 * Initialize all app specific settings
 */
const init_tauri = async () => {

    // Get the app version
    const appVersion = await getVersion() as VersionNumber;

    // Get the tauri version
    const tauriVersion = await getTauriVersion() as VersionNumber;

    // Get the OS type
    const osType = type();

    init_app_store({ appVersion, tauriVersion, osType })
};

export { init_tauri };