// Packages
import type { HTMLAttributes } from "react";

// External features
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BirthdayEntrySkeleton = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <Skeleton
            className={cn("rounded-xl w-full h-18", className)}
            {...props}
        />
    );
};

export { BirthdayEntrySkeleton };