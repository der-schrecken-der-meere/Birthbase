import { Plus } from "lucide-react";
import { useBirthdayForm } from "../hooks/useBirthdayForm";
import { Button, ButtonProps } from "./ui/button";
import { Label } from "./ui/label";
import { LabelProps } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const BasicAddBirthdayButton = ({
    children,
    className,
    onClick,
    ...props
}: ButtonProps) => {
    const { openBirthdayFormAdd } = useBirthdayForm();

    return (
        <Button
            className={cn("h-7", className)}
            aria-label="Geburtstag erstellen"
            onClick={openBirthdayFormAdd}
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