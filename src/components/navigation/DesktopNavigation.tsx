import type { BreadcrumbDisplayProps, BreadcrumbProps } from "@/stores/use_navbar_store";
import type { UpperNavbarProps } from "./Navigation";

import { type CSSProperties, Fragment } from "react";

import { GoBackInHistory } from "../History";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Link, NavLink } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { AddBirthdayButton } from "../AddBirthdayButton";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";

import { PageLinks } from "@/globals/constants/links";

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
    );
};

type UpperMobileNavbarProps = {
    breadcrumbs: BreadcrumbDisplayProps<BreadcrumbProps>[],
} & UpperNavbarProps;

const DesktopUpperNavbar = ({
    pageTitle,
    breadcrumbs,
    notifications,
}: UpperMobileNavbarProps) => {

    const renderBreadcrumbs = (breadcrumbs?: BreadcrumbDisplayProps[]) => {
        if (!breadcrumbs) return null;
        return breadcrumbs.map((breadcrumb) => (
            <Fragment key={breadcrumb.id}>
                <BreadcrumbItem>
                    <BreadcrumbListItem type={breadcrumb.type as any} />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
            </Fragment>
        ))
    };

    return (
        <>
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
                            <BreadcrumbPage className='text-xl flex-1'>{pageTitle}</BreadcrumbPage>
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
                    <Bell className='w-5 h-5'/>
                    {notifications > 0 && (
                        <div className='bg-primary w-2 h-2 rounded-full absolute right-1 bottom-1 outline-offset-0 outline-3 outline-background'></div>
                    )}
                </Link>
            </Button>
        </>
    );
};

export {
    DesktopUpperNavbar,
};