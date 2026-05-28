import React from 'react';
import { NewArticleForm } from './Components/NewArticleForm';
import { Box, Typography, Breadcrumbs, Link, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, FileEdit, FilePlus2 } from 'lucide-react';

const PostContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;

  const handleSuccess = () => {
    // Redirect to home dashboard or articles page on successful publish
    navigate('/dashboard');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 3 }, minHeight: '100vh', pb: 8 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs 
          separator={<ChevronRight size={14} />} 
          aria-label="breadcrumb"
          sx={{ mb: 2, '& .MuiBreadcrumbs-separator': { color: '#94a3b8', mx: 0.5 } }}
        >
          <Link 
            underline="hover" 
            color="#64748b" 
            href="/dashboard" 
            sx={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem', fontWeight: 500, '&:hover': { color: '#CA0019' } }}
          >
            Dashboard
          </Link>
          <Typography color="#0f172a" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
            {editData ? 'Edit Content' : 'Publish Content'}
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(202, 0, 25, 0.08)', 
              borderRadius: '16px',
              color: '#CA0019',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 0 1px rgba(202, 0, 25, 0.15)'
            }}
          >
            {editData ? <FileEdit size={28} strokeWidth={2.5} /> : <FilePlus2 size={28} strokeWidth={2.5} />}
          </Box>
          <Box sx={{ pt: 0.5 }}>
            <Typography variant="h4" fontWeight={800} color="#0f172a" sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
              {editData ? 'Edit Content' : 'Publish New Content'}
            </Typography>
            <Typography variant="body1" color="#64748b">
              {editData 
                ? 'Update your existing article, live headline, breaking news, or media.' 
                : 'Create and publish new articles, breaking news, live updates, or videos to your platform.'}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form Container */}
      <Box sx={{ 
        position: 'relative',
        '& .w-full.max-w-4xl': { 
          maxWidth: '100%', 
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
          borderRadius: '10px',
          overflow: 'hidden'
        }
      }}>
        <NewArticleForm 
          inline={true} 
          onSuccess={handleSuccess} 
          editData={editData}
          editType={editData ? editData.type : null}
          articleType={editData ? (editData.type === 'article' ? 'regular' : editData.type) : 'regular'}
        />
      </Box>
    </Box>
  );
};

export default PostContent;
