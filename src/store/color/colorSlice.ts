import { __APP_SETTINGS__, db, type I_Settings } from "@/database/db";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

const colors = ["blue", "gray", "green", "orange", "purple", "red"] as const;

type CoreColor = typeof colors[number];
type Color = CoreColor|"default";

interface ColorState {
    value: Color;
}

const root = window.document.body;

const setStorage = (color: Color) => {
    root.classList.remove(...colors);
    root.classList.add(asCoreColor(color));
}
const asCoreColor = (color: Color): CoreColor => {
    return color === "default" ? "purple" : color;
}

const initialState: ColorState = {
    value: (() => {
        const color = __APP_SETTINGS__?.color || asCoreColor("default")
        setStorage(color);
        return color;
    })(),
}

const setIDBColor = createAsyncThunk(
    "color/setIDBColor",
    async (color: Color) => {
        const res = await db.STORE_SETTINGS({"color": color}) as I_Settings;
        return res.color;
    }
)

const colorSlice = createSlice({
    name: "color",
    initialState,
    reducers: {
        setColor: (color, action: PayloadAction<Color>) => {
            setStorage(action.payload);
            color.value = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setIDBColor.fulfilled, (state, action) => {
            setStorage(action.payload);
            state.value = action.payload;
        })
    }
})

export const { setColor } = colorSlice.actions;
export type { Color, CoreColor }
export { setIDBColor }
export default colorSlice.reducer;