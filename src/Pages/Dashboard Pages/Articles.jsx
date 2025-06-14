import React, { useState } from 'react';
import { Search, Calendar, User, Tag, Clock, ArrowRight } from 'lucide-react';

const ArticlesUI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sample articles data
  const articles = [
    {
      id: 1,
      title: "The Future of Web Development: Trends to Watch in 2025",
      excerpt: "Exploring the latest technologies and frameworks that are shaping the future of web development, from AI integration to advanced performance optimization.",
      author: "Sarah Johnson",
      date: "2025-06-10",
      category: "Technology",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      tags: ["Web Dev", "AI", "Trends"]
    },
    {
      id: 2,
      title: "Building Scalable Applications with Modern Architecture",
      excerpt: "A comprehensive guide to designing and implementing scalable applications using microservices, cloud infrastructure, and best practices.",
      author: "Michael Chen",
      date: "2025-06-08",
      category: "Architecture",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
      tags: ["Architecture", "Scalability", "Cloud"]
    },
    {
      id: 3,
      title: "UX Design Principles That Actually Matter",
      excerpt: "Understanding the fundamental principles of user experience design that create meaningful and intuitive digital products.",
      author: "Emily Rodriguez",
      date: "2025-06-06",
      category: "Design",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      tags: ["UX", "Design", "Principles"]
    },
    {
      id: 4,
      title: "Data Science in Practice: Real-World Applications",
      excerpt: "Exploring how data science is being applied across different industries to solve complex problems and drive innovation.",
      author: "David Kumar",
      date: "2025-06-04",
      category: "Data Science",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      tags: ["Data Science", "Analytics", "Innovation"]
    },
    {
      id: 5,
      title: "Cybersecurity Best Practices for Modern Businesses",
      excerpt: "Essential security measures and strategies that every business should implement to protect against evolving cyber threats.",
      author: "Lisa Thompson",
      date: "2025-06-02",
      category: "Security",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=250&fit=crop",
      tags: ["Security", "Business", "Best Practices"]
    },
    {
      id: 6,
      title: "Machine Learning for Beginners: A Practical Guide",
      excerpt: "A step-by-step introduction to machine learning concepts, algorithms, and practical implementation for newcomers to the field.",
      author: "Alex Park",
      date: "2025-05-30",
      category: "Technology",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop",
      tags: ["ML", "AI", "Beginner"]
    }
  ];

  const categories = ['All', ...new Set(articles.map(article => article.category))];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Published Articles</h1>
              <p className="mt-2 text-gray-600">Discover insights, tutorials, and industry expertise</p>
            </div>
            <div className="bg-red-800 text-white px-4 py-2 rounded-lg font-medium">
              {filteredArticles.length} Articles
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-6">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-800 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-200"
            >
              {/* Article Image */}
              <div className="relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-800 transition-colors line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(article.date)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {article.readTime}
                  </div>
                </div>

                {/* Read More Button */}
                <button className="w-full bg-red-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-900 transition-colors flex items-center justify-center group">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Article Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticlesUI;