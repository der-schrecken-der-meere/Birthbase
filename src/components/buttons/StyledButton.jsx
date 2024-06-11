import React, { useEffect } from 'react'
import RawButton from './RawButton'

const StyledButton = ({
    onClick = (e) => {console.log(e)},

    clickAnimation = false,

    loader = null,
    
    backgroundColor = "#fff",
    textColor = "#000",
    borderColor = "#000",
    defaultLoaderColor = "#000",
}) => {
    const style = {
        "--bg": backgroundColor,
        "--border": borderColor,
        "--text": textColor,
    };

    if (!loader) style["--loader"] = defaultLoaderColor;

    if (clickAnimation) {
        useEffect(() => {

        }, []);
    }

    return (
        <RawButton
            loaderClassName='border-[var(--loader,black)]'
            style={style}
            className={(disabled) => `transition-colors px-4 py-2 text-[var(--text)] bg-[var(--bg)] rounded-lg w-min h-min ${disabled && "bg-[hsl(from_var(--bg)_h_s_50%)] cursor-not-allowed"} hover:bg-[hsl(from_var(--bg)_h_s_calc(l_-_0.1))] active:bg-[hsl(from_var(--bg)_h_s_calc(l_-_0.2))] pointer-events-none`}
            text='Hallo'
            onClick={onClick}
            isLoading={false}
            disabled={false}
            loader={loader}
            clickAnimation={true}
        />
    )
}

export default StyledButton