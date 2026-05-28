import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, FileText, Image as ImageIcon, Video, Clock, Tag, Plus } from 'lucide-react';
import api, { backendURL } from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Box, FormHelperText } from '@mui/material';
import RichTextEditor from '../../../Components/RichTextEditor';

  // Article Form Component
  export const NewArticleForm = ({ onClose, editData, editType, articleType: initialArticleType = "regular", onSuccess, inline = false }) => {
    // Form states
    const [formData, setFormData] = useState(
      editData && editType === "article"
        ? {
          title: editData.title || "",
          content: editData.content || "",
          richContent: editData.richContent || editData.content || "",
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
          richContent: "",
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
    const [additionalImages, setAdditionalImages] = useState(
      editData && editType === "article" ? editData.additionalImages || [] : []
    );
    const [uploadingAdditional, setUploadingAdditional] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [articleType, setArticleType] = useState(initialArticleType);

    useEffect(() => {
      setArticleType(initialArticleType);
    }, [initialArticleType]);

    // Local video states for proper isolation
    const [localVideoFile, setLocalVideoFile] = useState(null);
    const [localVideoPreview, setLocalVideoPreview] = useState(null);
    const [videoThumbnailFile, setVideoThumbnailFile] = useState(null);
    const [videoThumbnailPreview, setVideoThumbnailPreview] = useState(null);

    // Breaking news image upload
    const uploadBreakingNewsImage = async (breakingNewsId, imageFile) => {
      if (!imageFile || !breakingNewsId) return null;

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await api.post(`/api/breaking-news/${breakingNewsId}/image`,
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

    const handleContentChange = (html, text) => {
      setFormData((prev) => ({
        ...prev,
        content: text || html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' '),
        richContent: html,
      }));
    };

    const handleAdditionalImageUpload = async (e) => {
      const files = Array.from(e.target.files);
      setUploadingAdditional(true);

      try {
        for (const file of files) {
          const form = new FormData();
          form.append("image", file);

          const response = await api.post(
            `/api/upload`,
            form,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          setAdditionalImages((prev) => [
            ...prev,
            {
              url: response.data.url,
              caption: "",
              altText: "",
            },
          ]);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image");
      } finally {
        setUploadingAdditional(false);
        e.target.value = ''; // Reset input
      }
    };

    const removeAdditionalImage = (index) => {
      setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    };

    const updateImageCaption = (index, field, value) => {
      setAdditionalImages((prev) =>
        prev.map((img, i) => (i === index ? { ...img, [field]: value } : img))
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

    const handleVideoThumbnailChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
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

        setVideoThumbnailFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoThumbnailPreview(reader.result);
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

          if (!videoThumbnailFile) {
            toast.error("Please select a video thumbnail");
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

            // Your code has this, which is correct:
            if (videoThumbnailFile) {
              formData.append("thumbnail", videoThumbnailFile);
            }

            const response = await api.post(`/api/videos`,
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
            if (onSuccess) onSuccess(data);
            toast.success("Video Uploaded Successfully!");
            if (onClose) onClose();
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

          if (editData) {
            // Update existing breaking news
            const response = await api.put(`/api/breaking-news/${editData._id}`,
              breakingPayload,
              {
                withCredentials: true,
              }
            );
            breakingRes = { data: response.data };
          } else {
            // Create new breaking news
            const response = await api.post(`/api/breaking-news`,
              breakingPayload,
              {
                withCredentials: true,
              }
            );
            breakingRes = { data: response.data };
          }

          const breakingId = editData
            ? editData._id
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

          if (editData) {
            if (onSuccess) onSuccess(newBreaking);
            toast.success("Breaking News Updated!");
          } else {
            if (onSuccess) onSuccess(newBreaking);
            toast.success("Breaking News Published!");
          }

          if (onClose) onClose();
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

            if (editData && validHeadlines.length === 1) {
              // If editing and only one headline, update the existing one
              const response = await api.put(`/api/live-news/${editData._id}`,
                payload,
                {
                  withCredentials: true,
                }
              );
              return { data: response.data };
            } else {
              // Create new live news item
              const response = await api.post(`/api/live-news`,
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

          if (editData && validHeadlines.length === 1) {
            // Update existing item
            if (onSuccess) onSuccess(newLiveNews[0]);
            toast.success("Live News Updated!");
          } else {
            // Add new items
            if (onSuccess) onSuccess(newLiveNews);
            toast.success(
              `${validHeadlines.length} Live News Headlines Published!`
            );
          }

          if (onClose) onClose();
          return;
        }

        // Handle regular articles
        let endpoint = `${backendURL}/api/articles`;
        let method = "POST";
        if (editData) {
          endpoint = `${backendURL}/api/articles/${editData._id}`;
          method = "PUT";
        }

        console.log("API endpoint:", endpoint);
        console.log("HTTP method:", method);

        // Regular article payload
        const payload = {
          title: formData.title,
          content: formData.content,
          richContent: formData.richContent,
          author: formData.author || "Unknown",
          category: formData.category || "general",
          tags: formData.tags || [],
          trending: formData.trending || false,
          editorsChoice: formData.editorsChoice || false,
          latestNews: formData.latestNews || false,
          imageTitle: formData.imageTitle || "",
          additionalImages: additionalImages || [],
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
          const articleId = editData ? editData._id : responseData._id;
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

            const imageResponse = await api.post(`/api/articles/${articleId}/image`,
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
        if (editData) {
          if (onSuccess) onSuccess(finalArticle);
          toast.success("Article Updated Successfully!");
        } else {
          if (onSuccess) onSuccess(finalArticle);
          if (!imageFile) {
            toast.success("Article Published Successfully!");
          }
        }

        if (onClose) onClose();
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
      if (onClose) onClose();
    };

    const outerContainerClass = inline
      ? "w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden mx-auto"
      : "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";

    const innerContainerClass = inline
      ? ""
      : "bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto";

    return (
      <div className={outerContainerClass}>
        <div className={innerContainerClass}>
          <div className="border-b border-gray-200 bg-white z-10">
            {!inline && (
              <div className="p-4 md:px-6 md:pt-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
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
                {onClose && (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            )}

            <div className="flex border-b border-gray-100 px-4 md:px-6">
              <button
                type="button"
                onClick={() => setArticleType("regular")}
                className={`px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 ${
                  (editType || articleType) === "regular" || (editType || articleType) === "article"
                    ? "border-red-600 text-red-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
                disabled={!!editData}
              >
                <FileText size={18} />
                Article
              </button>
              <button
                type="button"
                onClick={() => setArticleType("live")}
                className={`px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 ${
                  (editType || articleType) === "live"
                    ? "border-red-600 text-red-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
                disabled={!!editData}
              >
                <Clock size={18} />
                Live Headlines
              </button>
              <button
                type="button"
                onClick={() => setArticleType("breaking")}
                className={`px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 ${
                  (editType || articleType) === "breaking"
                    ? "border-red-600 text-red-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
                disabled={!!editData}
              >
                <AlertTriangle size={18} />
                Breaking News
              </button>
              <button
                type="button"
                onClick={() => setArticleType("video")}
                className={`px-4 py-3 text-sm font-semibold transition-all duration-200 border-b-2 flex items-center gap-2 ${
                  (editType || articleType) === "video"
                    ? "border-red-600 text-red-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }`}
                disabled={!!editData}
              >
                <Video size={18} />
                Video
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
            {/* Live News Form */}
            {(editType || articleType) === "live" && (
              <Box sx={{ mb: 2 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headlines *
                </label>
                {liveHeadlines.map((headline, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      fullWidth
                      value={headline}
                      onChange={(e) => handleLiveHeadlineChange(idx, e.target.value)}
                      required={idx === 0}
                      label={`Headline ${idx + 1}`}
                      size="small"
                      variant="outlined"
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
                  </Box>
                ))}
                <button
                  type="button"
                  onClick={addLiveHeadline}
                  className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  + Add Headline
                </button>
                <FormHelperText sx={{ mt: 1 }}>
                  Each headline will be published as a separate live news item. Empty headlines will be ignored.
                </FormHelperText>
              </Box>
            )}

            {/* Breaking News Form */}
            {(editType || articleType) === "breaking" && (
              <>
                <TextField
                  fullWidth
                  label="Title *"
                  name="title"
                  value={breakingData.title}
                  onChange={handleBreakingChange}
                  required
                  size="small"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Description *"
                  name="description"
                  value={breakingData.description}
                  onChange={handleBreakingChange}
                  required
                  multiline
                  rows={4}
                  size="small"
                  variant="outlined"
                />
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
                <FormControl fullWidth size="small" required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={breakingData.category}
                    onChange={handleBreakingChange}
                    label="Category"
                  >
                    <MenuItem value=""><em>Select a category</em></MenuItem>
                    <MenuItem value="রাজ্য">রাজ্য</MenuItem>
                    <MenuItem value="দেশ">দেশ</MenuItem>
                    <MenuItem value="বিদেশ">বিদেশ</MenuItem>
                    <MenuItem value="খেলা">খেলা</MenuItem>
                    <MenuItem value="প্রযুক্তি">প্রযুক্তি</MenuItem>
                    <MenuItem value="অন্যান্য">অন্যান্য</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Reporter *"
                  name="reporter"
                  value={breakingData.reporter}
                  onChange={handleBreakingChange}
                  required
                  size="small"
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Designation *"
                  name="designation"
                  value={breakingData.designation}
                  onChange={handleBreakingChange}
                  required
                  size="small"
                  variant="outlined"
                />
              </>
            )}

            {/* Video Upload Form */}
            {(editType || articleType) === "video" && (
              <>
                <TextField
                  fullWidth
                  label="Video Title *"
                  name="title"
                  value={videoData.title}
                  onChange={handleVideoDataChange}
                  required
                  size="small"
                  variant="outlined"
                  placeholder="Enter video title"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Duration *"
                  name="duration"
                  value={videoData.duration}
                  onChange={handleVideoDataChange}
                  required
                  size="small"
                  variant="outlined"
                  placeholder="e.g., 5:30 or 5 minutes"
                  sx={{ mb: 2 }}
                />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Thumbnail *
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                      {videoThumbnailPreview ? (
                        <div className="group relative">
                          <img
                            src={videoThumbnailPreview}
                            alt="Thumbnail Preview"
                            className="h-24 w-40 rounded-md object-cover border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setVideoThumbnailPreview(null);
                              setVideoThumbnailFile(null);
                              // Clear the file input
                              const fileInput =
                                document.getElementById("videoThumbnail");
                              if (fileInput) fileInput.value = "";
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-40 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                          <ImageIcon size={24} className="text-gray-400" />
                          <span className="ml-2 text-xs text-gray-400">
                            No Thumbnail
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="file"
                        id="videoThumbnail"
                        onChange={handleVideoThumbnailChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="videoThumbnail"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer text-center"
                      >
                        {videoThumbnailPreview
                          ? "Change Thumbnail"
                          : "Upload Thumbnail"}
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF (Max: 5MB)
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
                  <TextField
                    fullWidth
                    label="Article Title *"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <RichTextEditor
                      content={formData.richContent}
                      onChange={handleContentChange}
                      placeholder="Write your article content..."
                      backendURL={backendURL}
                    />
                  </div>
                  <TextField
                    fullWidth
                    label="Author *"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    size="small"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth size="small" required sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      label="Category"
                    >
                      <MenuItem value=""><em>Select a category</em></MenuItem>
                      <MenuItem value="রাজ্য">রাজ্য</MenuItem>
                      <MenuItem value="দেশ">দেশ</MenuItem>
                      <MenuItem value="বিদেশ">বিদেশ</MenuItem>
                      <MenuItem value="খেলা">খেলা</MenuItem>
                      <MenuItem value="প্রযুক্তি">প্রযুক্তি</MenuItem>
                      <MenuItem value="অন্যান্য">অন্যান্য</MenuItem>
                    </Select>
                  </FormControl>
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
                    <div className="mt-4 mb-2">
                      <TextField
                        fullWidth
                        label="Image Title/Alt Text"
                        name="imageTitle"
                        value={formData.imageTitle}
                        onChange={handleChange}
                        size="small"
                        variant="outlined"
                        placeholder="Describe the image for accessibility"
                      />
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Images
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleAdditionalImageUpload}
                          className="hidden"
                          id="additional-images"
                          disabled={uploadingAdditional}
                        />
                        <label
                          htmlFor="additional-images"
                          className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${
                            uploadingAdditional ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {uploadingAdditional ? "Uploading..." : "Add Images"}
                        </label>
                      </div>

                      {additionalImages.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {additionalImages.map((image, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg p-4"
                            >
                              <div className="relative mb-3">
                                <img
                                  src={image.url}
                                  alt={image.altText || "Additional image"}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeAdditionalImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  placeholder="Caption"
                                  value={image.caption}
                                  onChange={(e) =>
                                    updateImageCaption(index, "caption", e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                                <input
                                  type="text"
                                  placeholder="Alt Text"
                                  value={image.altText}
                                  onChange={(e) =>
                                    updateImageCaption(index, "altText", e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
                      <TextField
                        name="newTag"
                        value={formData.newTag}
                        onChange={handleChange}
                        placeholder="Add a tag"
                        size="small"
                        variant="outlined"
                        sx={{ flexGrow: 1 }}
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
                    <div className="flex flex-wrap gap-4">
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="trending"
                            checked={formData.trending}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="Trending"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="editorsChoice"
                            checked={formData.editorsChoice}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="Editor's Choice"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="latestNews"
                            checked={formData.latestNews}
                            onChange={handleChange}
                            color="primary"
                          />
                        }
                        label="Latest News"
                      />
                    </div>
                  </div>
                </>
              )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              {onClose && (
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel
                </button>
              )}
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