import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type T_Birthday } from "../../database/db";

interface DataState {
    value: T_Birthday[],
}

const initialState: DataState = {
    value: [],
}

const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {
        setData: (data, action: PayloadAction<T_Birthday[]|T_Birthday>) => {
            const flat = [action.payload].flat();
            data.value = flat;
        },
        deleteData: (data, action: PayloadAction<number|number[]>) => {
            const flat = [action.payload].flat();
            data.value = data.value.filter(e => !flat.includes(e.id));
        },
        addData: (data, action: PayloadAction<T_Birthday|T_Birthday[]>) => {
            const flat = [action.payload].flat();
            data.value = [...data.value, ...flat];
        },
        updateData: (data, action: PayloadAction<T_Birthday|T_Birthday[]>) => {
            const flat = [action.payload].flat();
            data.value = data.value.map((d) => {
                const f = flat.find(f => f.id === d.id);
                if (f) return f;
                return d;
            })
        }
    }
})

export const { setData, deleteData, addData, updateData } = dataSlice.actions;

export default dataSlice.reducer;