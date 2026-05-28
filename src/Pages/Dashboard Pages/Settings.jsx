import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Settings as SettingsIcon, Wrench } from 'lucide-react';

const Settings = () => {
  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      <Paper elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', bgcolor: 'white', borderRadius: 2 }}>
        <Box sx={{ width: '100%', px: { xs: 2, sm: 4, lg: 6 }, pt: 3, pb: 3 }}>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#111827', mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account and application preferences
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ px: { xs: 2, sm: 4, lg: 6 }, mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: 8,
            borderRadius: 4,
            border: '1px dashed rgba(0,0,0,0.1)',
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 600,
            width: '100%',
            mt: 8
          }}
        >
          <Box sx={{ mb: 3, p: 3, bgcolor: '#fff1f2', borderRadius: '50%', color: '#CA0019' }}>
            <Wrench size={48} />
          </Box>
          <Typography variant="h5" fontWeight="bold" color="#111827" gutterBottom>
            Under Development
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            The settings module is currently being built. Soon, you'll be able to customize your admin panel preferences, notification settings, and security configurations here.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Settings;
