import type { BreadcrumbDisplayProps } from "@/stores/use_navbar_store";
import type { UpperMobileNavbarProps } from "./types";
import { type CSSProperties } from "react";

import { Fragment } from "react/jsx-runtime";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { BreadcrumbListItem } from "./BreadcrumbListItem";
import { GoBackInHistory } from "../History";
import { AddBirthdayButton } from "../AddBirthdayButton";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

import { PageLinks } from "@/globals/constants/links";

const UpperDesktopNavbar = ({
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
            <div className='scrollbar-visible flex-1 overflow-auto'>
                <Breadcrumb className='px-1'>
                    <BreadcrumbList className='flex-nowrap'>
                        {renderBreadcrumbs(breadcrumbs)}
                        <BreadcrumbItem>
                            <BreadcrumbPage className='text-xl flex-1 text-nowrap'>{pageTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
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

export { UpperDesktopNavbar };