import { check_update } from "@/features/updater/updater";
import { use_update_store } from "@/hooks/use_update_store";

const init_updater = async () => {
    use_update_store.getState().set_prompt(true);
    await check_update();
    if (!use_update_store.getState().available) {
        use_update_store.getState().set_prompt(false);
    }
};

export { init_updater };