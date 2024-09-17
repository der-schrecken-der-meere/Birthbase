import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type I_Birthday } from "@/database/birthbase";

interface DataState {
    value: I_Birthday[],
}

const initialState: DataState = {
    value: [],
}

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        createData: (data, action: PayloadAction<I_Birthday[]|I_Birthday>) => {
            const flat = [action.payload].flat();
            data.value = flat;
        },
        deleteData: (data, action: PayloadAction<number|number[]>) => {
            const flat = [action.payload].flat();
            data.value = data.value.filter(e => !flat.includes(e.id as number));
        },
        addData: (data, action: PayloadAction<I_Birthday|I_Birthday[]>) => {
            const flat = [action.payload].flat();
            data.value = [...data.value, ...flat];
        },
        updateData: (data, action: PayloadAction<I_Birthday|I_Birthday[]>) => {
            const flat = [action.payload].flat();
            data.value = data.value.map((d) => {
                const f = flat.find(f => f.id === d.id);
                return f ? f : d;
            })
        }
    }
})

export const { createData, deleteData, addData, updateData } = dataSlice.actions;

export default dataSlice.reducer;