import React from "react";
import NavbarMain from "../components/navBar/NavbarMain";
import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";

const Layout = () => {
  return (
    <div className="w-full h-screen bg-[#0F2854] flex flex-col">
      
      {/* Navbar */}
      <NavbarMain />

      {/* Scroll area */}
      <div className="flex-1 ">
        <Outlet />
      </div>
      <Footer/>

    </div>
  );
};

export default Layout;
