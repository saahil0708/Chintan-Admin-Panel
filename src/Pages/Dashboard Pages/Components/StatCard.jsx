import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

export const StatCard = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.05)',
        borderLeft: '5px solid #ca0019',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 3 }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600} gutterBottom>
            {stat.title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="800" color="text.primary">
            {stat.value}
          </Typography>
        </Box>
        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: 'rgba(202, 0, 25, 0.08)', color: '#ca0019' }}>
          <Icon size={24} strokeWidth={2.5} />
        </Box>
      </CardContent>
    </Card>
  );
};