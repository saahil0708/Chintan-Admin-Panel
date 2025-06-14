import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../Pages/Home";
import PrivateRoute from "./PrivateRoute";
import EmailVerify from "../Authentication/EmailVerify";
import ResetPassword from "../Authentication/ResetPassword";
import Dashboard from "../Pages/Dashboard Pages/Home";
import Articles from "../Pages/Dashboard Pages/Articles";

import Layout from "../Layout/Layout";
import AdminNavbar from "../Components/Navbar";

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
            <>
              <AdminNavbar />
              <Dashboard />
            </>
          ),
        },
        {
          path: "/dashboard/articles",
          element: (
            <>
              <AdminNavbar />
              <Articles />
            </>
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
