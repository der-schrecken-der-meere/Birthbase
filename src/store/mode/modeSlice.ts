import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { __APP_SETTINGS__, storeSettings } from "@/database/birthbase";

type CoreMode = "dark"|"light";
type Mode = CoreMode|"system";

interface ModeState {
    value: Mode;
}

const root = window.document.body;

const setStorage = (mode: Mode) => {
    root.classList.remove("light", "dark");
    root.classList.add(matchMedia(mode));
}
const matchMedia = (mode: Mode): CoreMode => {
    return (mode === "system") ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode; 
}

const initialState: ModeState = {
    value: (() => {
        const mode = __APP_SETTINGS__?.mode || "system";
        setStorage(matchMedia(mode));
        return mode;
    })(),
}

const modeSlice = createSlice({
    name: "mode",
    initialState,
    reducers: {
        setMode: (mode, action: PayloadAction<Mode>) => {
            setStorage(action.payload);
            mode.value = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setIDBMode.fulfilled, (state, action) => {
            setStorage(action.payload);
            state.value = action.payload;
        })
    }
})

const setIDBMode = createAsyncThunk<Mode, Mode>(
    "mode/setIDBMode",
    async (mode) => {
        const res = await storeSettings({"mode": mode});
        return res.mode;
    }
)

export const { setMode } = modeSlice.actions;
export type { Mode, CoreMode }
export { setIDBMode }
export default modeSlice.reducer;