import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

interface NotificationState {
    value: NotificationPermission;
}

const storageKey: string = "app-permission";

const getStorage = () => localStorage.getItem(storageKey) as NotificationPermission|null;
const setStorage = (permission: NotificationPermission) => {
    localStorage.setItem(storageKey, permission);
}

const notificationExists = () => ("Notification" in window);

const initialState: NotificationState = {
    value: Notification.permission,
}

// const requestPermission = createAsyncThunk(
//     "notification/requestPermission",
//     async (data, thunkAPI) => {
//         if (notificationExists()) {
//             if (data.value === "default") {
//                 const a = await Notification.requestPermission()
//             }
//         }
//     }
// )

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setPermission: (data, action: PayloadAction<PermissionState>) => {
            console.log(action.payload);
            if (action.payload === "prompt") data.value = "default";
            else data.value = action.payload;
        }
    },
})

export const { setPermission } = notificationSlice.actions

export default notificationSlice.reducer;