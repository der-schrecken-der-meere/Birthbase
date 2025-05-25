import type { AppSettings } from "./types";

const create_default_settings = (): AppSettings => ({
    autosearch: true,
    autostart: false,
    color: "blue",
    language: "en",
    mode: "system",
    notification: false,
    relaunch: true,
});

export { create_default_settings };