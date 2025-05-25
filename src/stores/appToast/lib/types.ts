// External features
import type { ToasterToast } from "@/components/ui/use-toast";

// Internal features
import type { AppToastType } from "./enum/type";

interface AppToastStore {
    /** Indicates whether a toast is already created */
    isCreated: boolean,
    /** Toast config */
    toastConfig: Omit<ToasterToast, "id">,
    /** Creates a new toast message */
    setToast: (toast_config: Omit<ToasterToast, "id">, type: AppToastType) => void,
    setNotCreated: () => void,
}

export type { AppToastStore };