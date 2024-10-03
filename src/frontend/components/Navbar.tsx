import { useMemo } from 'react';
import { MdMenu } from "react-icons/md";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/frontend/components/ui/navigation-menu';
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

import { Search } from 'lucide-react';
import navigationList, { type NavSection } from '@/globals/constants/nav_entries';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Logo } from './Logo';

interface I_CoreNavbar extends React.HTMLAttributes<HTMLDivElement> {}

/** Basic Wrapper */
const CoreNavbar = ({
    className,
    children,
    ...props
}: I_CoreNavbar) => {
    return (
        <div
            className={cn(
                'flex h-full w-full',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

const VerticalNavbar = ({
    children,
    className,
    ...props
}: I_CoreNavbar) => {

    const onClick = () => {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", ctrlKey: true }));
    }

    return (
        <CoreNavbar
            className={cn(
                "flex-col p-6 pr-2 space-y-2",
                className
            )}
            {...props}
        >
            <div className='flex mb-2 items-center'>
                <NavLink
                    to="/"
                    className="inline-flex items-center w-max"
                >
                    <Logo size={24}/>
                    <span className="font-semibold tracking-wide ml-2">Birthbase</span>
                </NavLink>
                <Button
                    variant="ghost"
                    size="icon"
                    className='ml-auto'
                    onClick={onClick}
                >
                    <Search size={16}/>
                </Button>
            </div>
            <ScrollArea
                className='pr-2 w-full h-full'
            >
                <NavigationMenu
                    orientation="vertical"
                    className="max-h-full flex-col justify-start items-start"
                >
                    <NavigationMenuList
                        className="flex-col justify-start items-start h-full space-x-0 min-w-40"
                    >
                        {children}
                    </NavigationMenuList>
                </NavigationMenu>
            </ScrollArea>
        </CoreNavbar>
    );
}

const Navbar = ({
    ...props
}: I_CoreNavbar) => {
    return (
        <VerticalNavbar
            {...props}
        >
            <NavList
                list={navigationList}
            />
        </VerticalNavbar>
    );
};

const MobileNavbar = ({
    className,
    ...props
}: Omit<I_CoreNavbar, "children">) => {

    const entries = useMemo(() => {
        return ["home", "settings"].map((str) => (
            navigationList.find((item) => item?.id === str) as NavSection
        ))        
        .filter((navEle) => {
            return !navEle ? false : navEle;
        });
    }, []);

    return (
        <CoreNavbar
            className={cn(
                'py-2',
                className
            )}
            {...props}
        >
            <NavigationMenu>
                <NavigationMenuList className="justify-between w-screen space-x-0">
                    <NavigationMenuItem className='flex-auto grid place-items-center md:flex-initial'>
                        <Drawer direction="left">
                            <DrawerTrigger
                                aria-label="open-navigation"
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    "h-full flex gap-2 px-4 py-2 group"
                                )}
                            >
                                <MdMenu size={32} />
                            </DrawerTrigger>
                            <DrawerContent
                                direction="left"
                                className='rounded-none border-none rounded-r-[10px]'
                            >
                                <DrawerHeader
                                    className='p-0'
                                >
                                    <DrawerTitle 
                                        className="hidden"
                                    >
                                        Navigationsmenü
                                    </DrawerTitle>
                                    <DrawerDescription
                                        className="hidden"
                                    >
                                        Vollständige Navigationsansicht
                                    </DrawerDescription>
                                </DrawerHeader>
                                <Navbar/>
                            </DrawerContent>
                        </Drawer>
                    </NavigationMenuItem>
                    {entries.map(e => (
                        <NavigationLink
                            key={e.id}
                            to={e.href}
                            ariaLabel={e.ariaLabel}
                        >
                            {e.icon(32)}
                        </NavigationLink>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </CoreNavbar>
    );
}

interface I_NavigationLink {
    ariaLabel: string,
    children: React.ReactNode,
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
            className={cn(
                "flex-auto grid place-items-center md:flex-initial",
                className
            )}
        > 
            <NavLink
                to={to}
                className={({ isActive }) => cn(
                    navigationMenuTriggerStyle(),
                    "h-auto flex gap-2",
                    (isActive && "bg-primary text-primary-foreground"),
                    linkClass
                )}
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
                <h4
                    className='mb-1'
                >
                    <NavLink
                        to={data.href}
                        aria-label={data.ariaLabel}
                        className={({ isActive }) => cn(
                            linkClass(),
                            "flex gap-2 font-semibold",
                            isActive && "bg-primary text-primary-foreground"
                        )}
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

export { Navbar, MobileNavbar }

export default Navbar