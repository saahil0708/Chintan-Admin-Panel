// import { Navigate, Outlet } from "react-router-dom";
// import { useAppContext } from "../Context/AppContext";

// const PrivateRoute = () => {
//   const { isLoggedIn } = useAppContext();
//   return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default PrivateRoute;

import { Navigate, Outlet } from "react-router-dom"
import { useAppContext } from "../Context/AppContext"

const PrivateRoute = () => {
  const { isLoggedIn, isInitializing } = useAppContext()

  // Show loading while initializing authentication state
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />
}

export default PrivateRoute
