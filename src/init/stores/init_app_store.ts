import { AppStoreState, useAppStore } from "@/stores/use_app_store";

const init_app_store = ({
    appVersion,
    tauriVersion,
    osType,
}: Partial<AppStoreState>) => {
    const setAppVersion = useAppStore.getState().setAppVersion;
    const setTauriVersion = useAppStore.getState().setTauriVersion;
    const setOsType = useAppStore.getState().setOsType;

    if (appVersion) {
        // Set the app version
        setAppVersion(appVersion);
    }

    if (tauriVersion) {
        // Set the tauri version
        setTauriVersion(tauriVersion);
    }

    if (osType) {
        // Set the OS type
        setOsType(osType);
    }
};

export { init_app_store };