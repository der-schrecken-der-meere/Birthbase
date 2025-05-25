// Packages
import type { HTMLAttributes } from "react";

// External features
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const BirthdayMonthBadgeSkeleton = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <Skeleton
            className={cn("rounded-xl w-12 h-7", className)}
            {...props}
        />
    );
};

export { BirthdayMonthBadgeSkeleton };