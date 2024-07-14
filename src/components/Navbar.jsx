import React, { useState } from 'react'
import { 
    MdOutlineGroups,
    MdOutlineCelebration,
    MdMenu,
    MdOutlineCottage
} from "react-icons/md";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import MdOutlineSettings from "../icons/MdOutlineSettings";
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {

    console.log("render");

    return (
        // <nav className='flex flex-col gap-5 w-full font-medium'>
        //     <ul className={`w-full absolute left-0 bottom-0 transition-all bg-nav-page duration-300 p-20/30 text-xl overflow-hidden ${open ? "h-full visible" : "h-0 invisible"}`}>
        //         <DynNavLink 
        //             className='py-[15px]'
        //             to='/my_birthdays'
        //             isStatic={true} 
        //             onClick={handleLinkClick}
        //             icon={<MdOutlineCelebration size={40}/>}
        //             title="Meine Geburtstage"
        //         />
        //         {/* <DynNavLink 
        //             className='py-[15px]' 
        //             isStatic={true} 
        //             icon={<MdOutlineGroups size={40}/>}
        //             title="Gruppengeburtstage"    
        //         /> */}
        //     </ul>
        //     <ul className='flex w-full justify-between p-10/60 border-t-nav-border border-t-2 bg-nav-bg lg:bg-nav-bg text-nav-icons relative'>
        //         <DynNavLink 
        //             to='#'
        //             link={false}
        //             onClick={handleMenuClick} 
        //             className={`lg:hidden ${open ? "text-nav-icons-active" : "lg:hover:text-nav-icons-hover"}`} 
        //             icon={<MdMenu size={40}/>} 
        //             hideText={true}
        //             title="Menü"
        //         />
        //         <DynNavLink 
        //             to='/'
        //             onClick={handleLinkClick}
        //             icon={<MdOutlineCottage size={40}/>} 
        //             hideText={true}
        //             title="Home"
        //         />
        //         <DynNavLink 
        //             to='/settings' 
        //             onClick={handleLinkClick}
        //             icon={<MdOutlineSettings size="40"/>} 
        //             hideText={true}
        //             title="Einstellungen"
        //         />
        //     </ul>
        // </nav>
        <NavigationMenu className="flex-initial border-t-2">
            <NavigationMenuList className="w-screen py-2">
                <NavigationMenuItem className="flex-auto grid place-items-center">
                    <NavigationMenuTrigger aria-label="open-second-navigation-menu" icon={false} className={"h-auto"}>
                        <MdMenu size={40}/>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className='w-screen py-2 px-4'>
                            <li className="flex">
                                <NavLink
                                    to="/my_birthdays"
                                    className={({ isActive }) => cn(navigationMenuTriggerStyle(), "flex h-auto gap-2 w-full justify-start py-2 items-center", (isActive && "bg-primary text-primary-foreground"))}
                                >
                                    <MdOutlineCelebration size={40}/><span>Meine Geburtstage</span>
                                </NavLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>                    
                </NavigationMenuItem>
                <NavigationMenuItem className="flex-auto grid place-items-center">
                    <NavLink
                        to="/" 
                        className={({ isActive }) => cn(navigationMenuTriggerStyle(), "h-auto", (isActive && "bg-primary text-primary-foreground"))}
                        aria-label='Return to the welcome site'
                    >
                        <MdOutlineCottage size={40}/>
                    </NavLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="flex-auto grid place-items-center">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => cn(navigationMenuTriggerStyle(), "h-auto", (isActive && "bg-primary text-primary-foreground"))}
                        aria-label='Go to the setting site'
                    >
                        <MdOutlineSettings size={40}/>
                    </NavLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default Navbar