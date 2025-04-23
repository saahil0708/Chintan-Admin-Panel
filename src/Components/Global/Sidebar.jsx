import { useState } from 'react';
import { Home, Newspaper, FolderPlus, Eye, Image, Settings, LogOut, Menu, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar({ collapsed, toggleSidebar }) {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className={`
      fixed md:relative
      h-screen 
      font-[Poppins] 
      bg-gradient-to-b from-[#a31727] to-[#8a131f] 
      text-white 
      transition-all duration-300 
      ${collapsed ? 'w-20' : 'w-72'} 
      flex flex-col shadow-lg 
      z-30
      ${collapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
    `}>
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/20 relative z-10">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <Newspaper size={18} className="text-[#a31727]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">NEWSDESK</h1>
          </div>
        )}
        <button 
          onClick={toggleSidebar} 
          className="p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Main Menu Section */}
        <div className={`${!collapsed ? 'mb-4' : 'mb-2'}`}>
          {!collapsed && <p className="text-xs uppercase text-white/50 px-3 py-2 font-medium">Main Menu</p>}
          <ul className="space-y-1">
            {[
              { path: '/', icon: Home, name: 'Dashboard', key: 'dashboard' },
              { path: '/news-management', icon: Newspaper, name: 'News Management', key: 'news' },
              { path: '/manage-category', icon: FolderPlus, name: 'Categories', key: 'categories' },
              { path: '/news-list', icon: Eye, name: 'News List', key: 'newslist' },
              { path: '/upload-images', icon: Image, name: 'Media Library', key: 'images' },
            ].map((item) => (
              <li key={item.key} onClick={() => setActiveItem(item.key)}>
                <Link 
                  to={item.path}
                  className={`
                    flex items-center 
                    ${collapsed ? 'justify-center' : ''} 
                    px-3 py-3 rounded-lg 
                    hover:bg-white/10 transition-colors 
                    ${activeItem === item.key ? 'bg-white/20 shadow-lg' : ''}
                  `}
                >
                  <div className={`
                    ${activeItem === item.key ? 'bg-white text-[#a31727]' : 'bg-white/10'} 
                    p-2 rounded-lg transition-colors
                  `}>
                    <item.icon size={18} />
                  </div>
                  {!collapsed && <span className="ml-3 font-medium">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* System Menu Section */}
        <div>
          {!collapsed && <p className="text-xs uppercase text-white/50 px-3 py-2 font-medium">System</p>}
          <ul className="space-y-1">
            {[
              { path: '/settings', icon: Settings, name: 'Settings', key: 'settings' },
              { 
                path: '/notifications', 
                icon: Bell, 
                name: 'Notifications', 
                key: 'notifications',
                badge: true,
                badgeCount: 3
              },
            ].map((item) => (
              <li key={item.key} onClick={() => setActiveItem(item.key)}>
                <Link 
                  to={item.path}
                  className={`
                    flex items-center 
                    ${collapsed ? 'justify-center' : ''} 
                    px-3 py-3 rounded-lg 
                    hover:bg-white/10 transition-colors 
                    ${activeItem === item.key ? 'bg-white/20 shadow-lg' : ''}
                  `}
                >
                  <div className={`
                    ${activeItem === item.key ? 'bg-white text-[#a31727]' : 'bg-white/10'} 
                    p-2 rounded-lg transition-colors relative
                  `}>
                    <item.icon size={18} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#a31727]"></span>
                    )}
                  </div>
                  {!collapsed && (
                    <div className="flex justify-between items-center flex-1 ml-3">
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="bg-white text-[#a31727] text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badgeCount}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-4 ${collapsed ? 'px-2' : 'px-6'} border-t border-white/20 mt-auto`}>
        <button className={`
          flex items-center w-full 
          ${collapsed ? 'justify-center' : ''} 
          px-3 py-2 rounded-lg 
          hover:bg-white/10 transition-colors 
          text-white/80 hover:text-white
        `}>
          <LogOut size={18} />
          {!collapsed && <span className="ml-3 font-medium">Log Out</span>}
        </button>
        {!collapsed && (
          <p className="text-xs text-white/50 mt-3 text-center">NewsDesk Admin v2.5</p>
        )}
      </div>
    </div>
  );
}