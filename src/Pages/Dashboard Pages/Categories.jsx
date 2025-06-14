import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Tag, BookOpen, Calendar, X, Check } from 'lucide-react';

const CategoriesUI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#991b1b'
  });

  // Sample categories data
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Technology",
      description: "Articles about software development, AI, and emerging technologies",
      color: "#991b1b",
      articleCount: 15,
      createdDate: "2024-01-15",
      lastUpdated: "2025-06-10"
    },
    {
      id: 2,
      name: "Design",
      description: "UI/UX design principles, visual design, and creative processes",
      color: "#7c2d12",
      articleCount: 8,
      createdDate: "2024-02-20",
      lastUpdated: "2025-06-06"
    },
    {
      id: 3,
      name: "Architecture",
      description: "Software architecture patterns, system design, and best practices",
      color: "#a21caf",
      articleCount: 12,
      createdDate: "2024-03-10",
      lastUpdated: "2025-06-08"
    },
    {
      id: 4,
      name: "Data Science",
      description: "Analytics, machine learning, and data-driven insights",
      color: "#059669",
      articleCount: 6,
      createdDate: "2024-04-05",
      lastUpdated: "2025-06-04"
    },
    {
      id: 5,
      name: "Security",
      description: "Cybersecurity, privacy, and information protection strategies",
      color: "#dc2626",
      articleCount: 4,
      createdDate: "2024-05-12",
      lastUpdated: "2025-06-02"
    },
    {
      id: 6,
      name: "Business",
      description: "Entrepreneurship, strategy, and business development insights",
      color: "#2563eb",
      articleCount: 9,
      createdDate: "2024-06-01",
      lastUpdated: "2025-05-28"
    }
  ]);

  const colorOptions = [
    '#991b1b', '#7c2d12', '#a21caf', '#059669', 
    '#dc2626', '#2563eb', '#7c3aed', '#ea580c'
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const category = {
        id: Date.now(),
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color,
        articleCount: 0,
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, category]);
      setNewCategory({ name: '', description: '', color: '#991b1b' });
      setShowAddModal(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setShowAddModal(true);
  };

  const handleUpdateCategory = () => {
    if (newCategory.name.trim()) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...newCategory, lastUpdated: new Date().toISOString().split('T')[0] }
          : cat
      ));
      setEditingCategory(null);
      setNewCategory({ name: '', description: '', color: '#991b1b' });
      setShowAddModal(false);
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    setNewCategory({ name: '', description: '', color: '#991b1b' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const totalArticles = categories.reduce((sum, cat) => sum + cat.articleCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="mt-2 text-gray-600">Organize and manage your article categories</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-900 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Category
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <Tag className="w-6 h-6 text-red-800" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-800" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900">{totalArticles}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-800" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Articles/Category</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length > 0 ? Math.round(totalArticles / categories.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map(category => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              {/* Category Header */}
              <div 
                className="h-2"
                style={{ backgroundColor: category.color }}
              ></div>
              
              <div className="p-6">
                {/* Category Title and Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-gray-400 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">{category.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {category.articleCount} articles
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Updated {formatDate(category.lastUpdated)}
                  </div>
                </div>

                {/* View Articles Button */}
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  View Articles
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategory.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {newCategory.color === color && (
                        <Check className="w-4 h-4 text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                className="px-4 py-2 bg-red-800 text-white rounded-lg font-medium hover:bg-red-900 transition-colors"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesUI;