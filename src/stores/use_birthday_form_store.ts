import { getDefaultBirthday, type Birthday } from "@/database/tables/birthday/birthdays";
import { create } from "zustand";

enum BirthdayFormMode {
    UPDATE,
    CREATE,
    READ,
};

interface BirthdayForm {
    formMode: BirthdayFormMode,
    birthday: Birthday,
    isOpen: boolean,
    setFormMode: (formMode: BirthdayFormMode) => void,
    setBirthday: (birthday: Birthday) => void,
    setOpen: (isOpen: boolean) => void,
    setCreateMode: () => void,
    setReadMode: (birthday: Birthday) => void,
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