import React from "react";
import LeftNav from "./navBarComponents/LeftNav";
import RightNav from "./navBarComponents/RightNav";
import { useTheme } from "../../customHooks/useTheme";

const NavbarMain = () => {
  const { theme } = useTheme();

  return (
    <nav className={`w-full h-[95px] sticky z-50 top-0 shadow-lg transition-all duration-300 backdrop-blur-md border-b ${
      theme === "dark"
        ? "bg-gradient-to-r from-slate-900 to-slate-950 text-cyan-300 border-slate-700/50"
        : "bg-gradient-to-r from-white via-slate-50 to-slate-100 text-slate-700 border-slate-200/50"
    }`}>
      <div className="w-[90%] h-full m-auto flex items-center justify-between">
        <LeftNav />
        <RightNav />
      </div>
    </nav>
  );
};

export default NavbarMain;
