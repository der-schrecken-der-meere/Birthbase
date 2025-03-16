import { Plus } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";
import { useBirthdayFormStore } from "@/stores/use_birthday_form_store";
import { useTranslation } from "react-i18next";

const BasicAddBirthdayButton = ({
    children,
    className,
    onClick,
    ...props
}: ButtonProps) => {

    const setCreateMode = useBirthdayFormStore((state) => state.setCreateMode);

    return (
        <Button
            className={cn("h-7", className)}
            aria-label="Geburtstag erstellen"
            onClick={setCreateMode}
            {...props}
        >
            <Plus className="h-4 w-4"/>
            {children}
        </Button>
    );
};

const AddBirthdayButton = ({
    ...props
}: ButtonProps) => {

    const { t } = useTranslation(["generally"]);

    return (
        <BasicAddBirthdayButton
            size="sm"
            variant="secondary"
            {...props}
        >
            <span className="ml-1">{t("create_btn")}</span>
        </BasicAddBirthdayButton>
    );
};

const MobileAddBirthdayButton = ({
    ...props
}: ButtonProps) => {
    return (
        <BasicAddBirthdayButton
            size="icon"
            variant="secondary"
            {...props}
        />
    );
};

export { AddBirthdayButton, MobileAddBirthdayButton };