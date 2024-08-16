import { configureStore } from "@reduxjs/toolkit"
import modeReducer from "./mode/modeSlice";
import colorReducer from "./color/colorSlice";
import dataReducer from "./data/dataSlice";
import dataFormReducer from "./dataForm/dataFormSlice";
import notificationReducer from "./notification/notificationSlice";
import tauriReducer from "./tauri/tauriSlice";
import mediaTypeReducer from "./mediaType/mediaTypeSlice";
import appReducer from "./app/appSlice";
import updateReducer from "./update/updateSlice";

export const store = configureStore({
    reducer: {
        color: colorReducer,
        mode: modeReducer,
        data: dataReducer,
        dataForm: dataFormReducer,
        notification: notificationReducer,
        tauri: tauriReducer,
        mediaType: mediaTypeReducer,
        app: appReducer,
        update: updateReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
