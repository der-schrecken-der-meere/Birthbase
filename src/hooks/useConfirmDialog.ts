import { createContext, Dispatch, SetStateAction, useCallback, useContext } from "react";

type ConfirmConfig = {
    title: string,
    description: string,
    onCancel: () => void,
    onConfirm: () => void,
};

interface ConfirmDialogContextProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    config: ConfirmConfig,
    setConfig: Dispatch<SetStateAction<ConfirmConfig>>,
};

const ConfirmDialogContext = createContext<ConfirmDialogContextProps>({
    open: false,
    setOpen: () => {},
    config: {
        title: "",
        description: "",
        onCancel: () => {},
        onConfirm: () => {},
    },
    setConfig: () => {},
});

const useConfirmDialog = () => {

    const useConfirmProps = useContext(ConfirmDialogContext);
    const setConfirm = useCallback((config: Partial<ConfirmConfig>) => {
        useConfirmProps.setConfig({
            ...useConfirmProps.config,
            ...config,
        });
        useConfirmProps.setOpen(true);
    }, [useConfirmProps.open, useConfirmProps.config]);

    return {
        setConfirm,
        ...useConfirmProps,
    };
};

export type { ConfirmConfig, ConfirmDialogContextProps };
export { useConfirmDialog, ConfirmDialogContext };