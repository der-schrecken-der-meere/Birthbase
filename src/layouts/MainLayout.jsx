import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col text-sans overflow-hidden text-main-text">
            <main className="px-5 py-2.5 flex flex-col gap-2.5 overflow-auto flex-1 relative">
                <Outlet/>
            </main>
            <Toaster/>
            <Navbar/>
        </div>
    )
}

export default MainLayout