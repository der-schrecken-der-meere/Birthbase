import { configureStore } from "@reduxjs/toolkit"
import modeReducer from "./mode/modeSlice";
import colorReducer from "./color/colorSlice";
import dataReducer from "./data/dataSlice";
import dataFormReducer from "./dataForm/dataFormSlice";
import notificationReducer from "./notification/notificationSlice";

export const store = configureStore({
    reducer: {
        mode: modeReducer,
        color: colorReducer,
        data: dataReducer,
        dataForm: dataFormReducer,
        notification: notificationReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;