import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UpdateManifest } from "@tauri-apps/api/updater";

type UpdateStatus = "uptodate"|"updateavailable"|"notallowed"
type Manifest = undefined | UpdateManifest;

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
    manifest: Manifest;
    metaData: MetaData;
}

const initialState: TauriState = {
    updateState: "notallowed",
    manifest: undefined,
    metaData: {
        version: "",
        tauriVersion: "",
    }
}

const updateSlice = createSlice({
    name: "update",
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
        }
    }
})

export const { setUpdateState, setManifest, setMetaData } = updateSlice.actions;

export default updateSlice.reducer;