import { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Eye, Filter, ArrowUpDown, BarChart2, PieChart, TrendingUp, Users, Menu, X } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell, Legend } from 'recharts';

export default function NewsManagementDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const newsItems = [
    { id: 1, title: "Economic Forecast Shows Promising Growth", category: "Economy", status: "Published", date: "Apr 23, 2025", views: 4328 },
    { id: 2, title: "New Healthcare Policy Announced", category: "Politics", status: "Draft", date: "Apr 22, 2025", views: 0 },
    { id: 3, title: "Technology Summit Draws Record Attendance", category: "Technology", status: "Published", date: "Apr 20, 2025", views: 7651 },
    { id: 4, title: "Global Climate Initiative Unveiled", category: "Environment", status: "Under Review", date: "Apr 19, 2025", views: 1245 },
    { id: 5, title: "Sports Championship Results", category: "Sports", status: "Published", date: "Apr 18, 2025", views: 9876 },
  ];
  
  const viewsData = [
    { name: 'Apr 17', views: 3200 },
    { name: 'Apr 18', views: 9876 },
    { name: 'Apr 19', views: 1245 },
    { name: 'Apr 20', views: 7651 },
    { name: 'Apr 21', views: 5400 },
    { name: 'Apr 22', views: 2100 },
    { name: 'Apr 23', views: 4328 }
  ];
  
  const categoryData = [
    { name: 'Politics', value: 35 },
    { name: 'Economy', value: 25 },
    { name: 'Technology', value: 20 },
    { name: 'Environment', value: 15 },
    { name: 'Sports', value: 10 },
  ];
  
  const engagementData = [
    { name: 'Shares', value: 1245 },
    { name: 'Comments', value: 876 },
    { name: 'Likes', value: 2354 }
  ];
  
  const deviceData = [
    { name: 'Mobile', value: 65 },
    { name: 'Desktop', value: 30 },
    { name: 'Tablet', value: 5 }
  ];
  
  const COLORS = ['#901420', '#c81e31', '#e63946', '#f77f8a', '#ffb4bd'];
  const COLORS_ALT = ['#901420', '#a32538', '#b7374c', '#cb4a60', '#de5c75'];

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-[#901420] flex items-center justify-center shadow-sm">
            <div className="h-6 w-6 rounded-sm flex items-center justify-center font-bold text-2xl text-white">N</div>
          </div>
          <h1 className="text-xl md:text-2xl font-bold">News Management</h1>
        </div>
        
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-2 md:gap-4">
          <div className="relative flex-grow sm:flex-grow-0">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 w-full sm:w-48 md:w-64 focus:ring-[#901420] focus:border-[#901420] outline-none"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button className="bg-[#901420] text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-1 md:gap-2 hover:bg-[#7d1119] transition-colors whitespace-nowrap">
            <Plus size={16} />
            <span className="hidden md:inline">New Article</span>
            <span className="inline md:hidden">New</span>
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="sm:hidden p-2 text-gray-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col space-y-3">
            <button 
              className={`px-4 py-2 rounded-md text-left ${activeTab === 'all' ? 'bg-[#f8e5e7] text-[#901420] font-medium' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('all');
                setMobileMenuOpen(false);
              }}
            >
              All Articles
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-left ${activeTab === 'published' ? 'bg-[#f8e5e7] text-[#901420] font-medium' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('published');
                setMobileMenuOpen(false);
              }}
            >
              Published
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-left ${activeTab === 'drafts' ? 'bg-[#f8e5e7] text-[#901420] font-medium' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('drafts');
                setMobileMenuOpen(false);
              }}
            >
              Drafts
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-left ${activeTab === 'review' ? 'bg-[#f8e5e7] text-[#901420] font-medium' : 'text-gray-500'}`}
              onClick={() => {
                setActiveTab('review');
                setMobileMenuOpen(false);
              }}
            >
              Under Review
            </button>
          </div>
        </div>
      )}
      
      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Views Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[#901420]" />
              <h2 className="text-base md:text-lg font-semibold">Content Performance</h2>
            </div>
            <select className="border rounded px-2 py-1 text-sm">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" tick={{fontSize: 12}} />
                <YAxis stroke="#888" tick={{fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '4px' }} />
                <Line type="monotone" dataKey="views" stroke="#901420" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5, stroke: '#901420', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mt-4">
            <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs md:text-sm">Total Views</p>
              <p className="text-lg md:text-xl font-bold">33.8K</p>
              <p className="text-xs text-green-500">+12% from last week</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs md:text-sm">Avg. Time on Page</p>
              <p className="text-lg md:text-xl font-bold">4:32</p>
              <p className="text-xs text-green-500">+0:45 from last week</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-xs md:text-sm">Bounce Rate</p>
              <p className="text-lg md:text-xl font-bold">32%</p>
              <p className="text-xs text-red-500">+3% from last week</p>
            </div>
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={20} className="text-[#901420]" />
            <h2 className="text-base md:text-lg font-semibold">Category Distribution</h2>
          </div>
          <div className="h-48 md:h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '4px' }} />
                <Legend verticalAlign="bottom" height={36} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 md:mt-4">
            <div className="flex justify-between mb-1 md:mb-2">
              <p className="text-xs md:text-sm font-medium">Top Category</p>
              <p className="text-xs md:text-sm font-medium">Politics (35%)</p>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-[#901420] rounded-full" style={{ width: '35%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Engagement & Device Stats */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={20} className="text-[#901420]" />
            <h2 className="text-base md:text-lg font-semibold">Engagement Metrics</h2>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="value" fill="#901420" radius={[4, 4, 0, 0]}>
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_ALT[index % COLORS_ALT.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Device Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-[#901420]" />
            <h2 className="text-base md:text-lg font-semibold">Device Distribution</h2>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {deviceData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 md:w-16 h-12 md:h-16 rounded-full border-4 border-gray-100 flex items-center justify-center">
                  <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#901420]" style={{ 
                    opacity: (item.value / 100) + 0.3,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}></div>
                </div>
                <p className="text-xs md:text-sm font-medium mt-2">{item.name}</p>
                <p className="text-base md:text-lg font-bold">{item.value}%</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* User Demographics */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} className="text-[#901420]" />
            <h2 className="text-base md:text-lg font-semibold">Audience Age</h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>18-24</span>
                <span>15%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                <div className="h-2 bg-[#901420] rounded-full" style={{ width: '15%', opacity: 0.7 }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>25-34</span>
                <span>32%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                <div className="h-2 bg-[#901420] rounded-full" style={{ width: '32%', opacity: 0.8 }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>35-44</span>
                <span>28%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                <div className="h-2 bg-[#901420] rounded-full" style={{ width: '28%', opacity: 0.9 }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>45-54</span>
                <span>18%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                <div className="h-2 bg-[#901420] rounded-full" style={{ width: '18%', opacity: 0.6 }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>55+</span>
                <span>7%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                <div className="h-2 bg-[#901420] rounded-full" style={{ width: '7%', opacity: 0.5 }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Management */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6" style={{ overflow: 'hidden' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg md:text-xl font-semibold">Content Management</h2>
          <button className="w-full sm:w-auto bg-[#901420] text-white px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 hover:bg-[#7d1119] transition-colors">
            <Plus size={16} />
            New Article
          </button>
        </div>
        
        {/* Tabs - Hidden on mobile, visible on desktop */}
        <div className="hidden sm:flex border-b mb-6">
          <button 
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-[#901420] text-[#901420] font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('all')}
          >
            All Articles
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'published' ? 'border-b-2 border-[#901420] text-[#901420] font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('published')}
          >
            Published
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'drafts' ? 'border-b-2 border-[#901420] text-[#901420] font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('drafts')}
          >
            Drafts
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'review' ? 'border-b-2 border-[#901420] text-[#901420] font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('review')}
          >
            Under Review
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Filter size={14} />
            <span className="text-gray-500 whitespace-nowrap">Filter by:</span>
            <select className="border rounded px-2 py-1 text-sm flex-grow">
              <option>All Categories</option>
              <option>Politics</option>
              <option>Economy</option>
              <option>Technology</option>
              <option>Environment</option>
              <option>Sports</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ArrowUpDown size={14} />
            <span className="text-gray-500 whitespace-nowrap">Sort by:</span>
            <select className="border rounded px-2 py-1 text-sm flex-grow">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Most Views</option>
              <option>Title A-Z</option>
            </select>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            ::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Mobile Card View - Only visible on small screens */}
          <div className="sm:hidden space-y-4">
            {newsItems.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex gap-1">
                    <button className="p-1 text-gray-500 hover:text-[#901420]">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-[#901420]">
                      <Edit3 size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{item.category}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'Published' ? 'bg-green-100 text-green-800' :
                    item.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{item.date}</span>
                  <span>{item.views.toLocaleString()} views</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop Table View - Hidden on small screens */}
          <table className="hidden sm:table w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Title</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Views</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {newsItems.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{item.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{item.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'Published' ? 'bg-green-100 text-green-800' :
                      item.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.views.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1 text-gray-500 hover:text-[#901420]">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-[#901420]">
                        <Edit3 size={16} />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm gap-4">
          <p className="text-gray-500 text-xs md:text-sm">Showing 1-5 of 248 articles</p>
          <div className="flex gap-1">
            <button className="px-2 sm:px-3 py-1 border rounded disabled:opacity-50 text-xs md:text-sm" disabled>Previous</button>
            <button className="px-2 sm:px-3 py-1 border rounded bg-[#901420] text-white text-xs md:text-sm">1</button>
            <button className="px-2 sm:px-3 py-1 border rounded hover:bg-gray-50 text-xs md:text-sm">2</button>
            <button className="px-2 sm:px-3 py-1 border rounded hover:bg-gray-50 text-xs md:text-sm">3</button>
            <button className="px-2 sm:px-3 py-1 border rounded hover:bg-gray-50 text-xs md:text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}