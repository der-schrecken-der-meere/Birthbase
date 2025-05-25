// Packages
import type { CheckboxProps } from "@radix-ui/react-checkbox";

// External features
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Internal features
import { useUpdateStore } from "../../stores/use_update";

const UpdaterRestartCheckbox = ({
    className,
    children,
    ...props
}: CheckboxProps) => {

    const shouldRestart = useUpdateStore((state) => state.shouldRestart);
    const setShouldRestart = useUpdateStore((state) => state.setShouldRestart);

    return (
        <Label
            className="flex gap-2 flex-nowrap text-sm text-muted-foreground"
        >
            <Checkbox
                className={cn("shrink-0 mt-0.5", className)}
                onCheckedChange={setShouldRestart}
                defaultChecked={shouldRestart}
                {...props}
            />
            {children}
        </Label>
    );
};

export { UpdaterRestartCheckbox };