
import React from 'react';
import { Clock, AlertTriangle, Video, FileText } from 'lucide-react';

export   const ArticleTypeBadge = ({ type }) => {
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