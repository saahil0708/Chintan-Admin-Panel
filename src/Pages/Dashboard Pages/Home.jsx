"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppContext } from "../../Context/AppContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const NewsAdminDashboard = () => {
  const {
    backendURL,
    userData,
    logout,
    isLoading: contextLoading,
  } = useAppContext();

  // State management
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [chartType, setChartType] = useState("line");
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

  // Chart data
  const chartData = {
    "7d": [
      { date: "Jun 8", views: 12400, articles: 8, engagement: 6.2 },
      { date: "Jun 9", views: 15600, articles: 12, engagement: 7.1 },
      { date: "Jun 10", views: 18200, articles: 15, engagement: 8.3 },
      { date: "Jun 11", views: 22100, articles: 18, engagement: 9.1 },
      { date: "Jun 12", views: 25300, articles: 14, engagement: 8.7 },
      { date: "Jun 13", views: 28700, articles: 16, engagement: 9.4 },
      { date: "Jun 14", views: 31200, articles: 19, engagement: 10.2 },
    ],
    "30d": [
      { date: "Week 1", views: 85000, articles: 42, engagement: 7.8 },
      { date: "Week 2", views: 92000, articles: 48, engagement: 8.2 },
      { date: "Week 3", views: 98000, articles: 51, engagement: 8.9 },
      { date: "Week 4", views: 105000, articles: 45, engagement: 9.3 },
    ],
    "90d": [
      { date: "Month 1", views: 320000, articles: 185, engagement: 8.1 },
      { date: "Month 2", views: 380000, articles: 201, engagement: 8.7 },
      { date: "Month 3", views: 420000, articles: 218, engagement: 9.2 },
    ],
  };

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

  // Top performing articles
  const topPerformers = [
    {
      title: "AI Revolution in Healthcare",
      views: "45.2K",
      engagement: "8.4%",
    },
    { title: "Climate Change Solutions", views: "38.7K", engagement: "7.2%" },
    { title: "Stock Market Trends", views: "32.1K", engagement: "6.8%" },
    { title: "Tech Industry Updates", views: "28.9K", engagement: "6.1%" },
  ];

  // Handle logout with proper error handling
  const handleLogout = async () => {
    try {
      console.log("Logout button clicked");
      setShowUserMenu(false);
      await logout();
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
      console.log("Fetching articles from backend...");

      // Fetch all content types with proper error handling
      const fetchWithFallback = async (url, type) => {
        try {
          const response = await axios.get(url, {
            withCredentials: true,
          });
          const data = response.data;
          console.log(`${type} response:`, data);

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
        fetchWithFallback(`${backendURL}/api/articles`, "articles"),
        fetchWithFallback(`${backendURL}/api/live-news`, "live-news"),
        fetchWithFallback(`${backendURL}/api/breaking-news`, "breaking-news"),
        fetchWithFallback(`${backendURL}/api/videos`, "videos"),
      ]);

      console.log("Fetched data:", {
        articles,
        liveNews,
        breakingNews,
        videos,
      });

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

      console.log("Combined articles:", combined);
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

  useEffect(() => {
    fetchRecentArticles();
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
      let endpoint = `${backendURL}/api/articles/${id}`;
      if (type === "live") endpoint = `${backendURL}/api/live-news/${id}`;
      if (type === "breaking")
        endpoint = `${backendURL}/api/breaking-news/${id}`;
      if (type === "video") endpoint = `${backendURL}/api/videos/${id}`;

      console.log(`Deleting ${type} with ID: ${id} from endpoint: ${endpoint}`);

      const startTime = Date.now();
      await axios.delete(endpoint, {
        withCredentials: true,
      });
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

  // Article Form Component
  const NewArticleForm = ({ onClose, editData, editType }) => {
    // Form states
    const [formData, setFormData] = useState(
      editData && editType === "article"
        ? {
            title: editData.title || "",
            content: editData.content || "",
            author: editData.author || "",
            category: editData.category || "",
            trending: editData.trending || false,
            editorsChoice: editData.editorsChoice || false,
            latestNews: editData.latestNews || false,
            tags: editData.tags || [],
            imageTitle: editData.imageTitle || "",
            newTag: "",
          }
        : {
            title: "",
            content: "",
            author: "",
            category: "",
            trending: false,
            editorsChoice: false,
            latestNews: false,
            tags: [],
            imageTitle: "",
            newTag: "",
          }
    );

    const [liveHeadlines, setLiveHeadlines] = useState(
      editData && editType === "live" ? [editData.title || ""] : [""]
    );

    const [breakingData, setBreakingData] = useState(
      editData && editType === "breaking"
        ? {
            title: editData.title || "",
            description: editData.description || "",
            imageUrl: editData.imageUrl || "",
            reporter: editData.reporter || "",
            designation: editData.designation || "",
            category: editData.category || "",
          }
        : {
            title: "",
            description: "",
            imageUrl: "",
            reporter: "",
            designation: "",
            category: "",
          }
    );

    // Video form data
    const [videoData, setVideoData] = useState(
      editData && editType === "video"
        ? {
            title: editData.title || "",
            duration: editData.duration || "",
          }
        : {
            title: "",
            duration: "",
          }
    );

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(
      editData?.imageUrl || null
    );
    const [isUploading, setIsUploading] = useState(false);

    // Local video states for proper isolation
    const [localVideoFile, setLocalVideoFile] = useState(null);
    const [localVideoPreview, setLocalVideoPreview] = useState(null);

    // Breaking news image upload
    const uploadBreakingNewsImage = async (breakingNewsId, imageFile) => {
      if (!imageFile || !breakingNewsId) return null;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await axios.post(
          `${backendURL}/api/breaking-news/${breakingNewsId}/image`,
          formData,
          {
            withCredentials: true,
          }
        );

        return response.data.imageUrl;
      } catch (error) {
        console.error("Error uploading breaking news image:", error);
        return null;
      } finally {
        setIsUploading(false);
      }
    };

    // Handlers
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };

    const handleVideoDataChange = (e) => {
      const { name, value } = e.target;
      setVideoData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleLiveHeadlineChange = (idx, value) => {
      setLiveHeadlines((headlines) =>
        headlines.map((h, i) => (i === idx ? value : h))
      );
    };

    const addLiveHeadline = () => setLiveHeadlines([...liveHeadlines, ""]);

    const removeLiveHeadline = (idx) =>
      setLiveHeadlines((headlines) => headlines.filter((_, i) => i !== idx));

    const handleBreakingChange = (e) => {
      const { name, value } = e.target;
      setBreakingData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log("Image file selected:", {
          name: file.name,
          size: file.size,
          type: file.type,
        });

        // Validate file type
        if (!file.type.match("image.*")) {
          toast.error("Please Select an image file (JPEG, PNG, GIF)");
          return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Image size must be less than 5MB");
          return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleVideoFileChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file type
        if (!file.type.match("video.*")) {
          toast.error("Please select a video file (MP4, MOV, AVI)");
          return;
        }

        // Validate file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
          toast.error("Video size must be less than 50MB");
          return;
        }

        setLocalVideoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalVideoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleTagAdd = (e) => {
      e.preventDefault();
      if (
        formData.newTag.trim() &&
        !formData.tags.includes(formData.newTag.trim())
      ) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, prev.newTag.trim()],
          newTag: "",
        }));
      }
    };

    const handleTagRemove = (tagToRemove) => {
      setFormData((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove),
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const type = editType || articleType;

      if (type === "video" && !localVideoFile) {
        toast.error("Please select a video file to upload");
        return;
      }

      console.log("=== FORM SUBMISSION START ===");
      console.log("Article type:", type);

      try {
        setIsPosting(true);

        // Handle video upload
        if (type === "video") {
          if (!localVideoFile) {
            toast.error("Please select a video file to upload");
            return;
          }

          if (!videoData.title.trim()) {
            toast.error("Please enter a video title");
            return;
          }

          if (!videoData.duration.trim()) {
            toast.error("Please enter video duration");
            return;
          }

          try {
            const formData = new FormData();
            formData.append("video", localVideoFile);
            formData.append("title", videoData.title);
            formData.append("duration", videoData.duration);

            const response = await axios.post(
              `${backendURL}/api/videos`,
              formData,
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );

            const data = response.data.data || response.data;
            // Update UI with the new video
            setRecentArticles((prev) => [
              {
                ...data,
                type: "video",
                createdAt: new Date().toISOString(),
              },
              ...prev,
            ]);

            toast.success("Video Uploaded Successfully!");
            setShowNewArticleForm(false);
            resetForm(); // Clear form after successful upload
          } catch (error) {
            console.error("Error Uploading Video:", error);
            if (error.response?.status === 400) {
              toast.error(error.response.data.message || "Invalid video data");
            } else {
              toast.error("Error Uploading Video");
            }
          } finally {
            setIsPosting(false);
          }
          return;
        }

        // Handle breaking news with image upload
        if (type === "breaking") {
          const breakingPayload = {
            title: breakingData.title,
            description: breakingData.description,
            reporter: breakingData.reporter,
            designation: breakingData.designation,
            category: breakingData.category,
          };

          let breakingRes;

          if (editArticle) {
            // Update existing breaking news
            const response = await axios.put(
              `${backendURL}/api/breaking-news/${editArticle._id}`,
              breakingPayload,
              {
                withCredentials: true,
              }
            );
            breakingRes = { data: response.data };
          } else {
            // Create new breaking news
            const response = await axios.post(
              `${backendURL}/api/breaking-news`,
              breakingPayload,
              {
                withCredentials: true,
              }
            );
            breakingRes = { data: response.data };
          }

          const breakingId = editArticle
            ? editArticle._id
            : breakingRes.data._id;
          let imageUrl = breakingRes.data.imageUrl || "";

          // Upload image if provided
          if (imageFile) {
            const uploadedImageUrl = await uploadBreakingNewsImage(
              breakingId,
              imageFile
            );
            if (uploadedImageUrl) {
              imageUrl = uploadedImageUrl;
            }
          }

          // Update UI
          const newBreaking = {
            ...breakingRes.data,
            imageUrl,
            type: "breaking",
          };

          if (editArticle) {
            setRecentArticles((prev) =>
              prev.map((item) =>
                item._id === newBreaking._id ? newBreaking : item
              )
            );
            toast.success("Breaking News Updated!");
          } else {
            setRecentArticles((prev) => [newBreaking, ...prev]);
            toast.success("Breaking News Published!");
          }

          setShowNewArticleForm(false);
          setEditArticle(null);
          return;
        }

        // Handle live news
        if (type === "live") {
          console.log("Processing live news with headlines:", liveHeadlines);

          // Filter out empty headlines
          const validHeadlines = liveHeadlines.filter(
            (headline) => headline.trim() !== ""
          );

          if (validHeadlines.length === 0) {
            toast.error("Please add at least one headline");
            return;
          }

          console.log("Valid headlines to submit:", validHeadlines);

          // Submit each headline as a separate live news item
          const submissionPromises = validHeadlines.map(async (headline) => {
            const payload = { title: headline.trim() };
            console.log("Submitting headline:", payload);

            if (editArticle && validHeadlines.length === 1) {
              // If editing and only one headline, update the existing one
              const response = await axios.put(
                `${backendURL}/api/live-news/${editArticle._id}`,
                payload,
                {
                  withCredentials: true,
                }
              );
              return { data: response.data };
            } else {
              // Create new live news item
              const response = await axios.post(
                `${backendURL}/api/live-news`,
                payload,
                {
                  withCredentials: true,
                }
              );
              return { data: response.data };
            }
          });

          const responses = await Promise.all(submissionPromises);
          console.log("All live news responses:", responses);

          // Update UI with all new live news items
          const newLiveNews = responses.map((response) => ({
            ...response.data,
            type: "live",
          }));

          if (editArticle && validHeadlines.length === 1) {
            // Update existing item
            setRecentArticles((prev) =>
              prev.map((item) =>
                item._id === newLiveNews[0]._id ? newLiveNews[0] : item
              )
            );
            toast.success("Live News Updated!");
          } else {
            // Add new items
            setRecentArticles((prev) => [...newLiveNews, ...prev]);
            toast.success(
              `${validHeadlines.length} Live News Headlines Published!`
            );
          }

          setShowNewArticleForm(false);
          setEditArticle(null);
          return;
        }

        // Handle regular articles
        let endpoint = `${backendURL}/api/articles`;
        let method = "POST";
        if (editArticle) {
          endpoint = `${backendURL}/api/articles/${editArticle._id}`;
          method = "PUT";
        }

        console.log("API endpoint:", endpoint);
        console.log("HTTP method:", method);

        // Regular article payload
        const payload = {
          title: formData.title,
          content: formData.content,
          author: formData.author || "Unknown",
          category: formData.category || "general",
          tags: formData.tags || [],
          trending: formData.trending || false,
          editorsChoice: formData.editorsChoice || false,
          latestNews: formData.latestNews || false,
          imageTitle: formData.imageTitle || "",
        };

        console.log("Article payload:", payload);

        // Submit article
        const response = await axios({
          method: method,
          url: endpoint,
          data: payload,
          withCredentials: true,
        });

        const responseData = response.data;
        console.log("Article creation response:", responseData);

        const finalArticle = { ...responseData, type: "article" };

        // Upload image for regular articles if provided
        if (imageFile) {
          const articleId = editArticle ? editArticle._id : responseData._id;
          console.log("=== STARTING IMAGE UPLOAD ===");
          console.log("Article ID:", articleId);

          const imageFormData = new FormData();
          imageFormData.append("image", imageFile);

          // Add imageTitle if provided
          if (formData.imageTitle) {
            imageFormData.append("imageTitle", formData.imageTitle);
          }

          try {
            setIsUploading(true);
            console.log(
              "Making image upload request to:",
              `${backendURL}/api/articles/${articleId}/image`
            );

            const imageResponse = await axios.post(
              `${backendURL}/api/articles/${articleId}/image`,
              imageFormData,
              {
                withCredentials: true,
              }
            );

            const imageData = imageResponse.data;
            console.log("=== IMAGE UPLOAD SUCCESS ===");
            console.log("Image upload response:", imageData);

            if (imageData.success && imageData.imageUrl) {
              finalArticle.imageUrl = imageData.imageUrl;
              console.log("Final article with image:", finalArticle);
              console.log("Article and image uploaded successfully!");
            } else {
              console.error(
                "Image upload response missing imageUrl:",
                imageData
              );
              console.log(
                "Article created but image upload response was unexpected"
              );
            }
          } catch (imageError) {
            console.error("=== IMAGE UPLOAD ERROR ===");
            console.error("Error details:", imageError);
            console.log(
              `Article created but image upload failed: ${imageError.message}`
            );
          } finally {
            setIsUploading(false);
          }
        }

        // Update UI
        if (editArticle) {
          setRecentArticles((prev) =>
            prev.map((item) =>
              item._id === finalArticle._id ? finalArticle : item
            )
          );
          toast.success("Article Updated Successfully!");
        } else {
          setRecentArticles((prev) => [finalArticle, ...prev]);
          if (!imageFile) {
            toast.success("Article Published Successfully!");
          }
        }

        setShowNewArticleForm(false);
        setEditArticle(null);
      } catch (error) {
        console.error("=== FORM SUBMISSION ERROR ===");
        console.error("Error details:", error);
        toast.error("Error Publishing/Updating Content");
      } finally {
        setIsPosting(false);
        console.log("=== FORM SUBMISSION END ===");
      }
    };

    const handleClose = () => {
      resetForm();
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {(editData ? "Edit" : "Create New") +
                  " " +
                  ((editType || articleType) === "regular" ||
                  (editType || articleType) === "article"
                    ? "Article"
                    : (editType || articleType) === "live"
                    ? "Live News"
                    : (editType || articleType) === "breaking"
                    ? "Breaking News"
                    : "Video")}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => setArticleType("regular")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    (editType || articleType) === "regular" ||
                    (editType || articleType) === "article"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={!!editData}
                >
                  <FileText size={16} className="inline mr-1" />
                  Article
                </button>
                <button
                  onClick={() => setArticleType("live")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    (editType || articleType) === "live"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={!!editData}
                >
                  <Clock size={16} className="inline mr-1" />
                  Live News
                </button>
                <button
                  onClick={() => setArticleType("breaking")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    (editType || articleType) === "breaking"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={!!editData}
                >
                  <AlertTriangle size={16} className="inline mr-1" />
                  Breaking
                </button>
                <button
                  onClick={() => setArticleType("video")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    (editType || articleType) === "video"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={!!editData}
                >
                  <Video size={16} className="inline mr-1" />
                  Video
                </button>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            {/* Live News Form */}
            {(editType || articleType) === "live" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headlines *
                </label>
                {liveHeadlines.map((headline, idx) => (
                  <div key={idx} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) =>
                        handleLiveHeadlineChange(idx, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required={idx === 0} // Only first headline is required
                      placeholder={`Headline ${idx + 1}`}
                    />
                    {liveHeadlines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLiveHeadline(idx)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLiveHeadline}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  + Add Headline
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Each headline will be published as a separate live news item.
                  Empty headlines will be ignored.
                </p>
              </div>
            )}

            {/* Breaking News Form */}
            {(editType || articleType) === "breaking" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={breakingData.title}
                    onChange={handleBreakingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={breakingData.description}
                    onChange={handleBreakingChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                      {breakingData.imageUrl || imagePreview ? (
                        <div className="group relative">
                          <img
                            src={imagePreview || breakingData.imageUrl}
                            alt="Preview"
                            className="h-24 w-24 rounded-md object-cover border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                              if (!editData) {
                                setBreakingData((prev) => ({
                                  ...prev,
                                  imageUrl: "",
                                }));
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <ImageIcon size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="file"
                        id="breakingImage"
                        name="breakingImage"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="breakingImage"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer text-center"
                      >
                        {breakingData.imageUrl || imagePreview
                          ? "Change Image"
                          : "Upload Image"}
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF (Max: 5MB)
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    type="text"
                    name="category"
                    value={breakingData.category}
                    onChange={handleBreakingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="রাজ্য">রাজ্য</option>
                    <option value="দেশ">দেশ</option>
                    <option value="বিদেশ">বিদেশ</option>
                    <option value="খেলা">খেলা</option>
                    <option value="প্রযুক্তি">প্রযুক্তি</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reporter *
                  </label>
                  <input
                    type="text"
                    name="reporter"
                    value={breakingData.reporter}
                    onChange={handleBreakingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={breakingData.designation}
                    onChange={handleBreakingChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </>
            )}

            {/* Video Upload Form */}
            {(editType || articleType) === "video" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={videoData.title}
                    onChange={handleVideoDataChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="Enter video title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={videoData.duration}
                    onChange={handleVideoDataChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="e.g., 5:30 or 5 minutes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Upload *
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                      {localVideoPreview ? (
                        <div className="group relative">
                          <video
                            src={localVideoPreview}
                            className="h-24 w-24 rounded-md object-cover border border-gray-300"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setLocalVideoPreview(null);
                              setLocalVideoFile(null);
                              // Clear the file input
                              const fileInput =
                                document.getElementById("videoFile");
                              if (fileInput) fileInput.value = "";
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <Video size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="file"
                        id="videoFile"
                        name="videoFile"
                        onChange={handleVideoFileChange}
                        accept="video/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="videoFile"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer text-center"
                      >
                        {localVideoPreview ? "Change Video" : "Upload Video"}
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        MP4, MOV or AVI (Max: 50MB)
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Regular Article Form */}
            {((editType || articleType) === "regular" ||
              (editType || articleType) === "article") && (
              <>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Article Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                    placeholder="Write your content here..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Author *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="রাজ্য">রাজ্য</option>
                    <option value="দেশ">দেশ</option>
                    <option value="বিদেশ">বিদেশ</option>
                    <option value="খেলা">খেলা</option>
                    <option value="প্রযুক্তি">প্রযুক্তি</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Article Image
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                      {imagePreview || (editData && editData.imageUrl) ? (
                        <div className="group relative">
                          <img
                            src={imagePreview || editData?.imageUrl}
                            alt="Preview"
                            className="h-24 w-24 rounded-md object-cover border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <ImageIcon size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="image"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer text-center"
                      >
                        {imagePreview || (editData && editData.imageUrl)
                          ? "Change Image"
                          : "Upload Image"}
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF (Max: 5MB)
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <label
                      htmlFor="imageTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Image Title/Alt Text
                    </label>
                    <input
                      type="text"
                      id="imageTitle"
                      name="imageTitle"
                      value={formData.imageTitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Describe the image for accessibility"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1.5 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      id="newTag"
                      name="newTag"
                      value={formData.newTag}
                      onChange={handleChange}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                      <Tag size={16} className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Article Flags
                  </label>
                  <div className="flex flex-wrap gap-6">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="trending"
                        checked={formData.trending}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Trending
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="editorsChoice"
                        checked={formData.editorsChoice}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Editor's Choice
                      </span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="latestNews"
                        checked={formData.latestNews}
                        onChange={handleChange}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Latest News
                      </span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-800 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
                disabled={isPosting || isUploading}
              >
                {isPosting || isUploading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    {isUploading ? "Uploading..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-1" />
                    {(editData ? "Update" : "Publish") +
                      " " +
                      ((editType || articleType) === "regular" ||
                      (editType || articleType) === "article"
                        ? "Article"
                        : (editType || articleType) === "live"
                        ? "Live Headlines"
                        : (editType || articleType) === "breaking"
                        ? "Breaking News"
                        : "Video")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Helper components
  const StatCard = ({ stat }) => {
    const Icon = stat.icon;
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
              {stat.value}
            </p>
            <p
              className={`text-xs md:text-sm mt-1 ${
                stat.change.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change} from last period
            </p>
          </div>
          <div className={`p-2 md:p-3 rounded-full bg-gray-100 ${stat.color}`}>
            <Icon size={20} className="md:h-6 md:w-6" />
          </div>
        </div>
      </div>
    );
  };

  const ArticleTypeBadge = ({ type }) => {
    const getTypeDetails = () => {
      switch (type) {
        case "live":
          return {
            icon: <Clock size={14} className="mr-1" />,
            color: "bg-blue-100 text-blue-800",
          };
        case "breaking":
          return {
            icon: <AlertTriangle size={14} className="mr-1" />,
            color: "bg-red-100 text-red-800",
          };
        case "video":
          return {
            icon: <Video size={14} className="mr-1" />,
            color: "bg-purple-100 text-purple-800",
          };
        default:
          return {
            icon: <FileText size={14} className="mr-1" />,
            color: "bg-gray-100 text-gray-800",
          };
      }
    };

    const details = getTypeDetails();
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${details.color}`}
      >
        {details.icon}
        {type === "live"
          ? "Live"
          : type === "breaking"
          ? "Breaking"
          : type === "video"
          ? "Video"
          : "Article"}
      </span>
    );
  };

  const currentData = chartData[selectedPeriod];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Main content area */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Analytics Chart */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Content Analytics
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setChartType("line")}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        chartType === "line"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Line
                    </button>
                    <button
                      onClick={() => setChartType("bar")}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        chartType === "bar"
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Bar
                    </button>
                  </div>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-auto"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                  </select>
                </div>
              </div>

              {/* Recharts Implementation */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={currentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#dc2626"
                        strokeWidth={2}
                        dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#dc2626", strokeWidth: 2 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#16a34a", strokeWidth: 2 }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={currentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="views"
                        fill="#dc2626"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="engagement"
                        fill="#16a34a"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-4 md:gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="text-gray-600">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-600">Engagement Rate</span>
                </div>
              </div>
            </div>

            {/* Top Performing Articles */}
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                Top Performers
              </h3>
              <div className="space-y-3 md:space-y-4">
                {topPerformers.map((article, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-800 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {article.views} views
                        </span>
                        <span className="text-xs text-green-600">
                          {article.engagement} engagement
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Articles Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Content
                  </h3>
                  <p className="text-sm text-gray-600">
                    {recentArticles.length} items total
                  </p>
                </div>
                <div className="relative w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setArticleType("regular");
                      setEditArticle(null);
                      setShowNewArticleForm(true);
                    }}
                    className="w-full sm:w-auto bg-red-800 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus size={16} />
                    <span>New Content</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin h-8 w-8 text-red-600 mr-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                          <span className="text-gray-600">
                            Loading content...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <div className="text-red-600">
                          <AlertTriangle size={24} className="mx-auto mb-2" />
                          <p className="font-medium">{error}</p>
                          <button
                            onClick={fetchRecentArticles}
                            className="mt-2 text-red-800 underline hover:text-red-900"
                          >
                            Try Again
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : recentArticles.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <div className="text-gray-500">
                          <FileText size={24} className="mx-auto mb-2" />
                          <p className="font-medium">No content found</p>
                          <p className="text-sm">
                            Start by creating your first article
                          </p>
                          <button
                            onClick={() => {
                              setArticleType("regular");
                              setEditArticle(null);
                              setShowNewArticleForm(true);
                            }}
                            className="mt-3 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Create Article
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    recentArticles.map((article) => (
                      <tr key={article._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <ArticleTypeBadge type={article.type} />
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-xs">
                              {article.title}
                            </p>
                            {article.category && (
                              <p className="text-xs text-gray-500">
                                {article.category}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-900">
                          {article.author || article.reporter || "-"}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              article.status === "Published"
                                ? "bg-green-100 text-green-800"
                                : article.status === "Draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {article.status || "Published"}
                          </span>
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-900">
                          {article.views ? article.views.toLocaleString() : "0"}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4 text-sm text-gray-900">
                          {new Date(
                            article.createdAt || article.date || Date.now()
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 md:px-6 md:py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              onClick={() => {
                                setEditArticle(article);
                                setArticleType(
                                  article.type === "article"
                                    ? "regular"
                                    : article.type
                                );
                                setShowNewArticleForm(true);
                              }}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteArticle(article._id, article.type)
                              }
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* New Article Form Modal */}
      {showNewArticleForm && (
        <NewArticleForm
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
    </div>
  );
};

export default NewsAdminDashboard;