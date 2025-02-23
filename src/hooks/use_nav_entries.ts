import { PageLinks } from "@/globals/constants/links";
import i18n from "@/i18n/config";
import { is_desktop } from "@/lib/functions/logic/desktop";
import { Bell, CalendarClock, HardDrive, House, Info, Languages, LayoutDashboard, LucideProps, Monitor, PartyPopper, RefreshCw, Settings } from "lucide-react";
import { create } from "zustand";
import { use_app_store } from "./use_app_store";
import { FunctionComponent } from "react";

type LinkEntry = {
    title: string,
    url: PageLinks,
    icon: FunctionComponent<LucideProps>,
    search?: string,
    shortcut?: string,
};

type Group = {
    title: string,
    entries: LinkEntry[]
};

interface NavEntries {
    main_links: Group,
    settings_links: Group,
    update_language: () => void,
};

const use_nav_entries = create<NavEntries>()((set) => ({
    main_links: {
        title: "",
        entries: [],
    },
    settings_links: {
        title: "",
        entries: [],
    },
    update_language: () => {
        const main_str = (key: string) => i18n.t("main." + key, { ns: "navigation" });
        const settings_str = (key: string) => i18n.t("settings." + key, { ns: "navigation" });

        const main_title = main_str("title");
        const settings_title = settings_str("title");

        const main: LinkEntry[] = [
            {
                title: main_str("home"),
                url: PageLinks.HOME,
                icon: House,
            },
            {
                title: main_str("my_birthdays"),
                url: PageLinks.MY_BIRTHDAYS_PARAMS,
                icon: PartyPopper,
            },
            {
                title: main_str("settings"),
                url: PageLinks.SETTINGS,
                icon: Settings,
                shortcut: "⌘E",
            },
            {
                title: main_str("notifications"),
                url: PageLinks.NOTIFICATIONS,
                icon: Bell,
                shortcut: "⌘P",
            }
        ];
        const settings: LinkEntry[] = [
            {
                title: settings_str("appearance"),
                url: PageLinks.SETTINGS_APPEARANCE,
                icon: Monitor,
                search: settings_str("appearance_search"),
            },
            {
                title: settings_str("notifications"),
                url: PageLinks.SETTINGS_NOTIFICATION,
                icon: Bell,
                search: settings_str("notifications_search")
            },
            {
                title: settings_str("storage"),
                url: PageLinks.SETTINGS_STORAGE,
                icon: HardDrive,
                search: settings_str("storage_search"),
            },
            {
                title: settings_str("time"),
                url: PageLinks.SETTINGS_TIME,
                icon: CalendarClock,
            },
            {
                title: settings_str("language"),
                url: PageLinks.SETTINGS_LANGUAGE,
                icon: Languages,
            },
            {
                title: settings_str("info"),
                url: PageLinks.SETTINGS_INFO,
                icon: Info,
                search: settings_str("info_search")
            },
            {
                title: settings_str("app"),
                url: PageLinks.SETTINGS_APP,
                icon: LayoutDashboard,
                search: settings_str("app_search")
            },
        ];
        if (is_desktop(use_app_store.getState().os_type)) {
            settings.push({
                title: settings_str("update"),
                url: PageLinks.SETTINGS_UPDATE,
                icon: RefreshCw,
                search: settings_str("update_search")
            });
        }
        set(() => ({
            main_links: {
                title: main_title,
                entries: main
            },
            settings_links: {
                title: settings_title,
                entries: settings
            },
        }));
    },
}));

export type { LinkEntry };
export { use_nav_entries };