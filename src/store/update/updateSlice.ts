import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UpdateState {
    downloadSize: number;
    downloaded: number;
    progress: number;
    downloading: boolean;
}

const initialState: UpdateState = {
    downloadSize: 0,
    downloaded: 0,
    progress: 100.0,
    downloading: false,
}

const updateSlice = createSlice({
    name: "update",
    initialState,
    reducers: {
        startDownload: (data, action: PayloadAction<number>) => {
            data.downloading = true;
            data.downloadSize = action.payload;
            data.downloaded = 0;
            console.log(`Starte Update: ${data.downloadSize}`);
        },
        updateProgress: (data, action: PayloadAction<number>) => {
            data.downloaded += action.payload;
            if (data.downloaded < data.downloadSize) {
                data.progress = data.downloaded / data.downloadSize * 100;
            } else {
                data.progress = 100.0;
            }
            console.log(`Updatefortschritt: ${data.downloaded} / ${data.downloadSize}`)
        },
        finishDownload: (data) => {
            data.downloading = false;
            console.log(`Update beendet`);
        },
    }
})

export const { startDownload, updateProgress, finishDownload } = updateSlice.actions;
export default updateSlice.reducer;