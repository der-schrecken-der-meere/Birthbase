import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UpdateState {
    downloadSize: number;
    downloaded: number;
    progress: number;
    completed: boolean;
}

const initialState: UpdateState = {
    downloadSize: 0,
    downloaded: 0,
    progress: 100.0,
    completed: true,
}

const updateSlice = createSlice({
    name: "update",
    initialState,
    reducers: {
        startDownload: (data, action: PayloadAction<number>) => {
            data.completed = false;
            data.downloadSize = action.payload;
        },
        updateProgress: (data, action: PayloadAction<number>) => {
            data.downloaded += action.payload;
            if (data.downloaded < data.downloadSize) {
                data.progress = data.downloadSize / data.downloaded;
            } else {
                data.progress = 100.0;
            }
        },
        finishDownload: (data) => {
            data.completed = true;
        },
    }
})

export const { startDownload, updateProgress, finishDownload } = updateSlice.actions;
export default updateSlice.reducer;