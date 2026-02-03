import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
<section className="w-full min-h-[90vh] bg-[#0F2854] text-[#BDE8F5] flex items-center">
      <div className="w-[90%] mx-auto flex flex-col items-center text-center">

        {/* Small Tag */}
        <span
          className="mb-6 px-5 py-2 rounded-full 
          bg-[#1C4D8D] text-sm tracking-wide"
        >
          Robotics Components Platform
        </span>

        {/* Main Heading */}
        <h1
          className="text-[clamp(38px,5vw,68px)] font-extrabold leading-tight
          [text-shadow:2px_2px_8px_rgba(0,0,0,0.5)]"
        >
          Welcome to{" "}
          <span className="text-[#4988C4]">MindBotics</span>
        </h1>

        {/* Sub Text */}
        <p className="mt-6 max-w-[750px] text-lg text-[#BDE8F5]/90">
          Discover powerful robotics components built for innovators,
          engineers, and creators shaping the future of technology.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex gap-6 flex-wrap justify-center">

          {/* Join Now */}
          <Link to="/login"
            className="min-w-[170px] h-[52px] px-8
            rounded-full
            bg-[#4988C4] text-[#0F2854]
            font-semibold text-lg
            flex items-center justify-center
            hover:bg-[#1C4D8D] hover:text-[#BDE8F5]
            transition shadow-lg"
          >
            Let's Go
          </Link>

          {/* Register */}
          <Link to="/register"
            className="min-w-[170px] h-[52px] px-8
            rounded-full border-2 border-[#4988C4]
            flex items-center justify-center
            text-[#4988C4] font-semibold text-lg
            hover:bg-[#4988C4] hover:text-[#0F2854]
            transition"
          >
            Explore Now
          </Link>

        </div>

        {/* Decorative Glow */}
        <div
          className="mt-16 w-[140px] h-[4px] rounded-full
          bg-[#4988C4]
          shadow-[0_0_25px_#4988C4]"
        />

      </div>
    </section>
  );
};

export default Homepage;
