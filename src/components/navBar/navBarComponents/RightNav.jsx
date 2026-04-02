import React from "react";
import { FaSun, FaUserCircle, FaMoon } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { FaSignOutAlt } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../customHooks/useAuth";
import { useTheme } from "../../../customHooks/useTheme";

const RightNav = () => {

  const {loggedin,logout} = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

const handlelogout =()=>{
  localStorage.removeItem("mindbrain_token") // same key
  logout()                                   // context state false
  navigate("/")
}


  return (
    <div className="flex items-center gap-5">
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center font-semibold shadow-lg hover:shadow-xl hover:scale-110 border-2 ${
          theme === "dark"
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500 hover:from-purple-700 hover:to-indigo-700"
            : "bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 border-yellow-500 hover:from-yellow-500 hover:to-amber-500"
        }`}
        aria-label="Toggle theme"
        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      >
        {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
      </button>

      {/* Login CTA */}
      {
        loggedin ? (

          <button
              onClick={handlelogout}
              className='px-6 py-2.5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-red-600'>
              Logout <FaSignOutAlt />
            </button>
          
        ) : (
          <Link to="/login" className={`min-w-[140px] h-[46px] px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 border-2 shadow-md ${
            theme === "dark"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-600 hover:from-cyan-600 hover:to-blue-700"
              : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-700 hover:from-blue-700 hover:to-cyan-700"
          }`}>
        Login <FiLogIn size={18} />
        </Link> 
        )
      }
    </div>
  );
};

export default RightNav;
