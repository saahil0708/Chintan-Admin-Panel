import { useState, useEffect } from "react";
import Home from "@mui/icons-material/Home";
import Article from "@mui/icons-material/Article";
import Category from "@mui/icons-material/Category";
import Group from "@mui/icons-material/Group";
import Logout from "@mui/icons-material/Logout";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import Shield from "@mui/icons-material/Shield";
import ErrorOutlined from "@mui/icons-material/ErrorOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import PostAdd from "@mui/icons-material/PostAdd";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Badge,
  TextField,
  IconButton,
  Drawer
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { logoutUser, sendVerificationOTP, verifyEmail } from "../redux/slices/authSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");

  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const adminNavItems = [
    { name: "Dashboard", icon: <Home />, path: "/dashboard" },
    { name: "Publish Content", icon: <PostAdd />, path: "/dashboard/post-content" },
    { name: "Articles", icon: <Article />, path: "/dashboard/articles" },
    { name: "Users", icon: <Group />, path: "/dashboard/users" },
    { name: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
  ];

  const adminName = userData?.name || "Admin";
  const adminRole = userData?.role || "Administrator";

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout error:", error);
    } finally {
      setShowLogoutConfirmation(false);
    }
  };

  // Match more specific (longer) paths first
  const activeItem = [...adminNavItems]
    .sort((a, b) => b.path.length - a.path.length)
    .find(item => location.pathname === item.path || location.pathname.startsWith(item.path + '/'));

  const isActive = (path) => activeItem ? (activeItem.path === path) : (path === "/dashboard");

  const sidebarContent = (isMobile) => {
    const isCollapsed = isMobile ? false : collapsed;
    
    return (
    <Box
      sx={{
        width: isMobile ? 240 : (isCollapsed ? 80 : 240),
        bgcolor: "#121212",
        color: "#ffffff",
        height: '100%',
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: 'width 0.3s ease-in-out',
      }}
    >
      {/* Header Section */}
      <Box 
        sx={{ 
          pt: 3,
          pb: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: isMobile ? "center" : (isCollapsed ? "center" : "space-between") 
        }}
      >
        {!isMobile && !isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
            <img 
              src="/ChintanWhiteLogo.png" 
              alt="Chintan Admin" 
              style={{ width: '80px', height: 'auto', objectFit: 'contain' }}
            />
          </Box>
        )}
        
        {isMobile ? (
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => setCollapsed(!isCollapsed)}
            sx={{ color: 'white', ml: isCollapsed ? 0 : 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ width: '100%', m: 0, borderColor: 'rgba(255,255,255,0.1)' }} />


        {/* Navigation Links */}
        <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
          <List sx={{ px: isCollapsed ? 2 : 2 }}>
            {adminNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => isMobile && setMobileOpen(false)}
                    sx={{
                      borderRadius: 50,
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      px: isCollapsed ? 0 : 2,
                      mx: isCollapsed ? 'auto' : 0,
                      width: isCollapsed ? 48 : '100%',
                      height: isCollapsed ? 48 : 'auto',
                      minHeight: isCollapsed ? 48 : 'auto',
                      bgcolor: active ? "#ca0019" : "transparent",
                      color: active ? "white" : "rgba(255,255,255,0.7)",
                      "&:hover": {
                        bgcolor: "#ca0019",
                        color: "white",
                        "& .MuiListItemIcon-root": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 0 : 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: active ? "white" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{
                          fontWeight: active ? 600 : 500,
                          fontSize: "0.95rem",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Divider sx={{ width: '100%', m: 0, borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* User Profile Section */}
        <Box sx={{ p: isCollapsed ? 1 : 2, py: isCollapsed ? 2 : 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
              p: isCollapsed ? 0 : 1.5,
              bgcolor: isCollapsed ? 'transparent' : 'rgba(255,255,255,0.04)',
              borderRadius: 3,
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              border: isCollapsed ? 'none' : '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <Avatar sx={{ bgcolor: "#CA0019", width: 38, height: 38 }}>{adminName.charAt(0)}</Avatar>
            {!isCollapsed && (
              <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle2" noWrap fontWeight="bold" color="white" sx={{ lineHeight: 1.2 }}>
                  {adminName}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Actions */}
          <List disablePadding sx={{ px: collapsed ? 0 : 1 }}>
            {userData?.isAccountVerified === false && (
              <ListItem disablePadding sx={{ mb: 1 }}>
                {!showOtpInput ? (
                  <ListItemButton
                    onClick={async () => {
                      const sent = await dispatch(sendVerificationOTP(userData?.email)).unwrap();
                      if (sent) setShowOtpInput(true);
                    }}
                    sx={{ borderRadius: 2, color: 'rgba(255,255,255,0.7)', justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 0 : 2 }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, color: 'inherit' }}><VerifiedUser fontSize="small" /></ListItemIcon>
                    {!collapsed && <ListItemText primary="Verify Email" primaryTypographyProps={{ fontSize: '0.875rem' }} />}
                  </ListItemButton>
                ) : (
                  <Box sx={{ p: 1, width: '100%', display: collapsed ? 'none' : 'flex', gap: 1, flexDirection: 'column' }}>
                    <TextField
                      size="small"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      inputProps={{ maxLength: 6 }}
                      sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1, input: { color: 'white' } }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={async () => {
                        const verified = await dispatch(verifyEmail({ email: userData?.email, otp })).unwrap();
                        if (verified) setShowOtpInput(false);
                      }}
                    >
                      Verify
                    </Button>
                  </Box>
                )}
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setShowLogoutConfirmation(true)}
                sx={{
                  borderRadius: 2,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  px: isCollapsed ? 0 : 2,
                  color: "#e57373",
                  "&:hover": { bgcolor: "rgba(229, 115, 115, 0.1)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: isCollapsed ? 0 : 2, color: "#e57373" }}>
                  <Logout fontSize="small" />
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />}
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
    </Box>
  )};

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 'auto', 
            bgcolor: "transparent", 
            borderRight: 'none',
          },
        }}
      >
        <Box 
          sx={{ 
            height: 'calc(100% - 32px)', 
            width: 240,
            m: 2,
            borderRadius: 4, 
            overflow: 'hidden', 
            boxShadow: 24,
            bgcolor: "#121212"
          }}
        >
          {sidebarContent(true)}
        </Box>
      </Drawer>

      {/* Desktop Floating Sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 24,
          left: 24,
          bottom: 24,
          width: collapsed ? 80 : 240,
          bgcolor: "#121212",
          borderRadius: 2.5,
          boxShadow: 4,
          zIndex: 1200,
          display: { xs: 'none', md: 'block' },
          overflow: "hidden",
          transition: 'width 0.3s ease-in-out',
        }}
      >
        {sidebarContent(false)}
      </Box>

      {/* Logout Dialog */}
      <Dialog open={showLogoutConfirmation} onClose={() => setShowLogoutConfirmation(false)}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorOutlined color="error" />
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out of the admin panel?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLogoutConfirmation(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="contained" color="error">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
