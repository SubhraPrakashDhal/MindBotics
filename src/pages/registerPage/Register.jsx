import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";

const Register = () => {
  const navigate = useNavigate();

  const [formdata, setFormdata] = useState({
    username: "",
    fullname: "",
    email: "",
    mobileno: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    username,
    fullname,
    email,
    mobileno,
    password,
    confirmPassword,
    role,
  } = formdata;

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  useEffect(() => {
    if (
      username &&
      fullname &&
      email &&
      mobileno &&
      password &&
      confirmPassword &&
      role
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formdata]);

  const handleForm = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }

    setLoading(true);

    const finaldata = { username, fullname, email, password, mobileno, role };

    try {
      await axios.post("http://localhost:3000/userdata", finaldata);
      toast.success("Registration successful", { position: "top-center" });
      navigate("/login");
    } catch (error) {
      toast.error("Registration failed", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0F172A] via-[#0B2447] to-[#19376D] flex items-center justify-center p-4">
      {/* Parent size SAME */}
      <div className="w-[50%] bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-gray-300">
            Join <span className="text-cyan-400 font-semibold">MindBrain</span>{" "}
            and start building 🚀
          </p>

          <form onSubmit={handleForm} className="mt-5 flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={fullname}
                onChange={handleInput}
                className="mt-1 w-full h-[50px] px-4 rounded-xl bg-[#0F172A] text-white border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleInput}
                className="mt-1 w-full h-[50px] px-4 rounded-xl bg-[#0F172A] text-white border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-gray-300">Username</label>
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleInput}
                  className="mt-1 w-full h-[50px] px-4 rounded-xl bg-[#0F172A] text-white border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
                />
              </div>

              <div className="w-1/2">
                <label className="text-sm text-gray-300">Mobile No</label>
                <input
                  type="number"
                  name="mobileno"
                  value={mobileno}
                  onChange={handleInput}
                  className="mt-1 w-full h-[50px] px-4 rounded-xl bg-[#0F172A] text-white border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex gap-4">
              {/* Password */}
              <div className="relative w-1/2">
                <label className="text-sm text-gray-300">Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleInput}
                  className="mt-1 w-full h-[50px] px-4 pr-12 rounded-xl bg-[#0F172A] text-white border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-[38px] text-gray-300 hover:text-cyan-400"
                >
                  {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative w-1/2">
                <label className="text-sm text-gray-300">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPass ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleInput}
                  className="mt-1 w-full h-[50px] px-4 pr-12 rounded-xl bg-[#0F172A] text-white border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-[38px] text-gray-300 hover:text-cyan-400"
                >
                  {showConfirmPass ? (
                    <FiEyeOff size={20} />
                  ) : (
                    <FiEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300">Role</label>
              <select
                name="role"
                value={role}
                onChange={handleInput}
                className="mt-1 w-full h-[50px] px-4 rounded-xl bg-[#0F172A] text-white border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={disabled || loading}
              className={`mt-4 h-[52px] rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2
                ${
                  disabled || loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-[1.02] text-black"
                }`}
            >
              {loading ? (
                <>
                  <ImSpinner2 className="animate-spin" />
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
