import type { Colors, Modes } from "@/lib/app/types";
import type { CoreRecord } from "@/lib/util/types";

interface Settings extends CoreRecord {
    mode: Modes;
    color: Colors;
    remember: number;
    notification: boolean;
    relaunch: boolean;
    autostart: boolean,
    auto_search: boolean,
    language: "de" | "en",
};

export type { Settings };