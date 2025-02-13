import { Plus } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";
import { open_birthday_form_create } from "@/hooks/use_birthday_form";

const BasicAddBirthdayButton = ({
    children,
    className,
    onClick,
    ...props
}: ButtonProps) => {

    return (
        <Button
            className={cn("h-7", className)}
            aria-label="Geburtstag erstellen"
            onClick={open_birthday_form_create}
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
    return (
        <BasicAddBirthdayButton
            size="sm"
            variant="secondary"
            {...props}
        >
            <span className="ml-1">Erstellen</span>
        </BasicAddBirthdayButton>
    );
}

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