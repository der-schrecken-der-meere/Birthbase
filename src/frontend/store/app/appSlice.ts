import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    isBooting: boolean;
}

const initialState: AppState = {
    isBooting: true,
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setBooting: (data, action: PayloadAction<boolean>) => {
            if (!action.payload) {
                const loader = document.getElementById("loader");
                if (loader) loader.remove();
            }
            data.isBooting = action.payload;
        }
    }
})

export const { setBooting } = appSlice.actions;
export default appSlice.reducer;