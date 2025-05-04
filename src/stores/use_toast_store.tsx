import { ToasterToast } from "@/components/ui/use-toast";
import { CircleCheck, CircleX, Info } from "lucide-react";
import { create } from "zustand";

enum ToastType {
    /** Information messages */
    INFO,
    /** Successful messages */
    SUCCESS,
    /** Error messages */
    ERROR,
    /** Normal messages */
    NORMAL,
};

interface AppToast {
    /** Indicates whether a toast is already created */
    isCreated: boolean,
    /** Toast config */
    toastConfig: Omit<ToasterToast, "id">,
    /** Creates a new toast message */
    setToast: (toast_config: Omit<ToasterToast, "id">, type: ToastType) => void,
    setNotCreated: () => void,
};

const useToastStore = create<AppToast>()((set) => ({
    isCreated: false,
    toastConfig: {},
    setToast: (toast_config, type = ToastType.NORMAL) => {
        let { title, ...props } = toast_config;
        let new_title = null;
        const class_name = "w-6 h-6";

        switch (type) {
            case ToastType.NORMAL:
                break;
            case ToastType.INFO:
                new_title = <Info className={class_name} />;
                break;
            case ToastType.SUCCESS:
                new_title = <CircleCheck className={class_name} />;
                break;
            case ToastType.ERROR:
                props.variant = "destructive";
                new_title = <CircleX className={class_name} />;
                break;
        };

        set(() => ({
            toastConfig: {
                title: (
                    <div className="flex items-center gap-2">
                        {new_title}
                        {title}
                    </div>
                ) as any,
                ...props
            },
            isCreated: true
        }));
    },
    setNotCreated: () => set(() => ({ isCreated: false, toastConfig: {} })),
}));

export { useToastStore, ToastType };