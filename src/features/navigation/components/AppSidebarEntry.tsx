// Packages
import { NavLink } from "react-router-dom";

// External features
import { SidebarMenuBadge, sidebarMenuButtonVariants, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Internal features
import { AppSidebarEntryProps } from "../types/components";

const AppSidebarEntry = ({
    badge,
    children,
    url = "/",
    Icon,
    ...props
}: AppSidebarEntryProps) => {
    return (
        <SidebarMenuItem
            {...props}
        >
            <NavLink
                to={url}
                className={({ isActive }) => cn(
                    sidebarMenuButtonVariants(),
                    isActive && "bg-primary text-primary-foreground"
                )}
            >
                <Icon className="w-4 h-4" />
                <span>
                    {children}
                </span>
                {badge && (
                    <SidebarMenuBadge className="text-current">
                        {badge}
                    </SidebarMenuBadge>
                )}
            </NavLink>
        </SidebarMenuItem>
    );
};

export { AppSidebarEntry };