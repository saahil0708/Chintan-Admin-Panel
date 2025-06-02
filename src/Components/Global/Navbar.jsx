import { useState } from 'react';
import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

import '../../App.css'

export default function Navbar({ toggleSidebar, sidebarCollapsed }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`bg-white font-[Poppins] shadow-md px-4 md:px-6 py-3 flex items-center justify-between h-16`}>
      {/* Left Section - Logo and Menu Toggle */}
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 mr-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center">
          <div className="w-8 h-8 bg-[#a31727] rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden md:block">
            NEWS<span className="text-[#a31727]">DESK</span>
          </h1>
        </div>
      </div>
      
      {/* Middle Section - Search */}
      <div className="hidden md:block flex-1 max-w-xl px-8">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for articles, categories, or media..." 
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#a31727]/20 focus:border-[#a31727] transition-all"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      
      {/* Right Section - Tools */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle */}
        <button 
          onClick={toggleDarkMode} 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative transition-all"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#a31727] rounded-full"></span>
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                  <span className="text-xs font-medium bg-[#a31727] text-white px-2 py-0.5 rounded-full">3 new</span>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-gray-50 border-l-2 border-[#a31727]">
                  <p className="text-sm font-medium text-gray-800">Breaking News Published</p>
                  <p className="text-xs text-gray-500">Your article "Global Markets Update" is now live</p>
                  <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                </div>
                
                <div className="px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-800">New User Registration</p>
                  <p className="text-xs text-gray-500">John Doe registered as an editor</p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
                
                <div className="px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-800">System Update</p>
                  <p className="text-xs text-gray-500">Platform update to v2.5 completed successfully</p>
                  <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                </div>
              </div>
              
              <div className="px-4 py-2 border-t border-gray-100">
                <a href="#" className="text-xs text-[#a31727] font-medium hover:underline">View all notifications</a>
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Clerk User Button */}
        <div className="ml-1 font-[Poppins]">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  border: "2px solid #f3f4f6",
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  fontFamily: "Poppins",
                  "&:hover": {
                    boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                    fontFamily: "Poppins"
                  }
                },
                userButtonTrigger: {
                  "&:hover": {
                    backgroundColor: "rgba(243, 244, 246, 1)",
                    fontFamily: "Poppins"
                  },
                  "&:focus": {
                    boxShadow: "0 0 0 3px rgba(163, 23, 39, 0.2)",
                    fontFamily: "Poppins"
                  }
                },
                userButtonPopoverCard: {
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e5e7eb",
                  fontFamily: "Poppins"
                },
                userButtonPopoverActionButton: {
                  "&:hover": {
                    backgroundColor: "rgba(163, 23, 39, 0.1)",
                    fontFamily: "Poppins"
                  }
                },
                userButtonPopoverActionButtonText: {
                  color: "#374151",
                  fontFamily: "Poppins",
                  "&:hover": {
                    color: "#a31727",
                    fontFamily: "Poppins"
                  }
                },
                userButtonPopoverFooter: {
                  fontFamily: "Poppins",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid #e5e7eb"
                }
              }
            }}
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </div>
  );
}