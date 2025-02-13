import {
    HTMLAttributes,
    Suspense,
    lazy,
} from 'react'

import { Outlet } from 'react-router-dom'

import { AppSidebar } from '../Sidebar'

import { isTauri } from '@tauri-apps/api/core';

import useShortcuts from '../../hooks/useShortcuts';

import { SidebarProvider, useSidebar } from '../ui/sidebar';
import { UpperNavbar } from '../navigation/Navigation';
import { MobileLowerNavbar } from '../navigation/MobileNavigation'
import { Test_overlay } from '../test/test_overlay'
import { use_update_store } from '@/hooks/use_update_store'
import { CMDK } from '../singletons/CMDK';

const Updater = lazy(() => import("../updater/Updater"));

const MainLayout = () => {

    const update_available = use_update_store((state) => state.available);

    useShortcuts();

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
                    {update_available && 
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