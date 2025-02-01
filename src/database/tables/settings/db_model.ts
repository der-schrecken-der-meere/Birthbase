import { db, TABLES } from "@/database/db";
import { get_default_settings, type Settings } from "./settings";
import { has_property } from "@/lib/functions/object/hasProperty";

/**
 * Updates the current config with new values.
 * 
 * If there is no config, a combination of the default config and the new values is created and returned.
 */
const set_settings_model = async (settings: Partial<Settings>) => {
    // Id isn't required as there is only one config
    if (has_property(settings, "id")) {
        delete settings.id;
    }
    try {
        // Get all available configs
        const settingsArray = await db.get(TABLES.SETTINGS);
        const defaultSettings = get_default_settings();
        // If no configs exist
        if (settingsArray.length === 0) {
            // Combine values from default config and passed config
            const newSettings = { ...defaultSettings, ...settings };
            // Create new config
            const res = await db.add(TABLES.SETTINGS, newSettings);
            return Promise.resolve(res);
        }
        // Combine values from default config, first config and passed config
        const newSettings = { ...defaultSettings, ...settingsArray[0], ...settings };
        // Update first config of array
        const res = db.upd(TABLES.SETTINGS, newSettings);
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * Sets the config to the default.
 * 
 * If there is no config, default config is created and returned.
 */
const unset_settings_model = async () => {
    try {
        // Get all available configs
        const settingsArray = await db.get(TABLES.SETTINGS);
        const defaultSettings = await get_default_settings();
        // If no configs exist
        if (settingsArray.length === 0) {
            // Create new default config
            const res = await db.add(TABLES.SETTINGS, defaultSettings);
            return Promise.resolve(res);
        }
        const newSettings = { ...settingsArray[0], ...defaultSettings };
        const res = db.upd(TABLES.SETTINGS, newSettings);
        return Promise.resolve(res);
    } catch (e) {
        return Promise.reject(e);
    }
};

/**
 * Returns the config.
 * 
 * If there is no config, the default config is returned (no config will be created in the database).
 */
const get_settings_model = async () => {
    try {
        // Get all available configs
        const settingsArray = await db.get(TABLES.SETTINGS);
        const defaultSettings = get_default_settings();
        // If no configs exist
        if (settingsArray.length === 0) {
            // Return default config
            return Promise.resolve(defaultSettings);
        }
        return Promise.resolve(settingsArray[0]);
    } catch (e) {
        return Promise.reject(e);
    }
};

const clear_settings_model = async () => {
    return db.clear(TABLES.SETTINGS);
}

export {
    set_settings_model,
    unset_settings_model,
    get_settings_model,
    clear_settings_model,
};