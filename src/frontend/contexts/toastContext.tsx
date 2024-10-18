import { createContext, ReactNode, useCallback, useContext } from "react";
import { ToasterToast, useToast } from "../components/ui/use-toast";
import { Toaster } from "../components/ui/toaster";

type toastConfig = {
    title: string,
    description: ReactNode,
}

interface ToastContext {
    setErrorNotification: (toastConfig: Partial<toastConfig>) => void;
    setSuccessNotification: (toastConfig: Partial<toastConfig>) => void;
}

const ToastContext = createContext<ToastContext>({
    setErrorNotification: () => {},
    setSuccessNotification: () => {},
})

const ToastProvider = ({
    children
}: {
    children: ReactNode
}) => {

    const { toast } = useToast();

    const setErrorNotification = useCallback<ToastContext["setErrorNotification"]>((e) => {
        const config: Omit<ToasterToast, "id"> = { ...e, ...{
            variant: "destructive",
            duration: 3000,
        } }
        console.log(config);
        toast(config);
    }, []);

    const setSuccessNotification = useCallback<ToastContext["setSuccessNotification"]>((e) => {
        const config: Omit<ToasterToast, "id"> = { ...e, ...{
            variant: "default",
            duration: 2000,
        } }
        toast(config);
    }, []);

    return (
        <ToastContext.Provider value={{setErrorNotification, setSuccessNotification}}>
            {children}
            <Toaster/>
        </ToastContext.Provider>
    );
}

export default ToastProvider;

export const useToastNotification = () => {
    return useContext(ToastContext);
}
