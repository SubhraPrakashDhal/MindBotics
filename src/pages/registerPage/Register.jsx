import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [disabled, setDisabled] = useState(true);

  const { username, fullname, email, password, confirmPassword, role } =
    formdata;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  // ✅ auto enable / disable register button
  useEffect(() => {
    if (
      username &&
      fullname &&
      email &&
      password &&
      confirmPassword &&
      role
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formdata]);

  // ✅ submit logic
  const handleForm = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-center",
      });
      return;
    }

    const finaldata = {
      username,
      fullname,
      email,
      password,
      role,
    };

    try {
      await axios.post("http://localhost:3000/userdata", finaldata);
      toast.success("Registration successful", {
        position: "top-center",
      });

      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Registration failed", {
        position: "top-center",
        
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0F2854] flex items-center justify-center">
      <div className="w-[90%] max-w-[460px] bg-[#1C4D8D] rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-[#BDE8F5]">
          Create Account
        </h2>

        <p className="mt-2 text-center text-sm text-[#BDE8F5]/80">
          Join <span className="text-[#4988C4] font-semibold">MindBrain</span> and start building
        </p>

        <form onSubmit={handleForm} className="mt-8 flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="text-sm text-[#BDE8F5]/80">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleInput}
              className="mt-1 w-full h-[44px] px-4 rounded-lg bg-white"
            />
          </div>

          {/* Fullname */}
          <div>
            <label className="text-sm text-[#BDE8F5]/80">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={fullname}
              onChange={handleInput}
              className="mt-1 w-full h-[44px] px-4 rounded-lg bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-[#BDE8F5]/80">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInput}
              className="mt-1 w-full h-[44px] px-4 rounded-lg bg-white"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-[#BDE8F5]/80">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInput}
              className="mt-1 w-full h-[44px] px-4 rounded-lg bg-white"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-[#BDE8F5]/80">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInput}
              className="mt-1 w-full h-[44px] px-4 rounded-lg bg-white"
            />
          </div>

          {/* Role */}
          <div>
            <label className="text-sm text-[#BDE8F5]/80">Role</label>
            <select
              name="role"
              value={role}
              onChange={handleInput}
              className="mt-1 w-full h-[44px] px-4 rounded-lg bg-white"
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={disabled}
            className={`mt-4 h-[48px] rounded-full font-semibold text-lg transition
              ${
                disabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#4988C4] hover:bg-[#BDE8F5] text-[#0F2854]"
              }`}
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#BDE8F5]/80">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4988C4] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
