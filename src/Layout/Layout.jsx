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
            {/* Fixed Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40">
                <Navbar toggleSidebar={toggleSidebar} />
            </div>
            
            {/* Fixed Sidebar - positioned below navbar */}
            <div 
                className={`
                    fixed top-16 bottom-0 z-30 
                    transition-all duration-300 
                    ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}
            >
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
            
            {/* Main content - with padding to account for both fixed elements */}
            <div className="flex-1 flex flex-col overflow-hidden pt-16 md:ml-20 transition-all duration-300 w-full">
                <main className="flex-1 overflow-y-auto p-4 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}