import { type HTMLAttributes, Suspense, lazy } from 'react'
import { Outlet } from 'react-router-dom';

// import { Test_overlay } from '../test/test_overlay'
import { UpperNavbar } from '../navigation/UpperNavbar';
import { AppSidebar } from '../Sidebar'
import { SidebarProvider, useSidebar } from '../ui/sidebar';

import { useUpdateStore } from '@/stores/use_update_store'

import { useShortcuts } from '../../hooks/core/use_shortcuts';
import { CMDKSuspense } from '../singletons/CMDKSuspense';
import { Skeleton } from '../ui/skeleton';

const MobileLowerNavbar = lazy(() => import('../navigation/MobileNavigation').then(module => ({ default: module.MobileLowerNavbar })));

let Updater = lazy(() => Promise.resolve({ default: () => <></> }));
if (__IS_TAURI__ && __TAURI_IS_DESKTOP__) {
    Updater = lazy(() => import("../__tauri__desktop__updater/Updater").then(module => ({ default: module.Updater })));
}

const MainLayout = () => {

    useShortcuts();

    const isAvailable = useUpdateStore((state) => state.isAvailable);

    return (
        <>
            {/* <Test_overlay/> */}
            <CMDKSuspense/>
            <SidebarProvider className='h-svh'>
                <AppSidebar />
                <main className='relative @container w-full flex flex-col *:px-4 h-full'>
                    <UpperNavbar className='shrink-0 border-b' />
                    <div className='flex-1 w-full flex flex-col overflow-hidden py-2 max-w-[100vw] md:max-w-[1024px] md:mx-auto @container'>
                        <Outlet />
                    </div>
                    {isAvailable &&
                        <Suspense fallback={null}>
                            <Updater/>
                        </Suspense>
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
        ? 
            <Suspense fallback={
                <div className='h-14 py-1 flex items-center justify-between'>
                    <Skeleton className='w-10 h-10' />
                    <Skeleton className='w-10 h-10' />
                    <Skeleton className='w-10 h-10' />
                    <Skeleton className='w-10 h-10' />
                    <Skeleton className='w-10 h-10' />
                </div>
            }>
                <MobileLowerNavbar {...props} />
            </Suspense>
        : null
    );
};

export default MainLayout;