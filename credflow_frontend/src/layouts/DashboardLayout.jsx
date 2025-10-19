import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/authentication/context/AuthContext';
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';
import Footer from '@/components/ui/Footer';

const DashboardLayout = () => {
    const { user } = useAuth(); 
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />
            <div className="flex flex-1">
                {user && !isAuthPage && <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />}
                <main className={`flex flex-col py-4 flex-1 mt-16 transition-all duration-500 ${user && !isAuthPage 
                        ? (isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64') : ''}`}>
                    <div className={`flex-grow ${isAuthPage ? 'p-0' : 'p-4 md:p-6'}`}>
                        <Outlet />
                    </div>
                    {!isAuthPage && user && <Footer />}
                </main>
            </div>
            </div>
    );
};

export default DashboardLayout;