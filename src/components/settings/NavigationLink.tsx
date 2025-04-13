import type { NavigationLinkProps } from "./types";

import { NavLink } from "react-router-dom";
import { NavigationEntryCore } from "./core/NavigationEntryCore";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A link that resembles a navigation entry.
 * 
 * If this element is clicked, it will navigate to the given path.
 * 
 * @example
 * ```tsx
 * <NavigationLink
 *   to="/path/to/navigate"
 *   icon={<Icon />}
 *   caption="This is a caption or description"
 * >
 *   This is a title
 * </NavigationLink>
 * ```
 */
const NavigationLink = ({
    to,
    className,
    ...props
}: NavigationLinkProps) => {
    return (
        <NavLink
            to={to}
            relative="path"
        >
            <NavigationEntryCore
                className={cn(
                    'rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50"',
                    className
                )}
                actionNode={<ChevronRight className='mx-2 w-4 h-4'/>}
                {...props}
            />
        </NavLink>
    );
};

export { NavigationLink };