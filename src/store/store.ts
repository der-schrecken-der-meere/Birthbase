import { configureStore } from "@reduxjs/toolkit"
import appReducer           from "./app/appSlice";
import mediaTypeReducer     from "./mediaType/mediaTypeSlice";
import tauriReducer         from "./tauri/tauriSlice";
import updateReducer        from "./update/updateSlice";

export const store = configureStore({
    reducer: {
        app: appReducer,
        mediaType: mediaTypeReducer,
        tauri: tauriReducer,
        update: updateReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
