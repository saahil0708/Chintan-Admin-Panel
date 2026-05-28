import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Undo,
  Redo,
  Upload,
} from "lucide-react";
import axios from "axios";

const RichTextEditor = ({
  content,
  onChange,
  placeholder = "Start writing your article...",
  backendURL,
}) => {
  const [showImageInput, setShowImageInput] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText());
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${backendURL}/api/upload`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.url) {
        editor.chain().focus().setImage({ src: response.data.url }).run();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      setShowImageInput(false);
      e.target.value = ''; // Reset file input
    }
  };

  const MenuBar = () => {
    if (!editor) {
      return null;
    }

    return (
      <div className="border-b border-gray-200 p-4 bg-white rounded-t-lg">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>

          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 ${
              editor.isActive("blockquote") ? "bg-gray-200" : ""
            }`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            onClick={() => setShowImageInput(!showImageInput)}
            className="p-2 rounded hover:bg-gray-100"
            title="Add Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {showImageInput && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Select Image from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <button
                onClick={() => setShowImageInput(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MenuBar />
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;