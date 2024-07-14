import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const colors = ["blue", "gray", "green", "orange", "purple", "red"] as const;

type CoreColor = typeof colors[number];
type Color = CoreColor|"default";

interface ColorState {
    value: Color;
}

const storageKey: string = "ui-color";
const root = window.document.body;

const getStorage = () => localStorage.getItem(storageKey) as Color|null;
const setStorage = (color: Color) => {
    root.classList.remove(...colors);
    localStorage.setItem(storageKey, color);
    root.classList.add(asCoreColor(color));
}
const asCoreColor = (color: Color): CoreColor => {
    return color === "default" ? "purple" : color;
}

const initialState: ColorState = {
    value: (() => {
        const color = getStorage() || asCoreColor("default")
        setStorage(color);
        return color;
    })(),
}

const colorSlice = createSlice({
    name: "color",
    initialState,
    reducers: {
        setColor: (color, action: PayloadAction<Color>) => {
            setStorage(action.payload);
            color.value = action.payload;
        }
    },
})

export const { setColor } = colorSlice.actions;

export default colorSlice.reducer;