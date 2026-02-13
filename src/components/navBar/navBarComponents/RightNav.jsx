import React from "react";
import { FaSun, FaUserCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";

const RightNav = () => {
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
      <Link to="/login"
        className="min-w-[140px] h-[46px] px-6
        rounded-full
        bg-[#4988C4] text-[#0F2854]
        font-semibold
        hover:bg-[#1C4D8D] hover:text-[#BDE8F5]
        transition
        flex items-center justify-center gap-2"
      >
        Login
        <FiLogIn size={18} />
      </Link>
    </div>
  );
};

export default RightNav;
