// Packages
import type { HTMLAttributes } from "react";

// External features
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AppSidebar } from "./AppSidebar";

const AppSidebarProvider = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <SidebarProvider
            className={cn("h-svh", className)}
            {...props}
        >
            <AppSidebar/>
            {children}
        </SidebarProvider>
    )
};

export { AppSidebarProvider };