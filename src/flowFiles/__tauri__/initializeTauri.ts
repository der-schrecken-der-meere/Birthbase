// Packages
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { type } from "@tauri-apps/plugin-os";

// External features
import type { VersionNumber } from "@/lib/types/number";
import { useAppStore } from "@/stores/use_app_store";

const appVersion = await getVersion() as VersionNumber;
useAppStore.getState().setAppVersion(appVersion);

const tauriVersion = await getTauriVersion() as VersionNumber;
useAppStore.getState().setTauriVersion(tauriVersion);

const osType = type();
useAppStore.getState().setOsType(osType);