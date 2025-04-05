import { getDefaultBirthday, type Birthday } from "@/database/tables/birthday/birthdays";
import { create } from "zustand";

enum BirthdayFormMode {
    /** Allows updating existing data of a birthday */
    UPDATE,
    /** Allows creating a new birthday */
    CREATE,
    /** Allows only to see data of a birthday */
    READ,
};

interface BirthdayForm {
    /** Determines which mode is currently used */
    formMode: BirthdayFormMode,
    /** The form data */
    birthday: Birthday,
    /** Whether the dialog of the form is open */
    isOpen: boolean,
    setFormMode: (formMode: BirthdayFormMode) => void,
    setBirthday: (birthday: Birthday) => void,
    setOpen: (isOpen: boolean) => void,
    /** Sets the form to create mode */
    setCreateMode: () => void,
    /** Sets the form to read mode */
    setReadMode: (birthday: Birthday) => void,
    /** Sets the form to update mode */
    setUpdateMode: (birthday: Birthday) => void,
};

const useBirthdayFormStore = create<BirthdayForm>()((set) => ({
    formMode: BirthdayFormMode.READ,
    birthday: getDefaultBirthday(),
    isOpen: false,
    setFormMode: (formMode) => set(() => ({ formMode })),
    setBirthday: (birthday) => set(() => ({ birthday })),
    setOpen: (isOpen) => set(() => ({ isOpen })),
    setCreateMode: () => set(() => ({ birthday: getDefaultBirthday(), formMode: BirthdayFormMode.CREATE, isOpen: true })),
    setReadMode: (birthday) => set(() => ({ birthday, formMode: BirthdayFormMode.READ, isOpen: true })),
    setUpdateMode: (birthday) => set(() => ({ birthday, formMode: BirthdayFormMode.UPDATE, isOpen: true })),
}));

export {
    BirthdayFormMode,
    useBirthdayFormStore,
};