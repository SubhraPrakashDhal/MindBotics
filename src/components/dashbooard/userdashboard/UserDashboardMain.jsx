import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaUser, FaCog, FaPlus } from "react-icons/fa";
import { IoImagesOutline } from "react-icons/io5";
import { BsCollectionPlay } from "react-icons/bs";
import { FcElectronics } from "react-icons/fc";
import { GrCatalogOption } from "react-icons/gr";
import { FcHome } from "react-icons/fc";
import axios from "axios";
import { useAuth } from "../../../customHooks/useAuth";
import { useTheme } from "../../../customHooks/useTheme";

const UserDashboardMain = () => {
  const { currentUser, setCurrentUser, loggedin } = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("mindbrain_token");

  const fetchUser = async () => {
    try {
      if (!token) {
        return;
      }

      const { data } = await axios.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrentUser(data);
    } catch (error) {
      console.error("fetchUser error", error?.response?.data || error.message || error);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!token || !loggedin) {
      navigate("/login");
      return;
    }

    fetchUser();
  }, [token, loggedin]);

  // Re-render when currentUser changes (e.g., when avatar is updated)
  useEffect(() => {
    // This effect ensures the component re-renders when currentUser changes
  }, [currentUser]);

  const { theme } = useTheme();

  return (
    <div className={`w-full h-screen flex transition-colors duration-300 ${
      theme === "dark"
        ? "bg-gradient-to-br from-slate-900 via-slate-950 to-black"
        : "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200"
    }`}>
      <div className="w-[22%] h-full p-4">
        <div className={`h-full rounded-2xl shadow-2xl flex flex-col border transition-all duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-b from-slate-800 to-slate-950 text-white border-slate-700/50"
            : "bg-gradient-to-b from-white to-slate-50 text-slate-900 border-slate-300/50"
        }`}>
          <div className={`p-6 text-center transition-all duration-300 ${
            theme === "dark"
              ? "border-b border-slate-700/50"
              : "border-b border-slate-300/50"
          }`}>
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-3xl font-bold overflow-hidden shadow-lg">
              {currentUser?.avatar ? (
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <img
                  className="w-full h-full object-cover rounded-full"
                  src="https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg"
                  alt="profile"
                />
              )}
            </div>
            <h3 className="mt-3 font-semibold text-lg">
              {currentUser?.username}
            </h3>
            <p className={`text-sm transition-colors duration-300 ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}>{currentUser?.email}</p>
          </div>

          <div className="flex-1 px-4 py-6">
            <ul className="flex flex-col gap-3">
              <li>
                <NavLink
                  to="/userdashboard"
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                        : theme === "dark"
                        ? "bg-slate-700/30 text-slate-200 hover:bg-slate-700/50"
                        : "bg-slate-200/50 text-slate-700 hover:bg-slate-300/50"
                    }`
                  }
                >
                  <FcHome size={22} /> Dashboard
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/userdashboard/devicedata/1"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                        : theme === "dark"
                        ? "bg-slate-700/30 text-slate-200 hover:bg-slate-700/50"
                        : "bg-slate-200/50 text-slate-700 hover:bg-slate-300/50"
                    }`
                  }
                >
                  <FcElectronics size={22} /> Devices
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/userdashboard/issuedevice/1"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                        : theme === "dark"
                        ? "bg-slate-700/30 text-slate-200 hover:bg-slate-700/50"
                        : "bg-slate-200/50 text-slate-700 hover:bg-slate-300/50"
                    }`
                  }
                >
                  <GrCatalogOption /> Taken BY
                </NavLink>
              </li>

              <li>
                <hr className={`my-2 transition-colors duration-300 ${
                  theme === "dark" ? "border-slate-700/50" : "border-slate-300/50"
                }`} />
              </li>

              <li>
                <NavLink
                  to="/userdashboard/settings"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                        : theme === "dark"
                        ? "bg-slate-700/30 text-slate-200 hover:bg-slate-700/50"
                        : "bg-slate-200/50 text-slate-700 hover:bg-slate-300/50"
                    }`
                  }
                >
                  <FaCog /> Settings
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-[78%] h-full p-5 overflow-y-auto">
        <div className={`w-full h-full rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300 backdrop-blur-xl ${
          theme === "dark"
            ? "bg-slate-950/50 border-slate-700/50"
            : "bg-white/50 border-slate-300/50"
        }`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardMain;