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
} from "lucide-react"

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

  const searchInputRef = useRef(null)
  const menuRef = useRef(null)

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

  const renderCategoriesList = () => (
    <div className="flex-1 overflow-y-auto pb-16">
      {filteredCategories.length === 0 ? (
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
            <div
              key={category.id}
              className={`mb-3 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all ${
                isSelectMode ? "pl-10 relative" : ""
              } ${selectedCategoryIds.includes(category.id) ? "border-[#901420] border-2" : ""}`}
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
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          category.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">{category.articles} articles</span>
                    </div>
                  </div>

                  {category.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {category.subcategories.slice(0, 3).map((subcat, index) => (
                        <span key={index} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                          {subcat}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                          +{category.subcategories.length - 3}
                        </span>
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
            </div>
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
              <button
                className="flex-1 px-4 py-3 bg-[#901420] text-white rounded-lg hover:bg-[#7d1119] transition-colors"
                onClick={() => handleSaveEdit(category.id)}
                disabled={!editingCategory.name.trim()}
              >
                Save Changes
              </button>
              <button
                className="px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
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

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Info size={14} className="mr-1" /> Description
          </h3>
          <p className="text-sm text-gray-600">{category.description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Tag size={14} className="mr-1" /> Subcategories
            </h3>
            <span className="text-xs text-gray-500">{category.subcategories.length} total</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((subcat, index) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {subcat}
              </span>
            ))}
            {category.subcategories.length === 0 && <span className="text-sm text-gray-500">No subcategories</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-xs text-gray-500 mb-1">Status</h3>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${category.isActive ? "text-green-600" : "text-gray-600"}`}>
                {category.isActive ? "Active" : "Inactive"}
              </span>
              <button
                className={`px-2 py-1 rounded-full text-xs ${
                  category.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
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
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-xs text-gray-500 mb-1">Articles</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{category.articles} articles</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {Math.round((category.articles / totalArticles) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <BarChart2 size={14} className="mr-1" /> Article Growth
          </h3>
          <div className="h-32 flex items-end gap-1">
            {[35, 28, 45, 65, 40, 55, 75, 50, 65, 70, 60, 80].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-[#901420] bg-opacity-20 rounded-t-sm" style={{ height: `${height}%` }}></div>
                <span className="text-[10px] text-gray-500 mt-1">{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-500 mt-2">Last 12 months</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Clock size={14} className="mr-1" /> Activity Timeline
          </h3>
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
        </div>

        <div className="flex justify-between mb-4">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            onClick={() => handleMoveCategory(category.id, "up")}
          >
            <ArrowUp size={14} className="mr-1" /> Move Up
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            onClick={() => handleMoveCategory(category.id, "down")}
          >
            <ArrowDown size={14} className="mr-1" /> Move Down
          </button>
        </div>

        <button
          className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 mb-4"
          onClick={() => handleDelete(category.id)}
        >
          <Trash2 size={16} />
          Delete Category
        </button>
      </div>
    )
  }

  const renderStatsView = () => (
    <div className="flex-1 overflow-y-auto pb-16 px-4">
      <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-2">
        <h2 className="text-xl font-bold">Statistics</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-xs text-gray-500 mb-1">Total Categories</h3>
          <p className="text-2xl font-bold">{categories.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-xs text-gray-500 mb-1">Active Categories</h3>
          <p className="text-2xl font-bold">{activeCategories}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-xs text-gray-500 mb-1">Total Articles</h3>
          <p className="text-2xl font-bold">{totalArticles}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-xs text-gray-500 mb-1">Avg. per Category</h3>
          <p className="text-2xl font-bold">
            {categories.length > 0 ? Math.round(totalArticles / categories.length) : 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Most Popular Category</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: mostPopularCategory.color }}></div>
          <div>
            <p className="font-medium">{mostPopularCategory.name}</p>
            <p className="text-sm text-gray-500">{mostPopularCategory.articles} articles</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Category Distribution</h3>
        <div className="h-40 flex items-end gap-1">
          {categories.map((category, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: `${(category.articles / Math.max(...categories.map((c) => c.articles))) * 100}%`,
                  backgroundColor: category.color,
                }}
              ></div>
              <span className="text-[10px] text-gray-500 mt-1 truncate w-full text-center">
                {category.name.substring(0, 3)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Status Distribution</h3>
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full border-8 border-[#901420] relative flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-full border-8 border-gray-300"
              style={{
                clipPath: `inset(0 ${100 - (activeCategories / categories.length) * 100}% 0 0)`,
                transform: "rotate(-90deg)",
              }}
            ></div>
            <div className="text-center">
              <p className="text-2xl font-bold">{Math.round((activeCategories / categories.length) * 100)}%</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettingsView = () => (
    <div className="flex-1 overflow-y-auto pb-16 px-4">
      <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-2">
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Display Options</h3>

        <div className="space-y-4">
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
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Data Management</h3>

        <div className="space-y-3">
          <button className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <ArrowUpRight size={14} /> Export Categories
          </button>

          <button className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <ArrowUpRight size={14} className="rotate-180" /> Import Categories
          </button>

          <button className="w-full py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
            <Trash2 size={14} /> Delete All Categories
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">About</h3>
        <p className="text-sm text-gray-600">NewsAdmin v1.0</p>
        <p className="text-xs text-gray-500 mt-1">© 2023 NewsAdmin Inc.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <button
              className="flex-1 py-2 bg-[#901420] text-white rounded-lg flex items-center justify-center gap-1"
              onClick={() => handleBulkToggleActive(true)}
            >
              <Eye size={14} /> Set Active
            </button>
            <button
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center justify-center gap-1"
              onClick={() => handleBulkToggleActive(false)}
            >
              <EyeOff size={14} /> Set Inactive
            </button>
            <button
              className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-1"
              onClick={handleBulkDelete}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
              <button
                className="w-full px-4 py-3 bg-[#901420] text-white rounded-lg hover:bg-[#7d1119] transition-colors"
                onClick={handleAddNewCategory}
                disabled={!newCategory.name.trim()}
              >
                Create Category
              </button>
              <button className="w-full px-4 py-3 text-gray-700 mt-2" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-16 left-0 right-0 flex justify-center px-4 z-30 animate-fadeIn">
          <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-lg shadow-lg flex items-center max-w-md">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        </div>
      )}

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
