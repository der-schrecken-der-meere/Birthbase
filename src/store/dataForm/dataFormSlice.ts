import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type I_Birthday } from "../../database/dexie_db";

type Method = "add"|"delete"|"update";

interface DataFormState {
    value: I_Birthday;
    method: Method;
    open: boolean;
}

type Opt_DataForm = {
    method?: Method;
    value?: I_Birthday;
    open?: boolean;
}

const initialState: DataFormState = {
    value: {
        date: new Date().toISOString(),
        id: -1,
        name: {
            first: "",
            last: "",
        }
    },
    method: "add",
    open: false,
}

const dataFormSlice = createSlice({
    name: "dataForm",
    initialState,
    reducers: {
        changeMethod: (data, action: PayloadAction<Method>) => {
            data.method = action.payload;
        },
        changeData: (data, action: PayloadAction<I_Birthday>) => {
            data.value = action.payload;
        },
        toggleOpen: (data) => {
            data.open = !data.open;
        },
        changeDataState: (data, action: PayloadAction<Opt_DataForm>) => {
            data.value = action.payload?.value ? action.payload.value : data.value;
            data.method = action.payload?.method ? action.payload.method : data.method;
            data.open = action.payload?.open ? action.payload.open : data.open;
        },
        changeDataInitial: (data, action: PayloadAction<Opt_DataForm>) => {
            data.value = action?.payload?.value ? action.payload.value : initialState.value;
            data.method = action?.payload?.method ? action.payload.method : initialState.method;
            data.open = action?.payload?.open ? action.payload.open : initialState.open;
        }
    }
})

export const { changeData, changeDataState, changeMethod, toggleOpen, changeDataInitial } = dataFormSlice.actions;

export default dataFormSlice.reducer;