import { clear_settings_model, get_settings_model, set_settings_model, unset_settings_model } from "@/database/tables/settings/db_model";
import { get_default_settings, Settings } from "@/database/tables/settings/settings";
import { change_autostart } from "@/features/manage_settings/app/restart";
import { change_color } from "@/features/manage_settings/appearance/color";
import { change_mode } from "@/features/manage_settings/appearance/mode";
import { change_language } from "@/features/manage_settings/language/language";
import { change_notification } from "@/features/manage_settings/notifications/notification";
import { isTauri } from "@tauri-apps/api/core";

const check_update_prop = (new_values: Partial<Settings>, old_values: Omit<Settings, "id">) => {
    const updates = {};
    Object.entries(old_values).forEach(([key, value]) => {
        if (Object.hasOwn(new_values, key)) {
            /* @ts-ignore */
            updates[key] = new_values[key] !== value;
        } else {
            /* @ts-ignore */
            updates[key] = false;
        }
        
    });
    return updates as { [k in keyof typeof old_values]: boolean };
};

const set_settings_middleware = async (settings: Partial<Settings>) => {
    try {
        const obj_old_settings = await get_settings_model();
        const updates = check_update_prop(settings, obj_old_settings);
        
        console.log(updates);

        const obj_new_settings = await set_settings_model(settings);
        if (updates.mode) {
            change_mode(obj_new_settings.mode);
        }
        if (updates.color) {
            change_color(obj_new_settings.color);
        }
        if (updates.notification) {
            change_notification(obj_new_settings.notification);
        }
        if (updates.language) {
            change_language(obj_new_settings.language);
        }
        if (isTauri()) {
            if (updates.autostart) {
                await change_autostart(obj_new_settings.autostart);
            }
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
        change_notification(obj_settings.notification);
        change_language(obj_settings.language);
        if (isTauri()) {
            await change_autostart(obj_settings.autostart);
        }
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
        change_language(default_settings.language);
        if (isTauri()) {
            await change_autostart(default_settings.autostart);
        }
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