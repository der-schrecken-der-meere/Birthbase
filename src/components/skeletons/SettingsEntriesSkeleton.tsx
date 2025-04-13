import { Skeleton } from "../ui/skeleton";

const SettingsEntriesSkeleton = ({
    entries,
}: {entries: number}) => {
    return (
        <div className="overflow-auto scrollbar-visible">
            {Array.from({length: entries}, (_, i) => (
                <div key={`entry-${i}`} className="py-2 mt-[1px]">
                    <Skeleton className='h-12 w-full' />
                </div>
            ))}
        </div>
    );
}

export { SettingsEntriesSkeleton };