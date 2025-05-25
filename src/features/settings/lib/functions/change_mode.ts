// External features
import type { AppModes } from "@/database/birthalert/settings/types";
import { MODES } from "@/database/birthalert/settings/lib/constants/modes";

// Internal features
import { match_mode } from "./match_mode";

/** Changes the mode class on the body tag */
const change_mode = (mode: AppModes) => {
    window.document.body.classList.remove(...MODES);
    window.document.body.classList.add(match_mode(mode));
};

export { change_mode };