import React, { useState, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Code2,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Upload,
  Globe,
  Undo,
  Redo,
  RemoveFormatting,
  X,
  Loader2,
} from "lucide-react";
import api, { backendURL as defaultBackendURL } from "../api/axiosInstance";

// Custom Text Align Extension to guarantee seamless compatibility
const TextAlignExtension = Extension.create({
  name: "textAlign",
  addOptions() {
    return {
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
      defaultAlignment: "left",
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => element.style.textAlign || this.options.defaultAlignment,
            renderHTML: (attributes) => {
              if (!attributes.textAlign || attributes.textAlign === this.options.defaultAlignment) {
                return {};
              }
              return { style: `text-align: ${attributes.textAlign}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setTextAlign:
        (alignment) =>
        ({ commands }) => {
          if (!this.options.alignments.includes(alignment)) {
            return false;
          }
          return this.options.types.every((type) =>
            commands.updateAttributes(type, { textAlign: alignment })
          );
        },
      unsetTextAlign:
        () =>
        ({ commands }) => {
          return this.options.types.every((type) =>
            commands.resetAttributes(type, "textAlign")
          );
        },
    };
  },
});

const RichTextEditor = ({
  content = "",
  onChange,
  placeholder = "Start writing your article with text, formatting, and images...",
  backendURL = defaultBackendURL,
  className = "",
  minHeight = "350px",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTab, setImageTab] = useState("upload"); // "upload" | "url"
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const fileInputRef = useRef(null);

  // Helper to upload an image file to backend
  const uploadImageFile = async (file) => {
    if (!file) return null;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WebP, etc.).");
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be less than 10MB.");
      return null;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(`/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.url) {
        return response.data.url;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      const msg = error.response?.data?.error || error.message || "Failed to upload image";
      setUploadError(msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "editor-image rounded-xl max-w-full h-auto mx-auto shadow-md my-4 transition-all",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-red-700 underline font-medium hover:text-red-900 cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      TextAlignExtension,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none p-4 md:p-6",
        style: `min-height: ${minHeight};`,
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            uploadImageFile(file).then((url) => {
              if (url && editor) {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                if (coordinates) {
                  const node = schema.nodes.image.create({ src: url });
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                }
              }
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData && event.clipboardData.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
              const file = items[i].getAsFile();
              if (file) {
                event.preventDefault();
                uploadImageFile(file).then((url) => {
                  if (url && editor) {
                    editor.chain().focus().setImage({ src: url }).run();
                  }
                });
                return true;
              }
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (onChange) {
        onChange(ed.getHTML(), ed.getText());
      }
    },
  });

  // Synchronize incoming content if it changes externally
  useEffect(() => {
    if (editor && content !== undefined) {
      const currentHTML = editor.getHTML();
      if (content !== currentHTML && content !== (currentHTML === "<p></p>" ? "" : currentHTML)) {
        editor.commands.setContent(content || "", false);
      }
    }
  }, [content, editor]);

  // Insert image handler from device
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl && editor) {
      editor.chain().focus().setImage({ src: uploadedUrl, alt: imageAlt || file.name }).run();
      setShowImageModal(false);
      setImageAlt("");
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  // Insert image handler from URL
  const handleUrlInsert = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() }).run();
      setImageUrl("");
      setImageAlt("");
      setShowImageModal(false);
    }
  };

  // Link insertion handler
  const openLinkModal = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setShowLinkModal(true);
  };

  const handleSetLink = (e) => {
    e.preventDefault();
    if (!editor) return;

    if (linkUrl.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let formattedUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl) && !/^mailto:/i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: formattedUrl })
        .run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  };

  const handleUnlink = () => {
    if (editor) {
      editor.chain().focus().unsetLink().run();
    }
  };

  if (!editor) {
    return (
      <div className="w-full h-48 border border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading Editor...
      </div>
    );
  }

  // Calculate stats
  const text = editor.getText();
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    title,
    children,
    activeClass = "bg-red-50 text-red-700 font-semibold border-red-200 shadow-inner",
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`p-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-transparent transition-all duration-150 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed ${
        isActive ? activeClass : ""
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-gray-200 my-auto mx-1" />;

  return (
    <div
      className={`border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100 transition-all ${className}`}
    >
      {/* Sticky Toolbar */}
      <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200 p-2 sm:p-2.5 flex flex-wrap items-center gap-1 sticky top-0 z-20">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Headings & Paragraph */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph") && !editor.isActive("heading")}
            title="Normal Paragraph"
          >
            <Pilcrow className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Inline Formatting */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            title="Inline Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Alignment */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" }) || (!editor.isActive({ textAlign: "center" }) && !editor.isActive({ textAlign: "right" }) && !editor.isActive({ textAlign: "justify" }))}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Lists & Blocks */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote Block"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive("codeBlock")}
            title="Code Block"
          >
            <Code2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <Divider />

        {/* Link & Media */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={openLinkModal}
            isActive={editor.isActive("link")}
            title="Insert / Edit Link"
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
          {editor.isActive("link") && (
            <ToolbarButton onClick={handleUnlink} title="Remove Link">
              <Unlink className="w-4 h-4 text-red-500" />
            </ToolbarButton>
          )}

          {/* Image Insertion Button */}
          <button
            type="button"
            onClick={() => {
              setUploadError("");
              setShowImageModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 transition-colors shadow-sm ml-1"
            title="Insert Image (In Between Text)"
          >
            <ImageIcon className="w-4 h-4 text-red-700" />
            <span className="hidden sm:inline">Add Image</span>
          </button>
        </div>

        <Divider />

        {/* Clear formatting */}
        <div className="flex items-center gap-0.5 ml-auto">
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative min-h-[300px] bg-white">
        <EditorContent editor={editor} />

        {/* Loading overlay when uploading image */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-10">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-red-700 animate-spin" />
              <span className="text-sm font-medium text-gray-700">Uploading and placing image...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats Bar */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-4">
          <span>
            <strong className="text-gray-700 font-semibold">{wordCount}</strong> words
          </span>
          <span>
            <strong className="text-gray-700 font-semibold">{charCount}</strong> characters
          </span>
          <span>
            Est. reading time: <strong className="text-gray-700 font-semibold">{readTimeMinutes} min</strong>
          </span>
        </div>
        <div className="text-gray-400 italic text-[11px]">
          Tip: You can paste or drag & drop images directly into the text!
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-red-700" />
                <h3 className="font-semibold text-gray-900">Insert Image Into Article</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false);
                  setUploadError("");
                }}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200 px-4 pt-2">
              <button
                type="button"
                onClick={() => setImageTab("upload")}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  imageTab === "upload"
                    ? "border-red-600 text-red-700 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Upload className="w-4 h-4" />
                Upload Device File
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  imageTab === "url"
                    ? "border-red-600 text-red-700 font-semibold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Globe className="w-4 h-4" />
                Image URL
              </button>
            </div>

            <div className="p-5">
              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {uploadError}
                </div>
              )}

              {imageTab === "upload" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Select Image from Computer / Phone
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="tiptap-image-upload-input"
                    />
                    <label
                      htmlFor="tiptap-image-upload-input"
                      className="border-2 border-dashed border-gray-300 hover:border-red-500 hover:bg-red-50/20 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group"
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 text-red-700 animate-spin mb-2" />
                          <span className="text-sm font-medium text-gray-700">Uploading to server...</span>
                        </div>
                      ) : (
                        <>
                          <div className="p-3 bg-gray-100 rounded-full group-hover:bg-red-100 group-hover:text-red-700 text-gray-500 transition-colors mb-2">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            Click to browse image file
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            PNG, JPG, WebP, GIF up to 10MB
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Alt Text / Caption (Optional)
                    </label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="e.g. Photograph showing the ceremony"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUrlInsert} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Image Direct URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Alt Text / Caption (Optional)
                    </label>
                    <input
                      type="text"
                      value={imageAlt}
                      onChange={(e) => setImageAlt(e.target.value)}
                      placeholder="e.g. Photo description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowImageModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!imageUrl.trim()}
                      className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50 shadow-sm"
                    >
                      Insert Image
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-red-700" />
                <h3 className="font-semibold text-gray-900">Add or Edit Link</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSetLink} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Destination URL
                </label>
                <input
                  type="text"
                  autoFocus
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com or mailto:info@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                {editor.isActive("link") && (
                  <button
                    type="button"
                    onClick={() => {
                      handleUnlink();
                      setShowLinkModal(false);
                    }}
                    className="mr-auto px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    Remove Link
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 shadow-sm"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;