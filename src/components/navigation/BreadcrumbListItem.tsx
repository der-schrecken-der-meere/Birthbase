import { BreadcrumbProps } from "@/stores/use_navbar_store";
import { BreadcrumbEllipsis, BreadcrumbLink } from "../ui/breadcrumb";
import { NavLink } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

const BreadcrumbListItem = ({
    type,
}: {
    type: BreadcrumbProps|BreadcrumbProps[]
}) => {
    return (
        !Array.isArray(type)
            ?   <BreadcrumbLink asChild>
                    <NavLink to={type.href}>
                        {type.display}
                    </NavLink>
                </BreadcrumbLink>
            :   <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center gap-1'>
                        <BreadcrumbEllipsis className='h-4 w-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                        {type.map((breadcrumb) => (
                            <DropdownMenuItem asChild key={breadcrumb.href}>
                                <NavLink to={breadcrumb.href}>
                                    {breadcrumb.display}
                                </NavLink>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
    );
};

export { BreadcrumbListItem };