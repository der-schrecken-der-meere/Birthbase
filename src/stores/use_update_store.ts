import type { VersionNumber } from "@/lib/types/number";
import { create } from "zustand";

type UpdateStoreState = {
    /** A timestamp when the last search was finished */
    lastCheck: number,
    /** Update notes of the updates */
    notes: string,
    /** Version of the update */
    version: VersionNumber,
    /** Percentage of the update progress */
    progress: number,
    /** Indidcates whether an update is available */
    isAvailable: boolean,
    /** Indicates wether the update prompt is shown */
    isPrompting: boolean,
    /** Indicates wether the app is currently looking for an update */
    isSearching: boolean,
    /** Indicates wether the app is currently downloading and installing the update */
    isDownloading: boolean,
};

interface UpdateStore extends UpdateStoreState {
    /** Starts the update progress */
    setStartProgress: () => void,
    /** Finishes the update progress */
    setFinishProgress: () => void,

    setAvailable: (available: boolean) => void,
    /** Sets `lastCheck` to the current date timestamp */
    setLastCheck: () => void,
    setNotes: (notes: string) => void,
    setProgress: (progress: number) => void,
    setPrompting: (prompt: boolean) => void,
    setSearching: (searching: boolean) => void,
    setVersion: (version: VersionNumber) => void,
};

const useUpdateStore = create<UpdateStore>()((set) => ({
    lastCheck: +new Date(),
    progress: 0,
    notes: "",
    version: "0.0.0",
    isAvailable: false,
    isDownloading: false,
    isPrompting: false,
    isSearching: false,

    setStartProgress: () => set(() => ({ progress: 0, isDownloading: true })),
    setFinishProgress: () => set(() => ({ progress: 100, isDownloading: false, isAvailable: false })),

    setAvailable: (isAvailable) => set(() => ({ isAvailable })),
    setLastCheck: () => set(() => ({ lastCheck: Date.now() })),
    setNotes: (notes) => set(() => ({ notes })),
    setProgress: (progress) => set(() => ({ progress })),
    setPrompting: (isPrompting) => set(() => ({ isPrompting })),
    setSearching: (isSearching) => set(() => ({ isSearching })),
    setVersion: (version) => set(() => ({ version })),
}));

export type { UpdateStoreState };
export {
    useUpdateStore,
};