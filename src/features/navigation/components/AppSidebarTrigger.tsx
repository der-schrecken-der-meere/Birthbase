// Packages
import { Sidebar } from "lucide-react";

// External features
import { ButtonProps } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const AppSidebarTrigger = ({
    className,
}: ButtonProps) => {
    return (
        <SidebarTrigger
            Icon={Sidebar}
            className={className}
        />
    );
};

export { AppSidebarTrigger };