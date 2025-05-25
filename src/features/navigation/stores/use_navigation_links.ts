// Packages
import { create } from "zustand";
import { Bell, CalendarClock, DatabaseBackup, HardDrive, House, Info, Languages, Monitor, PartyPopper, Settings } from "lucide-react";

// External features
import i18n from "@/i18n/load";

// Internal features
import type { LinkEntry, NavigationLinksStore } from "../types/store";
import { PageLinks } from "../lib/constants/enums/PageLinks";

let TAURI_NAVIGATION_LINKS: LinkEntry[];
let DESKTOP_NAVIGATION_LINKS: LinkEntry[];
let DESKTOP_NAVIGATION_MISC: LinkEntry[];
if (__IS_TAURI__) {
    TAURI_NAVIGATION_LINKS = await import("../lib/constants/__tauri__/tauri_navigation_links").then(module => module.TAURI_NAVIGATION_LINKS);
    if (__TAURI_IS_DESKTOP__) {
        DESKTOP_NAVIGATION_LINKS = await import("../lib/constants/__tauri__/__desktop__/desktop_navigation_links").then(module => module.DESKTOP_NAVIGATION_LINKS);
        DESKTOP_NAVIGATION_MISC = await import("../lib/constants/__tauri__/__desktop__/desktop_navigation_misc").then(module => module.DESKTOP_NAVIGATION_MISC);
    }
}

const useNavigationLinksStore = create<NavigationLinksStore>()((set) => ({
    mainLinks: {
        title: "",
        links: [],
    },
    settingsLinks: {
        title: "",
        links: [],
    },
    miscActions: {
        title: "",
        links: [],
    },
    setTranslations: () => {
        const main_str = (key: string) => i18n.t("main." + key, { ns: "navigation" });
        const settings_str = (key: string) => i18n.t("settings." + key, { ns: "navigation" });

        const main_title = main_str("title");
        const settings_title = settings_str("title");
        const misc_title = i18n.t("misc", { ns: "generally" });

        const main: LinkEntry[] = [
            {
                title: main_str("home"),
                url: PageLinks.HOME,
                Icon: House,
            },
            {
                title: main_str("my_birthdays"),
                url: PageLinks.MY_BIRTHDAYS_PARAMS,
                Icon: PartyPopper,
            },
            {
                title: main_str("settings"),
                url: PageLinks.SETTINGS,
                Icon: Settings,
                shortcut: "⌘E",
            },
            {
                title: main_str("notifications"),
                url: PageLinks.NOTIFICATIONS,
                Icon: Bell,
                shortcut: "⌘P",
            }
        ];
        const settings: LinkEntry[] = [
            {
                title: settings_str("appearance"),
                url: PageLinks.SETTINGS_APPEARANCE,
                Icon: Monitor,
                search: settings_str("appearance_search"),
            },
            {
                title: settings_str("notifications"),
                url: PageLinks.SETTINGS_NOTIFICATION,
                Icon: Bell,
                search: settings_str("notifications_search")
            },
            {
                title: settings_str("storage"),
                url: PageLinks.SETTINGS_STORAGE,
                Icon: HardDrive,
                search: settings_str("storage_search"),
            },
            {
                title: settings_str("time"),
                url: PageLinks.SETTINGS_TIME,
                Icon: CalendarClock,
            },
            {
                title: settings_str("language"),
                url: PageLinks.SETTINGS_LANGUAGE,
                Icon: Languages,
            },
            {
                title: settings_str("info"),
                url: PageLinks.SETTINGS_INFO,
                Icon: Info,
                search: settings_str("info_search")
            },
            {
                title: settings_str("backup"),
                url: PageLinks.SETTINGS_BACKUP,
                Icon: DatabaseBackup,
            },
        ];
        const miscAction: LinkEntry[] = [];

        if (__IS_TAURI__) {
            settings.push(...TAURI_NAVIGATION_LINKS);
            if (__TAURI_IS_DESKTOP__) {
                settings.push(...DESKTOP_NAVIGATION_LINKS);
                miscAction.push(...DESKTOP_NAVIGATION_MISC);
            }
        }

        set(() => ({
            mainLinks: {
                title: main_title,
                links: main
            },
            settingsLinks: {
                title: settings_title,
                links: settings
            },
            miscActions: {
                title: misc_title,
                links: miscAction,
            },
        }));
    },
}));

export { useNavigationLinksStore };