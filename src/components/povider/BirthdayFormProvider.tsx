import { getDefaultBirthday } from "@/database/tables/birthday/birthdays";
import { BirthdayFormContext, BirthdayFormMode } from "@/hooks/useBirthdayForm";
import { useMemo, useState, type ReactNode } from "react";
import { BirthdayFormDialog } from "../singletons/BirthdayFormDialog";

interface BirthdayFormContextProps {
    children: ReactNode,
    defaultOpen?: boolean,
    defaultOperation?: BirthdayFormMode,
};

const BirthdayFormProvider = ({
    children
}: BirthdayFormContextProps) => {

    const [open, setOpen] = useState(false);
    const [operation, setOperation] = useState<BirthdayFormMode>("create");
    const [data, setData] = useState(getDefaultBirthday());

    const contextValue = useMemo(() => ({
        operation,
        setOperation,
        data,
        setData,
        open,
        setOpen,
    }), [operation, data, open]);

    return (
        <BirthdayFormContext.Provider value={contextValue}>
            {children}
            <BirthdayFormDialog />
        </BirthdayFormContext.Provider>
    );
};

export { BirthdayFormProvider };