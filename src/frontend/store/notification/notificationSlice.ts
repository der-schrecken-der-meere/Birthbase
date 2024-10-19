import { isTauri } from "@/globals/constants/environment";
import { __INI_APP_SETTINGS__, db } from "@/database/database_exports";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isPermissionGranted } from '@tauri-apps/plugin-notification';

interface RTKAsyncState {
    error: any;
    loading: boolean;
}

interface NotificationState {
    value: NotificationPermission;
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
    value: permissionGranted,
};

const initialStateRemember: RememberState = {
    remember: __INI_APP_SETTINGS__.remember,
    error: null,
    loading: false,
}

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
        setPermission: (data, action: PayloadAction<NotificationPermission>) => {
            data.value = action.payload;
        }
    },
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

export const { setPermission } = notificationSlice.actions;
export { setIDBRemember }
export { rememberReducer, notificationReducer };