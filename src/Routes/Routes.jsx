import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "../Layout/Layout"

import Overview from '../Pages/DashboardOverview';
import Management from '../Pages/EditNews';
import Category from '../Pages/ManageCategory';
import List from '../Pages/ViewNews';
import Upload from '../Pages/Upload';
import Settings from "../Pages/Settings";
import Notification from "../Pages/Notification";

export default() => {

    const router = createBrowserRouter([
        {
            path: '/',
            element: < Layout />,
            children: [
                {
                    path: '/',
                    element: < Overview />
                },
                {
                    path: '/news-management',
                    element: < Management />
                },
                {
                    path: '/manage-category',
                    element: < Category />
                },
                {
                    path: '/news-list',
                    element: < List />
                },
                {
                    path: '/upload-images',
                    element: < Upload />
                },
                {
                    path: '/settings',
                    element: < Settings />
                },
                {
                    path: '/notifications',
                    element: < Notification />
                }
            ]
        }
    ])

    return (
        <>
            < RouterProvider router={router} />
        </>
    )
}