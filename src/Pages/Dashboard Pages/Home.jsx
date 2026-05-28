"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  Tag,
  Save,
  X,
  ImageIcon,
  Video,
  RefreshCw,
  User,
  LogOut,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import api from "../../api/axiosInstance";

import { NewArticleForm } from './Components/NewArticleForm';
import { StatCard } from './Components/StatCard';
import { ArticleTypeBadge } from './Components/ArticleTypeBadge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { useNavigate } from "react-router-dom";

const NewsAdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData, isLoading: contextLoading } = useSelector((state) => state.auth);

  // State management
  const [showNewArticleForm, setShowNewArticleForm] = useState(false);
  const [articleType, setArticleType] = useState("regular");
  const [recentArticles, setRecentArticles] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editArticle, setEditArticle] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
    type: null,
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [dbStats, setDbStats] = useState(null);
  // Stats cards data
  const stats = [
    {
      title: "Total Articles",
      value: recentArticles
        .filter((item) => item.type === "article")
        .length.toString(),
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Live News",
      value: recentArticles
        .filter((item) => item.type === "live")
        .length.toString(),
      change: "+18%",
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "Breaking News",
      value: recentArticles
        .filter((item) => item.type === "breaking")
        .length.toString(),
      change: "+7%",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Videos",
      value: recentArticles
        .filter((item) => item.type === "video")
        .length.toString(),
      change: "+23%",
      icon: Video,
      color: "text-purple-600",
    },
  ];
  // Handle logout with proper error handling
  const handleLogout = async () => {
    try {
      console.log("Logout button clicked");
      setShowUserMenu(false);
      await dispatch(logoutUser());
      console.log("Logout completed");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Fetch recent articles from backend
  const fetchRecentArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all content types with proper error handling
      const fetchWithFallback = async (url, type) => {
        try {
          const response = await api.get(url);
          const data = response.data;

          // Handle different response structures
          if (Array.isArray(data)) {
            return data;
          } else if (data.data && Array.isArray(data.data)) {
            return data.data;
          } else if (data.articles && Array.isArray(data.articles)) {
            return data.articles;
          } else if (data.videos && Array.isArray(data.videos)) {
            return data.videos;
          } else if (data.news && Array.isArray(data.news)) {
            return data.news;
          } else {
            console.warn(`Unexpected ${type} response structure:`, data);
            return [];
          }
        } catch (error) {
          console.warn(`Error fetching ${type}:`, error);
          return [];
        }
      };

      // Fetch all content types
      const [articles, liveNews, breakingNews, videos] = await Promise.all([
        fetchWithFallback(`/api/articles`, "articles"),
        fetchWithFallback(`/api/live-news`, "live-news"),
        fetchWithFallback(`/api/breaking-news`, "breaking-news"),
        fetchWithFallback(`/api/videos`, "videos"),
      ]);

      // Combine all content with type labels
      const combined = [
        ...articles.map((item) => ({ ...item, type: "article" })),
        ...liveNews.map((item) => ({ ...item, type: "live" })),
        ...breakingNews.map((item) => ({ ...item, type: "breaking" })),
        ...videos.map((item) => ({ ...item, type: "video" })),
      ].sort(
        (a, b) =>
          new Date(b.createdAt || b.date || Date.now()) -
          new Date(a.createdAt || a.date || Date.now())
      );

      setRecentArticles(combined);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error(
        "Failed to fetch content. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch DB Stats
  const fetchDbStats = async () => {
    try {
      const response = await api.get(`/api/system/db-stats`, {
        withCredentials: true,
      });
      setDbStats(response.data);
    } catch (error) {
      console.warn("Error fetching DB stats:", error);
    }
  };

  useEffect(() => {
    fetchRecentArticles();
    fetchDbStats();
  }, []);

  // Delete article handler
  const handleDeleteArticle = (id, type) => {
    setDeleteDialog({ open: true, id, type });
  };

  // Confirm delete
  const confirmDelete = async () => {
    const { id, type } = deleteDialog;
    if (!id) return;

    try {
      let endpoint = `/api/articles/${id}`;
      if (type === "live") endpoint = `/api/live-news/${id}`;
      if (type === "breaking")
        endpoint = `/api/breaking-news/${id}`;
      if (type === "video") endpoint = `/api/videos/${id}`;

      console.log(`Deleting ${type} with ID: ${id} from endpoint: ${endpoint}`);

      const startTime = Date.now();
      await api.delete(endpoint);
      const endTime = Date.now();

      console.log(`Delete operation took ${endTime - startTime}ms`);

      setRecentArticles((prev) => prev.filter((item) => item._id !== id));
      console.log("Item deleted successfully");
      toast.success("Item Deleted Successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
      if (error.response?.status === 404) {
        toast.error("Item not found. It may have already been deleted.");
        // Remove from UI anyway since it doesn't exist
        setRecentArticles((prev) => prev.filter((item) => item._id !== id));
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this item.");
      } else if (error.response?.status === 500) {
        toast.error("Server error occurred while deleting. Please try again.");
      } else {
        toast.error("Failed to Delete Item. Please Try Again.");
      }
    } finally {
      setDeleteDialog({ open: false, id: null, type: null });
    }
  };

  // Reset form function
  const resetForm = () => {
    // Clear all file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      input.value = "";
    });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recentArticles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(recentArticles.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Dynamic Top Performers
  const dynamicTopPerformers = [...recentArticles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  // Monthly Views Data
  const currentYear = new Date().getFullYear();
  const monthlyViews = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = months.map(month => ({ name: month, views: 0 }));

    recentArticles.forEach(article => {
      if (!article.createdAt && !article.date) return;
      const date = new Date(article.createdAt || article.date);
      // Only show real data for the current year
      if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        data[monthIndex].views += (article.views || 0);
      }
    });

    return data;
  }, [recentArticles, currentYear]);

  // Content Breakdown Data
  const contentBreakdownData = useMemo(() => {
    let articles = 0;
    let videos = 0;
    let live = 0;
    let breaking = 0;

    recentArticles.forEach(item => {
      if (item.type === "article") articles++;
      else if (item.type === "video") videos++;
      else if (item.type === "live") live++;
      else if (item.type === "breaking") breaking++;
    });

    return [
      { name: "Articles", value: articles, color: "#ca0019" },
      { name: "Videos", value: videos, color: "#1e3a8a" },
      { name: "Live", value: live, color: "#16a34a" },
      { name: "Breaking", value: breaking, color: "#ea580c" },
    ].filter(item => item.value > 0);
  }, [recentArticles]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Main content area */}
        <Box component="main" sx={{ flex: 1 }}>
          {/* Stats cards */}
          {/* <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                <StatCard stat={stat} />
              </Grid>
            ))}
          </Grid> */}

          {/* Dashboard Middle Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Left Column: Views Chart */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom sx={{ mb: 3 }}>
                  Views Overview ({currentYear})
                </Typography>
                <Box sx={{ flex: 1, minHeight: 300, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyViews} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ca0019" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ca0019" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dx={-10}
                        tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{ stroke: 'rgba(202,0,25,0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stroke="#ca0019"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorViews)"
                        activeDot={{ r: 6, fill: '#ca0019', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Middle Column: Content Breakdown & Storage */}
            <Grid size={{ xs: 12, lg: 2 }} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Content Mix */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderTop: '4px solid #ca0019',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom sx={{ mb: 1 }}>
                  Content Mix
                </Typography>
                <Box sx={{ flex: 1, minHeight: 200, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {contentBreakdownData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={contentBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {contentBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          itemStyle={{ color: '#111827', fontWeight: 600 }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography color="text.secondary" variant="body2">No data available</Typography>
                  )}
                </Box>
              </Paper>

              {/* DB Storage Widget */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(202, 0, 25, 0.2)',
                  bgcolor: '#ca0019',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>
                  Database Storage
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="h5" fontWeight="900" sx={{ color: 'white' }}>
                    {dbStats ? (dbStats.totalSize / (1024 * 1024)).toFixed(2) : "0.00"} MB
                  </Typography>
                  <Typography variant="caption" fontWeight={600} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    / 512 MB
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 6, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ width: `${dbStats ? Math.min((dbStats.totalSize / (1024 * 1024 * 512)) * 100, 100) : 0}%`, height: '100%', bgcolor: 'white', borderRadius: 3 }} />
                </Box>
                <Typography variant="caption" sx={{ mt: 1, color: 'white', fontWeight: 600 }}>
                  {dbStats ? ((dbStats.totalSize / (1024 * 1024 * 512)) * 100).toFixed(2) : "0"}% Used
                </Typography>
              </Paper>
            </Grid>

            {/* Right Column: Top Performers */}
            <Grid size={{ xs: 12, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: '#121212',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: 420,
                  ml: 'auto',
                  width: '100%'
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3, color: 'white' }}>
                  Top Performers
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', pt: 1 }}>
                  {dynamicTopPerformers.map((article, index) => (
                    <Box
                      key={article._id || index}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        pb: 2.5,
                        mb: 2.5,
                        borderBottom: index !== dynamicTopPerformers.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none'
                      }}
                    >
                      <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: index === 0 ? '#ca0019' : 'rgba(255,255,255,0.1)', color: index === 0 ? 'white' : 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem', flexShrink: 0 }}>
                        {index + 1}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500, mb: 0.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                            {article.views ? article.views.toLocaleString() : "0"} views
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <FileText size={12} />
                            {article.type}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Articles Table */}
          <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  Recent Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {recentArticles.length} items total
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => {
                  navigate('/dashboard/post-content');
                }}
                sx={{
                  textTransform: "none",
                  bgcolor: '#CA0019',
                  boxShadow: '0 4px 12px rgba(202, 0, 25, 0.2)',
                  borderRadius: 1.25,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    bgcolor: '#b71c1c',
                    boxShadow: '0 6px 16px rgba(202, 0, 25, 0.3)',
                  }
                }}
              >
                New Content
              </Button>
            </Box>

            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 2 }}>Type</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 2 }}>Title</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 2 }}>Author</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 2 }}>Status</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 2 }}>Views</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 2 }}>Date</TableCell>
                    <TableCell align="right" sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', py: 2, pr: 4 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={32} sx={{ color: '#CA0019', mb: 2 }} />
                        <Typography color="text.secondary">Loading content...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <AlertTriangle size={32} color="#CA0019" style={{ margin: '0 auto', marginBottom: 8 }} />
                        <Typography color="error.main" fontWeight={500} mb={1}>{error}</Typography>
                        <Button onClick={fetchRecentArticles} color="primary" sx={{ color: '#CA0019' }}>Try Again</Button>
                      </TableCell>
                    </TableRow>
                  ) : recentArticles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <FileText size={48} color="#e0e0e0" style={{ margin: '0 auto', marginBottom: 16 }} />
                        <Typography variant="h6" color="text.primary" mb={1}>No content found</Typography>
                        <Typography color="text.secondary" mb={3}>Start by creating your first article</Typography>
                        <Button
                          variant="contained"
                          onClick={() => {
                            navigate('/dashboard/post-content');
                          }}
                          sx={{ bgcolor: '#CA0019', '&:hover': { bgcolor: '#b71c1c' } }}
                        >
                          Create Article
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((article) => (
                      <TableRow 
                        key={article._id} 
                        hover 
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background-color 0.2s ease',
                          '&:hover': { bgcolor: 'rgba(202, 0, 25, 0.02) !important' }
                        }}
                      >
                        <TableCell sx={{ py: 2 }}>
                          <ArticleTypeBadge type={article.type} />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant="body2" fontWeight={600} color="#111827" sx={{ maxWidth: { xs: 150, md: 250 }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {article.title}
                          </Typography>
                          {article.category && (
                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500, display: 'block', mt: 0.5 }}>
                              {article.category}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ color: '#475569', py: 2 }}>
                          {article.author || article.reporter || "-"}
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Chip
                            label={article.status || "Published"}
                            size="small"
                            sx={{
                              bgcolor: article.status === "Published" || !article.status ? 'rgba(22, 163, 74, 0.1)' : article.status === "Draft" ? 'rgba(234, 179, 8, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                              color: article.status === "Published" || !article.status ? '#16a34a' : article.status === "Draft" ? '#eab308' : '#3b82f6',
                              fontWeight: 600,
                              borderRadius: 1.5
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', fontWeight: 600, py: 2 }}>
                          {article.views ? article.views.toLocaleString() : "0"}
                        </TableCell>
                        <TableCell sx={{ color: '#64748b', py: 2 }}>
                          {new Date(article.createdAt || article.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2, pr: 3 }}>
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigate('/dashboard/post-content', { state: { editData: article } });
                              }}
                              sx={{ 
                                color: '#64748b', 
                                bgcolor: 'transparent', 
                                borderRadius: '50%',
                                '&:hover': { color: '#0f172a', bgcolor: 'rgba(15, 23, 42, 0.08)' } 
                              }}
                            >
                              <Edit size={18} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteArticle(article._id, article.type)}
                              sx={{ 
                                color: '#CA0019', 
                                bgcolor: 'transparent', 
                                borderRadius: '50%',
                                '&:hover': { color: '#b71c1c', bgcolor: 'rgba(202, 0, 25, 0.08)' } 
                              }}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => paginate(value)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'text.secondary',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    },
                    '& .Mui-selected': {
                      bgcolor: '#991b1b !important', // Tailwind red-800 to match the image theme
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#7f1d1d !important',
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* New Article Form Modal */}
      {showNewArticleForm && (
        <NewArticleForm articleType={articleType} onSuccess={fetchRecentArticles}
          onClose={() => {
            setShowNewArticleForm(false);
            setEditArticle(null);
          }}
          editData={editArticle}
          editType={editArticle ? editArticle.type : null}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-3 md:mb-4 text-gray-900">
              Delete Content
            </h2>
            <p className="mb-4 md:mb-6 text-gray-700">
              Are you sure you want to delete this content? This action cannot
              be undone.
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() =>
                  setDeleteDialog({ open: false, id: null, type: null })
                }
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </Box>
  );
};

export default NewsAdminDashboard;