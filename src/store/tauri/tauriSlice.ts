import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "@tauri-apps/plugin-os";

type UpdateStatus = "latest"|"available"|"notallowed"
type Manifest = {
    currentVersion: string,
    updateVersion: string,
};

type MetaData = {
    version: string;
    tauriVersion: string;
}

type OptMetaData = {
    version?: string;
    tauriVersion?: string;
}

interface TauriState {
    updateState: UpdateStatus;
    manifest: Manifest | undefined;
    metaData: MetaData;
    platform: Platform | undefined;
}

const initialState: TauriState = {
    updateState: "notallowed",
    platform: undefined,
    manifest: undefined,
    metaData: {
        version: "",
        tauriVersion: "",
    }
}

const tauriSlice = createSlice({
    name: "taurio",
    initialState,
    reducers: {
        setUpdateState: (data, action: PayloadAction<UpdateStatus>) => {
            data.updateState = action.payload;
        },
        setManifest: (data, action: PayloadAction<Manifest>) => {
            data.manifest = action.payload;
        },
        setMetaData: (data, action: PayloadAction<OptMetaData>) => {
            action.payload?.tauriVersion && (data.metaData.tauriVersion = action.payload.tauriVersion);
            action.payload?.version && (data.metaData.version = action.payload.version);
        },
        setPlatform: (data, action: PayloadAction<Platform>) => {
            data.platform = action.payload;
        }
    }
})

export const { setUpdateState, setManifest, setMetaData } = tauriSlice.actions;

export default tauriSlice.reducer;