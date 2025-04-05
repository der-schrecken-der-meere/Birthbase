import { create } from "zustand";

type ConfirmConfig = {
    /** Title of the confirm dialog */
    title: string,
    /** Description of the confirm dialog */
    description: string,
    /** Function that will be called after the user cancels the confirm dialog */
    on_cancel: () => void,
    /** Function that will be called after the user confirmed the confirm dialog */
    on_confirm: () => void,
};

interface AppConfirm {
    /** An object containing data for the confirm dialog */
    config: ConfirmConfig,
    /** Whether the confirm dialog is open */
    isOpen: boolean, 
    setOpen: (open: boolean) => void,
    setConfig: (config: ConfirmConfig) => void,
    /** Opens the confirm dialog and applies the current config object */
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