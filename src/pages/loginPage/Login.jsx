import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formdata;

  const handleinput = (e) => {
    const { name, value } = e.target;
    setformdata({ ...formdata, [name]: value });
  };

  const handleForm = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      // ✅ fetch users from backend
      const { data } = await axios.get("http://localhost:3000/users");

      // ✅ find user by email
      const user = data.find((u) => u.email === email);

      if (!user) {
        toast.error("No account found. Please register first.", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }

      // ✅ password check
      if (user.password !== password) {
        toast.error("Invalid email or password", {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }

      // ✅ success
      toast.success("Login successful", {
        position: "top-right",
        autoClose: 2000,
      });


      navigate("/userdashboard");
    } catch (error) {
      console.log(error);
      toast.error("Server error", {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0F2854] flex items-center justify-center">
      <div className="w-[90%] max-w-[420px] bg-[#1C4D8D] rounded-2xl p-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-center text-[#BDE8F5]">
          Welcome Back
        </h2>

        <p className="mt-2 text-center text-sm text-[#BDE8F5]/80">
          Login to continue to{" "}
          <span className="text-[#4988C4] font-semibold">MindBrain</span>
        </p>

        <form onSubmit={handleForm} className="mt-8 flex flex-col gap-5">

          <div>
            <label className="text-sm text-[#BDE8F5]/80">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleinput}
              placeholder="you@mindbrain.com"
              className="mt-1 w-full h-[45px] px-4 rounded-lg bg-white"
            />
          </div>

          <div>
            <label className="text-sm text-[#BDE8F5]/80">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleinput}
              placeholder="••••••••"
              className="mt-1 w-full h-[45px] px-4 rounded-lg bg-white"
            />
          </div>

          <button
            type="submit"
            className="h-[48px] rounded-full bg-[#4988C4] text-[#0F2854]
            font-semibold text-lg hover:bg-[#BDE8F5] transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#BDE8F5]/80">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#4988C4] font-semibold hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
