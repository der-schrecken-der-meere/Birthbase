import React from 'react'
import styles from "./singleRipple.module.css";

const SingleRipple = ({
    style = {},
    durationScale = 600,
    durationFade = 200,
    isActive = true,
}) => {    
    const styleVariables = {
        "--durationScale": `${durationScale}ms`,
        "--durationFade": `${durationFade}ms`,
    };

    console.log(isActive);
    
    return (
        <div style={{...style, ...styleVariables}} className={`absolute rounded-full bg-black scale-0 ${isActive ? `${styles.rippleScale} [animation-duration:var(--durationScale)]` : `${styles.rippleFade} [animation-duration:var(--durationFade)]`} -z-10`}></div>
    )
}

export default SingleRipple