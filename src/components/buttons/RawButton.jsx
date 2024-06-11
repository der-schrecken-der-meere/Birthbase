import React, { useEffect, useRef } from 'react'

const RawButton = ({
    href = "",
    text = "",

    disabled = false,
    isLoading = false,
    clickAnimation = false,
    
    leftIcon = null,
    rightIcon = null,
    loader = null,

    style = {},

    clickClassName = "",
    loaderClassName = "",
    wrapper = () => "",
    className = () => "",

    onClick = () => {},
}) => {
    const defaultLoader = <div className={`border-2 border-y-[transparent] rounded-full animate-spin w-4 h-4 ${loaderClassName}`}></div>;
    const innerContent = <>
        {leftIcon}
        {text && <span className="capitalize text-nowrap">{text}</span>}
        {rightIcon}
        {isLoading && (
            <div className='absolute top-0 left-0 w-full h-full border-r-inherit bg-inherit border-inherit flex items-center justify-center rounded-[inherit]'>
                {loader ? loader : defaultLoader}
            </div>
        )}
    </>

    const buttonRef = useRef();

    useEffect(() => {
        if (clickAnimation) {
            const mousedown = (e) => {console.log(e)}
            const mouseup = (e) => {console.log(e)}
            buttonRef.current.addEventListener("mousedown", mousedown);
            buttonRef.current.addEventListener("mouseup", mouseup);
            return () => {
                buttonRef.current.removeEventListener("mousedown", mousedown);
                buttonRef.current.removeEventListener("mouseup", mouseup);
            }    
        }
    }, []);

    return (
        <div className={`${wrapper(disabled)}`}>
            {
                href ? 
                <a className={`relative ${className(disabled)}`} style={style} href={href} onClick={onClick} ref={buttonRef}>
                    {innerContent}
                </a>
                :
                <button className={`relative ${className(disabled)}`} style={style} disabled={disabled} onClick={onClick} ref={buttonRef}>
                    {innerContent}
                </button>        
            }
        </div>
    )
}

export default RawButton