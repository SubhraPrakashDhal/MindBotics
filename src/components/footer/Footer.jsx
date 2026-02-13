import React from "react";

const Footer = () => {
  return (
    <footer className="w-full h-[70px] p-3 bg-[#051c44] text-[#BDE8F5]">
      <div className="w-[90%] h-full mx-auto flex flex-col items-center justify-center gap-1">

        {/* Copyright */}
        <p className="text-sm">
          © {new Date().getFullYear()} MindBrain. All rights reserved.
        </p>

        {/* Common footer text */}
        <p className="text-xs text-[#BDE8F5]/70">
          Designed & built for robotics innovators
        </p>

      </div>
    </footer>
  );
};

export default Footer;
