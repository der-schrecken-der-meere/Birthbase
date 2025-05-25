// Packages
import { create } from "zustand";

// Internal features
import type { UpdateStore } from "../types/store";

const useUpdateStore = create<UpdateStore>()((set) => ({
    lastCheck: Date.now(),
    progress: 0,
    notes: "",
    version: "0.0.0",
    isAvailable: false,
    isDownloading: false,
    isPrompting: false,
    isSearching: false,
    shouldRestart: true,

    setStartProgress: () => set(() => ({ progress: 0, isDownloading: true })),
    setFinishProgress: () => set(() => ({ progress: 100, isDownloading: false, isAvailable: false })),

    setAvailable: (isAvailable) => set(() => ({ isAvailable })),
    setLastCheck: () => set(() => ({ lastCheck: Date.now() })),
    setNotes: (notes) => set(() => ({ notes })),
    setProgress: (progress) => set(() => ({ progress })),
    setPrompting: (isPrompting) => set(() => ({ isPrompting })),
    setSearching: (isSearching) => set(() => ({ isSearching })),
    setShouldRestart: (shouldRestart) => set(() => ({ shouldRestart })),
    setVersion: (version) => set(() => ({ version })),
}));

export { useUpdateStore };