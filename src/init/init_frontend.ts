import type { Settings } from "@/database/tables/settings/type";
import { change_color } from "@/features/manage_settings/appearance/color";
import { change_mode } from "@/features/manage_settings/appearance/mode";
import { change_language } from "@/features/manage_settings/language/language";

/**
 * Initialize all app specific settings
 * 
 * such as color, mode and language
 */
const init_settings = (settings: Omit<Settings, "id">) => {
    change_color(settings.color);
    change_mode(settings.mode);
    change_language(settings.language);
};

export { init_settings };