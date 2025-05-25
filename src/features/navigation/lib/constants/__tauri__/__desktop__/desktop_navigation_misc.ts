// Packages
import { exit } from "@tauri-apps/plugin-process";
import { Power } from "lucide-react";

// External features
import i18n from "@/i18n/load";

// Internal features
import { LinkEntry } from "@/features/navigation/types/store";

const DESKTOP_NAVIGATION_MISC: LinkEntry[] = [
    {
        title: i18n.t("close_app", { ns: "generally" }),
        Icon: Power,
        onClick: async () => {
            await exit(0);
        },
    }
];

export { DESKTOP_NAVIGATION_MISC };