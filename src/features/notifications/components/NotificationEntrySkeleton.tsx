// Packages
import { HTMLAttributes } from "react";

// External features
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const NotificationEntrySkeleton = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <Skeleton
            className={cn("w-full h-19", className)}
            {...props}
        />
    );
};

export { NotificationEntrySkeleton };