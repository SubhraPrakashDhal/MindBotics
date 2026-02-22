import React from "react";
import { FaSun, FaUserCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { FaSignOutAlt } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../customHooks/useAuth";

const RightNav = () => {

  const {loggedin,logout} = useAuth()
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
        className="w-10 h-10 rounded-full 
        bg-[#1C4D8D] text-[#BDE8F5]
        hover:bg-[#4988C4] transition
        flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <FaSun size={16} />
      </button>

      {/* Login CTA */}
      {
        loggedin ? (

          <button
              onClick={handlelogout}
              className='px-5 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold flex items-center gap-2 hover:opacity-90 transition'>
              Logout <FaSignOutAlt />
            </button>
          
        ) : (
          <Link to="/login" className="min-w-[140px] h-[46px] px-6 rounded-full bg-[#4988C4] text-[#0F2854] font-semibold hover:bg-[#1C4D8D] hover:text-[#BDE8F5] transition flex items-center justify-center gap-2">
        Login <FiLogIn size={18} />
        </Link> 
        )
      }
    </div>
  );
};

export default RightNav;
