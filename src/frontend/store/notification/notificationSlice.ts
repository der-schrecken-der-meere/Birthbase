import { isTauri } from "@/globals/constants/environment";
import { __INI_APP_SETTINGS__, db } from "@/database/database_exports";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { isPermissionGranted } from '@tauri-apps/plugin-notification';

interface RTKAsyncState {
    error: any;
    loading: boolean;
}

interface NotificationState extends RTKAsyncState {
    permission: NotificationPermission;
}

interface RememberState extends RTKAsyncState {
    remember: number;
}

let permissionGranted: NotificationPermission = Notification.permission;
if (isTauri) {
    permissionGranted = await isPermissionGranted() ? "granted" : "denied";
    console.log(permissionGranted);
}

const initialState: NotificationState = {
    permission: permissionGranted,
    error: null,
    loading: false,
};

const initialStateRemember: RememberState = {
    remember: __INI_APP_SETTINGS__.remember,
    error: null,
    loading: false,
}

const setIDBNotificationPermission = createAsyncThunk<
    NotificationPermission,
    PermissionState, 
    {
        rejectValue: any
    }
>(
    "notification/setIDBPermission",
    async (permission, { rejectWithValue }) => {
        try {
            const res = await db.storeSettings({"permissions": {"notification": permission === "prompt" ? "default" : permission}});
            return res.permissions.notification;
        } catch (e) {
            throw rejectWithValue(e);
        }
    }
)

const setIDBRemember = createAsyncThunk<
    number,
    number,
    {
        rejectValue: any
    }
>(
    "notification/setIDBRemeber",
    async (remember, { rejectWithValue }) => {
        try {
            const res = await db.storeSettings({remember});
            return res.remember;
        } catch (e) {
            throw rejectWithValue(e);
        }
    }
)

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(setIDBNotificationPermission.fulfilled, (state, action) => {
            state.permission = action.payload;
            state.loading = false;
        })
        .addCase(setIDBNotificationPermission.pending, (state) => {
            state.error = null
            state.loading = true;
        })
        .addCase(setIDBNotificationPermission.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
    }
})

const rememberSlice = createSlice({
    name: "remember",
    initialState: initialStateRemember,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(setIDBRemember.fulfilled, (state, action) => {
            state.remember = action.payload;
            state.loading = false;
        })
        .addCase(setIDBRemember.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        .addCase(setIDBRemember.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
    },
})

const rememberReducer = rememberSlice.reducer;
const notificationReducer = notificationSlice.reducer;

export { setIDBNotificationPermission, setIDBRemember }
export { rememberReducer, notificationReducer };