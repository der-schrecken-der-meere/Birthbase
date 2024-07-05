import React, { useRef } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

const MainLayout = () => {

    const mainRef = useRef(null);

    return (
        <div className="h-screen flex flex-col text-sans overflow-hidden text-main-text">
            <main ref={mainRef} className="px-5 py-2.5 flex flex-col gap-2.5 overflow-auto flex-1 relative">
                <Outlet context={{ mainRef }}/>
            </main>
            <Toaster/>
            <Navbar/>
        </div>
    )
}

export default MainLayout