import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type I_Birthday } from "@/database/birthbase";

type Method = "add"|"delete"|"update";

interface DataFormState {
    value: I_Birthday;
    method: Method;
    open: boolean;
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
        /**
         * Changes the FormOpenState, FormData or FormMethod
         */
        changeFormState: (data, action: PayloadAction<Partial<DataFormState>>) => {
            if (action.payload.value) data.value = action.payload.value;
            if (action.payload.method) data.method = action.payload.method;
            if (action.payload.open) data.open = action.payload.open;
        },
        /**
         * Changes the FormState if provided. Else the FormState will be turned into to its initial value.
         * 
         *      Initialdata: {
         *          method: "add"
         *          open: false
         *          value: {
         *              id: -1
         *              date: CurrentDate as ISOString
         *              name: {
         *                  first: ""
         *                  last: ""
         *              }
         *          }
         *      }
         */
        changeDataInitial: (data, action: PayloadAction<Partial<DataFormState>>) => {
            data.value = action?.payload?.value ? action.payload.value : initialState.value;
            data.method = action?.payload?.method ? action.payload.method : initialState.method;
            data.open = action?.payload?.open ? action.payload.open : initialState.open;
        }
    }
})

export const { changeData, changeFormState, changeMethod, toggleOpen, changeDataInitial } = dataFormSlice.actions;

export default dataFormSlice.reducer;