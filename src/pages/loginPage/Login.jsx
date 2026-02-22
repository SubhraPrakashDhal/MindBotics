import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import { useAuth } from "../../customHooks/useAuth"; 

// 🔐 custom token generator
const generateToken = (user) => {
  return user.fullname.slice(0, 3) + ".kbjasvxhgvr1246d." + user.id;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ ADD

  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { email, password } = formdata;

  const handleinput = (e) => {
    const { name, value } = e.target;
    setformdata({ ...formdata, [name]: value });
  };

  useEffect(() => {
    if (email && password) setDisabled(false);
    else setDisabled(true);
  }, [formdata]);

  const handleForm = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.get("http://localhost:3000/userdata");
      const user = data.find((u) => u.email === email);

      if (!user) {
        toast.error("No account found. Please register first.", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

      if (user.password !== password) {
        toast.error("Invalid email or password", {
          position: "top-center",
          autoClose: 2000,
        });
        return;
      }

// success ke baad

      toast.success("Login successful", {
        position: "top-right",
        autoClose: 2000,
      });
      const token = generateToken(user);
      localStorage.setItem("mindbrain_token", token);
      localStorage.setItem("mindbrain_user", JSON.stringify(user));
      login();
      navigate("/userdashboard");

    } catch (error) {
      toast.error("Server error", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0F172A] via-[#0B2447] to-[#19376D] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-white">
          Welcome Back 👋
        </h2>

        <p className="mt-2 text-center text-sm text-gray-300">
          Login to continue to{" "}
          <span className="text-cyan-400 font-semibold">MindBrain</span>
        </p>

        <form onSubmit={handleForm} className="mt-8 flex flex-col gap-5">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleinput}
              placeholder="you@mindbrain.com"
              className="mt-1 w-full h-[50px] px-4 rounded-xl bg-[#0F172A] text-white border border-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40 outline-none transition"
            />
          </div>

          <div className="relative">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleinput}
              placeholder="••••••••"
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

          <button
            type="submit"
            disabled={disabled || loading}
            className={`mt-2 h-[52px] rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2
              ${
                disabled || loading
                  ? "bg-gray-500 cursor-not-allowed text-black"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-[1.02] text-black"
              }`}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
