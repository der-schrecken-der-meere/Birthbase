import { Skeleton } from "../ui/skeleton";

const NotificationSkeleton = () => {
    return (
        <>
            <div className="mb-2 flex gap-2">
                <Skeleton className="h-9 w-25" />
                <Skeleton className="h-9 w-25" />
                <Skeleton className="h-9 w-25" />
                <Skeleton className="h-9 w-25" />
            </div>
            <Skeleton className="w-full h-19" />
        </>
    );
};

export { NotificationSkeleton };