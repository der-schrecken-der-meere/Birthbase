import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import {
    check
} from "@tauri-apps/plugin-updater";
import {
    getTauriVersion,
    getVersion
} from "@tauri-apps/api/app"
import { setUpdateState, setManifest, setMetaData } from "../store/tauri/tauriSlice";

export default async (dispatch: Dispatch<UnknownAction>) => {
    const update = await check();
    const version = await getVersion();
    const tauriVersion = await getTauriVersion();

    dispatch(setUpdateState( update?.available ? "available" : "latest" ));
    if (update) dispatch(setManifest({
        currentVersion: update.currentVersion,
        updateVersion: update.version,
    }));
    dispatch(setMetaData({version, tauriVersion}));
}
