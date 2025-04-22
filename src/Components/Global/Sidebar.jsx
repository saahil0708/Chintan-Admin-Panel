import { useState, useEffect } from 'react';
import { 
  Home, 
  Newspaper, 
  FolderPlus, 
  LogOut, 
  Image as ImageIcon, 
  List, 
  Menu, 
  X, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Bell, 
  Settings,
  User,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react';

// Mock routes components - in a real app these would be imported from separate files
const Dashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <StatCard title="Total Articles" value="254" icon={<Newspaper size={24} />} color="bg-blue-500" />
      <StatCard title="Published Today" value="12" icon={<PlusCircle size={24} />} color="bg-green-500" />
      <StatCard title="Pending Review" value="8" icon={<Edit size={24} />} color="bg-yellow-500" />
    </div>
    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <ActivityItem user="John Editor" action="published article" title="Breaking News: Latest Updates" time="10 minutes ago" />
        <ActivityItem user="Sarah Admin" action="edited category" title="Technology" time="2 hours ago" />
        <ActivityItem user="Mike Writer" action="uploaded" title="5 new images" time="Yesterday" />
      </div>
    </div>
  </div>
);

const NewsList = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-b">
        <h3 className="text-lg font-medium">All News Articles</h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow">
            <input className="w-full pl-10 pr-3 py-2 border rounded-md text-sm" placeholder="Search articles..." />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="px-3 py-2 bg-[#ca0019] text-white rounded-md text-sm flex items-center justify-center gap-1">
            <PlusCircle size={16} /> New Article
          </button>
        </div>
      </div>
      
      {isMobile ? (
        // Mobile view (cards)
        <div className="divide-y divide-gray-100">
          {[
            { 
              title: "COVID-19 Updates: New Variant Discovered",
              category: "Health",
              date: "April 21, 2025",
              status: "Published" 
            },
            { 
              title: "Tech Company Launches Revolutionary AI",
              category: "Technology",
              date: "April 20, 2025",
              status: "Published" 
            },
            { 
              title: "Global Economic Forum Results",
              category: "Business",
              date: "April 22, 2025",
              status: "Draft" 
            }
          ].map((item, index) => (
            <div key={index} className="p-4">
              <h4 className="font-medium text-gray-900">{item.title}</h4>
              <div className="flex justify-between mt-2">
                <div className="text-sm text-gray-500">{item.category}</div>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  item.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status}
                </span>
                <div className="flex gap-2">
                  <button className="p-1 text-blue-600"><Edit size={16} /></button>
                  <button className="p-1 text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop view (table)
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <NewsItem 
                title="COVID-19 Updates: New Variant Discovered"
                category="Health"
                date="April 21, 2025"
                status="Published"
              />
              <NewsItem 
                title="Tech Company Launches Revolutionary AI"
                category="Technology"
                date="April 20, 2025"
                status="Published"
              />
              <NewsItem 
                title="Global Economic Forum Results"
                category="Business"
                date="April 22, 2025"
                status="Draft"
              />
            </tbody>
          </table>
        </div>
      )}
      
      <div className="px-4 py-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between border-t gap-3">
        <div className="text-sm text-gray-500">Showing 1-3 of 254 results</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded-md text-sm">Previous</button>
          <button className="px-3 py-1 bg-[#ca0019] text-white rounded-md text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

const ManageNews = () => (
  <div className="space-y-6">
    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Add New Article</h3>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Article Title</label>
            <input className="w-full px-3 py-2 border rounded-md" placeholder="Enter article title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full px-3 py-2 border rounded-md">
              <option>Politics</option>
              <option>Business</option>
              <option>Technology</option>
              <option>Health</option>
              <option>Entertainment</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 border rounded-md text-sm">Choose File</button>
            <span className="text-sm text-gray-500">No file chosen</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea className="w-full px-3 py-2 border rounded-md h-32 md:h-48" placeholder="Write article content here..."></textarea>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-[#ca0019] text-white rounded-md">Save Article</button>
        </div>
      </form>
    </div>
  </div>
);

const Categories = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white p-4 md:p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Add New Category</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
          <input className="w-full px-3 py-2 border rounded-md" placeholder="Enter category name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea className="w-full px-3 py-2 border rounded-md h-24" placeholder="Category description"></textarea>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-[#ca0019] text-white rounded-md">Add Category</button>
        </div>
      </form>
    </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Existing Categories</h3>
        <div className="relative">
          <input className="pl-8 pr-3 py-1 text-sm border rounded-md" placeholder="Search..." />
          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          <CategoryItem name="Politics" count={45} />
          <CategoryItem name="Business" count={78} />
          <CategoryItem name="Technology" count={104} />
          <CategoryItem name="Health" count={52} />
          <CategoryItem name="Entertainment" count={86} />
        </ul>
      </div>
    </div>
  </div>
);

const MediaUpload = () => {
  // State to toggle between grid and list view
  const [isGridView, setIsGridView] = useState(true);
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Upload Images</h3>
        <div className="border-2 border-dashed border-gray-300 p-4 md:p-8 text-center rounded-lg">
          <div className="mx-auto flex justify-center mb-4">
            <ImageIcon size={48} className="text-gray-400" />
          </div>
          <p className="text-gray-500 mb-2">Drag and drop images here, or click to select files</p>
          <button className="px-4 py-2 bg-[#ca0019] text-white rounded-md mt-2">Select Files</button>
        </div>
      </div>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Media Library</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsGridView(true)}
              className={`p-2 rounded ${isGridView ? 'bg-gray-100' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button 
              onClick={() => setIsGridView(false)}
              className={`p-2 rounded ${!isGridView ? 'bg-gray-100' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {isGridView ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <MediaItem src="/api/placeholder/150/100" alt="News image" />
            <MediaItem src="/api/placeholder/150/100" alt="News image" />
            <MediaItem src="/api/placeholder/150/100" alt="News image" />
            <MediaItem src="/api/placeholder/150/100" alt="News image" />
            <MediaItem src="/api/placeholder/150/100" alt="News image" />
            <MediaItem src="/api/placeholder/150/100" alt="News image" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">File name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dimensions</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2">
                      <img src="/api/placeholder/60/40" alt="Thumbnail" className="h-10 w-14 object-cover rounded" />
                    </td>
                    <td className="px-4 py-2 text-sm">image-{i+1}.jpg</td>
                    <td className="px-4 py-2 text-sm text-gray-500">1200 × 800</td>
                    <td className="px-4 py-2 text-sm text-gray-500">April {20+i}, 2025</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                        <button className="p-1 text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 md:p-6 rounded-lg shadow flex items-center">
    <div className={`${color} p-3 rounded-full mr-4 text-white hidden sm:flex`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl md:text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ user, action, title, time }) => (
  <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
        <User size={16} className="text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-sm truncate">
          <span className="font-medium">{user}</span> {action} <span className="font-medium">{title}</span>
        </p>
      </div>
    </div>
    <span className="text-xs text-gray-500 mt-1 sm:mt-0">{time}</span>
  </div>
);

const NewsItem = ({ title, category, date, status }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{title}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{date}</td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`px-2 py-1 text-xs rounded-full ${
        status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex justify-end gap-2">
        <button className="p-1 text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
        <button className="p-1 text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
      </div>
    </td>
  </tr>
);

const CategoryItem = ({ name, count }) => (
  <li className="px-4 py-4 flex flex-wrap sm:flex-nowrap justify-between items-center gap-2">
    <span className="font-medium">{name}</span>
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500">{count} articles</span>
      <div className="flex gap-2">
        <button className="p-1 text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
        <button className="p-1 text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
      </div>
    </div>
  </li>
);

const MediaItem = ({ src, alt }) => (
  <div className="group relative">
    <img src={src} alt={alt} className="w-full h-24 object-cover rounded" />
    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
      <button className="p-1 text-white hover:text-gray-200"><Edit size={16} /></button>
      <button className="p-1 text-white hover:text-gray-200"><Trash2 size={16} /></button>
    </div>
  </div>
);

// Mobile drawer component
const MobileDrawer = ({ isOpen, onClose, children }) => (
  <div className={`fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`}>
    {/* Backdrop */}
    <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
    
    {/* Drawer */}
    <div className="absolute inset-y-0 left-0 w-64 bg-[#ca0019] text-white flex flex-col transition-all duration-300 transform">
      {children}
    </div>
  </div>
);

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileDrawerOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Menu items with routes
  const menuItems = [
    { id: 'dashboard', title: 'Dashboard Overview', icon: <Home size={20} />, component: <Dashboard /> },
    { id: 'news-list', title: 'View News List', icon: <List size={20} />, component: <NewsList /> },
    { id: 'manage-news', title: 'Add/Edit/Delete News', icon: <Newspaper size={20} />, component: <ManageNews /> },
    { id: 'categories', title: 'Manage Categories', icon: <FolderPlus size={20} />, component: <Categories /> },
    { id: 'media', title: 'Upload Images', icon: <ImageIcon size={20} />, component: <MediaUpload /> },
  ];

  // Find active component
  const activeComponent = menuItems.find(item => item.id === activeRoute)?.component || menuItems[0].component;
  
  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="text-xl font-bold">NewsAdmin</div>
        {isMobile && (
          <button onClick={() => setMobileDrawerOpen(false)} className="text-white p-1">
            <X size={24} />
          </button>
        )}
      </div>
      
      {/* Menu Items */}
      <div className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveRoute(item.id);
              if (isMobile) {
                setMobileDrawerOpen(false);
              }
            }}
            className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
              activeRoute === item.id ? 'bg-white/20 border-l-4 border-white' : ''
            }`}
          >
            <span className="flex items-center justify-center mr-3">{item.icon}</span>
            <span className="text-sm font-medium">{item.title}</span>
          </button>
        ))}
      </div>
      
      {/* Admin section */}
      <div className="mt-auto">
        <div className="px-4 py-2">
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs opacity-70">admin@newsportal.com</p>
            </div>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="flex flex-col gap-1 px-2 py-2">
          <button className="flex items-center px-2 py-2 text-sm rounded hover:bg-white/10">
            <Bell size={18} className="mr-3" /> Notifications
          </button>
          <button className="flex items-center px-2 py-2 text-sm rounded hover:bg-white/10">
            <Settings size={18} className="mr-3" /> Settings
          </button>
        </div>
        
        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button className="flex items-center w-full px-4 py-2 hover:bg-white/10 rounded transition-colors">
            <span className="flex items-center justify-center mr-3"><LogOut size={20} /></span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
  
  return (
    <div className="flex h-screen font-[Poppins] bg-gray-100 overflow-hidden">
      {/* Mobile Drawer - only visible on mobile */}
      {isMobile && (
        <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
          {sidebarContent}
        </MobileDrawer>
      )}
      
      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && (
        <div className={`bg-[#ca0019] text-white flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 relative hidden md:flex`}>
          {/* Toggle button */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-9 bg-white text-[#ca0019] rounded-full p-1 shadow-md hover:shadow-lg focus:outline-none"
          >
            {collapsed ? <Menu size={16} /> : <X size={16} />}
          </button>
          
          {/* Logo */}
          <div className="flex items-center justify-center p-6 border-b border-white/20">
            {collapsed ? (
              <div className="text-2xl font-bold">N</div>
            ) : (
              <div className="text-xl font-bold">NewsAdmin</div>
            )}
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveRoute(item.id)}
                className={`flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${
                  activeRoute === item.id ? 'bg-white/20 border-l-4 border-white' : ''
                }`}
              >
                <span className="flex items-center justify-center mr-3">{item.icon}</span>
                {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
              </button>
            ))}
          </div>
          
          {/* Admin section */}
          <div className="mt-auto">
            <div className="px-4 py-2">
              {!collapsed && (
                <div className="flex items-center space-x-2 mb-3">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Admin User</p>
                    <p className="text-xs opacity-70">admin@newsportal.com</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick actions */}
            <div className="flex flex-col gap-1 px-2 py-2">
              {!collapsed ? (
                <>
                  <button className="flex items-center px-2 py-2 text-sm rounded hover:bg-white/10">
                    <Bell size={18} className="mr-3" /> Notifications
                  </button>
                  <button className="flex items-center px-2 py-2 text-sm rounded hover:bg-white/10">
                    <Settings size={18} className="mr-3" /> Settings
                  </button>
                </>
              ) : (
                <>
                  <button className="flex justify-center py-2 rounded hover:bg-white/10">
                    <Bell size={18} />
                  </button>
                  <button className="flex justify-center py-2 rounded hover:bg-white/10">
                    <Settings size={18} />
                    </button>
                </>
              )}
            </div>
            
            {/* Logout */}
            <div className="p-4 border-t border-white/20">
              {!collapsed ? (
                <button className="flex items-center w-full px-4 py-2 hover:bg-white/10 rounded transition-colors">
                  <span className="flex items-center justify-center mr-3"><LogOut size={20} /></span>
                  <span className="text-sm font-medium">Logout</span>
                </button>
              ) : (
                <button className="flex justify-center w-full py-2 hover:bg-white/10 rounded transition-colors">
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="h-16 px-4 flex justify-between items-center">
            {/* Mobile menu button */}
            {isMobile && (
              <button 
                onClick={() => setMobileDrawerOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <Menu size={24} />
              </button>
            )}
            
            {/* Page title */}
            <h1 className={`text-lg font-medium text-gray-900 ${isMobile ? 'text-center flex-1' : ''}`}>
              {menuItems.find(item => item.id === activeRoute)?.title || 'Dashboard'}
            </h1>
            
            {/* Header right */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="relative">
                <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={16} className="text-gray-700" />
                  </div>
                  {!isMobile && (
                    <>
                      <span className="text-sm font-medium">Admin User</span>
                      <ChevronDown size={16} className="text-gray-500" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="container mx-auto">
            {/* Page title and actions */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeRoute)?.title || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeRoute === 'dashboard' && 'Overview of your news portal stats and recent activity'}
                  {activeRoute === 'news-list' && 'Browse and manage all news articles'}
                  {activeRoute === 'manage-news' && 'Create and edit news articles'}
                  {activeRoute === 'categories' && 'Manage your news categories'}
                  {activeRoute === 'media' && 'Upload and manage your media files'}
                </p>
              </div>
              
              {/* Action buttons - specific to each route */}
              <div className="flex gap-2">
                {activeRoute === 'dashboard' && (
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm flex items-center gap-1">
                    <Filter size={16} /> Filter
                  </button>
                )}
                {activeRoute === 'news-list' && (
                  <button className="px-3 py-2 bg-[#ca0019] text-white rounded-md text-sm flex items-center gap-1">
                    <PlusCircle size={16} /> New Article
                  </button>
                )}
                {activeRoute === 'media' && (
                  <button className="px-3 py-2 bg-[#ca0019] text-white rounded-md text-sm flex items-center gap-1">
                    <PlusCircle size={16} /> Upload Media
                  </button>
                )}
              </div>
            </div>
            
            {/* Dynamic content based on active route */}
            {activeComponent}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t px-4 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <div>© 2025 NewsAdmin Portal. All rights reserved.</div>
            <div className="mt-2 sm:mt-0">Version 1.0.0</div>
          </div>
        </footer>
      </div>
    </div>
  );
}