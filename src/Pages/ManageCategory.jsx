import { useState } from 'react';
import { Search, Plus, Edit3, Trash2, Save, X, ArrowUp, ArrowDown, BarChart2 } from 'lucide-react';

export default function NewsCategoryManagement() {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: "Politics", 
      description: "Political news, policies, and government affairs", 
      articles: 87, 
      isActive: true,
      color: "#901420",
      subcategories: ["Elections", "Policy", "Government"]
    },
    { 
      id: 2, 
      name: "Economy", 
      description: "Financial markets, business, and economic trends", 
      articles: 64, 
      isActive: true,
      color: "#107896",
      subcategories: ["Markets", "Business", "Trade"]
    },
    { 
      id: 3, 
      name: "Technology", 
      description: "Tech industry, innovations, and digital trends", 
      articles: 56, 
      isActive: true,
      color: "#2A9D8F",
      subcategories: ["AI", "Digital", "Hardware"]
    },
    { 
      id: 4, 
      name: "Environment", 
      description: "Climate change, sustainability, and environmental policies", 
      articles: 32, 
      isActive: true,
      color: "#4D908E",
      subcategories: ["Climate", "Conservation", "Energy"]
    },
    { 
      id: 5, 
      name: "Sports", 
      description: "Sports news, events, and athlete stories", 
      articles: 48, 
      isActive: true,
      color: "#F9844A",
      subcategories: ["Football", "Basketball", "Tennis"]
    },
    { 
      id: 6, 
      name: "Entertainment", 
      description: "Movies, music, celebrities, and cultural events", 
      articles: 38, 
      isActive: false,
      color: "#9B5DE5",
      subcategories: ["Movies", "Music", "Celebrities"]
    },
    { 
      id: 7, 
      name: "Health", 
      description: "Healthcare, medical research, and wellness", 
      articles: 29, 
      isActive: true,
      color: "#00BBF9",
      subcategories: ["Medical", "Wellness", "Research"]
    }
  ]);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#901420",
    subcategories: []
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveEdit = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? editingCategory : cat
    ));
    setEditingCategory(null);
  };
  
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };
  
  const handleDelete = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
  };
  
  const handleAddNewCategory = () => {
    const newId = Math.max(...categories.map(cat => cat.id)) + 1;
    const categoryToAdd = {
      ...newCategory,
      id: newId,
      articles: 0,
      isActive: true
    };
    setCategories([...categories, categoryToAdd]);
    setNewCategory({
      name: "",
      description: "",
      color: "#901420",
      subcategories: []
    });
    setIsAdding(false);
  };
  
  const handleAddSubcategory = () => {
    if (newSubcategory.trim() !== '') {
      if (editingCategory) {
        setEditingCategory({
          ...editingCategory,
          subcategories: [...editingCategory.subcategories, newSubcategory]
        });
      } else {
        setNewCategory({
          ...newCategory,
          subcategories: [...newCategory.subcategories, newSubcategory]
        });
      }
      setNewSubcategory('');
    }
  };
  
  const handleRemoveSubcategory = (index, isForNewCategory = false) => {
    if (isForNewCategory) {
      const updatedSubcategories = [...newCategory.subcategories];
      updatedSubcategories.splice(index, 1);
      setNewCategory({
        ...newCategory,
        subcategories: updatedSubcategories
      });
    } else {
      const updatedSubcategories = [...editingCategory.subcategories];
      updatedSubcategories.splice(index, 1);
      setEditingCategory({
        ...editingCategory,
        subcategories: updatedSubcategories
      });
    }
  };
  
  const handleToggleActive = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? {...cat, isActive: !cat.isActive} : cat
    ));
  };
  
  const handleMoveCategory = (id, direction) => {
    const index = categories.findIndex(cat => cat.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === categories.length - 1)) {
      return;
    }
    
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newCategories[index], newCategories[targetIndex]] = [newCategories[targetIndex], newCategories[index]];
    setCategories(newCategories);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-white flex items-center justify-center shadow-sm">
            <div className="h-6 w-6 rounded-sm bg-[#901420]"></div>
          </div>
          <h1 className="text-2xl font-bold">NewsAdmin</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 w-64 focus:ring-[#901420] focus:border-[#901420] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button 
            className="bg-[#901420] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#7d1119] transition-colors"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={16} />
            New Category
          </button>
        </div>
      </div>
      
      {/* Category Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-[#901420] bg-opacity-10 flex items-center justify-center">
              <BarChart2 size={20} className="text-[#901420]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Categories</p>
              <p className="text-2xl font-bold">{categories.filter(cat => cat.isActive).length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Articles</p>
              <p className="text-2xl font-bold">{categories.reduce((sum, cat) => sum + cat.articles, 0)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <div className="h-4 w-4 rounded-sm bg-blue-500"></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. Articles per Category</p>
              <p className="text-2xl font-bold">
                {Math.round(categories.reduce((sum, cat) => sum + cat.articles, 0) / categories.length)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
              <div className="h-4 w-4 rounded-sm bg-purple-500"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm p-6" style={{ overflow: 'hidden' }}>
        <h2 className="text-xl font-semibold mb-6">Category Management</h2>
        
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            ::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 w-12">Color</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Subcategories</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 text-center">Articles</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 text-center">Status</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500 text-center">Order</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCategories.map(category => (
                <tr key={category.id} className="hover:bg-gray-50">
                  {editingCategory && editingCategory.id === category.id ? (
                    <>
                      <td className="px-4 py-3">
                        <input 
                          type="color" 
                          className="w-8 h-8 border-0 rounded cursor-pointer" 
                          value={editingCategory.color}
                          onChange={(e) => setEditingCategory({...editingCategory, color: e.target.value})}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="text" 
                          className="w-full border rounded px-2 py-1" 
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <textarea 
                          className="w-full border rounded px-2 py-1" 
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                          rows="2"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editingCategory.subcategories.map((subcat, index) => (
                            <div key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                              {subcat}
                              <button 
                                className="text-gray-500 hover:text-red-500"
                                onClick={() => handleRemoveSubcategory(index)}
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="border rounded px-2 py-1 text-sm flex-1" 
                            placeholder="Add subcategory"
                            value={newSubcategory}
                            onChange={(e) => setNewSubcategory(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
                          />
                          <button 
                            className="bg-gray-100 px-2 py-1 rounded text-sm"
                            onClick={handleAddSubcategory}
                          >
                            Add
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {category.articles}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          className={`px-2 py-1 rounded-full text-xs ${editingCategory.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          onClick={() => setEditingCategory({...editingCategory, isActive: !editingCategory.isActive})}
                        >
                          {editingCategory.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          <button 
                            className="p-1 text-gray-500 hover:text-[#901420]"
                            onClick={() => handleMoveCategory(category.id, 'up')}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-[#901420]"
                            onClick={() => handleMoveCategory(category.id, 'down')}
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button 
                            className="p-1 bg-[#901420] text-white rounded"
                            onClick={() => handleSaveEdit(category.id)}
                          >
                            <Save size={16} />
                          </button>
                          <button 
                            className="p-1 bg-gray-200 text-gray-700 rounded"
                            onClick={handleCancelEdit}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: category.color }}></div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{category.name}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories.map((subcat, index) => (
                            <span key={index} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                              {subcat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{category.articles}</td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          className={`px-2 py-1 rounded-full text-xs ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                          onClick={() => handleToggleActive(category.id)}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-1">
                          <button 
                            className="p-1 text-gray-500 hover:text-[#901420]"
                            onClick={() => handleMoveCategory(category.id, 'up')}
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-[#901420]"
                            onClick={() => handleMoveCategory(category.id, 'down')}
                          >
                            <ArrowDown size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button 
                            className="p-1 text-gray-500 hover:text-[#901420]"
                            onClick={() => setEditingCategory({...category})}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            className="p-1 text-gray-500 hover:text-red-500"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Add Category Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Category</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsAdding(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input 
                  type="color" 
                  className="w-full h-10 border-0 rounded cursor-pointer" 
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({...newCategory, color: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2" 
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  placeholder="Category Description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategories</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newCategory.subcategories.map((subcat, index) => (
                    <div key={index} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      {subcat}
                      <button 
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveSubcategory(index, true)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="border rounded px-3 py-2 flex-1" 
                    placeholder="Add subcategory"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSubcategory()}
                  />
                  <button 
                    className="bg-gray-100 px-3 py-2 rounded"
                    onClick={handleAddSubcategory}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                className="px-4 py-2 border rounded hover:bg-gray-50"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-[#901420] text-white rounded hover:bg-[#7d1119]"
                onClick={handleAddNewCategory}
                disabled={!newCategory.name}
              >
                Create Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}