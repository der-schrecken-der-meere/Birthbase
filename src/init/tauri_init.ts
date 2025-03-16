import { useAppStore } from "@/stores/use_app_store";
import { VersionNumber } from "@/lib/types/number";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { type } from "@tauri-apps/plugin-os";

const init_tauri = async () => {
    const setAppVersion = useAppStore.getState().setAppVersion;
    const setTauriVersion = useAppStore.getState().setTauriVersion;
    const setOsType = useAppStore.getState().setOsType;

    const app_version = await getVersion();
    setAppVersion(app_version as VersionNumber);

    const tauri_version = await getTauriVersion();
    setTauriVersion(tauri_version as VersionNumber);

    const os_type = type();
    setOsType(os_type);
};

export { init_tauri };