import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayouts = () => {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
         </main>
      </div>
    );
  };

export default MainLayouts
