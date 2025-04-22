import { useState } from 'react';
import { 
  Home, 
  Newspaper, 
  FolderPlus, 
  LogOut, 
  Image, 
  List, 
  Menu, 
  X, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Bell, 
  Settings,
  User
} from 'lucide-react';

// Mock routes components - in a real app these would be imported from separate files
const Dashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Articles" value="254" icon={<Newspaper size={24} />} color="bg-blue-500" />
      <StatCard title="Published Today" value="12" icon={<PlusCircle size={24} />} color="bg-green-500" />
      <StatCard title="Pending Review" value="8" icon={<Edit size={24} />} color="bg-yellow-500" />
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <ActivityItem user="John Editor" action="published article" title="Breaking News: Latest Updates" time="10 minutes ago" />
        <ActivityItem user="Sarah Admin" action="edited category" title="Technology" time="2 hours ago" />
        <ActivityItem user="Mike Writer" action="uploaded" title="5 new images" time="Yesterday" />
      </div>
    </div>
  </div>
);

const NewsList = () => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 flex justify-between items-center border-b">
      <h3 className="text-lg font-medium">All News Articles</h3>
      <div className="flex gap-2">
        <input className="px-3 py-1 border rounded-md text-sm" placeholder="Search articles..." />
        <button className="px-3 py-1 bg-[#ca0019] text-white rounded-md text-sm flex items-center gap-1">
          <PlusCircle size={16} /> New Article
        </button>
      </div>
    </div>
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
    <div className="px-6 py-3 flex items-center justify-between border-t">
      <div className="text-sm text-gray-500">Showing 1-3 of 254 results</div>
      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded-md text-sm">Previous</button>
        <button className="px-3 py-1 bg-[#ca0019] text-white rounded-md text-sm">Next</button>
      </div>
    </div>
  </div>
);

const ManageNews = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Add New Article</h3>
      <form className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea className="w-full px-3 py-2 border rounded-md h-32" placeholder="Write article content here..."></textarea>
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-[#ca0019] text-white rounded-md">Save Article</button>
        </div>
      </form>
    </div>
  </div>
);

const Categories = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-lg shadow">
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
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Existing Categories</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        <CategoryItem name="Politics" count={45} />
        <CategoryItem name="Business" count={78} />
        <CategoryItem name="Technology" count={104} />
        <CategoryItem name="Health" count={52} />
        <CategoryItem name="Entertainment" count={86} />
      </ul>
    </div>
  </div>
);

const MediaUpload = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Upload Images</h3>
      <div className="border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
        <div className="mx-auto flex justify-center mb-4">
          <Image size={48} className="text-gray-400" />
        </div>
        <p className="text-gray-500 mb-2">Drag and drop images here, or click to select files</p>
        <button className="px-4 py-2 bg-[#ca0019] text-white rounded-md mt-2">Select Files</button>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Media Library</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <MediaItem src="/api/placeholder/150/100" alt="News image" />
        <MediaItem src="/api/placeholder/150/100" alt="News image" />
        <MediaItem src="/api/placeholder/150/100" alt="News image" />
        <MediaItem src="/api/placeholder/150/100" alt="News image" />
        <MediaItem src="/api/placeholder/150/100" alt="News image" />
        <MediaItem src="/api/placeholder/150/100" alt="News image" />
      </div>
    </div>
  </div>
);

// Helper Components
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow flex items-center">
    <div className={`${color} p-3 rounded-full mr-4 text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const ActivityItem = ({ user, action, title, time }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
        <User size={16} className="text-gray-500" />
      </div>
      <div>
        <p className="text-sm">
          <span className="font-medium">{user}</span> {action} <span className="font-medium">{title}</span>
        </p>
      </div>
    </div>
    <span className="text-xs text-gray-500">{time}</span>
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
  <li className="px-6 py-4 flex justify-between">
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

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeRoute, setActiveRoute] = useState('dashboard');
  
  // Menu items with routes
  const menuItems = [
    { id: 'dashboard', title: 'Dashboard Overview', icon: <Home size={20} />, component: <Dashboard /> },
    { id: 'news-list', title: 'View News List', icon: <List size={20} />, component: <NewsList /> },
    { id: 'manage-news', title: 'Add/Edit/Delete News', icon: <Newspaper size={20} />, component: <ManageNews /> },
    { id: 'categories', title: 'Manage Categories', icon: <FolderPlus size={20} />, component: <Categories /> },
    { id: 'media', title: 'Upload Images', icon: <Image size={20} />, component: <MediaUpload /> },
  ];

  // Find active component
  const activeComponent = menuItems.find(item => item.id === activeRoute)?.component || menuItems[0].component;
  
  return (
    <div className="flex h-screen bg-gray-100 font-[Poppins]">
      {/* Sidebar */}
      <div className={`bg-[#ca0019] text-white flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 relative`}>
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
            <button className="flex items-center w-full px-4 py-2 hover:bg-white/10 rounded transition-colors">
              <span className="flex items-center justify-center mr-3"><LogOut size={20} /></span>
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.id === activeRoute)?.title}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} className="text-gray-600" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeComponent}
        </main>
      </div>
    </div>
  );
}