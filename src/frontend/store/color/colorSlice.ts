import { __INI_APP_SETTINGS__, db } from "@/database/database_exports";
import { Color } from "@/database/tables/setting";
import { colors } from "@/globals/constants/colors";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ColorState {
    value: Color;
    error: any;
    loading: boolean;
}

const setClasslist = (color: Color) => {
    window.document.body.classList.remove(...colors);
    window.document.body.classList.add(color);
}

const initialState: ColorState = {
    value: (() => {
        const color = __INI_APP_SETTINGS__.color
        setClasslist(color);
        return color;
    })(),
    error: null,
    loading: false,
}

const setIDBColor = createAsyncThunk<Color, Color, { rejectValue: any }>(
    "color/setIDBColor",
    async (color, { rejectWithValue }): Promise<Color> => {
        try {
            const res = await db.storeSettings({color});
            return res.color;
        } catch (e) {
            throw rejectWithValue(e);
        }
    }
)

const colorSlice = createSlice({
    name: "color",
    initialState,
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(setIDBColor.fulfilled, (state, action) => {
            setClasslist(action.payload);
            state.value = action.payload;
            state.error = null;
            state.loading = false;
        })
        .addCase(setIDBColor.pending, (state) => {
            state.loading = true;
        })
        .addCase(setIDBColor.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
    }
})

export { setIDBColor }
export default colorSlice.reducer;