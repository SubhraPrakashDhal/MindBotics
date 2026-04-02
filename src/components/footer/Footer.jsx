import React from "react";
import { useTheme } from "../../customHooks/useTheme";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className={`w-full h-[70px] p-3 transition-all duration-300 border-t shadow-lg ${
      theme === "dark"
        ? "bg-gradient-to-r from-slate-900 to-slate-950 text-slate-200 border-slate-700/50"
        : "bg-gradient-to-r from-white via-slate-50 to-slate-100 text-slate-700 border-slate-200/50"
    }`}>
      <div className="w-[90%] h-full mx-auto flex flex-col items-center justify-center gap-1">

        {/* Copyright */}
        <p className="text-sm font-semibold">
          © {new Date().getFullYear()} MindBrain. All rights reserved.
        </p>

        {/* Common footer text */}
        <p className={`text-xs transition-colors duration-300 ${
          theme === "dark" ? "text-slate-400" : "text-slate-600"
        }`}>
          Designed & built for robotics innovators
        </p>

      </div>
    </footer>
  );
};

export default Footer;
