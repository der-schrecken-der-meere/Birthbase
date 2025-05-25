// Packages
import { ChevronUp, Ellipsis } from "lucide-react";

// External features
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

// Internal features
import { AppSidebarMiscProps } from "../types/components";

const AppSidebarMisc = ({
    linkEntries,
    title,
}: AppSidebarMiscProps) => {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className='justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Ellipsis className='h-4 w-4'/>
                                {title}
                            </div>
                            <ChevronUp className="h-4 w-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        className='w-(--radix-popper-anchor-width)'
                    >
                        {linkEntries.map(({ onClick, Icon, title }) => (
                            <DropdownMenuItem
                                key={title}
                                className='gap-2'
                                onClick={onClick}
                            >
                                <Icon className="h-4 w-4" />
                                {title}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
};

export { AppSidebarMisc };