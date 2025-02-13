import { create } from "zustand";

type ConfirmConfig = {
    title: string,
    description: string,
    on_cancel: () => void,
    on_confirm: () => void,
};

interface AppConfirm {
    config: ConfirmConfig,
    open: boolean, 
    set_open: (open: boolean) => void,
    set_config: (config: ConfirmConfig) => void,
};

const use_app_confirm = create<AppConfirm>()((set) => ({
    config: {
        title: "",
        description: "",
        on_cancel: () => {},
        on_confirm: () => {},
    },
    open: false,
    set_config: (config) => set(() => ({ config })),
    set_open: (open) => set(() => ({ open })),
}));

const open_confirm = (config: Partial<ConfirmConfig>) => {
    use_app_confirm.getState().set_open(true);
    const default_config: ConfirmConfig = {
        description: "",
        title: "",
        on_cancel: () => {},
        on_confirm: () => {},
    };
    use_app_confirm.getState().set_config({ ...default_config, ...config });
};

export {
    use_app_confirm,
    open_confirm,
};