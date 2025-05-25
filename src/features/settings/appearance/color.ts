import type { Color } from "@/database/tables/settings/settings";
import { colors } from "@/globals/constants/colors";

/** Changes the color class on the body tag */
const change_color = (color: Color) => {
    window.document.body.classList.remove(...colors);
    window.document.body.classList.add(color);
};

export { change_color };