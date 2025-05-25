// External features
import type { AppModes } from "@/database/birthalert/settings/types";

const match_mode = (mode: AppModes): AppModes => {
    return (mode === "system")
        ? (window
                .matchMedia("(prefers-color-scheme: dark)")
                .matches
                    ? "dark"
                    : "light"
        )
        : mode;
};

export { match_mode };