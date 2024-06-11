import React, { useEffect, useRef, useState } from 'react'
import SingleRipple from './SingleRipple';

const RippleEffect = ({
    durationScale = 600,
    durationFade = 1000,
}) => {
    const [ripples, setRipples] = useState([]);
    const rippleRef = useRef();

    console.log(ripples);

    const mouseUp = (e) => {
        console.log("up");
        setRipples((prev) => {
            prev[0].isActive = false;
            console.log(prev);
            return prev;
        })
        const st = setTimeout(() => {
            console.log("ende")
            setRipples((prev) => {
                prev.shift();
                console.log(prev);
                return prev;
            });
            clearTimeout(st);
        }, durationFade);
    }
    const mouseDown = (e) => {
        const br = rippleRef.current.getBoundingClientRect();
        const newRipple = {
            id: Date.now(),
            x: e.clientX - br.left,
            y: e.clientY - br.top,
            isActive: true,
        }
        console.log(newRipple);
        setRipples([...ripples, newRipple]);
    }

    useEffect(() => {
        rippleRef.current.addEventListener("mousedown", mouseDown);
        rippleRef.current.addEventListener("mouseup", mouseUp);
        return () => {
            rippleRef.current.removeEventListener("mousedown", mouseDown);
            rippleRef.current.removeEventListener("mouseup", mouseUp);
        }
    }, [])

    return (
        <div ref={rippleRef} className='absolute w-full h-full rounded-[inherit] z-0 [contain:content]'>
            {ripples.map((ripple) => <SingleRipple 
                    key={ripple.id}
                    durationFade={durationFade}
                    durationScale={durationScale}
                    isActive={ripple.isActive}
                    style={{
                        top: ripple.y - 25,
                        left: ripple.x - 25,
                        width: `${50}px`,
                        height: `${50}px`,
                    }}
                />
            )}
        </div>
    )
}

export default RippleEffect