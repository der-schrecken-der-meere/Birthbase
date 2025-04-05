import { lazy, Suspense, type HTMLAttributes } from 'react';

import { useNavbarStore } from '@/stores/use_navbar_store';

import { useGetNotificationsQuery } from '@/features/latest_notifications/query';
import { useSidebar } from '../ui/sidebar';

import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const UpperDesktopNavbar = lazy(() => import('./UpperDesktopNavbar').then(module => ({ default: module.UpperDesktopNavbar })));
const UpperMobileNavbar = lazy(() => import('./UpperMobileNavbar').then(module => ({ default: module.UpperMobileNavbar })));

type UpperNavbarProps = {
    pageTitle: string,
    notifications: number,
};

const UpperNavbar = ({
    className,
    ...props
} : HTMLAttributes<HTMLDivElement>) => {
    
    const pageTitle = useNavbarStore((state) => state.pageTitle);
    const breadCrumbs = useNavbarStore((state) => state.breadCrumbs);

    const { isMobile } = useSidebar();
    const { data: { not_read } } = useGetNotificationsQuery();

    return (
        <div
            className={cn("flex items-center border-b-[0px] py-2 gap-2 not-md:px-2 @container", className)}
            {...props}
        >
            {isMobile
                ? (
                    <Suspense fallback={
                        <>
                            <Skeleton className='h-7 w-7 shrink-0'/>
                            <Skeleton className='h-7 w-full'/>
                            <Skeleton className='h-7 w-7 shrink-0'/>
                        </>
                    }>
                        <UpperMobileNavbar
                            pageTitle={pageTitle}
                            notifications={not_read}
                        />
                    </Suspense>
                )
                : (
                    <Suspense fallback={
                        <>
                            <Skeleton className='h-7 w-7 shrink-0'/>
                            <Skeleton className='h-7 w-full'/>
                            <Skeleton className='h-7 w-25 shrink-0'/>
                            <Skeleton className='h-7 w-7 shrink-0'/>
                        </>
                    }>
                        <UpperDesktopNavbar
                            pageTitle={pageTitle}
                            notifications={not_read}
                            breadcrumbs={breadCrumbs}
                        />
                    </Suspense>
                )
            }
        </div>
    );
};

export type { UpperNavbarProps };
export { UpperNavbar };