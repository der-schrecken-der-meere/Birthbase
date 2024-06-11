import React, { useEffect, useState } from 'react'

const Switch = ({
    onClick = (isActive) => !isActive,
    id = "",
    initialState = false,
    activeElement = null,
    inactiveElement = null,
    className = "",
    button = () => "bg-[#000]",
    circle = () => "bg-[#fff]",
}) => {
    const [isActive, setIsActive] = useState(initialState);
    const handleClick = () => {
        setIsActive(onClick(isActive));
    }

    return (
        <button id={id} onClick={handleClick} className={`${button(isActive)} p-1.5 ${className} transition-colors relative flex items-center justify-between gap-2.5 rounded-full `}>
            <div className={`${isActive ? "opacity-100" : "opacity-0"} ${activeElement?.props?.parent && activeElement.props.parent}`}>
                {activeElement}
            </div>
            <div className={`${!isActive ? "opacity-100" : "opacity-0"} ${inactiveElement?.props?.parent && inactiveElement.props.parent}`}>
                {inactiveElement}
            </div>
            <div className={`transition-all h-full top-0 absolute ${!isActive ? "left-0 translate-x-0" : "left-full -translate-x-full"} p-1.5`}>
                <div className={`${circle(isActive)} rounded-full h-full aspect-square`}></div>
            </div>
        </button>
    )
}

export default Switch