import { Skeleton } from "../ui/skeleton";

const MyBirthdaysSkeleton = () => {
    return (
        <>
            <Skeleton
                className="w-full h-10 mb-2"
            />
            <Skeleton
                className="w-full h-36"
            />
            <Skeleton
                className="w-full h-8 mb-2 mt-auto"
            />
        </>
    );
}

export { MyBirthdaysSkeleton };