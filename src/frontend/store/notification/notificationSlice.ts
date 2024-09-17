import { isTauri } from "@/globals/constants/environment";
import { storeSettings } from "@/database/birthbase";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { isPermissionGranted } from '@tauri-apps/plugin-notification';

interface NotificationState {
    permission: NotificationPermission;
}

let permissionGranted: NotificationPermission = Notification.permission;
if (isTauri) {
    permissionGranted = await isPermissionGranted() ? "granted" : "denied";
    console.log(permissionGranted);
}

const initialState: NotificationState = {
    permission: permissionGranted,
};

const setIDBNotificationPermission = createAsyncThunk<NotificationPermission, PermissionState>(
    "notification/setIDBPermission",
    async (permission) => {
        const res = await storeSettings({"permissions": {"notification": permission === "prompt" ? "default" : permission}});
        return res.permissions.notification ? res.permissions.notification : "default";
    }
)

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setPermission: (data, action: PayloadAction<PermissionState>) => {
            console.log(action.payload);
            data.permission = action.payload === "prompt" ? "default" : action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setIDBNotificationPermission.fulfilled, (state, action) => {
            state.permission = action.payload;
        })
    }
})

export const { setPermission } = notificationSlice.actions
export { setIDBNotificationPermission }
export default notificationSlice.reducer;