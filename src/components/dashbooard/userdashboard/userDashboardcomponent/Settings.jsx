import React, { useState, useRef, useEffect } from "react";
import { FaCog, FaUser, FaLock, FaPalette, FaSave, FaSignOutAlt, FaTrash, FaCamera, FaMoon, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../customHooks/useAuth";
import { useTheme } from "../../../../customHooks/useTheme";

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [form, setForm] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preview, setPreview] = useState(currentUser?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Save Profile Changes
  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const updateData = {
        username: form.username,
        email: form.email,
      };

      const res = await axios.patch(
        `/api/user/profile/${currentUser?._id || currentUser?.id}`,
        updateData
      );

      setCurrentUser(res.data);
      localStorage.setItem("mindbrain_user", JSON.stringify(res.data));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Password Changes
  const handleSavePassword = async () => {
    try {
      if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
        alert("Please fill all password fields");
        return;
      }

      if (form.newPassword !== form.confirmPassword) {
        alert("New passwords do not match");
        return;
      }

      if (form.newPassword.length < 6) {
        alert("New password must be at least 6 characters");
        return;
      }

      setLoading(true);

      await axios.patch(`/api/user/password/${currentUser?._id || currentUser?.id}`, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm({
        ...form,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      alert("Password updated successfully!");
    } catch (err) {
      console.error("Password update failed:", err);
      alert("Failed to update password: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save Profile Avatar
  const handleSaveAvatar = async () => {
    if (!profileImageFile) {
      alert("Please select an image first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("avatar", profileImageFile);

      const res = await axios.patch(
        `/api/user/avatar/${currentUser?._id || currentUser?.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCurrentUser(res.data);
      localStorage.setItem("mindbrain_user", JSON.stringify(res.data));
      setPreview(res.data.avatar); // Update preview to show uploaded image
      setProfileImageFile(null);
      alert("Profile picture updated successfully!");
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert("Failed to upload avatar: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      logout();
      navigate("/login");
    }
  };

  // ✅ Delete Account
  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure? This action cannot be undone. Type DELETE to confirm."
    );

    if (!confirm) return;

    const userConfirm = window.prompt("Type DELETE to confirm account deletion:");
    if (userConfirm !== "DELETE") {
      alert("Account deletion cancelled");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/user/${currentUser?._id || currentUser?.id}`);
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Account deletion failed:", err);
      alert("Failed to delete account: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 transition-colors duration-300 ${
      theme === "dark" 
        ? "text-white" 
        : "text-slate-900"
    }`}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaCog className={theme === "dark" ? "text-cyan-400" : "text-cyan-600"} /> Settings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile */}
        <div className={`rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all border ${
          theme === "dark"
            ? "bg-white/5 border-white/10"
            : "bg-white/40 border-slate-300/30"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <FaUser className={theme === "dark" ? "text-cyan-400" : "text-cyan-600"} />
            <h3 className="text-lg font-semibold">Profile</h3>
          </div>

          <div className="flex items-center gap-5 mb-5">
            <div className={`w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center ${
              theme === "dark"
                ? "border-cyan-400/40 bg-slate-700/50"
                : "border-cyan-600/40 bg-slate-200/50"
            }`}>
              {preview ? (
                <img
                  src={preview}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentUser?.avatar || "https://i.pinimg.com/280x280_RS/e1/08/21/e10821c74b533d465ba888ea66daa30f.jpg"}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <label className={`cursor-pointer inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all border-2 hover:scale-105 ${
              theme === "dark"
                ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
                : "bg-slate-300/30 border-slate-400/30 hover:bg-slate-300/50 text-slate-900"
            }`}>
              <FaCamera /> Change Photo
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                onChange={handleImage}
                ref={fileInputRef}
              />
            </label>
          </div>

          {profileImageFile && (
            <button
              onClick={handleSaveAvatar}
              disabled={loading}
              className={`w-full mb-4 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all border-2 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                theme === "dark"
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400 hover:shadow-green-500/50"
                  : "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400 hover:shadow-emerald-400/50"
              }`}
            >
              <FaSave /> {loading ? "Uploading..." : "Upload Photo"}
            </button>
          )}

          <div className="space-y-4">
            <div>
              <label className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Your username"
                className={`w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  theme === "dark"
                    ? "bg-black/30 border-white/10 focus:ring-cyan-400 text-white"
                    : "bg-white/50 border-slate-300/50 focus:ring-cyan-600 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  theme === "dark"
                    ? "bg-black/30 border-white/10 focus:ring-cyan-400 text-white"
                    : "bg-white/50 border-slate-300/50 focus:ring-cyan-600 text-slate-900"
                }`}
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                theme === "dark"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:scale-105"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105"
              } disabled:opacity-50`}
            >
              <FaSave /> Save Profile
            </button>
          </div>
        </div>

        {/* Security */}
        <div className={`rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all border ${
          theme === "dark"
            ? "bg-white/5 border-white/10"
            : "bg-white/40 border-slate-300/30"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <FaLock className={theme === "dark" ? "text-pink-400" : "text-pink-600"} />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  theme === "dark"
                    ? "bg-black/30 border-white/10 focus:ring-pink-400 text-white"
                    : "bg-white/50 border-slate-300/50 focus:ring-pink-600 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="New password"
                className={`w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  theme === "dark"
                    ? "bg-black/30 border-white/10 focus:ring-pink-400 text-white"
                    : "bg-white/50 border-slate-300/50 focus:ring-pink-600 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                  theme === "dark"
                    ? "bg-black/30 border-white/10 focus:ring-pink-400 text-white"
                    : "bg-white/50 border-slate-300/50 focus:ring-pink-600 text-slate-900"
                }`}
              />
            </div>

            <button
              onClick={handleSavePassword}
              disabled={loading}
              className={`w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                theme === "dark"
                  ? "bg-gradient-to-r from-pink-400 to-pink-500 text-black hover:scale-105"
                  : "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:scale-105"
              } disabled:opacity-50`}
            >
              <FaLock /> Update Password
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className={`rounded-2xl p-6 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all border md:col-span-2 ${
          theme === "dark"
            ? "bg-white/5 border-white/10"
            : "bg-white/40 border-slate-300/30"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <FaPalette className={theme === "dark" ? "text-violet-400" : "text-violet-600"} />
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg" style={{
            backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
          }}>
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <FaMoon className="text-indigo-400 text-xl" />
              ) : (
                <FaSun className="text-yellow-500 text-xl" />
              )}
              <div>
                <p className="text-sm font-semibold">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </p>
                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-slate-600"}`}>
                  {theme === "dark" ? "Easy on the eyes" : "Bright and clear"}
                </p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full relative transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500"
                  : "bg-gradient-to-r from-yellow-400 to-orange-400"
              }`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${
                theme === "dark" ? "left-1" : "right-1"
              }`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-4 justify-end">
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all ${
            theme === "dark"
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-slate-300/30 text-slate-900 hover:bg-slate-300/50"
          } disabled:opacity-50`}
        >
          <FaSignOutAlt /> Logout
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all border ${
            theme === "dark"
              ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
              : "bg-red-500/20 text-red-600 border-red-600/30 hover:bg-red-500/30"
          } disabled:opacity-50`}
        >
          <FaTrash /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
