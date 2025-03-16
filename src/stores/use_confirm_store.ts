import { create } from "zustand";

type ConfirmConfig = {
    title: string,
    description: string,
    on_cancel: () => void,
    on_confirm: () => void,
};

interface AppConfirm {
    config: ConfirmConfig,
    isOpen: boolean, 
    setOpen: (open: boolean) => void,
    setConfig: (config: ConfirmConfig) => void,
    setConfirm: (config: Partial<ConfirmConfig>) => void,
};

const useConfirmStore = create<AppConfirm>()((set) => ({
    config: {
        title: "",
        description: "",
        on_cancel: () => {},
        on_confirm: () => {},
    },
    isOpen: false,
    setConfig: (config) => set(() => ({ config })),
    setOpen: (isOpen) => set(() => ({ isOpen })),
    setConfirm: (config) => {
        set((old_data) => ({
            ...old_data,
            isOpen: true,
            config: {
                title: config.title || "",
                description: config.description || "",
                on_cancel: config.on_cancel || (() => {}),
                on_confirm: config.on_confirm || (() => {}),
            },
        }));
    },
}));

export {
    useConfirmStore,
};