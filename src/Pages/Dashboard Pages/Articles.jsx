import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, User, Tag, Clock, ArrowRight, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { 
  Pagination, Box, CircularProgress, Typography, Button, 
  Grid, Card, CardMedia, CardContent, CardActions, Chip, IconButton, Paper, 
  OutlinedInput, InputAdornment, Stack, Skeleton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import api from '../../api/axiosInstance';
import { NewArticleForm } from './Components/NewArticleForm';

const ArticlesUI = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('সমস্ত');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 7;
  const navigate = useNavigate();


  // Fetch articles from API
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get(`/api/articles`, {
        withCredentials: true,
      });
      setArticles(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Get unique categories from articles
  let categories = Array.from(new Set(articles.flatMap(article => Array.isArray(article.category) ? article.category : [article.category]))).filter(Boolean);
  categories = categories.filter(cat => cat !== 'general' && cat !== 'খেলা প্রযুক্তি');
  // Add 'khela', 'projukti', 'খেলা', and 'প্রযুক্তি' if not already present
  if (!categories.includes('খেলা')) categories.push('খেলা');
  if (!categories.includes('প্রযুক্তি')) categories.push('প্রযুক্তি');
  categories.unshift('সমস্ত');

  // Filter articles based on search term and category
  const filteredArticles = articles.filter(article => {
    const articleCategory = Array.isArray(article.category) ? article.category[0] : article.category;
    const matchesSearch = (article.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (article.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (article.author?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesCategory = selectedCategory === 'সমস্ত' || articleCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to first page when search term or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleCreateArticle = () => {
    navigate('/dashboard/post-content');
  };

  const handleEditArticle = (article) => {
    navigate('/dashboard/post-content', { state: { editData: article } });
  };

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteArticle = async () => {
    if (!articleToDelete) return;
    try {
      await api.delete(`/api/articles/${articleToDelete._id}`, {
        withCredentials: true,
      });
      fetchArticles(); // Refresh the list
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  const handleSaveArticle = (savedArticle) => {
    setShowForm(false);
    setEditingArticle(null);
    fetchArticles(); // Refresh the list
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingArticle(null);
  };

  // Loading state handled inline
  // Error state
  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <div className="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <Typography variant="h6" color="#111827" mb={1} fontWeight={600}>Error loading articles</Typography>
          <Typography color="#64748b" mb={3}>{error}</Typography>
          <Button 
            onClick={() => window.location.reload()}
            variant="contained"
            sx={{ 
              bgcolor: '#CA0019', 
              boxShadow: 'none',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#b71c1c', boxShadow: 'none' } 
            }}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  // Show form if needed
  if (showForm) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 4, px: { xs: 2, md: 4 } }}>
        <NewArticleForm
          inline={true}
          editData={editingArticle}
          editType={editingArticle?.type}
          articleType={editingArticle?.type || 'article'}
          onSuccess={handleSaveArticle}
          onClose={handleCancelForm}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Unified Header & Filter Section */}
      <Paper elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', bgcolor: 'white', borderRadius: 2 }}>
        <Box sx={{ width: '100%', px: { xs: 2, sm: 4, lg: 6 }, pt: 3, pb: 3 }}>
          
          {/* Top Row: Title and Actions */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 4 }}>
            <Box>
              <Typography variant="h5" fontWeight={800} color="#111827">Published Articles</Typography>
              <Typography variant="body2" color="#64748b" sx={{ mt: 0.5 }}>Manage and filter your content repository</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label={`${loading ? '...' : filteredArticles.length} Articles`} sx={{ bgcolor: 'rgba(202, 0, 25, 0.1)', color: '#CA0019', fontWeight: 600, borderRadius: 1 }} />
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={handleCreateArticle}
                sx={{ 
                  bgcolor: '#CA0019', 
                  boxShadow: '0 4px 12px rgba(202, 0, 25, 0.2)',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 1,
                  '&:hover': { bgcolor: '#b71c1c', boxShadow: '0 6px 16px rgba(202, 0, 25, 0.3)' } 
                }}
              >
                Create Article
              </Button>
            </Box>
          </Box>

          {/* Bottom Row: Search and Categories */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'stretch', md: 'center' }, gap: 3 }}>
            {/* Search Bar */}
            <TextField
              variant="outlined"
              size="small"
              label="Search articles"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="#94a3b8" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                flex: 1, 
                maxWidth: { xs: '100%', md: 350 },
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '&.Mui-focused fieldset': {
                    borderColor: '#CA0019',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#CA0019',
                }
              }}
            />

            {/* Category Filter */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
              {categories.map(category => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => setSelectedCategory(category)}
                  sx={{ 
                    fontWeight: 600,
                    px: 1,
                    py: 2,
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    bgcolor: selectedCategory === category ? '#CA0019' : 'transparent',
                    color: selectedCategory === category ? 'white' : '#64748b',
                    border: selectedCategory === category ? '1px solid #CA0019' : '1px solid #e2e8f0',
                    '&:hover': {
                      bgcolor: selectedCategory === category ? '#b71c1c' : '#f8fafc',
                    }
                  }}
                />
              ))}
            </Box>
          </Box>

        </Box>
      </Paper>

      <Box sx={{ width: '100%', px: { xs: 2, sm: 4, lg: 6 }, pt: 4, backgroundColor: 'transparent' }}>

        {/* Articles List View */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
            <CircularProgress size={40} sx={{ color: '#CA0019' }} />
          </Box>
        ) : (
          <Stack spacing={3}>
            {currentArticles.map(article => (
              <Card 
                key={article._id} 
                elevation={0} 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  borderRadius: 2, 
                  border: '1px solid rgba(0,0,0,0.08)', 
                  overflow: 'hidden', 
                  transition: 'all 0.2s ease', 
                  '&:hover': { 
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    borderColor: 'rgba(202, 0, 25, 0.2)'
                  } 
                }}
              >
                {/* Image Section */}
                <Box sx={{ width: { xs: '100%', sm: 260 }, minWidth: { sm: 260 }, position: 'relative' }}>
                  <CardMedia 
                    component="img" 
                    sx={{ height: { xs: 200, sm: '100%' }, objectFit: 'cover' }} 
                    image={article.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop'} 
                    alt={article.title}
                  />
                  <Chip 
                    label={Array.isArray(article.category) ? article.category[0] : article.category} 
                    size="small" 
                    sx={{ position: 'absolute', top: 16, left: 16, bgcolor: '#CA0019', color: 'white', fontWeight: 600, borderRadius: 1.5 }} 
                  />
                </Box>

                {/* Content Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 1 }}>
                    <Typography variant="h6" fontWeight={700} color="#111827" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
                      {article.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                      <IconButton size="small" onClick={() => handleEditArticle(article)} sx={{ color: '#64748b', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', '&:hover': { color: '#0f172a', bgcolor: '#e2e8f0' } }}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteClick(article)} sx={{ color: '#CA0019', bgcolor: 'rgba(202,0,25,0.05)', border: '1px solid rgba(202,0,25,0.1)', '&:hover': { bgcolor: 'rgba(202,0,25,0.1)' } }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="#64748b" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.content ? article.content.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') : ''}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {article.tags && article.tags.slice(0, 3).map(tag => (
                      <Chip key={tag} label={tag} size="small" sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500, fontSize: '0.7rem' }} />
                    ))}
                    {article.tags && article.tags.length > 3 && (
                      <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>+{article.tags.length - 3} more</Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: 'auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                        <User size={14} />
                        <Typography variant="caption" fontWeight={600}>{article.author || 'Admin'}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                        <Calendar size={14} />
                        <Typography variant="caption" fontWeight={600}>{formatDate(article.createdAt)}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
                      {article.trending && <Chip label="Trending" size="small" sx={{ bgcolor: 'rgba(249, 115, 22, 0.1)', color: '#ea580c', fontWeight: 600, fontSize: '0.65rem' }} />}
                      {article.editorsChoice && <Chip label="Editor's Choice" size="small" sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#2563eb', fontWeight: 600, fontSize: '0.65rem' }} />}
                      {article.latestNews && <Chip label="Latest News" size="small" sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', fontWeight: 600, fontSize: '0.65rem' }} />}
                    </Box>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Pagination 
              count={totalPages} 
              page={currentPage} 
              onChange={(event, value) => paginate(value)} 
              sx={{
                '& .MuiPaginationItem-root': { color: '#64748b', fontWeight: 600 },
                '& .Mui-selected': { bgcolor: '#CA0019 !important', color: 'white', '&:hover': { bgcolor: '#b71c1c !important' } }
              }}
            />
          </Box>
        )}

        {/* No Results */}
        {!loading && filteredArticles.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Search size={64} color="#cbd5e1" style={{ margin: '0 auto', marginBottom: 16 }} />
            <Typography variant="h5" color="#111827" fontWeight={600} mb={1}>No articles found</Typography>
            <Typography color="#64748b">Try adjusting your search terms or category filter.</Typography>
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: 1, padding: 1, minWidth: { xs: 300, sm: 400 } } }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: '#111827', pb: 1 }}>
            Delete Article
          </DialogTitle>
          <DialogContent>
            <Typography color="#475569">
              Are you sure you want to delete <Typography component="span" fontWeight={700}>"{articleToDelete?.title}"</Typography>? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none', px: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDeleteArticle} 
              variant="contained"
              startIcon={<Trash2 size={16} />}
              sx={{ bgcolor: '#CA0019', '&:hover': { bgcolor: '#b71c1c' }, fontWeight: 600, textTransform: 'none', borderRadius: 1, px: 3, boxShadow: 'none' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ArticlesUI;