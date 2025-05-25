// Packages
import { type HTMLAttributes, lazy, Suspense } from "react";

// External features
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

// Internal features

const LowerNavbarMobile = lazy(() => import("./LowerNavbarMobile").then(module => ({ default: module.LowerNavbarMobile })));

const LowerNavbar = (props: HTMLAttributes<HTMLDivElement>) => {
    const { isMobile } = useSidebar();

    if (!isMobile) {
        return null;
    }

    return (
        <Suspense
            fallback={
                <div className='h-14 py-1 flex items-center justify-between'>
                    <Skeleton className='w-10 h-10' />
                    <Skeleton className='w-10 h-10' />
                    <Skeleton className='w-10 h-10' />
                    <Skeleton className='w-10 h-10' />
                    <Skeleton className='w-10 h-10' />
                </div>
            }
        >
            <LowerNavbarMobile {...props} />
        </Suspense>
    );
};

export { LowerNavbar };