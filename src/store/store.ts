import { configureStore } from "@reduxjs/toolkit"
import appReducer from "./app/appSlice";
import colorReducer from "./color/colorSlice";
import dataFormReducer from "./dataForm/dataFormSlice";
import dataReducer from "./data/dataSlice";
import mediaTypeReducer from "./mediaType/mediaTypeSlice";
import modeReducer from "./mode/modeSlice";
import notificationReducer from "./notification/notificationSlice";
import tauriReducer from "./tauri/tauriSlice";
import updateReducer from "./update/updateSlice";

export const store = configureStore({
    reducer: {
        app: appReducer,
        color: colorReducer,
        data: dataReducer,
        dataForm: dataFormReducer,
        mediaType: mediaTypeReducer,
        mode: modeReducer,
        notification: notificationReducer,
        tauri: tauriReducer,
        update: updateReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
