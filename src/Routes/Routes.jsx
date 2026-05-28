import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../Pages/Home";
import PrivateRoute from "./PrivateRoute";
import EmailVerify from "../Authentication/EmailVerify";
import ResetPassword from "../Authentication/ResetPassword";
import Dashboard from "../Pages/Dashboard Pages/Home";
import Articles from "../Pages/Dashboard Pages/Articles";
import UsersUI from "../Pages/Dashboard Pages/User";
import Sidebar from "../Components/Sidebar";
import CategoriesUI from "../Pages/Dashboard Pages/Categories";
import PostContent from "../Pages/Dashboard Pages/PostContent";
import Settings from "../Pages/Dashboard Pages/Settings";
import { useState } from "react";
import { Box, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Menu as MenuIcon } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarWidth = collapsed ? 80 : 240;
  
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          display: { xs: 'block', md: 'none' }, 
          bgcolor: 'transparent', 
          boxShadow: 'none',
          backgroundImage: 'none'
        }}
      >
        <Toolbar sx={{ px: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ 
              color: '#121212',
              bgcolor: 'transparent',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'transparent', opacity: 0.7 },
              visibility: mobileOpen ? 'hidden' : 'visible'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <Box 
        sx={{ 
          flexGrow: 1, 
          pl: { xs: 2, md: `${sidebarWidth + 60}px` }, 
          pr: { xs: 2, md: '36px' },
          pt: { xs: 10, md: '36px' },
          pb: { xs: 3, md: '36px' },
          width: '100%',
          boxSizing: 'border-box',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      element: <PrivateRoute />,
      children: [
        {
          path: "/dashboard",
          element: (
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          ),
        },
        {
          path: "/dashboard/post-content",
          element: (
            <DashboardLayout>
              <PostContent />
            </DashboardLayout>
          ),
        },
        {
          path: "/dashboard/articles",
          element: (
            <DashboardLayout>
              <Articles />
            </DashboardLayout>
          ),
        },
        {
          path: "/dashboard/categories",
          element: (
            <DashboardLayout>
              <CategoriesUI />
            </DashboardLayout>
          ),
        },
        {
          path: "/dashboard/users",
          element: (
            <DashboardLayout>
              <UsersUI />
            </DashboardLayout>
          ),
        },
        {
          path: "/dashboard/settings",
          element: (
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          ),
        },
        {
          path: "/dashboard/email-verification",
          element: <EmailVerify />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};
