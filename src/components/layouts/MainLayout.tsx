import {
    HTMLAttributes,
    Suspense,
    lazy,
} from 'react'

import { Outlet } from 'react-router-dom'

import { AppSidebar } from '../Sidebar'

import { useSelector } from 'react-redux'
import { type RootState } from '../../store/store'

import { isTauri } from '@tauri-apps/api/core';



import { CMDK } from '../../components/singletons/CMDK';

import useShortcuts from '../../hooks/useShortcuts';
import { useDeviceSize } from '../../hooks/useDeviceSize';

import { SidebarProvider, useSidebar } from '../ui/sidebar';
import { UpperNavbar } from '../navigation/Navigation';
import { MobileLowerNavbar } from '../navigation/MobileNavigation'
import { Test_overlay } from '../test/test_overlay'

const Updater = lazy(() => import("../../components/tauri/Updater"));

const MainLayout = () => {
    const updateState = useSelector((state: RootState) => state.tauri.updateInfo.updateState);

    useShortcuts();

    // useDeviceSize({});

    return (
        <>
            {/* <Test_overlay/> */}
            <CMDK/>
            <SidebarProvider className='h-svh'>
                <AppSidebar />
                <main className='relative @container w-full flex flex-col *:px-4 h-full'>
                    <UpperNavbar className='shrink-0 border-b' />
                    <div className='flex-1 w-full flex flex-col overflow-hidden py-2 max-w-[100vw] md:max-w-[1024px] md:mx-auto @container'>
                        <Outlet />
                    </div>
                    {/* <CustomSidebarTrigger /> */}
                    {/* <div ref={mainRef} className='h-full max-w-[100vw] md:max-w-[1024px] md:mx-auto'> */}
                        {/* <Outlet context={{ mainRef }}/> */}
                    {/* </div> */}
                    {(isTauri() && updateState === "available") && 
                        <Suspense fallback={null}>
                            <Updater/>
                        </Suspense>
                    }
                    <MobileNav className='shrink-0 h-14 border-t' />
                </main>
            </SidebarProvider>
        </>
    )
};

const MobileNav = (props: HTMLAttributes<HTMLDivElement>) => {
    
    const { isMobile } = useSidebar();

    return (isMobile
        ? <MobileLowerNavbar {...props} />
        : null
    );
};

export default MainLayout