import type { DownloadUpdateProps } from "./types";

import { Button } from "../../../ui/button";

import { useAppStore } from "@/stores/use_app_store";

// import { mock_update } from "@/features/updater/test/update";
import { install_update } from "@/features/__tauri__/__desktop__/updater/lib/functions/install_update";

const DownloadUpdate = ({
    onClick,
    children,
    relaunch,
    ...props
}: DownloadUpdateProps) => {
    const osType = useAppStore((state) => state.osType);

    const onDownloadClick = () => {
        (async () => {
            await install_update(osType, relaunch);
        })();
    };

    return (
        <Button
            onClick={onDownloadClick}
            {...props}
        >
            {children}
        </Button>
    );
};

export { DownloadUpdate };