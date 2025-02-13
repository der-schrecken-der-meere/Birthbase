import { use_app_toast } from "@/hooks/use_app_toast";
import { useToast } from "../ui/use-toast";
import { Toaster } from "../ui/toaster";
import { useEffect } from "react";

const Toast = () => {
    const toast_config = use_app_toast((state) => state.toast_config);
    const toast_create = use_app_toast((state) => state.toast_create);
    const unset_toast = use_app_toast((state) => state.unset_toast_create);
    const { toast } = useToast();

    useEffect(() => {
        if (toast_create) {
            toast(toast_config);
            unset_toast();
        }
    }, [toast_config]);

    return (
        <Toaster/>
    );
};

export {
    Toast,
};