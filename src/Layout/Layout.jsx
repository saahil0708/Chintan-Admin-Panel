import { useState } from "react";
import Navbar from "../Components/Global/Navbar";
import Sidebar from "../Components/Global/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex font-[Poppins] min-h-screen w-full bg-gray-50">
            {/* Sidebar - fixed on both mobile and desktop */}
            <div className={`fixed inset-y-0 z-30 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
                <Sidebar 
                    collapsed={!isSidebarOpen} 
                    toggleSidebar={toggleSidebar} 
                />
            </div>
            
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={toggleSidebar}
                />
            )}
            
            {/* Main content - with padding to account for sidebar */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-20 transition-all duration-300 w-full">
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-4 w-full pt-20">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}