import type { Settings } from "@/database/tables/settings/type";
import { init_workers } from "./init_worker";
import { AppStartWorker } from "@/worker/AppStart/controller";
import { Tasks } from "@/frontend/worker_scripts/load_birthdays";
import { get_settings_model } from "@/database/tables/settings/db_model";
import { init_settings } from "./init_frontend";

let init_tauri: (() => Promise<void>) = async () => {};
let init_updater: ((settings: Omit<Settings, "id">) => Promise<void>) = async () => {};

// Load platform specific features
if (__IS_TAURI__) {
    init_tauri = (await import("@/init/__tauri__/tauri_init")).init_tauri;
    if (__TAURI_IS_DESKTOP__) {
        init_updater = (await import("@/init/__tauri__/__desktop__/updater_init")).init_updater;
    }
}

const init = async () => {
    // Initialize all workers and if necessary send ports for worker communication
    init_workers();

    // Tell worker that it should load the birthdays and send them to the notification worker
    AppStartWorker.send_message({ task: Tasks.LOAD_BIRTHDAYS });

    // Get current settings
    const settings = await get_settings_model();

    // Initialize app
    await init_tauri();
    await init_updater(settings);
    
    // Initialize frontend features based on settings
    init_settings(settings);
};

export { init };