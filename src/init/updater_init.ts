import { Settings } from "@/database/tables/settings/settings";
import { check_update } from "@/features/updater/updater";
import { useUpdateStore } from "@/stores/use_update_store";

const init_updater = async (settings: Omit<Settings, "id">) => {
    const setPrompting = useUpdateStore.getState().setPrompting;

    setPrompting(false);
    if (settings.auto_search) {
        await check_update();
    }
    if (!useUpdateStore.getState().isAvailable) {
        setPrompting(false);
    }
};

export { init_updater };