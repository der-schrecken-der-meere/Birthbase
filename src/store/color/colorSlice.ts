import { __APP_SETTINGS__, storeSettings } from "@/database/birthbase";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

const colors = ["blue", "gray", "green", "orange", "purple", "red"] as const;

type CoreColor = typeof colors[number];
type Color = CoreColor|"default";

interface ColorState {
    value: Color;
}

const root = window.document.body;

const setClasslist = (color: Color) => {
    root.classList.remove(...colors);
    root.classList.add(asCoreColor(color));
}
const asCoreColor = (color: Color): CoreColor => {
    return color === "default" ? "purple" : color;
}

const initialState: ColorState = {
    value: (() => {
        const color = __APP_SETTINGS__?.color || asCoreColor("default")
        setClasslist(color);
        return color;
    })(),
}

const setIDBColor = createAsyncThunk<Color, Color>(
    "color/setIDBColor",
    async (color) => {
        const res = await storeSettings({color});
        return res.color;
    }
)

const colorSlice = createSlice({
    name: "color",
    initialState,
    reducers: {
        setColor: (color, action: PayloadAction<Color>) => {
            setClasslist(action.payload);
            color.value = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setIDBColor.fulfilled, (state, action) => {
            setClasslist(action.payload);
            state.value = action.payload;
        })
    }
})

export const { setColor } = colorSlice.actions;
export type { Color, CoreColor }
export { setIDBColor }
export default colorSlice.reducer;