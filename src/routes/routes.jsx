import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Login from "../pages/loginPage/Login";
import Homepage from "../pages/homepage/Homepage";
import Register from "../pages/registerPage/Register";
import UserDashboardMain from "../components/dashbooard/userdashboard/UserDashboardMain";
import PrivateRouting from "../privaterouting/Privaterouting";
import DashboardHome from "../components/dashbooard/userdashboard/userDashboardcomponent/DashboardHome";
import CategoryComponentsPage from "../components/dashbooard/userdashboard/userDashboardcomponent/CategoryComponentsPage";
import DevicesPage from "../components/dashbooard/userdashboard/userDashboardcomponent/DevicesPage";
import DeviceIssuePage from "../components/dashbooard/userdashboard/userDashboardcomponent/DeviceIssuePage";
import Settings from "../components/dashbooard/userdashboard/userDashboardcomponent/Settings";

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
                element:<PrivateRouting>
                    <UserDashboardMain/>
                    </PrivateRouting>,
                children:[
                    {
                        path:"/userdashboard",
                        element:<DashboardHome/>
                    },
                    {
                        path: "/userdashboard/devicedata/:id",
                        element: <DevicesPage />,
                    },
                    {
                        path: "/userdashboard/category/:categoryId",
                        element: <CategoryComponentsPage/>,
                    },
                    {
                        path:"/userdashboard/issuedevice/:id",
                        element:<DeviceIssuePage/>
                    },
                    {
                        path:"/userdashboard/settings",
                        element:<Settings/>
                    }
                ]  
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