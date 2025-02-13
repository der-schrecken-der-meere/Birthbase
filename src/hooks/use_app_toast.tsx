import { ToasterToast } from "@/components/ui/use-toast";
import { CircleCheck, CircleX, Info } from "lucide-react";
import { create } from "zustand";

enum ToastType {
    INFO,
    SUCCESS,
    ERROR,
    NORMAL,
};

interface AppToast {
    toast_create: boolean,
    toast_config: Omit<ToasterToast, "id">, 
    set_toast: (toast_config: Omit<ToasterToast, "id">) => void,
    unset_toast_create: () => void,
};

const use_app_toast = create<AppToast>()((set) => ({
    toast_create: false,
    toast_config: { id: "" },
    set_toast: (toast_config) => set(() => ({ toast_config, toast_create: true })),
    unset_toast_create: () => set(() => ({ toast_create: false, toast_config: {} })),
}));

const create_toast = (toast_config: Omit<ToasterToast, "id">, type: ToastType = ToastType.NORMAL) => {
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

    use_app_toast.getState().set_toast({ title: (
        <div className="flex items-center gap-2">
            {new_title}
            {title}
        </div>
    ) as any, ...props });
};

export { use_app_toast, create_toast, ToastType };