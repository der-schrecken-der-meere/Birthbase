// Packages
import { create } from "zustand";

// External features
import { create_default_birthday } from "@/database/birthalert/birthdays/default";

// Internal features
import type { BirthdayFormStore } from "../types/store";
import { BirthdayFormMode } from "../lib/constants/enums/birthday_form_mode";
import { unify_birthday } from "../lib/fn/unify_birthday";

const useBirthdayFormStore = create<BirthdayFormStore>()((set) => ({
    formMode: BirthdayFormMode.READ,
    birthday: unify_birthday({...create_default_birthday(), id: -1}),
    isOpen: false,
    setFormMode: (formMode) => set(() => ({ formMode })),
    setBirthday: (birthday) => set(() => ({ birthday })),
    setIsOpen: (isOpen) => set(() => ({ isOpen })),
    setCreateMode: () => set(() => ({ birthday: unify_birthday({...create_default_birthday(), id: -1}), formMode: BirthdayFormMode.CREATE, isOpen: true })),
    setReadMode: (birthday) => set(() => ({ birthday, formMode: BirthdayFormMode.READ, isOpen: true })),
    setUpdateMode: (birthday) => set(() => ({ birthday, formMode: BirthdayFormMode.UPDATE, isOpen: true })),
}));

export { useBirthdayFormStore };