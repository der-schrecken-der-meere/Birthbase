import React from 'react'
import { cn } from '@/lib/utils';
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';
import { CustomSidebarTrigger } from './Sidebar';
import { GoBackInHistory } from './History';
import { HorizontalNavbar } from './navigation/Navigation';

interface I_PageWrapper {
    /** The Titel of the page */
    title?: string;
    children?: React.ReactNode;
    className?: string;
    /** The amount of how many times the history should go back */
    goBack?: number;
    docTitle?: string;
}

interface I_GoBackHistory {
    /** The amount of how many times the history should go back */
    amount?: number;
}

const PageWrapper = ({
    title,
    children,
    goBack,
    docTitle,
    className
}: I_PageWrapper) => {

    document.title = docTitle ? docTitle : document.title;

    return (
        <div className='flex flex-col h-full'>
            <ScrollArea className={cn('flex-1 w-full pr-2 pb-2 py-2 px-4 h-full max-w-[100vw] md:max-w-[1024px] md:mx-auto', className)}>
                <div className='flex flex-col h-full @container'>
                    {children}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
};

// const GoBackInHistory = ({
//     amount = 1,
// }: I_GoBackHistory) => {
//     const navigate = useNavigate();

//     return (
//         <Button
//             className="ml-1 mr-3 h-8 w-8"
//             variant="ghost"
//             size="icon"
//             disabled={amount === 0}
//             onClick={() => navigate((amount * -1))}
//         >
//             <LuArrowLeft size={24}/>
//         </Button>
//     );
// };

const PageWrapperSkeleton = ({
    className,
    children,
    goBack,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {goBack?: boolean}) => {
    return (
        <div className='flex flex-col h-full py-2 pl-5 pr-4'>
            <div className='inline-flex'>
                {goBack && <Skeleton className='mr-2 h-10 w-10'/>}
                <Skeleton className='h-10 w-60 mb-[0.625rem]'/>
            </div>
            <div className={cn("pt-1 pr-2 pb-2 flex flex-col", className)} {...props}>
                {children}
            </div>
        </div>
    );
}

const SettingsEntriesSkeleton = ({
    entries,
}: {entries: number}) => {
    return (
        <>
            {Array.from({length: entries}, (_, i) => (
                <Skeleton key={`entry-${i}`} className='h-12 w-full mt-2 mb-[0.5625rem]' />
            ))}
        </>
    );
}

export default PageWrapper;
export { PageWrapperSkeleton, SettingsEntriesSkeleton }