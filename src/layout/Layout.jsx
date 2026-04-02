import React from "react";
import NavbarMain from "../components/navBar/NavbarMain";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import { useTheme } from "../customHooks/useTheme";

const Layout = () => {
  const { theme } = useTheme();

  return (
    <div className={`w-full h-screen flex flex-col transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-gradient-to-b from-slate-900 to-slate-950" 
        : "bg-gradient-to-b from-slate-50 to-slate-100"
    }`}>
      
      {/* Navbar */}
      <NavbarMain />

      {/* Scroll area */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <Footer/>

    </div>
  );
};

export default Layout;
