// Packages
import { HTMLAttributes, Suspense } from "react";

// External features
import { useGetNotificationsQuery } from "@/features/notifications/queries/notifications/use_get_notifications";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Internal features
import { useNavigationStore } from "../stores/use_navigation";
import { UpperNavbarDesktop } from "./UpperNavbarDesktop";
import { UpperNavbarMobile } from "./UpperNavbarMobile";

const UpperNavbar = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    const pageTitle = useNavigationStore((state) => state.pageTitle);
    const breadCrumbs = useNavigationStore((state) => state.breadcrumbs);

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
                        <UpperNavbarMobile
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
                        <UpperNavbarDesktop
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

export { UpperNavbar };