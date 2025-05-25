// Packages
import type { HTMLAttributes } from "react";

// External features
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CMDKSkeleton = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <Skeleton
            className={cn("h-12", className)}
            {...props}
        />
    );
};

export { CMDKSkeleton };