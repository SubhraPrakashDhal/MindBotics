import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../customHooks/useTheme";

const Homepage = () => {
  const { theme } = useTheme();

  return (
<section className={`w-full min-h-[90vh] flex items-center transition-all duration-300 ${
      theme === "dark"
        ? "bg-gradient-to-br from-slate-900 to-slate-950 text-white"
        : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900"
    }`}>
      <div className="w-[90%] mx-auto flex flex-col items-center text-center">

        {/* Small Tag */}
        <span
          className={`mb-6 px-5 py-2 rounded-full text-sm tracking-wide transition-all duration-300 ${
            theme === "dark"
              ? "bg-slate-700/50 text-cyan-300 border border-slate-600"
              : "bg-blue-100/50 text-blue-700 border border-blue-200"
          }`}
        >
          Robotics Components Platform
        </span>

        {/* Main Heading */}
        <h1
          className={`text-[clamp(38px,5vw,68px)] font-extrabold leading-tight transition-all duration-300 ${
            theme === "dark"
              ? "text-white [text-shadow:2px_2px_8px_rgba(0,0,0,0.8)]"
              : "text-slate-900 [text-shadow:1px_1px_4px_rgba(0,0,0,0.2)]"
          }`}
        >
          Welcome to{" "}
          <span className={`transition-all duration-300 ${
            theme === "dark" ? "text-cyan-400" : "text-blue-600"
          }`}>MindBotics</span>
        </h1>

        {/* Sub Text */}
        <p className={`mt-6 max-w-[750px] text-lg transition-all duration-300 ${
          theme === "dark"
            ? "text-slate-200"
            : "text-slate-700"
        }`}>
          Discover powerful robotics components built for innovators,
          engineers, and creators shaping the future of technology.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex gap-6 flex-wrap justify-center">

          {/* Join Now */}
          <Link to="/login"
            className={`min-w-[170px] h-[52px] px-8 rounded-full font-semibold text-lg flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg border-2 ${
              theme === "dark"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 hover:shadow-cyan-500/50"
                : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400 hover:shadow-blue-400/50"
            }`}
          >
            Let's Go
          </Link>

          {/* Register */}
          <Link to="/register"
            className={`min-w-[170px] h-[52px] px-8 rounded-full border-2 flex items-center justify-center font-semibold text-lg transition-all duration-300 hover:scale-105 ${
              theme === "dark"
                ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900"
                : "border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
            }`}
          >
            Explore Now
          </Link>

        </div>

        {/* Decorative Glow */}
        <div
          className={`mt-16 w-[140px] h-[4px] rounded-full transition-all duration-300 ${
            theme === "dark"
              ? "bg-cyan-400 shadow-[0_0_25px_#06b6d4]"
              : "bg-blue-500 shadow-[0_0_25px_#3b82f6]"
          }`}
        />

      </div>
    </section>
  );
};

export default Homepage;
