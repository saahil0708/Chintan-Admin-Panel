"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, ImageIcon, Check, Trash2, Search, Filter, Tag, Settings, ChevronDown, Edit3, Copy, Grid, List, Crop, Maximize, Eye, Save, Star, StarOff, RotateCw, ZoomIn, ZoomOut, RefreshCw, Menu, MoreHorizontal } from 'lucide-react'

export default function ImageUploadPage() {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showTagModal, setShowTagModal] = useState(false)
  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [newTag, setNewTag] = useState("")
  const [notificationCount, setNotificationCount] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState("newest")
  const [showUploadSettings, setShowUploadSettings] = useState(false)
  const [bulkSelectMode, setBulkSelectMode] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showFileActions, setShowFileActions] = useState(null)
  const [editorSettings, setEditorSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    zoom: 100,
    crop: { x: 0, y: 0, width: 100, height: 100 },
  })
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const fileInputRef = useRef(null)

  const availableTags = [
    "Breaking News",
    "Politics",
    "Economy",
    "Technology",
    "Sports",
    "Entertainment",
    "Weather",
    "Health",
    "Education",
    "Travel",
  ]
  const categories = [
    "All",
    "Recent Uploads",
    "Featured",
    "Article Images",
    "Banner Images",
    "Gallery Images",
    "Unused",
  ]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters || showUploadSettings || showFileActions) {
        // Check if the click is outside the dropdown
        if (!event.target.closest('.dropdown-container')) {
          setShowFilters(false)
          setShowUploadSettings(false)
          setShowFileActions(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilters, showUploadSettings, showFileActions])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Add some sample files after loading
      if (files.length === 0) {
        const sampleFiles = [
          {
            id: "sample-1",
            name: "breaking-news-coverage.jpg",
            size: 1243000,
            type: "image/jpeg",
            preview: "/api/placeholder/600/400",
            status: "complete",
            uploadDate: "2025-04-23",
            tags: ["Breaking News", "Featured"],
            starred: true,
            category: "Article Images",
            alt: "Breaking news coverage of downtown event",
            dimensions: "1920 x 1080 px",
            author: "John Smith",
            license: "Editorial",
            usage: 4,
          },
          {
            id: "sample-2",
            name: "economic-summit-2025.png",
            size: 2450000,
            type: "image/png",
            preview: "/api/placeholder/600/400",
            status: "complete",
            uploadDate: "2025-04-20",
            tags: ["Economy", "Politics"],
            starred: false,
            category: "Banner Images",
            alt: "World Economic Summit conference hall",
            dimensions: "2400 x 1200 px",
            author: "Sarah Johnson",
            license: "Standard",
            usage: 2,
          },
          {
            id: "sample-3",
            name: "tech-innovation-expo.jpg",
            size: 1850000,
            type: "image/jpeg",
            preview: "/api/placeholder/600/400",
            status: "complete",
            uploadDate: "2025-04-18",
            tags: ["Technology"],
            starred: false,
            category: "Gallery Images",
            alt: "Technology innovation expo showcase",
            dimensions: "1800 x 1200 px",
            author: "Michael Lee",
            license: "Premium",
            usage: 0,
          },
        ]
        setFiles(sampleFiles)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => file.type.startsWith("image/"))

    // Create preview URLs and add to files
    const filesWithPreview = validFiles.map((file) => {
      const id = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Simulate upload progress
      simulateUploadProgress(id)

      return {
        id,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        status: "uploading", // uploading, complete, error
        uploadDate: new Date().toISOString().split("T")[0],
        tags: [],
        starred: false,
        category: "Recent Uploads",
        alt: "",
        dimensions: "1600 x 1200 px",
        author: "John Doe",
        license: "Standard",
        usage: 0,
      }
    })

    setFiles((prev) => [...prev, ...filesWithPreview])
  }

  const simulateUploadProgress = (fileId) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }))

        // Set status to complete after a delay
        setTimeout(() => {
          setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "complete" } : f)))
        }, 500)
      } else {
        setUploadProgress((prev) => ({ ...prev, [fileId]: progress }))
      }
    }, 300)
  }

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileId]
      return newProgress
    })
    setSelectedFiles((prev) => prev.filter((id) => id !== fileId))
  }

  const bytesToSize = (bytes) => {
    const sizes = ["Bytes", "KB", "MB", "GB"]
    if (bytes === 0) return "0 Byte"
    const i = Number.parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i]
  }

  const toggleFileTag = (fileId, tag) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === fileId) {
          if (file.tags.includes(tag)) {
            return { ...file, tags: file.tags.filter((t) => t !== tag) }
          } else {
            return { ...file, tags: [...file.tags, tag] }
          }
        }
        return file
      }),
    )
  }

  const toggleStarred = (fileId) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === fileId) {
          return { ...file, starred: !file.starred }
        }
        return file
      }),
    )
  }

  const updateFileAlt = (fileId, alt) => {
    setFiles((prev) =>
      prev.map((file) => {
        if (file.id === fileId) {
          return { ...file, alt }
        }
        return file
      }),
    )
  }

  const openTagModal = (file) => {
    setSelectedFile(file)
    setShowTagModal(true)
  }

  const openMetadataModal = (file) => {
    setSelectedFile(file)
    setShowMetadataModal(true)
  }

  const addNewTag = () => {
    if (newTag.trim() && selectedFile) {
      if (!selectedFile.tags.includes(newTag.trim())) {
        setFiles((prev) =>
          prev.map((file) => {
            if (file.id === selectedFile.id) {
              return { ...file, tags: [...file.tags, newTag.trim()] }
            }
            return file
          }),
        )
      }
      setNewTag("")
    }
  }

  const toggleFileSelection = (fileId) => {
    setSelectedFiles((prev) => {
      if (prev.includes(fileId)) {
        return prev.filter((id) => id !== fileId)
      } else {
        return [...prev, fileId]
      }
    })
  }

  const toggleAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map((file) => file.id))
    }
  }

  const deleteSelectedFiles = () => {
    setFiles((prev) => prev.filter((file) => !selectedFiles.includes(file.id)))
    setSelectedFiles([])
    showToast(`${selectedFiles.length} files deleted successfully`)
  }

  const filteredFiles = files.filter((file) => {
    // Search query filter
    const matchesSearch =
      searchQuery === "" ||
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Category filter
    const matchesCategory = selectedCategory === "All" || file.category === selectedCategory

    // Tags filter
    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => file.tags.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.uploadDate) - new Date(a.uploadDate)
      case "oldest":
        return new Date(a.uploadDate) - new Date(b.uploadDate)
      case "name":
        return a.name.localeCompare(b.name)
      case "size":
        return b.size - a.size
      case "usage":
        return b.usage - a.usage
      default:
        return 0
    }
  })

  // Stats calculations
  const totalSize = files.reduce((acc, file) => acc + file.size, 0)
  const avgSize = files.length > 0 ? totalSize / files.length : 0
  const mostUsedTags = availableTags
    .map((tag) => ({
      tag,
      count: files.filter((file) => file.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  // Toast notification
  const showToast = (message) => {
    setToastMessage(message)
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  // Handle image editor changes
  const handleEditorChange = (setting, value) => {
    setEditorSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const saveEditedImage = () => {
    // In a real app, this would apply the edits to the image
    // For this demo, we'll just simulate success
    showToast("Image edited successfully")
    setShowImageEditor(false)
  }

  const resetEditorSettings = () => {
    setEditorSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      rotation: 0,
      zoom: 100,
      crop: { x: 0, y: 0, width: 100, height: 100 },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-6 py-3 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Image Upload</h2>
            <p className="text-sm md:text-base text-gray-600">Upload and manage images for your news articles</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full md:w-auto justify-end">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                className="p-2 bg-white border border-gray-300 rounded-lg text-gray-700"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu size={20} />
              </button>
            </div>
            
            {/* Settings dropdown - hidden on mobile */}
            <div className="relative hidden md:block dropdown-container">
              <button
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 md:px-4 py-2 rounded-lg shadow-sm flex items-center"
                onClick={() => setShowUploadSettings(!showUploadSettings)}
              >
                <Settings size={18} className="mr-2" />
                <span>Settings</span>
                <ChevronDown size={16} className="ml-2" />
              </button>

              {showUploadSettings && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">Upload Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Auto-optimize</label>
                      <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Auto-tag</label>
                      <div className="w-10 h-5 bg-[#9c1524] rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-700">Auto-rename</label>
                      <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <button className="text-sm text-[#9c1524] hover:text-[#7d1019] font-medium">
                        Advanced Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Upload button */}
            <button
              className="bg-[#9c1524] hover:bg-[#7d1019] text-white px-3 md:px-6 py-2 rounded-lg shadow-md flex items-center flex-1 md:flex-none justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={18} className="mr-2" />
              <span className="whitespace-nowrap">Upload Images</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-800 mb-2">Upload Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Auto-optimize</label>
                    <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Auto-tag</label>
                    <div className="w-10 h-5 bg-[#9c1524] rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">Auto-rename</label>
                    <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <button className="text-sm text-[#9c1524] hover:text-[#7d1019] font-medium">
                  Advanced Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        {showStats && files.length > 0 && !isLoading && (
          <div className="mb-4 md:mb-8 bg-white rounded-lg shadow p-3 md:p-4">
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">Media Library Overview</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowStats(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <div className="p-2 md:p-4 bg-red-50 rounded-lg">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Total Images</div>
                <div className="text-lg md:text-2xl font-bold text-gray-800">{files.length}</div>
              </div>
              <div className="p-2 md:p-4 bg-red-50 rounded-lg">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Total Size</div>
                <div className="text-lg md:text-2xl font-bold text-gray-800">{bytesToSize(totalSize)}</div>
              </div>
              <div className="p-2 md:p-4 bg-red-50 rounded-lg">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Average Size</div>
                <div className="text-lg md:text-2xl font-bold text-gray-800">{bytesToSize(avgSize)}</div>
              </div>
              <div className="p-2 md:p-4 bg-red-50 rounded-lg">
                <div className="text-xs md:text-sm text-gray-600 mb-1">Most Used Tags</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mostUsedTags.map(
                    ({ tag, count }) =>
                      count > 0 && (
                        <span key={tag} className="px-2 bg-white text-[#9c1524] rounded-full text-xs">
                          {tag} ({count})
                        </span>
                      ),
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-4 md:p-8 text-center cursor-pointer transition-all bg-white
            ${isDragging ? "border-[#9c1524] bg-red-50" : "border-gray-300 hover:border-[#9c1524] hover:bg-red-50"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            multiple
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center py-3 md:py-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-100 text-[#9c1524] flex items-center justify-center mb-3 md:mb-4">
              <Upload size={24} className="md:hidden" />
              <Upload size={32} className="hidden md:block" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">Drop images here or click to browse</h3>
            <p className="text-sm md:text-base text-gray-500 max-w-md">
              Upload high-quality JPG, PNG, or WebP images for your news articles. Maximum file size: 10MB
            </p>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2 mt-3 md:mt-4">
              <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs md:text-sm">Accepted: JPG</span>
              <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs md:text-sm">PNG</span>
              <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs md:text-sm">WebP</span>
              <span className="px-2 md:px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs md:text-sm">SVG</span>
            </div>
          </div>
        </div>

        {/* Controls and Filters */}
        {(files.length > 0 || isLoading) && (
          <div className="mt-4 md:mt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search images..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9c1524] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center space-x-1">
                <button
                  className={`px-2 md:px-3 py-2 rounded ${viewMode === "grid" ? "bg-[#9c1524] text-white" : "bg-white text-gray-600 border border-gray-300"}`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`px-2 md:px-3 py-2 rounded ${viewMode === "list" ? "bg-[#9c1524] text-white" : "bg-white text-gray-600 border border-gray-300"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List size={18} />
                </button>
              </div>

              <div className="relative dropdown-container">
                <button
                  className="px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center space-x-1 md:space-x-2 hover:bg-gray-50"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} />
                  <span className="text-sm md:text-base">Filters</span>
                  <ChevronDown
                    size={16}
                    className={`transform transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c1524]"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {availableTags.slice(0, 6).map((tag) => (
                          <button
                            key={tag}
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedTags.includes(tag)
                                ? "bg-[#9c1524] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            onClick={() => {
                              if (selectedTags.includes(tag)) {
                                setSelectedTags(selectedTags.filter((t) => t !== tag))
                              } else {
                                setSelectedTags([...selectedTags, tag])
                              }
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                        <button className="px-2 py-1 rounded-full text-xs bg-gray-100 text-blue-600 hover:bg-gray-200">
                          More...
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c1524]"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name">Name</option>
                        <option value="size">Size</option>
                        <option value="usage">Most Used</option>
                      </select>
                    </div>

                    <div className="flex justify-between">
                      <button
                        className="text-sm text-gray-600 hover:text-gray-800"
                        onClick={() => {
                          setSelectedTags([])
                          setSelectedCategory("All")
                          setSortOrder("newest")
                        }}
                      >
                        Reset Filters
                      </button>
                      <button
                        className="text-sm text-white bg-[#9c1524] px-3 py-1 rounded hover:bg-[#7d1019]"
                        onClick={() => setShowFilters(false)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bulk Actions */}
              <div>
                <button
                  className={`px-3 md:px-4 py-2 rounded-lg flex items-center space-x-1 md:space-x-2 text-sm md:text-base ${
                    bulkSelectMode
                      ? "bg-[#9c1524] text-white"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setBulkSelectMode(!bulkSelectMode)}
                >
                  <span>{bulkSelectMode ? "Cancel" : "Select"}</span>
                </button>
              </div>

              {/* Bulk Actions Menu */}
              {bulkSelectMode && selectedFiles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs md:text-sm text-gray-600">{selectedFiles.length} selected</span>
                  <button
                    className="px-2 md:px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={deleteSelectedFiles}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button className="px-2 md:px-3 py-2 bg-white text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
                    <Tag size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* File List - Loading State */}
        {isLoading && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse"
                >
                  <div className="h-36 md:h-48 bg-gray-200"></div>
                  <div className="p-3 md:p-4">
                    <div className="h-4 md:h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-3 md:h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && files.length === 0 && (
          <div className="mt-4 md:mt-8 text-center p-6 md:p-12 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <ImageIcon size={32} className="text-gray-400 md:hidden" />
              <ImageIcon size={48} className="text-gray-400 hidden md:block" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">No images yet</h3>
            <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto mb-4 md:mb-6">
              Upload images by dragging and dropping files or clicking the upload button above
            </p>
            <button
              className="bg-[#9c1524] hover:bg-[#7d1019] text-white px-4 md:px-6 py-2 rounded-lg shadow-md flex items-center mx-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={18} className="mr-2" />
              <span>Upload Images</span>
            </button>
          </div>
        )}

        {/* File List - Grid View */}
        {!isLoading && files.length > 0 && viewMode === "grid" && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border ${
                    selectedFiles.includes(file.id) ? "border-[#9c1524] ring-2 ring-[#9c1524]" : "border-gray-200"
                  } transition-all hover:shadow-lg`}
                >
                  {/* Image Preview */}
                  <div className="relative h-36 md:h-48 bg-gray-100">
                    {file.status === "uploading" ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-gray-200 border-t-[#9c1524] rounded-full animate-spin"></div>
                        <div className="mt-2 md:mt-4 text-xs md:text-sm font-medium text-gray-600">{uploadProgress[file.id] || 0}%</div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={file.preview || "/placeholder.svg"}
                          alt={file.alt || file.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Mobile action button */}
                        <div className="md:hidden absolute top-2 right-2">
                          <button 
                            className="p-1 bg-white rounded-full shadow-md"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowFileActions(showFileActions === file.id ? null : file.id);
                            }}
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          
                          {/* Mobile action menu */}
                          {showFileActions === file.id && (
                            <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg z-10 p-2 border border-gray-200 w-36">
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openMetadataModal(file);
                                  setShowFileActions(null);
                                }}
                              >
                                <Edit3 size={14} className="mr-2" />
                                Edit Metadata
                              </button>
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openTagModal(file);
                                  setShowFileActions(null);
                                }}
                              >
                                <Tag size={14} className="mr-2" />
                                Edit Tags
                              </button>
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(`${window.location.origin}${file.preview}`);
                                  showToast("Image URL copied to clipboard");
                                  setShowFileActions(null);
                                }}
                              >
                                <Copy size={14} className="mr-2" />
                                Copy URL
                              </button>
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-100 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStarred(file.id);
                                  setShowFileActions(null);
                                }}
                              >
                                {file.starred ? 
                                  <><StarOff size={14} className="mr-2" />Unstar</> : 
                                  <><Star size={14} className="mr-2" />Star</>
                                }
                              </button>
                              <button 
                                className="w-full text-left px-2 py-1.5 text-sm hover:bg-red-50 text-red-600 rounded flex items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(file.id);
                                  setShowFileActions(null);
                                }}
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Desktop Quick Actions Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity hidden md:flex items-center justify-center space-x-2">
                          <button
                            className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              openMetadataModal(file)
                            }}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              openTagModal(file)
                            }}
                          >
                            <Tag size={16} />
                          </button>
                          <button
                            className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Copy image URL to clipboard
                              navigator.clipboard.writeText(`${window.location.origin}${file.preview}`)
                              showToast("Image URL copied to clipboard")
                            }}
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleStarred(file.id)
                            }}
                          >
                            {file.starred ? <StarOff size={16} /> : <Star size={16} />}
                          </button>
                          <button
                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(file.id)
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Selection Checkbox */}
                        {bulkSelectMode && (
                          <div
                            className="absolute top-2 left-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFileSelection(file.id)
                            }}
                          >
                            <div
                              className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded ${
                                selectedFiles.includes(file.id)
                                  ? "bg-[#9c1524] text-white"
                                  : "bg-white border border-gray-300"
                              }`}
                            >
                              {selectedFiles.includes(file.id) && <Check size={12} className="md:hidden" />}
                              {selectedFiles.includes(file.id) && <Check size={14} className="hidden md:block" />}
                            </div>
                          </div>
                        )}

                        {/* Star Badge */}
                        {file.starred && !bulkSelectMode && (
                          <div className="absolute top-2 left-2">
                            <div className="text-yellow-400">
                              <Star size={16} fill="currentColor" />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="p-3 md:p-4">
                    <div className="flex items-center justify-between mb-1 md:mb-2">
                      <h4 className="text-xs md:text-sm font-medium text-gray-800 truncate" title={file.name}>
                        {file.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{bytesToSize(file.size)}</span>
                      <span className="hidden sm:inline">{file.dimensions}</span>
                    </div>

                    {/* Tags */}
                    {file.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {file.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-red-50 text-[#9c1524] rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{file.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Usage Stats */}
                    <div className="mt-2 md:mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">{new Date(file.uploadDate).toLocaleDateString()}</span>
                      <div className="flex items-center text-gray-600">
                        <Eye size={14} className="mr-1" />
                        <span>Used {file.usage} times</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File List - List View */}
        {!isLoading && files.length > 0 && viewMode === "list" && (
          <div className="mt-4 overflow-x-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {bulkSelectMode && (
                      <th
                        scope="col"
                        className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div
                          className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded ${
                            selectedFiles.length === filteredFiles.length && filteredFiles.length > 0
                              ? "bg-[#9c1524] text-white"
                              : "bg-white border border-gray-300"
                          }`}
                          onClick={toggleAllFiles}
                        >
                          {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 && (
                            <Check size={10} className="md:hidden" />
                          )}
                          {selectedFiles.length === filteredFiles.length && filteredFiles.length > 0 && (
                            <Check size={12} className="hidden md:block" />
                          )}
                        </div>
                      </th>
                    )}
                    <th
                      scope="col"
                      className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Details
                    </th>
                    <th
                      scope="col"
                      className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                    >
                      Tags
                    </th>
                    <th
                      scope="col"
                      className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                    >
                      Usage
                    </th>
                    <th
                      scope="col"
                      className="px-2 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedFiles.map((file) => (
                    <tr
                      key={file.id}
                      className={`hover:bg-gray-50 ${selectedFiles.includes(file.id) ? "bg-red-50" : ""}`}
                    >
                      {bulkSelectMode && (
                        <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                          <div
                            className={`w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded ${
                              selectedFiles.includes(file.id)
                                ? "bg-[#9c1524] text-white"
                                : "bg-white border border-gray-300"
                            }`}
                            onClick={() => toggleFileSelection(file.id)}
                          >
                            {selectedFiles.includes(file.id) && <Check size={10} className="md:hidden" />}
                            {selectedFiles.includes(file.id) && <Check size={12} className="hidden md:block" />}
                          </div>
                        </td>
                      )}
                      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-14 md:h-14 md:w-20 relative">
                            {file.status === "uploading" ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-gray-200 border-t-[#9c1524] rounded-full animate-spin"></div>
                              </div>
                            ) : (
                              <img
                                className="h-10 w-14 md:h-14 md:w-20 object-cover rounded"
                                src={file.preview || "/placeholder.svg"}
                                alt=""
                              />
                            )}
                            {file.starred && (
                              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                                <div className="text-yellow-400">
                                  <Star size={14} className="md:hidden" fill="currentColor" />
                                  <Star size={16} className="hidden md:block" fill="currentColor" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4">
                        <div className="text-xs md:text-sm font-medium text-gray-900 mb-1 truncate max-w-[120px] md:max-w-xs" title={file.name}>
                          {file.name}
                        </div>
                        <div className="text-xs text-gray-500 flex flex-col">
                          <span>{bytesToSize(file.size)}</span>
                          <span className="hidden md:inline">{file.dimensions}</span>
                          <span className="text-[10px] md:text-xs">{new Date(file.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {file.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-red-50 text-[#9c1524] rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                          {file.tags.length === 0 && <span className="text-xs text-gray-400">No tags</span>}
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex items-center text-xs md:text-sm text-gray-500">
                          <Eye size={14} className="mr-1" />
                          <span>{file.usage} times</span>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-1 md:space-x-2 justify-end">
                          <button className="text-[#9c1524] hover:text-[#7d1019]" onClick={() => openTagModal(file)}>
                            <Tag size={14} className="md:hidden" />
                            <Tag size={16} className="hidden md:block" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800" onClick={() => openMetadataModal(file)}>
                            <Edit3 size={14} className="md:hidden" />
                            <Edit3 size={16} className="hidden md:block" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800" onClick={() => toggleStarred(file.id)}>
                            {file.starred ? (
                              <>
                                <StarOff size={14} className="md:hidden" />
                                <StarOff size={16} className="hidden md:block" />
                              </>
                            ) : (
                              <>
                                <Star size={14} className="md:hidden" />
                                <Star size={16} className="hidden md:block" />
                              </>
                            )}
                          </button>
                          <button className="text-red-500 hover:text-red-700" onClick={() => removeFile(file.id)}>
                            <Trash2 size={14} className="md:hidden" />
                            <Trash2 size={16} className="hidden md:block" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && files.length > 10 && (
          <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs md:text-sm text-gray-500 order-2 sm:order-1">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
              <span className="font-medium">{files.length}</span> images
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 order-1 sm:order-2">
              <button className="px-2 md:px-4 py-1 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="px-2 md:px-4 py-1 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm font-medium text-white bg-[#9c1524] hover:bg-[#7d1019]">
                1
              </button>
              <button className="px-2 md:px-4 py-1 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                2
              </button>
              <button className="px-2 md:px-4 py-1 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 md:py-4 mt-6">
        <div className="container mx-auto px-3 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="text-xs md:text-sm text-gray-500">© 2025 News Portal. All rights reserved.</div>
            <div className="text-xs md:text-sm">
              <a href="#" className="text-[#9c1524] hover:underline">
                Help & Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Tag Modal */}
      {showTagModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-800">Edit Tags</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowTagModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-2">File: {selectedFile.name}</h4>
              <div className="flex items-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded mr-3">
                  <img
                    src={selectedFile.preview || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div>
                  <div className="text-xs text-gray-500">{bytesToSize(selectedFile.size)}</div>
                  <div className="text-xs text-gray-500">{selectedFile.dimensions}</div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Current Tags</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-md min-h-16">
                {selectedFile.tags.map((tag) => (
                  <div key={tag} className="px-2 md:px-3 py-1 bg-red-50 text-[#9c1524] rounded-full text-xs md:text-sm flex items-center">
                    {tag}
                    <button
                      className="ml-1 md:ml-2 text-red-700 hover:text-red-900"
                      onClick={() => toggleFileTag(selectedFile.id, tag)}
                    >
                      <X size={12} className="md:hidden" />
                      <X size={14} className="hidden md:block" />
                    </button>
                  </div>
                ))}
                {selectedFile.tags.length === 0 && <div className="text-xs md:text-sm text-gray-400">No tags</div>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Add Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableTags
                  .filter((tag) => !selectedFile.tags.includes(tag))
                  .map((tag) => (
                    <button
                      key={tag}
                      className="px-2 md:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm hover:bg-gray-200"
                      onClick={() => toggleFileTag(selectedFile.id, tag)}
                    >
                      {tag}
                    </button>
                  ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Create new tag..."
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#9c1524] focus:border-transparent text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addNewTag()
                  }}
                />
                <button
                  className="px-3 md:px-4 py-2 bg-[#9c1524] text-white rounded-r-md hover:bg-[#7d1019] text-sm"
                  onClick={addNewTag}
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded-md mr-2 hover:bg-gray-200 text-sm"
                onClick={() => setShowTagModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 md:px-4 py-1.5 md:py-2 bg-[#9c1524] text-white rounded-md hover:bg-[#7d1019] text-sm"
                onClick={() => {
                  setShowTagModal(false)
                  showToast("Tags updated successfully")
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metadata Modal */}
      {showMetadataModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-800">Edit Metadata</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowMetadataModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-1">
                <div className="w-full h-32 md:h-40 bg-gray-100 rounded overflow-hidden">
                  <img src={selectedFile.preview || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="truncate">{selectedFile.name}</div>
                  <div>{bytesToSize(selectedFile.size)}</div>
                  <div>{selectedFile.dimensions}</div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={selectedFile.alt}
                      onChange={(e) => updateFileAlt(selectedFile.id, e.target.value)}
                      placeholder="Describe the image..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c1524] focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={selectedFile.category}
                      onChange={(e) => {
                        setFiles((prev) =>
                          prev.map((file) => {
                            if (file.id === selectedFile.id) {
                              return { ...file, category: e.target.value }
                            }
                            return file
                          }),
                        )
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c1524] focus:border-transparent text-sm"
                    >
                      {categories
                        .filter((cat) => cat !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Author</label>
                      <input
                        type="text"
                        value={selectedFile.author}
                        onChange={(e) => {
                          setFiles((prev) =>
                            prev.map((file) => {
                              if (file.id === selectedFile.id) {
                                return { ...file, author: e.target.value }
                              }
                              return file
                            }),
                          )
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c1524] focus:border-transparent text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">License</label>
                      <select
                        value={selectedFile.license}
                        onChange={(e) => {
                          setFiles((prev) =>
                            prev.map((file) => {
                              if (file.id === selectedFile.id) {
                                return { ...file, license: e.target.value }
                              }
                              return file
                            }),
                          )
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9c1524] focus:border-transparent text-sm"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Editorial">Editorial</option>
                        <option value="Premium">Premium</option>
                        <option value="Extended">Extended</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 md:pt-4 border-t border-gray-200 space-y-3 md:space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs md:text-sm font-medium text-gray-700">Image URL</label>
                  <button
                    className="text-xs text-[#9c1524] hover:text-[#7d1019] flex items-center"
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}${selectedFile.preview}`)
                      showToast("Image URL copied to clipboard")
                    }}
                  >
                    <Copy size={12} className="mr-1" />
                    Copy
                  </button>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={`${window.location.origin}${selectedFile.preview}`}
                    readOnly
                    className="flex-grow px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-xs md:text-sm text-gray-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center text-xs md:text-sm text-[#9c1524] hover:text-[#7d1019]"
                  onClick={() => {
                    setShowImageEditor(true)
                    setShowMetadataModal(false)
                  }}
                >
                  <Crop size={14} className="mr-1 md:hidden" />
                  <Crop size={16} className="mr-1 hidden md:block" />
                  Edit Image
                </button>

                <button
                  className="flex items-center text-xs md:text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    // Open full size image in new tab
                    window.open(selectedFile.preview, "_blank")
                  }}
                >
                  <Maximize size={14} className="mr-1 md:hidden" />
                  <Maximize size={16} className="mr-1 hidden md:block" />
                  View Full Size
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded-md mr-2 hover:bg-gray-200 text-sm"
                onClick={() => setShowMetadataModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 md:px-4 py-1.5 md:py-2 bg-[#9c1524] text-white rounded-md hover:bg-[#7d1019] text-sm"
                onClick={() => {
                  setShowMetadataModal(false)
                  showToast("Metadata updated successfully")
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {showImageEditor && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full h-[90vh] md:h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-3 md:p-4 border-b border-gray-200">
              <h3 className="text-base md:text-lg font-semibold text-gray-800">Image Editor</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowImageEditor(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              <div className="w-full md:w-3/4 bg-gray-900 flex items-center justify-center p-4 overflow-auto">
                <img
                  src={selectedFile.preview || "/placeholder.svg"}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                  style={{
                    filter: `brightness(${editorSettings.brightness}%) contrast(${editorSettings.contrast}%) saturate(${editorSettings.saturation}%)`,
                    transform: `rotate(${editorSettings.rotation}deg) scale(${editorSettings.zoom / 100})`,
                  }}
                />
              </div>

              <div className="w-full md:w-1/4 border-t md:border-t-0 md:border-l border-gray-200 p-3 md:p-4 overflow-y-auto">
                <h4 className="font-medium text-gray-800 mb-3 text-sm md:text-base">Edit Tools</h4>

                <div className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Crop</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="px-2 md:px-3 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded text-xs md:text-sm hover:bg-gray-200">
                        Original
                      </button>
                      <button className="px-2 md:px-3 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded text-xs md:text-sm hover:bg-gray-200">
                        16:9
                      </button>
                      <button className="px-2 md:px-3 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded text-xs md:text-sm hover:bg-gray-200">
                        4:3
                      </button>
                      <button className="px-2 md:px-3 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded text-xs md:text-sm hover:bg-gray-200">
                        1:1
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Brightness: {editorSettings.brightness}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editorSettings.brightness}
                      onChange={(e) => handleEditorChange("brightness", Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Contrast: {editorSettings.contrast}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editorSettings.contrast}
                      onChange={(e) => handleEditorChange("contrast", Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Saturation: {editorSettings.saturation}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={editorSettings.saturation}
                      onChange={(e) => handleEditorChange("saturation", Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Rotation</label>
                    <div className="flex justify-between">
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        onClick={() => handleEditorChange("rotation", editorSettings.rotation - 90)}
                      >
                        <RotateCw size={16} className="transform -scale-x-100 md:hidden" />
                        <RotateCw size={18} className="transform -scale-x-100 hidden md:block" />
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        onClick={() => handleEditorChange("rotation", 0)}
                      >
                        <RefreshCw size={16} className="md:hidden" />
                        <RefreshCw size={18} className="hidden md:block" />
                      </button>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                        onClick={() => handleEditorChange("rotation", editorSettings.rotation + 90)}
                      >
                        <RotateCw size={16} className="md:hidden" />
                        <RotateCw size={18} className="hidden md:block" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Zoom: {editorSettings.zoom}%</label>
                    <div className="flex items-center">
                      <button
                        className="p-1.5 md:p-2 bg-gray-100 rounded-l hover:bg-gray-200"
                        onClick={() => handleEditorChange("zoom", Math.max(50, editorSettings.zoom - 10))}
                      >
                        <ZoomOut size={16} className="md:hidden" />
                        <ZoomOut size={18} className="hidden md:block" />
                      </button>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={editorSettings.zoom}
                        onChange={(e) => handleEditorChange("zoom", Number.parseInt(e.target.value))}
                        className="flex-grow mx-2"
                      />
                      <button
                        className="p-1.5 md:p-2 bg-gray-100 rounded-r hover:bg-gray-200"
                        onClick={() => handleEditorChange("zoom", Math.min(200, editorSettings.zoom + 10))}
                      >
                        <ZoomIn size={16} className="md:hidden" />
                        <ZoomIn size={18} className="hidden md:block" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-200">
                  <button
                    className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded-md mb-2 hover:bg-gray-200 flex items-center justify-center text-sm"
                    onClick={resetEditorSettings}
                  >
                    <RefreshCw size={14} className="mr-1 md:hidden" />
                    <RefreshCw size={16} className="mr-2 hidden md:block" />
                    Reset Changes
                  </button>
                  <button
                    className="w-full px-3 md:px-4 py-1.5 md:py-2 bg-[#9c1524] text-white rounded-md hover:bg-[#7d1019] flex items-center justify-center text-sm"
                    onClick={saveEditedImage}
                  >
                    <Save size={14} className="mr-1 md:hidden" />
                    <Save size={16} className="mr-2 hidden md:block" />
                    Save Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-3 md:p-4 rounded shadow-lg z-50 flex items-center max-w-xs md:max-w-md">
          <Check size={18} className="mr-2 flex-shrink-0" />
          <span className="text-sm">{toastMessage}</span>
          <button className="ml-2 md:ml-4 text-green-500 hover:text-green-700 flex-shrink-0" onClick={() => setShowSuccessToast(false)}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
