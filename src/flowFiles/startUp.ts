/** This will be called before react and load scripts into memory
 * - the internal database
 * - object with all workers
*/
import { settingsModel } from "@/database/birthalert/settings/model";
import { appStartWorker } from "@/worker/AppStart/controller";
import { change_color } from "@/features/settings/lib/functions/change_color";
import { change_mode } from "@/features/settings/lib/functions/change_mode";
import { change_language } from "@/features/settings/lib/functions/change_language";
import { Tasks } from "@/frontend/worker_scripts/load_birthdays";

import "./initializeWorker";
import "./initializeSettings";
import "./initializeLanguage";
import { useAppStore } from "@/stores/use_app_store";
import { useNavigationLinksStore } from "@/features/navigation/stores/use_navigation_links";

// Start appStartWorker
appStartWorker.send_message({ task: Tasks.LOAD_BIRTHDAYS });

if (__IS_TAURI__) {
    await import("./__tauri__/initializeTauri");
    if (__TAURI_IS_DESKTOP__) {
        await import("./__tauri__/___desktop__/initializeTauriUpdater");
    }
}

useNavigationLinksStore.getState().setTranslations();
useAppStore.getState().setAppName(__APP_NAME__);

const [{ color, mode, language }] = await settingsModel.readAllRecords();

// Set pre react options
change_color(color);
change_mode(mode);
change_language(language);