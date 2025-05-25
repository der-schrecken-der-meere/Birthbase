import type { VersionNumber } from "@/lib/types/number";
import type { OsType } from "@tauri-apps/plugin-os";
import { create } from "zustand";

type AppStoreState = {
    /** App version */
    appVersion: VersionNumber,
    /** Tauri version */
    tauriVersion: VersionNumber,
    /** Operating system on which the application is running */
    osType: OsType,
    /** Whether the application is loading initial files or scripts */
    isBooting: boolean,
    /** App name */
    appName: string,
};

interface AppStore extends AppStoreState {
    setAppVersion: (appVersion: VersionNumber) => void,
    setTauriVersion: (tauriVersion: VersionNumber) => void,
    setOsType: (osType: OsType) => void,
    /** Finish booting and remove the loader */
    setFinishedBooting: () => void,
    setAppName: (appName: string) => void,
};

const useAppStore = create<AppStore>()((set) => ({
    appVersion: "0.0.0",
    tauriVersion: "0.0.0",
    osType: "" as OsType,
    isBooting: true,
    appName: "",
    setAppVersion: (appVersion) => set(() => ({ appVersion })),
    setTauriVersion: (tauriVersion) => set(() => ({ tauriVersion })),
    setOsType: (osType) => set(() => ({ osType })),
    setFinishedBooting: () => {
        // Remove Loader
        const loader = document.getElementById("loader");
        if (loader) loader.remove();

        set(() => ({ isBooting: false }));
    },
    setAppName: (appName) => set(() => ({ appName })),
}));

export type { AppStoreState };
export {
    useAppStore,
};