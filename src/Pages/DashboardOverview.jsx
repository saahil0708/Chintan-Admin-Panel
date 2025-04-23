import { useState } from "react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Clock,
  MessageCircle,
  Share2,
  Filter,
  Search,
  BookOpen,
  Menu,
  X
} from "lucide-react";

// Sample data for news portal metrics
const readerData = [
  { name: 'Jan', value: 25000 },
  { name: 'Feb', value: 28000 },
  { name: 'Mar', value: 32000 },
  { name: 'Apr', value: 30000 },
  { name: 'May', value: 40000 },
  { name: 'Jun', value: 38000 },
];

const contentCategoryData = [
  { name: 'Politics', value: 350 },
  { name: 'Tech', value: 280 },
  { name: 'Sports', value: 320 },
  { name: 'Entmt', value: 220 },
  { name: 'Business', value: 190 },
];

const articleDistribution = [
  { name: 'Politics', value: 35 },
  { name: 'Technology', value: 25 },
  { name: 'Sports', value: 20 },
  { name: 'Entertainment', value: 15 },
  { name: 'Business', value: 5 },
];

const COLORS = ['#971523', '#c13545', '#e05766', '#f78c97', '#ffb3bb'];

export default function ResponsiveNewsPortal() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const KPICard = ({ icon, title, value, trend, bgColor }) => {
    const Icon = icon;
    return (
      <div className={`p-4 rounded-lg ${bgColor} shadow`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <h3 className="text-xl md:text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs md:text-sm flex items-center mt-2">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              <span className="text-green-600">{trend}</span>
            </p>
          </div>
          <div className="rounded-full bg-red-100 p-2 md:p-3">
            <Icon className="h-5 w-5 md:h-6 md:w-6 text-red-800" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 rounded-md">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-red-800 mr-2" />
              <h1 className="text-xl md:text-2xl font-bold text-red-800">NewsPortal</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="bg-transparent border-none outline-none text-sm flex-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <select 
                  className="bg-transparent border-none outline-none text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option>All</option>
                  <option>Politics</option>
                  <option>Technology</option>
                  <option>Sports</option>
                  <option>Entertainment</option>
                  <option>Business</option>
                </select>
              </div>
            </div>
            
            {/* Mobile Navigation Controls */}
            <div className="flex items-center space-x-3 md:hidden">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="h-8 w-8 flex items-center justify-center"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-8 w-8 flex items-center justify-center"
              >
                {mobileMenuOpen ? 
                  <X className="h-5 w-5 text-gray-600" /> : 
                  <Menu className="h-5 w-5 text-gray-600" />
                }
              </button>
            </div>
          </div>
          
          {/* Mobile Search */}
          {searchOpen && (
            <div className="mt-3 md:hidden">
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="h-4 w-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="bg-transparent border-none outline-none text-sm flex-1"
                  autoFocus
                />
              </div>
            </div>
          )}
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mt-3 md:hidden">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="mb-3">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option>All</option>
                    <option>Politics</option>
                    <option>Technology</option>
                    <option>Sports</option>
                    <option>Entertainment</option>
                    <option>Business</option>
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium flex-1">Export</button>
                  <button className="px-4 py-2 bg-red-800 text-white rounded-lg text-sm font-medium flex-1">Report</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* News Portal Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-0">Overall Performance</h2>
          <div className="flex space-x-2 md:space-x-3">
            <button className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-gray-300 rounded-lg text-xs md:text-sm font-medium">Export Data</button>
            <button className="px-3 py-1.5 md:px-4 md:py-2 bg-red-800 text-white rounded-lg text-xs md:text-sm font-medium">Generate Report</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <KPICard 
            icon={Eye} 
            title="Total Page Views" 
            value="253,481" 
            trend="+12.5%" 
            bgColor="bg-white"
          />
          <KPICard 
            icon={Users} 
            title="Unique Visitors" 
            value="136,254" 
            trend="+8.2%" 
            bgColor="bg-white"
          />
          <KPICard 
            icon={MessageCircle} 
            title="Comments" 
            value="15,739" 
            trend="+15.3%" 
            bgColor="bg-white"
          />
          <KPICard 
            icon={Share2} 
            title="Social Shares" 
            value="42,893" 
            trend="+21.7%" 
            bgColor="bg-white"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8">
          {/* Reader Engagement Over Time */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">Reader Engagement Trends</h2>
            <div className="h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={readerData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis width={40} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Line type="monotone" dataKey="value" stroke="#971523" strokeWidth={2} name="Readers" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Content Category Performance */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">Category Performance</h2>
            <div className="h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contentCategoryData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis width={40} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="value" fill="#971523" name="Articles" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Content Distribution and Top Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Category Distribution */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">Content Distribution</h2>
            <div className="h-56 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Pie
                    data={articleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      window.innerWidth < 400 ? 
                      `${(percent * 100).toFixed(0)}%` : 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {articleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend 
                    wrapperStyle={{ fontSize: 12, paddingTop: 10 }} 
                    layout={window.innerWidth < 400 ? "horizontal" : "vertical"}
                    verticalAlign={window.innerWidth < 400 ? "bottom" : "middle"}
                    align={window.innerWidth < 400 ? "center" : "right"}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Articles */}
          <div className="bg-white p-4 md:p-6 rounded-lg shadow lg:col-span-2">
            <h2 className="text-base md:text-lg font-medium mb-3 md:mb-4">Top Performing Articles</h2>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start">
                <div className="h-7 w-7 md:h-8 md:w-8 bg-red-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                  <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">Global Climate Summit Results Announced</p>
                  <div className="flex flex-wrap items-center text-xs text-gray-500">
                    <span className="flex items-center mr-2 md:mr-3"><Eye className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 24k</span>
                    <span className="flex items-center mr-2 md:mr-3"><MessageCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 342</span>
                    <span className="flex items-center"><Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 2h ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-7 w-7 md:h-8 md:w-8 bg-red-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                  <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">New AI Technology Breakthrough Announced</p>
                  <div className="flex flex-wrap items-center text-xs text-gray-500">
                    <span className="flex items-center mr-2 md:mr-3"><Eye className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 18k</span>
                    <span className="flex items-center mr-2 md:mr-3"><MessageCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 218</span>
                    <span className="flex items-center"><Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 5h ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-7 w-7 md:h-8 md:w-8 bg-red-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                  <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">Major Sports Team Wins Championship Title</p>
                  <div className="flex flex-wrap items-center text-xs text-gray-500">
                    <span className="flex items-center mr-2 md:mr-3"><Eye className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 15k</span>
                    <span className="flex items-center mr-2 md:mr-3"><MessageCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 187</span>
                    <span className="flex items-center"><Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 8h ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-7 w-7 md:h-8 md:w-8 bg-red-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                  <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">Stock Market Reaches Record High Today</p>
                  <div className="flex flex-wrap items-center text-xs text-gray-500">
                    <span className="flex items-center mr-2 md:mr-3"><Eye className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 12k</span>
                    <span className="flex items-center mr-2 md:mr-3"><MessageCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 143</span>
                    <span className="flex items-center"><Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 12h ago</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-7 w-7 md:h-8 md:w-8 bg-red-100 rounded-full flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                  <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-red-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium truncate">Celebrity Interview Goes Viral Online</p>
                  <div className="flex flex-wrap items-center text-xs text-gray-500">
                    <span className="flex items-center mr-2 md:mr-3"><Eye className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 11k</span>
                    <span className="flex items-center mr-2 md:mr-3"><MessageCircle className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 326</span>
                    <span className="flex items-center"><Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> 1d ago</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-3 md:mt-4 text-xs md:text-sm text-red-800 font-medium hover:underline">View all top articles</button>
          </div>
        </div>
      </main>
    </div>
  );
}