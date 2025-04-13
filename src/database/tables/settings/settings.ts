import type { Settings } from "./type.ts";

const get_default_settings = (): Omit<Settings, "id"> => {
    return {
        color: "gray",
        mode: "system",
        remember: 14,
        notification: false,
        relaunch: false,
        autostart: false,
        auto_search: false,
        language: new Intl.Locale(navigator.language).language as any,
    };
};

export { get_default_settings };