import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../Pages/Home";
import PrivateRoute from "./PrivateRoute";
import EmailVerify from "../Authentication/EmailVerify";
import ResetPassword from "../Authentication/ResetPassword";
import Dashboard from "../Pages/Dashboard Pages/Home";
import Articles from "../Pages/Dashboard Pages/Articles";
import UsersUI from "../Pages/Dashboard Pages/User";
import AdminNavbar from "../Components/Navbar";
import CategoriesUI from "../Pages/Dashboard Pages/Categories";

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
          path: "/dashboard/categories",
          element: (
            <>
              <AdminNavbar />
              <CategoriesUI />
            </>
          )
        },
        {
          path: "/dashboard/users",
          element: (
            <>
              <AdminNavbar />
              <UsersUI />
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
