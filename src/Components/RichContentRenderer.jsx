import React from 'react';
import DOMPurify from 'dompurify';

const RichContentRenderer = ({ content, className = '' }) => {
  if (!content) return null;

  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'a', 'div', 'span'
    ],
    ALLOWED_ATTR: [
      'src', 'alt', 'href', 'target', 'class', 'style', 'width', 'height'
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