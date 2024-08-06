import React, {
    useRef,
    Suspense,
} from 'react'
import Navbar from '@/components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { TailSpin } from 'react-loader-spinner'
import { useSelector } from 'react-redux'
import { getMediaScreen } from '../store/mediaType/mediaTypeSlice'
import type { RootState } from '@/store/store'
// import anime from 'animejs'

const MainLayout = () => {

    const mainRef = useRef(null);

    return (
        <div
            className={`
                h-screen text-sans text-main-text
                grid grid-rows-[minmax(0,1fr)_minmax(0,6rem)] 
                md:grid-rows-1 md:grid-cols-[220px_minmax(0,1fr)]
            `}
        >
            <main className="relative overflow-auto md:col-start-2 md:col-end-3 md:row-start-1">
                <div
                    ref={mainRef}
                    className='px-5 py-2.5 h-full flex flex-col gap-2.5 md:max-w-[1024px] md:mx-auto'
                >
                    <Suspense fallback={
                        <ModuleLoader/>
                    }>
                        <Outlet context={{ mainRef }}/>
                    </Suspense>
                </div>
                <Toaster/>
            </main>
            <Navigation className="md:col-start-1 md:col-end-2"/>
        </div>
    )
}

interface I_Navigation {
    className?: string;
}

const Navigation = ({
    className,
}: I_Navigation) => {
    const lg = useSelector((state: RootState) => {
        const screens = state.mediaType.screens;
        return getMediaScreen("md", screens)?.screen?.isActive as boolean;
    });
    
    return <Navbar orientation={lg ? "vertical" : "horizontal"} className={className}/>;
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

interface I_ModuleLoader {
    msg?: string;
}

export const ModuleLoader = ({
    msg = "Inhalt wird geladen"
}: I_ModuleLoader) => {
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