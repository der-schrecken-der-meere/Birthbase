import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Birthday } from "@/database/tables/birthday";
import { getDefaultBirthday } from "@/database/tables/birthday";

export type FormMethod = "add"|"update";

interface DataFormState {
    value: Birthday;
    method: FormMethod;
    open: boolean;
}

const initialState: DataFormState = {
    value: getDefaultBirthday(),
    method: "add",
    open: false,
}

const dataFormSlice = createSlice({
    name: "dataForm",
    initialState,
    reducers: {
        openAdd: (data) => {
            data.method = "add";
            data.open = true;
            data.value = getDefaultBirthday();
        },
        close: (data) => {
            data.open = false;
        },
        openUpdate: (data, action: PayloadAction<Birthday>) => {
            data.open = true;
            data.method = "update";
            data.value = action.payload;
        },
        toggleOpen: (data) => {
            data.open = !data.open;
        },
    }
})

export const {  toggleOpen, openAdd, close, openUpdate } = dataFormSlice.actions;

export default dataFormSlice.reducer;