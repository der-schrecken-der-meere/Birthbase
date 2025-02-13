import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { get_notifications_query } from '@/features/latest_notifications/query';
import { useSidebar } from '../ui/sidebar';
import { MobileUpperNavbar } from './MobileNavigation';
import { DesktopUpperNavbar } from './DesktopNavigation';
import { use_app_navbar } from '@/hooks/use_app_navbar';

type UpperNavbarProps = {
    pageTitle: string,
    notifications: number,
};

const UpperNavbar = ({
    className,
    ...props
} : HTMLAttributes<HTMLDivElement>) => {

    const page_title = use_app_navbar((state) => state.page_title);
    const bread_crumbs = use_app_navbar((state) => state.bread_crumbs);

    const { isMobile } = useSidebar();

    const { data: notification_data } = get_notifications_query();

    return (
        <div
            className={cn("flex items-center border-b-[0px] py-2 gap-2 not-md:px-2 @container", className)}
            {...props}
        >
            {isMobile
                ? (
                    <MobileUpperNavbar
                        pageTitle={page_title}
                        notifications={notification_data.not_read}
                    />
                )
                : (
                    <DesktopUpperNavbar
                        pageTitle={page_title}
                        notifications={notification_data.not_read}
                        breadcrumbs={bread_crumbs}
                    />
                )
            }
        </div>
    )
};

export type { UpperNavbarProps };
export { UpperNavbar };