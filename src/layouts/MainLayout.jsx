import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        <div className="h-screen flex flex-col text-sans overflow-hidden text-main-text">
            <Navbar/>
            <Outlet/>
        </div>
    )
}

export default MainLayout