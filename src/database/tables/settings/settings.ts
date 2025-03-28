import { colors } from "../../../globals/constants/colors.ts";
import type { CoreRecord } from "../../db_types.ts";

type Color = typeof colors[number];
type Mode = "dark"|"light"|"system";

interface Settings extends CoreRecord {
    mode: Mode;
    color: Color;
    remember: number;
    notification: boolean;
    relaunch: boolean;
    autostart: boolean,
    auto_search: boolean,
    language: "de" | "en",
};

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

export type { Color, Mode, Settings };
export { get_default_settings };