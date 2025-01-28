import {
    check
} from "@tauri-apps/plugin-updater";
import {
    getTauriVersion,
    getVersion
} from "@tauri-apps/api/app"
import { Platform, platform as _platform } from "@tauri-apps/plugin-os";
import { setAppInfo, setUpdateInfo, UpdateInfo } from "@/store/tauri/tauriSlice";
import { AppDispatch } from "@/store/store";
import { primitive_strict_or } from "@/lib/functions/logic/or";

const initTauri = async (dispatch: AppDispatch) => {
    const platform = _platform();
    const version = await getVersion();
    const tauriVersion = await getTauriVersion();

    // Set Appinfo in the store e.g. platform, version, tauriversion ...
    dispatch(setAppInfo({
        platform,
        version,
        tauriVersion
    }))

    // Updater is only supported on these platforms
    if (primitive_strict_or<Platform>(platform, "windows", "linux", "macos")) await updater(dispatch);
}

const updater = async (dispatch: AppDispatch) => {
    const update = await check();

    // Only update the store if there is a new update
    if (update && update.available) {
        const updateInfo: Partial<UpdateInfo> = {
            updateVersion: update.version,
            updateState: "available",
        }

        dispatch(setUpdateInfo(updateInfo));
    }
}

export { initTauri };