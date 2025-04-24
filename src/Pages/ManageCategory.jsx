"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  BarChart2,
  AlertCircle,
  Filter,
  Eye,
  EyeOff,
  HelpCircle,
  RefreshCw,
  CheckCircle,
  Home,
  PieChart,
  Sliders,
  MoreVertical,
  ChevronLeft,
  Check,
  Tag,
  Info,
  Clock,
  ArrowUpRight,
  Users,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart,
  Bar,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
} from "recharts"

// Utility function to conditionally join classNames
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ")
}

export default function NewsCategoryManagement() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Politics",
      description: "Political news, policies, and government affairs",
      articles: 87,
      isActive: true,
      color: "#901420",
      subcategories: ["Elections", "Policy", "Government"],
      lastUpdated: "2 days ago",
      growth: 12,
      engagement: 78,
      monthlyData: [45, 52, 38, 65, 72, 56, 68, 73, 62, 80, 85, 87],
    },
    {
      id: 2,
      name: "Economy",
      description: "Financial markets, business, and economic trends",
      articles: 64,
      isActive: true,
      color: "#107896",
      subcategories: ["Markets", "Business", "Trade"],
      lastUpdated: "5 days ago",
      growth: 8,
      engagement: 65,
      monthlyData: [30, 35, 42, 38, 45, 52, 48, 55, 60, 58, 62, 64],
    },
    {
      id: 3,
      name: "Technology",
      description: "Tech industry, innovations, and digital trends",
      articles: 56,
      isActive: true,
      color: "#2A9D8F",
      subcategories: ["AI", "Digital", "Hardware"],
      lastUpdated: "1 week ago",
      growth: 15,
      engagement: 82,
      monthlyData: [25, 28, 32, 30, 35, 38, 42, 45, 48, 50, 53, 56],
    },
    {
      id: 4,
      name: "Environment",
      description: "Climate change, sustainability, and environmental policies",
      articles: 32,
      isActive: true,
      color: "#4D908E",
      subcategories: ["Climate", "Conservation", "Energy"],
      lastUpdated: "2 weeks ago",
      growth: 5,
      engagement: 60,
      monthlyData: [18, 20, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32],
    },
    {
      id: 5,
      name: "Sports",
      description: "Sports news, events, and athlete stories",
      articles: 48,
      isActive: true,
      color: "#F9844A",
      subcategories: ["Football", "Basketball", "Tennis"],
      lastUpdated: "3 days ago",
      growth: 10,
      engagement: 75,
      monthlyData: [28, 30, 32, 35, 38, 40, 42, 43, 44, 45, 46, 48],
    },
    {
      id: 6,
      name: "Entertainment",
      description: "Movies, music, celebrities, and cultural events",
      articles: 38,
      isActive: false,
      color: "#9B5DE5",
      subcategories: ["Movies", "Music", "Celebrities"],
      lastUpdated: "1 day ago",
      growth: -3,
      engagement: 70,
      monthlyData: [40, 42, 41, 40, 39, 38, 37, 36, 37, 38, 38, 38],
    },
    {
      id: 7,
      name: "Health",
      description: "Healthcare, medical research, and wellness",
      articles: 29,
      isActive: true,
      color: "#00BBF9",
      subcategories: ["Medical", "Wellness", "Research"],
      lastUpdated: "4 days ago",
      growth: 7,
      engagement: 68,
      monthlyData: [15, 17, 18, 20, 21, 22, 23, 24, 25, 26, 28, 29],
    },
  ])

  const [activeTab, setActiveTab] = useState("categories") // categories, stats, settings
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#901420",
    subcategories: [],
  })
  const [isAdding, setIsAdding] = useState(false)
  const [isDetailView, setIsDetailView] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [newSubcategory, setNewSubcategory] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all") // 'all', 'active', 'inactive'
  const [showSearch, setShowSearch] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([])
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [chartView, setChartView] = useState("monthly") // monthly, quarterly, yearly
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [activeStatsTab, setActiveStatsTab] = useState("overview")

  const searchInputRef = useRef(null)
  const menuRef = useRef(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Show success message for 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showSearch])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Filter and sort categories
  const filteredCategories = categories
    .filter((category) => {
      // Apply text search
      const matchesSearch =
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Apply status filter
      if (filterStatus === "all") return matchesSearch
      if (filterStatus === "active") return matchesSearch && category.isActive
      if (filterStatus === "inactive") return matchesSearch && !category.isActive

      return matchesSearch
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "articles") return b.articles - a.articles
      if (sortBy === "newest") return b.id - a.id
      if (sortBy === "growth") return b.growth - a.growth
      if (sortBy === "engagement") return b.engagement - a.engagement
      return 0 // default order
    })

  const handleSaveEdit = (id) => {
    setCategories(categories.map((cat) => (cat.id === id ? editingCategory : cat)))
    setEditingCategory(null)
    setSuccessMessage("Category updated successfully")
    setIsEditMode(false)
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setIsEditMode(false)
  }

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      setCategories(categories.filter((cat) => cat.id !== id))
      setConfirmDelete(null)
      setSuccessMessage("Category deleted successfully")
      if (selectedCategory && selectedCategory.id === id) {
        setIsDetailView(false)
        setSelectedCategory(null)
      }
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  const handleAddNewCategory = () => {
    if (!newCategory.name.trim()) {
      return
    }

    const newId = Math.max(...categories.map((cat) => cat.id), 0) + 1
    const categoryToAdd = {
      ...newCategory,
      id: newId,
      articles: 0,
      isActive: true,
      lastUpdated: "Just now",
      growth: 0,
      engagement: 50,
      monthlyData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    setCategories([...categories, categoryToAdd])
    setNewCategory({
      name: "",
      description: "",
      color: "#901420",
      subcategories: [],
    })
    setIsAdding(false)
    setSuccessMessage("New category added successfully")
  }

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() !== "") {
      if (editingCategory) {
        setEditingCategory({
          ...editingCategory,
          subcategories: [...editingCategory.subcategories, newSubcategory],
        })
      } else {
        setNewCategory({
          ...newCategory,
          subcategories: [...newCategory.subcategories, newSubcategory],
        })
      }
      setNewSubcategory("")
    }
  }

  const handleRemoveSubcategory = (index, isForNewCategory = false) => {
    if (isForNewCategory) {
      const updatedSubcategories = [...newCategory.subcategories]
      updatedSubcategories.splice(index, 1)
      setNewCategory({
        ...newCategory,
        subcategories: updatedSubcategories,
      })
    } else {
      const updatedSubcategories = [...editingCategory.subcategories]
      updatedSubcategories.splice(index, 1)
      setEditingCategory({
        ...editingCategory,
        subcategories: updatedSubcategories,
      })
    }
  }

  const handleToggleActive = (id) => {
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, isActive: !cat.isActive } : cat)))
    setSuccessMessage("Status updated successfully")

    // Update selected category if it's the one being toggled
    if (selectedCategory && selectedCategory.id === id) {
      const updatedCategory = categories.find((cat) => cat.id === id)
      if (updatedCategory) {
        setSelectedCategory({ ...updatedCategory, isActive: !updatedCategory.isActive })
      }
    }
  }

  const handleMoveCategory = (id, direction) => {
    const index = categories.findIndex((cat) => cat.id === id)
    if ((direction === "up" && index === 0) || (direction === "down" && index === categories.length - 1)) {
      return
    }

    const newCategories = [...categories]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    ;[newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]]
    setCategories(newCategories)
    setSuccessMessage("Category order updated")
  }

  const handleSelectCategory = (category) => {
    if (isSelectMode) {
      toggleCategorySelection(category.id)
    } else {
      setSelectedCategory(category)
      setIsDetailView(true)
    }
  }

  const toggleCategorySelection = (id) => {
    if (selectedCategoryIds.includes(id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((catId) => catId !== id))
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, id])
    }
  }

  const handleBulkDelete = () => {
    if (selectedCategoryIds.length === 0) return

    setCategories(categories.filter((cat) => !selectedCategoryIds.includes(cat.id)))
    setSuccessMessage(`${selectedCategoryIds.length} categories deleted`)
    setSelectedCategoryIds([])
    setIsSelectMode(false)
  }

  const handleBulkToggleActive = (setActive) => {
    if (selectedCategoryIds.length === 0) return

    setCategories(
      categories.map((cat) => (selectedCategoryIds.includes(cat.id) ? { ...cat, isActive: setActive } : cat)),
    )
    setSuccessMessage(`${selectedCategoryIds.length} categories updated`)
    setSelectedCategoryIds([])
    setIsSelectMode(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setFilterStatus("all")
    setSortBy("default")
    setShowFilters(false)
  }

  const totalArticles = categories.reduce((sum, cat) => sum + cat.articles, 0)
  const activeCategories = categories.filter((cat) => cat.isActive).length

  // Calculate category with most articles
  const mostPopularCategory = categories.reduce((prev, current) => (prev.articles > current.articles ? prev : current))

  // Calculate category with highest growth
  const fastestGrowingCategory = categories.reduce((prev, current) => (prev.growth > current.growth ? prev : current))

  // Calculate category with highest engagement
  const highestEngagementCategory = categories.reduce((prev, current) =>
    prev.engagement > current.engagement ? prev : current,
  )

  // Prepare data for charts
  const pieChartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.articles,
    color: cat.color,
  }))

  const barChartData = categories.map((cat) => ({
    name: cat.name,
    articles: cat.articles,
    growth: cat.growth,
    engagement: cat.engagement,
    color: cat.color,
  }))

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const lineChartData = monthNames.map((month, index) => {
    const dataPoint = { name: month }
    categories.forEach((cat) => {
      dataPoint[cat.name] = cat.monthlyData[index]
    })
    return dataPoint
  })

  const engagementData = categories.map((cat) => ({
    name: cat.name,
    value: cat.engagement,
    fill: cat.color,
  }))

  // Custom Badge component
  const Badge = ({ children, variant = "default", className = "", ...props }) => {
    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      destructive: "bg-red-100 text-red-600",
      outline: "bg-transparent border border-gray-200 text-gray-700",
      secondary: "bg-gray-100 text-gray-800",
    }

    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
          variantClasses[variant],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    )
  }

  // Custom Button component
  const Button = ({ children, variant = "default", size = "default", className = "", ...props }) => {
    const variantClasses = {
      default: "bg-[#901420] text-white hover:bg-[#7d1119]",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-50",
      success: "bg-green-600 text-white hover:bg-green-700",
    }

    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 py-1 text-sm",
      lg: "h-12 px-6 py-3 text-lg",
    }

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#901420] disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  }

  // Custom Progress component
  const Progress = ({ value = 0, className = "", ...props }) => {
    return (
      <div className={cn("relative h-4 w-full overflow-hidden rounded-full bg-gray-100", className)} {...props}>
        <div
          className="h-full bg-[#901420] transition-all"
          style={{ width: `${value}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    )
  }

  // Custom Skeleton component
  const Skeleton = ({ className = "", ...props }) => {
    return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} {...props} />
  }

  // Custom Card components
  const Card = ({ className = "", ...props }) => {
    return <div className={cn("rounded-xl bg-white shadow-sm", className)} {...props} />
  }

  const CardHeader = ({ className = "", ...props }) => {
    return <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />
  }

  const CardTitle = ({ className = "", ...props }) => {
    return <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  }

  const CardDescription = ({ className = "", ...props }) => {
    return <p className={cn("text-sm text-gray-500", className)} {...props} />
  }

  const CardContent = ({ className = "", ...props }) => {
    return <div className={cn("p-4 pt-0", className)} {...props} />
  }

  // Custom Tabs components
  const Tabs = ({ value, onValueChange, className = "", ...props }) => {
    return <div className={cn("", className)} {...props} />
  }

  const TabsList = ({ className = "", ...props }) => {
    return <div className={cn("flex space-x-1 rounded-md bg-gray-100 p-1", className)} {...props} />
  }

  const TabsTrigger = ({ value, children, className = "", ...props }) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#901420] disabled:pointer-events-none disabled:opacity-50",
          activeStatsTab === value
            ? "bg-white text-[#901420] shadow-sm"
            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900",
          className,
        )}
        onClick={() => setActiveStatsTab(value)}
        {...props}
      >
        {children}
      </button>
    )
  }

  const TabsContent = ({ value, children, className = "", ...props }) => {
    if (activeStatsTab !== value) return null
    return (
      <div
        className={cn(
          "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#901420] focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  // Custom ChartContainer component
  const ChartContainer = ({ children, config = {}, className = "", ...props }) => {
    // Apply chart colors to CSS variables
    useEffect(() => {
      const root = document.documentElement
      Object.entries(config).forEach(([key, value]) => {
        if (value.color) {
          root.style.setProperty(`--color-${key}`, value.color)
        }
      })
    }, [config])

    return (
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    )
  }

  const renderCategoriesList = () => (
    <div className="flex-1 overflow-y-auto pb-16">
      {isLoading ? (
        <div className="px-3 pt-2 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 p-3">
              <div className="flex gap-2">
                <Skeleton className="w-2 h-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-2/3 mb-3" />
                  <div className="flex gap-1 mb-3">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <Skeleton className="h-3 w-20" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="bg-gray-100 rounded-full p-4 mb-4">
            <AlertCircle size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No categories found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
          <button
            className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="px-3 pt-2">
          {filteredCategories.map((category) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-3 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all ${
                isSelectMode ? "pl-10 relative" : ""
              } ${selectedCategoryIds.includes(category.id) ? "border-[#901420] border-2" : ""} hover:shadow-md`}
              onClick={() => handleSelectCategory(category)}
            >
              {isSelectMode && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      selectedCategoryIds.includes(category.id) ? "bg-[#901420] border-[#901420]" : "border-gray-300"
                    } flex items-center justify-center`}
                  >
                    {selectedCategoryIds.includes(category.id) && <Check size={12} className="text-white" />}
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <div className="w-2 h-full" style={{ backgroundColor: category.color }}></div>
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-base">{category.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{category.description}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant={category.isActive ? "success" : "secondary"}>
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-400">{category.articles} articles</span>
                        {category.growth !== 0 && (
                          <Badge variant={category.growth > 0 ? "outline" : "destructive"} className="text-xs h-4">
                            {category.growth > 0 ? "+" : ""}
                            {category.growth}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {category.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {category.subcategories.slice(0, 3).map((subcat, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-50">
                          {subcat}
                        </Badge>
                      ))}
                      {category.subcategories.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          +{category.subcategories.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {category.lastUpdated}
                    </span>

                    {!isSelectMode && (
                      <div className="flex gap-2">
                        <button
                          className="p-1 text-gray-400 hover:text-[#901420] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingCategory({ ...category })
                            setIsEditMode(true)
                            setIsDetailView(true)
                            setSelectedCategory(category)
                          }}
                          aria-label="Edit category"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className={`p-1 rounded ${confirmDelete === category.id ? "text-red-600" : "text-gray-400 hover:text-red-500"} transition-colors`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(category.id)
                          }}
                          aria-label={confirmDelete === category.id ? "Confirm delete" : "Delete category"}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )

  const renderDetailView = () => {
    const category = selectedCategory

    if (!category) return null

    if (isEditMode) {
      return (
        <div className="flex-1 overflow-y-auto pb-16 px-4">
          <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-2">
            <button
              className="flex items-center text-gray-600 mb-2"
              onClick={() => {
                setIsEditMode(false)
                setEditingCategory(null)
              }}
            >
              <ChevronLeft size={20} className="mr-1" />
              Back
            </button>
            <h2 className="text-xl font-bold">Edit Category</h2>
          </div>

          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  className="w-10 h-10 border-0 rounded cursor-pointer"
                  value={editingCategory.color}
                  onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                  aria-label="Category color"
                />
                <div className="flex-1 grid grid-cols-5 gap-2">
                  {["#901420", "#107896", "#2A9D8F", "#4D908E", "#F9844A"].map((color) => (
                    <button
                      key={color}
                      className={`w-full h-8 rounded ${editingCategory.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""} transition-all`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditingCategory({ ...editingCategory, color: color })}
                      aria-label={`Select color ${color}`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none"
                placeholder="Category Name"
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                aria-label="Category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none"
                placeholder="Category Description"
                value={editingCategory.description}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                rows="3"
                aria-label="Category description"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Subcategories</label>
                <span className="text-xs text-gray-500">{editingCategory.subcategories.length} total</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] border border-dashed border-gray-200 rounded-lg p-2">
                {editingCategory.subcategories.map((subcat, index) => (
                  <div key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    {subcat}
                    <button
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => handleRemoveSubcategory(index)}
                      aria-label={`Remove ${subcat}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none"
                  placeholder="Add subcategory"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSubcategory()}
                  aria-label="New subcategory"
                />
                <button
                  className="bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={handleAddSubcategory}
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={editingCategory.isActive}
                    onChange={() => setEditingCategory({ ...editingCategory, isActive: true })}
                    className="mr-2"
                  />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    checked={!editingCategory.isActive}
                    onChange={() => setEditingCategory({ ...editingCategory, isActive: false })}
                    className="mr-2"
                  />
                  <span className="text-sm">Inactive</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                className="flex-1"
                onClick={() => handleSaveEdit(category.id)}
                disabled={!editingCategory.name.trim()}
              >
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 overflow-y-auto pb-16 px-4">
        <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-2">
          <button className="flex items-center text-gray-600 mb-2" onClick={() => setIsDetailView(false)}>
            <ChevronLeft size={20} className="mr-1" />
            Back to categories
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: category.color }}></div>
            <h2 className="text-xl font-bold">{category.name}</h2>
          </div>
          <button
            className="p-2 text-gray-500 hover:text-[#901420] transition-colors"
            onClick={() => {
              setEditingCategory({ ...category })
              setIsEditMode(true)
            }}
          >
            <Edit3 size={18} />
          </button>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
              <Info size={14} className="mr-1" /> Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{category.description}</p>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
                <Tag size={14} className="mr-1" /> Subcategories
              </CardTitle>
              <span className="text-xs text-gray-500">{category.subcategories.length} total</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {category.subcategories.map((subcat, index) => (
                <Badge key={index} variant="outline" className="bg-gray-50">
                  {subcat}
                </Badge>
              ))}
              {category.subcategories.length === 0 && <span className="text-sm text-gray-500">No subcategories</span>}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-xs text-gray-500 mb-1">Status</h3>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${category.isActive ? "text-green-600" : "text-gray-600"}`}>
                  {category.isActive ? "Active" : "Inactive"}
                </span>
                <Button
                  variant={category.isActive ? "success" : "secondary"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleToggleActive(category.id)}
                >
                  {category.isActive ? (
                    <span className="flex items-center gap-1">
                      <Eye size={10} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <EyeOff size={10} /> Inactive
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-xs text-gray-500 mb-1">Articles</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.articles} articles</span>
                <Badge variant="outline" className="text-xs">
                  {Math.round((category.articles / totalArticles) * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
              <BarChart2 size={14} className="mr-1" /> Article Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ChartContainer
                config={{
                  articles: {
                    label: "Articles",
                    color: category.color,
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthNames.map((month, index) => ({
                      name: month,
                      articles: category.monthlyData[index],
                    }))}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={category.color} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={category.color} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border rounded shadow-sm text-xs">
                              <p className="font-medium">{payload[0].payload.name}</p>
                              <p>Articles: {payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="articles"
                      stroke={category.color}
                      fillOpacity={1}
                      fill="url(#colorArticles)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">Last 12 months</div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
              <Clock size={14} className="mr-1" /> Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                <div>
                  <p className="text-xs font-medium">Category created</p>
                  <p className="text-xs text-gray-500">2 weeks ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <p className="text-xs font-medium">5 articles added</p>
                  <p className="text-xs text-gray-500">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                <div>
                  <p className="text-xs font-medium">Subcategories updated</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
              <Users size={14} className="mr-1" /> Audience Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-600">Engagement Score</span>
                <span className="text-xs font-medium">{category.engagement}%</span>
              </div>
              <Progress value={category.engagement} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Comments</p>
                <p className="text-sm font-medium">{Math.round(category.engagement * 0.8)}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Shares</p>
                <p className="text-sm font-medium">{Math.round(category.engagement * 0.5)}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs text-gray-500">Saves</p>
                <p className="text-sm font-medium">{Math.round(category.engagement * 0.3)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mb-4">
          <Button variant="outline" size="sm" onClick={() => handleMoveCategory(category.id, "up")}>
            <ArrowUp size={14} className="mr-1" /> Move Up
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleMoveCategory(category.id, "down")}>
            <ArrowDown size={14} className="mr-1" /> Move Down
          </Button>
        </div>

        <Button variant="destructive" className="w-full mb-4" onClick={() => handleDelete(category.id)}>
          <Trash2 size={16} className="mr-2" />
          Delete Category
        </Button>
      </div>
    )
  }

  const renderStatsView = () => (
    <div className="flex-1 overflow-y-auto pb-16 px-4">
      <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Statistics</h2>
          <button className="p-1 text-gray-500 hover:text-[#901420]" onClick={() => setIsFullScreen(!isFullScreen)}>
            {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      <Tabs value={activeStatsTab} onValueChange={setActiveStatsTab} className="mt-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <h3 className="text-xs text-gray-500 mb-1">Total Categories</h3>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{categories.length}</p>
                  <Badge variant="outline" className="ml-2">
                    {activeCategories} active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="text-xs text-gray-500 mb-1">Total Articles</h3>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{totalArticles}</p>
                  <Badge variant="outline" className="ml-2">
                    ~{Math.round(totalArticles / categories.length)} per category
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Category Distribution</CardTitle>
              <CardDescription>Articles by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={Object.fromEntries(
                    categories.map((cat) => [
                      cat.name.toLowerCase().replace(/\s+/g, "_"),
                      {
                        label: cat.name,
                        color: cat.color,
                      },
                    ]),
                  )}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 border rounded shadow-sm">
                                <p className="font-medium">{payload[0].name}</p>
                                <p>Articles: {payload[0].value}</p>
                                <p>Percentage: {((payload[0].value / totalArticles) * 100).toFixed(1)}%</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Most Popular</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: mostPopularCategory.color }}></div>
                  <div>
                    <p className="font-medium text-sm">{mostPopularCategory.name}</p>
                    <p className="text-xs text-gray-500">{mostPopularCategory.articles} articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Fastest Growing</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: fastestGrowingCategory.color }}></div>
                  <div>
                    <p className="font-medium text-sm">{fastestGrowingCategory.name}</p>
                    <p className="text-xs text-gray-500">+{fastestGrowingCategory.growth}% growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Highest Engagement</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: highestEngagementCategory.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-sm">{highestEngagementCategory.name}</p>
                    <p className="text-xs text-gray-500">{highestEngagementCategory.engagement}% engagement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement by Category</CardTitle>
              <CardDescription>User interaction metrics across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer
                  config={Object.fromEntries(
                    categories.map((cat) => [
                      cat.name.toLowerCase().replace(/\s+/g, "_"),
                      {
                        label: cat.name,
                        color: cat.color,
                      },
                    ]),
                  )}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="20%"
                      outerRadius="80%"
                      barSize={20}
                      data={engagementData}
                    >
                      <RadialBar
                        minAngle={15}
                        background
                        clockWise
                        dataKey="value"
                        label={{ position: "insideStart", fill: "#fff", fontSize: 12 }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-2 border rounded shadow-sm">
                                <p className="font-medium">{payload[0].name}</p>
                                <p>Engagement: {payload[0].value}%</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Comments</span>
                      <span className="text-xs font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Shares</span>
                      <span className="text-xs font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Saves</span>
                      <span className="text-xs font-medium">42%</span>
                    </div>
                    <Progress value={42} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Time Spent</span>
                      <span className="text-xs font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <ChartContainer className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "18-24", value: 15, fill: "#FF6384" },
                            { name: "25-34", value: 35, fill: "#36A2EB" },
                            { name: "35-44", value: 25, fill: "#FFCE56" },
                            { name: "45-54", value: 15, fill: "#4BC0C0" },
                            { name: "55+", value: 10, fill: "#9966FF" },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                        />
                        <Tooltip />
                        <Legend layout="vertical" align="right" verticalAlign="middle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Article Growth Trends</h3>
            <div className="flex gap-2">
              <Button
                variant={chartView === "monthly" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setChartView("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={chartView === "quarterly" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setChartView("quarterly")}
              >
                Quarterly
              </Button>
              <Button
                variant={chartView === "yearly" ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setChartView("yearly")}
              >
                Yearly
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="h-80">
                <ChartContainer
                  config={Object.fromEntries(
                    categories.map((cat) => [
                      cat.name.toLowerCase().replace(/\s+/g, "_"),
                      {
                        label: cat.name,
                        color: cat.color,
                      },
                    ]),
                  )}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {categories.map((category) => (
                        <Line
                          key={category.id}
                          type="monotone"
                          dataKey={category.name}
                          stroke={category.color}
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Growth Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={Object.fromEntries(
                    categories.map((cat) => [
                      cat.name.toLowerCase().replace(/\s+/g, "_"),
                      {
                        label: cat.name,
                        color: cat.color,
                      },
                    ]),
                  )}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="growth" name="Growth %" fill="#8884d8">
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderSettingsView = () => (
    <div className="flex-1 overflow-y-auto pb-16 px-4">
      <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-2">
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Display Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Default View</label>
            <div className="flex border rounded-lg overflow-hidden">
              <button className="flex-1 py-2 px-3 bg-[#901420] text-white">List</button>
              <button className="flex-1 py-2 px-3 text-gray-700 hover:bg-gray-50">Grid</button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Default Sort</label>
            <select className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none">
              <option>Default</option>
              <option>Name (A-Z)</option>
              <option>Most articles</option>
              <option>Newest first</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">Show inactive categories</label>
            <div className="w-10 h-6 bg-[#901420] rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">Show category statistics</label>
            <div className="w-10 h-6 bg-[#901420] rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full">
            <ArrowUpRight size={14} className="mr-2" /> Export Categories
          </Button>

          <Button variant="outline" className="w-full">
            <ArrowUpRight size={14} className="mr-2 rotate-180" /> Import Categories
          </Button>

          <Button variant="destructive" className="w-full">
            <Trash2 size={14} className="mr-2" /> Delete All Categories
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">NewsAdmin v1.0</p>
          <p className="text-xs text-gray-500 mt-1">© 2023 NewsAdmin Inc.</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-50 flex flex-col",
        isFullScreen && activeTab === "stats" ? "fixed inset-0 z-50" : "",
      )}
    >
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-[#901420] flex items-center justify-center">
            <div className="h-4 w-4 rounded-sm bg-white"></div>
          </div>
          <h1 className="text-lg font-bold">NewsAdmin</h1>
        </div>

        <div className="flex items-center gap-2">
          {!isDetailView && !isSelectMode && (
            <>
              <button
                className="p-2 text-gray-500 hover:text-[#901420] transition-colors"
                onClick={() => setShowSearch(!showSearch)}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                className="p-2 text-gray-500 hover:text-[#901420] transition-colors"
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Filter"
              >
                <Filter size={18} />
              </button>
            </>
          )}

          {isSelectMode ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedCategoryIds.length} selected</span>
              <button
                className="p-2 text-gray-500 hover:text-[#901420] transition-colors"
                onClick={() => setIsSelectMode(false)}
                aria-label="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                className="p-2 text-gray-500 hover:text-[#901420] transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                <MoreVertical size={18} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-30 animate-fadeIn">
                  {!isDetailView && (
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        setIsSelectMode(true)
                        setIsMenuOpen(false)
                      }}
                    >
                      <Check size={14} /> Select Categories
                    </button>
                  )}
                  <button
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                    onClick={() => {
                      setIsAdding(true)
                      setIsMenuOpen(false)
                    }}
                  >
                    <Plus size={14} /> Add New Category
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                    <RefreshCw size={14} /> Refresh
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2">
                    <HelpCircle size={14} /> Help
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Search Bar */}
      {showSearch && !isDetailView && (
        <div className="px-4 py-2 bg-white border-b animate-slideDown">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search categories..."
              className="w-full pl-9 pr-9 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            {searchQuery && (
              <button
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && !isDetailView && (
        <div className="px-4 py-3 bg-white border-b animate-slideDown">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Filters</h3>
            <button className="text-sm text-[#901420]" onClick={clearFilters}>
              Clear all
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 py-1.5 rounded-lg border ${filterStatus === "all" ? "bg-[#901420] text-white border-[#901420]" : "border-gray-300"}`}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </button>
                <button
                  className={`flex-1 py-1.5 rounded-lg border ${filterStatus === "active" ? "bg-[#901420] text-white border-[#901420]" : "border-gray-300"}`}
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </button>
                <button
                  className={`flex-1 py-1.5 rounded-lg border ${filterStatus === "inactive" ? "bg-[#901420] text-white border-[#901420]" : "border-gray-300"}`}
                  onClick={() => setFilterStatus("inactive")}
                >
                  Inactive
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Sort by</label>
              <select
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Default</option>
                <option value="name">Name (A-Z)</option>
                <option value="articles">Most articles</option>
                <option value="newest">Newest first</option>
                <option value="growth">Highest growth</option>
                <option value="engagement">Highest engagement</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {isDetailView
          ? renderDetailView()
          : activeTab === "categories"
            ? renderCategoriesList()
            : activeTab === "stats"
              ? renderStatsView()
              : renderSettingsView()}
      </main>

      {/* Bottom Navigation */}
      {!isDetailView && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around py-2 z-20">
          <button
            className={`flex flex-col items-center py-1 px-3 ${activeTab === "categories" ? "text-[#901420]" : "text-gray-500"}`}
            onClick={() => setActiveTab("categories")}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Categories</span>
          </button>
          <button
            className={`flex flex-col items-center py-1 px-3 ${activeTab === "stats" ? "text-[#901420]" : "text-gray-500"}`}
            onClick={() => setActiveTab("stats")}
          >
            <PieChart size={20} />
            <span className="text-xs mt-1">Stats</span>
          </button>
          <button
            className="flex flex-col items-center justify-center bg-[#901420] text-white rounded-full w-14 h-14 -mt-5 shadow-lg"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={24} />
          </button>
          <button
            className={`flex flex-col items-center py-1 px-3 ${activeTab === "settings" ? "text-[#901420]" : "text-gray-500"}`}
            onClick={() => setActiveTab("settings")}
          >
            <Sliders size={20} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </nav>
      )}

      {/* Selection Actions */}
      {isSelectMode && selectedCategoryIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-3 px-4 z-20 animate-slideUp">
          <div className="flex gap-2">
            <Button
              variant="default"
              className="flex-1 bg-[#901420] hover:bg-[#7d1119]"
              onClick={() => handleBulkToggleActive(true)}
            >
              <Eye size={14} className="mr-1" /> Set Active
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => handleBulkToggleActive(false)}>
              <EyeOff size={14} className="mr-1" /> Set Inactive
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleBulkDelete}>
              <Trash2 size={14} className="mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Add New Category</h3>
                <button
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setIsAdding(false)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-10 h-10 border-0 rounded cursor-pointer"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      aria-label="Category color"
                    />
                    <div className="flex-1 grid grid-cols-5 gap-2">
                      {["#901420", "#107896", "#2A9D8F", "#4D908E", "#F9844A"].map((color) => (
                        <button
                          key={color}
                          className={`w-full h-8 rounded ${newCategory.color === color ? "ring-2 ring-offset-2 ring-gray-400" : ""} transition-all`}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewCategory({ ...newCategory, color: color })}
                          aria-label={`Select color ${color}`}
                        ></button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none"
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    aria-label="Category name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none"
                    placeholder="Category Description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    rows="3"
                    aria-label="Category description"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Subcategories</label>
                    <span className="text-xs text-gray-500">{newCategory.subcategories.length} total</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2 min-h-[40px] border border-dashed border-gray-200 rounded-lg p-2">
                    {newCategory.subcategories.map((subcat, index) => (
                      <div key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        {subcat}
                        <button
                          className="text-gray-500 hover:text-red-500 transition-colors"
                          onClick={() => handleRemoveSubcategory(index, true)}
                          aria-label={`Remove ${subcat}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-[#901420] focus:border-[#901420] outline-none"
                      placeholder="Add subcategory"
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddSubcategory()}
                      aria-label="New subcategory"
                    />
                    <button
                      className="bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={handleAddSubcategory}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  className="w-full bg-[#901420] hover:bg-[#7d1119]"
                  onClick={handleAddNewCategory}
                  disabled={!newCategory.name.trim()}
                >
                  Create Category
                </Button>
                <Button variant="ghost" className="w-full mt-2" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-16 left-0 right-0 flex justify-center px-4 z-30"
          >
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg shadow-lg flex items-center max-w-md">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-in-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-in-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-track {
          background-color: transparent;
        }
        body {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  )
}
