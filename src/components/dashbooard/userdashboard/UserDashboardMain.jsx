  import React from "react";
  import { NavLink, Outlet } from "react-router-dom";
  import { FaUser, FaCog, FaPlus } from "react-icons/fa";
  import { IoImagesOutline } from "react-icons/io5";
  import { BsCollectionPlay } from "react-icons/bs";

  const UserDashboardMain = () => {
    return (
      <div className="w-full h-screen flex bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#020617]">

        {/* SIDEBAR */}
        <div className="w-[22%] h-full p-4">
          <div className="h-full rounded-2xl shadow-2xl flex flex-col
            bg-gradient-to-b from-[#111827] to-[#020617] text-white border border-white/10">

            {/* PROFILE */}
            <div className="p-6 text-center border-b border-white/10">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-3xl font-bold overflow-hidden">
                <img
                  className="w-full h-full object-cover rounded-full"
                  src="https://i.pravatar.cc/150"
                  alt="profile"
                />
              </div>
              <h3 className="mt-3 font-semibold text-lg">User Name</h3>
              <p className="text-sm text-gray-400">user@email.com</p>
            </div>

            {/* MENU */}
            <div className="flex-1 px-4 py-6">
              <ul className="flex flex-col gap-3">
                <li>
                  <NavLink
                    to="/userdashboard/welcome/1"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                    bg-white/5 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-black
                    transition-all duration-300"
                  >
                    <BsCollectionPlay /> Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/userdashboard/profile/1"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                    bg-white/5 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-black
                    transition-all duration-300"
                  >
                    <FaUser /> My Profile
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/userdashboard/createpost/1"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                    bg-white/5 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-black
                    transition-all duration-300"
                  >
                    <FaPlus /> Devices
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/userdashboard/mypost/1"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                    bg-white/5 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-black
                    transition-all duration-300"
                  >
                    <IoImagesOutline /> servo motor
                  </NavLink>
                </li>

                <li>
                  <hr className="border-white/10 my-2" />
                </li>

                <li>
                  <NavLink
                    to="/userdashboard/settings/1"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl
                    bg-white/5 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-blue-500 hover:text-black
                    transition-all duration-300"
                  >
                    <FaCog /> Settings
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="w-[78%] h-full p-5 overflow-y-auto">
          <div className="w-full h-full rounded-2xl shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <Outlet />
          </div>
        </div>

      </div>
    );
  };

  export default UserDashboardMain;
