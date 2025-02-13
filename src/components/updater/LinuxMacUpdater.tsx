import { CheckboxProps } from "@radix-ui/react-checkbox";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

const LinuxMacUpdater = ({
    className,
    ...props
}: CheckboxProps) => {
    return (
        <Label className="flex flex-nowrap text-sm text-muted-foreground">
            <Checkbox
                className={cn("shrink-0 mr-2 mt-0.5", className)}
                {...props}
            />
            Nach der Installation des Updates die App neustarten, um die neuste Änderungen nutzen zu können.
        </Label>
    );
};

export { LinuxMacUpdater };