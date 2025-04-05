import { Skeleton } from "../ui/skeleton";

const HomeSkeleton = () => {
    return (
        <>
            <Skeleton
                className="rounded-xl w-12 h-7 self-center my-2"
            />
            <Skeleton
                className="rounded-xl w-full h-18 mt-4"
            />
        </>
    );
};

export { HomeSkeleton };