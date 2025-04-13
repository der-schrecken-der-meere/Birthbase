import { type ButtonProps } from 'react-day-picker';

import { createElement, type FunctionComponent, type Key, type ReactNode } from 'react';

import { NavLink } from 'react-router-dom';
import { Logo } from './icons/Logo';
import {
    ChevronUp,
    Ellipsis,
    Menu,
    Power,
    Search,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    sidebarMenuButtonVariants,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar
} from './ui/sidebar';
import {
    SheetDescription,
    SheetHeader,
    SheetTitle
} from './ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from './ui/dropdown-menu';

import { useGetNotificationsQuery } from '@/features/latest_notifications/query';
import { useNavEntriesStore } from '@/stores/use_nav_entries_store';

import { exit } from '@tauri-apps/plugin-process';
import { cn } from '@/lib/utils';
import { PageLinks } from '@/globals/constants/links';
import { useTranslation } from 'react-i18next';
import { OnlyTauri } from './OnlyTauri';

const AppSidebar = () => {
    
    const settingsLinks = useNavEntriesStore((state) => state.settingsLinks);
    const mainLinks = useNavEntriesStore((state) => state.mainLinks);

    const { isMobile } = useSidebar();
    const { data: notification_data } = useGetNotificationsQuery();
    const { t } = useTranslation(["navigation", "generally"]);

    const onClick = () => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", ctrlKey: true }));
    };

    return (
        <Sidebar collapsible="icon">
            {isMobile && (
                <SheetHeader className='sr-only'>
                    <SheetTitle>
                        {t("sidebar.title")}
                    </SheetTitle>
                    <SheetDescription>
                        {t("sidebar.description")}
                    </SheetDescription>
                </SheetHeader>
            )}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <Logo/>
                            <span className="font-semibold tracking-wide mt-0.5">Birthbase</span>
                        </SidebarMenuButton>
                        <SidebarMenuAction onClick={onClick}>
                            <Search />
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                    {!isMobile && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <CustomSidebarTrigger className='justify-start'/>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className='scrollbar-visible'>
                <SidebarGroup>
                    <SidebarGroupLabel>{mainLinks.title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainLinks.entries.map((link) => {
                                const props: SidebarEntryProps & {key: Key} = {
                                    key: link.url,
                                    url: link.url,
                                    Icon: link.icon,
                                    title: link.title,
                                };
                                if (link.url === PageLinks.NOTIFICATIONS && notification_data.not_read !== 0) {
                                    props.badge = notification_data.not_read;
                                }

                                return createElement(SidebarEntry, props);
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>{settingsLinks.title}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsLinks.entries.map((link) => (
                                <SidebarEntry
                                    key={link.url}
                                    url={link.url}
                                    Icon={link.icon}
                                    title={link.title}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <OnlyTauri osTypes={["linux", "windows", "android", "ios", "macos"]}>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton className='justify-between'>
                                        <div className='flex gap-2 items-center'>
                                            <Ellipsis className='h-4 w-4'/>
                                            {t("misc", { ns: "generally" })}
                                        </div>
                                        <ChevronUp/>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className='w-(--radix-popper-anchor-width)'
                                >
                                    <OnlyTauri osTypes={["linux", "windows", "macos"]}>
                                        <DropdownMenuItem className='gap-2' onClick={() => (async () => {await exit(0)})()}>
                                            <Power className='h-4 w-4'/>
                                                {t("close_app", { ns: "generally" })}
                                        </DropdownMenuItem>
                                    </OnlyTauri>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </OnlyTauri>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
};

type SidebarEntryProps = {
    url: string,
    Icon: FunctionComponent,
    title: string,
    badge?: ReactNode,
};

const SidebarEntry = ({
    url,
    Icon,
    title,
    badge = null,
}: SidebarEntryProps) => {
    return (
        <SidebarMenuItem>
            {/* <SidebarMenuButton
                // className='p-0 group-data-[collapsible=icon]:p-0! block'
            > */}
                <NavLink to={url} className={({ isActive }) => cn(sidebarMenuButtonVariants(), isActive && "bg-primary text-primary-foreground")} >
                    <Icon />
                    <span>
                        {title}
                    </span>
                    {badge !== null && (
                        <SidebarMenuBadge className='text-current'>
                            {badge}
                        </SidebarMenuBadge>
                    )}
                </NavLink>
            {/* </SidebarMenuButton> */}
        </SidebarMenuItem>
    );
};

const CustomSidebarTrigger = (props: ButtonProps) => {
    return <SidebarTrigger {...props} Icon={Menu}/>
};

export { AppSidebar, CustomSidebarTrigger };