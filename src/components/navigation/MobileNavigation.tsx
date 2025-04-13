import type { CSSProperties, FunctionComponent, HTMLAttributes, ReactNode } from "react";

import { LinkProps, NavLink } from "react-router-dom";
import { MobileAddBirthdayButton } from "../AddBirthdayButton";

import { type LinkEntry, useNavEntriesStore } from "@/stores/use_nav_entries_store";

import { useGetNotificationsQuery } from "@/features/latest_notifications/query";

import { PageLinks } from "@/globals/constants/links";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { LucideProps } from "lucide-react";

const find_link = (page_link: PageLinks) => {
    const main_links = useNavEntriesStore.getState().mainLinks;
    return main_links.entries.find((link) => link.url === page_link) as LinkEntry;
};

type NotificationIconProps = {
    Icon: FunctionComponent<LucideProps>,
};

const NotificationIcon = ({
    Icon
}: NotificationIconProps) => {

    const { data: notification_data } = useGetNotificationsQuery();

    return (
        <div className="relative">
            <Icon className="h-4 w-4"/>
            {notification_data.data.length > 0 && (
                <div className='bg-[hsl(var(--text))] w-2 h-2 rounded-full absolute right-0 bottom-0 outline-offset-0 outline-3 outline-[hsl(var(--bg))]'></div>
            )}
        </div>
    );
};



const MobileLowerNavbar = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    const arr_nav_entries: ((Omit<LinkEntry, "icon"> & { invisible?: boolean, icon: ReactNode })|null)[] = Array.from(
        { length: 5 },
        (_, i) => {
            switch (i) {
                case 0:
                    const home = find_link(PageLinks.HOME);
                    return { ...home, ...{icon: <home.icon className="h-4 w-4"/>} }
                case 1:
                    const birthdays = find_link(PageLinks.MY_BIRTHDAYS_PARAMS);
                    return { ...birthdays, ...{icon: <birthdays.icon className="h-4 w-4"/>} }
                case 3:
                    const notifications = find_link(PageLinks.NOTIFICATIONS);
                    return { ...notifications, ...{icon: <NotificationIcon Icon={notifications.icon}/>} }
                case 4:
                    const settings = find_link(PageLinks.SETTINGS);
                    return { ...settings, ...{icon: <settings.icon className="h-4 w-4"/>} };
                default:
                    return null;
            }
        }
    );

    return (
        <div className={cn("flex items-center justify-between", className)} {...props}>
            {arr_nav_entries.map((entry) => {
                if (entry) {

                    const { url, invisible, icon, title } = entry;

                    return (
                        <MobileNavbarLink
                            key={url}
                            to={url}
                            className={invisible ? "pointer-events-none invisible" : ""}
                            aria-label={title}
                        >
                            {icon}
                        </MobileNavbarLink>
                    );
                }
                return <MobileAddBirthdayButton key={"addBirthday"} className="h-10"/>;
            })}
        </div>
    );
};

const MobileNavbarLink = ({
    children,
    to,
    className,
    ...props
}: LinkProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(buttonVariants({ variant: "ghost", size: "icon" }), isActive && "bg-primary text-primary-foreground", className)}
            style={({ isActive }) => ({
                "--bg": isActive ? "var(--primary)" : "var(--background)",
                "--text": isActive ? "var(--primary-foreground)" : "var(--primary)",
            }) as CSSProperties}
            {...props}
        >
            {children}
        </NavLink>
    );
};

export {
    MobileLowerNavbar,
};