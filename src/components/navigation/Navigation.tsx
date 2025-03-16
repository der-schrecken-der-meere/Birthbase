import { type HTMLAttributes } from 'react';

import { DesktopUpperNavbar } from './DesktopNavigation';
import { MobileUpperNavbar } from './MobileNavigation';

import { useNavbarStore } from '@/stores/use_navbar_store';

import { useGetNotificationsQuery } from '@/features/latest_notifications/query';
import { useSidebar } from '../ui/sidebar';

import { cn } from '@/lib/utils';

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
                    <MobileUpperNavbar
                        pageTitle={pageTitle}
                        notifications={not_read}
                    />
                )
                : (
                    <DesktopUpperNavbar
                        pageTitle={pageTitle}
                        notifications={not_read}
                        breadcrumbs={breadCrumbs}
                    />
                )
            }
        </div>
    );
};

export type { UpperNavbarProps };
export { UpperNavbar };