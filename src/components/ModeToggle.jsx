import React, { useContext, useEffect, useState } from 'react'
import Switch from './Switch'
import MdOutlineSunny from "../icons/MdOutlineSunny";
import MdOutlineClearNight from "../icons/MdOutlineClearNight";
import { ThemeContext } from "./ThemeProvider";

const ModeToggle = ({ className, id }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Switch
            id={id}
            onClick={(isActive) => {
                toggleTheme()
                return !isActive;
            }}
            initialState={theme === "dark" ? true : false}
            className={className}
            activeElement={<MdOutlineClearNight size={24}/>}
            inactiveElement={<MdOutlineSunny size={24}/>}
            button={(isActive) => "bg-switch-bg text-switch-text"}
            circle={(isActive) => "bg-switch-text"}
        /> 
    )
}

export default ModeToggle