// Packages
import { Menu, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

// External features
import { Logo } from "@/components/icons/Logo";
import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAppStore } from "@/stores/use_app_store";
import { useGetNotificationsQuery } from "@/features/notifications/queries/notifications/use_get_notifications";

// Internal features
import { useNavigationLinksStore } from "../stores/use_navigation_links";
import { useCMDKStore } from "../stores/use_cmdk";
import { PageLinks } from "../lib/constants/enums/PageLinks";
import { AppSidebarMisc } from "./AppSidebarMisc";
import { AppSidebarEntry } from "./AppSidebarEntry";

const AppSidebar = () => {

    const mainLinks = useNavigationLinksStore((state) => state.mainLinks);
    const settingsLinks = useNavigationLinksStore((state) => state.settingsLinks);
    const miscActions = useNavigationLinksStore((state) => state.miscActions);
    const appName = useAppStore((state) => state.appName);
    const setIsOpen = useCMDKStore((state) => state.setIsOpen);
    
    const { isMobile } = useSidebar();
    const { t } = useTranslation(["navigation", "generally"]);
    const { data: { not_read } } = useGetNotificationsQuery()

    const onSearchClick = () => {
        setIsOpen(true);
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
                            <span className="font-semibold tracking-wide mt-0.5">
                                {appName}
                            </span>
                        </SidebarMenuButton>
                        <SidebarMenuAction
                            onClick={onSearchClick}
                        >
                            <Search className="w-4 h-4" />
                        </SidebarMenuAction>
                    </SidebarMenuItem>
                    {!isMobile && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <SidebarTrigger Icon={Menu} className='justify-start'/>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="scrollbar-visible !group-data-[collapsible=icon]:scrollbar-visible">
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {mainLinks.title}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainLinks.links.map(({ url, title, Icon }) => (
                                <AppSidebarEntry
                                    key={url}
                                    url={url}
                                    Icon={Icon}
                                    badge={(url === PageLinks.NOTIFICATIONS && not_read !== 0) ? not_read : undefined}
                                >
                                    {title}
                                </AppSidebarEntry>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        {settingsLinks.title}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsLinks.links.map(({ url, Icon, title }) => (
                                <AppSidebarEntry
                                    key={url}
                                    url={url}
                                    Icon={Icon}
                                >
                                    {title}
                                </AppSidebarEntry>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {(miscActions.links.length > 0) && (
                    <AppSidebarMisc
                        title={miscActions.title}
                        linkEntries={miscActions.links}
                    />
                )}
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    );
};

export { AppSidebar };