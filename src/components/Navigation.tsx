import { CSSProperties, Fragment, HTMLAttributes, useCallback } from 'react';
import { GoBackInHistory } from './History';
import { CustomSidebarTrigger } from './Sidebar';
import { BreadcrumbDisplayProps, BreadcrumbProps, useNavbar } from '../hooks/useNavbar';
import { cn } from '@/lib/utils';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Link, LinkProps, NavLink } from 'react-router-dom';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { AddBirthdayButton, MobileAddBirthdayButton } from './AddBirthdayButton';
import { Button } from './ui/button';
import { Bell, House, PartyPopper, Settings } from 'lucide-react';
import { get_notifications_query } from '@/features/latest_notifications/query';
import { PageLinks } from '@/globals/constants/links';

const BreadcrumbListItem = ({
    type,
}: {
    type: BreadcrumbProps|BreadcrumbProps[]
}) => {
    return (
        !Array.isArray(type)
            ?   <BreadcrumbLink asChild>
                    <NavLink to={type.href}>
                        {type.display}
                    </NavLink>
                </BreadcrumbLink>
            :   <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center gap-1'>
                        <BreadcrumbEllipsis className='h-4 w-4' />
                        <span className='sr-only'>Menü auf- und zuklappen</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        {type.map((breadcrumb) => (
                            <DropdownMenuItem asChild key={breadcrumb.href}>
                                <NavLink to={breadcrumb.href}>
                                    {breadcrumb.display}
                                </NavLink>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
    )
}

const HorizontalNavbar = ({
    className,
    ...props
} : HTMLAttributes<HTMLDivElement>) => {

    const { pageTitle, breadcrumbs } = useNavbar({});

    const { data: notification_data } = get_notifications_query();

    const renderBreadcrumbs = useCallback((breadcrumbs?: BreadcrumbDisplayProps[]) => {
        if (!breadcrumbs) return null;
        return breadcrumbs.map((breadcrumb) => (
            <Fragment key={breadcrumb.id}>
                <BreadcrumbItem>
                    <BreadcrumbListItem type={breadcrumb.type as any} />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
            </Fragment>
        ))
    }, []);

    return (
        <div
            className={cn("flex items-center border-b-[0px] py-2 gap-2 @container", className)}
            {...props}
        >
            <CustomSidebarTrigger/>
            <GoBackInHistory
                variant="ghost"
                size="icon"
                className='w-7 h-7'
            />
            <ScrollArea className='flex-1'>
                <Breadcrumb className='px-1'>
                    <BreadcrumbList className='flex-nowrap'>
                        {renderBreadcrumbs(breadcrumbs)}
                        <BreadcrumbItem>
                            <BreadcrumbPage className='text-xl font-medium whitespace-pre text-ellipsis overflow-hidden flex-1'>{pageTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <AddBirthdayButton className='hidden @md:flex'/>
            <Button
                asChild
                variant="ghost"
                size="icon"
                className='w-7 h-7 relative'
                style={{"--bg": "hsl(var(--accent))"} as CSSProperties}
            >
                <Link
                    to={PageLinks.NOTIFICATIONS}
                >
                    <Bell className='w-4 h-4'/>
                    {notification_data.length > 0 && (
                        <div className='bg-primary w-2 h-2 rounded-full absolute right-1 bottom-1 outline-offset-0 outline-3 outline-background'></div>
                    )}
                </Link>
            </Button>
            {/* <h1 
                className={"text-2xl font-medium whitespace-pre text-ellipsis overflow-hidden flex-1"}
            >
                {pageTitle}
            </h1> */}
        </div>
    )
};

const MobileNavbar = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {

    return (
        <div className={cn("flex items-center justify-between", className)} {...props}>
            {/* Home */}
            <MobileNavbarLink
                to={PageLinks.HOME}
            >
                <House/>
                {/* Startseite */}
            </MobileNavbarLink>
            {/* My Birthdays */}
            <MobileNavbarLink
                to={PageLinks.MY_BIRTHDAYS_PARAMS}
            >
                <PartyPopper/>
                {/* Geburtstage */}
            </MobileNavbarLink>
            {/* Add Birthday */}
            <MobileAddBirthdayButton className="h-10"/>
            {/* Placeholder */}
            <MobileNavbarLink
                to={PageLinks.HOME}
                className="pointer-events-none invisible"
            >
                <Bell/>
                {/* Benachrichtigungen */}
            </MobileNavbarLink>
            {/* Settings */}
            <MobileNavbarLink
                to={PageLinks.SETTINGS}
            >
                <Settings/>
                {/* Einstellungen */}
            </MobileNavbarLink>
        </div>
    )
};

const MobileNavbarLink = ({
    children,
    to,
    className,
}: LinkProps) => {
    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn('flex flex-col gap-1 items-center text-xs font-light', className)}
        >
            <NavLink
                to={to}
                className={({ isActive }) => cn(isActive ? "text-primary" : "")}
            >
                {children}
            </NavLink>
        </Button>
    )
};

export { HorizontalNavbar, MobileNavbar };