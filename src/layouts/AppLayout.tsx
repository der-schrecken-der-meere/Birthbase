import { AppSidebarProvider } from "@/features/navigation/components/AppSidebarProvider";
import { CMDKSuspense } from "@/features/navigation/components/CMDKSuspense";
import { LowerNavbar } from "@/features/navigation/components/LowerNavbar";
import { UpperNavbar } from "@/features/navigation/components/UpperNavbar";
import { useShortcuts } from "@/hooks/core/use_shortcuts";
import { Outlet } from "react-router-dom";

let UpdaterSuspense = null;
if (__TAURI_IS_DESKTOP__) {
    UpdaterSuspense = await import("@/features/__tauri__/__desktop__/updater/components/UpdaterSuspense").then(module => module.UpdaterSuspense);
}

const AppLayout = () => {

    useShortcuts();

    return (
        <>
            <CMDKSuspense/>
            <AppSidebarProvider>
                <main className='relative @container w-full flex flex-col *:px-4 h-full'>
                    <UpperNavbar className="shrink-0 border-b" />
                    <div className='flex-1 w-full flex flex-col overflow-hidden py-2 max-w-[100vw] md:max-w-[64rem] md:mx-auto @container'>
                        <Outlet />
                    </div>
                    <LowerNavbar className="shrink-0 h-14 border-t"/>
                </main>
            </AppSidebarProvider>
            {(UpdaterSuspense) && (
                <UpdaterSuspense/>
            )}
        </>
    );
};

export { AppLayout };