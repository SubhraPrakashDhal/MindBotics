import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Login from "../pages/loginPage/Login";
import Homepage from "../pages/homepage/Homepage";
import Register from "../pages/registerPage/Register";
import UserDashboardMain from "../components/dashbooard/userdashboard/UserDashboardMain";

export const routes = createBrowserRouter([
    {
        path:"/",
        element:<Layout/>,
        children:[
            {
                path:"/",
                element:<Homepage/>
            },
            {
                path:"/userdashboard",
                element:<UserDashboardMain/>
            }
        ]
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }


])