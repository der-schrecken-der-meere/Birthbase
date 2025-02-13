import type { VersionNumber } from "@/lib/types/number";
import { OsType } from "@tauri-apps/plugin-os";
import { create } from "zustand";

interface AppStore {
    version: VersionNumber,
    tauri_version: VersionNumber,
    display_version: string,
    os_type: OsType,
    is_booting: boolean,
    update_version: (version: VersionNumber) => void,
    update_tauri_version: (display_version: VersionNumber) => void,
    update_display_version: (display_version: string) => void,
    update_os_type: (os_type: OsType) => void,
    unset_is_booting: () => void,
};

const use_app_store = create<AppStore>()((set) => ({
    version: "0.0.0",
    tauri_version: "0.0.0",
    display_version: "",
    os_type: "linux" as OsType,
    is_booting: true,
    update_version: (version) => set(() => ({ version })),
    update_tauri_version: (tauri_version) => set(() => ({ tauri_version })),
    update_display_version: (display_version) => set(() => ({ display_version })),
    update_os_type: (os_type) => set(() => ({ os_type })),
    unset_is_booting: () => set(() => ({ is_booting: false })),
}));

const update_version = (version: VersionNumber) => {
    use_app_store.getState().update_version(version);
};

const update_tauri_version = (version: VersionNumber) => {
    use_app_store.getState().update_tauri_version(version);
};

const update_os_type = (os_type: OsType) => {
    use_app_store.getState().update_os_type(os_type);
};

const unset_is_booting = () => {
    use_app_store.getState().unset_is_booting();
    const loader = document.getElementById("loader");
    if (loader) loader.remove();
};

export {
    use_app_store,
    update_version,
    update_tauri_version,
    update_os_type,
    unset_is_booting,
};