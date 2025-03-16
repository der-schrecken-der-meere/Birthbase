import { type OsType } from "@tauri-apps/plugin-os";
import { type ReactNode } from "react";

import { useAppStore } from "@/stores/use_app_store";

import { primitive_strict_or } from "@/lib/functions/logic/or";
import { isTauri } from "@tauri-apps/api/core";

const OnlyTauri = ({
    children,
    osTypes,
}: {
    children: ReactNode,
    osTypes: OsType[]
}) => {
    const osType = useAppStore((state) => state.osType);

    if (!isTauri()) {
        return (
            null
        );
    }

    if (!primitive_strict_or<OsType>(osType, ...osTypes)) {
        return (
            null
        );
    }

    return children;
};

export { OnlyTauri };