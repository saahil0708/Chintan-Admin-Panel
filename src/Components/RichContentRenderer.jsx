import React from 'react';
import DOMPurify from 'dompurify';

const RichContentRenderer = ({ content, className = '' }) => {
  if (!content) return null;

  // Sanitize the HTML content to prevent XSS attacks while allowing rich article formatting
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'strike',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr',
      'img', 'figure', 'figcaption', 'a', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'src', 'alt', 'title', 'href', 'target', 'rel', 'class', 'style', 'width', 'height'
    ],
    ALLOW_DATA_ATTR: false
  });

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichContentRenderer;