// import { Navigate, Outlet } from "react-router-dom";
// import { useAppContext } from "../Context/AppContext";

// const PrivateRoute = () => {
//   const { isLoggedIn } = useAppContext();
//   return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { Box, CircularProgress, Typography } from "@mui/material"

const PrivateRoute = () => {
  const { isLoggedIn, isInitializing } = useSelector((state) => state.auth)

  // Show loading while initializing authentication state
  if (isInitializing) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'white' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={40} sx={{ color: '#CA0019' }} />
          <Typography color="#64748b" fontWeight={500}>Loading...</Typography>
        </Box>
      </Box>
    )
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />
}

export default PrivateRoute
