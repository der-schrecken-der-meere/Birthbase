import type { CheckboxProps } from "@radix-ui/react-checkbox";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";

const LinuxMacUpdater = ({
    className,
    children,
    ...props
}: CheckboxProps) => {
    return (
        <Label className="flex gap-2 flex-nowrap text-sm text-muted-foreground">
            <Checkbox
                className={cn("shrink-0 mt-0.5", className)}
                {...props}
            />
            {children}
        </Label>
    );
};

export { LinuxMacUpdater };