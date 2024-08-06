import type { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import {
    checkUpdate
} from "@tauri-apps/api/updater";
import {
    getTauriVersion,
    getVersion
} from "@tauri-apps/api/app"
import { setUpdateState, setManifest, setMetaData } from "../store/tauri/tauriSlice";

export default async (dispatch: Dispatch<UnknownAction>) => {
    const { shouldUpdate, manifest } = await checkUpdate()
    const version = await getVersion();
    const tauriVersion = await getTauriVersion();

    dispatch(setUpdateState( shouldUpdate ? "updateavailable" : "uptodate" ));
    dispatch(setManifest(manifest));  
    dispatch(setMetaData({version, tauriVersion}));
} 