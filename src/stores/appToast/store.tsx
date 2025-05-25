// Packages
import { CircleCheck, CircleX, Info } from "lucide-react";
import { create } from "zustand";

// Internal features
import type { AppToastStore } from "./lib/types";
import { AppToastType } from "./lib/enum/type";

const useToastStore = create<AppToastStore>()((set) => ({
    isCreated: false,
    toastConfig: {},
    setToast: (toast_config, type = AppToastType.NORMAL) => {
        let { title, ...props } = toast_config;
        let new_title = null;
        const class_name = "w-6 h-6";

        switch (type) {
            case AppToastType.NORMAL:
                break;
            case AppToastType.INFO:
                new_title = <Info className={class_name} />;
                break;
            case AppToastType.SUCCESS:
                new_title = <CircleCheck className={class_name} />;
                break;
            case AppToastType.ERROR:
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

export { useToastStore };