import { type HTMLAttributes, Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom';

import { Test_overlay } from '../test/test_overlay'
import { CMDK } from '../singletons/CMDK';
import { MobileLowerNavbar } from '../navigation/MobileNavigation'
import { UpperNavbar } from '../navigation/Navigation';
import { AppSidebar } from '../Sidebar'
import { SidebarProvider, useSidebar } from '../ui/sidebar';

import { useUpdateStore } from '@/stores/use_update_store'

import { useShortcuts } from '../../hooks/core/use_shortcuts';
import { OnlyTauri } from '../OnlyTauri';

const Updater = lazy(() => import("../updater/Updater"));

const MainLayout = () => {

    useShortcuts();

    const isAvailable = useUpdateStore((state) => state.isAvailable);

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
                    {isAvailable &&
                        <OnlyTauri osTypes={['windows', 'macos', 'linux']}>
                            <Suspense fallback={null}>
                                <Updater/>
                            </Suspense>
                        </OnlyTauri>
                    }
                    <MobileNav className='shrink-0 h-14 border-t' />
                </main>
            </SidebarProvider>
        </>
    );
};

const MobileNav = (props: HTMLAttributes<HTMLDivElement>) => {
    
    const { isMobile } = useSidebar();

    return (isMobile
        ? <MobileLowerNavbar {...props} />
        : null
    );
};

export default MainLayout;