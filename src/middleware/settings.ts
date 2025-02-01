import { clear_settings_model, get_settings_model, set_settings_model, unset_settings_model } from "@/database/tables/settings/db_model";
import { get_default_settings, Settings } from "@/database/tables/settings/settings";
import { change_color } from "@/features/manage_settings/appearance/color";
import { change_mode } from "@/features/manage_settings/appearance/mode";
import { change_notification } from "@/features/manage_settings/notifications/notification";

const set_settings_middleware = async (settings: Partial<Settings>) => {
    try {
        const obj_old_settings = await get_settings_model();
        const bool_update_mode = settings?.mode !== obj_old_settings.mode;
        const bool_update_color = settings?.color !== obj_old_settings.color;
        const bool_update_notification = settings?.notification !== obj_old_settings.notification;
        
        const obj_new_settings = await set_settings_model(settings);
        if (bool_update_mode) {
            change_mode(obj_new_settings.mode);
        }
        if (bool_update_color) {
            change_color(obj_new_settings.color);
        }
        if (bool_update_notification) {
            change_notification(obj_new_settings.notification);
        }
        return obj_new_settings;
    } catch (e) {
        Promise.reject(e);
    }
};

const unset_settings_middleware = async () => {
    try {
        const obj_settings = await unset_settings_model();
        change_mode(obj_settings.mode);
        change_color(obj_settings.color);
        return obj_settings;
    } catch (e) {
        Promise.reject(e);
    }
};

const clear_settings_middleware = async () => {
    try {
        await clear_settings_model();
        const default_settings: Settings = { ...get_default_settings(), ...{ id: -1 }};
        change_mode(default_settings.mode);
        change_color(default_settings.color);
        change_notification(default_settings.notification);
        return default_settings;
    } catch (e) {
        Promise.reject(e);
    }
};

export {
    set_settings_middleware,
    unset_settings_middleware,
    clear_settings_middleware,
};