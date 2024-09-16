import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "@tauri-apps/plugin-os";

type UpdateStatus = "latest"|"available"|"notallowed"
type UpdateInfo = {
    updateVersion: string | undefined;
    updateState: UpdateStatus;
}

type AppInfo = {
    version: string | undefined;
    tauriVersion: string | undefined;
    platform: Platform | undefined;
}

interface TauriState {
    updateInfo: UpdateInfo;
    appInfo: AppInfo;
}

const initialState: TauriState = {
    appInfo: {
        platform: undefined,
        tauriVersion: undefined,
        version: undefined,
    },
    updateInfo: {
        updateVersion: undefined,
        updateState: "latest",
    }
};

const tauriSlice = createSlice({
    name: "tauri",
    initialState,
    reducers: {
        setAppInfo: (data, action: PayloadAction<Partial<AppInfo>>) => {
            action.payload?.platform && (data.appInfo.platform = action.payload.platform);
            action.payload?.tauriVersion && (data.appInfo.tauriVersion = action.payload.tauriVersion);
            action.payload?.version && (data.appInfo.version = action.payload.version);
        },
        setUpdateInfo: (data, action: PayloadAction<Partial<UpdateInfo>>) => {
            action.payload?.updateState && (data.updateInfo.updateState = action.payload.updateState);
            action.payload?.updateVersion && (data.updateInfo.updateVersion = action.payload.updateVersion);
        },
    },
});

export const { setAppInfo, setUpdateInfo } = tauriSlice.actions;
export type { UpdateInfo, AppInfo }
export default tauriSlice.reducer;