import { createElement, FunctionComponent, Key, ReactNode, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { get_notifications_query } from '@/features/latest_notifications/query';

// Icons
import {
    Bell,
    CalendarClock,
    ChevronUp,
    Ellipsis,
    HardDrive,
    House,
    Info,
    Languages,
    Menu,
    Monitor,
    PartyPopper,
    Power,
    Search,
    Settings,
} from 'lucide-react';
import {
    Logo
} from './icons/Logo';

// Components
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

// Tauri
import {
    isTauri
} from '@tauri-apps/api/core';
import {
    OsType,
    type
} from '@tauri-apps/plugin-os';
import {
    exit
} from '@tauri-apps/plugin-process';

// Lib
import {
    primitive_strict_or
} from '@/lib/functions/logic/or';
import {
    cn
} from '@/lib/utils';
import { PageLinks } from '@/globals/constants/links';


type Link = {
    id: any,
    title: string,
    url: string,
    icon: FunctionComponent
};

const mainLinks: Link[] = [
    {
        title: "Startseite",
        url: PageLinks.HOME,
        id: "home",
        icon: House,
    },
    {
        title: "Meine Geburtstage",
        url: PageLinks.MY_BIRTHDAYS_PARAMS,
        id: "my_birthdays",
        icon: PartyPopper,
    },
    {
        title: "Einstellungen",
        url: PageLinks.SETTINGS,
        id: "settings",
        icon: Settings,
    },
    {
        title: "Benachrichtigungen",
        url: PageLinks.NOTIFICATIONS,
        id: "notifications",
        icon: Bell,
    }
];

const settingsLinks: Link[] = [
    {
        title: "Aussehen",
        url: PageLinks.SETTINGS_APPEARANCE,
        id: "appearance",
        icon: Monitor,
    },
    {
        title: "Benachrichtigungen",
        url: PageLinks.SETTINGS_NOTIFICATION,
        id: "notifications",
        icon: Bell,
    },
    {
        title: "Speicher",
        url: PageLinks.SETTINGS_STORAGE,
        id: "storage",
        icon: HardDrive,
    },
    {
        title: "Datum und Zeit",
        url: PageLinks.SETTINGS_TIME,
        id: "time",
        icon: CalendarClock,
    },
    {
        title: "Sprache",
        url: PageLinks.SETTINGS_LANGUAGE,
        id: "language",
        icon: Languages,
    },
    {
        title: "Info",
        url: PageLinks.SETTINGS_INFO,
        id: "info",
        icon: Info,
    },
];

const AppSidebar = () => {

    const onClick = useCallback(() => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", ctrlKey: true }));
    }, []);

    const { isMobile } = useSidebar();

    const { data: notification_data } = get_notifications_query();

    return (
        <Sidebar collapsible="icon">
            {isMobile && (
                <SheetHeader className='sr-only'>
                    <SheetTitle>Die Hauptnavigation</SheetTitle>
                    <SheetDescription>Hier werden Navigationselemente gruppiert angezeigt</SheetDescription>
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
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent
                // className='overflow-hidden'
            >
                <SidebarGroup>
                    <SidebarGroupLabel>Hauptmenü</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainLinks.map((link) => {
                                const props: SidebarEntryProps & {key: Key} = {
                                    key: link.id,
                                    url: link.url,
                                    Icon: link.icon,
                                    title: link.title,
                                };
                                if (link.id === "notifications" /*&& notification_data.length !== 0*/) {
                                    props.badge = notification_data.length;
                                }

                                return createElement(SidebarEntry, props);
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Einstellungen</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsLinks.map((link) => (
                                <SidebarEntry
                                    key={link.id}
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
                {!isTauri()
                    ? null
                    : (
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton>
                                            <Ellipsis/> Sonstiges
                                            <ChevronUp className='ml-auto' />
                                        </SidebarMenuButton>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        side="top"
                                        className='w-(--radix-popper-anchor-width)'
                                    >
                                        {!primitive_strict_or<OsType>(type(), "linux", "linux", "windows")
                                            ? null
                                            : (
                                                <DropdownMenuItem className='gap-2' onClick={() => (async () => {await exit(0)})()}>
                                                    <Power className='h-4 w-4'/>
                                                    <span>App schließen</span>
                                                </DropdownMenuItem>
                                            )
                                        }
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    )
                }
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}

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
}

const CustomSidebarTrigger = () => {
    // const { toggleSidebar, open, isMobile } = useSidebar();

    // if (!isMobile)
    //     return (
    //         <Button
    //             variant="outline"
    //             size="icon"
    //             onClick={toggleSidebar}
    //             // className={cn("absolute top-2/4 -translate-y-2/4 z-50 left-0")}
    //             {...props}
    //         >
    //             {open
    //                 ? <ChevronsLeft/>
    //                 : <ChevronsRight/>
    //             }
    //         </Button>
    //     );

    // return (<SidebarTrigger className='absolute right-0 top-0 z-50'/>)
    return <SidebarTrigger Icon={Menu}/>
}

export { AppSidebar, CustomSidebarTrigger };