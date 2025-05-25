// Internal features
import type { BirthdayFormMode } from "../lib/constants/enums/birthday_form_mode";
import type { ComputedAppBirthday } from "./query";

type BirthdayFormStoreState = {
    /** Current form mode */
    formMode: BirthdayFormMode,
    /** Birthday data visible in the form */
    birthday: ComputedAppBirthday,
    /** Indicates whether the form dialog is open */
    isOpen: boolean,
};

interface BirthdayFormStore extends BirthdayFormStoreState {
    /** Sets birthday data */
    setBirthday: (birthday: ComputedAppBirthday) => void,
    /** Sets the form to create mode and initializes the form */
    setCreateMode: () => void,
    /** Sets form mode */
    setFormMode: (formMode: BirthdayFormMode) => void,
    /** Sets whether the form dialog is open */
    setIsOpen: (isOpen: boolean) => void,
    /** Sets the form to read mode and shows the passed birthday in the form */
    setReadMode: (birthday: ComputedAppBirthday) => void,
    /** Sets the form to update mode and shows the passed birthday in the form */
    setUpdateMode: (birthday: ComputedAppBirthday) => void,
};

export type {
    BirthdayFormStore,
    BirthdayFormStoreState,
};