import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { __INI_APP_SETTINGS__, db } from "@/database/database_exports";
import { Mode } from "@/database/tables/setting";

interface ModeState {
    value: Mode;
    error: any;
    loading: boolean;
}

const changeMode = (mode: Mode) => {
    window.document.body.classList.remove("light", "dark");
    window.document.body.classList.add(matchMedia(mode));
}
const matchMedia = (mode: Mode): Mode => {
    return (mode === "system") ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode; 
}

const initialState: ModeState = {
    value: (() => {
        const mode = __INI_APP_SETTINGS__.mode;
        changeMode(matchMedia(mode));
        return mode;
    })(),
    error: null,
    loading: false,
}

const setIDBMode = createAsyncThunk<Mode, Mode, { rejectValue: any }>(
    "mode/setIDBMode",
    async (mode, { rejectWithValue }) => {
        try {
            const res = await db.storeSettings({"mode": mode});
            return res.mode;
        } catch (e) {
            throw rejectWithValue(e);
        }
    }
)

const modeSlice = createSlice({
    name: "mode",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(setIDBMode.fulfilled, (state, action) => {
            changeMode(action.payload);
            state.value = action.payload;
            state.error = null;
            state.loading = false;
        })
        .addCase(setIDBMode.pending, (state) => {
            state.loading = true;
        })
        .addCase(setIDBMode.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
    }
})

export { setIDBMode }
export default modeSlice.reducer;