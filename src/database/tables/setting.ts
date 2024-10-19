import { colors } from "@/globals/constants/colors";
import { CoreRecord } from "../db_types";

type Color = typeof colors[number];
type Mode = "dark"|"light"|"system";

interface Settings extends CoreRecord {
    mode: Mode;
    color: Color;
    remember: number;
}

const getDefaultSettings = (): Settings => {
    return {
            color: "purple",
            mode: "system",
            remember: 14,
            id: -1,
    };
}

export type { Color, Mode, Settings }
export { getDefaultSettings }