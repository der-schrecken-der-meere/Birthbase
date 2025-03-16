import { useEffect } from "react";

import { Toaster } from "../ui/toaster";

import { useToastStore } from "@/stores/use_toast_store";

import { useToast } from "../ui/use-toast";

const Toast = () => {

    const { toast } = useToast();

    const toastConfig = useToastStore((state) => state.toastConfig);
    const isCreated = useToastStore((state) => state.isCreated);
    const setNotCreated = useToastStore((state) => state.setNotCreated);

    useEffect(() => {
        if (isCreated) {
            setNotCreated();
            toast(toastConfig);
        }
    }, [toastConfig]);

    return (
        <Toaster/>
    );
};

export {
    Toast,
};