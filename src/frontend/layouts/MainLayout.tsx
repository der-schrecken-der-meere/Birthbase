import {
    useRef,
    Suspense,
    lazy,
} from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '../components/ui/toaster'
import { useSelector } from 'react-redux'
import { getMediaScreen } from '../store/mediaType/mediaTypeSlice'
import { type RootState } from '../store/store'
import { isTauri } from '../../globals/constants/environment'
import DeviceSize from '../components/DeviceSize'
import { mediaScreens } from '@/globals/constants/media_screens'

const Updater = lazy(() => import("../components/tauri/Updater"));

const MainLayout = () => {
    const mainRef = useRef(null);
    const updateState = useSelector((state: RootState) => state.tauri.updateInfo.updateState);

    return (
        <>
            <DeviceSize mediaScreens={mediaScreens} />
            <div
                className={`
                    h-screen w-screen text-sans text-main-text
                    grid grid-rows-[minmax(0,1fr)_max-content] 
                    md:grid-rows-1 md:grid-cols-[13.75rem_minmax(0,1fr)]
                `}
            >
                <main className="relative md:col-start-2 md:col-end-3 md:row-start-1">
                    <div
                        ref={mainRef}
                        className='h-full max-w-[100vw] md:max-w-[1024px] md:mx-auto'
                    >
                        <Outlet context={{ mainRef }}/>
                    </div>
                    <Toaster/>
                </main>
                <Navigation className="md:col-start-1 md:col-end-2"/>
                {(isTauri && updateState === "available") && 
                    <Suspense fallback={null}>
                        <Updater/>
                    </Suspense>
                }
            </div>
        </>
        
    )
}

interface I_Navigation {
    className?: string;
}

const Navigation = ({
    className,
}: I_Navigation) => {
    const md = useSelector((state: RootState) => {
        const screens = state.mediaType.screens;
        return getMediaScreen("md", screens).value.isActive;
    });
    
    return <Navbar orientation={md ? "vertical" : "horizontal"} className={className}/>;
}

export default MainLayout