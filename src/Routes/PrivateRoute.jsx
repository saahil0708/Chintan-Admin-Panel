import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "../Context/AppContext";

const PrivateRoute = () => {
  const { isLoggedIn } = useAppContext();
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;