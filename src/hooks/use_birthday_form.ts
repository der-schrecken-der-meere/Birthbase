import { getDefaultBirthday, type Birthday } from "@/database/tables/birthday/birthdays";
import { create } from "zustand";

enum BirthdayFormMode {
    UPDATE,
    CREATE,
    READ,
};

interface BirthdayForm {
    operation: BirthdayFormMode,
    birthday: Birthday,
    open: boolean,
    set_operation: (operation: BirthdayFormMode) => void,
    set_birthday: (birthday: Birthday) => void,
    set_open: (open: boolean) => void,
};

const use_birthday_form = create<BirthdayForm>()((set) => ({
    operation: BirthdayFormMode.READ,
    birthday: getDefaultBirthday(),
    open: false,
    set_operation: (operation) => set(() => ({ operation })),
    set_birthday: (birthday) => set(() => ({ birthday })),
    set_open: (open) => set(() => ({ open })),
}));

const open_birthday_form_read = (birthday: Birthday) => {
    use_birthday_form.getState().set_birthday(birthday);
    use_birthday_form.getState().set_operation(BirthdayFormMode.READ);
    use_birthday_form.getState().set_open(true);
};

const open_birthday_form_create = () => {
    use_birthday_form.getState().set_birthday(getDefaultBirthday());
    use_birthday_form.getState().set_operation(BirthdayFormMode.CREATE);
    use_birthday_form.getState().set_open(true);
};

const open_birthday_form_update = (birthday: Birthday) => {
    use_birthday_form.getState().set_birthday(birthday);
    use_birthday_form.getState().set_operation(BirthdayFormMode.UPDATE);
    use_birthday_form.getState().set_open(true);
};

export {
    BirthdayFormMode,
    use_birthday_form,
    open_birthday_form_create,
    open_birthday_form_read,
    open_birthday_form_update,
};