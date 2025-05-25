// Packages
import { type CSSProperties, Fragment } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";

// External features
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

// Internal features
import type { UpperNavbarDesktopProps } from "../types/components";
import { PageLinks } from "../lib/constants/enums/PageLinks";
import { GoBackInHistory } from "./GoBackInHistory";
import { BreadcrumbListItem } from "./BreadcrumbListItem";
import { BirthdayAddButton } from "@/features/birthdays/components/BirthdayAddButton";

const UpperNavbarDesktop = ({
    pageTitle,
    notifications,
    breadcrumbs,
}: UpperNavbarDesktopProps) => {
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
                        {breadcrumbs.map((breadcrumb) => (
                            <Fragment key={breadcrumb.id}>
                                <BreadcrumbItem>
                                    <BreadcrumbListItem
                                        type={breadcrumb.type as any}
                                    />
                                </BreadcrumbItem>
                                <BreadcrumbSeparator/>
                            </Fragment>
                        ))}
                        <BreadcrumbItem>
                            <BreadcrumbPage className='text-xl flex-1 text-nowrap'>
                                {pageTitle}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <BirthdayAddButton className='hidden @md:flex'/>
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

export { UpperNavbarDesktop };