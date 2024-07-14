import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type CoreMode = "dark"|"light";
type Mode = CoreMode|"system";

interface ModeState {
    value: Mode
}

const storageKey: string = "ui-mode";
const root = window.document.body;

const getStorage = () => localStorage.getItem(storageKey) as Mode|null;
const setStorage = (mode: Mode) => {
    root.classList.remove("light", "dark");
    localStorage.setItem(storageKey, mode);
    root.classList.add(matchMedia(mode));
}
const matchMedia = (mode: Mode): CoreMode => {
    return (mode === "system") ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode; 
}

const initialState: ModeState = {
    value: (() => {
        const mode = matchMedia(getStorage() || "dark");
        setStorage(mode);
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
})

export const { setMode } = modeSlice.actions;

export default modeSlice.reducer;