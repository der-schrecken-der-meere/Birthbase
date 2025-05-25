// External features
import { RefreshCw } from "lucide-react";
import i18n from "@/i18n/load";

// Internal features
import { LinkEntry } from "../../../../types/store";
import { PageLinks } from "../../enums/PageLinks";

const DESKTOP_NAVIGATION_LINKS: LinkEntry[] = [
    {
        search: i18n.t("settings.update_search", { ns: "navigation" }),
        title: i18n.t("settings.update", { ns: "navigation" }),
        url: PageLinks.SETTINGS_UPDATE,
        Icon: RefreshCw,
    },
];

export { DESKTOP_NAVIGATION_LINKS };