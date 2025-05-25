// Packages
import { create } from "zustand";

// Internal features
import { CMDKStore } from "../types/store";

const useCMDKStore = create<CMDKStore>()((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) => {
        set({ isOpen });
    },
}));

export { useCMDKStore };