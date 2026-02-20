import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Login from "../pages/loginPage/Login";
import Homepage from "../pages/homepage/Homepage";
import Register from "../pages/registerPage/Register";
import UserDashboardMain from "../components/dashbooard/userdashboard/UserDashboardMain";
import PrivateRouting from "../privaterouting/Privaterouting";

// ⭐ Imports
import DevicesPage from "../components/dashbooard/userdashboard/DevicesPage";
import CategoryComponentsPage from "../components/dashbooard/userdashboard/CategoryComponentsPage";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },

      // ⭐ USER DASHBOARD
      {
        path: "/userdashboard",
        element: (
          <PrivateRouting>
            <UserDashboardMain />
          </PrivateRouting>
        ),

        // ⭐ CHILD ROUTES (Dashboard Pages)
        children: [
          {
            path: "createpost/:id",
            element: <DevicesPage />,
          },

          // 🔥 NEW — CATEGORY COMPONENTS PAGE
          {
            path: "category/:categoryId",
            element: <CategoryComponentsPage />,
          },

          {
            path: "welcome/:id",
            element: <div>Dashboard Home</div>,
          },

          {
            path: "profile/:id",
            element: <div>Profile Page</div>,
          },

          {
            path: "mypost/:id",
            element: <div>Servo Motor Page</div>,
          },

          {
            path: "settings/:id",
            element: <div>Settings Page</div>,
          },
        ],
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },
]);