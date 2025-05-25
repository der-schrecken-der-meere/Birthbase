// External features
import type { VersionNumber } from "@/lib/types/number";

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
    /** Indicates wehter the app should restart after update */
    shouldRestart: boolean,
};

interface UpdateStore extends UpdateStoreState {
    /** Starts the update progress */
    setStartProgress: () => void,
    /** Finishes the update progress */
    setFinishProgress: () => void,

    /** Sets `lastCheck` to the current date timestamp */
    setLastCheck: () => void,
    setAvailable: (available: boolean) => void,
    setNotes: (notes: string) => void,
    setProgress: (progress: number) => void,
    setPrompting: (prompt: boolean) => void,
    setSearching: (searching: boolean) => void,
    setVersion: (version: VersionNumber) => void,
    setShouldRestart: (shouldRestart: boolean) => void,
};

export type {
    UpdateStore,
    UpdateStoreState,
}