import { type ToasterToast, useToast } from "@/components/ui/use-toast";
import { createContext, useCallback, useContext } from "react";

type toastConfig = Pick<ToasterToast, "title" | "description">;

interface AppToastContextProps {};

interface useAppToastProps {
    setErrorNotification: (toastConfig: Partial<toastConfig>) => void,
    setSuccessNotification: (toastConfig: Partial<toastConfig>) => void,
};

const AppToastContext = createContext<AppToastContextProps>({});

const useAppToast = () => {

    const useAppToastProps = useContext(AppToastContext);

    const { toast } = useToast();

    const setErrorNotification = useCallback((e: Partial<toastConfig>) => {
        const config = { ...e, ...{
            variant: "destructive",
            duration: 3000,
        } };
        toast(config as ToasterToast);
    }, [toast]);

    const setSuccessNotification = useCallback<useAppToastProps["setSuccessNotification"]>((e) => {
        const config = { ...e, ...{
            variant: "default",
            duration: 2000,
        } }
        toast(config as ToasterToast);
    }, [toast]);

    return {
        setSuccessNotification,
        setErrorNotification,
        ...useAppToastProps,
    };
};

export type { toastConfig, useAppToastProps };
export { useAppToast, AppToastContext };