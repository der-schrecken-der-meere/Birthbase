// import { colors } from "@/globals/constants/colors";
import { colors } from "../../../globals/constants/colors.ts";
import type { CoreRecord } from "../../db_types.ts";

type Color = typeof colors[number];
type Mode = "dark"|"light"|"system";

interface Settings extends CoreRecord {
    mode: Mode;
    color: Color;
    remember: number;
    notification: boolean;
}

const get_default_settings = (): Omit<Settings, "id"> => {

    return {
        color: "purple",
        mode: "system",
        remember: 14,
        notification: false,
    };
}

export type { Color, Mode, Settings }
export { get_default_settings }