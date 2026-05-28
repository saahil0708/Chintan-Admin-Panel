const fs = require('fs');
const path = require('path');

const homePath = path.join(__dirname, 'src', 'Pages', 'Dashboard Pages', 'Home.jsx');
const newArticleFormPath = path.join(__dirname, 'src', 'Pages', 'Dashboard Pages', 'Components', 'NewArticleForm.jsx');
const statCardPath = path.join(__dirname, 'src', 'Pages', 'Dashboard Pages', 'Components', 'StatCard.jsx');
const articleTypeBadgePath = path.join(__dirname, 'src', 'Pages', 'Dashboard Pages', 'Components', 'ArticleTypeBadge.jsx');

const content = fs.readFileSync(homePath, 'utf8');
const lines = content.split('\n');

// 1. Extract NewArticleForm (Lines 314 to 1618, 0-indexed: 313 to 1617)
const newArticleFormLines = lines.slice(313, 1618);

// 2. Extract StatCard (Lines 1619 to 1650? Wait, let's just find them programmatically to be safe)
const statCardStart = lines.findIndex(l => l.includes('const StatCard = ({ stat }) => {'));
let statCardEnd = statCardStart;
let bracketCount = 0;
for (let i = statCardStart; i < lines.length; i++) {
    if (lines[i].includes('{')) bracketCount += (lines[i].match(/{/g) || []).length;
    if (lines[i].includes('}')) bracketCount -= (lines[i].match(/}/g) || []).length;
    if (bracketCount === 0 && lines[i].includes('};')) {
        statCardEnd = i;
        break;
    }
}
const statCardLines = lines.slice(statCardStart - 1, statCardEnd + 1);

const badgeStart = lines.findIndex(l => l.includes('const ArticleTypeBadge = ({ type }) => {'));
let badgeEnd = badgeStart;
bracketCount = 0;
for (let i = badgeStart; i < lines.length; i++) {
    if (lines[i].includes('{')) bracketCount += (lines[i].match(/{/g) || []).length;
    if (lines[i].includes('}')) bracketCount -= (lines[i].match(/}/g) || []).length;
    if (bracketCount === 0 && lines[i].includes('};')) {
        badgeEnd = i;
        break;
    }
}
const badgeLines = lines.slice(badgeStart, badgeEnd + 1);

// Write NewArticleForm.jsx
const newArticleFormCode = `
import React, { useState } from 'react';
import { X, Save, AlertTriangle, FileText, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

export ` + newArticleFormLines.join('\n').replace('const NewArticleForm = ({ onClose, editData, editType }) => {', 'const NewArticleForm = ({ onClose, editData, editType, articleType, backendURL, onSuccess }) => {').replace(/fetchRecentArticles\(\)/g, 'if (onSuccess) onSuccess()');
fs.writeFileSync(newArticleFormPath, newArticleFormCode);

// Write StatCard.jsx
const statCardCode = `
import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

export ` + statCardLines.join('\n');
fs.writeFileSync(statCardPath, statCardCode);

// Write ArticleTypeBadge.jsx
const badgeCode = `
import React from 'react';
import { Clock, AlertTriangle, Video, FileText } from 'lucide-react';

export ` + badgeLines.join('\n');
fs.writeFileSync(articleTypeBadgePath, badgeCode);

// Modify Home.jsx
// Remove the extracted components and add imports
let newHomeLines = [];

for (let i = 0; i < lines.length; i++) {
    if (i === 313) {
        // Skip until 1618
        i = 1617;
        continue;
    }
    if (i === statCardStart - 1) {
        i = statCardEnd;
        continue;
    }
    if (i === badgeStart) {
        i = badgeEnd;
        continue;
    }
    newHomeLines.push(lines[i]);
}

// Add imports after the last import
const importCode = `
import { NewArticleForm } from './Components/NewArticleForm';
import { StatCard } from './Components/StatCard';
import { ArticleTypeBadge } from './Components/ArticleTypeBadge';
`;
const lastImportIdx = newHomeLines.findIndex(l => l.includes('import { useAppContext } from "../../Context/AppContext";'));
newHomeLines.splice(lastImportIdx + 1, 0, importCode);

// Modify NewArticleForm invocation in Home.jsx to pass articleType, backendURL, onSuccess
let homeContentStr = newHomeLines.join('\n');
homeContentStr = homeContentStr.replace(
    '<NewArticleForm\n          onClose={() => {\n            setShowNewArticleForm(false);\n            setEditArticle(null);\n          }}\n          editData={editArticle}\n          editType={articleType}\n        />',
    '<NewArticleForm\n          onClose={() => {\n            setShowNewArticleForm(false);\n            setEditArticle(null);\n          }}\n          editData={editArticle}\n          editType={articleType}\n          articleType={articleType}\n          backendURL={backendURL}\n          onSuccess={fetchRecentArticles}\n        />'
);

fs.writeFileSync(homePath, homeContentStr);
console.log("Successfully extracted components!");
