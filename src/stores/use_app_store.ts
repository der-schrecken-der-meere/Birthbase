import type { VersionNumber } from "@/lib/types/number";
import { OsType } from "@tauri-apps/plugin-os";
import { create } from "zustand";

interface AppStore {
    appVersion: VersionNumber,
    tauriVersion: VersionNumber,
    osType: OsType,
    isBooting: boolean,
    setAppVersion: (appVersion: VersionNumber) => void,
    setTauriVersion: (tauriVersion: VersionNumber) => void,
    setOsType: (osType: OsType) => void,
    setFinishedBooting: () => void,
};

const useAppStore = create<AppStore>()((set) => ({
    appVersion: "0.0.0",
    tauriVersion: "0.0.0",
    osType: "linux" as OsType,
    isBooting: true,
    setAppVersion: (appVersion) => set(() => ({ appVersion })),
    setTauriVersion: (tauriVersion) => set(() => ({ tauriVersion })),
    setOsType: (osType) => set(() => ({ osType })),
    setFinishedBooting: () => {
        const loader = document.getElementById("loader");
        if (loader) loader.remove();
        set(() => ({ isBooting: false }));
    },
}));

export {
    useAppStore,
};