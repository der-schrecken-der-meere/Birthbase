import { HTMLAttributes } from 'react';
import { useNavbar } from '../../hooks/useNavbar';
import { cn } from '@/lib/utils';
import { get_notifications_query } from '@/features/latest_notifications/query';
import { useSidebar } from '../ui/sidebar';
import { MobileUpperNavbar } from './MobileNavigation';
import { DesktopUpperNavbar } from './DesktopNavigation';

type UpperNavbarProps = {
    pageTitle: string,
    notifications: number,
};

const UpperNavbar = ({
    className,
    ...props
} : HTMLAttributes<HTMLDivElement>) => {

    const { pageTitle, breadcrumbs } = useNavbar({});

    const { isMobile } = useSidebar();

    const { data: notification_data } = get_notifications_query();

    return (
        <div
            className={cn("flex items-center border-b-[0px] py-2 gap-2 @container", className)}
            {...props}
        >
            {isMobile
                ? (
                    <MobileUpperNavbar
                        pageTitle={pageTitle}
                        notifications={notification_data.length}
                    />
                )
                : (
                    <DesktopUpperNavbar
                        pageTitle={pageTitle}
                        notifications={notification_data.length}
                        breadcrumbs={breadcrumbs}
                    />
                )
            }
        </div>
    )
};

export type { UpperNavbarProps };
export { UpperNavbar };