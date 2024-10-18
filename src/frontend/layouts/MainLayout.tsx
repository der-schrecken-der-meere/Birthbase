import {
    useRef,
    Suspense,
    lazy,
} from 'react'
import Navbar, { MobileNavbar } from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { type RootState } from '../store/store'
import { isTauri } from '../../globals/constants/environment'
import DeviceSize from '../components/DeviceSize'
import { mediaScreens } from '@/globals/constants/media_screens'
import useShortcuts from '../hooks/useShortcuts'
import CMDK from '../components/CMDK'

const Updater = lazy(() => import("../components/tauri/Updater"));

const MainLayout = () => {
    const mainRef = useRef(null);
    const updateState = useSelector((state: RootState) => state.tauri.updateInfo.updateState);

    useShortcuts();

    return (
        <>
            <CMDK/>
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
                </main>
                <div className="md:col-start-1 md:col-end-2 shadow-[0_0_10px_-5px_hsl(var(--primary))]">
                    <Navbar
                        className='hidden md:flex'
                    />
                    <MobileNavbar
                        className='md:hidden'
                    />
                </div>
                {(isTauri && updateState === "available") && 
                    <Suspense fallback={null}>
                        <Updater/>
                    </Suspense>
                }
            </div>
        </>
    )
}

export default MainLayout