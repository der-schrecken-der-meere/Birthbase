import { isTauri } from "@/constants/tauri";
import { db, type I_Settings } from "@/database/db";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { isPermissionGranted } from '@tauri-apps/plugin-notification';

console.log(isPermissionGranted);

interface NotificationState {
    permission: NotificationPermission;
}

let permissionGranted: NotificationPermission = Notification.permission;
if (isTauri) {
    permissionGranted = await isPermissionGranted() ? "granted" : "default";
    console.log(permissionGranted);
}

console.log(permissionGranted);

const initialState: NotificationState = {
    permission: permissionGranted,
};

console.log(initialState);

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
            if (action.payload === "prompt") data.permission = "default";
            else data.permission = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setIDBNotificationPermission.fulfilled, (state, action) => {
            state.permission = action.payload;
        })
    }
})

const setIDBNotificationPermission = createAsyncThunk<NotificationPermission, PermissionState>(
    "notification/setIDBPermission",
    async (permission) => {
        const res = await db.STORE_SETTINGS({"notification": {"permission": permission === "prompt" ? "default" : permission}}) as I_Settings;
        return res.notification.permission;
    }
)

export const { setPermission } = notificationSlice.actions
export { setIDBNotificationPermission }
export default notificationSlice.reducer;