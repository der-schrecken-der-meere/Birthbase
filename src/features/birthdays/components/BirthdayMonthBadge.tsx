// Packages
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const BirthdayMonthBadge = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn(
                "rounded-xl py-1 px-2 w-max bg-muted/80 text-muted-foreground text-sm",
                className
            )}
            {...props}
        />
    );
};

export { BirthdayMonthBadge };