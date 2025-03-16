import { CheckboxProps } from "@radix-ui/react-checkbox";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

import { cn } from "@/lib/utils";

const LinuxMacUpdater = ({
    className,
    children,
    ...props
}: CheckboxProps) => {
    return (
        <Label className="flex flex-nowrap text-sm text-muted-foreground">
            <Checkbox
                className={cn("shrink-0 mr-2 mt-0.5", className)}
                {...props}
            />
            {children}
        </Label>
    );
};

export { LinuxMacUpdater };