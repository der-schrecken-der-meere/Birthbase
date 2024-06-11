import React, { useState } from 'react'
import DynNavLink from './DynNavLink'
import { 
    MdOutlineGroups,
    MdOutlineCelebration,
    MdMenu,
    MdOutlineCottage
} from "react-icons/md";
import MdOutlineSettings from "../icons/MdOutlineSettings";

const Navbar = ({className}) => {
    const [open, setOpen] = useState(false);
    const handleMenuClick = (e) => {
        setOpen(!open);
    }
    const handleLinkClick = (e) => {
        if (open) setOpen(!open);
    }

    return (
        <nav className='flex flex-col gap-5 bottom-0 left-0 w-full font-medium'>
            <ul className={`w-full absolute left-0 bottom-0 z-10 transition-all bg-nav-page duration-300 p-20/30 text-xl overflow-hidden ${open ? "h-screen visible" : "h-0 invisible"}`}>
                <DynNavLink 
                    className='py-[15px]'
                    to='/my_birthdays'
                    isStatic={true} 
                    onClick={handleLinkClick}
                    icon={<MdOutlineCelebration size={40}/>}
                    title="Meine Geburtstage"
                />
                {/* <DynNavLink 
                    className='py-[15px]' 
                    isStatic={true} 
                    icon={<MdOutlineGroups size={40}/>}
                    title="Gruppengeburtstage"    
                /> */}
            </ul>
            <ul className='flex absolute left-0 bottom-0 z-10 w-full justify-between p-10/60 border-t-nav-border border-t-2 bg-nav-bg lg:bg-nav-bg text-nav-icons'>
                <DynNavLink 
                    to='#'
                    link={false}
                    onClick={handleMenuClick} 
                    className={`lg:hidden ${open ? "text-nav-icons-active" : "lg:hover:text-nav-icons-hover"}`} 
                    icon={<MdMenu size={40}/>} 
                    hideText={true}
                    title="Menü"
                />
                <DynNavLink 
                    to='/'
                    onClick={handleLinkClick}
                    icon={<MdOutlineCottage size={40}/>} 
                    hideText={true}
                    title="Home"
                />
                <DynNavLink 
                    to='/settings' 
                    onClick={handleLinkClick}
                    icon={<MdOutlineSettings size="40"/>} 
                    hideText={true}
                    title="Einstellungen"
                />
            </ul>
        </nav>
    )
}

export default Navbar