import React, { useRef, Suspense } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from "../components/ui/toaster"
import { TailSpin } from 'react-loader-spinner'

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

const ModuleLoader = ({
    msg = "Inhalt wird geladen"
}) => {
    return (
        <div className='grid place-items-center h-full'>
            <div className='flex flex-col justify-center items-center'>
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
    );
}

export default MainLayout