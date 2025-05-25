// External features
import { LayoutDashboard } from "lucide-react";
import i18n from "@/i18n/load";

// Internal features
import { LinkEntry } from "../../../types/store";
import { PageLinks } from "../enums/PageLinks";

const TAURI_NAVIGATION_LINKS: LinkEntry[] = [
    {
        search: i18n.t("settings.app", { ns: "navigation" }),
        title: i18n.t("settings.app", { ns: "navigation" }),
        url: PageLinks.SETTINGS_APP,
        Icon: LayoutDashboard,
    },
];

export { TAURI_NAVIGATION_LINKS };