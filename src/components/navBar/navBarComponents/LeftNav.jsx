import React from "react";
import logo from "../../../assets/Logo/MindBoticsLogo.png";

const LeftNav = () => {
  return (
    <div className=" w-[34%] flex items-center gap-3 h-full">
      
      {/* IMAGE — untouched */}
      <div className="w-[30%] h-[80%] rounded-full flex justify-center items-center">
        <img className="w-[80%]" src={logo} alt="MindBotics Logo" />
      </div>

      {/* BRAND TAGLINE */}
     <p
  className="font-semibold tracking-wide leading-snug
  text-[clamp(14px,1vw,18px)] text-[#BDE8F5]
  [text-shadow:1px_1px_4px_rgba(0,0,0,0.4)]"
>
  Explore the robotic world with us
</p>

    </div>
  );
};

export default LeftNav;
