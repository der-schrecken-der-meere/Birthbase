import {
    useRef,
    Suspense,
} from 'react'
import Navbar from '@/components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { useDispatch, useSelector } from 'react-redux'
import { getMediaScreen } from '../store/mediaType/mediaTypeSlice'
import { AppDispatch, type RootState } from '@/store/store'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { isTauri } from '@/constants/environment'
import { Button } from '@/components/ui/button'
import { installUpdate } from '@/backend/updater'
import { Progress } from '@/components/ui/progress'
import BirthbaseSVG from '@/components/Birthbase'
// import anime from 'animejs'

const MainLayout = () => {
    const mainRef = useRef(null);

    return (
        <div
            className={`
                h-screen text-sans text-main-text
                grid grid-rows-[minmax(0,1fr)_max-content] 
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
            <Updater/>
        </div>
    )
}

interface I_Navigation {
    className?: string;
}

const Updater = () => {
    const updateState = useSelector((state: RootState) => state.tauri.updateState);
    const update = useSelector((state: RootState) => state.update);
    const dispatch = useDispatch<AppDispatch>();

    return (
        (isTauri && updateState === "available") ? (
            <Dialog defaultOpen={true}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update wurde gefunden</DialogTitle>
                        <DialogDescription>Updaten Sie die Applikation auf die neuste Version</DialogDescription>
                    </DialogHeader>
                    {update.downloading ? (
                        <Progress value={update.progress} />
                    ) : (
                        <div className='flex items-center justify-between'>
                            <Button onClick={() => installUpdate(dispatch)}>Herunterladen</Button>
                            <DialogClose asChild>
                                <Button variant="secondary">Abbrechen</Button>
                            </DialogClose>
                        
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        ): null
    );
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

interface I_ModuleLoader {
    msg?: string;
}

export const ModuleLoader = ({
    msg = "Inhalt wird geladen"
}: I_ModuleLoader) => {
    const { bgColor, color } = (() => {
        let cs = getComputedStyle(document.body);
        return {
            bgColor: cs.getPropertyValue("--primary"),
            color: cs.getPropertyValue("--primary-foreground"),
        }
    })();

    return (
        <div className='relative h-full w-full'>
            <div className='grid place-items-center h-full'>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <BirthbaseSVG scale={1} color={`hsl(${color})`} bgColor={`hsl(${bgColor})`}/>
                    {/* <span>{msg}</span> */}
                </div>
            </div>
        </div>
    );
}

export default MainLayout