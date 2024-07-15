import React, { useRef, Suspense, useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from "../components/ui/toaster"
import { TailSpin } from 'react-loader-spinner'
// import anime from 'animejs'

const MainLayout = () => {

    const mainRef = useRef(null);

    return (
        <div className="h-screen flex flex-col text-sans overflow-hidden text-main-text">
            <main className="overflow-auto flex-1 relative">
                <div ref={mainRef} className='px-5 py-2.5 h-full overflow-auto flex flex-col gap-2.5 '>
                    <Suspense fallback={
                        <ModuleLoader/>
                    }>
                        <Outlet context={{ mainRef }}/>
                    </Suspense>
                </div>
                
            </main>
            <Toaster/>
            <Navbar/>
        </div>
    )
}

// const SIZE = 50;

// const COLORS = [
//     "rgb(229, 57, 53)",
//     "rgb(76, 175, 80)",
//     "rgb(33, 216, 243)",
// ]

// const WholeRandom = (low, high) => Math.floor((Math.random() * high) + low);

// console.log(`hsl(${WholeRandom(1, 360)} ${WholeRandom(0, 50)}% ${WholeRandom(0, 50)}%)`)

// const createTile = (i, ref, col, row) => {

//     const onClick = (i) => {
//         anime({
//             targets: ref.current.children,
//             // scale: [
//             //     { value: 1.35, easing: "easeOutSine", duration: 250 },
//             //     { value: 1, easing: "easeInOutQuad", duration: 500 },
//             // ],
//             translateY: [
//                 { value: -10, easing: "easeOutSine", duration: 250 },
//                 { value: 0, easing: "easeInOutQuad", duration: 500 },
//             ],
//             // opacity: [
//             //     { value: 1, easing: "easeOutSine", duration: 250 },
//             //     { value: 0.5, easing: "easeInOutQuad", duration: 500 },
//             // ],
//             background: 
//             // COLORS[i % (COLORS.length)]
//             `hsl(${WholeRandom(1, 360)}, ${WholeRandom(0, 50)}%, ${WholeRandom(0, 50)}%)`
//             ,
//             delay: anime.stagger(50, {
//                 grid: [col, row],
//                 from: i
//             }),
//         })
//     }

//     return <div 
//     // className="outline outline-1 outline-white" 
//     // className='group cursor-crosshair rounded-full p-2 transition-colors hover:bg-slate-600 grid place-items-center'
//     onClick={() => onClick(i)} key={i}>
//         {/* <div className="h-2 w-2 rounded-full bg-gradient-to-b from-slate-700 to-slate-400 opacity-50 group-hover:from-indigo-600 group-hover:to-white">

//         </div> */}
//     </div>;
// }

const ModuleLoader = ({
    msg = "Inhalt wird geladen"
}) => {
    // const [columns, setColumns] = useState(Math.floor(document.body.clientWidth / SIZE))
    // console.log(document.body.clientHeight);
    // const [rows, setRows] = useState(Math.floor(document.body.clientHeight / SIZE))

    // const wrapperRef = useRef(null);

    // console.log(columns, rows);

    // useEffect(() => {
    //     const calcTiles = () => {
    //         setColumns(Math.floor(document.body.clientWidth / SIZE));
    //         setRows(Math.floor(document.body.clientHeight / SIZE));
    //     }
    //     window.addEventListener("resize", calcTiles)
    //     return () => {
    //         window.removeEventListener("resize", calcTiles);
    //     }
    // }, [rows, columns]);

    return (
        <div className='relative h-full w-full'>
            <div className='grid place-items-center h-full'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <TailSpin
                        color='currentColor'
                        height={64}
                        width={64}
                        ariaLabel='Loading'
                        strokeWidth={4}
                    />
                    <span>{msg}</span>    
                </div>
            </div>
            {/* <div ref={wrapperRef} style={{ "--cols": columns, "--rows": rows }} className='absolute left-0 top-0 h-full w-full grid grid-cols-[repeat(var(--cols),1fr)] grid-rows-[repeat(var(--rows),1fr)]'>
                {Array.from(Array(columns * rows)).map((tile, i) => (
                    createTile(i, wrapperRef, columns, rows)
                ))}
            </div>     */}
        </div>
    );
}

export default MainLayout