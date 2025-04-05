import type { CheckUpdateProps } from "./types";

import { Button } from "../ui/button";

// import { mock_check_update } from "@/features/updater/test/update";
import { check_update } from "@/features/__tauri__/__desktop__/updater/fn/check_updater";

const CheckUpdate = ({
    onClick,
    children,
    ...props
}: CheckUpdateProps) => {
    const onCheckClick = () => {
        (async () => {
            await check_update();
        })();
    };

    return (
        <Button
            onClick={onCheckClick}
            {...props}
        >
            {children}
        </Button>
    );
};

export { CheckUpdate };