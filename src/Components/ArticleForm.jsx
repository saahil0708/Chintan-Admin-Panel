import React, { useState, useEffect } from "react";
import { Plus, X, Upload, Edit, Trash2 } from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import axios from "axios";
import { useAppContext } from "../Context/AppContext";
import { toast } from "react-toastify";

const ArticleForm = ({ article = null, onSave, onCancel, categories = [] }) => {
  const { backendURL } = useAppContext();

  const [formData, setFormData] = useState({
    title: "",
    content: "", // This will now store the rich content HTML
    author: "",
    category: "",
    tags: "",
    trending: false,
    editorsChoice: false,
    latestNews: false,
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load article data if editing
  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        content: article.content || article.richContent || "", // Combine both fields
        author: article.author || "",
        category: Array.isArray(article.category)
          ? article.category[0]
          : article.category || "",
        tags: Array.isArray(article.tags)
          ? article.tags.join(", ")
          : article.tags || "",
        trending: article.trending || false,
        editorsChoice: article.editorsChoice || false,
        latestNews: article.latestNews || false,
      });
      setMainImagePreview(article.imageUrl || "");
      setAdditionalImages(article.additionalImages || []);
    }
  }, [article]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.category) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (html) => {
    setFormData((prev) => ({
      ...prev,
      content: html,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onload = () => setMainImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post(
          `${backendURL}/api/upload`,
          formData,
          {
            withCredentials: true,
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
      setUploading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        category: [formData.category],
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        additionalImages,
      };

      let response;
      if (article) {
        // Update existing article
        response = await axios.put(
          `${backendURL}/api/articles/${article._id}`,
          submitData,
          {
            withCredentials: true,
          }
        );
      } else {
        // Create new article
        response = await axios.post(`${backendURL}/api/articles`, submitData, {
          withCredentials: true,
        });
      }

      // Upload main image if selected
      if (mainImage) {
        const imageFormData = new FormData();
        imageFormData.append("image", mainImage);

        await axios.post(
          `${backendURL}/api/articles/${response.data._id}/image`,
          imageFormData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      onSave(response.data);
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Error saving article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {article ? "Edit Article" : "Create New Article"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                errors.author ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent`}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="technology, news, tutorial"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
          </div>
        </div>

        {/* Content - Now just the Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <RichTextEditor
            content={formData.content}
            onChange={handleContentChange}
            placeholder="Write your article content..."
            className={`border ${
              errors.content ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
            backendURL={backendURL}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Image
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
              id="main-image"
            />
            <label
              htmlFor="main-image"
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </label>
            {mainImagePreview && (
              <div className="relative">
                <img
                  src={mainImagePreview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMainImage(null);
                    setMainImagePreview("");
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Images */}
        <div>
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
                disabled={uploading}
              />
              <label
                htmlFor="additional-images"
                className={`flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Add Images"}
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
                        <Trash2 className="w-3 h-3" />
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
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-800"
                      />
                      <input
                        type="text"
                        placeholder="Alt text"
                        value={image.altText}
                        onChange={(e) =>
                          updateImageCaption(index, "altText", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-800"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Article Flags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Article Flags
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="trending"
                checked={formData.trending}
                onChange={handleInputChange}
                className="mr-2"
              />
              Trending
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="editorsChoice"
                checked={formData.editorsChoice}
                onChange={handleInputChange}
                className="mr-2"
              />
              Editor's Choice
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="latestNews"
                checked={formData.latestNews}
                onChange={handleInputChange}
                className="mr-2"
              />
              Latest News
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : article
              ? "Update Article"
              : "Create Article"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
