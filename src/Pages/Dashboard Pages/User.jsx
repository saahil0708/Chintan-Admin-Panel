import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, Mail, Calendar, Eye, EyeOff, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../redux/slices/authSlice';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { 
  Box, Typography, Button, TextField, InputAdornment, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Dialog, DialogTitle, DialogContent, DialogActions, 
  CircularProgress, Avatar, IconButton, Card, Grid 
} from '@mui/material';

const UsersAdminUI = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [users, setUsers] = useState([]);
  
  // Delete Dialog State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch all users
  const fetchUsers = async (showLoader = true) => {
    try {
      if (showLoader) dispatch(setLoading(true));
      const response = await api.get(`/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Fetch users error:', error);
      if (showLoader) toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      if (showLoader) dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchUsers();

    // Auto-refresh data every 60 seconds (polling)
    const intervalId = setInterval(() => {
      fetchUsers(false);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // Add new user
  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await api.post(`/api/auth/register`, {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password
      });

      // Create complete user object for state
      const createdUser = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.name)}&background=random`,
        articlesWritten: 0,
        lastLogin: "Never",
        createdAt: new Date().toISOString()
      };

      setUsers([...users, createdUser]);
      toast.success('User created successfully!');
      resetForm();
    } catch (error) {
      console.error('Registration error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Edit user handler
  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: ''
    });
    setShowAddModal(true);
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      dispatch(setLoading(true));
      const updateData = {
        name: newUser.name,
        email: newUser.email
      };

      if (newUser.password.trim()) {
        updateData.password = newUser.password;
      }

      const response = await api.put(
        `/api/users/${editingUser._id}`,
        updateData
      );

      setUsers(users.map(user => 
        user._id === editingUser._id ? { ...user, ...response.data } : user
      ));
      toast.success('User updated successfully!');
      resetForm();
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Delete user handlers
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      dispatch(setLoading(true));
      await api.delete(`/api/users/${userToDelete._id}`);
      setUsers(users.filter(user => user._id !== userToDelete._id));
      toast.success('User deleted successfully');
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Delete error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Delete failed');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Reset form
  const resetForm = () => {
    setShowAddModal(false);
    setEditingUser(null);
    setShowPassword(false);
    setNewUser({
      name: '',
      email: '',
      password: ''
    });
  };

  // Format date & check online status
  const isOnline = (dateString) => {
    if (!dateString || dateString === "Never") return false;
    const date = new Date(dateString);
    const now = new Date();
    // Consider "Online" if logged in within the last 15 minutes
    return (now - date) < (15 * 60 * 1000);
  };

  const formatDateTime = (dateString) => {
    if (!dateString || dateString === "Never") return "Never";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Never") return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading && users.length === 0) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: '#CA0019' }} />
          <Typography color="#64748b" fontWeight={500}>Loading users...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'transparent', pb: 8 }}>
      {/* Header Section */}
      <Box sx={{ maxWidth: 1500, mx: 'auto', px: { xs: 2, sm: 4, lg: 6 }, pt: 4, mb: 4 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
          <Box sx={{ width: '100%', mx: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', lg: 'center' }, gap: 3 }}>
              {/* Left Side: Title & Stat */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box>
                  <Typography variant="h4" fontWeight={800} color="#111827" sx={{ mb: 0.5, letterSpacing: '-0.02em' }}>
                    Users Management
                  </Typography>
                  <Typography variant="body2" color="#64748b">
                    Manage system users and administrative access
                  </Typography>
                </Box>
                
                {/* Vertical Divider */}
                <Box sx={{ height: 40, width: '1px', bgcolor: 'rgba(0,0,0,0.1)', display: { xs: 'none', sm: 'block' } }} />
                
                {/* Compact Stat Box */}
                <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1, bgcolor: 'rgba(202, 0, 25, 0.08)', borderRadius: 2 }}>
                    <Users size={20} color="#CA0019" />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="#64748b" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 0.2 }}>
                      Total
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={800} color="#111827" sx={{ lineHeight: 1 }}>
                      {users.length} Users
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Right Side: Search & Action */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', lg: 'auto' } }}>
                <TextField
                  variant="outlined"
                  size="small"
                  label="Search users"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} color="#94a3b8" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    width: { xs: '100%', lg: 250 },
                    bgcolor: 'white',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      '&.Mui-focused fieldset': {
                        borderColor: '#CA0019',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#CA0019',
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<Plus size={18} />}
                  onClick={() => setShowAddModal(true)}
                  sx={{ 
                    bgcolor: '#CA0019', 
                    '&:hover': { bgcolor: '#b71c1c' },
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    borderRadius: 1,
                    textTransform: 'none',
                    boxShadow: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Add User
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1350, mx: 'auto', px: { xs: 2, sm: 4, lg: 6 } }}>
        
        {isLoading && users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 12 }}>
            <CircularProgress size={40} sx={{ color: '#CA0019' }} />
          </Box>
        ) : filteredUsers.length > 0 ? (
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.08)', overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }} aria-label="users table">
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>User Profile</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Account Details</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#64748b', py: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', py: 2, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Quick Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'all 0.2s ease', '&:hover': { bgcolor: '#f1f5f9' } }}
                  >
                    <TableCell sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                        <Avatar 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                          alt={user.name} 
                          sx={{ width: 48, height: 48, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '2px solid #ffffff' }}
                        />
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700} color="#111827" sx={{ mb: 0.2 }}>
                            {user.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                            <Mail size={14} />
                            <Typography variant="body2">{user.email}</Typography>
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Typography variant="body2" fontWeight={600} color="#111827" sx={{ mb: 0.5, textTransform: 'capitalize' }}>
                        {user.role || 'Member'}
                      </Typography>
                      <Typography variant="caption" color="#94a3b8" sx={{ fontFamily: 'monospace' }}>
                        ID: {user._id?.substring(0, 8) || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: isOnline(user.lastLogin) ? '#10b981' : '#cbd5e1' }} />
                        <Typography variant="body2" fontWeight={600} color={isOnline(user.lastLogin) ? '#10b981' : '#64748b'}>
                          {isOnline(user.lastLogin) ? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="#94a3b8" fontWeight={500}>
                        Last seen: {formatDateTime(user.lastLogin || user.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ py: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                        <IconButton 
                          onClick={() => handleEditUser(user)} 
                          sx={{ color: '#64748b', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2, transition: 'all 0.2s', '&:hover': { color: '#0f172a', bgcolor: '#e2e8f0', transform: 'translateY(-2px)' } }}
                        >
                          <Edit size={18} />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteClick(user)} 
                          sx={{ color: '#CA0019', bgcolor: 'rgba(202,0,25,0.05)', border: '1px solid rgba(202,0,25,0.1)', borderRadius: 2, transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(202,0,25,0.1)', transform: 'translateY(-2px)' } }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.06)', bgcolor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="#64748b" fontWeight={500}>
                Showing <Typography component="span" fontWeight={700} color="#111827">{filteredUsers.length}</Typography> of <Typography component="span" fontWeight={700} color="#111827">{users.length}</Typography> users
              </Typography>
            </Box>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Users size={64} color="#cbd5e1" style={{ margin: '0 auto', marginBottom: 16 }} />
            <Typography variant="h5" color="#111827" fontWeight={600} mb={1}>
              {users.length === 0 ? 'No users found' : 'No matching users found'}
            </Typography>
            <Typography color="#64748b">
              {users.length === 0 ? 'The system has no users yet.' : 'Try adjusting your search terms.'}
            </Typography>
          </Box>
        )}

        {/* Add/Edit User Dialog */}
        <Dialog 
          open={showAddModal} 
          onClose={resetForm}
          PaperProps={{ sx: { borderRadius: 3, width: '100%', maxWidth: 450 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
            <Typography variant="h6" fontWeight={800} color="#111827">
              {editingUser ? 'Edit User' : 'Add New User'}
            </Typography>
            <IconButton onClick={resetForm} size="small" sx={{ color: '#64748b' }}>
              <X size={20} />
            </IconButton>
          </Box>
          <DialogContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Name */}
              {/* Name */}
              <TextField
                fullWidth
                size="small"
                label="Full Name *"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 1, '&.Mui-focused fieldset': { borderColor: '#CA0019' } },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#CA0019' }
                }}
              />

              {/* Email */}
              <TextField
                fullWidth
                size="small"
                type="email"
                label="Email Address *"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 1, '&.Mui-focused fieldset': { borderColor: '#CA0019' } },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#CA0019' }
                }}
              />

              {/* Password */}
              <TextField
                fullWidth
                size="small"
                type={showPassword ? "text" : "password"}
                label={editingUser ? 'New Password (optional)' : 'Password *'}
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { borderRadius: 1, '&.Mui-focused fieldset': { borderColor: '#CA0019' } },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#CA0019' }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <Button 
              onClick={resetForm}
              sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none', px: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingUser ? handleUpdateUser : handleAddUser}
              variant="contained"
              disabled={isLoading}
              sx={{ 
                bgcolor: '#CA0019', 
                '&:hover': { bgcolor: '#b71c1c' }, 
                fontWeight: 600, 
                textTransform: 'none', 
                borderRadius: 1, 
                px: 3, 
                boxShadow: 'none' 
              }}
            >
              {isLoading ? 'Processing...' : editingUser ? 'Update User' : 'Add User'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: 1, padding: 1, minWidth: { xs: 300, sm: 400 } } }}
        >
          <DialogTitle sx={{ fontWeight: 800, color: '#111827', pb: 1 }}>
            Delete User
          </DialogTitle>
          <DialogContent>
            <Typography color="#475569">
              Are you sure you want to delete <Typography component="span" fontWeight={700}>"{userToDelete?.name}"</Typography>? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ color: '#64748b', fontWeight: 600, textTransform: 'none', px: 2 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDeleteUser} 
              variant="contained"
              startIcon={<Trash2 size={16} />}
              sx={{ bgcolor: '#CA0019', '&:hover': { bgcolor: '#b71c1c' }, fontWeight: 600, textTransform: 'none', borderRadius: 1, px: 3, boxShadow: 'none' }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Box>
  );
};

export default UsersAdminUI;