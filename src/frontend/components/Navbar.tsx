import { useMemo } from 'react';
import { MdMenu } from "react-icons/md";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/frontend/components/ui/navigation-menu';
import { Input } from '@/frontend/components/ui/input';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from '@/frontend/components/ui/drawer';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

import navigationList, { type NavSection } from '@/globals/constants/nav_entries';

interface I_Navbar {
    orientation?: "horizontal"|"vertical";
    className?: string;
}

const Navbar = ({
    orientation = "horizontal",
    className,
}: I_Navbar) => {

    const mobileNav = useMemo(() => {
        return ["home", "settings"].map((str) => (
            navigationList.find((item) => item?.id === str) as NavSection
        ))        
        .filter((navEle) => {
            return !navEle ? false : navEle;
        });
    }, []);

    return (
        <NavigationMenu orientation={orientation} 
            className={cn(
                "border-t-2 md:border-t-0 md:border-r-2 md:justify-start max-w-none md:block",
                className
            )}
        >
            <NavigationMenuList 
                className={cn(
                    "w-screen py-2",
                    orientation === "vertical" && 
                        "flex-col w-auto justify-start items-start py-4 h-screen space-x-0 space-y-4 mx-4"
                )}
            >
                {orientation !== "vertical" ? (
                    <>
                        <NavigationMenuItem
                            className="flex-auto grid place-items-center md:flex-initial"
                        >
                            <Drawer direction="left">
                                <DrawerTrigger
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "h-auto flex gap-2 px-4 py-2"
                                    )}
                                >
                                    <MdMenu size={40} />
                                </DrawerTrigger>
                                <DrawerContent direction="left">
                                    <DrawerHeader>
                                        <DrawerTitle 
                                            className={"hidden"}
                                        >
                                            Navigationsmenü
                                        </DrawerTitle>
                                        <DrawerDescription
                                            className={"hidden"}
                                        >
                                            Suchen sie nach allem
                                        </DrawerDescription>
                                        <Input
                                            placeholder="Suche..."
                                            className="max-w-sm"
                                            id="search"
                                            type="search"
                                        />
                                    </DrawerHeader>
                                    <NavList list={navigationList} />
                                </DrawerContent>
                            </Drawer>
                        </NavigationMenuItem>
                        {mobileNav.map((e, i) => (
                            <NavigationLink
                                key={i}
                                to={e.href}
                                ariaLabel={e.ariaLabel}
                            >
                                {e.icon()}
                                <span className={cn(
                                    orientation === 'horizontal' && "hidden"
                                )}>
                                    {e.text}
                                </span>
                            </NavigationLink>
                        ))}
                    </>
                ) : (
                    <NavList list={navigationList} />
                )}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

interface I_NavigationLink {
    ariaLabel: string,
    children: React.ReactElement[],
    className?: string,
    linkClass?: string,
    to: string,
}

const NavigationLink = ({
    className,
    children,
    to,
    linkClass,
    ariaLabel
}: I_NavigationLink) => {
    return (
        <NavigationMenuItem
            className={cn("flex-auto grid place-items-center md:flex-initial", className)}
        > 
            <NavLink
                to={to}
                className={({ isActive }) => cn(navigationMenuTriggerStyle(), "h-auto flex gap-2", (isActive && "bg-primary text-primary-foreground"), linkClass)}
                aria-label={ariaLabel}
            >
                {children}
            </NavLink>
        </NavigationMenuItem>
    );
}

const linkClass = () => "px-2 py-1 text-sm rounded-md bg-background transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"

interface I_NavList {
    list: NavSection[];
}

const NavList = ({
    list
}: I_NavList) => {
    return (
        list.map(data => (
            <section 
                key={data.id}
                className='w-full flex flex-col'
            >
                <h4>
                    <NavLink
                        to={data.href}
                        aria-label={data.ariaLabel}
                        className={({ isActive }) => cn(linkClass(), "flex gap-2 font-semibold mb-1", isActive && "bg-primary text-primary-foreground")}
                    >
                        {data.text}
                    </NavLink>
                </h4>
                {data.entries?.length && data.entries.length > 0 && (data.entries.map((e, i) => (
                    <NavLink
                        key={i}
                        to={`${data.href}${e.href}`}
                        aria-label={e.ariaLabel}
                        className={({ isActive }) => cn(
                            linkClass(),
                            "text-muted-foreground",
                            isActive && "text-accent-foreground font-medium"
                        )}
                    >
                        {e.text}
                    </NavLink>
                )))}
            </section>
        ))
    );
}

export default Navbar