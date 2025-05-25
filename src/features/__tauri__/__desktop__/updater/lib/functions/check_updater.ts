// Packages
import { check } from "@tauri-apps/plugin-updater";

// External features
import type { VersionNumber } from "@/lib/types/number";
import { ToastType, useToastStore } from "@/stores/use_toast_store";
import i18n from "@/i18n/load";

// Internal features
import { useUpdateStore } from "../../stores/use_update";

const check_update = async () => {
    const setSearching = useUpdateStore.getState().setSearching;
    const setAvailable = useUpdateStore.getState().setAvailable;
    const setLastCheck = useUpdateStore.getState().setLastCheck;
    const setVersion = useUpdateStore.getState().setVersion;
    const setNotes = useUpdateStore.getState().setNotes;

    const setToast = useToastStore.getState().setToast;

    // Set the search state
    setSearching(true);

    // Set the available update to false
    setAvailable(false);
    setNotes("");

    try {
        // Look for an update
        const update = await check({
            timeout: 10_000,
        });
        if (update) {
            // Dereference update object 
            const { version, body } = update;

            // Fill update information
            setNotes(body ? body : "");
            setVersion(version as VersionNumber);
            setAvailable(true);

            // Clean up resource from memory
            update.close();
        }
    } catch (e) {
        // Set toast error message
        setToast({
            title: i18n.t("update.search_title", { ns: "error" }),
            description: i18n.t("update.search_description", { ns: "error" }),
        }, ToastType.ERROR);
    } finally {
        // End search process and set last check time to the current time
        setSearching(false);
        setLastCheck();
    }
};

export { check_update };