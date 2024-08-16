import {
    check
} from "@tauri-apps/plugin-updater";
import {
    getTauriVersion,
    getVersion
} from "@tauri-apps/api/app"
import { Platform, platform } from "@tauri-apps/plugin-os";
import { setUpdateState, setManifest, setMetaData } from "../store/tauri/tauriSlice";
import { AppDispatch } from "@/store/store";
import { strict_OR } from "@/util";

const initTauri = async (dispatch: AppDispatch) => {
    const currentPlatform: Platform = platform();
    const version = await getVersion();
    const tauriVersion = await getTauriVersion();

    if (strict_OR<Platform>(currentPlatform, "windows", "macos", "linux")) await updater(dispatch);
    dispatch(setMetaData({version, tauriVersion}));
}

const updater = async (dispatch: AppDispatch) => {
    const update = await check();
    dispatch(setUpdateState( update?.available ? "available" : "latest" ));
    if (update) dispatch(setManifest({
        currentVersion: update.currentVersion,
        updateVersion: update.version,
    }));
}

export { initTauri as default };