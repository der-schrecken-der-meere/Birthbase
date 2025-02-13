import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";

const SettingsEntriesSkeleton = ({
    entries,
}: {entries: number}) => {
    return (
        <ScrollArea>
            {Array.from({length: entries}, (_, i) => (
                <Skeleton key={`entry-${i}`} className='h-12 w-full mt-2 mb-[0.5625rem]' />
            ))}
        </ScrollArea>
    );
}

export { SettingsEntriesSkeleton };