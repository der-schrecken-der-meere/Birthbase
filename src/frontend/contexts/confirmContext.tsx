import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";

interface ConfirmConfig {
    title: string;
    description: string;
    onCancel: () => void;
    onConfirm: () => void;
}

interface ConfirmContext {
    setConfirm: (config: Partial<ConfirmConfig>) => void;
}

const ConfirmContext = createContext<ConfirmContext>({
    setConfirm: () => {},
});

const ConfirmProvider = ({
    children
}: {
    children: ReactNode
}) => {

    const defaultConfig = useMemo<ConfirmConfig>(() => ({
        description: "",
        title: "",
        onCancel: () => {},
        onConfirm: () => {},
    }), []);
    const [open, setOpen] = useState(false);
    const [config, setConfig] = useState(defaultConfig)

    const setConfirm = useCallback<ConfirmContext["setConfirm"]>((config) => {
        setConfig({...defaultConfig, ...config});
        setOpen(true);
    }, [setOpen, defaultConfig]);

    const onCancelClick = useCallback(() => {
        setOpen(false);
        config.onCancel();
    }, [config.onCancel, setOpen]);
    const onActionClick = useCallback(() => {
        setOpen(false);
        config.onConfirm();
    }, [config.onConfirm]);

    return (
        <ConfirmContext.Provider value={{setConfirm}}>
            {children}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{config.title}</AlertDialogTitle>
                        <AlertDialogDescription>{config.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onCancelClick}>Abbrechen</AlertDialogCancel>
                        <AlertDialogAction onClick={onActionClick}>Fortfahren</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmContext.Provider>
    )
}

export default ConfirmProvider;

export const useConfirm = () => {
    return useContext(ConfirmContext);
}