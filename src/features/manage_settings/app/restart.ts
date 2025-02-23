import { enable, disable } from "@tauri-apps/plugin-autostart";

const change_autostart = async (autostart: boolean) => {
    if (autostart) {
        await enable();
    } else {
        await disable();
    }
};

export { change_autostart };