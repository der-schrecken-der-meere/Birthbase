import { type ConfirmConfig, ConfirmDialogContext } from "@/hooks/useConfirmDialog";
import { useMemo, useState, type ReactNode } from "react";
import { ConfirmDialog } from "../singletons/ConfirmDialog";

interface ConfirmDialogProviderProps {
    children: ReactNode,
    defaultOpen?: boolean,
    defaultConfig?: ConfirmConfig,
};

const ConfirmDialogProvider = ({
    children,
    defaultOpen = false,
    defaultConfig = {
        description: "",
        title: "",
        onCancel: () => {},
        onConfirm: () => {},
    },
}: ConfirmDialogProviderProps) => {

    const [open, setOpen] = useState(defaultOpen);
    const [config, setConfig] = useState(defaultConfig);

    const contextValue = useMemo(() => ({
        open,
        setOpen,
        config,
        setConfig,
    }), [open, config]);

    return (
        <ConfirmDialogContext.Provider value={contextValue}>
            {children}
            <ConfirmDialog/>
        </ConfirmDialogContext.Provider>
    );
};

export { ConfirmDialogProvider };