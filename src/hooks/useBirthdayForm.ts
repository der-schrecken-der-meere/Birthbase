import { getDefaultBirthday, type Birthday } from "@/database/tables/birthday/birthdays";
import { createContext, Dispatch, SetStateAction, useCallback, useContext } from "react";

type BirthdayFormMode = "update"|"create"|"read";

interface BirthdayFormContextProps {
    operation: BirthdayFormMode,
    setOperation: Dispatch<SetStateAction<BirthdayFormMode>>,
    data: Birthday,
    setData: Dispatch<SetStateAction<Birthday>>,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
};

const BirthdayFormContext = createContext<BirthdayFormContextProps>({
    operation: "create",
    setOperation: () => {},
    data: getDefaultBirthday(),
    setData: () => {},
    open: false,
    setOpen: () => {},
});

const useBirthdayForm = () => {
    const useBirthdayProps = useContext(BirthdayFormContext);

    const openBirthdayFormRead = useCallback((birthday: Birthday) => {
        useBirthdayProps.setData(birthday);
        useBirthdayProps.setOperation("read");
        useBirthdayProps.setOpen(true);
    }, []);

    const openBirthdayFormAdd = useCallback(() => {
        useBirthdayProps.setData(getDefaultBirthday());
        useBirthdayProps.setOperation("create");
        useBirthdayProps.setOpen(true);
    }, []);

    const close = useCallback(() => {
        useBirthdayProps.setOpen(false);
    }, []);

    const openBirthdayFormUpdate = useCallback((birthday: Partial<Birthday>) => {
        const newBirthday = {
            ...getDefaultBirthday(),
            ...birthday
        };
        useBirthdayProps.setData(newBirthday);
        useBirthdayProps.setOperation("update");
        useBirthdayProps.setOpen(true);
    }, []);

    return {
        openBirthdayFormAdd,
        openBirthdayFormUpdate,
        openBirthdayFormRead,
        close,
        ...useBirthdayProps,
    };
};

export type { BirthdayFormContextProps, BirthdayFormMode };
export { BirthdayFormContext, useBirthdayForm };