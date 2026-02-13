import React from "react";
import LeftNav from "./navBarComponents/LeftNav";
import RightNav from "./navBarComponents/RightNav";

const NavbarMain = () => {
  return (
    <nav className="w-full h-[95px] bg-[#0F2854] text-[#BDE8F5] sticky z-50 top-0 shadow-[0px_0px_15px_-2px_lightgray] ">
      <div className="w-[90%] h-full m-auto flex items-center justify-between">
        <LeftNav />
        <RightNav />
      </div>
    </nav>
  );
};

export default NavbarMain;
