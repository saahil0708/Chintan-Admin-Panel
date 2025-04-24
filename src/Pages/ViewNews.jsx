"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Clock,
  User,
  Eye,
  TrendingUp,
  Edit,
  Trash2,
  Bookmark,
  Settings,
  AlertTriangle,
  Check,
  ExternalLink,
} from "lucide-react"

export default function AdminNewsListPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [view, setView] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItems, setSelectedItems] = useState([])
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState("All")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false)

  const categories = ["All", "World", "Politics", "Business", "Technology", "Science", "Health"]
  const statuses = ["All", "Published", "Draft", "Pending Review", "Flagged"]

  const totalPages = 5

  const featuredNews = {
    id: "news-001",
    title: "Global Leaders Commit to Historic Climate Agreement",
    excerpt:
      "Representatives from 195 countries have agreed to a groundbreaking climate pact that aims to limit global warming to 1.5 degrees Celsius above pre-industrial levels through aggressive emission reduction targets.",
    author: "Emily Johnson",
    time: "2 hours ago",
    category: "World",
    image: "/api/placeholder/800/500",
    readTime: "5 min read",
    views: 1834,
    status: "Published",
    featured: true,
  }

  const newsList = [
    {
      id: "news-002",
      title: "Artificial Intelligence Breakthrough Promises Medical Diagnostics Revolution",
      excerpt:
        "New deep learning algorithm demonstrates ability to detect early-stage diseases with greater accuracy than human specialists.",
      author: "Michael Chen",
      time: "3 hours ago",
      category: "Technology",
      image: "/api/placeholder/400/300",
      readTime: "4 min read",
      trending: true,
      views: 1426,
      status: "Published",
    },
    {
      id: "news-003",
      title: "Financial Markets Surge Following Economic Policy Shift",
      excerpt:
        "Global investors respond positively to new monetary approach aimed at balancing inflation concerns with growth targets.",
      author: "Sarah Williams",
      time: "5 hours ago",
      category: "Business",
      image: "/api/placeholder/400/300",
      readTime: "3 min read",
      views: 987,
      status: "Published",
    },
    {
      id: "news-004",
      title: "Breakthrough Energy Storage Solution Could Transform Renewable Power",
      excerpt:
        "Scientists have developed a novel battery technology that significantly increases capacity while reducing costs by 60%.",
      author: "Dr. Robert Kumar",
      time: "7 hours ago",
      category: "Science",
      image: "/api/placeholder/400/300",
      readTime: "6 min read",
      trending: true,
      views: 2103,
      status: "Pending Review",
    },
    {
      id: "news-005",
      title: "Healthcare Reform Bill Advances After Intense Parliamentary Debate",
      excerpt:
        "Landmark legislation promising universal coverage moves forward with bipartisan support after key compromises.",
      author: "Alexandra Peters",
      time: "10 hours ago",
      category: "Politics",
      image: "/api/placeholder/400/300",
      readTime: "4 min read",
      views: 1045,
      status: "Draft",
    },
    {
      id: "news-006",
      title: "Public Health Officials Announce Breakthrough in Vaccine Development",
      excerpt:
        "New immunization approach shows promising results against multiple viral strains in large-scale clinical trials.",
      author: "Dr. James Wilson",
      time: "12 hours ago",
      category: "Health",
      image: "/api/placeholder/400/300",
      readTime: "5 min read",
      views: 1534,
      status: "Flagged",
    },
    {
      id: "news-007",
      title: "Diplomatic Relations Strengthen Between Former Adversaries",
      excerpt: "Historic summit leads to new economic and cultural exchange agreements following decades of tension.",
      author: "Diana Rodriguez",
      time: "6 hours ago",
      category: "World",
      image: "/api/placeholder/400/300",
      readTime: "4 min read",
      views: 921,
      status: "Published",
    },
  ]

  const handleCheckItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedItems.length === newsList.length + 1) {
      setSelectedItems([])
    } else {
      setSelectedItems([featuredNews.id, ...newsList.map((item) => item.id)])
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800"
      case "Flagged":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Published":
        return <Check size={12} className="mr-1" />
      case "Draft":
        return <Edit size={12} className="mr-1" />
      case "Pending Review":
        return <Clock size={12} className="mr-1" />
      case "Flagged":
        return <AlertTriangle size={12} className="mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[Poppins] p-3 sm:p-4 md:p-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#911422]">News Management</h1>
          <span className="ml-3 px-2 sm:px-3 py-1 bg-[#911422] bg-opacity-10 text-[#911422] text-xs sm:text-sm rounded-full">
            Admin Dashboard
          </span>
        </div>
        <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
          <button className="bg-[#911422] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[#7d1220] transition-colors flex items-center text-sm">
            <Edit size={16} className="mr-1 sm:mr-2" />
            <span className="hidden xs:inline">New Article</span>
            <span className="xs:hidden">New</span>
          </button>
          <button className="bg-white border border-gray-300 text-gray-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Admin Actions & Search */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium border flex items-center ${
                selectedItems.length > 0 ? "border-[#911422] text-[#911422]" : "border-gray-300 text-gray-500"
              }`}
              onClick={handleSelectAll}
            >
              {selectedItems.length === newsList.length + 1 ? "Deselect All" : "Select All"}
            </button>

            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium border flex items-center ${
                selectedItems.length > 0
                  ? "border-[#911422] text-[#911422]"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
              disabled={selectedItems.length === 0}
            >
              <Edit size={14} className="mr-1 sm:mr-1.5" />
              <span className="hidden xs:inline">Edit</span>
            </button>

            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium border flex items-center ${
                selectedItems.length > 0
                  ? "border-red-500 text-red-500"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
              disabled={selectedItems.length === 0}
            >
              <Trash2 size={14} className="mr-1 sm:mr-1.5" />
              <span className="hidden xs:inline">Delete</span>
            </button>

            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium border flex items-center ${
                selectedItems.length > 0
                  ? "border-[#911422] text-[#911422]"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
              disabled={selectedItems.length === 0}
            >
              <Bookmark size={14} className="mr-1 sm:mr-1.5" />
              <span className="hidden xs:inline">Feature</span>
            </button>
          </div>

          <div className="relative w-full sm:w-auto">
            <div className="flex">
              <div className="relative flex-1 sm:w-48 md:w-64">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 w-full rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#911422] focus:border-transparent text-sm"
                />
                <Search className="absolute left-2 sm:left-3 top-1.5 sm:top-2.5 text-gray-400" size={16} />
              </div>
              <button className="bg-[#911422] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-r-lg hover:bg-[#7d1220] transition-colors text-sm">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-4 sm:mb-6 gap-3 sm:gap-4">
        {/* Mobile Category Toggle */}
        <button
          className="flex sm:hidden items-center justify-between w-full px-3 py-2 bg-gray-100 rounded-lg text-gray-700"
          onClick={() => setMobileCategoryOpen(!mobileCategoryOpen)}
        >
          <span className="font-medium text-sm">Category: {activeCategory}</span>
          <ChevronRight size={16} className={`transition-transform ${mobileCategoryOpen ? "rotate-90" : ""}`} />
        </button>

        {/* Categories - Desktop and Mobile Expanded */}
        <div
          className={`flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-1 ${mobileCategoryOpen ? "block" : "hidden sm:flex"}`}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === category ? "bg-[#911422] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => {
                setActiveCategory(category)
                setMobileCategoryOpen(false)
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative">
            <button
              className="flex items-center text-gray-500 hover:text-[#911422] transition-colors px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
              onClick={() => setShowStatusFilter(!showStatusFilter)}
            >
              <Filter size={14} className="mr-1 sm:mr-1.5" />
              <span className="font-medium">Status: {statusFilter}</span>
            </button>

            {showStatusFilter && (
              <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {statuses.map((status) => (
                  <button
                    key={status}
                    className="block w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setStatusFilter(status)
                      setShowStatusFilter(false)
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

          <div className="flex border rounded-lg overflow-hidden">
            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm ${view === "grid" ? "bg-[#911422] text-white" : "bg-white text-gray-600"}`}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
            <button
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm ${view === "list" ? "bg-[#911422] text-white" : "bg-white text-gray-600"}`}
              onClick={() => setView("list")}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Featured News */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 bg-[#911422] bg-opacity-5 flex items-center">
          <input
            type="checkbox"
            className="mr-2 sm:mr-3 h-3.5 sm:h-4 w-3.5 sm:w-4 rounded border-gray-300 text-[#911422] focus:ring-[#911422]"
            checked={selectedItems.includes(featuredNews.id)}
            onChange={() => handleCheckItem(featuredNews.id)}
          />
          <span className="text-xs sm:text-sm font-medium text-[#911422]">Featured Article</span>
        </div>
        <div className="sm:flex">
          <div className="sm:w-2/5 lg:w-1/3 relative">
            <img
              src={featuredNews.image || "/placeholder.svg"}
              alt="Featured news"
              className="w-full h-40 sm:h-48 md:h-full object-cover"
            />
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
              <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-white bg-[#911422] rounded-full">
                Featured
              </span>
            </div>
          </div>
          <div className="sm:w-3/5 lg:w-2/3 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold text-white bg-[#911422] rounded-full">
                  {featuredNews.category}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(featuredNews.status)}`}
                >
                  {getStatusIcon(featuredNews.status)}
                  {featuredNews.status}
                </span>
                <span className="text-gray-500 text-xs flex items-center">
                  <Clock size={12} className="mr-1" />
                  {featuredNews.readTime}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 leading-tight">
                {featuredNews.title}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                {featuredNews.excerpt}
              </p>
            </div>
            <div>
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
                <div className="flex items-center text-gray-500 text-xs sm:text-sm">
                  <User size={12} className="mr-1" />
                  <span className="mr-3 font-medium">{featuredNews.author}</span>
                  <Clock size={12} className="mr-1" />
                  <span>{featuredNews.time}</span>
                </div>
                <div className="flex items-center justify-between xs:justify-normal xs:space-x-3">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <Eye size={12} className="mr-1" />
                    <span>{featuredNews.views} views</span>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <button className="text-[#911422] p-1 sm:p-1.5 rounded-full hover:bg-[#911422] hover:bg-opacity-10 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="text-gray-500 p-1 sm:p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <ExternalLink size={16} />
                    </button>
                    <button className="text-red-500 p-1 sm:p-1.5 rounded-full hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News List */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {newsList.map((news, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="p-1.5 sm:p-2 bg-gray-50 flex items-center">
                <input
                  type="checkbox"
                  className="mr-1.5 sm:mr-2 h-3.5 sm:h-4 w-3.5 sm:w-4 rounded border-gray-300 text-[#911422] focus:ring-[#911422]"
                  checked={selectedItems.includes(news.id)}
                  onChange={() => handleCheckItem(news.id)}
                />
                <span
                  className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(news.status)}`}
                >
                  {getStatusIcon(news.status)}
                  <span className="truncate max-w-[80px] sm:max-w-none">{news.status}</span>
                </span>
              </div>
              <div className="relative">
                <img
                  src={news.image || "/placeholder.svg"}
                  alt={news.title}
                  className="w-full h-32 sm:h-40 object-cover"
                />
                {news.trending && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#911422] text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center">
                    <TrendingUp size={10} className="mr-0.5 sm:mr-1" />
                    <span className="text-[10px] sm:text-xs">Trending</span>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <div className="flex items-center mb-1.5 sm:mb-2">
                  <span className="inline-block px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white bg-[#911422] rounded-full mr-1.5 sm:mr-2">
                    {news.category}
                  </span>
                  <span className="text-gray-500 text-[10px] sm:text-xs flex items-center">
                    <Clock size={10} className="mr-0.5 sm:mr-1" />
                    {news.readTime}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2 leading-tight line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{news.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-[10px] sm:text-xs">
                    <User size={10} className="mr-0.5 sm:mr-1" />
                    <span className="font-medium truncate max-w-[80px]">{news.author}</span>
                  </div>
                  <div className="flex items-center text-[10px] sm:text-xs text-gray-500">
                    <Eye size={10} className="mr-0.5 sm:mr-1" />
                    <span>{news.views}</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-gray-500 text-[10px] sm:text-xs">{news.time}</span>
                  <div className="flex space-x-1">
                    <button className="text-[#911422] p-0.5 sm:p-1 rounded-full hover:bg-[#911422] hover:bg-opacity-10 transition-colors">
                      <Edit size={14} />
                    </button>
                    <button className="text-gray-500 p-0.5 sm:p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <ExternalLink size={14} />
                    </button>
                    <button className="text-red-500 p-0.5 sm:p-1 rounded-full hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {newsList.map((news, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
              <div className="flex flex-col sm:flex-row">
                <div className="flex sm:w-1/6 lg:w-1/12 bg-gray-50 p-2 sm:p-3 items-center sm:flex-col sm:justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 sm:h-5 sm:w-5 rounded border-gray-300 text-[#911422] focus:ring-[#911422]"
                    checked={selectedItems.includes(news.id)}
                    onChange={() => handleCheckItem(news.id)}
                  />
                  <span
                    className={`ml-2 sm:ml-0 sm:mt-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(news.status)}`}
                  >
                    {getStatusIcon(news.status)}
                    <span className="truncate max-w-[60px] sm:max-w-none">{news.status}</span>
                  </span>
                </div>

                <div className="flex-1 sm:flex">
                  <div className="w-full sm:w-1/4 md:w-1/6 lg:w-1/5 relative">
                    <img
                      src={news.image || "/placeholder.svg"}
                      alt={news.title}
                      className="w-full h-32 sm:h-full object-cover"
                    />
                    {news.trending && (
                      <div className="absolute top-2 right-2 bg-[#911422] text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center">
                        <TrendingUp size={10} className="mr-0.5 sm:mr-1" />
                        Trending
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 sm:w-3/4 md:w-4/6 lg:w-7/12">
                    <div className="flex items-center flex-wrap mb-1.5 sm:mb-2 gap-1.5">
                      <span className="inline-block px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white bg-[#911422] rounded-full">
                        {news.category}
                      </span>
                      <span className="text-gray-500 text-[10px] sm:text-xs flex items-center">
                        <Clock size={10} className="mr-0.5 sm:mr-1" />
                        {news.readTime}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-xs mb-2 sm:mb-3 hidden sm:block line-clamp-2">{news.excerpt}</p>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1.5 xs:gap-0">
                      <div className="flex items-center text-gray-500 text-[10px] sm:text-xs">
                        <User size={10} className="mr-0.5 sm:mr-1" />
                        <span className="mr-2 sm:mr-3 font-medium truncate max-w-[100px] sm:max-w-none">
                          {news.author}
                        </span>
                        <Clock size={10} className="mr-0.5 sm:mr-1" />
                        <span>{news.time}</span>
                      </div>
                      <div className="flex items-center text-[10px] sm:text-xs text-gray-500">
                        <Eye size={10} className="mr-0.5 sm:mr-1" />
                        <span>{news.views} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center justify-end sm:justify-center p-2 sm:p-3 sm:w-1/12 sm:border-l border-gray-100 space-x-2 sm:space-x-0 sm:space-y-3">
                    <button className="text-[#911422] p-1 sm:p-1.5 rounded-full hover:bg-[#911422] hover:bg-opacity-10 transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="text-gray-500 p-1 sm:p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                      <ExternalLink size={16} />
                    </button>
                    <button className="text-red-500 p-1 sm:p-1.5 rounded-full hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row justify-between items-center gap-3 xs:gap-0">
        <div className="text-xs sm:text-sm text-gray-600 order-2 xs:order-1">
          Showing <span className="font-medium">7</span> items out of <span className="font-medium">24</span> results
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 order-1 xs:order-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-md border ${
              currentPage === 1
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronLeft size={14} />
          </button>

          {[...Array(totalPages)].map((_, i) => {
            // On mobile, show limited page numbers
            if (window.innerWidth < 640) {
              // Always show first, last, current, and pages adjacent to current
              if (
                i === 0 ||
                i === totalPages - 1 ||
                i === currentPage - 1 ||
                i === currentPage - 2 ||
                i === currentPage
              ) {
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-md ${
                      currentPage === i + 1
                        ? "bg-[#911422] text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              } else if (i === 1 && currentPage > 3) {
                // Show ellipsis for skipped pages at the beginning
                return (
                  <span key="ellipsis1" className="px-1">
                    ...
                  </span>
                )
              } else if (i === totalPages - 2 && currentPage < totalPages - 2) {
                // Show ellipsis for skipped pages at the end
                return (
                  <span key="ellipsis2" className="px-1">
                    ...
                  </span>
                )
              }
              return null
            }

            // On desktop, show all pages
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-md ${
                  currentPage === i + 1
                    ? "bg-[#911422] text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            )
          })}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-md border ${
              currentPage === totalPages
                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
