import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Eye, 
  TrendingUp, 
  MessageCircle, 
  Bell, 
  Settings, 
  Calendar, 
  Search,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Globe,
  User,
  Menu,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import '../../Styles/Dashboard.css'; // Ensure you have the correct path to your CSS file

const NewsAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [chartType, setChartType] = useState('line');

  // Sample chart data - replace this with your actual data fetching logic
  const chartData = {
    '7d': [
      { date: 'Jun 8', views: 12400, articles: 8, engagement: 6.2 },
      { date: 'Jun 9', views: 15600, articles: 12, engagement: 7.1 },
      { date: 'Jun 10', views: 18200, articles: 15, engagement: 8.3 },
      { date: 'Jun 11', views: 22100, articles: 18, engagement: 9.1 },
      { date: 'Jun 12', views: 25300, articles: 14, engagement: 8.7 },
      { date: 'Jun 13', views: 28700, articles: 16, engagement: 9.4 },
      { date: 'Jun 14', views: 31200, articles: 19, engagement: 10.2 }
    ],
    '30d': [
      { date: 'Week 1', views: 85000, articles: 42, engagement: 7.8 },
      { date: 'Week 2', views: 92000, articles: 48, engagement: 8.2 },
      { date: 'Week 3', views: 98000, articles: 51, engagement: 8.9 },
      { date: 'Week 4', views: 105000, articles: 45, engagement: 9.3 }
    ],
    '90d': [
      { date: 'Month 1', views: 320000, articles: 185, engagement: 8.1 },
      { date: 'Month 2', views: 380000, articles: 201, engagement: 8.7 },
      { date: 'Month 3', views: 420000, articles: 218, engagement: 9.2 }
    ]
  };

  const stats = [
    { title: 'Total Articles', value: '2,847', change: '+12%', icon: FileText, color: 'text-blue-600' },
    { title: 'Total Views', value: '1.2M', change: '+18%', icon: Eye, color: 'text-green-600' },
    { title: 'Active Users', value: '45,892', change: '+7%', icon: Users, color: 'text-purple-600' },
    { title: 'Comments', value: '8,234', change: '+23%', icon: MessageCircle, color: 'text-orange-600' }
  ];

  const recentArticles = [
    {
      id: 1,
      title: 'Breaking: Major Technology Summit Announces AI Breakthrough',
      author: 'Sarah Johnson',
      status: 'Published',
      views: '12.5K',
      comments: 45,
      date: '2024-06-14',
      category: 'Technology'
    },
    {
      id: 2,
      title: 'Global Climate Summit Reaches Historic Agreement',
      author: 'Michael Chen',
      status: 'Published',
      views: '8.7K',
      comments: 32,
      date: '2024-06-14',
      category: 'Environment'
    },
    {
      id: 3,
      title: 'Stock Market Analysis: Weekly Performance Review',
      author: 'Emma Davis',
      status: 'Draft',
      views: '0',
      comments: 0,
      date: '2024-06-14',
      category: 'Business'
    },
    {
      id: 4,
      title: 'Sports Championship Finals Preview',
      author: 'Alex Rodriguez',
      status: 'Scheduled',
      views: '0',
      comments: 0,
      date: '2024-06-15',
      category: 'Sports'
    }
  ];

  const topPerformers = [
    { title: 'AI Revolution in Healthcare', views: '45.2K', engagement: '8.4%' },
    { title: 'Climate Change Solutions', views: '38.7K', engagement: '7.2%' },
    { title: 'Stock Market Trends', views: '32.1K', engagement: '6.8%' },
    { title: 'Tech Industry Updates', views: '28.9K', engagement: '6.1%' }
  ];

  // Function to fetch and update chart data - replace with your API call
  const fetchChartData = async (period) => {
    // Example of how you might fetch data:
    // try {
    //   const response = await fetch(`/api/analytics?period=${period}`);
    //   const data = await response.json();
    //   return data;
    // } catch (error) {
    //   console.error('Error fetching chart data:', error);
    //   return chartData[period]; // fallback to sample data
    // }
    
    // For now, return sample data
    return chartData[period];
  };

  const handlePeriodChange = async (period) => {
    setSelectedPeriod(period);
    // Uncomment below to fetch real data
    // const newData = await fetchChartData(period);
    // Update your state with the new data
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'views' ? entry.value.toLocaleString() : entry.value}
              {entry.name === 'engagement' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} from last period
            </p>
          </div>
          <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  const currentData = chartData[selectedPeriod];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Analytics Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Article Analytics</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setChartType('line')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        chartType === 'line' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Line
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        chartType === 'bar' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Bar
                    </button>
                  </div>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => handlePeriodChange(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>
              
              {/* Interactive Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={currentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        yAxisId="views"
                        orientation="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}K` : value}
                      />
                      <YAxis 
                        yAxisId="engagement"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        yAxisId="views"
                        type="monotone" 
                        dataKey="views" 
                        stroke="#dc2626" 
                        strokeWidth={3}
                        dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#dc2626', strokeWidth: 2 }}
                        name="Views"
                      />
                      <Line 
                        yAxisId="engagement"
                        type="monotone" 
                        dataKey="engagement" 
                        stroke="#059669" 
                        strokeWidth={2}
                        dot={{ fill: '#059669', strokeWidth: 2, r: 3 }}
                        name="Engagement"
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={currentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#666' }}
                        tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(0)}K` : value}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="views" 
                        fill="#dc2626" 
                        radius={[4, 4, 0, 0]}
                        name="Views"
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
              
              {/* Chart Legend */}
              <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-gray-600">Views</span>
                </div>
                {chartType === 'line' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-gray-600">Engagement Rate</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Performing Articles */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
              <div className="space-y-4">
                {topPerformers.map((article, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-800 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">{article.views} views</span>
                        <span className="text-xs text-green-600">{article.engagement} engagement</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Articles Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Articles</h3>
                <button className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors">
                  <Plus size={16} />
                  <span>New Article</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{article.title}</p>
                          <p className="text-xs text-gray-500">{article.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{article.author}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          article.status === 'Published' ? 'bg-green-100 text-green-800' :
                          article.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{article.views}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{article.comments}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{article.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800 transition-colors">
                            <Trash2 size={16} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewsAdminDashboard;