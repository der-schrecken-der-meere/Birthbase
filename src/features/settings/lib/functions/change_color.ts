// External features
import type { AppColors } from "@/database/birthalert/settings/types";
import { COLORS } from "@/database/birthalert/settings/lib/constants/colors";

/** Changes the color class on the body tag */
const change_color = (color: AppColors) => {
    window.document.body.classList.remove(...COLORS);
    window.document.body.classList.add(color);
};

export { change_color };