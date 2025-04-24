import { useState, useEffect } from "react";
import Navbar from "../Components/Global/Navbar";
import Sidebar from "../Components/Global/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            // Close sidebar when switching to mobile
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };

        handleResize(); // Set initial state
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex font-[Poppins] min-h-screen w-full bg-gray-50 relative">
            {/* Fixed Sidebar */}
            <div 
                className={`
                    fixed top-0 left-0 bottom-0 z-30 
                    transition-all duration-300 
                    ${isSidebarOpen ? 'w-72' : 'w-20'}
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <Sidebar 
                    collapsed={!isSidebarOpen} 
                    toggleSidebar={toggleSidebar} 
                />
            </div>
            
            {/* Overlay for mobile */}
            {isSidebarOpen && isMobile && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20"
                    onClick={toggleSidebar}
                />
            )}
            
            {/* Main content area */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen && !isMobile ? 'md:ml-72' : 'md:ml-20'}`}>
                {/* Fixed Navbar - full width on mobile, adjusted on desktop */}
                <div className={`fixed top-0 z-40 w-full md:w-[calc(100%-5rem)] ${isSidebarOpen && !isMobile ? 'md:w-[calc(100%-18rem)]' : ''}`}>
                    <Navbar 
                        toggleSidebar={toggleSidebar} 
                        sidebarCollapsed={!isSidebarOpen}
                    />
                </div>
                
                {/* Main content - with padding for navbar */}
                <main className="flex-1 overflow-y-auto p-4 w-full pt-20">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}