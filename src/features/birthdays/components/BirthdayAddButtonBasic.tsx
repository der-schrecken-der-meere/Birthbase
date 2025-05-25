// Packages
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

// External features
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Internal features
import { useBirthdayFormStore } from "../stores/use_birthday_form";

const BirthdayAddButtonBasic = ({
    children,
    className,
    onClick,
    ...props
}: ButtonProps) => {

    const setCreateMode = useBirthdayFormStore((state) => state.setCreateMode);

    const { t } = useTranslation("generally");

    return (
        <Button
            className={cn("h-7 gap-1", className)}
            aria-label={t("create_birthday")}
            onClick={setCreateMode}
            variant="secondary"
            {...props}
        >
            <Plus className="h-4 w-4"/>
            {children}
        </Button>
    );
};

export { BirthdayAddButtonBasic };