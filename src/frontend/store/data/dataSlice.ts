import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Birthday } from "@/database/tables/birthday";
import { asArray, concatArrayFast } from "@/lib/main_util";

interface DataState {
    value: Birthday[],
}

const initialState: DataState = {
    value: [],
}

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        createData: (data, action: PayloadAction<Birthday[]|Birthday>) => {
            const flat = asArray<Birthday>(action.payload);
            data.value = flat;
        },
        deleteData: (data, action: PayloadAction<number|number[]>) => {
            const flat = asArray<number>(action.payload);
            data.value = data.value.filter(e => !flat.includes(e.id));
        },
        addData: (data, action: PayloadAction<Birthday|Birthday[]>) => {
            const flat = asArray<Birthday>(action.payload);
            data.value = concatArrayFast(data.value, flat);
        },
        updateData: (data, action: PayloadAction<Birthday|Birthday[]>) => {
            const flat = asArray<Birthday>(action.payload);
            data.value = data.value.map((d) => {
                const f = flat.find(f => f.id === d.id);
                return f ? f : d;
            })
        }
    }
})

export const { createData, deleteData, addData, updateData } = dataSlice.actions;

export default dataSlice.reducer;